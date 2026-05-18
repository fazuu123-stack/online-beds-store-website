/* ============================================================
   SENNA BEDS — script.js  v3.0
   Full interactive site — cart sync, sidebar, image popup,
   shop filters, blog modal, page loader on all pages
============================================================ */

const CART_KEY = 'senna_cart';
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  pageLoader();
  initNavigation();
  initScrollHeader();
  initHeroSlider();
  initTestimonialSlider();
  initFAQ();
  initGalleryPopup();
  initScrollReveal();
  initAddToCartButtons();
  initShopPage();
  initCartSystem();
  renderCartPage();
  initCheckoutPage();
  updateCartUI();
  initShopFilters();
  initBlogCards();
  initCategoryFilter();

  /* Newsletter */
  document.getElementById('newsletterBtn')?.addEventListener('click', () => {
    const inp = document.querySelector('.newsletter input');
    if (inp && inp.value) { showToast('Subscribed! Welcome to Senna Beds.'); inp.value = ''; }
    else showToast('Please enter a valid email.');
  });

  /* Discount form */
  document.querySelector('.discount-form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('You\'re subscribed! Expect exclusive offers soon.');
    e.target.reset();
  });

  /* Contact form */
  document.querySelector('.contact-form form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you soon.");
    e.target.reset();
  });

  /* Blog reply */
  document.querySelector('.reply-form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Comment posted! Thank you.');
    e.target.reset();
  });

  /* Coupon */
  document.querySelector('.coupon-box button')?.addEventListener('click', () => {
    const val = document.querySelector('.coupon-box input')?.value.trim();
    if (val === 'SENNA10') {
      showToast('Coupon applied! 10% discount added.');
    } else if (val) {
      showToast('Invalid coupon code.');
    }
  });

  /* Proceed to checkout button on cart page */
  document.querySelector('.proceed-checkout')?.addEventListener('click', e => {
    if (cart.length === 0) {
      e.preventDefault();
      showToast('Your cart is empty. Add some products first!');
    }
  });
});

