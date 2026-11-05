# Signature Market — iPhone UI Redesign Concept

An **independent, unofficial mobile-first storefront prototype** for exploring a cleaner Signature Market shopping app. Built in plain HTML, CSS and JavaScript to work directly from GitHub Pages and iPhone Safari.

## Navigation — screen-recording reference

The icon-only dock is deliberately based on the supplied **dark, rounded, translucent navigation example**, rather than the earlier green/white custom glass simulation.

- **Expanded on launch / upward scrolling.** Uses identical horizontal margins on both sides: `--dock-edge-gap: clamp(24px, 6.5vw, 40px)`. This is not edge-to-edge. The bar is always centred.
- **Compact on downward scrolling.** Shrinks to a maximum width of **286px**; expands again on deliberate upward movement. Tiny scroll jitters don't flip its state.
- **Smoother width interpolation.** The dock remains centred and animates its width over **600ms**. A single selected **pill**, not a round bubble, moves horizontally under the active icon.
- **Reference-inspired palette.** Dark translucent surface, muted white outlined icons, solid white icons for active tabs, and a muted grey active pill.
- **No extra handmade glass filters.** The two transparent surfaces are real `<glass-element>` instances from srdavo's unmodified source; CSS only handles layout, contrast, border, and animation.
- Keeps all five 44px touch targets: Home, Products, Notifications, My Cart, and Profile. The labels are invisible visually but remain in `aria-label` for VoiceOver.

For design tweaks, edit `.floating-nav` and `.floating-nav.is-compact` in `styles.css`. The glass appearance itself is controlled by the `background-color`, `blur`, `depth`, `strength` and `chromatic-aberration` attributes in `index.html`.

### The original srdavo/liquid-glass component

Per the design brief, the project contains **unaltered copies of both JavaScript files** from:

**https://github.com/srdavo/liquid-glass**

- `vendor/liquid-glass/displacement-utils.js` — upstream displacement-map and SVG-filter helpers.
- `vendor/liquid-glass/glass-element.js` — upstream `<glass-element>` Web Component.

Both files were copied as-is from the upstream `main` branch. We did **not** rewrite the author's component. All layout and integration changes live in our own `styles.css`, `index.html`, and `nav-glass-adapter.js`. The project uses **two instances of the original component**: one for the translucent dock, and one inside the sliding pill. The adapter updates their filter geometry after animated width transitions or device rotation; the upstream files themselves remain unchanged.

**Browser compatibility:** The upstream component's own code explicitly uses a standard blurred-glass fallback on iPhone Safari. Chrome on iPhone also uses WebKit, so **switching to Chrome on the same iPhone does not enable Chromium's full SVG backdrop displacement**. Full refraction is available only on compatible Chromium engines, usually on other platforms. On your iPhone you will see the **author's Safari-style blur fallback**, not full real-time refractive distortion. This is not a pixel-identical implementation of Apple's native iOS Liquid Glass system. Our small highlights and moving selection pill remain visible on Safari.

**Attribution / permission:** This repository gives credit to srdavo and links to the original source. The upstream project did not show a separate licence file when copied; if distributing this as an official company product, retain attribution and confirm the permission terms with the author.

## Preview on your iPhone

You don't need a laptop or build tools:

1. Sign in to GitHub in Safari and open this repository.
2. Open **Settings → Pages**. If the tab is hidden on iPhone, scroll the repository navigation or request the desktop website.
3. Set Source to **Deploy from a branch**, select **main**, folder **/(root)**, then Save.
4. When publishing is complete, open **https://sm75z697k8-droid.github.io/Signature-Market/**.
5. Optional: Safari **Share → Add to Home Screen** for a more app-like view.

If Pages is already configured, new commits to `main` deploy automatically. If the design looks cached, refresh or reopen the page.

## Project structure

| File | Purpose |
|---|---|
| `index.html` | Storefront screens, SVG icon outlines/fills, five icon-only tabs |
| `styles.css` | Symmetric side margins, dark styling, pill highlight, width transitions and accessibility |
| `app.js` | Hash-based tab navigation, demo product search and persistent local cart |
| `nav-scroll.js` | Scroll direction, thresholds, expanding and collapsing the dock |
| `nav-glass-adapter.js` | Keeps original glass components fluid without per-frame re-rendering |
| `vendor/liquid-glass/displacement-utils.js` | **Unmodified original** by srdavo |
| `vendor/liquid-glass/glass-element.js` | **Unmodified original** by srdavo |
| `icon.svg` | Local concept icon |

## Scope and limitations

This is a visual web **prototype**, not the official Signature Market app. Product names and externally hosted photos are representative; displayed prices are illustrative sample values. There is no live inventory, sign-in, delivery, notifications, payment or checkout.

The navigation and demo cart work offline after the required files have been loaded, but externally hosted product images need an internet connection.

- Official Signature Market shop: https://www.signaturemarket.co/my/marketplace/
- Original Liquid Glass project: https://github.com/srdavo/liquid-glass
- Apple tab-bar design guidance: https://developer.apple.com/design/human-interface-guidelines/tab-bars
