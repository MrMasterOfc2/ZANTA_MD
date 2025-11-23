const { cmd } = require("../command");
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// Helper function to convert Media Stream to a Buffer
async function streamToBuffer (stream) {
    return new Promise((resolve, reject) => {
        const buffers = [];
        stream.on('error', reject)
              .on('data', (data) => buffers.push(data))
              .on('end', () => resolve(Buffer.concat(buffers)))
    })
}

cmd(
    {
        pattern: "save",
        react: "✅", 
        desc: "Resend Status or One-Time View Media",
        category: "general",
        filename: __filename,
    },
    async (
        zanta,
        mek,
        m,
        {
            from,
            quoted,
            reply,
        }
    ) => {
        try {
            if (!m.quoted) {
                return reply("*කරුණාකර Status/Media Message එකකට reply කරන්න!* 🧐");
            }
            
            // Note: We expect mek.quoted.message to be injected with the full status message 
            // from the index.js core fix.
            const mediaObject = m.quoted.message;
            let saveCaption = "*💾 Saved and Resent!*";
            
            if (!mediaObject) {
                return reply("*⚠️ Media Content එක හඳුනාගැනීමට අසමත් විය.*");
            }
            
            // 1. Media Type එක තීරණය කිරීම
            const messageType = Object.keys(mediaObject).find(key => key.endsWith('Message'));

            if (!messageType) {
                 return reply("*⚠️ හඳුනාගත් Media Content එකක් හමු නොවේ.*");
            }

            // 2. Media File Download (Native Baileys Method භාවිතයෙන්)
            reply("*Status Media File එක Download කරමින්...* ⏳");
            
            const mediaObjectToDownload = mediaObject[messageType];
            const downloadType = messageType.replace('Message', '');
            
            // Decryption සහ Download සඳහා Stream ලබා ගැනීම
            const stream = await downloadContentFromMessage(
                mediaObjectToDownload,
                downloadType
            );
            
            // Stream එක Buffer එකක් බවට පරිවර්තනය කිරීම
            const mediaBuffer = await streamToBuffer(stream);
            
            // 3. Message Options සැකසීම සහ යැවීම
            let messageOptions = {};
            
            if (downloadType === 'image') {
                messageOptions = { image: mediaBuffer, caption: saveCaption };
            } else if (downloadType === 'video') {
                messageOptions = { video: mediaBuffer, caption: saveCaption };
            } else if (downloadType === 'document') {
                const mediaData = mediaObjectToDownload;
                messageOptions = { 
                    document: mediaBuffer, 
                    fileName: mediaData.fileName || 'saved_media', 
                    mimetype: mediaData.mimetype, 
                    caption: saveCaption 
                };
            } else {
                 return reply("*⚠️ යැවීමට සහය නොදක්වන Media Type එකක්.*");
            }
            
            await zanta.sendMessage(from, messageOptions, { quoted: mek });

            return reply("*වැඩේ හරි 💯✅*");

        } catch (e) {
            console.error("--- FINAL STATUS DOWNLOAD FAILURE ---", e);
            reply(`*🚨 Error:* ${e.message || e}. (Key Missing නම්, Core Fix අසාර්ථකයි)`);
        }
    }
);
