const { fetchJson } = require('../lib/functions2');

module.exports = {
    pattern: "luxury",
    desc: "Create a Luxury text effect",
    category: "logo",
    filename: __filename,
    use: ".luxury text",

    execute: async (conn, mek, m, { from, args, reply }) => {
        try {
            if (!args.length) {
                return reply("❌ Please provide a name. Example: .luxury Empire");
            }
            
            const name = args.join(" ");
            const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/floral-luxury-logo-collection-for-branding-616.html&name=${encodeURIComponent(name)}`;
            const result = await fetchJson(apiUrl);

            if (!result?.result?.download_url) {
                return reply("❌ Failed to generate luxury effect.");
            }

            await conn.sendMessage(from, {
                image: { url: result.result.download_url },
                caption: "💎 Your Luxury Text Effect"
            }, { quoted: mek });

        } catch (e) {
            return reply(`❌ Error: ${e.message}`);
        }
    }
};