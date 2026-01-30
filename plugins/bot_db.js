const mongoose = require('mongoose');
const config = require('../config');

const MONGO_URI = 'mongodb+srv://Zanta-MD:Akashkavindu12345@cluster0.y7xsqsi.mongodb.net/?appName=Cluster0';
const OWNER_KEY = config.OWNER_NUMBER;

const SettingsSchema = new mongoose.Schema({
    id: { type: String, default: OWNER_KEY, unique: true },
    botName: { type: String, default: config.DEFAULT_BOT_NAME },
    ownerName: { type: String, default: config.DEFAULT_OWNER_NAME },
    prefix: { type: String, default: config.DEFAULT_PREFIX },
    autoRead: { type: String, default: 'false' },
    autoTyping: { type: String, default: 'false' },
    autoStatusSeen: { type: String, default: 'true' },
    alwaysOnline: { type: String, default: 'false' },
    readCmd: { type: String, default: 'false' },
    antiBadword: { type: String, default: 'false' },
    autoVoice: { type: String, default: 'false' }
});

const Settings = mongoose.model('Settings', SettingsSchema);
let isConnected = false;

// MongoDB සම්බන්ධතාවය
async function connectDB() {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('✅ MongoDB Already Connected!');
            return;
        }

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        isConnected = true;
        console.log('✅ MongoDB Connected!');
    } catch (error) {
        console.error('❌ MongoDB Error:', error);
        throw error;
    }
}

// බොට් සැකසුම් ලබා ගැනීම
async function getBotSettings() {
    try {
        let settings = await Settings.findOne({ id: OWNER_KEY });
        
        if (!settings) {
            settings = await Settings.create({
                id: OWNER_KEY,
                botName: config.DEFAULT_BOT_NAME,
                ownerName: config.DEFAULT_OWNER_NAME,
                prefix: config.DEFAULT_PREFIX,
                autoRead: 'false',
                autoTyping: 'false',
                autoStatusSeen: 'true',
                alwaysOnline: 'false',
                readCmd: 'false',
                antiBadword: 'false',
                autoVoice: 'false'
            });
            console.log('[DB] Created settings profile for:', OWNER_KEY);
        }
        
        return settings.toObject();
    } catch (error) {
        console.error('[DB] Fetch Error:', error);
        throw error;
    }
}

// සැකසුම් යාවත්කාලීන කිරීම
async function updateSetting(key, value) {
    try {
        const result = await Settings.findOneAndUpdate(
            { id: OWNER_KEY },
            { $set: { [key]: value } },
            { new: true, upsert: true }
        );
        return result;
    } catch (error) {
        console.error('[DB] Update Error (' + key + '):', error);
        throw error;
    }
}

module.exports = {
    connectDB,
    getBotSettings,
    updateSetting
};
