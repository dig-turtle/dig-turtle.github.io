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

test('"Lodestra Trip Invite" is the h1 and wears the gradient', () => {
  const h1s = [...html.matchAll(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/g)];
  assert.equal(h1s.length, 1, 'exactly one h1');
  const [, attrs, text] = h1s[0];
  assert.equal(text.trim(), 'Lodestra Trip Invite');
  assert.match(attrs, /text-gradient-accent/);
});

test('#headline is a calm secondary line that wraps long text', () => {
  const tag = tagWithId('headline');
  assert.match(tag, /^<p\b/);
  assert.doesNotMatch(tag, /text-gradient-accent/);
  assert.match(tag, /\btext-(ink|body)\b/);
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

test('#play badge is not lazy-loaded (above the fold)', () => {
  const play = html.match(/<a\b[^>]*\bid="play"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? '';
  assert.match(play, /<img\b/);
  assert.doesNotMatch(play, /loading="lazy"/);
});
