# Dhruv Kumar - Portfolio

Personal portfolio built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** for animation
- **Upstash Redis** for the visitor counter and Spotify status cache
- **Spotify API** for the live/last-played track in the status bar
- **WakaTime API** for the live coding status in the status bar
- GitHub's public contribution API for the live shipping log

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the credentials below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To get a Spotify refresh token, run `node scripts/spotify-auth.mjs <client_id> <client_secret>`
and follow the printed URL; it prints `SPOTIFY_REFRESH_TOKEN` on callback.

## Project structure

```
app/                  routes, layouts, metadata, API routes
  api/status/          music + coding status endpoint (Spotify, WakaTime, Redis-cached)
  api/visitor/         visitor counter endpoint (Upstash Redis)
  projects/            case study pages (solvo, bunnys-cafe, nekopet, cipheros)
components/
  nav/                 site navigation
  sections/            page sections (hero, projects, work, stack, education, contact)
  github/              contribution graph
  ui/                  shared primitives (reveal, theme toggle, status bar, etc.)
lib/                   site content and data fetching helpers (spotify, wakatime, github)
scripts/               one-off setup scripts (spotify-auth)
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint for the visitor counter and Spotify status cache |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `SPOTIFY_CLIENT_ID` | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret |
| `SPOTIFY_REFRESH_TOKEN` | Spotify refresh token, from `scripts/spotify-auth.mjs` |
| `WAKATIME_API_KEY` | WakaTime API key for the live coding status |

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm start        # run production build
npm run lint     # eslint
```
