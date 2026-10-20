import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage } from './helpers.mjs';

const html = readPage('/privacy-policy');

const EXPECT = {
  'on-device': ['All apps'],
  ads: ['Skip The Paywall', 'EzCamel', 'Clash of Cards: War', 'Lodestra'],
  analytics: ['Lodestra'],
  'google-drive': ['Lodestra'],
  'place-lookups': ['Lodestra'],
};

const strip = (s) =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/** HTML from `<h2 id="${id}"` up to the next `<h2` (or the end of the article). */
function section(id) {
  const start = html.indexOf(`<h2 id="${id}"`);
  assert.ok(start >= 0, `no section #${id}`);
  const rest = html.slice(start + 1);
  const ends = [rest.indexOf('<h2'), rest.indexOf('</article>')].filter((i) => i >= 0);
  return html.slice(start, start + 1 + Math.min(...ends));
}

const chips = (s) => [...s.matchAll(/<(a|span)\b([^>]*\bdata-chip\b[^>]*)>([\s\S]*?)<\/\1>/g)];

test('each data-use section lists exactly the apps it applies to', () => {
  for (const [id, names] of Object.entries(EXPECT)) {
    assert.deepEqual(
      chips(section(id)).map((m) => strip(m[3])),
      names,
      id,
    );
  }
});

test('app chips link to the app pages', () => {
  const hrefs = chips(section('ads')).map((m) => m[2].match(/href="([^"]*)"/)?.[1]);
  assert.deepEqual(hrefs, ['/skip-the-paywall', '/ezcamel', '/clash-of-cards-war', '/lodestra']);
});

test('names the processors', () => {
  assert.ok(section('ads').includes('AdMob'));
  assert.ok(section('analytics').includes('PostHog'));
});

test('never calls analytics anonymous', () => assert.doesNotMatch(html, /anonymous/i));

test('drive section keeps the Google API commitments', () => {
  const drive = section('google-drive');
  for (const s of ['drive.appdata', 'drive.file', 'Limited Use', 'api-services-user-data-policy', 'Sharing a Trip']) {
    assert.ok(drive.includes(s), s);
  }
});

test('place lookups section says what is sent and kept', () => {
  const s = strip(section('place-lookups'));
  for (const t of ['address text', 'built-in location service', 'only the resulting time zone', 'No API key']) {
    assert.ok(s.includes(t), t);
  }
});

test('shared links open on another site', () => {
  const s = section('on-device');
  assert.match(s, /Skip The Paywall and EzCamel/);
  assert.match(s, /privacy policy applies/);
});

test('contents list links each data-use section', () => {
  const before = html.slice(0, html.indexOf('<h2 id='));
  for (const id of Object.keys(EXPECT)) assert.ok(before.includes(`href="#${id}"`), id);
});

test('one gradient title', () => {
  const main = html.match(/<main[\s\S]*?<\/main>/)[0];
  assert.equal((main.match(/text-gradient-accent/g) || []).length, 1);
});
