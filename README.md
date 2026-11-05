# Signature Market — Shopping App Redesign Concept

An **unofficial, mobile-first UI exploration** for [Signature Market](https://www.signaturemarket.co/my/marketplace/), inspired by Apple's calm layouts, soft surfaces, rounded shapes, and restrained translucency.

## Run it

No dependencies or build tools are required.

1. Clone or download this repository.
2. Open `index.html` in a browser.
3. For a local server, run `python3 -m http.server 8000` and open `http://localhost:8000`.

It works on mobile and desktop, but is designed mobile-first. A browser's device emulator is useful for reviewing the floating bar.

## Navigation design decision

**Four primary destinations in a floating bottom pill:**

- **Home** — offers and discovery
- **Products** — browsing, search and category filters
- **My Cart** — purchase progress
- **Profile** — account entry point

**Notifications** use a bell in the top-right header, with an unread indicator. They remain globally accessible without taking up a primary tab. This creates more touch space and keeps the key shopping journeys one tap away.

## What works in this prototype

- Navigation with active state, matching screen content and accessible labels.
- Bottom navigation that respects mobile safe areas.
- Product search and category filters.
- Add-to-cart, item counts, quantity controls, calculated subtotal, and empty-cart view.
- Demo cart saved in the browser's local storage.
- Notification bottom sheet with close, Escape key, focus handling, unread indicator, and mark-as-read.
- Mobile-first layout, visible keyboard focus and reduced-motion support.

## Not yet connected

This is a **front-end concept, not a live e-commerce application**.

- Product names, prices, emojis, promotions and notifications are illustrative sample content. Don't rely on them for real inventory or pricing.
- Checkout and authentication are not connected to a server.
- Cart and notification state are stored only in this browser.
- Replace the placeholder artwork and content with approved brand assets and live APIs before production use.

## Files

- `index.html` — semantic page structure and navigation
- `styles.css` — visual design and responsive layout
- `app.js` — page switching and prototype interactions

## Suggested next steps

Connect real product data; add product detail pages; improve account and checkout journeys; then test the bottom navigation with customers. Evaluate whether shoppers prefer a four-tab bottom bar with a notification bell or a five-tab layout before finalizing the design.
