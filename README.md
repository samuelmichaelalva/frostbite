# Frostbite

Frostbite is a single-page web application developed as a hackathon prototype for HackInHills 2026. The platform integrates real-time commodity pricing intelligence with physical bullion custody education and a community event management interface.

---

## 1. Overview

Frostbite explores the intersection of commodity asset intelligence and public fundraising. The application operates as a lightweight, zero-framework Single Page Application (SPA) designed to solve two core challenges:

1. **Commodity Intelligence**: Providing real-time precious metals valuation without requiring paid API gateway subscriptions by leveraging open public market feeds.
2. **Community Engagement**: Offering an integrated registration and allocation portal that shifts context dynamically between bullion acquisition inquiries and community charity run participation.

The project demonstrates a production-grade frontend architecture running on static hosting with optional serverless backend integrations for cloud data persistence and automated email dispatch.

---

## 2. Problem & Solution

### Problem
- **Access Barriers in Commodity Data**: Real-time precious metals feeds (Gold, Silver, Platinum, Palladium) typically require paid API keys, imposing high cost and configuration barriers for early prototypes and academic research interfaces.
- **Pricing and Fineness Confusion**: Retail buyers and researchers face opacity across varying asset fineness standards (such as 995.0 vs 999.0 purity), differing quotation units (troy ounces vs grams), and dynamic conversion ratios.
- **Fragmented User Experiences**: Fundraisers and asset stewardship initiatives frequently operate on disparate platforms, separating asset tracking from community registration workflows.

### Solution
- **Keyless Public Feeds**: Frostbite queries the public Binance REST API for `PAXGUSDT` (PAX Gold, a token backed 1:1 by fine physical troy ounces of LBMA-certified gold), obtaining real-time spot quotes without requiring authentication or API keys.
- **Derived Precious Metals Tracking**: Derives estimates for Silver, Platinum, and Palladium in real time using established mathematical market ratios relative to live gold spot prices.
- **Unified Responsive SPA**: Delivers a zero-framework interface with dual-context modals, instant metric recalculations, local-first offline fallback storage, and optional cloud serverless synchronization.

---

## 3. Key Features

- **Live Commodity Spot Pricing**:
  - Direct client-side polling of the Binance `PAXGUSDT` 24-hour ticker feed.
  - Automatic fallback to an internal serverless endpoint (`/api/gold`) if browser-level external requests are restricted.
  - Periodic auto-refresh every 45 seconds via `setInterval`.
  - Client-side timestamp indicator reporting exact fetch time and live connectivity status (`LIVE` vs `Estimate`).
- **Derived Multi-Commodity Suite**:
  - Live calculation of Silver (XAG), Platinum (XPT), and Palladium (XPD) via baseline ratio multipliers relative to active spot gold.
- **Interactive Gold Value Converter**:
  - Real-time unit conversion: Converts user-entered USD values directly to equivalent troy ounces (`USD ÷ spot_price`) and metric grams (`troy oz × 31.1035`).
- **Zero-Framework Single-Page Navigation**:
  - DOM-based view swapping using `data-target` attributes, eliminating page reloads and heavy external client-side routing libraries.
  - Four distinct views:
    - **Home**: Platform overview, live spot ticker badge, luxury interaction physics, and newsletter subscription.
    - **Reserves**: Institutional bullion custody framework (LBMA 999.9 standards, Zurich & Singapore vaulting).
    - **Market Live**: Real-time commodity board, derived asset price cards, conversion calculator, and feed status indicators.
    - **Event**: Race hub for "Frostbite: Running For Change" (schedule, course milestones, and participant categories).
- **Dynamic Context-Aware Modal**:
  - Reusable modal dialog (`#allocate-modal`) that adapts its form fields, headings, and select options depending on the active view:
    - *Event view*: Displays race categories (5K Community Run, 10K Trail Run, Partner Booth).
    - *Other views*: Displays bullion custody allocation options (10 Troy Ounces, 1 Kilogram Bar, Institutional Ingot).
- **Offline-First Dual-Tier Persistence**:
  - Submissions immediately persist to browser `localStorage` (`frostbite_orders` and `frostbite_subscribers`).
  - Asynchronously dispatches data to serverless API routes (`/api/register`, `/api/subscribe`). If remote backends are unconfigured, user actions remain saved locally with non-blocking UI feedback.
