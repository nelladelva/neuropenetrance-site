// Checks on the generated site. Run via `npm test` (which builds first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { textOf, mainOf } from './textof.mjs';
import { PLANNED_PAGES, REDIRECTS } from './build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const built = (slug) => existsSync(join(ROOT, `${slug}.html`)) && existsSync(join(ROOT, 'src/pages/en', `${slug}.html`));
export const pages = () => PLANNED_PAGES.filter(built).flatMap((s) => [`${s}.html`, `de/${s}.html`]);
const enPages = () => PLANNED_PAGES.filter(built);

test('every page has its German twin', () => {
  for (const s of readdirSync(join(ROOT, 'src/pages/en')).map((f) => f.replace('.html', ''))) {
    assert.ok(existsSync(join(ROOT, `${s}.html`)), `${s}.html built`);
    assert.ok(existsSync(join(ROOT, `de/${s}.html`)), `de/${s}.html built`);
  }
  for (const s of readdirSync(join(ROOT, 'src/pages/de')).map((f) => f.replace('.html', ''))) {
    assert.ok(existsSync(join(ROOT, 'src/pages/en', `${s}.html`)), `${s} has an English fragment`);
  }
});

test('html lang and hreflang are set', () => {
  for (const p of pages()) {
    const h = read(p);
    assert.match(h, p.startsWith('de/') ? /<html lang="de"/ : /<html lang="en"/, p);
    for (const l of ['en', 'de', 'x-default']) assert.ok(h.includes(`hreflang="${l}"`), `${p} hreflang ${l}`);
  }
});

test('language switch points to the same page', () => {
  for (const s of enPages()) {
    assert.match(read(`${s}.html`), new RegExp(`class="lang-switch"[^>]*>[\\s\\S]*?href="de/${s}\\.html"`), `${s} → de`);
    assert.match(read(`de/${s}.html`), new RegExp(`class="lang-switch"[^>]*>[\\s\\S]*?href="\\.\\./${s}\\.html"`), `de/${s} → en`);
  }
});

test('header has nav, app link and partner button', () => {
  for (const p of pages()) {
    const header = read(p).match(/<header[\s\S]*?<\/header>/)?.[0] ?? '';
    for (const t of ['platform', 'evidence', 'partners', 'research', 'science', 'team']) {
      assert.match(header, new RegExp(`href="(\\.\\./)?${t}\\.html"|href="${t}\\.html"`), `${p} nav → ${t}`);
    }
    assert.match(header, /<a [^>]*href="https:\/\/neuropenetrance\.streamlit\.app"[^>]*target="_blank"[^>]*rel="[^"]*noopener/, `${p} app link`);
    assert.match(header, /class="btn btn-primary[^"]*"[^>]*href="[^"]*partners\.html"|href="[^"]*partners\.html"[^>]*class="btn btn-primary/, `${p} partner button`);
  }
});

test('no Google Fonts requests', () => {
  for (const p of [...pages(), 'assets/css/site.css']) {
    const h = read(p);
    assert.ok(!h.includes('fonts.googleapis.com') && !h.includes('fonts.gstatic.com'), p);
  }
  assert.match(read('assets/css/site.css'), /@font-face/);
});

test('every page has viewport meta and menu button', () => {
  for (const p of pages()) {
    const h = read(p);
    assert.match(h, /<meta name="viewport"/, p);
    assert.match(h, /id="menuBtn"/, p);
  }
});

test('internal links resolve', () => {
  const planned = new Set(PLANNED_PAGES.flatMap((s) => [`${s}.html`, `de/${s}.html`]));
  for (const p of pages()) {
    const base = dirname(p);
    for (const [, url] of read(p).matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
      if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
      const target = normalize(join(base, url));
      if (planned.has(target) && !existsSync(join(ROOT, target))) continue; // page planned in a later task
      assert.ok(existsSync(join(ROOT, target)), `${p} → ${url}`);
    }
  }
});

export { textOf, mainOf, ROOT, REDIRECTS };
