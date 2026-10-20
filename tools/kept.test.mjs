import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { read, textOf, mainOf, ROOT } from './site.test.mjs';

const snap = (p) => readFileSync(join(ROOT, 'tools/snapshots', p), 'utf8').trim();

test('team text unchanged', () => {
  const before = snap('team.en.txt').replace(/^← Back to home\s*/, '');
  assert.equal(textOf(mainOf(read('team.html'))), before);
});

test('evidence numbers unchanged', () => {
  const text = textOf(mainOf(read('evidence.html')));
  for (const n of ['0.500', '0.755', '0.613', '0.611', '0.57–0.63', '0.61', '8 / 8', '779']) assert.ok(text.includes(n), n);
  for (const n of snap('evidence.en.txt').match(/\d+\.\d+/g)) assert.ok(text.includes(n), `snapshot number ${n}`);
  assert.equal(text, snap('evidence.en.txt').replace(/^← Back to home\s*/, ''), 'evidence text unchanged');
});

test('German team and evidence exist and keep the numbers', () => {
  const ev = textOf(mainOf(read('de/evidence.html')));
  for (const n of ['0,613', '0,755', '0,611', '779', '8 / 8']) assert.ok(ev.includes(n), `de evidence ${n}`);
  const team = textOf(mainOf(read('de/team.html')));
  assert.ok(team.includes('Nella Christie Delva'));
  assert.ok(!team.includes('One founder, building both sides'), 'team is translated');
});

test('evidence bars show their value without JavaScript', () => {
  for (const p of ['evidence.html', 'de/evidence.html']) {
    for (const [, target, style] of read(p).matchAll(/class="bar-fill[^"]*" data-target="([\d.]+)"([^>]*)>/g)) {
      assert.match(style, new RegExp(`style="width:${target}%"`), `${p} bar ${target}`);
    }
  }
});
