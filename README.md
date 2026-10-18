# escole.dev

Source for [escole.dev](https://escole.dev), the portfolio of Emmalie Cole, Senior Software Engineer & Engineering Lead.

- `index.html` is the portfolio. It is pre-rendered, then `assets/js/runtime.js` re-renders it in the browser with [morphdom](https://github.com/patrick-steele-idem/morphdom) so the chessboard, the Opera Game replay and the mobile carousel are interactive.
- `assets/js/portfolio.js` holds the page logic; the board uses [chess.js](https://github.com/jhlywa/chess.js) (BSD-2-Clause) and a low-poly piece set in `assets/pieces/`.
- `resume/` and `earlier-work/` are static pages; `assets/docs/resume.pdf` is the one-page resume.
- Old URLs (`/home/`, `/projects/`, `/cs499/` and the rest) redirect to their new homes.

Hosted on GitHub Pages with the custom domain set in `CNAME`.
