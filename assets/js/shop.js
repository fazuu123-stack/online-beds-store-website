document.addEventListener("DOMContentLoaded", () => {

  renderProducts(PRODUCTS);

  setupCategoryFilters();

  setupSorting();

});



function renderProducts(products) {

  const grid = document.getElementById("shopProductsGrid");

  if (!grid) return;

  grid.innerHTML = products.map(product => `

    <div class="shop-card">

      <img src="${product.image}" alt="${product.title}">

      <h3>${product.title}</h3>

      <div class="rating">
        ${generateStars(product.rating)}
      </div>

      <p>$${product.price}</p>

      <button class="add-cart-btn"
        onclick="addToCart(${product.id})">

        Add to Cart

      </button>

    </div>

  `).join("");
}



function generateStars(rating) {

  let stars = "";

  for (let i = 1; i <= 5; i++) {

    stars += i <= rating ? "★" : "☆";

  }

  return stars;
}



function setupCategoryFilters() {

  const categoryCards =
    document.querySelectorAll(".category-card");

  categoryCards.forEach(card => {

    card.addEventListener("click", () => {

      const filter =
        card.dataset.filter;

      const filteredProducts =
        PRODUCTS.filter(product =>
          product.category === filter
        );

      renderProducts(filteredProducts);

    });

  });

}



function setupSorting() {

  const sortSelect =
    document.getElementById("shopSort");

  if (!sortSelect) return;

  sortSelect.addEventListener("change", () => {

    let sortedProducts = [...PRODUCTS];

    if (sortSelect.value === "low") {

      sortedProducts.sort((a, b) =>
        a.price - b.price
      );

    }

    else if (sortSelect.value === "high") {

      sortedProducts.sort((a, b) =>
        b.price - a.price
      );

    }

    renderProducts(sortedProducts);

  });

}