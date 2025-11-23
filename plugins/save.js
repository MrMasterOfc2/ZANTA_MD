const { cmd } = require("../command");

cmd(
    {
        pattern: "save",
        react: "✅", 
        desc: "Resend Status or One-Time View Media (Final FIX: Using sendMessage)",
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
            if (!quoted) {
                return reply("*කරුණාකර Status/Media Message එකකට reply කරන්න!* 🧐");
            }

            // Media Data එක ලබා ගැනීම (පෙර log එක අනුව)
            let mediaObject = quoted.quoted || quoted.fakeObj;
            let saveCaption = "*💾 Saved and Resent!*";
            
            if (!mediaObject) {
                return reply("*⚠️ Media Content එක හඳුනාගැනීමට අසමත් විය. (Media Data නැත)*");
            }

            // 1. Media Type එක තීරණය කිරීම
            const messageType = Object.keys(mediaObject)[0];
            const mediaData = mediaObject[messageType];
            
            // 2. Message Options සැකසීම (zanta.sendMessage සඳහා)
            let messageOptions = {};
            
            // 3. Media Type එකට අනුව Options සකස් කිරීම
            if (messageType === 'imageMessage') {
                messageOptions = { image: { url: mediaData.url || mediaData.directPath }, caption: saveCaption };
            } else if (messageType === 'videoMessage') {
                messageOptions = { video: { url: mediaData.url || mediaData.directPath }, caption: saveCaption };
            } else if (messageType === 'documentMessage') {
                messageOptions = { document: { url: mediaData.url || mediaData.directPath }, fileName: mediaData.fileName, mimetype: mediaData.mimetype };
            } else {
                 return reply("*⚠️ හඳුනාගත් Media Type එක යැවීමට සහය නොදක්වයි. (Image, Video, Document පමණි)*");
            }

            // 4. Message යැවීම (zanta.sendMessage භාවිතයෙන්)
            await zanta.sendMessage(from, messageOptions, { quoted: mek });

            return reply("*වැඩේ හරි 🙃✅*");

        } catch (e) {
            console.error(e);
            reply(`*Error saving media:* ${e.message || e}`);
        }
    }
);
