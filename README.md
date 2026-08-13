# Dhruv Kumar - Portfolio

Personal portfolio built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** for animation
- **Upstash Redis** for the visitor counter
- GitHub's public contribution API for the live shipping log

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Upstash Redis credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/                  routes, layouts, metadata, API routes
  api/visitor/         visitor counter endpoint (Upstash Redis)
  projects/solvo/       case study page
components/
  nav/                 site navigation
  sections/            page sections (hero, projects, work, stack, education, contact)
  github/              contribution graph
  ui/                  shared primitives (reveal, theme toggle, copy button, etc.)
lib/                   site content and data fetching helpers
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint for the visitor counter |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm start        # run production build
npm run lint     # eslint
```
