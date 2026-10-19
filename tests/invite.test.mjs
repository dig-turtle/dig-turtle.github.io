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

test('layout chrome', () => {
  assert.ok(html.includes('© 2026 Made With Pixels, LLC'));
});

test('"What\'s Lodestra?" link sits inside the card and points at /lodestra', () => {
  const card = html.match(/<div class="[^"]*rounded-lg[^"]*">[\s\S]*?<\/main>/)?.[0] ?? '';
  const link = card.match(/<a\b[^>]*href="\/lodestra"[^>]*>\s*What(?:'|&#39;)s Lodestra\?\s*<\/a>/)?.[0];
  assert.ok(link, 'no What\'s Lodestra? link in the card');
  assert.match(link, /\bunderline\b/);
  assert.match(link, /\bring-accent\b/);
  assert.doesNotMatch(link, /text-gradient-accent/);
});

test('#play badge is not lazy-loaded (above the fold)', () => {
  const play = html.match(/<a\b[^>]*\bid="play"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? '';
  assert.match(play, /<img\b/);
  assert.doesNotMatch(play, /loading="lazy"/);
});

// Runs the built inline script against stubs and returns what it wrote.
const scriptBody = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map((m) => m[1])
  .find((b) => b.includes('intent://'));

function runInvite(hash, ua = 'Android') {
  const els = {};
  for (const id of ['headline', 'detail', 'play', 'open']) els[id] = { textContent: '', href: '', hidden: true };
  els.headline.textContent = 'You\'ve been invited to a trip'; // the static text the page ships with
  const document = { title: '', getElementById: (id) => els[id] };
  const location = {
    hash,
    origin: 'https://apps.madewithpixels.xyz',
    pathname: '/lodestra/invite',
    host: 'apps.madewithpixels.xyz',
  };
  new Function('location', 'document', 'navigator', scriptBody)(location, document, { userAgent: ua });
  return {
    headline: els.headline.textContent,
    title: document.title,
    playHref: els.play.href,
    openHref: els.open.href,
  };
}

const FRAG = '#f=F1234567890&r=reader&n=Trip%20A';

test('viewer headline', () => {
  assert.equal(runInvite(FRAG).headline, 'You\'ve been invited to view “Trip A” in Lodestra');
});

test('editor headline', () => {
  assert.equal(
    runInvite('#f=F1234567890&r=writer&n=Trip%20A').headline,
    'You\'ve been invited to edit “Trip A” in Lodestra',
  );
});

test('n with no known role', () => {
  assert.equal(runInvite('#f=F1234567890&n=Trip%20A').headline, 'You\'ve been invited to “Trip A” in Lodestra');
});

test('no n keeps the generic headline', () => {
  assert.equal(runInvite('#f=F1234567890&r=reader').headline, 'You\'ve been invited to a trip');
});

test('by is never shown', () => {
  const r = runInvite('#f=F1234567890&r=reader&n=Trip%20A&by=Mallory');
  assert.ok(!r.headline.includes('Mallory'));
  assert.ok(!r.title.includes('Mallory'));
});

test('by is stripped from both forwarded URLs', () => {
  const r = runInvite('#f=F1234567890&r=writer&n=Trip%20A&by=Mallory');
  const referrer = decodeURIComponent(r.playHref.split('&referrer=')[1]);
  const query = r.openHref.split('?')[1].split('#Intent')[0];
  for (const s of [referrer, query]) {
    assert.ok(!s.includes('by='), s);
    assert.ok(!s.includes('Mallory'), s);
    assert.ok(s.includes('f=F1234567890'), s);
    assert.ok(s.includes('r=writer'), s);
    assert.ok(s.includes('n='), s);
  }
});

test('forwarded n round-trips', () => {
  const r = runInvite('#f=F1234567890&r=writer&n=Trip%20A&by=Mallory');
  const referrer = decodeURIComponent(r.playHref.split('&referrer=')[1]);
  assert.equal(new URLSearchParams(referrer.split('#')[1]).get('n'), 'Trip A');
  assert.equal(new URLSearchParams(r.openHref.split('?')[1].split('#Intent')[0]).get('n'), 'Trip A');
});

test('script reads no by and uses textContent only', () => {
  assert.ok(!scriptBody.includes('get(\'by\')') && !scriptBody.includes('get("by")'));
  assert.ok(!scriptBody.includes('innerHTML'));
});
