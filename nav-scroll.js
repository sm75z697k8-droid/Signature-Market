/**
 * Expand/collapse the floating shopping navigation as the user scrolls.
 *
 * Starts expanded, shrinks after intentional downward movement, and grows
 * again after upward movement. The direction thresholds prevent iOS Safari
 * scroll bounce and one-pixel scrolling jitter from toggling the bar.
 *
 * Only CSS classes change while scrolling: no layout measurements, animation
 * frames devoted to filters, or expensive Web Component re-renders.
 */
(() => {
  "use strict";

  const dock = document.querySelector(".floating-nav");
  if (!dock) return;

  const topThreshold = 28;
  const collapseAfterY = 76;
  const downDistance = 24;
  const upDistance = 17;

  let lastY = Math.max(0, window.scrollY);
  let trend = 0;
  let travel = 0;
  let frame = 0;
  let suspendScroll = false;

  function updateDock() {
    frame = 0;
    const y = Math.max(0, window.scrollY);
    const delta = y - lastY;
    lastY = y;

    if (suspendScroll) return;
    if (y <= topThreshold) {
      dock.classList.remove("is-compact");
      trend = 0;
      travel = 0;
      return;
    }

    if (Math.abs(delta) < 1) return;
    const direction = Math.sign(delta);

    // Discard the old direction's momentum as soon as the user reverses.
    if (direction !== trend) {
      trend = direction;
      travel = 0;
    }
    travel += Math.abs(delta);

    if (direction > 0 && y >= collapseAfterY && travel >= downDistance) {
      dock.classList.add("is-compact");
      travel = 0;
    } else if (direction < 0 && travel >= upDistance) {
      dock.classList.remove("is-compact");
      travel = 0;
    }
  }

  window.addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(updateDock);
  }, { passive: true });

  // A tab switch can restore a saved scroll position programmatically. Treat
  // that as navigation, not a downward flick, and reveal the full-sized bar.
  document.addEventListener("signature-market:routechange", () => {
    suspendScroll = true;
    dock.classList.remove("is-compact");
    trend = 0;
    travel = 0;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lastY = Math.max(0, window.scrollY);
        suspendScroll = false;
      });
    });
  });

  // Safari may restore the old page after a back/forward cache navigation.
  window.addEventListener("pageshow", event => {
    if (event.persisted) {
      lastY = Math.max(0, window.scrollY);
      trend = 0;
      travel = 0;
      dock.classList.remove("is-compact");
    }
  });
})();
