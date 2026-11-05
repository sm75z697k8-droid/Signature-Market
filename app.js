// Navigation-only demo. The bar keeps its visual design; only the selected
// frosted pill has an elastic, liquid-like motion when switching tabs.
(() => {
  "use strict";

  const nav = document.querySelector(".floating-nav");
  if (!nav) return;

  const links = [...nav.querySelectorAll("[data-route]")];
  const routes = links.map(link => link.dataset.route);
  const bubble = nav.querySelector(".nav-bubble");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let previousIndex = null;
  let bubbleAnimation = null;

  function animateBubble(distance) {
    if (!bubble || typeof bubble.animate !== "function" || prefersReducedMotion.matches) return;

    // A longer journey gives the bubble slightly more stretch. The animation
    // lives on the child; its parent handles horizontal translation.
    const stretch = Math.min(1.23, 1.12 + (distance - 1) * 0.035);
    const squash = Math.max(0.87, 0.93 - (distance - 1) * 0.015);

    // Start from the currently rendered shape during rapid taps, so a second
    // selection doesn't snap the first bounce back to its resting state.
    const currentShape = bubbleAnimation
      ? window.getComputedStyle(bubble).transform
      : "scale(1, 1)";
    if (bubbleAnimation) bubbleAnimation.cancel();
    bubbleAnimation = bubble.animate([
      { transform: currentShape === "none" ? "scale(1, 1)" : currentShape, offset: 0 },
      { transform: `scale(${stretch}, ${squash})`, offset: 0.30 },
      { transform: "scale(0.95, 1.06)", offset: 0.72 },
      { transform: "scale(1, 1)", offset: 1 }
    ], {
      duration: 540,
      easing: "cubic-bezier(.22, .8, .30, 1)"
    });
  }

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

    // Do not bounce on first load or when the current tab is selected again.
    if (previousIndex !== null && previousIndex !== index) {
      animateBubble(Math.abs(index - previousIndex));
    }
    previousIndex = index;
  }

  nav.classList.add("is-initializing");
  syncSelection();
  window.requestAnimationFrame(() => nav.classList.remove("is-initializing"));
  window.addEventListener("hashchange", syncSelection);
})();
