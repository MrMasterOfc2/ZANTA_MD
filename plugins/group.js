const checkAdminRights = async (zanta, from, reply, isGroup, isAdmins, mek, m) => {
    if (!isGroup) {
        reply("*This command can only be used in a Group!* 🙁");
        return false;
    }

    try {
        let groupMeta = await zanta.groupMetadata(from);
        const botJid = zanta.user.id;
        const senderJid = m.sender; 
        
        const admins = groupMeta.participants.filter(p => p.admin !== null).map(p => p.id);
        const isBotAdminNew = admins.includes(botJid);
        const isUserAdminNew = admins.includes(senderJid);

        if (!isBotAdminNew) {
            // නිවැරදිව Bot Admin නොවේ නම් පමණක් නවත්වන්න
            reply("*I need to be an Admin in this group to use this command!* 🤖❌");
            return false;
        }

        if (!isUserAdminNew) {
            // නිවැරදිව User Admin නොවේ නම් පමණක් නවත්වන්න
            reply("*You must be an Admin to use Group Management commands!* 👮‍♂️❌");
            return false;
        }
        
        // Bot Admin සහ User Admin තහවුරුයි - TRUE යවන්න
        return true; 
        
    } catch (e) {
        console.error("Error fetching Group Metadata for Admin check:", e);
        reply("*Error:* Failed to check admin status. Please try again. 😔");
        return false;
    }
};

// --- Command එක තුළ වෙනසක් නැහැ (එය දැනටමත් checkAdminRights භාවිතා කරයි) ---
// ... (Kick, Promote, Demote commands) ...
