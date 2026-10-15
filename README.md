# Frostbite

> **HackInHills ’26 Prototype · Commodity Derivatives Intelligence**  
> A research-driven, single-page scrollytelling prototype demonstrating relative mispricing detection between MCX gold futures contracts and cost-aware evaluation.

---

## 🧭 The 7-Step Scrollytelling Journey

1. **The Problem** — Exploration of basis discrepancies across fractured contract lot sizes, quotation units, and purity standards (995 vs 999).
2. **Data Collection** — Specification matrix and snapshot ingestion across MCX bullion instruments (`GOLD`, `GOLDM`, `GOLDGUINEA`, `GOLDPETAL`).
3. **Contract Normalization** — Deterministic mathematical formula and interactive sandbox scaling all contracts to a 10g Pure Gold (999.0) benchmark.
4. **Mispricing Detection** — Interactive spread radar and trajectory chart demonstrating coin-to-bar relative value divergence and hedge ratio neutrality.
5. **Signal Validation** — Explicit 3-tier qualification gate categorizing candidate signals as *Accepted for evaluation*, *Rejected*, or *Inconclusive*.
6. **Cost-Aware Backtesting** — Interactive friction waterfall accounting for assumed statutory Indian commodity transaction taxes (CTT), turnover fees, and market slippage.
7. **Final Verdict** — Synthesis of research findings, empirical limitations, and prototype governance notes.

---

## 🎨 Luxury Color Palette

- **Obsidian Black**: `#0B0B0B`
- **Charcoal**: `#171614`
- **Champagne Gold**: `#C6A76B`
- **Warm Ivory**: `#F4EFE6`
- **Stone Grey**: `#77736B`
- **Sage Green**: `#718574`
- **Muted Crimson**: `#9C4F4F`

---

## 🚀 Running Locally

This prototype is built with standard HTML5, CSS3, and modern JavaScript with Tailwind CSS CDN and Google Fonts. No build step or backend server is required.

### Quick Start
You can open `index.html` directly in any modern browser or run a simple local web server:

```bash
# Using Python
python -m http.server 8000

# Or using Node.js npx serve
npx -y serve .
```

Then visit `http://localhost:8000` in your browser.

---

## ⚠️ Prototype Governance & Disclaimers

- **Illustrative Prototype Only**: All figures, quotes, spreads, and backtest simulations are deterministic illustrative samples for academic demonstration, not live or audited market data.
- **Scope**: This is a frontend storytelling prototype; it does not contain backend services, automated trading engines, or broker integrations.
