# ✦ Frostbite — Sovereign Physical & Digital Gold

> **Live commodity intelligence platform** · Real-time gold spot pricing · Physical bullion custody · Community fundraiser event system

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://frostbite-taupe.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-samuelmichaelalva%2Ffrostbite-181717?logo=github)](https://github.com/samuelmichaelalva/frostbite)
[![HackInHills '26](https://img.shields.io/badge/HackInHills-'26%20Prototype-dfb260?style=flat)](https://frostbite-taupe.vercel.app)

---

## 🌐 Live Demo

**[frostbite-taupe.vercel.app](https://frostbite-taupe.vercel.app)**

---

## 📖 What Is Frostbite?

Frostbite is a **real-time gold & precious metals intelligence platform** combined with a **community fundraiser event hub**. It was built as a HackInHills '26 prototype to demonstrate:

- Live commodity spot price integration (no paid API key required)
- Institutional-grade UI/UX for physical gold custody and allocation
- A full community event registration system
- Responsive, production-ready frontend architecture deployed on Vercel

---

## 🗂️ Pages & Features

### 1. 🏠 Home
- Cinematic full-bleed hero with gold iceberg visual (sliced from Figma mockup using Python + Pillow)
- **Live gold price badge** — real-time calculation: `$30,000 ÷ spot price = troy oz equivalent`
- Mouse-follow ambient glow using `pointermove` + CSS `radial-gradient`
- 3D card tilt physics using `perspective()` + `rotateX/rotateY` CSS transforms
- Newsletter subscription form with local storage persistence and optional Resend email delivery

### 2. 🏛️ Reserves
- Institutional physical gold custody information (999.9 LBMA standard, Zurich & Singapore vaults)
- Three-pillar card layout: Purity · Direct Ownership · Instant Liquidity
- Shared allocation modal reused across all pages

### 3. 📈 Market Live *(Core Feature)*
- **4 live commodity prices**: Gold (XAU), Silver (XAG), Platinum (XPT), Palladium (XPD)
- **Gold price source**: Binance public API — `PAXGUSDT` ticker (PAXG is a 1:1 physical gold-backed token, no API key required)
- **Silver/Platinum/Palladium**: Derived in real-time using historical market ratios (Au:Ag ≈ 85:1, Au:Pt ≈ 2.8:1, Au:Pd ≈ 2.6:1)
- **Auto-refresh**: every 45 seconds via `setInterval`
- **Live timestamp**: exact time of last successful data fetch
- **Gold Value Calculator**: interactive — enter any USD amount → live troy oz + gram conversion
- Graceful fallback chain: Browser → Binance → Vercel `/api/gold` → hardcoded baseline

### 4. 🏃 Event
- Race day hub for **Frostbite: Running For Change** — May 12, 2025
- Location: Green Bay Trail, Glencoe, IL · 6AM–NOON
- Full event schedule timeline: Sunrise Start → Community Stride → Partner Showcase → Community Celebration
- Registration modal (smart context-switching: shows race options on Event page, gold options on all other pages)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+) |
| **Fonts** | Google Fonts — Syne (display), Plus Jakarta Sans (body), Space Mono (data) |
| **Images** | Original Figma exports sliced with Python + Pillow → converted to WebP |
| **Live Data** | Binance Public REST API (`PAXGUSDT` ticker) |
| **Backend** | Vercel Serverless Functions (Node.js) |
| **Email** | Resend API (optional — requires `RESEND_API_KEY` env var) |
| **Database** | Supabase (optional — requires `SUPABASE_URL` + `SUPABASE_KEY` env vars) |
| **Hosting** | Vercel (free tier) |
| **Version Control** | GitHub |

---

## 🏗️ Project Structure

```
frostbite/
├── index.html          # Main SPA — all 4 views (Home, Reserves, Market, Event)
├── style.css           # Design system — tokens, components, animations
├── app.js              # All JS logic — routing, live data, forms, animations
├── login.html          # Research Desk Access portal (auth UI)
├── vercel.json         # Vercel routing config
├── api/
│   ├── gold.js         # Serverless: live gold price (GoldAPI + Binance fallback)
│   ├── register.js     # Serverless: allocation/event registration handler
│   └── subscribe.js    # Serverless: newsletter subscription + Resend email
├── assets/             # Optimised WebP image assets (sliced from Figma)
└── images/             # Full images (login page, reference photos)
```

---

## ⚡ Single-Page App Architecture

Frostbite is a **zero-framework SPA**:
- All 4 pages live inside one `index.html` as `<div class="view-panel">`
- Navigation uses `data-target` attributes → `switchView()` JS function
- View transitions via CSS `opacity + translateY` with `cubic-bezier(.16, 1, .3, 1)`
- No page reloads, no router library — pure DOM toggling

---

## 🚀 Running Locally

```bash
# Clone the repo
git clone https://github.com/samuelmichaelalva/frostbite.git
cd frostbite

# Option 1: Python server
python -m http.server 8000

# Option 2: Node.js
npx -y serve .

# Option 3: Vercel CLI (recommended — enables serverless API routes)
npx -y vercel dev
```

Then open `http://localhost:8000` (or the Vercel dev URL).

---

## 🔑 Environment Variables (Vercel)

Set these in your Vercel project dashboard for full functionality:

| Variable | Purpose | Required? |
|---|---|---|
| `GOLD_API_KEY` | GoldAPI.io key for premium gold data | Optional (Binance fallback works without it) |
| `RESEND_API_KEY` | Resend.com key for transactional emails | Optional (forms save locally without it) |
| `SUPABASE_URL` | Supabase project URL | Optional |
| `SUPABASE_KEY` | Supabase anon key | Optional |

> Without any env vars, the site works fully — gold price fetches live from Binance and form data is persisted to `localStorage`.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#070809` |
| Card Surface | `#121316` |
| Gold | `#dfb260` |
| Gold Glow | `rgba(223, 178, 96, 0.18)` |
| Text Primary | `#f0f2f5` |
| Text Dim | `#9aa0a6` |
| Border | `rgba(255, 255, 255, 0.08)` |

**Animations**: all use `cubic-bezier(.16, 1, .3, 1)` — a spring-physics easing curve for butter-smooth feel.

---

## ⚠️ Prototype Notes

- **Live gold data is real** — pulled from Binance public API in real time
- **Purchases are not real** — this is a frontend prototype; no actual transactions occur
- **Emails only send** if `RESEND_API_KEY` is configured on Vercel
- All form submissions fall back gracefully to `localStorage` if no backend is configured

---

## 👤 Author

**Samuel Michael Alva**  
HackInHills '26 · Frostbite Project  
[github.com/samuelmichaelalva](https://github.com/samuelmichaelalva)
