import { test } from 'node:test';
import assert from 'node:assert/strict';
import { read, textOf, mainOf } from './site.test.mjs';

for (const page of ['platform.html', 'de/platform.html']) {
  test(`platform explains data, outputs and the app (${page})`, () => {
    const main = mainOf(read(page));
    const text = textOf(main);
    for (const s of ['RNA', 'PAXgene', 'Research Use Only', 'Engine 1']) assert.ok(text.includes(s), `${page}: ${s}`);
    assert.ok(text.includes(page.startsWith('de/') ? 'in Entwicklung' : 'in development'));
    for (const img of ['app-report.png', 'app-intake.png']) assert.match(main, new RegExp(`<img [^>]*src="(\\.\\./)?assets/img/${img}"[^>]*alt="[^"]+"`), `${page} ${img}`);
    assert.match(main, /href="https:\/\/neuropenetrance\.streamlit\.app"/);
    assert.ok(!/DNA sequencing|DNA-Sequenzierung/.test(text));
  });
}
