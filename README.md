# Signature Market — Floating Navigation Concept

A **personal, unofficial redesign prototype** for the Signature Market shopping experience, built mobile-first for iPhone Safari. This is not the official app, does not use real customer data, and is not connected to checkout, orders, notifications, or any Signature Market systems.

## What works

- Five floating, rounded tabs: **Home, Products, Notifications (shown as Alerts), My Cart (shown as Cart), Profile**.
- Soft glass-like background, active-state pill, recognizable inline SVG icons, and a badge showing the number of items in the demo cart.
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
| `icon.svg` | Original concept leaf icon |
| `README.md` | This guide |

All paths are relative, so the prototype works from the GitHub Pages subdirectory.

## Design direction

The initial design **keeps all five requested destinations** to make comparison easy. For a later production version, I recommend **four primary tabs — Home, Shop, Cart, Profile — with Notifications in the header**. That prioritizes shopping and avoids squeezing long labels into a five-column iPhone tab bar. Here, the visible labels are shortened to *Alerts* and *Cart* for legibility, while their accessible names are *Notifications* and *My Cart*.

This is a **web prototype** of the visual direction, not a replacement build of the native iOS/Android company apps. Backend services, real product prices, inventory, authentication, and purchasing would need proper integration later.

## Brand and sample content

Signature Market is a Malaysian brand focused on accessible healthy snacks and lifestyle products. This prototype references representative product names and externally hosted marketing photos from the company's website. **All displayed prices are illustrative sample values**, not live or verified selling prices. Images require internet access.

- Official shop: https://www.signaturemarket.co/my/marketplace/
- Apple tab-bar guidance: https://developer.apple.com/design/human-interface-guidelines/tab-bars

Made as an independent design exploration, not an official release.
