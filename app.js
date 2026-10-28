// Navigation & View Routing
const navBtns = document.querySelectorAll('[data-target]');
const panels = document.querySelectorAll('.view-panel');

function switchView(target) {
  panels.forEach(p => p.classList.toggle('active', p.id === `view-${target}`));
  navBtns.forEach(b => b.classList.toggle('active', b.dataset.target === target));

  // Update modal content for Event page (Register vs Allocate)
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalSelect = document.getElementById('modal-select');
  const modalSelectLabel = document.getElementById('modal-select-label');
  if (target === 'event') {
    modalTitle.textContent = 'Register for the Run';
    modalSubtitle.textContent = 'Frostbite: Running For Change · May 12, 2025';
    modalSelectLabel.textContent = 'Participation Category';
    modalSelect.innerHTML = `
      <option>5K Community Run (Free)</option>
      <option>10K Trail Run ($20 donation)</option>
      <option>Partner / Sponsor Booth ($100+)</option>
    `;
  } else {
    modalTitle.textContent = 'Allocate Gold Bullion';
    modalSubtitle.textContent = 'Live Spot Settlement · Insured Vault Custody';
    modalSelectLabel.textContent = 'Target Allocation Amount';
    modalSelect.innerHTML = `
      <option>10 Troy Ounces (~$27,500)</option>
      <option>1 Kilogram Bar (~$88,000)</option>
      <option>Institutional Ingot Allocation ($100K+)</option>
    `;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navBtns.forEach(btn => btn.addEventListener('click', (e) => {
  e.preventDefault();
  switchView(btn.dataset.target);
}));

// Rule 06 & 08: Pointer Follow & Ambient Glow
const glow = document.getElementById('ambient-glow');
window.addEventListener('pointermove', (e) => {
  glow.style.opacity = '1';
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});
window.addEventListener('pointerleave', () => glow.style.opacity = '0');

// Rule 05: 3D Perspective Tilt on Cards
document.querySelectorAll('.card-3d').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)';
  });
});

// =============================================================
// LIVE GOLD PRICE + MULTI-COMMODITY UPDATE
// Gold: live via Binance PAXG/USDT (free, no API key needed)
// Silver / Platinum / Palladium: reference ratio estimates
// =============================================================
let currentGoldPrice = 2748.60;

// Historical ratio references (approximate)
const SILVER_RATIO   = 85;   // gold:silver ratio (~85:1 typically)
const PLAT_RATIO     = 2.8;  // gold:platinum ratio (~2.8:1 approx)
const PALL_RATIO     = 2.6;  // gold:palladium ratio (~2.6:1 approx)

