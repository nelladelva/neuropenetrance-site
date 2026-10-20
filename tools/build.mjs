// Builds the static site: src/pages/{en,de}/<slug>.html → ./<slug>.html and ./de/<slug>.html
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderPage } from './layout.mjs';
import { SITE } from './i18n.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const PLANNED_PAGES = ['index', 'platform', 'evidence', 'partners', 'research', 'science', 'team', 'contact', 'impressum', 'datenschutz'];
export const REDIRECTS = { problem: 'science.html', idea: 'science.html', impact: 'science.html', involved: 'partners.html', 'neuropenetrance-de': 'de/index.html' };
const FONTS = [
  ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter-latin.woff2'],
  ['@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2', 'inter-latin-ext.woff2'],
  ['@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2', 'plex-mono-latin-500.woff2'],
  ['@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-500-normal.woff2', 'plex-mono-latin-ext-500.woff2'],
];

/** First line of a fragment: <!-- title: … | description: … --> */
export function parseFragment(src) {
  const m = src.match(/^\s*<!--\s*title:\s*(.*?)\s*\|\s*description:\s*(.*?)\s*-->/);
  if (!m) throw new Error('fragment needs a <!-- title: … | description: … --> header');
  return { title: m[1], description: m[2], body: src.slice(m[0].length) };
}

export function build() {
  const written = [];
  mkdirSync(join(ROOT, 'de'), { recursive: true });
  mkdirSync(join(ROOT, 'assets/fonts'), { recursive: true });
  for (const [from, to] of FONTS) {
    const src = join(ROOT, 'node_modules', from);
    if (existsSync(src)) copyFileSync(src, join(ROOT, 'assets/fonts', to));
  }
  for (const slug of PLANNED_PAGES) {
    const en = join(ROOT, 'src/pages/en', `${slug}.html`);
    const de = join(ROOT, 'src/pages/de', `${slug}.html`);
    if (!existsSync(en) && !existsSync(de)) continue;
    if (!existsSync(en) || !existsSync(de)) throw new Error(`${slug}: fragment missing in ${existsSync(en) ? 'de' : 'en'}`);
    for (const [lang, file, out] of [['en', en, `${slug}.html`], ['de', de, `de/${slug}.html`]]) {
      writeFileSync(join(ROOT, out), renderPage({ lang, slug, ...parseFragment(readFileSync(file, 'utf8')) }));
      written.push(out);
    }
  }
  for (const [from, to] of Object.entries(REDIRECTS)) {
    writeFileSync(join(ROOT, `${from}.html`), redirectPage(to));
    written.push(`${from}.html`);
  }
  writeFileSync(join(ROOT, 'sitemap.xml'), sitemap(PLANNED_PAGES.filter((s) => existsSync(join(ROOT, 'src/pages/en', `${s}.html`)))));
  writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
  return { written };
}

/** Old URL → new page: instant redirect plus a visible link. */
export function redirectPage(to) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NeuroPenetrance</title>
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${to}">
<link rel="canonical" href="${SITE}/${to.replace('index.html', '')}">
</head>
<body>
<p>This page has moved: <a href="${to}">continue to NeuroPenetrance</a>.</p>
</body>
</html>
`;
}

export function sitemap(slugs) {
  const url = (lang, s) => `${SITE}/${lang === 'de' ? 'de/' : ''}${s === 'index' ? '' : `${s}.html`}`;
  const entries = slugs.flatMap((s) => ['en', 'de'].map((lang) => `  <url>
    <loc>${url(lang, s)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${url('en', s)}"/>
    <xhtml:link rel="alternate" hreflang="de" href="${url('de', s)}"/>
  </url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { written } = build();
  console.log(`built ${written.length} pages`);
}
