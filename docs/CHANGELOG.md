# Changelog

All notable changes to this site will be documented in this file.

## 2025-12-18

### Added
- **Directory-style routes** (clean URLs) for core pages:
  - `/projects/`, `/skills/`, `/experience/`, `/education/`, `/bio/`, `/contact/`, `/cs499/`
- **Homepage route** at `/home/` (served by `home/index.html`), with root `/` redirecting to `/home/`.
- **Legacy redirects**: root `*.html` pages (ex: `skills.html`) now redirect to the directory routes to preserve bookmarks.
- **Asset organization** under `assets/`:
  - `assets/images/site/` (banner/profile)
  - `assets/images/certificates/`
  - `assets/images/evidence/`
  - `assets/js/nav-focus.js` (shared navigation “focus/scroll” behavior)
- **Site metadata files**:
  - `robots.txt` and `sitemap.xml`
- **UX**:
  - Navigation focus/auto-scroll behavior on most pages (excluding Home’s “banner-first” experience)
  - Leave-site confirmation modal for external “Badges” links on Experience page
- **Security hardening**:
  - `rel="noopener noreferrer"` for `target="_blank"` links
  - Contact form honeypot to reduce basic spam

### Changed
- Updated navigation links across pages to use the new directory routes.
- Updated button hover behavior for `.button-primary` to match nav buttons, with a Projects-card-specific hover override.
- Improved mobile responsiveness (image scaling, header sizing).
- Updated various page-specific theme/styling tweaks (headers, accent colors, bullet marker colors).
- CS499: improved CS340 “Before vs After vs Evidence” layout (2-column text + buttons), stabilized accordion height behavior so narratives don’t get clipped when evidence galleries expand, and refined label colors (Before teal, After black, Evidence orange).
- Projects: reordered top showcase cards (FlavorTrail first, CS499 second), removed the redundant “This Website’s Repo” project card, and restyled project bullets into a timeline (line + orange dots).
- Education: trimmed the timeline line so it doesn’t extend above the first dot or below the last dot.
- Contact: redesigned into a cleaner two-panel layout, upgraded input focus styling, and replaced alert popups with inline submit status messaging.
- Removed legacy root `*.html` redirect stubs (kept root `index.html`; `/*.html` bookmarks now 404).
- Moved root icon PNGs into `assets/icons/` and updated all page favicon links + `site.webmanifest`.
- Moved `resume.pdf` into `assets/docs/resume.pdf` and updated Home page links.
- Home: added a “My GitHub Profile” button under the Connect section (uses the shared external-link confirmation modal).
- CS499: standardized “Before vs After vs Evidence” layout across CS320/CS330/CS340; updated button labels (“Original/Enhanced Repo”, “Diff Comparison”), removed redundant Links sections (CS320/CS330), and updated CS320/CS330 evidence galleries (CS330 GIF removed).
- Global: added a shared floating “Back to top” button across all pages (`assets/js/back-to-top.js`) that returns users to the nav-focused top position.