/* ─────────────────────────────────────────────
   PAGE LOADER — runs on every page
───────────────────────────────────────────── */
function pageLoader() {
  /* If a loader element already exists in the HTML, use it */
  let loader = document.getElementById('pageLoader');

  /* If the page doesn't have one, inject it dynamically */
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-inner">
        <div class="loader-logo">Senna <span>Beds</span></div>
        <div class="loader-bar"></div>
      </div>`;
    document.body.prepend(loader);
  }

  /* Hide after 1.2 s */
  setTimeout(() => loader.classList.add('hidden'), 1200);
}

/* ─────────────────────────────────────────────
   NAVIGATION — hamburger + cart on ALL pages
───────────────────────────────────────────── */
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar   = document.querySelector('.sidebar-menu');
  const overlay   = document.querySelector('.sidebar-overlay');
  const closeBtn  = document.querySelector('.close-sidebar');

  /* Sidebar helpers */
  const openSidebar = () => {
    sidebar?.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeSidebar = () => {
    sidebar?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', (e) => {
    /* Only close sidebar when clicking the sidebar overlay, not the cart overlay */
    if (e.target === overlay) closeSidebar();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSidebar(); closeCartDrawer(); closeImagePopup(); closeBlogModal(); }
  });
}

function initScrollHeader() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   SLIDERS
───────────────────────────────────────────── */
function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;
  let idx = 0;
  const show = () => {
    slides.forEach(s => s.classList.remove('active'));
    slides[idx].classList.add('active');
    idx = (idx + 1) % slides.length;
  };
  show(); setInterval(show, 3500);
}

function initTestimonialSlider() {
  const cards   = document.querySelectorAll('.testimonial-card');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  if (!cards.length) return;
  let cur = 0;
  const show = i => {
    cards.forEach(c => c.classList.remove('active'));
    cards[i].classList.add('active');
  };
  show(0);
  nextBtn?.addEventListener('click', () => { cur = (cur + 1) % cards.length; show(cur); });
  prevBtn?.addEventListener('click', () => { cur = (cur - 1 + cards.length) % cards.length; show(cur); });
  setInterval(() => { cur = (cur + 1) % cards.length; show(cur); }, 5000);
}

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* ─────────────────────────────────────────────
   IMAGE POPUP — larger, centred, with zoom-in
───────────────────────────────────────────── */
function initGalleryPopup() {
  /* Sidebar gallery images */
  document.querySelectorAll('.sidebar-gallery img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openImagePopup(img.src, img.alt || ''));
  });

  /* Any image with data-popup attribute */
  document.querySelectorAll('[data-popup]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => openImagePopup(el.dataset.popup || el.src, el.alt || ''));
  });

  document.getElementById('closePopup')?.addEventListener('click', closeImagePopup);
  document.getElementById('imagePopup')?.addEventListener('click', e => {
    if (e.target === document.getElementById('imagePopup')) closeImagePopup();
  });
}

function openImagePopup(src, caption) {
  let popup = document.getElementById('imagePopup');

  /* Inject popup into DOM if it doesn't exist yet */
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'imagePopup';
    popup.className = 'image-popup-overlay';
    popup.innerHTML = `
      <div class="image-popup-inner">
        <button id="closePopup" class="popup-close" aria-label="Close">&times;</button>
        <img id="popupImg" src="" alt="Gallery image">
        <p id="popupCaption" class="popup-caption"></p>
      </div>`;
    document.body.appendChild(popup);

    /* Re-bind close button now that DOM node exists */
    document.getElementById('closePopup').addEventListener('click', closeImagePopup);
    popup.addEventListener('click', e => { if (e.target === popup) closeImagePopup(); });
  }

  const img     = document.getElementById('popupImg');
  const capEl   = document.getElementById('popupCaption');
  if (img) img.src = src;
  if (capEl) capEl.textContent = caption || '';

  popup.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeImagePopup() {
  document.getElementById('imagePopup')?.classList.remove('active');
  /* Only restore scroll if no other overlay is open */
  if (!document.querySelector('.sidebar-overlay.active') &&
      !document.getElementById('cartOverlay')?.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

/* ─────────────────────────────────────────────
   BLOG MODAL — open full blog post in overlay
───────────────────────────────────────────── */
function initBlogCards() {
  document.querySelectorAll('.blog-card').forEach(card => {
    const link = card.querySelector('a');
    const title = card.querySelector('h3')?.textContent || 'Blog Post';
    const date  = card.querySelector('.date')?.textContent || '';
    const text  = card.querySelector('p')?.textContent || '';
    const img   = card.querySelector('.blog-img img')?.src || '';

    /* Intercept "Read More" links on cards that point to blog.html (same page context) */
    if (link) {
      link.addEventListener('click', e => {
        /* Only intercept if we're already on the blog list page (no hash/anchor) */
        if (link.href.includes('blog.html') || link.getAttribute('href') === '#') {
          e.preventDefault();
          openBlogModal({ title, date, text, img });
        }
      });
    }

    /* Clicking the card image also opens modal */
    card.querySelector('.blog-img')?.addEventListener('click', () => {
      openBlogModal({ title, date, text, img });
    });
  });
}

function openBlogModal({ title, date, text, img }) {
  let modal = document.getElementById('blogModal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'blogModal';
    modal.className = 'blog-modal-overlay';
    modal.innerHTML = `
      <div class="blog-modal-inner">
        <button id="closeBlogModal" class="popup-close" aria-label="Close">&times;</button>
        <div class="blog-modal-img-wrap">
          <img id="blogModalImg" src="" alt="">
        </div>
        <div class="blog-modal-body">
          <p id="blogModalDate" class="blog-date"></p>
          <h2 id="blogModalTitle" class="blog-title"></h2>
          <p id="blogModalText" class="blog-text"></p>
          <p class="blog-text">Luxury sleep is not a destination — it is a daily practice. The art of choosing the right bed frame, mattress, and bedroom aesthetic transforms your space into a sanctuary. Our curated collections bring together craftsmanship, comfort, and timeless design so every night feels like a retreat.</p>
          <p class="blog-text">From hand-stitched headboards to precision-engineered pocket spring cores, every Senna Beds piece is built with intention. Our design philosophy blends the warmth of natural materials with the clean lines of contemporary living, giving you furniture that endures both in style and structure.</p>
        </div>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById('closeBlogModal').addEventListener('click', closeBlogModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeBlogModal(); });
  }

  document.getElementById('blogModalImg').src   = img;
  document.getElementById('blogModalDate').textContent  = date;
  document.getElementById('blogModalTitle').textContent = title;
  document.getElementById('blogModalText').textContent  = text;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBlogModal() {
  document.getElementById('blogModal')?.classList.remove('active');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.product-card,.blog-card,.why-card,.sale-box,.banner,.shop-card,.stat-card,.info-box,.recent-card,.senna-checkout-box,.senna-summary-box,.cart-product,.cart-summary-box,.category-card'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────
   CART SYSTEM
───────────────────────────────────────────── */

/* Delegate add-to-cart for all pages */
function initAddToCartButtons() {
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.add-cart-btn');
    if (!btn) return;
    const product = {
      id   : btn.dataset.id,
      name : btn.dataset.name,
      price: parseFloat(btn.dataset.price),
      image: btn.dataset.image || ''
    };
    if (!product.id || !product.name || isNaN(product.price)) return;
    addToCart(product);
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
    btn.classList.add('added');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('added'); }, 1800);
  });
}

