const { fetchJson } = require('../lib/functions2');

module.exports = {
    pattern: "3dcomic",
    desc: "Create a 3D Comic-style text effect",
    category: "logo",
    filename: __filename,
    use: ".3dcomic text",

    execute: async (conn, mek, m, { from, args, reply }) => {
        try {
            if (!args.length) {
                return reply("❌ Please provide a name. Example: .3dcomic Empire");
            }
            
            const name = args.join(" ");
            const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html&name=${encodeURIComponent(name)}`;
            const result = await fetchJson(apiUrl);

            if (!result?.result?.download_url) {
                return reply("❌ Failed to generate 3D comic effect.");
            }

            await conn.sendMessage(from, {
                image: { url: result.result.download_url },
                caption: "🎨 Your 3D Comic Text Effect"
            }, { quoted: mek });

        } catch (e) {
            return reply(`❌ Error: ${e.message}`);
        }
    }
};