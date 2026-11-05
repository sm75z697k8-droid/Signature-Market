# Signature Market — Navigation Only

A clean restart of the experimental UI. **This repository currently contains only a five-button frosted-glass navigation bar** on a quiet background. It is a standalone visual prototype, not the official Signature Market app.

## Five destinations

Home · Products · Notifications · My Cart · Profile

The five buttons use simple inline SVG outlines with **1.45px rounded strokes**. There are no visible labels, but each icon has an accessible name.

Tapping an icon changes its selected state, smoothly slides a subtle frosted highlight, and updates the URL hash. Browser Back/Forward restores the selected icon. **There are no content screens yet**; the buttons only demonstrate navigation states.

## Visual choices

- Narrow, fully rounded, frosted-glass capsule using native CSS `backdrop-filter`.
- Equal left/right spacing: **28px** on typical iPhones (responsive on narrow devices).
- **58px** bar height, with 44px interactive tap targets.
- One subtle active indicator instead of a complicated liquid-glass simulation.
- Respect for reduced-motion and reduced-transparency accessibility settings.
- No packages, network requests, framework, third-party scripts, build step, or copied glass library.

## Files

- `index.html` — just the five navigation icons and semantic links.
- `styles.css` — background, frosted-glass styling, responsive positioning.
- `app.js` — active tab state synchronized to the URL hash.
- `README.md` — this document.

The old storefront, mock cart, custom animations, and experimental vendor scripts were removed from the **current branch**. Their commits remain in Git history if you ever need them.

## iPhone preview

Enable **Settings → Pages → Deploy from a branch → main → /(root)** if you have not already. Visit:

https://sm75z697k8-droid.github.io/Signature-Market/

Refresh Safari after a new deployment to clear any cached version.
