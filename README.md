# JINX Pilot Service

React + Vite site for JINX's Mobile Legends pilot service (Kagura main).

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Edit
- Contact links: `src/config.js`
- Rates / rank math: `src/lib/pricing.js` (`BRACKETS`) — the rate cards and calculator both read from it
- Themes (Kagura skins): `src/themes.js` — names, types, colors; splash art in `public/themes/`

## Project structure
```
src/
  App.jsx                 page layout
  components/             Navbar, Hero, Rates, Calculator, HowItWorks, WhyUs, Faq, Contact, Footer, Toast
  components/calculator/  RankPicker, Stepper, SpamOptions, Summary, StickyTotal
  lib/pricing.js          rates + price computation
  hooks/useReveal.js      scroll reveal animation
```

## Deploy to Vercel
- Dashboard: push to GitHub → vercel.com → Add New → Project → import the repo. Vercel auto-detects Vite (build `npm run build`, output `dist`). Click Deploy.
- CLI: `npm i -g vercel` then `vercel --prod` in this folder.

## Theme splash art
All 11 splash arts are in `public/themes/` (the 2 painted skins reuse their base skin's art).
To replace or add one: save it as `public/themes/<theme id>.jpg`, run `npm run themes:optimize`, and (for a new theme) copy an entry in `src/themes.js`.
Theme options: `palette` colors, `pos` / `posMobile` framing, `align: "right"` when Kagura stands on the left of the art, `word` for the hero headline.

## Site visit counter
Shown in the footer. Counts one visit per browser session, using `api/visits.js` (a Vercel Function) and a free Upstash Redis database.

Setup (one time): Vercel project → **Storage** → **Create Database** → **Upstash for Redis** (free plan) → connect it to this project → redeploy.
The counter stays hidden until the database is connected, and it doesn't run under `npm run dev` (use `npx vercel dev` to test locally).
