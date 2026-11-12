/* =====================================================================
   BASKET 94 — script.js
   ---------------------------------------------------------------------
   PARA AGREGAR / QUITAR / EDITAR UN BALÓN: solo modifica la lista
   PRODUCTS de más abajo. Las tarjetas, el modal de características y el
   carrito se generan automáticamente desde ahí (ya no hay que mantener
   el mismo id en tres lugares).
   ===================================================================== */

// ============ CONFIG ============
const WHATSAPP_NUMBER = '529987625469';          // +52 998 762 5469
const CART_KEY        = 'basket94_cart_v2';
const CITY_KEY        = 'basket94_city_v2';
const NEWSLETTER_KEY  = 'basket94_newsletter_status';
const REDUCED_MOTION  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Texto que se muestra en el detalle de TODOS los balones
const PRODUCT_DESCRIPTION =
  'Su construcción de piel sintética de alta resistencia está pensada para soportar el uso frecuente en superficies como concreto y duela, ofreciendo un excelente agarre y una gran durabilidad.';

// Medidas reglamentarias por número de balón
const SIZES = {
  7: { label: 'varonil',         circ: '74.9–78.0 cm', peso: '567–650 g' },
  6: { label: 'femenil / mixto', circ: '72.4–73.7 cm', peso: '510–567 g' },
};

// Ciudades de entrega. cost: 0 = gratis · número = costo · null = por cotizar
const CITIES = {
  'cancun':           { name: 'Cancún',           cost: 0,    costLabel: 'Envío gratis' },
  'puerto-morelos':   { name: 'Puerto Morelos',   cost: 100,  costLabel: '$100 MXN' },
  'playa-del-carmen': { name: 'Playa del Carmen', cost: 100,  costLabel: '$100 MXN' },
  'otra':             { name: 'Otra ciudad',      cost: null, costLabel: 'A cotizar' },
};

// ============ CATÁLOGO ============
// id      → nombre único sin espacios ni mayúsculas
// size    → número de balón (7 o 6)
// stock   → piezas disponibles (el carrito no deja pedir más que esto)
// image   → ruta en /images  (minúsculas, sin espacios, sin #)
// tag     → línea corta bajo el título y etiqueta del modal
// extra   → filas adicionales de la ficha técnica
const PRODUCTS = [
  { id: 'gg7x', name: 'Molten GG7X', size: 7, price: 735, stock: 2,
    image: 'images/gg7x.jpg', tag: 'Balón oficial FIBA · varonil',
    extra: [['Homologación', 'FIBA Approved · Category 7'], ['Material', 'Piel sintética']] },

  { id: 'gg6x', name: 'Molten GG6X', size: 6, price: 735, stock: 6,
    image: 'images/gg6x.jpg', tag: 'Balón oficial FIBA · femenil',
    extra: [['Homologación', 'FIBA Approved · Category 6'], ['Material', 'Piel sintética']] },

  { id: 'bg3800', name: 'Molten BG3800', size: 7, price: 735, stock: 3,
    image: 'images/bg3800.jpg', tag: 'Balón oficial FIBA · entrenamiento',
    extra: [['Homologación', 'FIBA Approved'], ['Material', 'Piel sintética']] },

  { id: 'bg4000', name: 'Molten BG4000', size: 7, price: 735, stock: 2,
    image: 'images/bg4000.jpg', tag: 'Balón oficial FIBA · competencia',
    extra: [['Homologación', 'FIBA Approved'], ['Material', 'Piel sintética']] },

  { id: 'bg3800-world-cup-2023', name: 'Molten BG3800 World Cup 2023', size: 7, price: 785, stock: 3,
    image: 'images/bg3800-world-cup-2023.jpg', tag: 'Edición Copa Mundial FIBA 2023',
    extra: [['Edición', 'Copa Mundial FIBA 2023'], ['Material', 'Piel sintética']] },

  { id: 'd3500-naranja', name: 'Molten D3500 Naranja', size: 7, price: 1150, stock: 1,
    image: 'images/d3500-naranja.jpg', tag: 'Especial para concreto',
    extra: [['Uso', 'Exterior (concreto)'], ['Material', 'Piel sintética']] },

  { id: 'd3500-negro', name: 'Molten D3500 Negro', size: 7, price: 1150, stock: 3,
    image: 'images/d3500-negro.jpg', tag: 'Especial para concreto',
    extra: [['Uso', 'Exterior (concreto)'], ['Material', 'Piel sintética']] },

  { id: 'spalding-tf-silver', name: 'Spalding TF Silver Series', size: 7, price: 835, stock: 3,
    image: 'images/spalding-tf-silver.jpg', tag: 'Para todas las superficies',
    extra: [['Superficie', 'Todas las superficies'], ['Material', 'Piel sintética (composite leather)']] },

  { id: 'spalding-super-flite', name: 'Spalding Super Flite', size: 7, price: 935, stock: 3,
    image: 'images/spalding-super-flite.jpg', tag: 'Piel sintética composite',
    extra: [['Material', 'Piel sintética (composite leather)']] },
];

