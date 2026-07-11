# SMAPS Design System

The visual language behind the SMAPS landing page. SMAPS (School Management AI Powered System) is a single platform that unifies enrollment, academics, grading, finance, and family communication. The brand reads calm, editorial, and institution-grade — the quiet system behind a well-run school.

## Brand

| Element | Value |
| --- | --- |
| Primary (navy) | `#0F2447` — hero and trust bands, footer mark, headline ink on light |
| Action (blue) | `#1D5FBF` — CTAs, links, eyebrows, accents |
| Action hover | `#164A96` |
| Tint | `#E8F0FC` — media placeholders, success check |
| Background | `#FDFDFC` off-white — the canvas every section sits on |
| Ink | `#141D2E` — primary text |
| Heading type | Source Serif 4 (600 for display, 400/700 available) |
| Body type | Public Sans (400 / 500 / 600 / 700) |

**Feel:** editorial and flat. No drop shadows except the single form card. Corners are a near-square `3px` radius. Generous vertical rhythm (sections open at 100–120px top padding). Eyebrows are 12px, 700 weight, uppercase, wide 2.5px tracking. Display headings use tight negative letter-spacing and `text-wrap: balance`.

## How to consume

1. Link the tokens once, before your own styles:
   ```html
   <link rel="stylesheet" href="design-system/tokens.css">
   ```
2. Pull every color, font, spacing, and radius value from the CSS custom properties — never hard-code a hex:
   ```css
   .cta { background: var(--action); color: #fff; border-radius: var(--radius); }
   h2   { font-family: var(--font-heading); color: var(--ink); }
   ```
3. Load the two brand faces from Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```
4. Layout container: max-width `var(--maxw)` (1240px), horizontal padding `var(--pad)` (40px, tightening to 28/20px on smaller viewports).

`tokens.css` mirrors the `:root` block in `smaps-landing/css/styles.css`. That stylesheet is the source of truth; regenerate `tokens.css` from it if tokens change.

## Section previews

Each file is standalone (open it directly in a browser). The only external reference is the Google Fonts link. Every preview renders one section on the `#FDFDFC` background.

| File | Card group | Renders |
| --- | --- | --- |
| `sections/hero.html` | Sections | Navy hero: blueprint-grid CSS treatment, nav bar, headline "The quiet system behind a well-run school", two CTAs |
| `sections/modules.html` | Sections | "One platform, every office" — the three module cards with tinted media placeholders |
| `sections/success-story.html` | Sections | Saint Michael success-story band: pull quote plus four before/after stats |
| `sections/demo-form.html` | Sections | Demo CTA copy and the lead form card; interactive validation + success state ported from `js/form.js` |
| `sections/foundations.html` | Foundations | Color swatches for every token with hex labels, and the type scale (Source Serif 4 headings vs Public Sans body at real sizes) |
| `pages/landing.html` | Pages | The full landing page, self-contained (styles and script inlined, placeholders kept) |
