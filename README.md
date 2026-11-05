# Signature Market · Responsive Shopping Web App

An **unofficial, responsive online shopping website concept** for Signature Market. The design draws inspiration from modern Apple web interfaces: generous whitespace, subtle translucency, soft green surfaces, oversized editorial banners, rounded cards, and clear shopping flows.

> **Not an official Signature Market website.** This is a front-end demonstration. All products, packshot illustrations (emojis), prices and notifications are sample data. The website does not connect to real accounts, inventory, payments or fulfillment.

## Preview locally

This is a **vanilla HTML, CSS and JavaScript web app** with no dependencies or build step.

1. Clone this repository and check out the `feat/responsive-shopping-web-app` branch.
2. Open `index.html` directly in a browser, or start a local server:

```bash
python3 -m http.server 8000
```

3. Visit [http://localhost:8000](http://localhost:8000).

Use a desktop and a phone (or responsive device emulator) to review both layouts.

## What the site does

- **Home:** desktop hero, browsing categories, featured products and an editorial section.
- **Products:** search by name or category, filter by category, browse cards and open a product quick view.
- **My Cart:** add products, adjust quantities, remove items, view item counts and subtotal.
- **Profile:** demo account entry page with clearly labeled unavailable sign-in functionality.
- **Notifications:** accessible panel opened from the header bell; sample notifications can be marked as read.
- **Cart and notification state:** saved in browser localStorage when available.
- **Deep links:** `#home`, `#products`, `#cart` and `#profile`; browser back/forward works.

## Responsive navigation

| Desktop / tablet (768px+) | Mobile (under 768px) |
| --- | --- |
| Sticky header with **Home** and **Shop products** links | Sticky compact brand header |
| Search, Notifications, Cart and Profile actions on the right | Notification bell in header |
| Footer with site links | Floating four-tab bottom navigation: Home, Products, My Cart, Profile |
| Four-column catalogue and category grid | Two-column catalogue and category grid |

Notifications are in the top header rather than a fifth tab, keeping the primary mobile commerce actions spacious. On desktop, a full-width header is more natural for a website than a floating bottom bar.

## Project structure

- `index.html`: semantic page structure, site header, navigation, content sections, footer and dialogs.
- `styles.css`: theme, responsive layouts, hover and focus states and mobile-safe-area support.
- `app.js`: client-side hash routing, search, filters, cart, product quick view and notification interactions.

## Future production integrations

- Replace demo inventory and pricing with a real product API.
- Add real product packshots, ingredient, allergen and nutritional information.
- Implement authentication, orders, checkout, payment, shipping and stock validation.
- Add automated tests, accessibility audits and proper deployment infrastructure.
- Obtain authorization for any official brand assets or live commerce integrations.

## Publishing a static preview

Because no build step is needed, this prototype can be hosted on GitHub Pages or any static web host. Enable GitHub Pages in the repository's **Settings → Pages** when ready, choose the branch and root folder, and wait for GitHub to publish the preview. The `#products`, `#cart`, and other hash links do not require server-side route rewrites.
