/**
 * Signature Market: experimental liquid-glass navigation enhancement.
 *
 * Original implementation, inspired by the SVG displacement technique discussed
 * in https://github.com/srdavo/liquid-glass (no source copied).
 *
 * On Chromium, an edge-weighted displacement map bends the sampled backdrop,
 * with subtle RGB channel offsets near the capsule rim.
 *
 * iPhone Safari and other WebKit browsers use the translucent blur, specular
 * lighting and sliding glass lens implemented in styles.css instead:
 * SVG filters in CSS backdrop-filter are not reliably supported in WebKit.
 *
 * No dependencies, requests, tracking, or expensive per-frame canvas updates.
 */
(() => {
  "use strict";

  const nav = document.querySelector(".floating-nav");
  if (!nav) return;

  const reducedTransparency = window.matchMedia("(prefers-reduced-transparency: reduce)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Follow touch or mouse position with the soft surface highlight on iPhone too.
  // This only changes two CSS properties; the browser handles compositing.
  if (!reducedMotion.matches && !reducedTransparency.matches) {
    nav.addEventListener("pointermove", event => {
      const bounds = nav.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      nav.style.setProperty("--glass-light-x", Math.max(0, Math.min(100, x * 100)).toFixed(1) + "%");
      nav.style.setProperty("--glass-light-y", Math.max(0, Math.min(100, y * 100)).toFixed(1) + "%");
    }, { passive: true });
    nav.addEventListener("pointerleave", () => {
      nav.style.removeProperty("--glass-light-x");
      nav.style.removeProperty("--glass-light-y");
    }, { passive: true });
  }

  // The linked Web Component also falls back to blur on Safari. Do not try to
  // install an unsupported SVG backdrop filter on iOS, even in Chrome for iOS.
  const ua = navigator.userAgent;
  const isChromium = /(?:Chrome|Chromium|Edg)\//.test(ua);
  const usesWebKitOnIOS = /iPad|iPhone|iPod|CriOS|EdgiOS|FxiOS/.test(ua);
  const supportsFilterURL = window.CSS && CSS.supports &&
    (CSS.supports("backdrop-filter", 'url("#sm-liquid-glass")') ||
     CSS.supports("-webkit-backdrop-filter", 'url("#sm-liquid-glass")'));

  if (!isChromium || usesWebKitOnIOS || !supportsFilterURL || reducedTransparency.matches) {
    nav.dataset.glassMode = "safari-blur";
    return;
  }

  const NS = "http://www.w3.org/2000/svg";
  const svgNode = (tag, attributes = {}) => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  };

  // Produce a soft signed-distance edge band for a true capsule rather than
  // moving the whole background equally. 128 is neutral for feDisplacementMap.
  function createEdgeField(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: false });
    if (!context) return null;
    const frame = context.createImageData(width, height);
    const radius = Math.min(width, height) / 2;
    const halfW = width / 2;
    const halfH = height / 2;
    const band = Math.min(24, height * .36);
    const data = frame.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Signed distance from a rounded rectangle with capsule corners.
        const dx = Math.abs(x + .5 - halfW) - (halfW - radius);
        const dy = Math.abs(y + .5 - halfH) - (halfH - radius);
        const outside = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
        const signedDistance = outside + Math.min(Math.max(dx, dy), 0) - radius;
        const distanceInside = Math.max(0, -signedDistance);
        const edge = Math.pow(Math.max(0, 1 - distanceInside / band), 2);
        const nx = (x + .5 - halfW) / halfW;
        const ny = (y + .5 - halfH) / halfH;
        const pixel = (y * width + x) * 4;

        // Horizontal shifts come from red; vertical shifts from green.
        data[pixel] = Math.max(0, Math.min(255, 128 + nx * edge * 115));
        data[pixel + 1] = Math.max(0, Math.min(255, 128 + ny * edge * 115));
        data[pixel + 2] = 128;
        data[pixel + 3] = 255;
      }
    }
    context.putImageData(frame, 0, 0);
    return canvas.toDataURL("image/png");
  }

  // A fresh, locally-built filter; nothing is downloaded from the reference repo.
  const hiddenSvg = svgNode("svg", {
    width: 0, height: 0, "aria-hidden": "true",
    style: "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none"
  });
  const defs = svgNode("defs");
  const filter = svgNode("filter", {
    id: "sm-liquid-glass", filterUnits: "userSpaceOnUse",
    "color-interpolation-filters": "sRGB"
  });
  const image = svgNode("feImage", {
    x: 0, y: 0, preserveAspectRatio: "none", result: "field"
  });
  filter.append(image);

  // Distort each colour very slightly differently to mimic a refractive edge.
  const channels = [
    { name: "red", scale: 27, matrix: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" },
    { name: "green", scale: 24, matrix: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" },
    { name: "blue", scale: 21, matrix: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" }
  ];
  channels.forEach(channel => {
    filter.append(svgNode("feDisplacementMap", {
      in: "SourceGraphic", in2: "field", scale: channel.scale,
      xChannelSelector: "R", yChannelSelector: "G",
      result: channel.name + "-shift"
    }));
    filter.append(svgNode("feColorMatrix", {
      in: channel.name + "-shift", type: "matrix",
      values: channel.matrix, result: channel.name + "-only"
    }));
  });
  filter.append(svgNode("feBlend", {
    in: "red-only", in2: "green-only", mode: "screen", result: "red-green"
  }));
  filter.append(svgNode("feBlend", {
    in: "red-green", in2: "blue-only", mode: "screen"
  }));
  defs.append(filter);
  hiddenSvg.append(defs);
  document.body.append(hiddenSvg);

  const layer = document.createElement("span");
  layer.className = "nav-refraction";
  layer.setAttribute("aria-hidden", "true");
  nav.prepend(layer);

  let lastDimensions = "";
  let pendingFrame = 0;
  const updateField = () => {
    pendingFrame = 0;
    if (!document.body.contains(nav)) return;
    const rectangle = layer.getBoundingClientRect();
    const width = Math.max(1, Math.round(rectangle.width));
    const height = Math.max(1, Math.round(rectangle.height));
    if (width < 80 || height < 30) return;
    const key = width + "x" + height;
    if (key === lastDimensions) return;

    const dataUrl = createEdgeField(width, height);
    if (!dataUrl) return;
    lastDimensions = key;
    filter.setAttribute("x", "0");
    filter.setAttribute("y", "0");
    filter.setAttribute("width", String(width));
    filter.setAttribute("height", String(height));
    image.setAttribute("width", String(width));
    image.setAttribute("height", String(height));
    image.setAttribute("href", dataUrl);
    layer.style.backdropFilter = 'url("#sm-liquid-glass") blur(1.5px) saturate(1.3)';
    layer.style.webkitBackdropFilter = 'url("#sm-liquid-glass") blur(1.5px) saturate(1.3)';
    nav.classList.add("has-refraction");
    nav.dataset.glassMode = "svg-refraction";
  };
  const scheduleUpdate = () => {
    if (!pendingFrame) pendingFrame = requestAnimationFrame(updateField);
  };

  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(nav);
  } else {
    window.addEventListener("resize", scheduleUpdate, { passive: true });
  }
  scheduleUpdate();

  reducedTransparency.addEventListener?.("change", event => {
    if (event.matches) {
      nav.classList.remove("has-refraction");
      nav.dataset.glassMode = "safari-blur";
    } else {
      lastDimensions = "";
      scheduleUpdate();
    }
  });
})();
