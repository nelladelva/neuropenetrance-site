// Tests added for the whole-branch review findings.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { read, textOf, mainOf, REDIRECTS } from './site.test.mjs';
import { PLANNED_PAGES } from './build.mjs';

const ALL = PLANNED_PAGES.flatMap((s) => [`${s}.html`, `de/${s}.html`]);
const css = () => read('assets/css/site.css');
const cssVar = (name) => css().match(new RegExp(`${name}:\\s*(#[0-9A-Fa-f]{6})`))[1];
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

test('long German words in headings wrap instead of overflowing', () => {
  assert.match(css(), /h1, h2, h3[^{]*\{[^}]*overflow-wrap:\s*break-word[^}]*hyphens:\s*auto/);
});

test('muted text and input borders meet WCAG AA contrast', () => {
  assert.ok(contrast(cssVar('--muted'), '#FFFFFF') >= 4.5, 'muted on white');
  assert.ok(contrast(cssVar('--muted'), cssVar('--panel')) >= 4.5, 'muted on panel');
  assert.ok(contrast(cssVar('--input-border'), '#FFFFFF') >= 3, 'input border');
  assert.match(css(), /border: 1px solid var\(--input-border\)/);
});

test('privacy policy describes server-side app processing and all mail recipients', () => {
  for (const p of ['datenschutz.html', 'de/datenschutz.html']) {
    const t = textOf(mainOf(read(p)));
    assert.ok(!/only within the running browser session|nur innerhalb der laufenden Browsersitzung/.test(t), `${p}: no browser-only claim`);
    for (const s of ['IONOS', 'Google', 'reCAPTCHA', 'Snowflake']) assert.ok(t.includes(s), `${p}: ${s}`);
  }
  for (const p of ['platform.html', 'de/platform.html']) {
    assert.ok(!/stays in the browser session|bleiben in der Browsersitzung/.test(textOf(mainOf(read(p)))), p);
  }
});

test('no unbacked Frankfurt hosting claim', () => {
  for (const p of ALL) assert.ok(!/Frankfurt/.test(textOf(read(p))), p);
});

test('claims say tested on 7 unseen studies, and AUC is not called accuracy', () => {
  for (const p of ALL) {
    const t = textOf(read(p));
    assert.ok(!/tested on 8 independent studies|in 8 unabhängigen Studien getestet/i.test(t), `${p}: 8 independent`);
    assert.ok(!/accuracy \(AUC\)/i.test(t), `${p}: accuracy (AUC)`);
  }
});

test('banned phrases are absent from raw HTML too, including predict-who-develops variants', () => {
  const banned = [/stemazing/i, /0[.,]772/, /\bvalidated\b(?! protocols)/i, /\bvalidiert/i,
    /predicts? who (will )?develops?/i, /vorher(sagen|gesagt|sagt).{0,20}wer (erkrankt|krank wird)/i, /DNA sequencing/i];
  for (const p of [...ALL, ...Object.keys(REDIRECTS).map((r) => `${r}.html`), 'script.js']) {
    const raw = read(p);
    for (const b of banned) assert.ok(!b.test(raw), `${p}: ${b}`);
  }
});
