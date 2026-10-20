import { APP_URL, EMAIL, SITE, UI } from './i18n.mjs';

const NAV = ['platform', 'evidence', 'partners', 'research', 'science', 'team'];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
export const pageUrl = (lang, slug) => `${SITE}/${lang === 'de' ? 'de/' : ''}${slug === 'index' ? '' : `${slug}.html`}`;

export const LOGO = `<svg class="brand-icon" viewBox="0 0 44 34" fill="none" aria-hidden="true">
  <path d="M7 17 H17" stroke="#0D2438" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M16 17 C21 17, 23 10, 29 8" stroke="#0B6E79" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M16 17 C21 17, 23 24, 29 26" stroke="#8FA6BA" stroke-width="3.4" stroke-linecap="round"/>
  <circle cx="6" cy="17" r="5" fill="#0D2438"/><circle cx="32.5" cy="7" r="5" fill="#0B6E79"/>
  <circle cx="33" cy="26.5" r="3.6" stroke="#8FA6BA" stroke-width="2.8"/></svg>`;

/** Wraps a page body fragment in the shared head, header and footer. */
export function renderPage({ lang, slug, title, description, body }) {
  const t = UI[lang];
  const up = lang === 'de' ? '../' : '';
  const other = lang === 'de' ? 'en' : 'de';
  const toOther = lang === 'de' ? `../${slug}.html` : `de/${slug}.html`;
  const link = (s) => `${s}.html`;
  const nav = NAV.map((s) => `<a href="${link(s)}"${s === slug ? ' aria-current="page"' : ''}>${t.nav[s]}</a>`).join('\n        ');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${pageUrl(lang, slug)}">
<link rel="alternate" hreflang="en" href="${pageUrl('en', slug)}">
<link rel="alternate" hreflang="de" href="${pageUrl('de', slug)}">
<link rel="alternate" hreflang="x-default" href="${pageUrl('en', slug)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${pageUrl(lang, slug)}">
<meta property="og:image" content="${SITE}/assets/img/og-image.png">
<meta property="og:locale" content="${lang === 'de' ? 'de_DE' : 'en_GB'}">
<meta name="theme-color" content="#0D2438">
<link rel="icon" href="${up}assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${up}assets/css/site.css">
</head>
<body>
<a class="skip-link" href="#main">${t.skip}</a>
<header class="site-header">
  <div class="container header-inner">
    <a href="${link('index')}" class="brand" aria-label="${t.home}">${LOGO}<span class="brand-name">Neuro<span>Penetrance</span></span></a>
    <nav class="primary-nav" id="primaryNav" aria-label="Main">
        ${nav}
      <div class="lang-switch" aria-label="Language">
        <a href="${lang === 'en' ? link(slug) : toOther}" hreflang="en"${lang === 'en' ? ' aria-current="true"' : ''}>EN</a>
        <span aria-hidden="true">·</span>
        <a href="${lang === 'de' ? link(slug) : toOther}" hreflang="de"${lang === 'de' ? ' aria-current="true"' : ''}>DE</a>
      </div>
      <a class="btn btn-outline btn-sm" href="${APP_URL}" target="_blank" rel="noopener">${t.openApp}</a>
      <a class="btn btn-primary btn-sm" href="${link('partners')}">${t.partner}</a>
    </nav>
    <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="primaryNav" aria-label="${t.menu}">☰</button>
  </div>
</header>
<main id="main">
${body.trim()}
</main>
<footer class="site-footer">
  <div class="container footer-inner">
    <div>
      <a href="${link('index')}" class="brand brand-footer" aria-label="${t.home}">${LOGO}<span class="brand-name">Neuro<span>Penetrance</span></span></a>
      <p>${t.footerTag}</p>
      <p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
    </div>
    <nav aria-label="Footer">
      ${NAV.map((s) => `<a href="${link(s)}">${t.nav[s]}</a>`).join('\n      ')}
      <a href="${link('contact')}">${t.contact}</a>
    </nav>
    <nav aria-label="Legal">
      <a href="${link('impressum')}">${t.legal}</a>
      <a href="${link('datenschutz')}">${t.privacy}</a>
      <a href="${toOther}" hreflang="${other}">${t.langName}</a>
    </nav>
  </div>
  <div class="container footer-base">© ${new Date().getFullYear()} NeuroPenetrance · Research Use Only</div>
</footer>
<script src="${up}script.js"></script>
</body>
</html>
`;
}
