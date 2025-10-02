const { fetchJson } = require('../lib/functions2');

module.exports = {
    pattern: "dragonball",
    desc: "Create a Dragon Ball style text effect",
    category: "logo",
    filename: __filename,
    use: ".dragonball text",

    execute: async (conn, mek, m, { from, args, reply }) => {
        try {
            if (!args.length) {
                return reply("❌ Please provide a name. Example: .dragonball Empire");
            }
            
            const name = args.join(" ");
            const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html&name=${encodeURIComponent(name)}`;
            const result = await fetchJson(apiUrl);

            if (!result?.result?.download_url) {
                return reply("❌ Failed to generate Dragon Ball effect.");
            }

            await conn.sendMessage(from, {
                image: { url: result.result.download_url },
                caption: "🐉 Your Dragon Ball Text Effect"
            }, { quoted: mek });

        } catch (e) {
            return reply(`❌ Error: ${e.message}`);
        }
    }
};