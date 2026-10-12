# Portfolio — Abdulla Jouda

Static, dependency-free portfolio site. Four pages, one stylesheet, three small scripts.
No build step, no framework, no CDN runtime — deploys to GitHub Pages as-is.

## Structure

```
index.html          Home — positioning, capabilities, selected work
projects.html       Work — filterable project list
experience.html     Experience — roles, skills matrix, education, certs
contact.html        Contact — direct details and a mailto form
404.html            Not-found page
css/styles.css      Design tokens, components, phone frames, mock app UI
js/site-config.js   Your links, details and app screenshots (the file you routinely edit)
js/screens.js       CSS-drawn app screens shown in the phone frames
js/site.js          Theme, nav, phone frames, showcase, motion, filters, form
assets/icon.svg     Monogram used by the web manifest
```

## Design

Light-first. Warm paper `#f7f5f0`, near-black ink `#17150f`, and Flutter blue as
the accent: `--accent` `#0175C2` for large marks and fills, `--accent-text`
`#02569B` for body-size text so every pair clears WCAG AA, and `#13B9FD` in dark mode. Headings in Bricolage Grotesque,
italic accents in Instrument Serif, body in Inter, labels in JetBrains Mono.

The site always opens in light. A dark theme is one click away in the header and
the choice persists in `localStorage`.

### Motion

- Hero headline rises in word by word; phones float and follow the pointer.
- Home "Selected apps" is a sticky showcase: the phones swap as you scroll each app.
- Sections reveal on scroll with a stagger; stats count up; the experience
  timeline fills as you read; screens' charts and rings animate when they appear.
- Page-to-page cross-fades via the View Transitions API where supported.
- Everything is disabled under `prefers-reduced-motion`.

### Phone screenshots

Every phone frame shows a CSS-drawn mock of the app (`js/screens.js`) until you
give it a real image. To use your own screenshots:

1. Drop portrait shots (about 9:19.5, e.g. 1179×2556) in `assets/screens/`.
2. Point the matching key at them in `js/site-config.js`:

   ```js
   screenshots: {
     "hisab/dashboard": "assets/screens/hisab-dashboard.webp",
     ...
   }
   ```

Keys are `app/screen`. Each key is used everywhere that screen appears (hero,
showcase, work page). `coinplus/web` is a 16:10 desktop screenshot in a browser frame.

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
| `screenshots.*` | Real app screenshots for the phone frames — see *Phone screenshots* above |

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

- Home showcase steps live in `index.html` (`<article class="step" data-front="…" data-back="…">`).
  Add a step and it gets its own phones, colour and dot automatically.
- Project cards live in `projects.html`. Each `<article class="project">` carries a
  `data-tags` attribute (`fintech`, `mobile`, `personal`) that drives the filters —
  add a tag to the article and a matching `<button data-filter="...">` to expose it.
- Spacing, colour and type all flow from the custom properties at the top of
  `css/styles.css`. Change a token there rather than patching individual rules.
- The SVG icon sprite is inlined per page (`<symbol id="i-*">`) so the site works
  from `file://` as well as over HTTP.
