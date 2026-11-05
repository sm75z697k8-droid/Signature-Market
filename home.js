/**
 * Storefront demo only: product data are a November 2026 promotional snapshot,
 * not a live commerce feed. Navigation animation remains in the existing app.js.
 */
(() => {
  "use strict";

  const products = [
    {id:"tempeh",category:"snacks",name:"Real Tempeh Chips",detail:"Original Flavour · 100g",price:11,was:21.8,img:"https://my-live-01.slatic.net/p/545a4f3834ceb361136f94f4b8ad287c.png",alt:"Signature Market Real Tempeh Chips pack"},
    {id:"cookies",category:"cookies",name:"Dark Chocolate Chip Butter Cookies",detail:"Gluten Free · 180g",price:11,was:20,img:"https://down-my.img.susercontent.com/file/7a33f7dc6840b8e39149eb097e403939",alt:"Signature Market dark chocolate butter cookies"},
    {id:"nuts",category:"nuts",name:"Crunchy 5 Nuts Mix",detail:"100g",price:11,was:20,img:"https://down-my.img.susercontent.com/file/1cd3f7d12b465348fddbb6a32cd8d1eb",alt:"Signature Market Crunchy 5 Nuts Mix pouch"},
    {id:"seeds",category:"seeds",name:"Classic Seed Mix",detail:"150g offer · packaging may vary",price:11,was:20,img:"https://assets.signaturemarket.co/images/20220121024157_2022012102415766104951.jpg",alt:"Signature Market Classic Seed Mix packaging"}
  ];
  const byId = new Map(products.map(product => [product.id, product]));
  const cart = new Map();
  const homeGrid = document.getElementById("home-products");
  const catalogGrid = document.getElementById("catalog-products");
  const searchInput = document.getElementById("product-query");
  const searchClear = document.getElementById("search-clear");
  const toast = document.getElementById("feedback-toast");
  const navCartLink = document.querySelector('.nav-item[data-route="cart"]');
  const money = n => "RM " + n.toFixed(2);
  let category = "all", toastTimer = 0, currentRoute = "";
  
  function makeCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.category = product.category;
    card.innerHTML = '<div class="product-art">' +
      '<img loading="lazy" decoding="async" alt="' + product.alt + '" src="' + product.img + '">' +
      '<span class="product-tag">11.11 pick</span></div>' +
      '<div class="product-body"><h3>' + product.name + '</h3>' +
      '<p class="product-detail">' + product.detail + '</p>' +
      '<div class="price-row"><strong class="product-price">' + money(product.price) + '</strong>' +
      '<span class="product-old-price">' + money(product.was) + '</span></div>' +
      '<button type="button" class="add-button" data-add="' + product.id + '" aria-label="Add ' + product.name + ' to demo cart"><span aria-hidden="true">+</span>Add to cart</button></div>';
    const img = card.querySelector("img");
    img.addEventListener("error", () => {
      img.hidden = true;
      img.parentElement.classList.add("is-fallback");
    }, {once:true});
    return card;
  }

  function populate(grid, items) {
    grid.replaceChildren(...items.map(makeCard));
  }
  populate(homeGrid, products);
  
  function renderCatalog() {
    const term = searchInput.value.trim().toLocaleLowerCase();
    const filtered = products.filter(p => (category === "all" || p.category === category) &&
      (p.name + " " + p.detail + " " + p.category).toLocaleLowerCase().includes(term));
    populate(catalogGrid, filtered);
    document.getElementById("catalog-count").textContent = filtered.length + (filtered.length === 1 ? " product" : " products");
    document.getElementById("empty-results").hidden = filtered.length > 0;
    document.querySelectorAll(".filter-chip").forEach(chip => {
      const selected = chip.dataset.category === category;
      chip.classList.toggle("is-selected", selected);
      chip.setAttribute("aria-pressed", String(selected));
    });
    searchClear.hidden = !searchInput.value;
  }

  function renderCart() {
    const container = document.getElementById("cart-items");
    container.replaceChildren();
    let total = 0, quantity = 0;
    for (const [id, count] of cart) {
      const product = byId.get(id);
      if (!product || count <= 0) continue;
      total += product.price * count; quantity += count;
      const row = document.createElement("article");
      row.className = "cart-item";
      row.innerHTML = '<img src="' + product.img + '" alt="" loading="lazy">' +
        '<div class="cart-info"><strong>' + product.name + '</strong><p>' + product.detail + '</p>' +
        '<div class="cart-meta"><span>' + money(product.price * count) + ' · Qty ' + count + '</span>' +
        '<button type="button" class="cart-remove" data-remove="' + id + '" aria-label="Remove one ' + product.name + '">Remove one</button></div></div>';
      row.querySelector("img").addEventListener("error", e => {e.target.hidden = true;}, {once:true});
      container.append(row);
    }
    document.getElementById("cart-empty").hidden = quantity !== 0;
    document.getElementById("cart-summary").hidden = quantity === 0;
    document.getElementById("cart-subtotal").textContent = money(total);

    let badge = navCartLink.querySelector(".nav-cart-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "nav-cart-badge";
      badge.setAttribute("aria-hidden","true");
      navCartLink.append(badge);
    }
    badge.hidden = quantity === 0;
    badge.textContent = quantity > 9 ? "9+" : String(quantity);
    navCartLink.setAttribute("aria-label", quantity ? "My Cart, " + quantity + (quantity === 1 ? " item" : " items") : "My Cart");
  }

  function showMessage(message) {
    toast.textContent = message; toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {toast.hidden = true;}, 1900);
  }

  function showScreen() {
    const hash = window.location.hash.slice(1).toLowerCase();
    const route = ["home","products","notifications","cart","profile"].includes(hash) ? hash : "home";
    document.querySelectorAll(".app-screen").forEach(screen => {screen.hidden = screen.dataset.screen !== route;});
    if (route === "products") renderCatalog();
    if (route === "cart") renderCart();
    if (route !== currentRoute) {
      window.scrollTo(0,0);
      currentRoute = route;
    }
  }
  document.addEventListener("click", event => {
    const add = event.target.closest("[data-add]");
    if (add) {
      const id = add.dataset.add;
      const product = byId.get(id);
      if (!product) return;
      cart.set(id,(cart.get(id)||0)+1);
      renderCart();
      showMessage(product.name + " added to demo cart");
      return;
    }
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      const id = remove.dataset.remove;
      if (cart.has(id)) {
        const next = cart.get(id)-1;
        if (next <= 0) cart.delete(id); else cart.set(id,next);
        renderCart();
        showMessage("Demo cart updated");
      }
      return;
    }
    const chosen = event.target.closest("[data-category]");
    if (chosen) {
      category = chosen.dataset.category;
      searchInput.value = "";
      searchClear.hidden = true;
      if (window.location.hash === "#products") renderCatalog();
      else window.location.hash = "#products";
    }
  });
  document.getElementById("product-search").addEventListener("submit", event => {
    event.preventDefault();
    category = "all";
    renderCatalog();
    if (window.location.hash === "#products") showScreen();
    else window.location.hash = "#products";
  });
  searchInput.addEventListener("input", () => {
    searchClear.hidden = !searchInput.value;
    if (currentRoute === "products") renderCatalog();
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = ""; searchClear.hidden = true;
    if (currentRoute === "products") renderCatalog();
    searchInput.focus();
  });
  document.getElementById("reset-filters").addEventListener("click", () => {
    category = "all"; searchInput.value = ""; renderCatalog();
  });
  window.addEventListener("hashchange", showScreen);
  showScreen();
  renderCart();
})();