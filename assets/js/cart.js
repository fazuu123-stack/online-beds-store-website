let cart =
  JSON.parse(localStorage.getItem("cart"))
  || [];



function saveCart() {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

}



function addToCart(productId) {

  const product =
    PRODUCTS.find(p => p.id === productId);

  if (!product) return;

  const existingItem =
    cart.find(item => item.id === productId);

  if (existingItem) {

    existingItem.quantity += 1;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }

  saveCart();

  updateCartCount();

  showCartNotification(product.title);

}



function updateCartCount() {

  const cartCount =
    document.querySelector(".cart-count");

  if (!cartCount) return;

  const totalItems =
    cart.reduce((total, item) =>
      total + item.quantity, 0);

  cartCount.textContent = totalItems;

}



function showCartNotification(title) {

  alert(title + " added to cart");

}



document.addEventListener("DOMContentLoaded", () => {

  updateCartCount();

});