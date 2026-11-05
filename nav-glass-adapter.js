/**
 * Signature Market integration for srdavo/liquid-glass.
 *
 * The upstream files in vendor/liquid-glass/ are intentionally unmodified.
 * This small adapter sizes their <glass-element> to our responsive bottom bar.
 * The glass sits behind—not around—the navigation, so link semantics, hit
 * targets, and the active-pill animation remain controlled by our app.
 */
(() => {
  "use strict";

  const nav = document.querySelector(".floating-nav");
  const glass = nav?.querySelector("glass-element.nav-glass");
  if (!nav || !glass || !customElements.get("glass-element")) return;

  let frame = 0;
  function syncGlassSize() {
    frame = 0;
    const bounds = nav.getBoundingClientRect();
    if (bounds.width < 100 || bounds.height < 40) return;

    const dimensions = {
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
      radius: Math.round(bounds.height / 2)
    };

    // The author's component re-renders on attribute changes. Only update
    // when the dimensions actually change (e.g. rotating an iPhone).
    for (const [name, value] of Object.entries(dimensions)) {
      const next = String(value);
      if (glass.getAttribute(name) !== next) glass.setAttribute(name, next);
    }
  }

  function scheduleSizeSync() {
    if (!frame) frame = requestAnimationFrame(syncGlassSize);
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
