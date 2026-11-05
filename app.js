// Signature Market concept app.
// All prices, notifications, and product listings are illustrative demo data.
// Replace this local model with real APIs before using it for commerce.
const products = [
  { id: "classic-mix", name: "Classic Nut Mix", category: "Nuts", categoryLabel: "Nuts & Mixes", weight: "450g", price: 38.90, emoji: "🥜", bg: "#e9efdd", tag: "BEST SELLER" },
  { id: "thai-mango", name: "Thai Dried Mango", category: "Fruits", categoryLabel: "Dried Fruits", weight: "450g", price: 47.20, emoji: "🥭", bg: "#fff0ce", tag: "FAN FAVOURITE" },
  { id: "omega-mix", name: "Omega-3 Trail Mix", category: "Nuts", categoryLabel: "Nuts & Mixes", weight: "450g", price: 38.90, emoji: "🌰", bg: "#e9e3d8", tag: "GOODNESS" },
  { id: "almond", name: "Roasted California Almond", category: "Nuts", categoryLabel: "Nuts & Mixes", weight: "500g", price: 38.90, emoji: "🥜", bg: "#efe8de", tag: "POPULAR" },
  { id: "granola", name: "Apple Cinnamon Almond Granola", category: "Breakfast", categoryLabel: "Breakfast", weight: "300g", price: 25.90, emoji: "🥣", bg: "#f3e6d6", tag: "MORNING PICK" },
  { id: "lavender-tea", name: "Bedtime Bliss Lavender Tea", category: "Beverages", categoryLabel: "Beverages", weight: "10 sachets", price: 19.90, emoji: "🍵", bg: "#e8e5f1", tag: "RELAX & RESET" }
];

const demoNotifications = [
  { id: "welcome", icon: "🌿", title: "Welcome to good living", message: "Discover feel-good favourites and healthy little treats.", time: "Just now" },
  { id: "discover", icon: "✨", title: "Something delicious awaits", message: "Explore our curated selection of snacks, nuts and more.", time: "Today" }
];

const routes = ["home", "products", "cart", "profile"];
const money = amount => new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" }).format(amount);
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const byId = id => document.getElementById(id);
const getProduct = id => products.find(product => product.id === id);

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Demo also works when storage is blocked. */ }
}

const savedCart = readJSON("signature-market-demo-cart", {});
const cart = {};
for (const product of products) {
  const quantity = Number(savedCart?.[product.id]);
  if (Number.isInteger(quantity) && quantity > 0 && quantity <= 99) cart[product.id] = quantity;
}
let notificationsRead = readJSON("signature-market-demo-notifications-read", false) === true;
let selectedFilter = "All";
let currentRoute = "home";
let previousFocus = null;
let previousQuickViewFocus = null;
let toastTimer;

function productCard(product) {
  return `
    <article class="product-card">
      <button class="product-visual" type="button" data-view="${product.id}" style="--product-bg: ${product.bg}" aria-label="View details for ${product.name}">
        <span class="product-tag">${product.tag}</span>
        <span class="product-emoji" role="img" aria-label="${product.categoryLabel}">${product.emoji}</span>
      </button>
      <div class="product-meta">
        <p class="product-category">${product.categoryLabel}</p>
        <h3 class="product-name"><button class="product-name-button" type="button" data-view="${product.id}">${product.name}</button></h3>
        <p class="product-weight">${product.weight}</p>
      </div>
      <div class="product-footer">
        <span class="product-price">${money(product.price)}</span>
        <button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name} to cart">${icon("plus")}</button>
      </div>
    </article>`;
}

