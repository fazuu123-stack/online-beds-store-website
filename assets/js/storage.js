/* ============================================================
   STORAGE SERVICE — localStorage abstraction layer
   Handles cart persistence, products, and admin data
   Ready to be swapped with API calls later
============================================================ */

const STORAGE_KEYS = {
  CART: 'senna_cart',
  PRODUCTS: 'senna_products',
  ADMIN_PRODUCTS: 'senna_admin_products',
  USER: 'senna_user',
  ORDERS: 'senna_orders'
};

class StorageService {
  /* ── CART ── */
  static getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    } catch (e) {
      console.error('Cart retrieval error:', e);
      return [];
    }
  }

  static saveCart(cartArray) {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartArray));
      return true;
    } catch (e) {
      console.error('Cart save error:', e);
      return false;
    }
  }

  static clearCart() {
    localStorage.removeItem(STORAGE_KEYS.CART);
  }

  /* ── PRODUCTS ── */
  static getProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) return JSON.parse(stored);
      return this.getDefaultProducts();
    } catch (e) {
      console.error('Products retrieval error:', e);
      return this.getDefaultProducts();
    }
  }

  static saveProducts(productsArray) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsArray));
      return true;
    } catch (e) {
      console.error('Products save error:', e);
      return false;
    }
  }

  static getDefaultProducts() {
    return [
      {
        id: 'prod-001',
        name: 'Upholstered Swan Bed',
        price: 2499,
        image: 'assets/images/Upholstered-swan-bed.jpeg',
        category: 'luxury',
        stock: 15,
        rating: 4.8,
        reviews: 24,
        description: 'Luxurious upholstered bed with premium comfort.'
      },
      {
        id: 'prod-002',
        name: 'Ottoman Bed Frame',
        price: 1899,
        image: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=500',
        category: 'sofa',
        stock: 22,
        rating: 4.6,
        reviews: 18,
        description: 'Modern ottoman storage bed perfect for contemporary homes.'
      },
      {
        id: 'prod-003',
        name: 'Modern Wooden Bed',
        price: 1599,
        image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=500',
        category: 'decor',
        stock: 18,
        rating: 4.7,
        reviews: 31,
        description: 'Elegant wooden bed with minimalist design.'
      },
      {
        id: 'prod-004',
        name: 'Premium Mattress',
        price: 899,
        image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=500',
        category: 'decor',
        stock: 45,
        rating: 4.9,
        reviews: 127,
        description: 'High-quality memory foam mattress for ultimate comfort.'
      },
      {
        id: 'prod-005',
        name: 'Accent Chair',
        price: 749,
        image: 'https://images.unsplash.com/photo-1616628182504-3a8d4b6b2f1e?w=500',
        category: 'chair',
        stock: 12,
        rating: 4.5,
        reviews: 14,
        description: 'Stylish accent chair for bedroom or living area.'
      },
      {
        id: 'prod-006',
        name: 'Luxury Bed Headboard',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=500',
        category: 'luxury',
        stock: 8,
        rating: 4.8,
        reviews: 22,
        description: 'Statement upholstered headboard with premium fabric.'
      },
      {
        id: 'prod-007',
        name: 'Platform Bed Base',
        price: 699,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500',
        category: 'sofa',
        stock: 25,
        rating: 4.6,
        reviews: 19,
        description: 'Solid platform base for any mattress type.'
      },
      {
        id: 'prod-008',
        name: 'Designer Duvet Set',
        price: 449,
        image: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=500',
        category: 'decor',
        stock: 50,
        rating: 4.7,
        reviews: 45,
        description: 'Premium Egyptian cotton duvet and pillowcase set.'
      }
    ];
  }

  /* ── ADMIN PRODUCTS ── */
  static getAdminProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_PRODUCTS)) || [];
    } catch (e) {
      return [];
    }
  }

  static saveAdminProducts(productsArray) {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PRODUCTS, JSON.stringify(productsArray));
      return true;
    } catch (e) {
      return false;
    }
  }

  static addProduct(product) {
    const products = this.getProducts();
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...product,
      stock: parseInt(product.stock) || 0,
      price: parseFloat(product.price) || 0,
      rating: 5,
      reviews: 0
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  static updateProduct(id, updates) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx > -1) {
      products[idx] = { ...products[idx], ...updates };
      this.saveProducts(products);
      return products[idx];
    }
    return null;
  }

  static deleteProduct(id) {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    this.saveProducts(filtered);
    return true;
  }

  static getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  static getProductsByCategory(category) {
    if (category === 'all') return this.getProducts();
    return this.getProducts().filter(p => p.category === category);
  }

  /* ── ORDERS ── */
  static getOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    } catch (e) {
      return [];
    }
  }

  static saveOrder(orderData) {
    const orders = this.getOrders();
    const order = {
      id: `order-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'pending',
      ...orderData
    };
    orders.push(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return order;
  }

  /* ── USER ── */
  static getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null;
    } catch (e) {
      return null;
    }
  }

  static saveUser(userData) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  }

  static clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
}

/* Export for use in modules */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageService;
}
