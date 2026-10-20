import { test } from 'node:test';
import assert from 'node:assert/strict';
import { read, textOf, mainOf } from './site.test.mjs';

const OPTIONS = {
  partners: ['analyse-samples', 'stratify-trial', 'treatment-response', 'other'],
  research: ['joint-study', 'share-cohort', 'student-project', 'use-app', 'other'],
};

for (const [slug, values] of Object.entries(OPTIONS)) {
  for (const page of [`${slug}.html`, `de/${slug}.html`]) {
    test(`forms post to formspree with required fields and honeypot (${page})`, () => {
      const form = read(page).match(/<form[\s\S]*?<\/form>/)?.[0] ?? '';
      assert.match(form, /action="https:\/\/formspree\.io\/f\/xeaqbkzb"/);
      assert.match(form, /method="POST"/i);
      assert.match(form, /<input[^>]*name="name"[^>]*required/);
      assert.match(form, /<input[^>]*type="email"[^>]*name="email"[^>]*required|<input[^>]*name="email"[^>]*type="email"[^>]*required/);
      assert.match(form, /<textarea[^>]*name="message"/);
      assert.match(form, new RegExp(`<input type="hidden" name="type" value="${slug === 'partners' ? 'partnership' : 'research'}"`));
      assert.match(form, /<input type="hidden" name="_subject" value="[^"]+"/);
      assert.match(form, /name="_gotcha"/);
      assert.match(form, new RegExp(`name="${slug === 'partners' ? 'company' : 'institution'}"`));
      const select = form.match(/<select[^>]*name="interest"[\s\S]*?<\/select>/)?.[0] ?? '';
      for (const v of values) assert.match(select, new RegExp(`value="${v}"`), `${page} option ${v}`);
      assert.match(read(page), /id="form"/);
    });
  }
}

for (const page of ['research.html', 'de/research.html']) {
  test(`research page offers open science (${page})`, () => {
    const main = mainOf(read(page));
    for (const acc of ['GSE98793', 'GSE19738', 'GSE251778', 'GSE46743', 'GSE247998', 'GSE185855', 'GSE76826', 'GSE52790']) {
      assert.match(main, new RegExp(`acc=${acc}`), acc);
    }
    assert.match(main, /github\.com\/nelladelva\/neuropenetrance_app/);
    assert.match(main, /href="evidence\.html/);
    const text = textOf(main);
    assert.ok(text.includes(page.startsWith('de/') ? 'auf Anfrage' : 'available on request'));
    assert.ok(text.includes(page.startsWith('de/') ? 'Zitieren' : 'How to cite'));
  });
}

test('form script handles every form, in the page language, with the new address', () => {
  const js = read('script.js');
  assert.ok(!js.includes('stemazing'), 'no old address in script.js');
  assert.match(js, /querySelectorAll\('form\.js-form'\)/);
  for (const page of ['partners.html', 'de/partners.html', 'research.html', 'de/research.html']) {
    const form = read(page).match(/<form[^>]*>/)?.[0] ?? '';
    assert.match(form, /class="[^"]*js-form/, page);
    assert.match(form, /data-sending="[^"]+"/, page);
    assert.match(form, /data-error="[^"]*partnerships@neuropenetrance\.com[^"]*"/, page);
  }
});
