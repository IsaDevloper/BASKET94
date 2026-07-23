// ============ DATA ============
const PRODUCT_CATALOG = {
  'bg5000':          { name: 'Molten BG5000',                          price: 735 },
  'bg3800':          { name: 'Molten BG3800',                          price: 735 },
  'bg4000':          { name: 'Molten BG4000',                          price: 735 },
  'gg6x':            { name: 'Molten GG6X — Talla 6',                  price: 785 },
  'bg3800-mundial':  { name: 'Molten BG3800 — Edición Mundial 2023',   price: 785 },
  'bg5000-mundial':  { name: 'Molten BG5000 — Edición Mundial 2019',   price: 785 },
  'calcetas':        { name: 'Calcetas NBA Nike Elite',                 price: 199 },
  'rodilleras-S':    { name: 'Rodilleras (par) — Talla S',              price: 190 },
  'rodilleras-M':    { name: 'Rodilleras (par) — Talla M',              price: 190 },
  'rodilleras-G':    { name: 'Rodilleras (par) — Talla G',              price: 190 },
};

const SIZE_SPECS = {
  '7': { circ: '749–780 mm', peso: '567–650 g', uso: 'Varonil, cancha completa, 13+ años' },
  '6': { circ: '724–737 mm', peso: '510–567 g', uso: 'Femenil / mixto, 9–12 años' },
};

const CART_KEY = 'basket94_cart';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============ HERO SLIDER + PARALLAX ============
function initHero(){
  const hero = document.getElementById('top');
  const slider = document.getElementById('heroSlider');
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dots button');
  if(!hero || !slider || slides.length === 0) return;

  let current = 0;

  function goTo(index){
    slides[current].classList.remove('is-active');
    dots[current]?.classList.remove('is-active');
    current = index;
    slides[current].classList.add('is-active');
    dots[current]?.classList.add('is-active');
  }

  // Autoplay slider
  setInterval(() => {
    goTo((current + 1) % slides.length);
  }, 5000);

  // Manual dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  // Parallax on scroll (skipped if reduced motion is preferred)
  if(!REDUCED_MOTION){
    let ticking = false;
    window.addEventListener('scroll', () => {
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const offset = rect.top * 0.35; // parallax factor
        slider.style.transform = `translate3d(0, ${offset}px, 0)`;
        ticking = false;
      });
    }, { passive: true });
  }
}

// ============ STATE ============
function getCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){
    return {};
  }
}

function saveCart(cart){
  try{
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }catch(e){
    console.error('No se pudo guardar el carrito', e);
  }
}

function addToCart(id){
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  renderCart();
  openCart();
}

function changeQty(id, delta){
  const cart = getCart();
  if(!cart[id]) return;
  cart[id] += delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart(cart);
  renderCart();
}

function removeFromCart(id){
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}

// ============ RENDER CART ============
function formatMXN(amount){
  return '$' + amount.toLocaleString('es-MX') + ' MXN';
}

function renderCart(){
  const cart = getCart();
  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartCount');

  const ids = Object.keys(cart);
  itemsEl.innerHTML = '';

  if(ids.length === 0){
    itemsEl.appendChild(emptyEl);
    totalEl.textContent = formatMXN(0);
    countEl.textContent = '0';
    return;
  }

  let total = 0;
  let count = 0;

  ids.forEach(id => {
    const product = PRODUCT_CATALOG[id];
    if(!product) return;
    const qty = cart[id];
    const subtotal = product.price * qty;
    total += subtotal;
    count += qty;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <div class="cart-item__name">${product.name}</div>
        <div class="cart-item__price">${formatMXN(product.price)} c/u</div>
      </div>
      <div class="cart-item__qty">
        <button data-decrement="${id}" aria-label="Quitar uno">−</button>
        <span>${qty}</span>
        <button data-increment="${id}" aria-label="Agregar uno">+</button>
      </div>
      <button class="cart-item__remove" data-remove="${id}">Quitar</button>
    `;
    itemsEl.appendChild(row);
  });

  totalEl.textContent = formatMXN(total);
  countEl.textContent = String(count);
}

// ============ CART DRAWER OPEN/CLOSE ============
function openCart(){
  document.getElementById('cartDrawer').classList.add('is-open');
  document.getElementById('cartOverlay').classList.add('is-open');
}

function closeCart(){
  document.getElementById('cartDrawer').classList.remove('is-open');
  document.getElementById('cartOverlay').classList.remove('is-open');
}

// ============ SIZE PICKER ============
function setActiveSize(size){
  document.querySelectorAll('.fit-tab').forEach(tab => {
    tab.classList.toggle('is-active', tab.dataset.size === size);
  });
  const spec = SIZE_SPECS[size];
  document.getElementById('specCirc').textContent = spec.circ;
  document.getElementById('specPeso').textContent = spec.peso;
  document.getElementById('specUso').textContent = spec.uso;
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  renderCart();

  // Add to cart buttons (products with fixed id)
  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.add));
  });

  // Rodilleras: variant depends on selected size
  const rodillerasBtn = document.getElementById('addRodilleras');
  if(rodillerasBtn){
    rodillerasBtn.addEventListener('click', () => {
      const size = document.getElementById('rodillerasSize').value;
      addToCart('rodilleras-' + size);
    });
  }

  // Cart drawer controls
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);

  // Quantity / remove (event delegation, since rows are re-rendered)
  document.getElementById('cartItems').addEventListener('click', (e) => {
    const inc = e.target.closest('[data-increment]');
    const dec = e.target.closest('[data-decrement]');
    const rem = e.target.closest('[data-remove]');
    if(inc) changeQty(inc.dataset.increment, 1);
    if(dec) changeQty(dec.dataset.decrement, -1);
    if(rem) removeFromCart(rem.dataset.remove);
  });

  // Checkout (placeholder — se conectará a Shopify)
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    const cart = getCart();
    if(Object.keys(cart).length === 0){
      alert('Tu carrito está vacío. Agrega un balón primero.');
      return;
    }
    alert('Aquí se conectará el checkout real de Shopify.');
  });

  // Size tabs
  document.querySelectorAll('.fit-tab').forEach(tab => {
    tab.addEventListener('click', () => setActiveSize(tab.dataset.size));
  });

  // Smooth scroll buttons
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector(btn.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Mobile nav toggle
  const burger = document.getElementById('burgerBtn');
  const links = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    links.classList.toggle('is-open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('is-open'));
  });
});
