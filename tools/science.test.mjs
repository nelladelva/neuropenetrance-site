import { test } from 'node:test';
import assert from 'node:assert/strict';
import { read, textOf, mainOf } from './site.test.mjs';

test('science tells the story and the roadmap', () => {
  const t = textOf(mainOf(read('science.html')));
  for (const s of ['incomplete penetrance', 'Engine 1', 'CRP', 'proteomics']) assert.ok(t.includes(s), s);
  const d = textOf(mainOf(read('de/science.html')));
  for (const s of ['unvollständige Penetranz', 'Engine 1', 'CRP', 'Proteomik']) assert.ok(d.includes(s), `de ${s}`);
});

test('contact routes to the forms', () => {
  for (const p of ['contact.html', 'de/contact.html']) {
    const main = mainOf(read(p));
    assert.match(main, /href="partners\.html#form"/, p);
    assert.match(main, /href="research\.html#form"/, p);
    assert.ok(textOf(main).includes('partnerships@neuropenetrance.com'), p);
  }
});
