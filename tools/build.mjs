// Builds the static site: src/pages/{en,de}/<slug>.html → ./<slug>.html and ./de/<slug>.html
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderPage } from './layout.mjs';

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
  return { written };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { written } = build();
  console.log(`built ${written.length} pages`);
}
