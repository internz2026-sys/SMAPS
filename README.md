# SMAPS — Landing Page

Marketing landing page for **SMAPS** (School Management AI Powered System), a
unified school management platform for K–12 schools: enrollment, academics,
grading, finance, and family communication in one system.

This is a **static site** (no build step) deployed to Vercel.

## Structure

```
index.html         # the page
css/styles.css     # all styles + design tokens (:root custom properties)
js/form.js         # demo-request form (client-side validation; no backend yet)
assets/img/        # on-brand SVG product mockups
vercel.json        # static hosting config (clean URLs + asset caching)
design-system/     # design tokens + section references (not part of the deploy)
```

## Run locally

It's plain HTML/CSS/JS — open `index.html`, or serve the folder:

```bash
npx http-server . -p 4321
# → http://localhost:4321
```

## Deploy (Vercel)

Zero-config static deploy. Import the repo in Vercel; no build command or
framework needed — it serves `index.html` at the root. `vercel.json` sets
clean URLs and long-lived caching for `/assets`.

## Notes

- The demo-request form validates on the client and shows a success state.
  It does **not** submit anywhere yet (`js/form.js` marks the `TODO` where a
  lead-capture backend would go).
- Design language: navy `#0F2447`, action blue `#1D5FBF`, Source Serif 4
  (headings) + Public Sans (body). Tokens live in `css/styles.css`.
