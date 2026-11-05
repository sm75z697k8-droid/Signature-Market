# Signature Market — Floating Navigation Concept

A **personal, unofficial redesign prototype** for the Signature Market shopping experience, built mobile-first for iPhone Safari. This is not the official app, does not use real customer data, and is not connected to checkout, orders, notifications, or any Signature Market systems.

## What works

- Five floating, rounded tabs: **Home, Products, Notifications (shown as Alerts), My Cart (shown as Cart), Profile**.
- **Liquid-Glass-inspired navigation:** a fully rounded floating capsule, layered translucency, background blur, edge highlights, and one sliding glossy selection lens.
- **Icon state animation:** outlined SVGs when inactive and filled SVGs when selected, with a short crossfade/scale transition.
- **Fluid tab switching:** a spring-like 520ms glide between destinations, plus a subtle moving reflection. Rapid taps interrupt and redirect the transition.
- A cart badge, iPhone safe-area support, and accessibility fallbacks for reduced motion and reduced transparency.
- Functional navigation with URL hashes, browser Back/Forward, and scroll position remembered per tab.
- Product search and category chips.
- Add to cart, quantity +/−, calculated sample subtotal, and demo cart saved in your browser when local storage is available.
- iPhone safe-area spacing, touch-friendly controls, semantic labels, and reduced-motion support.
- No npm, React, build commands, dependencies, credentials, or laptop required.

## Preview on iPhone (GitHub Pages)

GitHub doesn't render `index.html` as a running website inside the repository view. To host the prototype, enable **GitHub Pages** once:

1. Open this repository on GitHub in **Safari** and sign into your account.
2. Open **Settings → Pages**. On a narrow screen you may need to scroll the repository's top navigation, or request the desktop website in Safari.
3. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main**, folder to **/(root)**, then tap **Save**.
4. Once GitHub Pages has published, use the **Visit site** link in Pages settings. The expected URL is:
   **https://sm75z697k8-droid.github.io/Signature-Market/**
5. Optional: in Safari, tap Share → **Add to Home Screen** for an app-like shortcut.

The first publication can take a short time. If you don't see the site, return to Pages settings to check its status. Future changes to `main` publish automatically.

## Files

| File | Purpose |
|---|---|
| `index.html` | Semantic views, inline SVG icons, five-tab floating navigation |
| `styles.css` | iPhone-first responsive styling, glass bar, safe areas |
| `app.js` | Tab routing, demo products, filtering, and local cart |
| `liquid-glass.js` | Original SVG displacement experiment for supported Chromium browsers, plus touch-responsive highlights for iPhone |
| `icon.svg` | Original concept leaf icon |
| `README.md` | This guide |

All paths are relative, so the prototype works from the GitHub Pages subdirectory.

## Liquid Glass and compatibility

Apple's real Liquid Glass is a native iOS 26 system material with dynamic refraction. This standalone HTML/CSS/JavaScript site cannot invoke that exact native renderer. Instead, it approximates its **appearance** with Safari-supported `-webkit-backdrop-filter`, layered highlights, translucent gradients, and a moving glass lens. It does not claim pixel-perfect equivalence.

All five tabs use custom local SVGs (no icon-library dependency). The inactive/active icons are layered so they fade smoothly between outlines and solid silhouettes. The selection lens is **one element that translates between tabs**, rather than five separate backgrounds fading in and out.

You can tweak the feel in `styles.css`:
- `.floating-nav`: capsule roundness, transparency, blur, and outer shadow.
- `.nav-indicator`: selected glass lens, highlight, spring-like movement.
- `.nav-item` and `.nav-icon`: icon colours, weight, transitions, and touch target.

The glass lens works without JavaScript animation libraries. On devices that request reduced motion, movement is effectively disabled. On devices that request reduced transparency or don't support backdrop blur, the bar becomes opaque so the labels remain readable.

### Inspired by srdavo/liquid-glass

The experimental refraction in this project was **inspired by** [srdavo/liquid-glass](https://github.com/srdavo/liquid-glass), which demonstrates how an SVG displacement map and a backdrop filter can imitate light bending. The original repository has no visible licence file, so this project **does not copy its source files**. Instead, `liquid-glass.js` independently implements a capsule-shaped signed-distance displacement field (generated in a canvas once per size), uses an SVG filter for optional RGB edge separation, and adds a small touch-following surface reflection.

**Important iPhone limitation:** The reference project itself uses a blur fallback on Safari. Its full SVG refraction is not reliably available to ordinary Safari web pages. The iPhone experience here therefore uses Apple's WebKit-compatible backdrop blur with gradients and specular highlights; it cannot be an exact clone of native iOS Liquid Glass. Chromium environments with support for SVG filters in `backdrop-filter` can receive the experimental true displacement treatment. If a browser does not support that technique or transparency is reduced, navigation remains fully functional with the fallback glass surface.

No third-party code, package manager, CDN, build process, or additional setup is required.

## Design direction

The initial design **keeps all five requested destinations** to make comparison easy. For a later production version, I recommend **four primary tabs — Home, Shop, Cart, Profile — with Notifications in the header**. That prioritizes shopping and avoids squeezing long labels into a five-column iPhone tab bar. Here, the visible labels are shortened to *Alerts* and *Cart* for legibility, while their accessible names are *Notifications* and *My Cart*.

This is a **web prototype** of the visual direction, not a replacement build of the native iOS/Android company apps. Backend services, real product prices, inventory, authentication, and purchasing would need proper integration later.

## Brand and sample content

Signature Market is a Malaysian brand focused on accessible healthy snacks and lifestyle products. This prototype references representative product names and externally hosted marketing photos from the company's website. **All displayed prices are illustrative sample values**, not live or verified selling prices. Images require internet access.

- Official shop: https://www.signaturemarket.co/my/marketplace/
- Apple tab-bar guidance: https://developer.apple.com/design/human-interface-guidelines/tab-bars

Made as an independent design exploration, not an official release.
