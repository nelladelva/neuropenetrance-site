import { test } from 'node:test';
import assert from 'node:assert/strict';
import { read, textOf, mainOf } from './site.test.mjs';

test('home leads with Engine 2 and both paths', () => {
  const h = read('index.html');
  const text = textOf(mainOf(h));
  assert.ok(text.includes('Find which patients carry the biology that matters, from a blood sample.'));
  assert.match(mainOf(h), /href="partners\.html/);
  assert.match(mainOf(h), /href="research\.html/);
  for (const s of ['8', '779', '8 / 8', 'EU', 'RUO']) assert.ok(text.includes(s), `trust strip: ${s}`);
  assert.ok(text.includes('Engine 1'));
  assert.ok(/RNA/.test(text), 'says what we analyse');
});

test('German home is translated', () => {
  const text = textOf(mainOf(read('de/index.html')));
  assert.ok(!text.includes('Find which patients'));
  assert.ok(text.includes('Blutprobe'));
  assert.ok(text.includes('Engine 1'));
});
