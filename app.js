/* Signature Market redesign experiment — static, client-side demo only.
   No real accounts, ordering, notifications, or live pricing. */
(() => {
  "use strict";

  const products = [
    {
      id: "almond-cashew",
      name: "Almond Cashew Mix",
      category: "nuts",
      tag: "NUTTY GOODNESS",
      weight: "120g",
      price: 14.90,
      image: "https://assets.signaturemarket.co/images/20220121030553_202201210305531369356171.jpg"
    },
    {
      id: "triple-nuts",
      name: "Triple Best-Selling Nuts Daily Packs",
      category: "nuts",
      tag: "DAILY FAVOURITE",
      weight: "3 mini packs",
      price: 29.90,
      image: "https://assets.signaturemarket.co/images/20231220061801_202312200618011104333444.jpg"
    },
    {
      id: "hearty-granola",
      name: "Hearty Granola Bundle",
      category: "granola",
      tag: "BREAKFAST JOY",
      weight: "Bundle",
      price: 39.90,
      image: "https://assets.signaturemarket.co/images/20231025080359_20231025080359693330886.jpg"
    }
  ];
  const productById = Object.fromEntries(products.map(product => [product.id, product]));
  const routes = ["home", "products", "alerts", "cart", "profile"];
  const storageKey = "signature-market-concept-cart-v1";
  let cart = loadCart();
  let category = "all";
  let activeRoute = "home";
  let hasRenderedRoute = false;
  let focusSearchOnOpen = false;
  let toastTimer;
  const scrollPositions = Object.fromEntries(routes.map(route => [route, 0]));

  const icon = (name) => '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  const currency = amount => "RM " + amount.toFixed(2);

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
      const safe = {};
      for (const product of products) {
        const quantity = saved[product.id];
        if (Number.isInteger(quantity) && quantity > 0 && quantity <= 99) {
          safe[product.id] = quantity;
        }
      }
      return safe;
    } catch {
      // Safari private browsing or restricted storage: use memory only.
      return {};
    }
  }

  function saveCart() {
    try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { /* memory-only demo */ }
  }

  function getCartCount() {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  }

  function updateBadge() {
    const badge = document.getElementById("cart-badge");
    const count = getCartCount();
    badge.hidden = count === 0;
    badge.textContent = count > 99 ? "99+" : String(count);
    const cartTab = document.querySelector('[data-route="cart"]');
    cartTab.setAttribute("aria-label", count ? "My Cart, " + count + " items" : "My Cart");
  }

  function productCard(product) {
    return '<article class="product-card">' +
      '<div class="product-visual"><img src="' + product.image + '" alt="' + product.name + '" loading="lazy">' +
      '<span class="product-pill">' + product.tag + '</span></div>' +
      '<div class="product-details"><h3>' + product.name + '</h3><p class="product-weight">' + product.weight + '</p>' +
      '<div class="product-bottom"><span class="product-price">' + currency(product.price) + '</span>' +
      '<button type="button" class="add-button" data-add="' + product.id + '" aria-label="Add ' + product.name + ' to cart">' +
      icon("plus") + '</button></div></div></article>';
  }

  function renderProducts() {
    document.getElementById("home-products").innerHTML = products.slice(0, 2).map(productCard).join("");
    renderFilteredProducts();
  }

  function renderFilteredProducts() {
    const search = document.getElementById("product-search").value.trim().toLocaleLowerCase();
    const filtered = products.filter(product =>
      (category === "all" || product.category === category) &&
      (product.name.toLocaleLowerCase().includes(search) || product.category.includes(search))
    );
    const grid = document.getElementById("products-grid");
    grid.innerHTML = filtered.length
      ? filtered.map(productCard).join("")
      : '<div class="empty-state" style="grid-column:1/-1;min-height:250px"><h2>No matches yet</h2><p>Try a different search or browse all our demo products.</p><button class="primary-button" data-clear-filters type="button">Show all products</button></div>';
    document.getElementById("product-count").textContent = filtered.length + (filtered.length === 1 ? " product" : " products");
    document.querySelectorAll("[data-filter]").forEach(chip => {
      const selected = chip.dataset.filter === category;
      chip.classList.toggle("active", selected);
      chip.setAttribute("aria-pressed", String(selected));
    });
  }

  function setCategory(value) {
    category = ["all", "nuts", "granola"].includes(value) ? value : "all";
    renderFilteredProducts();
  }

  function adjustCart(id, difference) {
    if (!productById[id]) return;
    const next = Math.max(0, Math.min(99, (cart[id] || 0) + difference));
    if (next === 0) delete cart[id];
    else cart[id] = next;
    saveCart();
    updateBadge();
    renderCart();
    if (difference > 0) showToast("Added to your demo cart");
  }

  function renderCart() {
    const container = document.getElementById("cart-content");
    const items = products.filter(product => cart[product.id] > 0);
    if (!items.length) {
      container.innerHTML =
        '<div class="empty-state"><span class="empty-art">' + icon("bag") + '</span>' +
        '<h2>A fresh start.</h2><p>Your bag is empty for now. Let’s find something delicious.</p>' +
        '<button type="button" class="primary-button" data-go="products">Find something good ' + icon("arrow") + '</button></div>';
      return;
    }
    const itemMarkup = items.map(product =>
      '<article class="cart-row"><img src="' + product.image + '" alt="' + product.name + '" loading="lazy">' +
      '<div class="cart-description"><h3>' + product.name + '</h3><p>' + product.weight + '</p>' +
      '<strong>' + currency(product.price * cart[product.id]) + '</strong></div>' +
      '<div class="quantity-control" aria-label="Quantity for ' + product.name + '">' +
      '<button type="button" data-adjust="-1" data-id="' + product.id + '" aria-label="Remove one ' + product.name + '">' + icon("minus") + '</button>' +
      '<output aria-label="Quantity">' + cart[product.id] + '</output>' +
      '<button type="button" data-adjust="1" data-id="' + product.id + '" aria-label="Add one ' + product.name + '">' + icon("plus") + '</button>' +
      '</div></article>'
    ).join("");
    const total = items.reduce((sum, product) => sum + product.price * cart[product.id], 0);
    container.innerHTML = '<div class="cart-items">' + itemMarkup + '</div>' +
      '<div class="cart-summary"><div class="cart-summary-row"><span>Demo subtotal (' + getCartCount() + ' items)</span>' +
      '<strong>' + currency(total) + '</strong></div>' +
      '<p>This is only a visual prototype. Prices are samples, and nothing here will be ordered or sent to Signature Market.</p>' +
      '<button type="button" class="primary-button" data-go="products">Continue exploring ' + icon("arrow") + '</button></div>';
  }

  function currentRoute() {
    const hash = location.hash.slice(1).toLowerCase();
    return routes.includes(hash) ? hash : "home";
  }

  function showRoute() {
    const route = currentRoute();
    const nav = document.querySelector(".floating-nav");

    if (route !== activeRoute) scrollPositions[activeRoute] = window.scrollY;

    // Do not sweep across the whole bar when opening a deep link for the first time.
    if (!hasRenderedRoute) nav.classList.add("nav-initializing");

    document.querySelectorAll(".view").forEach(section => {
      section.hidden = section.dataset.view !== route;
    });
    document.querySelectorAll("[data-route]").forEach(link => {
      const selected = link.dataset.route === route;
      link.classList.toggle("active", selected);
      if (selected) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");

    });

    // A single indicator moves horizontally beneath all five tabs.
    nav.style.setProperty("--active-translate", String(routes.indexOf(route) * 100) + "%");
    if (!hasRenderedRoute) {
      hasRenderedRoute = true;
      requestAnimationFrame(() => nav.classList.remove("nav-initializing"));
    }

    activeRoute = route;
    if (route === "cart") renderCart();
    document.title = (route === "home" ? "Home" : route === "alerts" ? "Notifications" : route[0].toUpperCase() + route.slice(1)) +
      " · Signature Market Concept";
    window.scrollTo(0, scrollPositions[route] || 0);
    // Tell the responsive dock this was a page change, not a scroll gesture.
    document.dispatchEvent(new CustomEvent("signature-market:routechange", { detail: { route } }));
    if (route === "products" && focusSearchOnOpen) {
      focusSearchOnOpen = false;
      requestAnimationFrame(() => document.getElementById("product-search").focus({ preventScroll: true }));
    }
  }

  function goTo(route) {
    if (!routes.includes(route)) return;
    if (location.hash === "#" + route || (!location.hash && route === "home")) showRoute();
    else location.hash = route;
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2000);
  }

  document.addEventListener("click", event => {
    const route = event.target.closest("[data-route]");
    if (route) {
      event.preventDefault();
      goTo(route.dataset.route);
      return;
    }
    const destination = event.target.closest("[data-go]");
    if (destination) {
      goTo(destination.dataset.go);
      return;
    }
    const searchTrigger = event.target.closest("[data-search-open]");
    if (searchTrigger) {
      focusSearchOnOpen = true;
      goTo("products");
      return;
    }
    const categoryTrigger = event.target.closest("[data-category-go]");
    if (categoryTrigger) {
      setCategory(categoryTrigger.dataset.categoryGo);
      document.getElementById("product-search").value = "";
      renderFilteredProducts();
      goTo("products");
      return;
    }
    const filter = event.target.closest("[data-filter]");
    if (filter) {
      setCategory(filter.dataset.filter);
      return;
    }
    const add = event.target.closest("[data-add]");
    if (add) {
      adjustCart(add.dataset.add, 1);
      return;
    }
    const adjust = event.target.closest("[data-adjust]");
    if (adjust) {
      adjustCart(adjust.dataset.id, Number(adjust.dataset.adjust));
      return;
    }
    if (event.target.closest("[data-clear-filters]")) {
      document.getElementById("product-search").value = "";
      setCategory("all");
    }
  });

  document.getElementById("product-search").addEventListener("input", renderFilteredProducts);
  window.addEventListener("hashchange", showRoute);
  renderProducts();
  renderCart();
  updateBadge();
  showRoute();
})();
