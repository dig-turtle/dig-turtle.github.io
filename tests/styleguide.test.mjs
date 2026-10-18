import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, themeColors } from './helpers.mjs';

const html = readPage('/styleguide');

test('noindex', () => {
  assert.match(html, /<meta name="robots" content="noindex"/);
});

test('every color token appears with its hex', () => {
  for (const [name, hex] of Object.entries(themeColors())) {
    assert.ok(html.includes(name), `missing token ${name}`);
    assert.ok(html.toLowerCase().includes(hex), `missing hex ${hex}`);
  }
});

test('renders real components', () => {
  assert.match(html, /data-app="/);
  assert.match(html, /data-coming-soon/);
  assert.match(html, /<a\b[^>]*href="https:\/\/play\.google\.com/);
});

test('gradient text and accent override', () => {
  assert.ok(html.includes('text-gradient-accent'));
  assert.match(html, /--color-accent-from:\s*#[0-9a-f]{6}/i);
});

test('no nested main', () => {
  assert.equal((html.match(/<main\b/g) || []).length, 1);
});