- **Interaction Physics**:
  - Custom pointer-follow ambient radial glow.
  - 3D card tilt transformations driven by normalized mouse coordinates (`perspective(800px) rotateX(...) rotateY(...)`).
  - Spring-physics motion curves using CSS `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Research Desk Portal (`login.html`)**:
  - Dedicated authentication and desk access request interface with custom input controls and view-state toggles.

---

## 4. Live Demo & Screenshots

### Deployments & Links
- **Production URL**: [https://frostbite-taupe.vercel.app](https://frostbite-taupe.vercel.app)
- **Source Code Repository**: [https://github.com/samuelmichaelalva/frostbite](https://github.com/samuelmichaelalva/frostbite)

### Project Resources
- [LinkedIn Pitch Video](https://lnkd.in/p/djbNYUpr)
- [Prototype Demonstration](https://drive.google.com/file/d/1OSgYeKWHo8GKuMF1qOdHjajBJ38n4lEd/view?usp=drivesdk)
- [Project Presentation (PPT)](https://drive.google.com/file/d/1ea4lmIMMOzRFWw52CDiPqJ2Ktl1lycLx/view?usp=drivesdk)

### Application Screenshots

| View | Desktop | Mobile |
| :--- | :---: | :---: |
| **Home View** | ![Home Desktop](./Home_Desktop.png) | ![Home Mobile](./Home_Mobile.png) |
| **Bullion Reserves View** | ![Reserves Desktop](./About_Desktop.png) | ![About Mobile](./About_Mobile.png) |
| **Event Registration View** | ![Event Desktop](./Event_Desktop.png) | ![Event Mobile](./Event_Mobile.png) |

---

## 5. Architecture

Frostbite uses a decoupled architecture where the client layer handles rendering, animation, and live market data acquisition directly from public endpoints. When deployed to Vercel, serverless functions provide optional server-side fallback feeds, database synchronization, and transactional email distribution.

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Browser Runtime)"]
        SPA["Single-Page Application (index.html / app.js)"]
        Views["View Panels (Home | Reserves | Market | Event)"]
        Converter["Gold Converter & Multi-Commodity Logic"]
        LocalStorage[("Browser LocalStorage\n(Orders & Subscribers)")]
    end

    subgraph Feeds ["Public Market Feeds"]
        Binance["Binance Public REST API\n(PAXGUSDT Ticker)"]
    end

    subgraph Serverless ["Backend Serverless Layer (Vercel)"]
        APIGold["GET /api/gold\n(Spot Fallback)"]
        APIRegister["POST /api/register\n(Allocation / Race)"]
        APISubscribe["POST /api/subscribe\n(Newsletter)"]
    end

    subgraph ExternalServices ["External Cloud Services (Optional)"]
        GoldAPI["GoldAPI.io\n(Premium Spot Feed)"]
        Supabase[("Supabase\n(PostgreSQL Cloud DB)")]
        Resend["Resend API\n(Transactional Email)"]
    end

    SPA -->|1. Polling every 45s (CORS-friendly)| Binance
    SPA -.->|2. Fallback if client fetch fails| APIGold
    SPA -->|3. Local-first persistence| LocalStorage
    SPA -->|4. Async Form Submission| APIRegister
    SPA -->|5. Async Subscription| APISubscribe

    APIGold -.->|If GOLD_API_KEY present| GoldAPI
    APIGold -.->|Default public fallback| Binance
    APIRegister -.->|If SUPABASE_URL configured| Supabase
    APIRegister -.->|If RESEND_API_KEY configured| Resend
    APISubscribe -.->|If SUPABASE_URL configured| Supabase
    APISubscribe -.->|If RESEND_API_KEY configured| Resend
```

### Market Data Flow & Derived Pricing Logic
1. **Primary Gold Feed**: Client executes an asynchronous `fetch` request to `https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT`. Because Paxos Gold (PAXG) is backed 1:1 by one fine troy ounce of physical gold under LBMA custody, its market price closely tracks spot gold (XAU/USD).
2. **Server-Side Fallback**: If browser client fetches are blocked (e.g., corporate firewalls or strict ad-blockers), the client routes the request to `/api/gold`, which queries GoldAPI.io (if configured) or proxies the Binance ticker via the Node.js runtime.
3. **Derived Commodities Formula**:
   $$\text{Silver Price (XAG)} = \frac{\text{Gold Spot Price}}{85}$$
   $$\text{Platinum Price (XPT)} = \frac{\text{Gold Spot Price}}{2.8}$$
   $$\text{Palladium Price (XPD)} = \frac{\text{Gold Spot Price}}{2.6}$$
