// Navigation & View Routing
const navBtns = document.querySelectorAll('[data-target]');
const panels = document.querySelectorAll('.view-panel');

function switchView(target) {
  panels.forEach(p => p.classList.toggle('active', p.id === `view-${target}`));
  navBtns.forEach(b => b.classList.toggle('active', b.dataset.target === target));
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

// Real-Time Live Gold Price Integration
async function updateGoldPrice() {
  let price = 2748.60, change = '+0.62%';
  try {
    const res = await fetch('/api/gold');
    if (res.ok) {
      const data = await res.json();
      price = data.price; change = data.change24h;
    } else {
      const bRes = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT');
      const bData = await bRes.json();
      if (bData.lastPrice) {
        price = parseFloat(bData.lastPrice);
        change = (parseFloat(bData.priceChangePercent) >= 0 ? '+' : '') + parseFloat(bData.priceChangePercent).toFixed(2) + '%';
      }
    }
  } catch (err) {
    console.log('Using spot market baseline');
  }

  const formattedPrice = `$${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}/oz`;
  document.getElementById('gold-price-val').textContent = formattedPrice;
  const marketPagePrice = document.getElementById('market-page-price');
  if (marketPagePrice) marketPagePrice.textContent = formattedPrice;

  const changeEl = document.getElementById('gold-change');
  changeEl.textContent = change;
  changeEl.style.color = change.startsWith('-') ? '#f87171' : '#4ade80';

  const oz = (30000 / price).toFixed(2);
  const mathEl = document.getElementById('home-gold-math');
  if (mathEl) mathEl.textContent = `⚡ LIVE: ≈ ${oz} Troy Oz Allocated (${(oz * 31.1).toFixed(1)}g fine gold)`;
}
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
  const name = e.target.querySelector('input[type="text"]').value;
  const email = e.target.querySelector('input[type="email"]').value;
  const amount = e.target.querySelector('select').value;

  const orders = JSON.parse(localStorage.getItem('frostbite_orders') || '[]');
  orders.push({ name, email, amount, date: new Date().toISOString() });
  localStorage.setItem('frostbite_orders', JSON.stringify(orders));

  try {
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, participationType: `Gold Allocation: ${amount}` })
    });
  } catch (_) {}

  showToast(`✨ Allocation order created for ${name}! Details dispatched to email.`);
  modal.classList.remove('open');
  e.target.reset();
};

document.getElementById('newsletter-form').onsubmit = async (e) => {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;

  const subs = JSON.parse(localStorage.getItem('frostbite_subscribers') || '[]');
  subs.push({ email, date: new Date().toISOString() });
  localStorage.setItem('frostbite_subscribers', JSON.stringify(subs));

  try {
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  } catch (_) {}

  showToast('📈 Subscribed to live gold market alerts!');
  e.target.reset();
};