/* Wire up shop page cards */
function initShopPage() {
  document.querySelectorAll('.shop-card').forEach((card, i) => {
    const btn   = card.querySelector('button');
    const name  = card.querySelector('h3')?.textContent?.trim() || 'Product';
    const priceText = card.querySelector('p')?.textContent?.replace(/[^0-9.]/g, '') || '0';
    const price = parseFloat(priceText) || 0;
    const image = card.querySelector('img')?.src || '';
    if (btn) {
      btn.classList.add('add-cart-btn');
      btn.dataset.id    = `shop-${i + 1}`;
      btn.dataset.name  = name;
      btn.dataset.price = price;
      btn.dataset.image = image;
    }
  });
}

/* Cart drawer trigger — works on ALL pages via delegation */
function initCartSystem() {
  document.body.addEventListener('click', e => {
    /* Cart icon button — covers any element with id cartIconBtn or class cart-icon */
    const cartTrigger = e.target.closest('#cartIconBtn') || e.target.closest('.cart-icon a');
    if (cartTrigger) {
      e.preventDefault();
      openCartDrawer();
      return;
    }
    if (e.target.closest('#closeCart'))  { closeCartDrawer(); return; }
    if (e.target.id === 'cartOverlay')   { closeCartDrawer(); return; }
  });
}

function openCartDrawer() {
  document.getElementById('cartDrawer')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCartDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('active');
  document.getElementById('cartOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

/* Core cart operations */
function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart();
  updateCartUI();
  openCartDrawer();
  showToast(`${product.name} added to cart`);
  bumpCartCount();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); updateCartUI(); renderCartPage();
}

function changeQuantity(id, action) {
  cart = cart.map(i => {
    if (i.id === id) i.quantity += (action === 'increase' ? 1 : -1);
    return i;
  }).filter(i => i.quantity > 0);
  saveCart(); updateCartUI(); renderCartPage();
}

/* ── UPDATE CART DRAWER ── */
function updateCartUI() {
  const container = document.getElementById('cartItemsContainer');
  const countEls  = document.querySelectorAll('.cart-count');
  const totalEl   = document.getElementById('cartTotal');

  let total = 0, totalItems = 0, html = '';

  if (!cart.length) {
    if (container) container.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <h3>Your cart is empty</h3>
        <p>Add luxury furniture to start shopping</p>
        <a href="shop.html" class="view-collection-btn">View Collection</a>
      </div>`;
    countEls.forEach(el => el.textContent = '0');
    if (totalEl) totalEl.textContent = '$0.00';
    renderCartPage();
    return;
  }

  cart.forEach(item => {
    const sub = item.price * item.quantity;
    total += sub; totalItems += item.quantity;
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/80x80/f4f4f0/0A2240?text=Bed'">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          <div class="cart-quantity">
            <button onclick="changeQuantity('${item.id}','decrease')">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity('${item.id}','increase')">+</button>
          </div>
          <button class="remove-item" onclick="removeFromCart('${item.id}')">× Remove</button>
        </div>
      </div>`;
  });

  if (container) container.innerHTML = html;
  countEls.forEach(el => el.textContent = totalItems);
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  renderCartPage();
}

/* ── CART PAGE (cart.html) — fully synced ── */
function renderCartPage() {
  const pageItems    = document.querySelector('.cart-page-items');
  const pageSubtotal = document.querySelector('.cart-subtotal-val');
  const pageTotal    = document.querySelector('.cart-total-val');
  if (!pageItems) return;

  if (!cart.length) {
    pageItems.innerHTML = `
      <div class="cart-page-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <h2>Your cart is empty</h2>
        <a href="shop.html" class="view-collection-btn">Browse Shop</a>
      </div>`;
    if (pageSubtotal) pageSubtotal.textContent = '$0.00';
    if (pageTotal)    pageTotal.textContent    = '$0.00';
    return;
  }

  let html = '', total = 0;
  cart.forEach(item => {
    const sub = item.price * item.quantity;
    total += sub;
    html += `
      <div class="cart-product reveal visible">
        <div class="cart-product-info">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/90x80/f4f4f0/0A2240?text=Bed'">
          <div class="cart-details">
            <h3>${item.name}</h3>
            <p class="product-price">$${item.price.toFixed(2)}</p>
            <button class="remove-item-btn" onclick="removeFromCart('${item.id}')">× Remove</button>
          </div>
        </div>
        <div class="cart-quantity">
          <button onclick="changeQuantity('${item.id}','decrease')">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity('${item.id}','increase')">+</button>
        </div>
        <div class="cart-subtotal">$${sub.toFixed(2)}</div>
      </div>`;
  });

  pageItems.innerHTML = html;
  if (pageSubtotal) pageSubtotal.textContent = `$${total.toFixed(2)}`;
  if (pageTotal)    pageTotal.textContent    = `$${total.toFixed(2)}`;
}

