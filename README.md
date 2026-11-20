# Mono — TIDAL music player starter

A dark, minimal music-player interface inspired by the general design direction of Monochrome. Independent project; not affiliated with Monochrome or TIDAL.

## Features
- Responsive dark interface and light-theme toggle
- TIDAL catalogue search via official developer API
- Track results with metadata
- Official TIDAL embedded player on track selection
- Basic queue and recently played list

## TIDAL limitations
This project uses TIDAL's official API and embed player. It does not scrape private endpoints, extract audio URLs, download tracks, or bypass subscription checks. TIDAL determines whether a track can play and what account/subscription is required. Full-length playback may require app approval, user authorization, and an eligible TIDAL account. The included client-credentials flow is for catalogue search and does not itself grant full-length user playback.

## Setup
1. Install Node.js 20 or newer.
2. Create an app at https://developer.tidal.com/.
3. Copy `.env.example` to `.env` and add your credentials.
4. Run `npm install` then `npm run dev`.
5. Open http://localhost:3000.

Never commit `.env` or expose your client secret in frontend code.

## References
- https://developer.tidal.com/
- https://tidal-music.github.io/tidal-api-reference/
- https://tidal-music.github.io/tidal-sdk-web/
