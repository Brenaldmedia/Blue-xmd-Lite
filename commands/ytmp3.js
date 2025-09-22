const axios = require("axios");

module.exports = {
    pattern: "play",
    desc: "Search and download Spotify/YouTube tracks as playable audio",
    react: "🎧",
    category: "music",
    filename: __filename,

    execute: async (conn, mek, m, { from, args, q, reply }) => {
        // Helper function to send messages with contextInfo
        const sendMessageWithContext = async (text, quoted = mek) => {
            return await conn.sendMessage(from, {
                text: text,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363401559573199@newsletter",
                        newsletterName: "BrenaldMedia",
                        serverMessageId: 200
                    }
                }
            }, { quoted: quoted });
        };

        try {
            const query = q || args.join(" ");
            if (!query) {
                return await sendMessageWithContext(
`❎ Please provide a song name or link.

📌 Examples:
.play metamorphosis
.play https://open.spotify.com/track/2ksyzVfU0WJoBpu8otr4pz`);
            }

            // React 🎧
            if (module.exports.react) {
                await conn.sendMessage(from, { react: { text: module.exports.react, key: mek.key } });
            }

            let audioData = null;
            let apiUsed = null;

            // If direct Spotify link
            if (query.includes("spotify.com/track/")) {
                await sendMessageWithContext("🎶 Downloading track from Spotify... Please wait.");

                try {
                    const api = `https://api.princetechn.com/api/download/spotifydl?apikey=prince&url=${encodeURIComponent(query)}`;
                    const { data } = await axios.get(api, { timeout: 20000 });

                    if (data?.result?.download_url) {
                        audioData = data.result;
                        apiUsed = "PrinceTech";
                    }
                } catch {}
            }

            // If search term or fallback
            if (!audioData) {
                await sendMessageWithContext(`🔎 Searching for: *${query}* ...`);

                // First try PrinceTech search
                try {
                    const api = `https://api.princetechn.com/api/search/spotifysearch?apikey=prince&query=${encodeURIComponent(query)}`;
                    const { data } = await axios.get(api, { timeout: 20000 });

                    if (data?.results?.length) {
                        const first = data.results[0];
                        const dlApi = `https://api.princetechn.com/api/download/spotifydl?apikey=prince&url=${encodeURIComponent(first.url)}`;
                        const { data: dlData } = await axios.get(dlApi, { timeout: 20000 });

                        if (dlData?.result?.download_url) {
                            audioData = dlData.result;
                            apiUsed = "PrinceTech";
                        }
                    }
                } catch {}
            }

            // Fallback to David Cyril
            if (!audioData) {
                try {
                    const api = `https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(query)}&apikey=`;
                    const { data } = await axios.get(api, { timeout: 20000 });

                    if (data?.success && data?.DownloadLink) {
                        audioData = {
                            download_url: data.DownloadLink,
                            title: data.title,
                            duration: data.duration,
                            thumbnail: data.thumbnail,
                            channel: data.channel
                        };
                        apiUsed = "David Cyril";
                    }
                } catch {}
            }

            if (!audioData) return await sendMessageWithContext("❌ Failed to fetch audio from all APIs.");

            const { download_url, title, duration, thumbnail, channel } = audioData;

            const caption = `🎵 *Track Info*\n\n` +
                            `📖 *Title:* ${title || "Unknown"}\n` +
                            `👤 *Artist/Channel:* ${channel || "Unknown"}\n` +
                            `⏱️ *Duration:* ${duration || "Unknown"}\n\n` +
                            `> Powered By BrenaldMedia`;

            let thumbBuffer;
            if (thumbnail) {
                try {
                    const res = await axios.get(thumbnail, { responseType: "arraybuffer" });
                    thumbBuffer = Buffer.from(res.data);
                } catch {}
            }

            await conn.sendMessage(from, {
                audio: { url: download_url },
                mimetype: "audio/mpeg",
                fileName: `${title || "audio"}.mp3`,
                caption: caption,
                jpegThumbnail: thumbBuffer,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363401559573199@newsletter",
                        newsletterName: "BrenaldMedia",
                        serverMessageId: 200
                    }
                }
            }, { quoted: mek });

        } catch (e) {
            console.error("❌ Play Command Error:", e.response?.data || e.message);
            await sendMessageWithContext(`⚠️ Error: ${e.message}`);
        }
    }
};