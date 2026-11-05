// Navigation-only demo. The bar keeps its visual design; only the selected
// frosted pill has an elastic, liquid-like motion when switching tabs.
(() => {
  "use strict";

  const nav = document.querySelector(".floating-nav");
  if (!nav) return;

  const links = [...nav.querySelectorAll("[data-route]")];
  const routes = links.map(link => link.dataset.route);
  const bubble = nav.querySelector(".nav-bubble");

  // Prevent Safari's link preview / native long-press action on nav icons.
  // Only this nav is affected; ordinary links elsewhere retain their menus.
  nav.addEventListener("contextmenu", event => event.preventDefault());
  nav.addEventListener("dragstart", event => event.preventDefault());

  // iOS Safari may ignore maximum-scale/user-scalable viewport settings.
  // Prevent native pinch gestures for this deliberately app-like prototype.
  // Do not block single-finger touchmove: normal taps/scrolls stay functional.
  const preventZoom = event => event.preventDefault();
  document.addEventListener("gesturestart", preventZoom, { passive: false });
  document.addEventListener("gesturechange", preventZoom, { passive: false });
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let previousIndex = null;
  let bubbleAnimation = null;
  let targetIndex = 0;
  let fillTimer = null;
  let selectionEpoch = 0;

  function fillArrivedIcon(index, epoch) {
    // Guard against a stale callback even if the user revisits the same tab.
    if (index !== targetIndex || epoch !== selectionEpoch) return;
    window.clearTimeout(fillTimer);
    fillTimer = null;
    links.forEach((link, i) => link.classList.toggle("is-filled", i === index));
  }

  // Keep the slide and elastic distortion on the same 430ms timeline.
  // The icon starts filling during the pill's final approach, not afterward.
  const bubbleMotionDurationMs = 430;
  const fillOnOverlapDelayMs = 250;

  function animateBubble(distance) {
    if (!bubble || typeof bubble.animate !== "function" || prefersReducedMotion.matches) return;

    // Stretch briefly while accelerating, then compress along the travel
    // axis at landing. Longer jumps stretch only a little more.
    // The parent handles position; the child handles deformation.
    const stretch = Math.min(1.18, 1.11 + (distance - 1) * 0.023);
    const squash = Math.max(0.92, 0.96 - (distance - 1) * 0.012);

    // Start from the currently rendered shape during rapid taps, so a second
    // selection doesn't snap the first bounce back to its resting state.
    const currentShape = bubbleAnimation
      ? window.getComputedStyle(bubble).transform
      : "scale(1, 1)";
    if (bubbleAnimation) bubbleAnimation.cancel();
    const animation = bubble.animate([
      { transform: currentShape === "none" ? "scale(1, 1)" : currentShape, offset: 0 },
      { transform: `scale(${stretch}, ${squash})`, offset: 0.22 },
      { transform: "scale(1.02, 0.99)", offset: 0.56 },
      { transform: "scale(0.97, 1.04)", offset: 0.78 },
      { transform: "scale(1, 1)", offset: 1 }
    ], {
      duration: bubbleMotionDurationMs,
      easing: "cubic-bezier(.2, .78, .3, 1)"
    });
    bubbleAnimation = animation;
    animation.onfinish = () => {
      if (bubbleAnimation === animation) bubbleAnimation = null;
    };
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

    const isFirstSelection = previousIndex === null;
    const changed = !isFirstSelection && previousIndex !== index;
    targetIndex = index;
    if (changed || isFirstSelection) selectionEpoch += 1;
    const epoch = selectionEpoch;
    if (changed) {
      window.clearTimeout(fillTimer);
      fillTimer = null;
      // Old icon becomes outlined immediately; destination fills on landing.
      links.forEach(link => link.classList.remove("is-filled"));
      if (prefersReducedMotion.matches) {
        fillArrivedIcon(index, epoch);
      } else {
        animateBubble(Math.abs(index - previousIndex));
        fillTimer = window.setTimeout(() => fillArrivedIcon(index, epoch), fillOnOverlapDelayMs);
      }
    } else if (isFirstSelection) {
      fillArrivedIcon(index, epoch);
    }
    previousIndex = index;
  }

  nav.classList.add("is-initializing");
  syncSelection();
  window.requestAnimationFrame(() => nav.classList.remove("is-initializing"));
  window.addEventListener("hashchange", syncSelection);
})();
