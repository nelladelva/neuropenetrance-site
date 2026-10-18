import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { read, textOf, mainOf, ROOT, REDIRECTS } from './site.test.mjs';
import { PLANNED_PAGES } from './build.mjs';

const ALL = PLANNED_PAGES.flatMap((s) => [`${s}.html`, `de/${s}.html`]);

test('all planned pages are built', () => {
  for (const p of ALL) assert.ok(existsSync(join(ROOT, p)), p);
});

test('old URLs redirect', () => {
  for (const [from, to] of Object.entries(REDIRECTS)) {
    const h = read(`${from}.html`);
    assert.match(h, new RegExp(`http-equiv="refresh" content="0; url=${to.replace('.', '\\.')}"`), from);
    assert.match(h, new RegExp(`<a href="${to.replace('.', '\\.')}"`), `${from} visible link`);
    assert.match(h, /<link rel="canonical"/, from);
  }
});

test('no forbidden phrases on any page', () => {
  const banned = [/stemazing\.advancement@gmail\.com/, /0[.,]772/, /\bvalidated\b(?! protocols)/i, /\bvalidiert/i,
    /predicts? who will develop/i, /DNA sequencing/i, /DNA-Sequenzierung/i];
  for (const p of [...ALL, ...Object.keys(REDIRECTS).map((r) => `${r}.html`), 'script.js']) {
    const text = p.endsWith('.js') ? read(p) : textOf(read(p));
    for (const b of banned) assert.ok(!b.test(text), `${p}: ${b}`);
  }
});

test('impressum has placeholders and a visible note', () => {
  const h = read('de/impressum.html');
  const t = textOf(mainOf(h));
  for (const s of ['Angaben gemäß § 5 DDG', '[Full legal name]', 'partnerships@neuropenetrance.com']) assert.ok(t.includes(s), s);
  assert.match(h, /class="todo-note"/);
  assert.ok(textOf(mainOf(read('impressum.html'))).includes('[Full legal name]'));
});

test('datenschutz names the processors', () => {
  const t = textOf(mainOf(read('de/datenschutz.html')));
  for (const s of ['GitHub', 'Formspree', 'Streamlit', 'keine Cookies']) assert.ok(t.includes(s), s);
  const e = textOf(mainOf(read('datenschutz.html')));
  for (const s of ['GitHub', 'Formspree', 'Streamlit', 'no cookies']) assert.ok(e.includes(s), `en ${s}`);
});

test('sitemap lists every page in both languages', () => {
  const xml = read('sitemap.xml');
  for (const s of PLANNED_PAGES) {
    assert.ok(xml.includes(`https://neuropenetrance.com/${s === 'index' ? '' : `${s}.html`}</loc>`), s);
    assert.ok(xml.includes(`https://neuropenetrance.com/de/${s === 'index' ? '' : `${s}.html`}`), `de ${s}`);
  }
  assert.match(read('robots.txt'), /Sitemap: https:\/\/neuropenetrance\.com\/sitemap\.xml/);
  assert.ok(existsSync(join(ROOT, 'assets/img/og-image.png')));
  assert.ok(!existsSync(join(ROOT, 'style.css')), 'old stylesheet removed');
});