function renderProducts() {
  byId("homeProducts").innerHTML = products.slice(0, 4).map(productCard).join("");
  const query = byId("productSearch").value.trim().toLocaleLowerCase();
  const filtered = products.filter(product =>
    (selectedFilter === "All" || product.category === selectedFilter) &&
    [product.name, product.categoryLabel].some(field => field.toLocaleLowerCase().includes(query))
  );
  byId("allProducts").innerHTML = filtered.map(productCard).join("");
  byId("productCount").textContent = `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`;
  byId("noResults").hidden = filtered.length !== 0;
  document.querySelectorAll("[data-filter]").forEach(button => {
    const active = button.dataset.filter === selectedFilter;
    button.classList.toggle("is-selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function routeFromHash() {
  const route = window.location.hash.replace(/^#/, "").toLowerCase();
  return routes.includes(route) ? route : "home";
}

function navigate(route, options = {}) {
  if (!routes.includes(route)) return;
  const { writeHistory = true, focus = true } = options;
  if (writeHistory && route !== currentRoute) {
    window.history.pushState({ route }, "", `#${route}`);
  }
  currentRoute = route;
  document.querySelectorAll("[data-page]").forEach(page => {
    const active = page.dataset.page === route;
    page.hidden = !active;
    page.classList.toggle("is-active", active);
  });
  document.querySelectorAll("[data-nav]").forEach(button => {
    const active = button.dataset.nav === route;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (route === "cart") renderCart();
  window.scrollTo({ top: 0, behavior: "auto" });
  document.title = `${route === "cart" ? "My Cart" : route[0].toUpperCase() + route.slice(1)} — Signature Market Concept`;
  const heading = byId(`page-${route}`).querySelector("h1");
  if (focus && heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
}

function chooseCategory(category) {
  selectedFilter = category;
  byId("productSearch").value = "";
  renderProducts();
  navigate("products");
}

function persistCart() {
  writeJSON("signature-market-demo-cart", cart);
  updateCartBadge();
}
function itemCount() {
  return Object.values(cart).reduce((sum, count) => sum + count, 0);
}
function updateCartBadge() {
  const count = itemCount();
  const badge = byId("cartCount");
  badge.hidden = count === 0;
  badge.textContent = count > 99 ? "99+" : String(count);
  const headerBadge = byId("headerCartCount");
  headerBadge.hidden = count === 0;
  headerBadge.textContent = count > 99 ? "99+" : String(count);
  document.querySelectorAll('[data-nav="cart"]').forEach(button => {
    button.setAttribute("aria-label", `My Cart, ${count} ${count === 1 ? "item" : "items"}`);
  });
}
function addToCart(id) {
  const product = getProduct(id);
  if (!product) return;
  cart[id] = Math.min((cart[id] || 0) + 1, 99);
  persistCart();
  if (currentRoute === "cart") renderCart();
  showToast(`${product.name} added to cart ✓`);
}
function setQuantity(id, amount) {
  if (!getProduct(id) || !Number.isInteger(amount)) return;
  if (amount <= 0) delete cart[id];
  else cart[id] = Math.min(amount, 99);
  persistCart();
  renderCart();
}
function renderCart() {
  const container = byId("cartContent");
  const entries = products.filter(product => cart[product.id]);
  if (entries.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-art">${icon("bag")}</div>
        <h2>Your cart feels lonely</h2>
        <p>Let's fill it with some wholesome goodness.</p>
        <button class="primary-button" type="button" data-go="products">Start exploring ${icon("arrow")}</button>
      </div>`;
    return;
  }
  const rows = entries.map(product => `
    <article class="cart-row">
      <div class="cart-thumb" style="--product-bg: ${product.bg}" role="img" aria-label="${product.categoryLabel}">${product.emoji}</div>
      <div class="cart-details">
        <h3>${product.name}</h3>
        <p>${product.weight}</p>
        <strong>${money(product.price * cart[product.id])}</strong>
        <div class="quantity" aria-label="Quantity of ${product.name}">
          <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Remove one ${product.name}">${icon("minus")}</button>
          <span aria-live="off">${cart[product.id]}</span>
          <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Add one ${product.name}">${icon("plus")}</button>
        </div>
      </div>
    </article>`).join("");
  const subtotal = entries.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  container.innerHTML = `
    <div class="cart-list">${rows}</div>
    <div class="order-summary">
      <h2>Order summary</h2>
      <div class="summary-line"><span>Items (${itemCount()})</span><strong>${money(subtotal)}</strong></div>
      <div class="summary-line"><span>Shipping</span><span>Calculated at checkout</span></div>
      <div class="summary-total"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
      <button class="primary-button checkout-button" type="button" id="checkoutDemo">Continue to checkout ${icon("arrow")}</button>
      <p class="checkout-note">Demo only — no orders or payments will be placed.</p>
    </div>`;
}

function openQuickView(id) {
  const product = getProduct(id);
  if (!product) return;
  previousQuickViewFocus = document.activeElement;
  byId("quickViewDetails").innerHTML = `
    <div class="quick-view-visual" style="--product-bg: ${product.bg}">
      <span class="quick-view-emoji" aria-hidden="true">${product.emoji}</span>
    </div>
    <div class="quick-view-copy">
      <p class="overline">${product.categoryLabel} · PRODUCT PREVIEW</p>
      <h2 id="quickViewTitle">${product.name}</h2>
      <p class="quick-view-weight">${product.weight} · Curated for feel-good moments</p>
      <p class="quick-view-description">A delicious pick from our illustrative concept collection. Actual ingredients, nutrition and availability will be shown once this prototype connects to the store.</p>
      <p class="quick-view-price">${money(product.price)}</p>
      <button type="button" class="primary-button quick-view-add" data-add="${product.id}">Add to my cart ${icon("plus")}</button>
      <small>Sample product information and pricing.</small>
    </div>`;
  byId("quickViewBackdrop").hidden = false;
  byId("quickViewDialog").hidden = false;
  document.body.style.overflow = "hidden";
  byId("closeQuickView").focus();
}

function closeQuickView() {
  byId("quickViewBackdrop").hidden = true;
  byId("quickViewDialog").hidden = true;
  document.body.style.overflow = "";
  previousQuickViewFocus?.focus();
}

function updateUnreadIndicator() {
  byId("unreadDot").hidden = notificationsRead;
  byId("notificationsTrigger").setAttribute("aria-label", notificationsRead ? "Open notifications" : "Open notifications, 2 unread");
}
function renderNotifications() {
  byId("notificationList").innerHTML = demoNotifications.map(notification => `
    <div class="notification-item">
      <div class="notification-illustration" aria-hidden="true">${notification.icon}</div>
      <div class="notification-item-content">
        <h3>${notification.title}</h3>
        <p>${notification.message}</p>
        <small>${notification.time} · Sample notification</small>
      </div>
      <span class="notification-status ${notificationsRead ? "is-read" : ""}" aria-hidden="true"></span>
    </div>`).join("");
  byId("markRead").disabled = notificationsRead;
  byId("markRead").textContent = notificationsRead ? "You're all caught up ✓" : "Mark all as read ✓";
  updateUnreadIndicator();
}

function openNotifications() {
  previousFocus = document.activeElement;
  renderNotifications();
  byId("notificationBackdrop").hidden = false;
  byId("notificationSheet").hidden = false;
  document.body.style.overflow = "hidden";
  byId("closeNotifications").focus();
}
function closeNotifications() {
  byId("notificationBackdrop").hidden = true;
  byId("notificationSheet").hidden = true;
  document.body.style.overflow = "";
  previousFocus?.focus();
}
function showToast(message) {
  const toast = byId("toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2500);
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-nav]");
  if (nav) { navigate(nav.dataset.nav); return; }
  const category = event.target.closest("[data-category]");
  if (category) { chooseCategory(category.dataset.category); return; }
  const go = event.target.closest("[data-go]");
  if (go) { navigate(go.dataset.go); return; }
  const add = event.target.closest("[data-add]");
  if (add) { addToCart(add.dataset.add); return; }
  const view = event.target.closest("[data-view]");
  if (view) { openQuickView(view.dataset.view); return; }
  const quantity = event.target.closest("[data-quantity]");
  if (quantity) {
    setQuantity(quantity.dataset.quantity, (cart[quantity.dataset.quantity] || 0) + Number(quantity.dataset.change));
    return;
  }
  if (event.target.closest("#checkoutDemo")) showToast("Checkout is not connected in this concept.");
});

byId("productSearch").addEventListener("input", renderProducts);
byId("headerSearch").addEventListener("click", () => {
  navigate("products");
  byId("productSearch").focus({ preventScroll: true });
});
window.addEventListener("popstate", () => navigate(routeFromHash(), { writeHistory: false, focus: false }));
window.addEventListener("hashchange", () => navigate(routeFromHash(), { writeHistory: false, focus: false }));
document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
  selectedFilter = button.dataset.filter;
  renderProducts();
}));
byId("notificationsTrigger").addEventListener("click", openNotifications);
byId("closeNotifications").addEventListener("click", closeNotifications);
byId("notificationBackdrop").addEventListener("click", closeNotifications);
byId("closeQuickView").addEventListener("click", closeQuickView);
byId("quickViewBackdrop").addEventListener("click", closeQuickView);
byId("markRead").addEventListener("click", () => {
  notificationsRead = true;
  writeJSON("signature-market-demo-notifications-read", true);
  renderNotifications();
});
document.addEventListener("keydown", event => {
  if (byId("quickViewDialog").hidden) return;
  if (event.key === "Escape") { closeQuickView(); return; }
  if (event.key === "Tab") {
    const focusables = [...byId("quickViewDialog").querySelectorAll("button:not(:disabled)")];
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

document.addEventListener("keydown", event => {
  if (byId("notificationSheet").hidden) return;
  if (event.key === "Escape") { closeNotifications(); return; }
  if (event.key === "Tab") {
    const focusables = [...byId("notificationSheet").querySelectorAll("button:not(:disabled)")];
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

renderProducts();
renderCart();
renderNotifications();
updateCartBadge();
navigate(routeFromHash(), { writeHistory: false, focus: false });
