import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { themeColors } from './helpers.mjs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('accent pair is exact', () => {
  const c = themeColors();
  assert.equal(c['accent-from'], '#ff2fd6');
  assert.equal(c['accent-to'], '#22d3ee');
});

test('raycast base values', () => {
  const c = themeColors();
  assert.equal(c.canvas, '#07080a');
  assert.equal(c.hairline, '#242728');
  assert.equal(c.ink, '#f4f4f6');
  assert.equal(c.body, '#cdcdcd');
  assert.equal(c.mute, '#9c9c9d');
});

test('text tokens meet AA', () => {
  const c = themeColors();
  for (const text of ['ink', 'body', 'mute']) {
    for (const bg of ['canvas', 'surface', 'surface-card']) {
      const ratio = contrast(c[text], c[bg]);
      assert.ok(ratio >= 4.5, `${text} on ${bg} is ${ratio.toFixed(2)}`);
    }
  }
});

test('reduced motion', () => {
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test('ss03 enabled', () => {
  assert.ok(css.includes('"ss03"'));
});