4. **Calculations**:
   $$\text{Troy Ounces} = \frac{\text{USD Amount}}{\text{Gold Spot Price}}$$
   $$\text{Fine Grams} = \text{Troy Ounces} \times 31.1035$$

---

## 6. Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Core** | HTML5, Vanilla JavaScript (ES6+) | Native DOM manipulation, async fetch API, zero external framework dependencies |
| **Styling & Design** | Modern CSS3 | Custom CSS variables, responsive grid/flexbox, hardware-accelerated transforms |
| **Typography** | Google Fonts | `Syne` (display headers), `Plus Jakarta Sans` (body), `Space Mono` (market data) |
| **Asset Pipeline** | WebP & JPEG | Sliced visual compositions optimized for high-density displays |
| **Public Market Feed** | Binance Public REST API | Free keyless ticker for `PAXGUSDT` spot price |
| **Serverless Backend** | Node.js (Vercel Serverless) | Serverless functions for proxy quotes, database insertion, and email dispatch |
| **Database (Optional)** | Supabase | PostgreSQL REST API endpoint integration (`/rest/v1/registrations`, `/rest/v1/subscribers`) |
| **Email (Optional)** | Resend API | Transactional confirmation email dispatch |
| **Deployment** | Vercel | Static CDN distribution with serverless routing rules |

---

## 7. Project Structure

```
frostbite/
├── .gitignore                    # Git file exclusion rules
├── README.md                     # Technical documentation and project overview
├── index.html                    # Main Single-Page Application (Home, Reserves, Market, Event)
├── login.html                    # Research Desk access portal and authentication interface
├── app.js                        # Client-side logic: SPA navigation, live feeds, converter, forms
├── style.css                     # Global design system, typography tokens, component layouts
├── vercel.json                   # Vercel deployment rewrite configuration for API routes
├── Home_Desktop.png              # Screenshot: Home view on desktop viewport
├── Home_Mobile.png               # Screenshot: Home view on mobile viewport
├── Home_Tablet.png               # Screenshot: Home view on tablet viewport
├── About_Desktop.png             # Screenshot: Reserves view on desktop viewport
├── About_Mobile.png              # Screenshot: Reserves view on mobile viewport
├── About_Tablet.png              # Screenshot: Reserves view on tablet viewport
├── Event_Desktop.png             # Screenshot: Event view on desktop viewport
├── Event_Mobile.png              # Screenshot: Event view on mobile viewport
├── Event_Tablet.png              # Screenshot: Event view on tablet viewport
├── api/
│   ├── gold.js                   # Serverless function: Spot price provider with fallback logic
│   ├── register.js               # Serverless function: Order & event registration handler
│   └── subscribe.js              # Serverless function: Newsletter subscription handler
├── assets/                       # Production WebP visual assets
│   ├── about_gold_bar.webp       # Physical bullion bar illustration
│   ├── event_mountain.webp       # Golden mountain peak landscape
│   ├── footer_gold.webp          # Footer ambient graphic asset
│   ├── gold_bars_sand.webp       # Vault bullion presentation asset
│   ├── golden_rays.webp          # Atmospheric lighting overlay
│   └── home_hero_iceberg.webp    # Gold iceberg summit visual
└── images/                       # High-resolution source assets and reference layout captures
    ├── golden_mountain.jpg
    ├── gold_arrow.jpg
    ├── gold_bar.jpg
    ├── gold_sand.jpg
    ├── hero_iceberg.jpg
    ├── molten_gold.jpg
    ├── sunburst.jpg
    └── references/               # UI layout reference captures
```

---

