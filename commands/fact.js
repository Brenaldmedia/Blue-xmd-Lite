// === fact.js ===
const axios = require("axios");

module.exports = {
  pattern: "fact",
  desc: "🧠 Get a random fun fact",
  category: "fun",
  filename: __filename,
  use: ".fact",

  execute: async (conn, mek, m, { from, reply }) => {
    try {
      // Fetch a random fact from API
      const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
      const fact = response.data.text;

      if (!fact) {
        return reply("❌ Failed to fetch a fun fact. Please try again.");
      }

      // React with 🧠 to the command message
      await conn.sendMessage(from, {
        react: {
          text: "🧠",
          key: mek.key
        }
      });

      // Format fact message
      const factMessage = `🧠 *Random Fun Fact* 🧠\n\n${fact}\n\nIsn't that interesting? 😄\n\n> *© Powered by BLUE-XMD -LITE*`;

      // Send fact
      await conn.sendMessage(from, { text: factMessage }, { quoted: mek });

    } catch (error) {
      console.error("❌ Error in fact command:", error);
      return reply("⚠️ An error occurred while fetching a fun fact. Please try again later.");
    }
  }
};
