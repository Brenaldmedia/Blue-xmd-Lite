const { fetchJson } = require('../lib/functions2');

module.exports = {
    pattern: "deadpool",
    desc: "Create a Deadpool text effect",
    category: "logo",
    filename: __filename,
    use: ".deadpool text",

    execute: async (conn, mek, m, { from, args, reply }) => {
        try {
            if (!args.length) {
                return reply("❌ Please provide a name. Example: .deadpool Empire");
            }
            
            const name = args.join(" ");
            const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html&name=${encodeURIComponent(name)}`;
            const result = await fetchJson(apiUrl);

            if (!result?.result?.download_url) {
                return reply("❌ Failed to generate Deadpool effect.");
            }

            await conn.sendMessage(from, {
                image: { url: result.result.download_url },
                caption: "⚔️ Your Deadpool Text Effect"
            }, { quoted: mek });

        } catch (e) {
            return reply(`❌ Error: ${e.message}`);
        }
    }
};