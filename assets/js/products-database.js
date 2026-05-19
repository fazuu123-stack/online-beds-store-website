/* ============================================================
   SENNA BEDS — products-database.js
   Central product database for all ecommerce operations
   API-ready structure for future backend integration
============================================================ */

const PRODUCTS_KEY = 'senna_products';

const DEFAULT_PRODUCTS = [
  {
    id: 'luxury-upholstered-bed-001',
    name: 'Luxury Upholstered Bed',
    category: 'upholstered',
    price: 2499.99,
    originalPrice: 3299.99,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
    rating: 4.8,
    reviews: 156,
    description: 'Premium hand-crafted upholstered bed with memory foam headboard',
    stock: 12,
    sku: 'LUB-001',
    dimensions: '200cm × 160cm × 120cm',
    material: 'Italian Upholstery',
    featured: true,
    badge: 'bestseller'
  },
  {
    id: 'ottoman-storage-bed-002',
    name: 'Ottoman Storage Bed',
    category: 'ottoman',
    price: 1899.99,
    originalPrice: 2499.99,
    image: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=600',
    rating: 4.6,
    reviews: 98,
    description: 'Modern ottoman bed with hidden storage compartment',
    stock: 8,
    sku: 'OSB-002',
    dimensions: '200cm × 140cm × 110cm',
    material: 'Premium Fabric',
    featured: true,
    badge: 'sale'
  },
  {
    id: 'wooden-platform-bed-003',
    name: 'Wooden Platform Bed',
    category: 'wooden',
    price: 1699.99,
    originalPrice: 2199.99,
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600',
    rating: 4.7,
    reviews: 134,
    description: 'Solid oak platform bed with natural finish',
    stock: 15,
    sku: 'WPB-003',
    dimensions: '200cm × 160cm × 80cm',
    material: 'Solid Oak',
    featured: true,
    badge: null
  },
  {
    id: 'modern-metal-bed-004',
    name: 'Modern Metal Bed Frame',
    category: 'modern',
    price: 1299.99,
    originalPrice: 1699.99,
    image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=600',
    rating: 4.5,
    reviews: 76,
    description: 'Minimalist metal bed frame with clean lines',
    stock: 20,
    sku: 'MMB-004',
    dimensions: '200cm × 140cm × 90cm',
    material: 'Black Steel',
    featured: false,
    badge: null
  },
  {
    id: 'king-size-luxury-bed-005',
    name: 'King Size Luxury Bed',
    category: 'upholstered',
    price: 3299.99,
    originalPrice: 4399.99,
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600',
    rating: 4.9,
    reviews: 203,
    description: 'Grand king-size bed with premium upholstery',
    stock: 5,
    sku: 'KLB-005',
    dimensions: '220cm × 180cm × 130cm',
    material: 'Velvet Upholstery',
    featured: true,
    badge: 'bestseller'
  },
  {
    id: 'classic-wooden-bed-006',
    name: 'Classic Wooden Bed',
    category: 'wooden',
    price: 1499.99,
    originalPrice: 1899.99,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
    rating: 4.4,
    reviews: 65,
    description: 'Traditional wooden bed with carved details',
    stock: 10,
    sku: 'CWB-006',
    dimensions: '200cm × 140cm × 100cm',
    material: 'Walnut Wood',
    featured: false,
    badge: null
  },
  {
    id: 'minimalist-bed-007',
    name: 'Minimalist Platform Bed',
    category: 'modern',
    price: 1199.99,
    originalPrice: 1599.99,
    image: 'https://images.unsplash.com/photo-1616628182504-3a8d4b6b2f1e?w=600',
    rating: 4.6,
    reviews: 88,
    description: 'Ultra-modern minimalist platform bed',
    stock: 18,
    sku: 'MPB-007',
    dimensions: '200cm × 140cm × 40cm',
    material: 'Oak + Steel',
    featured: false,
    badge: null
  },
  {
    id: 'canopy-bed-008',
    name: 'Canopy Bed Frame',
    category: 'upholstered',
    price: 2799.99,
    originalPrice: 3599.99,
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600',
    rating: 4.8,
    reviews: 142,
    description: 'Elegant canopy bed with premium upholstered frame',
    stock: 7,
    sku: 'CBF-008',
    dimensions: '210cm × 160cm × 220cm',
    material: 'Linen & Oak',
    featured: true,
    badge: 'new'
  }
];

/**
 * ProductDatabase — handles all product operations
 * API-ready structure for future backend integration
 */
class ProductDatabase {
  constructor() {
    this.products = this.loadProducts();
  }

  /**
   * Load products from localStorage or use defaults
   */
  loadProducts() {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load products from storage, using defaults');
        return [...DEFAULT_PRODUCTS];
      }
    }
    return [...DEFAULT_PRODUCTS];
  }

  /**
   * Save products to localStorage
   */
  saveProducts() {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(this.products));
  }

  /**
   * Get all products
   */
  getAllProducts() {
    return [...this.products];
  }

  /**
   * Get product by ID
   */
  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category) {
    if (category === 'all') return [...this.products];
    return this.products.filter(p => p.category === category);
  }

  /**
   * Get featured products
   */
  getFeaturedProducts() {
    return this.products.filter(p => p.featured === true);
  }

  /**
   * Get best sellers (by reviews)
   */
  getBestSellers(limit = 8) {
    return [...this.products]
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, limit);
  }

  /**
   * Search products by name or description
   */
  searchProducts(query) {
    const q = query.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  /**
   * Get unique categories
   */
  getCategories() {
    return [...new Set(this.products.map(p => p.category))];
  }

  /**
   * Add new product (admin)
   */
  addProduct(productData) {
    const product = {
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...productData,
      stock: productData.stock || 0,
      rating: 0,
      reviews: 0,
      featured: false,
      badge: null
    };
    this.products.push(product);
    this.saveProducts();
    return product;
  }

  /**
   * Update product (admin)
   */
  updateProduct(id, updates) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates };
    this.saveProducts();
    return this.products[idx];
  }

  /**
   * Delete product (admin)
   */
  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveProducts();
    return true;
  }

  /**
   * Update stock
   */
  updateStock(id, quantity) {
    const product = this.getProductById(id);
    if (product) {
      product.stock = Math.max(0, quantity);
      this.saveProducts();
      return product;
    }
    return null;
  }

  /**
   * Check if product is in stock
   */
  isInStock(id, quantity = 1) {
    const product = this.getProductById(id);
    return product && product.stock >= quantity;
  }

  /**
   * Reset to default products
   */
  resetToDefaults() {
    this.products = [...DEFAULT_PRODUCTS];
    this.saveProducts();
  }
}

/* ── GLOBAL INSTANCE ── */
const productDB = new ProductDatabase();

/* ── EXPORT FOR USE ── */
window.productDB = productDB;
window.PRODUCTS = productDB.getAllProducts();
