import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));

let cachedToken = null;
let tokenExpiresAt = 0;
async function getTidalToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) return cachedToken;
  const { TIDAL_CLIENT_ID: id, TIDAL_CLIENT_SECRET: secret } = process.env;
  if (!id || !secret) { const e = new Error("Add TIDAL_CLIENT_ID and TIDAL_CLIENT_SECRET to your .env file."); e.status = 503; throw e; }
  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const response = await fetch("https://auth.tidal.com/v1/oauth2/token", { method: "POST", headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "client_credentials" }) });
  const data = await response.json();
  if (!response.ok) { const e = new Error(data.error_description || data.error || "TIDAL authentication failed."); e.status = response.status; throw e; }
  cachedToken = data.access_token; tokenExpiresAt = Date.now() + Number(data.expires_in || 3600) * 1000; return cachedToken;
}
app.get("/api/search", async (req, res) => {
  const query = String(req.query.q || "").trim();
  if (!query) return res.json({ tracks: [] });
  if (query.length > 120) return res.status(400).json({ error: "Search is too long." });
  try {
    const token = await getTidalToken();
    const url = new URL("https://openapi.tidal.com/v2/searchResults");
    url.searchParams.set("query", query); url.searchParams.set("countryCode", "US"); url.searchParams.set("include", "tracks");
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, accept: "application/vnd.api+json" } });
    const payload = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: payload.errors?.[0]?.detail || "TIDAL search request failed." });
    const included = Array.isArray(payload.included) ? payload.included : [];
    const tracks = included.filter(item => item.type === "tracks").slice(0, 20).map(item => {
      const a = item.attributes || {};
      return { id: item.id, title: a.title || "Untitled track", artist: a.artistName || a.artists?.map(x => x.name).join(", ") || "Unknown artist", album: a.albumTitle || "", duration: a.duration || null, cover: a.imageCover || a.cover || null, tidalUrl: `https://tidal.com/browse/track/${encodeURIComponent(item.id)}` };
    });
    res.json({ tracks, message: tracks.length ? "" : "No track results were returned. Check your TIDAL app access and API permissions." });
  } catch (error) { res.status(error.status || 500).json({ error: error.message || "Unexpected server error." }); }
});
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`Mono is running at http://localhost:${PORT}`));
