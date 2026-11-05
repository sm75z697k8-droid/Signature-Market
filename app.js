// Minimal navigation-only demo. No page content is loaded or simulated.
(() => {
  "use strict";
  const nav = document.querySelector(".floating-nav");
  if (!nav) return;
  const links = [...nav.querySelectorAll("[data-route]")];
  const routes = links.map(link => link.dataset.route);

  function syncSelection() {
    const hash = window.location.hash.slice(1).toLowerCase();
    const index = Math.max(0, routes.indexOf(hash));
    nav.style.setProperty("--active-offset", String(index * 100) + "%");

    links.forEach((link, i) => {
      const selected = i === index;
      link.classList.toggle("is-active", selected);
      if (selected) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  nav.classList.add("is-initializing");
  syncSelection();
  window.requestAnimationFrame(() => {
    nav.classList.remove("is-initializing");
  });
  window.addEventListener("hashchange", syncSelection);
})();