/* ── CHECKOUT PAGE ── */
function initCheckoutPage() {
  const wrapper = document.getElementById('checkoutItemsWrapper');
  const subEl   = document.getElementById('checkoutSubtotal');
  const totalEl = document.getElementById('checkoutTotal');
  const btn     = document.querySelector('.senna-place-order');
  if (!wrapper) return;

  /* Always read fresh from localStorage */
  const cartData = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  if (!cartData.length) {
    wrapper.innerHTML = `<p style="color:rgba(255,255,255,.5);font-size:14px;padding:10px 0">No items in cart. <a href="shop.html" style="color:var(--gold)">Go shopping →</a></p>`;
    if (subEl)   subEl.textContent   = '$0.00';
    if (totalEl) totalEl.textContent = '$0.00';
    return;
  }

  let html = '', total = 0;
  cartData.forEach(item => {
    const sub = item.price * item.quantity;
    total += sub;
    html += `
      <div class="senna-product">
        <div class="senna-product-info">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/56x56/0f2f5a/C6A769?text=B'">
          <div><h4>${item.name}</h4><span>Qty: ${item.quantity}</span></div>
        </div>
        <h5>$${sub.toFixed(2)}</h5>
      </div>`;
  });

  wrapper.innerHTML = html;
  if (subEl)   subEl.textContent   = `$${total.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  btn?.addEventListener('click', () => {
    const firstName = document.getElementById('firstName')?.value.trim();
    const street    = document.getElementById('street')?.value.trim();
    const phone     = document.getElementById('phone')?.value.trim();
    const email     = document.getElementById('email')?.value.trim();

    if (!firstName || !street || !phone || !email) {
      showToast('Please fill in all required fields.');
      return;
    }

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Placing Order...';
    btn.disabled = true;

    setTimeout(() => {
      localStorage.removeItem(CART_KEY);
      cart = [];
      updateCartUI();
      showToast('🎉 Order placed! Thank you for shopping with Senna Beds.');
      setTimeout(() => window.location.href = 'index.html', 2500);
    }, 1500);
  });
}

/* ─────────────────────────────────────────────
   SHOP PAGE — filter by category + sort
───────────────────────────────────────────── */
function initShopFilters() {
  const categoryCards = document.querySelectorAll('.category-card');
  const sortSelect    = document.querySelector('.shop-toolbar select');
  const shopCards     = document.querySelectorAll('.shop-card');
  if (!shopCards.length) return;

  /* Category filter */
  categoryCards.forEach(cat => {
    cat.style.cursor = 'pointer';
    cat.addEventListener('click', () => {
      categoryCards.forEach(c => c.classList.remove('active-cat'));
      cat.classList.add('active-cat');

      const filterName = cat.querySelector('h4')?.textContent?.toLowerCase() || 'all';
      shopCards.forEach(card => {
        const name = card.querySelector('h3')?.textContent?.toLowerCase() || '';
        if (filterName === 'all' || name.includes(filterName.split(' ')[0])) {
          card.style.display = '';
          card.style.animation = 'fadeInUp .4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });

      showToast(`Showing: ${cat.querySelector('h4')?.textContent || 'All'}`);
    });
  });

  /* Sort */
  sortSelect?.addEventListener('change', () => {
    const val   = sortSelect.value.toLowerCase();
    const grid  = document.querySelector('.shop-products');
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.shop-card')];

    cards.sort((a, b) => {
      const priceA = parseFloat(a.querySelector('p')?.textContent?.replace(/[^0-9.]/g,'') || 0);
      const priceB = parseFloat(b.querySelector('p')?.textContent?.replace(/[^0-9.]/g,'') || 0);
      if (val.includes('low'))  return priceA - priceB;
      if (val.includes('high')) return priceB - priceA;
      return 0;
    });

    cards.forEach(c => grid.appendChild(c));
  });
}

/* Category filter for home page featured section */
function initCategoryFilter() {
  const tabs = document.querySelectorAll('[data-category]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.category;
      document.querySelectorAll('.product-card').forEach(card => {
        const cardCat = card.dataset.category || 'all';
        if (cat === 'all' || cardCat === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function bumpCartCount() {
  document.querySelectorAll('.cart-count').forEach(el => {
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 320);
  });
}

/* ── GLOBAL EXPORTS ── */
window.addToCart       = addToCart;
window.removeFromCart  = removeFromCart;
window.changeQuantity  = changeQuantity;
window.updateCartUI    = updateCartUI;
window.openCartDrawer  = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.showToast       = showToast;
window.openImagePopup  = openImagePopup;
window.closeImagePopup = closeImagePopup;