## 8. Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: [Node.js](https://nodejs.org/) (v18+) or [Python 3](https://www.python.org/) for local web serving
- Optional: [Vercel CLI](https://vercel.com/cli) to test serverless API routes locally

### Local Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/samuelmichaelalva/frostbite.git
   cd frostbite
   ```

2. **Run a local static server**:
   
   *Option A: Python 3 built-in HTTP server*
   ```bash
   python -m http.server 8000
   ```

   *Option B: Node.js static serve*
   ```bash
   npx -y serve .
   ```

   *Option C: Vercel CLI (executes both static frontend and `/api/*` serverless routes)*
   ```bash
   npx -y vercel dev
   ```

3. **Access the application**:
   Open `http://localhost:8000` (or the URL output by Vercel CLI) in your browser.

---

### API Route Reference

The application contains three serverless API functions located in `/api`:

#### 1. `GET /api/gold`
Retrieves the latest spot price for gold.
- **Headers**:
  - `Access-Control-Allow-Origin: *`
  - `Cache-Control: s-maxage=60, stale-while-revalidate=120`
- **Response** (`200 OK`):
  ```json
  {
    "price": 2748.60,
    "currency": "USD",
    "unit": "troy oz",
    "change24h": "+0.62%",
    "raisedUsd": 30000,
    "goldEquivalent": {
      "oz": "10.91",
      "grams": "339.4"
    },
    "updatedAt": "2026-10-29T00:00:00.000Z"
  }
  ```

#### 2. `POST /api/register`
Processes allocation orders and event registrations.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "participationType": "10 Troy Ounces (~$27,500)"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Registration confirmed",
    "cloudSynced": false,
    "emailSent": false
  }
  ```

#### 3. `POST /api/subscribe`
Registers an email address for market updates.
- **Request Body**:
  ```json
  {
    "email": "investor@example.com"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Subscribed",
    "cloudSynced": false,
    "emailSent": false
  }
  ```

---

### Environment Variables

Environment variables are optional. When omitted, the platform falls back to public API feeds and browser local storage.

| Variable | Target Service | Purpose | Requirement |
| :--- | :--- | :--- | :--- |
| `GOLD_API_KEY` | GoldAPI.io | Access token for premium spot gold pricing in `/api/gold` | Optional (defaults to Binance public feed) |
| `RESEND_API_KEY` | Resend.com | API key for sending transactional confirmation emails | Optional (submissions save locally if omitted) |
| `SUPABASE_URL` | Supabase | HTTPS URL for Supabase cloud database instance | Optional (enables remote database storage) |
| `SUPABASE_KEY` | Supabase | Anon or service role API key for Supabase authentication | Optional (enables remote database storage) |

---

## 9. Team & Contributions

Frostbite was conceived and submitted as a project for **HackInHills 2026** by a three-member team.

### Primary Implementation & Technical Leadership
- **Samuel Michael Alva** — **Team Lead**
  - **Architecture & Frontend Engineering**: Designed and developed the zero-framework SPA structure, CSS token architecture, responsive design across mobile/tablet/desktop, and view-switching logic.
  - **Live Market Integration**: Engineered the Binance `PAXGUSDT` public API integration, multi-commodity ratio derivation logic, auto-polling engine, and live converter calculations.
  - **Backend Serverless Development**: Authored all serverless backend functions (`/api/gold`, `/api/register`, `/api/subscribe`) including fallback mechanisms, Supabase REST database integrations, and Resend email handling.
  - **Interaction Design & Portal**: Built the 3D card tilt physics, pointer-follow lighting effects, modal dialog workflows, and the research desk authentication interface (`login.html`).
  - **Git & Repository Management**: Verified as the sole committer and author across all repository commits and technical milestones.

### Team Contributions
- **HackInHills 2026 Team Members**:
  - Contributed to competitive hackathon ideation, problem definition surrounding precious metals custody and commodity derivative friction, and the creation of project presentation assets (Slide Deck and Pitch Video).
  - *Codebase Note*: All technical implementation, code commits, serverless functions, and software maintenance in this repository were authored directly by the Team Lead.

---

## 10. Limitations

To ensure transparency, the following technical and functional boundaries apply to this prototype:

1. **Derived Commodity Prices**:
   - Only Gold (XAU) reflects real-time exchange pricing (via Binance `PAXGUSDT`).
   - Silver (XAG), Platinum (XPT), and Palladium (XPD) values are **mathematically derived estimates** based on historical baseline ratios (85:1, 2.8:1, and 2.6:1), not independent live feeds.
2. **Prototype Transaction Scope**:
   - The platform does not execute real monetary transactions, bank transfers, payment gateway checkouts, or legal bullion title transfers. All allocation workflows are demonstrations.
3. **Data Persistence Fallback**:
   - Without configured `SUPABASE_URL` and `SUPABASE_KEY` environment variables, registrations and subscriptions exist solely within the user's browser `localStorage`. Clearing cache or switching devices removes saved records.
4. **Conditional Email Dispatch**:
   - Transactional confirmation emails require a valid `RESEND_API_KEY` and verified sender domain. Without this key, email dispatch is disabled and reported as simulated in the API response.
5. **Tokenized Gold Basis**:
   - The public market feed tracks PAX Gold (`PAXG`), which trades on crypto exchange order books. While backed 1:1 by physical allocated gold, slight premiums or discounts relative to the London Bullion Market Association (LBMA) PM fix can occur during extreme volatility.
