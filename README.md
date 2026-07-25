# Portfolio — Abdulla Jouda

Static, dependency-free portfolio site. Four pages, one stylesheet, one script.
No build step, no framework, no CDN runtime — deploys to GitHub Pages as-is.

## Structure

```
index.html          Home — positioning, capabilities, selected work
projects.html       Work — filterable project list
experience.html     Experience — roles, skills matrix, education, certs
contact.html        Contact — direct details and a mailto form
404.html            Not-found page
css/styles.css      Design tokens + all component styles
js/site-config.js   Your links and details (the only file you routinely edit)
js/site.js          Theme toggle, mobile nav, filters, form, reveal
assets/icon.svg     Monogram used by the web manifest
```

## Design

Palette and type are derived from the printed resume so the PDF and the site read
as one identity: warm paper `#fbfaf7`, cream `#ebddc5`, terracotta `#c67139`,
olive accents, near-black `#1a1917`. Headings in Bitter, body in Plus Jakarta Sans,
code in JetBrains Mono.

Accent colours come in two variants — `--terracotta` for large text, borders and
icons, and `--terracotta-text` (darkened) for anything at body size, so every
text/background pair clears WCAG AA.

A dark theme ships alongside it. First visit follows `prefers-color-scheme`;
after that the toggle wins and the choice persists in `localStorage`.

## Configure `js/site-config.js`

Every value is optional. Leave a string `""` and the element that depends on it
hides itself — no dead links, no `mailto:` fallbacks.

| Key | Purpose |
|-----|---------|
| `email` | Contact form target and every "Email" link |
| `phone` | Phone row on the contact page. **Empty by default** — a number on a public page gets scraped for spam. Set it to `"+970595921528"` to show it. |
| `github` | Footer and contact page |
| `linkedin` | Footer and contact page |
| `twitter` | Footer and contact page (X or Twitter URL) |
| `resume` | Repo path (e.g. `resume.pdf`) or full URL — reveals **Resume** in the nav and mobile menu, and **Download resume** on the experience page |
| `projects.coinplusCaseStudy` | Case study link on the CoinPlus card |
| `projects.mashaaPlayStore` | Mashaa · Play Store |
| `projects.mashaaAppStore` | Mashaa · App Store |
| `projects.basitCaseStudy` | Basit |
| `projects.ocsCaseStudy` | OCS Kuwait |
| `projects.finestAppStore` | Finest |

To enable the resume button, drop `resume.pdf` in the repo root and set
`resume: "resume.pdf"`.

## Local preview

Open `index.html` directly, or serve it to get clean URLs:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy

1. Push to `main`.
2. GitHub → **Settings → Pages** → set **Source** to **GitHub Actions**.

`.github/workflows/deploy-pages.yml` publishes on every push to `main`.

## Editing notes

- Project cards live in `projects.html`. Each `<article class="project">` carries a
  `data-tags` attribute (`fintech`, `mobile`, `personal`) that drives the filters —
  add a tag to the article and a matching `<button data-filter="...">` to expose it.
- Spacing, colour and type all flow from the custom properties at the top of
  `css/styles.css`. Change a token there rather than patching individual rules.
- The SVG icon sprite is inlined per page (`<symbol id="i-*">`) so the site works
  from `file://` as well as over HTTP.
