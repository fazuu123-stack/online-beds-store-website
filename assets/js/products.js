/* ============================================================
   SENNA BEDS — products.js v2.0
   Product service layer - rendering & management
   Backend-ready structure
============================================================ */

const ProductService = (() => {
  return {
    /* ── RENDER PRODUCT GRID ── */
    renderProductGrid(containerId, products = null) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const items = products || StorageService.getProducts();
      
      if (!items.length) {
        container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-muted)">No products found.</p>';
        return;
      }

      let html = '';
      items.forEach((product, idx) => {
        html += this.getProductCardHTML(product, idx);
      });

      container.innerHTML = html;
      this.attachProductCardListeners();
    },

    /* ── PRODUCT CARD HTML ── */
    getProductCardHTML(product, index = 0) {
      const rating = '★'.repeat(Math.floor(product.rating || 4)) + '☆'.repeat(5 - Math.floor(product.rating || 4));
      const delay = (index % 4) * 80;
      
      return `
        <div class="product-card reveal visible" data-product-id="${product.id}" style="animation-delay:${delay}ms">
          <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://placehold.co/300x250/f4f4f0/0A2240?text=Furniture'">
          <h3>${product.name}</h3>
          <div class="rating">${rating}</div>
          <p class="price">$${product.price.toFixed(2)}</p>
          <button class="add-cart-btn" 
            data-id="${product.id}" 
            data-name="${product.name}" 
            data-price="${product.price}" 
            data-image="${product.image}">
            Add to Cart
          </button>
          <div class="product-stock-badge" style="position:absolute;top:12px;right:12px;background:var(--gold);color:var(--navy);padding:6px 12px;border-radius:20px;font-size:11px;font-weight:600">
            ${product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
          </div>
        </div>`;
    },

    /* ── SINGLE PRODUCT VIEW ── */
    renderProductDetail(containerId, productId) {
      const container = document.getElementById(containerId);
      const product = StorageService.getProductById(productId);
      
      if (!product || !container) {
        container.innerHTML = '<p style="color:var(--text-muted);padding:40px">Product not found</p>';
        return;
      }

      const rating = '★'.repeat(Math.floor(product.rating || 4)) + '☆'.repeat(5 - Math.floor(product.rating || 4));
      
      container.innerHTML = `
        <div class="product-detail" style="display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:40px;background:var(--white);border-radius:var(--radius)">
          <div class="product-detail-image">
            <img src="${product.image}" alt="${product.name}" style="width:100%;border-radius:var(--radius);object-fit:contain">
          </div>
          <div class="product-detail-info">
            <h1 style="font-family:var(--font-display);font-size:32px;margin-bottom:12px">${product.name}</h1>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
              <span style="color:var(--gold);font-size:16px">${rating}</span>
              <span style="color:var(--text-muted);font-size:14px">(${product.reviews} reviews)</span>
            </div>
            <p style="color:var(--text-muted);font-size:15px;line-height:1.8;margin-bottom:28px">${product.description}</p>
            <div style="display:flex;align-items:baseline;gap:16px;margin-bottom:32px">
              <span style="font-size:32px;font-weight:700;color:var(--navy)">$${product.price.toFixed(2)}</span>
              <span style="color:var(--gold);font-size:14px;letter-spacing:1px;text-transform:uppercase;font-weight:600">
                ${product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>
            <button class="add-cart-btn" 
              data-id="${product.id}" 
              data-name="${product.name}" 
              data-price="${product.price}" 
              data-image="${product.image}"
              style="width:100%;padding:16px;font-size:16px">
              Add to Cart
            </button>
          </div>
        </div>`;

      this.attachProductCardListeners();
    },

    /* ── CATEGORY FILTER ── */
    filterByCategory(containerId, category) {
      const products = StorageService.getProductsByCategory(category);
      this.renderProductGrid(containerId, products);
    },

    /* ── SORT PRODUCTS ── */
    sortProducts(products, sortBy = 'default') {
      const sorted = [...products];
      switch (sortBy.toLowerCase()) {
        case 'price-low':
          return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
          return sorted.sort((a, b) => b.price - a.price);
        case 'newest':
          return sorted.reverse();
        case 'rating':
          return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        default:
          return sorted;
      }
    },

    /* ── SEARCH PRODUCTS ── */
    searchProducts(query) {
      const q = query.toLowerCase().trim();
      if (!q) return StorageService.getProducts();
      
      return StorageService.getProducts().filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    },

    /* ── ATTACH CARD LISTENERS ── */
    attachProductCardListeners() {
      document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.removeEventListener('click', this.handleAddToCart);
        btn.addEventListener('click', this.handleAddToCart);
      });

      document.querySelectorAll('.product-image').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
          openImagePopup(this.src, this.alt);
        });
      });
    },

    handleAddToCart(e) {
      e.preventDefault();
      const btn = e.target;
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image
      };

      if (!product.id || !product.name || isNaN(product.price)) {
        showToast('Error: Invalid product data');
        return;
      }

      CartService.addItem(product);
      
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      btn.classList.add('added');
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('added');
        btn.disabled = false;
      }, 1800);
    },

    /* ── GET CATEGORIES ── */
    getCategories() {
      const products = StorageService.getProducts();
      const categories = new Set(products.map(p => p.category));
      return Array.from(categories);
    },

    /* ── STATS ── */
    getStats() {
      const products = StorageService.getProducts();
      return {
        totalProducts: products.length,
        categories: this.getCategories().length,
        inStock: products.filter(p => p.stock > 0).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
      };
    }
  };
})();

/* Export for use */
window.ProductService = ProductService;
