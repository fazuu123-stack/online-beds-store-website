/* ============================================================
   SENNA BEDS — shop.js
   Complete shop page functionality with filtering, sorting,
   pagination, and database-ready structure
============================================================ */

let currentPage = 1;
const productsPerPage = 12;
let filteredProducts = [...PRODUCTS];
let currentSort = 'default';
let currentCategory = 'all';

/* ── INIT ── */
document.addEventListener("DOMContentLoaded", () => {
  renderShop();
  setupCategoryFilters();
  setupSorting();
  setupPagination();
});

/* ─────────────────────────────────────────────
   RENDER SHOP — main product grid
───────────────────────────────────────────── */
function renderShop() {
  const grid = document.getElementById("shopProductsGrid");
  if (!grid) return;

  /* Calculate pagination */
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginated = filteredProducts.slice(start, end);

  /* Update toolbar info */
  updateToolbar();

  /* Render products */
  grid.innerHTML = paginated.map((product, idx) => `
    <div class="shop-card reveal" style="animation-delay: ${idx * 50}ms">
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.title}" onerror="this.src='https://placehold.co/300x300/f4f4f0/0A2240?text=${encodeURIComponent(product.title)}'">
        ${product.featured ? '<span class="badge-featured">Featured</span>' : ''}
        ${product.oldPrice > product.price ? `<span class="badge-sale">${Math.round((1 - product.price / product.oldPrice) * 100)}% OFF</span>` : ''}
      </div>
      
      <div class="product-details">
        <h3>${product.title}</h3>
        
        <div class="rating">
          ${generateStars(product.rating)}
          <span class="rating-text">(${product.rating}/5)</span>
        </div>

        <div class="price-section">
          <p class="price">$${product.price.toFixed(2)}</p>
          ${product.oldPrice > product.price ? `<p class="old-price">$${product.oldPrice.toFixed(2)}</p>` : ''}
        </div>

        <p class="product-desc">${product.description.substring(0, 80)}...</p>

        <div class="product-meta">
          <span class="stock ${product.stock <= 5 ? 'low-stock' : 'in-stock'}">
            ${product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
          </span>
        </div>

        <div class="product-actions">
          <button class="add-cart-btn" 
            data-id="${product.id}"
            data-name="${product.title}"
            data-price="${product.price}"
            data-image="${product.image}">
            <i class="fa-solid fa-cart-shopping"></i> Add to Cart
          </button>
          <a href="product.html?id=${product.id}" class="view-btn" title="View Details">
            <i class="fa-solid fa-eye"></i>
          </a>
        </div>
      </div>
    </div>
  `).join("");

  /* Add scroll reveal animation class */
  grid.querySelectorAll('.shop-card').forEach((card, i) => {
    card.style.transitionDelay = `${(i % 4) * 80}ms`;
  });
}

/* ─────────────────────────────────────────────
   UPDATE TOOLBAR
───────────────────────────────────────────── */
function updateToolbar() {
  const toolbar = document.querySelector(".shop-toolbar p");
  if (!toolbar) return;

  const start = (currentPage - 1) * productsPerPage + 1;
  const end = Math.min(currentPage * productsPerPage, filteredProducts.length);
  const total = filteredProducts.length;

  toolbar.textContent = `Showing ${start}–${end} of ${total} products`;
}

/* ─────────────────────────────────────────────
   GENERATE STARS
───────────────────────────────────────────── */
function generateStars(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= rating 
      ? '<i class="fa-solid fa-star"></i>' 
      : '<i class="fa-regular fa-star"></i>';
  }
  return html;
}

/* ─────────────────────────────────────────────
   CATEGORY FILTERS
───────────────────────────────────────────── */
function setupCategoryFilters() {
  const categoryCards = document.querySelectorAll(".category-card");
  
  categoryCards.forEach(card => {
    card.addEventListener("click", () => {
      /* Update active state */
      categoryCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      /* Get category */
      const categoryText = card.querySelector("h4")?.textContent?.toLowerCase() || "all";
      
      /* Map display names to category keys */
      const categoryMap = {
        "upholstered beds": "upholstered",
        "ottoman beds": "ottoman",
        "chairs": "chair",
        "mattress": "mattress"
      };

      const categoryKey = categoryMap[categoryText] || "all";
      currentCategory = categoryKey;
      currentPage = 1;

      /* Filter products */
      if (categoryKey === "all") {
        filteredProducts = [...PRODUCTS];
      } else {
        filteredProducts = PRODUCTS.filter(p => p.category === categoryKey);
      }

      renderShop();
      setupPagination();
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast(`Showing: ${card.querySelector("h4")?.textContent || "All Products"}`);
    });
  });
}

/* ─────────────────────────────────────────────
   SORTING
───────────────────────────────────────────── */
function setupSorting() {
  const sortSelect = document.getElementById("shopSort");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    currentPage = 1;

    /* Sort products */
    filteredProducts = sortProducts(filteredProducts, currentSort);
    renderShop();
    setupPagination();
    showToast(`Sorted: ${sortSelect.options[sortSelect.selectedIndex].text}`);
  });
}

