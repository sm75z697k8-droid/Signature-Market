# Signature Market — Mobile Storefront Concept

An **independent, unofficial** mobile-first UI/UX redesign study. It is not connected to Signature Market accounts, stock, checkout, payments, or delivery services.

## What's here

- A new compact Home screen with delivery context, persistent search, a short featured banner, and browsable categories.
- Four compact product cards with original product photography linked from publicly available online images. If a host blocks an image, the card shows an accessible fallback.
- A Products tab with category filters and working search.
- A working **demo-only** Add to Cart interaction, item count, remove controls, and illustrative subtotal. Cart contents stay in memory and disappear on refresh. **No orders are placed.**
- The existing five-button floating frosted-glass navigation, rounded outline/filled icons and ~430ms elastic bubble preserved without edits to its animation script.
- Placeholder Notifications and Profile tabs, visibly marked as incomplete.

## Product data / attribution

Product names, sizes and the illustrative 11.11 promotion price **RM11.00** were checked against Signature Market's public November 2026 promotional listing and the provided app screenshots:

https://signaturesnack.com/my/marketplace/

The comparison prices in this demo are **RM21.80** for Real Tempeh Chips (Original Flavour), and **RM20.00** for Cookies, Crunchy 5 Nuts Mix and Classic Seed Mix. These are **static example prices**, not live quotes or checkout totals; product images may show an alternative pack design or size.

External images are hosted by Lazada, Shopee and Signature Market, and may change or fail to load. This is a non-commercial design demonstration; rights and usage permission should be reviewed before any commercial launch.

## Implementation

Vanilla HTML, CSS and JavaScript. No bundler or dependencies.

- \`index.html\`: content sections and the preserved five-icon navigation.
- \`styles.css\`: original nav styles plus additional storefront layouts and responsive rules.
- \`app.js\`: original selection and bubble animation, **not modified**.
- \`home.js\`: product presentation, routes, filters, search, and demo cart.

## Limitations before production

Replace static prices with a trusted product API, use licensed and optimized locally hosted product imagery, implement authenticated cart/checkout flows, confirm delivery estimates by postcode, and verify user journeys on real Safari devices. Zoom restrictions from the earlier navigation-only prototype remain and should be reconsidered for accessibility before launch.

Preview: https://sm75z697k8-droid.github.io/Signature-Market/
