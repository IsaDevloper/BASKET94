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

const PRODUCT_DETAILS = {
  'bg5000': {
    badge: '#7',
    tagline: 'COMPETENCIA · FIBA APPROVED',
    images: ['images/bg5000.jpg'],
    description: 'Balón de competencia con cuero sintético composite premium. Pensado para entrenamientos exigentes y juego serio, con el agarre parejo que se siente de inmediato al primer bote.',
    specs: [
      ['Talla', '7 (varonil)'],
      ['Circunferencia', '749–780 mm'],
      ['Peso', '567–650 g'],
      ['Material', 'Cuero sintético premium composite'],
    ],
  },
  'bg3800': {
    badge: '#7',
    tagline: 'ENTRENAMIENTO · FIBA APPROVED',
    images: ['images/bg3800.jpg', 'images/bg3800-2.jpg'],
    description: 'Balón oficial FIBA con aprobación Nivel 1 vigente 2024–2028. Cuero premium para uso diario en cancha, con la durabilidad que pide el entrenamiento constante.',
    specs: [
      ['Talla', '7 (varonil)'],
      ['Aprobación FIBA', 'Nivel 1, vigente 2024–2028'],
      ['Circunferencia', '749–780 mm'],
      ['Peso', '567–650 g'],
    ],
  },
  'bg4000': {
    badge: '#7',
    tagline: 'COMPETENCIA · FIBA APPROVED',
    images: ['images/bg4000.jpg', 'images/bg4000-2.jpg'],
    description: 'Balón de la línea Competition premium composite de Molten, aprobado por FIBA. Buen punto medio entre agarre y durabilidad para quienes juegan varias veces por semana.',
    specs: [
      ['Talla', '7 (varonil)'],
      ['Circunferencia', '749–780 mm'],
      ['Peso', '567–650 g'],
      ['Material', 'Cuero sintético premium composite'],
    ],
  },
  'gg6x': {
    badge: '#6',
    tagline: 'FEMENIL · FIBA APPROVED CATEGORY 6',
    images: ['images/gg6x.jpg'],
    description: 'Balón oficial femenil de Molten, talla 6, con aprobación FIBA vigente. La opción correcta para ligas femeniles y para jugadores mixtos de 9 a 12 años que ya juegan en talla estándar reducida.',
    specs: [
      ['Talla', '6 (femenil / mixto)'],
      ['Circunferencia', '724–737 mm'],
      ['Peso', '510–567 g'],
      ['Categoría FIBA', 'Category 6'],
    ],
  },
  'bg3800-mundial': {
    badge: '#7',
    tagline: 'EDICIÓN MUNDIAL 2023',
    images: ['images/bg3800-mundial.jpg'],
    description: 'Edición conmemorativa de la Copa Mundial FIBA 2023 (Filipinas · Japón · Indonesia), sobre la base BG3800. Pieza ideal tanto para jugar como para coleccionar.',
    specs: [
      ['Talla', '7 (varonil)'],
      ['Edición', 'FIBA Basketball World Cup 2023'],
      ['Circunferencia', '749–780 mm'],
      ['Peso', '567–650 g'],
    ],
  },
  'bg5000-mundial': {
    badge: '#7',
    tagline: 'EDICIÓN MUNDIAL 2019',
    images: ['images/bg5000-mundial.jpg', 'images/bg5000-mundial-2.jpg'],
    description: 'Balón oficial de juego de la Copa Mundial FIBA China 2019, con los grabados conmemorativos del torneo. Edición coleccionable sobre la base BG5000.',
    specs: [
      ['Talla', '7 (varonil)'],
      ['Edición', 'FIBA Basketball World Cup China 2019'],
      ['Material', 'Cuero premium (Premium Leather)'],
      ['Peso', '567–650 g'],
    ],
  },
  'calcetas': {
    badge: '',
    tagline: 'NIKE ELITE · NBA',
    images: ['images/calcetas.jpg', 'images/calcetas-2.jpg', 'images/calcetas-3.jpg'],
    description: 'Calcetas Nike Elite con licencia oficial NBA, tecnología Dri-FIT y cojinete reforzado en la zona de impacto. Disponibles en blanco o negro.',
    specs: [
      ['Tallas disponibles', 'M y L'],
      ['Tecnología', 'Dri-FIT'],
      ['Colores', 'Blanco / Negro'],
      ['Licencia', 'NBA oficial'],
    ],
    oldPrice: 250,
  },
  'rodilleras': {
    badge: '',
    tagline: 'PROTECCIÓN DE CANCHA',
    images: ['images/rodilleras.jpg'],
    description: 'Rodilleras tipo manga larga con panel acolchado tipo panal en la zona de la rodilla. Protección ligera que no limita el movimiento, ideal para quienes juegan cerca del área pintada.',
    specs: [
      ['Tallas disponibles', 'S, M, G'],
      ['Panel', 'Acolchado tipo panal'],
      ['Color', 'Negro'],
      ['Presentación', 'Par'],
    ],
    hasSize: true,
  },
};

