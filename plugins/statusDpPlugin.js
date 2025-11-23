const { cmd } = require("../command");
const fs = require("fs");

cmd(
  {
    pattern: "save",
    react: "💾",
    desc: "Save replied photo/video or status",
    category: "media",
    filename: __filename,
  },
  async (
    zanta,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      let mediaMessage = null;

      // If the command is a reply to a photo/video
      if (quoted?.imageMessage || quoted?.videoMessage) {
        mediaMessage = quoted.imageMessage || quoted.videoMessage;
      }

      if (!mediaMessage) return reply("❌ *No media found to save!*");

      // Download media
      const buffer = await zanta.downloadMediaMessage({ message: mediaMessage });

      // Save locally
      if (!fs.existsSync("./downloads")) fs.mkdirSync("./downloads");
      const ext = mediaMessage.videoMessage ? ".mp4" : ".jpg";
      const fileName = `./downloads/${senderNumber}${ext}`;
      fs.writeFileSync(fileName, buffer);

      // Send back to WhatsApp chat
      if (mediaMessage.videoMessage) {
        await zanta.sendMessage(from, { video: buffer, caption: `Saved video as ${fileName}` }, { quoted: mek });
      } else {
        await zanta.sendMessage(from, { image: buffer, caption: `Saved image as ${fileName}` }, { quoted: mek });
      }

      return reply("✅ Media saved successfully!");
    } catch (e) {
      console.log(e);
      return reply(`❌ *Error:* ${e.message}`);
    }
  }
);

// ----------------------------
// .getdp command
// ----------------------------
cmd(
  {
    pattern: "getdp",
    react: "🖼️",
    desc: "Get contact profile picture",
    category: "media",
    filename: __filename,
  },
  async (
    zanta,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      sender,
      senderNumber,
      reply,
    }
  ) => {
    try {
      const url = await zanta.profilePictureUrl(senderNumber + "@s.whatsapp.net", "image");
      await zanta.sendMessage(from, { image: { url }, caption: "Here is the profile picture." }, { quoted: mek });
    } catch (e) {
      console.log(e);
      return reply("❌ Could not fetch profile picture.");
    }
  }
);
