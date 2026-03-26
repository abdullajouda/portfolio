# Portfolio

Static multi-page portfolio site ready for GitHub Pages deployment.

## Pages

- `index.html` (Home)
- `projects.html`
- `experience.html`
- `contact.html`

## Configure `js/site-config.js`

Edit [js/site-config.js](js/site-config.js) and set your real values. Leave any string as `""` to hide that link in the UI.

| Key | Purpose |
|-----|---------|
| `email` | Used for the contact form (`mailto:`) and the email row on the contact page |
| `github` | Footer and contact social icon |
| `linkedin` | Footer and contact social icon |
| `twitter` | Footer and contact social icon (X or Twitter URL) |
| `resume` | Path in the repo (e.g. `resume.pdf`) or a full URL — enables **Resume** in the nav, mobile menu, and **Download PDF** on the experience page |
| `projects.coinplusCaseStudy` | “View Case Study” on CoinPlus |
| `projects.mashaaPlayStore` | Mashaa Play Store row |
| `projects.mashaaAppStore` | Mashaa App Store row |
| `projects.basitCaseStudy` | Basit card footer link |
| `projects.ocsCaseStudy` | OCS Kuwait preview link |
| `projects.finestAppStore` | Finest App Store link |

Project links use **only** the URLs you set here—empty keys hide that control (no `mailto:` fallback). `coinplusCaseStudy` is optional until you have a public case study or demo URL.

Optional: add `resume.pdf` to the repository root and set `resume: "resume.pdf"`.

Shared behavior lives in [js/site.js](js/site.js) (mobile menu, filters, contact form).

## Deploy on GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, open **Settings > Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` branch (or run the workflow manually).

The workflow in `.github/workflows/deploy-pages.yml` will publish the site automatically.