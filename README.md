# Dhruv Kumar - Portfolio

Personal portfolio built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## The desktop session

`/desktop` runs the portfolio as a tiling window manager, in the browser. Press
`` ` `` anywhere on the home page to boot it.

- **Real tiling.** A dwindle layout: a binary split tree where every new window
  splits the focused one along its longer side, with directional focus, swaps,
  and ratio resizing (`lib/wm/layout.ts`).
- **Five workspaces**, floating windows, fullscreen, and a rofi-style launcher.
- **A shell** (`dksh`) over a virtual filesystem generated from `lib/site-config.ts`,
  so `cat ~/projects/solvo.md` reads the same content the site renders. It has
  tab completion, history, `neofetch`, `man dhruv`, and `hyprctl clients`
  listing the real live windows. The first terminal types its opening command
  by itself; any key hands control back.
- **nekopet**, the browser port of the Rust desktop pet: a canvas pinned above
  the windows with pointer events off, the same contract the real one gets from
  `wlr-layer-shell`. It walks, tracks the cursor, and sleeps when you stop moving.
- SUPER is bound to **Alt**, because browsers keep the real Super key.
- **Phones get the session, not a wall:** one window at a time plus a dock,
  since there are no keybinds to give them.
- `?open=projects,terminal` boots straight into an arrangement, so a link can
  point at the part of the session it is talking about.

`curl dhruvkumar.dev` from a terminal returns the résumé as ANSI text instead of
the HTML (`proxy.ts` + `lib/cli-resume.ts`).

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
  desktop/             the tiling window manager session
  projects/            case study pages (solvo, bunnys-cafe, nekopet, cipheros)
components/
  nav/                 site navigation
  sections/            page sections (hero, projects, work, stack, education, contact)
  github/              contribution graph
  desktop/             window manager shell, bar, launcher, terminal, nekopet
  ui/                  shared primitives (reveal, theme toggle, status bar, etc.)
lib/                   site content and data fetching helpers (spotify, wakatime, github)
  wm/                  layout tree, reducer, virtual filesystem, shell commands
proxy.ts               serves the ANSI résumé to curl, the site to browsers
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
