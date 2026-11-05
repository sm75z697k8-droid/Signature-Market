# Signature Market — iPhone UI Redesign Concept

An **independent, unofficial mobile-first storefront prototype** for exploring a cleaner Signature Market shopping app. Built in plain HTML, CSS and JavaScript to work directly from GitHub Pages and iPhone Safari.

## Compact floating navigation

Five icon-only destinations: **Home, Products, Notifications, My Cart, Profile**.

- Thin, rounded **outline icons** become **filled icons** when selected.
- No visible text labels in the navigation. Every link retains a descriptive `aria-label` for VoiceOver.
- A subtle, fully rounded **54px-tall** translucent glass capsule sits **2px above the iPhone safe-area inset**.
- Five accessible **44px touch targets**, a small cart-quantity badge, and a separate **40px circular glass bubble** that slides under the active tab and gently stretches in motion.
- The current tab is reflected in the URL hash, so browser Back/Forward works and scroll positions are preserved.

### The original srdavo/liquid-glass component

Per the design brief, the project contains **unaltered copies of both JavaScript files** from:

**https://github.com/srdavo/liquid-glass**

- `vendor/liquid-glass/displacement-utils.js` — upstream displacement-map and SVG-filter helpers.
- `vendor/liquid-glass/glass-element.js` — upstream `<glass-element>` Web Component.

Both files were copied as-is from the upstream `main` branch. We did **not** rewrite the author's component. All layout and integration changes live in our own `styles.css`, `index.html`, and `nav-glass-adapter.js`. The project uses **two instances of the original component**: one for the translucent dock, and one inside the animated selection bubble. The adapter keeps both sized correctly on rotation and screen resize.

**Browser compatibility:** The upstream component's own code explicitly uses a standard blurred-glass fallback on Safari, including iPhone Safari; SVG backdrop displacement works mainly in supported Chromium browsers. On an iPhone you will therefore see the **author's Safari fallback**, not full real-time refractive distortion. This is not a pixel-identical implementation of Apple's native iOS Liquid Glass system. Our small highlights and moving selection pill remain visible on Safari.

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
| `styles.css` | Compact rounded UI, position, active highlight and motion |
| `app.js` | Hash-based tab navigation, demo product search and persistent local cart |
| `nav-glass-adapter.js` | Sizes both original glass instances (dock and moving selection bubble) |
| `vendor/liquid-glass/displacement-utils.js` | **Unmodified original** by srdavo |
| `vendor/liquid-glass/glass-element.js` | **Unmodified original** by srdavo |
| `icon.svg` | Local concept icon |

## Scope and limitations

This is a visual web **prototype**, not the official Signature Market app. Product names and externally hosted photos are representative; displayed prices are illustrative sample values. There is no live inventory, sign-in, delivery, notifications, payment or checkout.

The navigation and demo cart work offline after the required files have been loaded, but externally hosted product images need an internet connection.

- Official Signature Market shop: https://www.signaturemarket.co/my/marketplace/
- Original Liquid Glass project: https://github.com/srdavo/liquid-glass
- Apple tab-bar design guidance: https://developer.apple.com/design/human-interface-guidelines/tab-bars
