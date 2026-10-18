# neuropenetrance.com

Static website (English + German) served by GitHub Pages from this repository (custom domain in `CNAME`).

## Edit a page
1. Edit the page body in `src/pages/en/<page>.html` and its German twin in `src/pages/de/<page>.html`.
   The first line of each file holds the browser title and description: `<!-- title: … | description: … -->`.
2. Header, footer and navigation wording live in `tools/i18n.mjs`; the shared layout is `tools/layout.mjs`; styles in `assets/css/site.css`.
3. Needs Node 22+. Run `npm install` once, then `npm run build` to regenerate the HTML (`./<page>.html` and `./de/<page>.html`), and `npm test` to check the site
   (German twins, language switch, links, forms, banned phrases such as old claims).
4. Commit the source **and** the generated HTML, then push; GitHub Pages publishes it.

Pages: index, platform, evidence, partners, research, science, team, contact, impressum, datenschutz.
Old URLs (`problem`, `idea`, `impact`, `involved`, `neuropenetrance-de`) are generated redirects.
App screenshots: `node tools/screenshots.mjs` (needs Chrome and the `neuropenetrance_app` repo next to this one).

## To do before promoting the site (Nella)
- [ ] Have the Datenschutzerklärung (privacy policy) reviewed.
- [ ] In Formspree (form settings), switch off reCAPTCHA (the honeypot already filters bots); if you keep it, the privacy policy already mentions it.
- [ ] Set up the email forwarding `partnerships@neuropenetrance.com` → Gmail in IONOS (Email → create forwarding).