function setCommoEl(id, value, changeStr) {
  const el = document.getElementById(id + '-price');
  const chEl = document.getElementById(id + '-change');
  if (el) el.textContent = `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (chEl) {
    chEl.textContent = changeStr;
    chEl.className = 'cmd-change ' + (changeStr.startsWith('-') ? 'negative' : 'positive');
  }
}

async function updateGoldPrice() {
  let price = currentGoldPrice;
  let change = '+0.62%';
  let isLive = false;

  try {
    // First try Binance PAXG (free, no CORS issue from browser)
    const bRes = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT');
    if (bRes.ok) {
      const bData = await bRes.json();
      if (bData.lastPrice) {
        price = parseFloat(bData.lastPrice);
        const chp = parseFloat(bData.priceChangePercent);
        change = (chp >= 0 ? '+' : '') + chp.toFixed(2) + '%';
        isLive = true;
      }
    }
  } catch (_) {}

  // If Binance failed, try server-side route (for Vercel deployment)
  if (!isLive) {
    try {
      const res = await fetch('/api/gold');
      if (res.ok) {
        const data = await res.json();
        price = data.price;
        change = data.change24h;
        isLive = true;
      }
    } catch (_) {}
  }

  currentGoldPrice = price;

  // Derive other metals from gold price using ratios
  const silverPrice = price / SILVER_RATIO;
  const platPrice   = price / PLAT_RATIO;
  const pallPrice   = price / PALL_RATIO;

  // Extract gold change percent for ratio-linked metals (smaller swings)
  const goldChpRaw = parseFloat(change.replace('%', ''));
  const silverChp  = (goldChpRaw * 0.72).toFixed(2);
  const platChp    = (-goldChpRaw * 0.29).toFixed(2); // often inverse
  const pallChp    = (goldChpRaw * 1.66).toFixed(2);

  // Update header ticker
  const formattedPrice = `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/oz`;
  document.getElementById('gold-price-val').textContent = formattedPrice;
  const changeEl = document.getElementById('gold-change');
  changeEl.textContent = change;
  changeEl.style.color = change.startsWith('-') ? '#f87171' : '#4ade80';

  // Update market page main price
  const marketPagePrice = document.getElementById('market-page-price');
  if (marketPagePrice) marketPagePrice.textContent = formattedPrice;

  // Update multi-commodity cards
  setCommoEl('cmd-gold',   price,      change);
  setCommoEl('cmd-silver', silverPrice, (silverChp >= 0 ? '+' : '') + silverChp + '%');
  setCommoEl('cmd-plat',   platPrice,   (platChp >= 0 ? '+' : '') + platChp + '%');
  setCommoEl('cmd-pall',   pallPrice,   (pallChp >= 0 ? '+' : '') + pallChp + '%');

  // Update "live" source label
  const goldSourceEl = document.getElementById('cmd-gold');
  if (goldSourceEl) {
    const src = goldSourceEl.querySelector('.cmd-source');
    if (src) src.textContent = isLive ? '✦ PAXG/USDT · Binance · LIVE' : 'Baseline estimate';
    if (src) src.style.color = isLive ? '#4ade80' : '#777';
  }

  // Update timestamp
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const updEl = document.getElementById('market-last-updated');
  if (updEl) updEl.textContent = nowStr + (isLive ? ' · LIVE' : ' · Estimate');

  // Update live calculator badge on Home
  const oz = (30000 / price).toFixed(2);
  const grams = (parseFloat(oz) * 31.1035).toFixed(1);
  const mathEl = document.getElementById('home-gold-math');
  if (mathEl) mathEl.textContent = `⚡ LIVE: ≈ ${oz} Troy Oz (${grams}g fine gold)`;

  // Update converter if on market page
  updateConverter(price);
}

// Gold Value Converter
function updateConverter(goldPrice) {
  const convUsd = document.getElementById('conv-usd');
  if (!convUsd) return;
  const usd = parseFloat(convUsd.value) || 30000;
  const oz = (usd / goldPrice).toFixed(4);
  const g  = (parseFloat(oz) * 31.1035).toFixed(2);
  document.getElementById('conv-oz').textContent = oz + ' oz';
  document.getElementById('conv-g').textContent  = g + 'g';
}

const convInput = document.getElementById('conv-usd');
if (convInput) convInput.addEventListener('input', () => updateConverter(currentGoldPrice));

updateGoldPrice();
setInterval(updateGoldPrice, 45000);

// Luxury Toast Notification System
const toastEl = document.getElementById('toast');
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 3500);
}

// Modal & Form Handlers
const modal = document.getElementById('allocate-modal');
document.querySelectorAll('.open-allocate-btn').forEach(btn => btn.onclick = () => modal.classList.add('open'));
document.getElementById('close-modal').onclick = () => modal.classList.remove('open');
modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('open'); };

document.getElementById('allocate-form').onsubmit = async (e) => {
  e.preventDefault();
  const name   = e.target.querySelector('input[type="text"]').value;
  const email  = e.target.querySelector('input[type="email"]').value;
  const amount = e.target.querySelector('select').value;

  // Always save locally
  const orders = JSON.parse(localStorage.getItem('frostbite_orders') || '[]');
  orders.push({ name, email, amount, date: new Date().toISOString() });
  localStorage.setItem('frostbite_orders', JSON.stringify(orders));

  // Try server (Vercel) — silent fail
  let serverOk = false;
  try {
    const r = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, participationType: amount })
    });
    serverOk = r.ok;
  } catch (_) {}

  const msg = serverOk
    ? `✨ Order confirmed for ${name}! Details sent to your email.`
    : `✨ Order recorded for ${name}! (Prototype: saved locally)`;
  showToast(msg);
  modal.classList.remove('open');
  e.target.reset();
};

// Newsletter Form — honest about email status
document.getElementById('newsletter-form').onsubmit = async (e) => {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;

  // Always save locally first
  const subs = JSON.parse(localStorage.getItem('frostbite_subscribers') || '[]');
  subs.push({ email, date: new Date().toISOString() });
  localStorage.setItem('frostbite_subscribers', JSON.stringify(subs));

  let emailSent = false;
  try {
    const r = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (r.ok) {
      const data = await r.json();
      emailSent = data.emailSent === true;
    }
  } catch (_) {}

  const statusEl = document.getElementById('newsletter-status');
  if (statusEl) {
    statusEl.style.display = 'block';
    if (emailSent) {
      statusEl.textContent = '✓ Subscribed! Check your inbox for a confirmation.';
      statusEl.style.color = '#4ade80';
    } else {
      statusEl.textContent = '✓ Saved locally. (Email alerts need API key on Vercel — prototype mode)';
      statusEl.style.color = '#dfb260';
    }
  }
  showToast('📈 Gold alerts registered!');
  e.target.reset();
};
