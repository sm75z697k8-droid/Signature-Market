/**
 * Responsive integration for the UNMODIFIED srdavo/liquid-glass Web Component:
 * https://github.com/srdavo/liquid-glass
 *
 * Important: the dock itself now animates between two widths. The upstream
 * component rebuilds its entire shadow DOM every time a sizing attribute
 * changes, so do NOT update width via ResizeObserver every animation frame.
 *
 * Instead, stretch its Safari glass fallback with CSS during transitions,
 * then rebuild the SVG displacement map ONCE after a width transition ends.
 * This keeps icon touches and selection motion fluid on an iPhone.
 */
(() => {
  "use strict";

  const nav = document.querySelector(".floating-nav");
  const capsule = nav?.querySelector("glass-element.nav-glass");
  const pill = nav?.querySelector("glass-element.nav-bubble");
  if (!nav || !capsule || !pill || !customElements.get("glass-element")) return;

  // iPhone Chrome and Safari both use WebKit, and the author's component
  // already falls back to blur there. Do not repeatedly rebuild that blur
  // when the dock resizes: a percentage-sized shadow box can simply follow it.
  const ua = navigator.userAgent.toLowerCase();
  const isChromiumWithSVGFilter = /chrome|chromium|edg/.test(ua) &&
    !/iphone|ipad|ipod|crios|edgios/.test(ua);

  function fitShadowBox(element) {
    const box = element.shadowRoot?.querySelector(".glass-box");
    if (!box) return;
    // Host width tracks the flexing dock; the upstream fallback follows it
    // without causing a custom-element re-render on each animation frame.
    box.style.boxSizing = "border-box";
    box.style.width = "100%";
    box.style.height = "100%";
  }

  function sizeElement(element, width, height) {
    if (width < 1 || height < 1) return;
    const settings = {
      width: Math.round(width),
      height: Math.round(height),
      radius: Math.round(height / 2)
    };
    for (const [name, number] of Object.entries(settings)) {
      const value = String(number);
      if (element.getAttribute(name) !== value) element.setAttribute(name, value);
    }
    fitShadowBox(element);
  }

  function syncSize() {
    sizeElement(capsule, nav.offsetWidth, nav.offsetHeight);
    // The pill is a capsule at every dock size, never a circle.
    sizeElement(pill, pill.offsetWidth, pill.offsetHeight);
  }

  let resizeTimer;
  const scheduleAfterViewportResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncSize, 190);
  };

  nav.addEventListener("transitionend", event => {
    if (event.target !== nav || event.propertyName !== "width") return;
    if (isChromiumWithSVGFilter) {
      // The original SVG displacement map is size-dependent. Rebuild it
      // once, after the width transition, never on each animation frame.
      syncSize();
    } else {
      // Preserve WebKit's existing glass boxes to avoid a visible blink.
      fitShadowBox(capsule);
      fitShadowBox(pill);
    }
  });
  window.addEventListener("resize", scheduleAfterViewportResize, { passive: true });
  window.addEventListener("orientationchange", scheduleAfterViewportResize, { passive: true });
  window.addEventListener("pageshow", syncSize, { passive: true });
  requestAnimationFrame(syncSize);
})();
