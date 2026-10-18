import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage } from './helpers.mjs';

const html = readPage('/lodestra/invite');
const PLAY = 'https://play.google.com/store/apps/details?id=io.bwvolleyball.lodestra';

// Opening tag of the element carrying the given id.
const tagWithId = (id) => html.match(new RegExp(`<[a-z0-9]+\\b[^>]*\\bid="${id}"[^>]*>`))?.[0];

test('script-driven elements exist', () => {
  for (const id of ['headline', 'detail', 'play', 'open']) assert.ok(tagWithId(id), `missing #${id}`);
});

test('#open is a hidden anchor', () => {
  const tag = tagWithId('open');
  assert.match(tag, /^<a\b/);
  assert.match(tag, /\bhidden\b/);
});

test('#play is the anchor itself, pointing at Play', () => {
  const tag = tagWithId('play');
  assert.match(tag, /^<a\b/);
  assert.ok(tag.includes(`href="${PLAY}"`), tag);
});

test('#headline wears the gradient itself and wraps long text', () => {
  const tag = tagWithId('headline');
  assert.match(tag, /text-gradient-accent/);
  assert.match(tag, /break-words|text-balance|text-wrap/);
});

test('noindex', () => {
  assert.match(html, /<meta name="robots" content="noindex"/);
});

test('inline script intact', () => {
  assert.ok(html.includes('intent://'));
  assert.ok(html.includes('S.browser_fallback_url'));
  assert.ok(html.includes('referrer='));
});

test('layout chrome and footer links', () => {
  assert.ok(html.includes('© 2026 Made With Pixels, LLC'));
  assert.match(html, /href="\/lodestra"/);
  assert.match(html, /href="\/lodestra\/privacy-policy"/);
});