/* ─────────────────────────────────────────────
   PAGINATION
───────────────────────────────────────────── */
function setupPagination() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginationContainer = document.querySelector(".shop-pagination");

  if (!paginationContainer) {
    /* Create pagination if it doesn't exist */
    const grid = document.getElementById("shopProductsGrid");
    if (grid && grid.parentElement) {
      const pagination = document.createElement("div");
      pagination.className = "shop-pagination";
      grid.parentElement.appendChild(pagination);
    }
  }

  const pagination = document.querySelector(".shop-pagination");
  if (!pagination || totalPages <= 1) return;

  let html = `
    <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
      onclick="changePage(1)" ${currentPage === 1 ? 'disabled' : ''}>
      <i class="fa-solid fa-chevron-left"></i>
    </button>
  `;

  /* Page numbers */
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    html += `
      <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
        onclick="changePage(${i})">${i}</button>
    `;
  }

  html += `
    <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
      onclick="changePage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `;

  pagination.innerHTML = html;
}

/* Change page */
function changePage(page) {
  currentPage = page;
  renderShop();
  setupPagination();
  document.getElementById("shopProductsGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─────────────────────────────────────────────
   QUICK VIEW / PRODUCT MODAL
───────────────────────────────────────────── */
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  let modal = document.getElementById("quickViewModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickViewModal";
    modal.className = "quick-view-modal";
    document.body.appendChild(modal);
  }

  const galleryHtml = product.gallery
    .map((img, i) => `<div class="gallery-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
      <img src="${img}" alt="${product.title}">
    </div>`)
    .join("");

  modal.innerHTML = `
    <div class="quick-view-content">
      <button class="close-modal" onclick="closeQuickView()">&times;</button>
      
      <div class="quick-view-body">
        <div class="quick-view-gallery">
          ${galleryHtml}
          ${product.gallery.length > 1 ? `
            <button class="gallery-nav prev" onclick="slideGallery(-1)">‹</button>
            <button class="gallery-nav next" onclick="slideGallery(1)">›</button>
          ` : ''}
        </div>

        <div class="quick-view-info">
          <h2>${product.title}</h2>
          <div class="rating">${generateStars(product.rating)}</div>
          
          <div class="price-section">
            <p class="price">$${product.price.toFixed(2)}</p>
            ${product.oldPrice > product.price ? `<p class="old-price">$${product.oldPrice.toFixed(2)}</p>` : ''}
          </div>

          <p class="description">${product.description}</p>

          <div class="specs">
            <div class="spec-item">
              <strong>Size:</strong> ${product.dimensions}
            </div>
            <div class="spec-item">
              <strong>Material:</strong> ${product.material}
            </div>
            <div class="spec-item">
              <strong>Color:</strong> ${product.color}
            </div>
            <div class="spec-item">
              <strong>Stock:</strong> <span class="${product.stock <= 5 ? 'low' : 'in-stock'}">
                ${product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
              </span>
            </div>
          </div>

          <button class="add-cart-btn" 
            data-id="${product.id}"
            data-name="${product.title}"
            data-price="${product.price}"
            data-image="${product.image}"
            onclick="addToCart(this); closeQuickView()">
            <i class="fa-solid fa-cart-shopping"></i> Add to Cart
          </button>

          <a href="product.html?id=${product.id}" class="view-full-btn">
            View Full Details
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  modal.addEventListener("click", e => {
    if (e.target === modal) closeQuickView();
  });
}

function closeQuickView() {
  const modal = document.getElementById("quickViewModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function slideGallery(direction) {
  const modal = document.getElementById("quickViewModal");
  if (!modal) return;

  const slides = modal.querySelectorAll(".gallery-slide");
  const active = modal.querySelector(".gallery-slide.active");
  const currentIdx = Array.from(slides).indexOf(active);
  const nextIdx = (currentIdx + direction + slides.length) % slides.length;

  slides.forEach(s => s.classList.remove("active"));
  slides[nextIdx].classList.add("active");
}

/* ─────────────────────────────────────────────
   FILTER SIDEBAR — ADVANCED FILTERS (optional)
───────────────────────────────────────────── */
function setupAdvancedFilters() {
  const priceRange = document.getElementById("priceRange");
  const ratingFilter = document.querySelectorAll("input[name='rating']");

  if (priceRange) {
    priceRange.addEventListener("input", applyAdvancedFilters);
  }

  ratingFilter.forEach(input => {
    input.addEventListener("change", applyAdvancedFilters);
  });
}

function applyAdvancedFilters() {
  const maxPrice = parseInt(document.getElementById("priceRange")?.value) || 2000;
  const selectedRating = document.querySelector("input[name='rating']:checked")?.value || "0";

  filteredProducts = PRODUCTS.filter(p => {
    const priceMatch = p.price <= maxPrice;
    const ratingMatch = selectedRating === "0" || p.rating >= parseInt(selectedRating);
    const categoryMatch = currentCategory === "all" || p.category === currentCategory;
    return priceMatch && ratingMatch && categoryMatch;
  });

  currentPage = 1;
  renderShop();
  setupPagination();
}