// ============ PRODUCT MODAL ============
let currentModalId = null;

function openProductModal(id){
  const details = PRODUCT_DETAILS[id];
  if(!details) return;
  currentModalId = id;

  const price = details.hasSize ? PRODUCT_CATALOG['rodilleras-M'].price : (PRODUCT_CATALOG[id] ? PRODUCT_CATALOG[id].price : 0);
  const name = details.hasSize ? 'Rodilleras (par)' : (PRODUCT_CATALOG[id] ? PRODUCT_CATALOG[id].name : '');

  document.getElementById('pmTagline').textContent = details.tagline;
  document.getElementById('pmTitle').textContent = name;
  document.getElementById('pmBadge').textContent = details.badge;
  document.getElementById('pmBadge').style.display = details.badge ? '' : 'none';
  document.getElementById('pmPrice').textContent = formatMXN(price);
  document.getElementById('pmDesc').textContent = details.description;

  const oldPriceEl = document.getElementById('pmPriceOld');
  if(details.oldPrice){
    oldPriceEl.textContent = formatMXN(details.oldPrice);
    oldPriceEl.style.display = '';
  } else {
    oldPriceEl.style.display = 'none';
  }

  const specsEl = document.getElementById('pmSpecs');
  specsEl.innerHTML = details.specs.map(([label, value]) =>
    `<div><span>${label}</span><strong>${value}</strong></div>`
  ).join('');

  const sizeWrap = document.getElementById('pmSizeWrap');
  sizeWrap.hidden = !details.hasSize;

  // Gallery
  const mainImg = document.getElementById('pmMainImg');
  mainImg.src = details.images[0];
  mainImg.alt = name;
  const thumbsEl = document.getElementById('pmThumbs');
  thumbsEl.innerHTML = '';
  if(details.images.length > 1){
    details.images.forEach((src, i) => {
      const t = document.createElement('img');
      t.src = src;
      t.alt = name + ' foto ' + (i + 1);
      if(i === 0) t.classList.add('is-active');
      t.addEventListener('click', () => {
        mainImg.src = src;
        thumbsEl.querySelectorAll('img').forEach(el => el.classList.remove('is-active'));
        t.classList.add('is-active');
      });
      thumbsEl.appendChild(t);
    });
  }

  document.getElementById('productModal').classList.add('is-open');
  document.getElementById('productModalOverlay').classList.add('is-open');
}

function closeProductModal(){
  document.getElementById('productModal').classList.remove('is-open');
  document.getElementById('productModalOverlay').classList.remove('is-open');
  currentModalId = null;
}

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

  // Product detail modal: open from the product image or the "Ver detalle" link only
  // (never from the whole card, to avoid clashing with the Agregar button/select)
  document.querySelectorAll('.product-card[data-detail]').forEach(card => {
    const id = card.dataset.detail;
    const media = card.querySelector('.product-card__media');
    const link = card.querySelector('.product-card__viewlink');
    if(media) media.addEventListener('click', () => openProductModal(id));
    if(link) link.addEventListener('click', () => openProductModal(id));
  });
  document.getElementById('productModalClose').addEventListener('click', closeProductModal);
  document.getElementById('productModalOverlay').addEventListener('click', closeProductModal);
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeProductModal();
  });
  document.getElementById('pmAddBtn').addEventListener('click', () => {
    if(!currentModalId) return;
    const details = PRODUCT_DETAILS[currentModalId];
    if(details && details.hasSize){
      const size = document.getElementById('pmSize').value;
      addToCart('rodilleras-' + size);
    } else {
      addToCart(currentModalId);
    }
    closeProductModal();
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
