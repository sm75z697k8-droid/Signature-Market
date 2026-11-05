/**
 * Responsive integration for the UNMODIFIED Web Component by srdavo:
 * https://github.com/srdavo/liquid-glass
 *
 * The wide glass capsule and the small selected-tab glass bubble both use the
 * original custom element. We only synchronize their dimensions with our UI.
 * Safari receives the author's existing blur fallback.
 */
(() => {
  "use strict";

  const nav = document.querySelector(".floating-nav");
  const capsule = nav?.querySelector("glass-element.nav-glass");
  const bubble = nav?.querySelector("glass-element.nav-bubble");
  if (!nav || !capsule || !bubble || !customElements.get("glass-element")) return;

  function updateElement(element, width, height) {
    if (width < 1 || height < 1) return;
    const dimensions = {
      width: Math.round(width),
      height: Math.round(height),
      radius: Math.round(height / 2)
    };
    // Upstream re-renders when an attribute changes. Avoid redundant changes,
    // especially when rotating the device or resizing Safari's viewport.
    Object.entries(dimensions).forEach(([name, value]) => {
      const stringValue = String(value);
      if (element.getAttribute(name) !== stringValue) {
        element.setAttribute(name, stringValue);
      }
    });
  }

  let frame = 0;
  function syncSize() {
    frame = 0;
    // offsetWidth/Height exclude transforms, so the bubble's gentle stretch
    // animation doesn't accidentally change its glass distortion geometry.
    updateElement(capsule, nav.offsetWidth, nav.offsetHeight);
    updateElement(bubble, bubble.offsetWidth, bubble.offsetHeight);
  }

  function scheduleSizeSync() {
    if (!frame) frame = requestAnimationFrame(syncSize);
  }

  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(scheduleSizeSync);
    observer.observe(nav);
  } else {
    window.addEventListener("resize", scheduleSizeSync, { passive: true });
  }
  window.addEventListener("pageshow", scheduleSizeSync, { passive: true });
  scheduleSizeSync();
})();
