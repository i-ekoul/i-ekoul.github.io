This repo contains the code for my GitHub Pages portfolio site.

Live site: `https://i-ekoul.github.io/`

### URLs / routing
Pages use **directory-style routes** so URLs don’t include `.html` (example: `/skills/` is served by `skills/index.html`).

**Homepage**
- Primary URL: `/home/` (served by `home/index.html`)
- Root `/` redirects to `/home/` via `index.html` (GitHub Pages requires `index.html` at the root)

**Legacy compatibility**
Previously, the old `*.html` pages at the repo root (for example `skills.html`) were kept as **redirect stubs** to preserve older bookmarks/links. Those stubs have been removed to keep the repo clean.

### Are the root `*.html` files still needed?
- **Required**:
  - `index.html`: GitHub Pages serves the site root from a root `index.html` (this repo uses it as a redirect to `/home/`).
- **Not required**:
  - Root `*.html` stubs (like `skills.html`) are not required for the site to function, but removing them means old `/*.html` bookmarks will **404** instead of redirecting.

### Local preview
From the repo root, start a tiny static server:

- Python:
  - `python -m http.server 8000`
  - then open `http://localhost:8000/`
- Node:
  - `npx --yes serve . -l 8000`

### Repo structure (high level)
- **Routes**: `home/`, `projects/`, `skills/`, `experience/`, `education/`, `bio/`, `contact/`, `cs499/`
- **Assets**: `assets/images/...` and `assets/js/...`
- **Site metadata**: `robots.txt`, `sitemap.xml`, `site.webmanifest`
- **Icons**: `assets/icons/`
- **Docs**: `assets/docs/` (ex: resume PDF)
- **Fallback favicon**: `favicon.ico` remains at the repo root (some browsers request `/favicon.ico` by default)
- **Styles**: `styles.css`

### Docs
- Changelog: `docs/CHANGELOG.md`