const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

// ============ HELPERS ============
function formatMXN(amount){
  return '$' + amount.toLocaleString('es-MX') + ' MXN';
}
function productTitle(p){ return p.name + ' #' + p.size; }
function specsFor(p){
  const s = SIZES[p.size];
  return [
    ['Talla', p.size + ' (' + s.label + ')'],
    ['Circunferencia', s.circ],
    ['Peso', s.peso],
    ...(p.extra || []),
  ];
}
function escapeHTML(str){
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ============ CATÁLOGO: render de tarjetas ============
function renderProducts(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-card__media" data-detail="${p.id}">
        <img src="${p.image}" alt="Balón ${escapeHTML(productTitle(p))}" loading="lazy" width="900" height="900">
        <span class="product-card__badge">#${p.size}</span>
      </div>
      <div class="product-card__body">
        <h3>${escapeHTML(productTitle(p))}</h3>
        <p class="product-card__meta">${escapeHTML(p.tag)}</p>
        <button class="product-card__viewlink" data-detail="${p.id}">Ver características →</button>
        <div class="product-card__foot">
          <span class="price">${formatMXN(p.price)}</span>
          <button class="btn btn--small btn--primary" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    </article>
  `).join('');

  // Un solo listener para todas las tarjetas
  grid.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if(add){ addToCart(add.dataset.add); return; }
    const detail = e.target.closest('[data-detail]');
    if(detail){ openProductModal(detail.dataset.detail); }
  });
}

// ============ MODAL DE CARACTERÍSTICAS ============
let currentModalId = null;

function openProductModal(id){
  const p = PRODUCT_BY_ID[id];
  if(!p) return;
  currentModalId = id;
  const title = productTitle(p);

  document.getElementById('pmTagline').textContent = p.tag;
  document.getElementById('pmTitle').textContent = title;
  document.getElementById('pmBadge').textContent = '#' + p.size;
  document.getElementById('pmSizeNum').textContent = p.size;
  document.getElementById('pmSizeText').textContent = 'Balón número ' + p.size + ' · ' + SIZES[p.size].label;
  document.getElementById('pmPrice').textContent = formatMXN(p.price);
  document.getElementById('pmDesc').textContent = PRODUCT_DESCRIPTION;
  document.getElementById('pmSpecs').innerHTML = specsFor(p).map(([label, value]) =>
    `<div><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></div>`
  ).join('');

  // Galería (si algún día agregas p.images = ['a.jpg','b.jpg'] salen miniaturas)
  const images = p.images && p.images.length ? p.images : [p.image];
  const mainImg = document.getElementById('pmMainImg');
  mainImg.src = images[0];
  mainImg.alt = 'Balón ' + title;
  const thumbsEl = document.getElementById('pmThumbs');
  thumbsEl.innerHTML = '';
  if(images.length > 1){
    images.forEach((src, i) => {
      const t = document.createElement('img');
      t.src = src;
      t.alt = 'Balón ' + title + ' foto ' + (i + 1);
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

// ============ ESTADO DEL CARRITO ============
// Se limpian automáticamente productos que ya no existen en PRODUCTS
// y cantidades mayores al stock (evita carritos "fantasma").
function getCart(){
  let raw = {};
  try{ raw = JSON.parse(localStorage.getItem(CART_KEY) || '{}') || {}; }catch(e){ raw = {}; }
  const clean = {};
  Object.entries(raw).forEach(([id, qty]) => {
    const p = PRODUCT_BY_ID[id];
    const n = Math.floor(Number(qty));
    if(p && n > 0) clean[id] = Math.min(n, p.stock);
  });
  return clean;
}
function saveCart(cart){
  try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  catch(e){ console.error('No se pudo guardar el carrito', e); }
}
function getCity(){
  try{
    const c = localStorage.getItem(CITY_KEY);
    return CITIES[c] ? c : null;
  }catch(e){ return null; }
}
function setCity(key){
  try{ localStorage.setItem(CITY_KEY, key); }catch(e){}
  renderCart();
}

function addToCart(id){
  const p = PRODUCT_BY_ID[id];
  if(!p) return;
  const cart = getCart();
  cart[id] = Math.min((cart[id] || 0) + 1, p.stock);
  saveCart(cart);
  renderCart();
  openCart();
}
function changeQty(id, delta){
  const p = PRODUCT_BY_ID[id];
  const cart = getCart();
  if(!p || !cart[id]) return;
  cart[id] = Math.min(cart[id] + delta, p.stock);
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

// ============ PEDIDO POR WHATSAPP ============
function cartSubtotal(cart){
  return Object.entries(cart).reduce((sum, [id, qty]) => sum + PRODUCT_BY_ID[id].price * qty, 0);
}

function buildWhatsappMessage(cart, cityKey){
  const city = CITIES[cityKey];
  const subtotal = cartSubtotal(cart);
  const lines = ['Hola Basket94, quiero hacer este pedido:', ''];

  Object.entries(cart).forEach(([id, qty]) => {
    const p = PRODUCT_BY_ID[id];
    lines.push('• ' + qty + ' x ' + productTitle(p) + ' — ' + formatMXN(p.price * qty));
  });

  lines.push('', 'Ciudad: ' + city.name, 'Subtotal: ' + formatMXN(subtotal));
  if(city.cost === null){
    lines.push('Envío: por cotizar', 'Total (sin envío): ' + formatMXN(subtotal));
  }else{
    lines.push('Envío: ' + (city.cost === 0 ? 'Gratis' : formatMXN(city.cost)));
    lines.push('Total a pagar: ' + formatMXN(subtotal + city.cost));
  }
  lines.push('', 'Te comparto mi ubicación por aquí para coordinar la entrega. Pago al recibir (efectivo o transferencia).');
  return lines.join('\n');
}

function setCheckoutState(enabled, hint, href){
  const btn = document.getElementById('waCheckout');
  document.getElementById('cartHint').textContent = hint;
  if(enabled){
    btn.classList.remove('is-disabled');
    btn.setAttribute('aria-disabled', 'false');
    btn.removeAttribute('tabindex');
    btn.href = href;
    btn.target = '_blank';
    btn.rel = 'noopener';
  }else{
    btn.classList.add('is-disabled');
    btn.setAttribute('aria-disabled', 'true');
    btn.tabIndex = -1;
    btn.removeAttribute('href');
    btn.removeAttribute('target');
  }
}

// ============ RENDER DEL CARRITO ============
const PIN_ICON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.800 12 21 12 21z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="9.500" r="2.500" fill="currentColor"/></svg>';

function renderCart(){
  const cart = getCart();
  const ids = Object.keys(cart);
  const cityKey = getCity();
  const city = cityKey ? CITIES[cityKey] : null;

  const itemsEl   = document.getElementById('cartItems');
  const countEl   = document.getElementById('cartCount');
  const cityStep  = document.getElementById('cityStep');
  const sumStep   = document.getElementById('summaryStep');

  // Contador del ícono: solo se muestra si hay productos
  const count = ids.reduce((n, id) => n + cart[id], 0);
  countEl.textContent = String(count);
  countEl.hidden = count === 0;

  // Carrito vacío: se limpia todo
  if(ids.length === 0){
    itemsEl.innerHTML = '<p class="cart-empty">Aún no has agregado nada. Elige tu balón.</p>';
    cityStep.hidden = true;
    sumStep.hidden = true;
    setCheckoutState(false, 'Agrega al menos un balón para continuar.');
    return;
  }

  // Paso 1: productos
  itemsEl.innerHTML = ids.map(id => {
    const p = PRODUCT_BY_ID[id];
    const qty = cart[id];
    const atMax = qty >= p.stock;
    return `
      <div class="cart-item">
        <div>
          <div class="cart-item__name">${escapeHTML(productTitle(p))}</div>
          <div class="cart-item__price">${formatMXN(p.price)} c/u</div>
          ${atMax ? '<div class="cart-item__note">Máximo disponible</div>' : ''}
        </div>
        <div class="cart-item__qty">
          <button data-decrement="${id}" aria-label="Quitar uno">−</button>
          <span>${qty}</span>
          <button data-increment="${id}" aria-label="Agregar uno" ${atMax ? 'disabled' : ''}>+</button>
        </div>
        <button class="cart-item__remove" data-remove="${id}">Quitar</button>
      </div>`;
  }).join('');

  // Paso 2: ciudad (botones visuales)
  cityStep.hidden = false;
  document.getElementById('cityOptions').innerHTML = Object.entries(CITIES).map(([key, c]) => `
    <button type="button" class="city-btn ${key === cityKey ? 'is-selected' : ''}" role="radio"
            aria-checked="${key === cityKey}" data-city="${key}">
      <span class="city-btn__name">${PIN_ICON}${c.name}</span>
      <span class="city-btn__cost">${c.costLabel}</span>
    </button>`).join('');
  document.getElementById('cityNote').textContent =
    cityKey === 'otra' ? 'Te confirmamos el costo de envío por WhatsApp.' : '';

  // Paso 3: resumen
  const subtotal = cartSubtotal(cart);
  sumStep.hidden = false;
  document.getElementById('sumSubtotal').textContent = formatMXN(subtotal);

  const shipEl  = document.getElementById('sumShipping');
  const totalEl = document.getElementById('sumTotal');
  const labelEl = document.getElementById('sumTotalLabel');
  shipEl.classList.remove('is-free');

  if(!city){
    shipEl.textContent = 'Elige tu ciudad';
    labelEl.textContent = 'Total';
    totalEl.textContent = formatMXN(subtotal);
  }else if(city.cost === null){
    shipEl.textContent = 'Por cotizar';
    labelEl.textContent = 'Total (sin envío)';
    totalEl.textContent = formatMXN(subtotal);
  }else{
    shipEl.textContent = city.cost === 0 ? 'Gratis' : formatMXN(city.cost);
    if(city.cost === 0) shipEl.classList.add('is-free');
    labelEl.textContent = 'Total a pagar';
    totalEl.textContent = formatMXN(subtotal + city.cost);
  }

  // Botón de WhatsApp: solo se habilita con productos + ciudad
  if(!city){
    setCheckoutState(false, 'Elige tu ciudad para habilitar el pedido por WhatsApp.');
  }else{
    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildWhatsappMessage(cart, cityKey));
    setCheckoutState(true, 'Se abrirá WhatsApp con tu pedido listo para confirmar.', url);
  }
}

// ============ CAJÓN DEL CARRITO ============
function openCart(){
  document.getElementById('cartDrawer').classList.add('is-open');
  document.getElementById('cartOverlay').classList.add('is-open');
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('is-open');
  document.getElementById('cartOverlay').classList.remove('is-open');
}

// ============ POPUP DE SUSCRIPCIÓN ============
function openNewsletterPopup(){
  document.getElementById('newsletterPopup').classList.add('is-open');
  document.getElementById('newsletterOverlay').classList.add('is-open');
}
function closeNewsletterPopup(){
  document.getElementById('newsletterPopup').classList.remove('is-open');
  document.getElementById('newsletterOverlay').classList.remove('is-open');
}

function initNewsletterPopup(){
  const popup = document.getElementById('newsletterPopup');
  const overlay = document.getElementById('newsletterOverlay');
  const closeBtn = document.getElementById('newsletterClose');
  const form = document.getElementById('newsletterForm');
  if(!popup || !overlay || !form) return;

  let status = null;
  try{ status = localStorage.getItem(NEWSLETTER_KEY); }catch(e){ status = null; }

  // Se muestra una sola vez por navegador
  if(status === 'subscribed' || status === 'dismissed') return;

  setTimeout(openNewsletterPopup, 3800);   // justo cuando termina el preloader

  const dismiss = () => {
    closeNewsletterPopup();
    try{ localStorage.setItem(NEWSLETTER_KEY, 'dismissed'); }catch(e){}
  };
  closeBtn.addEventListener('click', dismiss);
  overlay.addEventListener('click', dismiss);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    if(!email) return;
    try{
      localStorage.setItem(NEWSLETTER_KEY, 'subscribed');
      localStorage.setItem('basket94_newsletter_email', email);
    }catch(err){}
    form.hidden = true;
    document.getElementById('newsletterSuccess').hidden = false;
  });
}

// ============ PRELOADER ============
function initPreloader(){
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  if(!preloader || !fill) return;

  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => { fill.style.width = '100%'; });

  setTimeout(() => {
    preloader.classList.add('is-hidden');
    document.body.style.overflow = '';
    restartHeroVideo();                      // el video arranca desde el inicio al revelar la página
    setTimeout(() => { preloader.style.display = 'none'; }, 500);
  }, 3000);
}

// ============ WHATSAPP BURBUJA ============
function initWhatsappBubble(){
  const bubble = document.getElementById('whatsappBubble');
  if(!bubble) return;
  function show(){
    bubble.classList.add('is-visible');
    setTimeout(() => bubble.classList.remove('is-visible'), 4000);
  }
  setTimeout(show, 4000);
  setInterval(show, 10000);
}

// ============ HERO: SLIDER + PARALLAX + VIDEO ============
function restartHeroVideo(){
  const video = document.getElementById('heroVideo');
  if(!video || REDUCED_MOTION) return;
  video.currentTime = 0;
  const p = video.play();
  if(p && p.catch) p.catch(() => {});
}

function initHero(){
  const hero = document.getElementById('top');
  const slider = document.getElementById('heroSlider');
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dots button');
  const video = document.getElementById('heroVideo');

  // Video del iPhone: silenciado + inline para que el autoplay funcione en móvil
  if(video){
    video.muted = true;
    if(REDUCED_MOTION){
      video.removeAttribute('autoplay');
      video.pause();                         // se queda el póster (conversación completa)
    }else if('IntersectionObserver' in window){
      // Pausa el video cuando el hero no se ve (ahorra batería y datos)
      new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){ const p = video.play(); if(p && p.catch) p.catch(() => {}); }
          else video.pause();
        });
      }, { threshold: 0.15 }).observe(video);
    }
  }

  if(!hero || !slider || slides.length === 0) return;

  let current = 0;
  function goTo(index){
    slides[current].classList.remove('is-active');
    dots[current]?.classList.remove('is-active');
    current = index;
    slides[current].classList.add('is-active');
    dots[current]?.classList.add('is-active');
  }
  setInterval(() => goTo((current + 1) % slides.length), 5000);
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  if(!REDUCED_MOTION){
    let ticking = false;
    window.addEventListener('scroll', () => {
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        slider.style.transform = `translate3d(0, ${rect.top * 0.35}px, 0)`;
        ticking = false;
      });
    }, { passive: true });
  }
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initPreloader();
  initNewsletterPopup();
  initHero();
  renderCart();
  initWhatsappBubble();

  // Modal de características
  document.getElementById('productModalClose').addEventListener('click', closeProductModal);
  document.getElementById('productModalOverlay').addEventListener('click', closeProductModal);
  document.getElementById('pmAddBtn').addEventListener('click', () => {
    if(!currentModalId) return;
    addToCart(currentModalId);
    closeProductModal();
  });

  // Escape cierra modal y popup
  document.addEventListener('keydown', (e) => {
    if(e.key !== 'Escape') return;
    closeProductModal();
    if(document.getElementById('newsletterPopup').classList.contains('is-open')){
      closeNewsletterPopup();
      try{ localStorage.setItem(NEWSLETTER_KEY, 'dismissed'); }catch(err){}
    }
  });

  // Cajón del carrito
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);

  // Cantidades / quitar (delegación, porque las filas se vuelven a dibujar)
  document.getElementById('cartItems').addEventListener('click', (e) => {
    const inc = e.target.closest('[data-increment]');
    const dec = e.target.closest('[data-decrement]');
    const rem = e.target.closest('[data-remove]');
    if(inc) changeQty(inc.dataset.increment, 1);
    if(dec) changeQty(dec.dataset.decrement, -1);
    if(rem) removeFromCart(rem.dataset.remove);
  });

  // Elegir ciudad
  document.getElementById('cityOptions').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-city]');
    if(btn) setCity(btn.dataset.city);
  });

  // El botón de WhatsApp deshabilitado no hace nada
  document.getElementById('waCheckout').addEventListener('click', (e) => {
    if(e.currentTarget.getAttribute('aria-disabled') === 'true') e.preventDefault();
  });

  // Botones con scroll suave (CTA del hero)
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector(btn.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Menú móvil
  const burger = document.getElementById('burgerBtn');
  const links = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
});
