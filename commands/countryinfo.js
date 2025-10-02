// === countryinfo.js ===
const axios = require('axios');

module.exports = {
    pattern: "countryinfo",
    desc: "Get information about a country",
    category: "info",
    react: "🌍",
    filename: __filename,
    use: ".countryinfo Pakistan",

    execute: async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q) {
                return reply("Please provide a country name.\nExample: `.countryinfo Pakistan`");
            }

            const apiUrl = `https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(q)}`;
            const { data } = await axios.get(apiUrl);

            if (!data.status || !data.data) {
                return reply(`No information found for *${q}*. Please check the country name.`);
            }

            const info = data.data;
            let neighborsText = info.neighbors.length > 0
                ? info.neighbors.map(n => `🌍 *${n.name}*`).join(", ")
                : "No neighboring countries found.";

            const text = `🌍 *Country Information: ${info.name}* 🌍\n\n` +
                         `🏛 *Capital:* ${info.capital}\n` +
                         `📍 *Continent:* ${info.continent.name} ${info.continent.emoji}\n` +
                         `📞 *Phone Code:* ${info.phoneCode}\n` +
                         `📏 *Area:* ${info.area.squareKilometers} km² (${info.area.squareMiles} mi²)\n` +
                         `🚗 *Driving Side:* ${info.drivingSide}\n` +
                         `💱 *Currency:* ${info.currency}\n` +
                         `🔤 *Languages:* ${info.languages.native.join(", ")}\n` +
                         `🌟 *Famous For:* ${info.famousFor}\n` +
                         `🌍 *ISO Codes:* ${info.isoCode.alpha2.toUpperCase()}, ${info.isoCode.alpha3.toUpperCase()}\n` +
                         `🌎 *Internet TLD:* ${info.internetTLD}\n\n` +
                         `🔗 *Neighbors:* ${neighborsText}\n\n` +
                         `> *© Powered By BLUE-XMD -LITE*`;

            // Send reaction
            await conn.sendMessage(from, {
                react: {
                    text: "🌍",
                    key: mek.key
                }
            });

            await conn.sendMessage(from, {
                image: { url: info.flag },
                caption: text
            }, { quoted: mek });

        } catch (e) {
            console.error("Error in countryinfo command:", e);
            reply("An error occurred while fetching country information.");
        }
    }
};