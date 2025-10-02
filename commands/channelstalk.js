// === channelstalk.js ===
const axios = require("axios");

module.exports = {
  pattern: "channelstalk",
  desc: "🔍 Get WhatsApp channel information (via Toxxic API)",
  category: "utility",
  filename: __filename,
  use: ".channelstalk <channel_url>",

  execute: async (conn, mek, m, { from, reply, args }) => {
    try {
      if (!args || args.length === 0) {
        return reply(
          "❌ Please provide a WhatsApp channel URL\n\nExample:\n.channelstalk https://whatsapp.com/channel/0029VbBbyKp6LwHs43k6Om1V"
        );
      }

      const urlText = args.join(" ").trim();

      if (!/whatsapp\.com\/channel\//i.test(urlText)) {
        return reply(
          "❌ Invalid WhatsApp channel URL.\n\nExample:\nhttps://whatsapp.com/channel/0029VbBbyKp6LwHs43k6Om1V"
        );
      }

      // React with 🔍 to the command
      await conn.sendMessage(from, {
        react: {
          text: "🔍",
          key: mek.key
        }
      });

      await reply("🔍 Fetching channel information...");

      const apiUrl = `https://api-toxxic.zone.id/api/stalker/wachannel?url=${encodeURIComponent(urlText)}`;
      const response = await axios.get(apiUrl, { timeout: 20000 });

      const data = response.data?.data;
      if (!data) {
        return reply("❌ Could not fetch channel information right now. Please try again later.");
      }

      // Extract channel info
      const channelTitle = data.channelName || "Unknown";
      const channelFollowers = data.followers || "Unknown";
      const channelDesc = data.status
        ? (typeof data.status === "string"
            ? data.status.substring(0, 200) + (data.status.length > 200 ? "..." : "")
            : "No description")
        : "No description";

      const channelInfo = `╭━━〔 *WHATSAPP CHANNEL INFO* 〕━━┈⊷
┃ ◈ *📢 Title*: ${channelTitle}
┃ ◈ *👥 Followers*: ${channelFollowers}
┃ ◈ *📝 Description*: ${channelDesc}
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by BLUE-XMD -LITE`;

      await conn.sendMessage(from, { text: channelInfo }, { quoted: mek });

    } catch (e) {
      console.error("Error in channelstalk command:", e);
      reply(`❌ Error: ${e.response?.data?.message || e.message || "Unknown error occurred"}`);
    }
  }
};
