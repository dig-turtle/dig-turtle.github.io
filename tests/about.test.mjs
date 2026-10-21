import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage } from './helpers.mjs';

const PAGES = {
  'Skip The Paywall': { path: '/skip-the-paywall', uses: ['on-device', 'ads'] },
  EzCamel: { path: '/ezcamel', uses: ['on-device', 'ads'] },
  'Clash of Cards: War': {
    path: '/clash-of-cards-war',
    uses: ['on-device', 'ads'],
  },
  Lodestra: {
    path: '/lodestra',
    uses: ['on-device', 'ads', 'analytics', 'google-drive', 'place-lookups'],
  },
};

const strip = (s) =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

for (const [name, { path, uses }] of Object.entries(PAGES)) {
  test(`${name} about page`, () => {
    const main = readPage(path).match(/<main[\s\S]*?<\/main>/)[0];

    const h1 = main.match(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/);
    assert.ok(h1, 'no h1');
    assert.match(h1[1], /text-gradient-accent/);
    assert.equal(strip(h1[2]), name);
    assert.equal((main.match(/text-gradient-accent/g) || []).length, 1, 'exactly one gradient element');

    assert.ok(main.includes('An app by Made With Pixels'), 'no eyebrow');

    const link = main.match(/<a\b[^>]*href="\/privacy-policy"[^>]*>([\s\S]*?)<\/a>/);
    assert.ok(link, 'no in-content privacy link');
    assert.ok(strip(link[1]).includes(`How ${name} handles your data`));

    const chips = [...main.matchAll(/<a\b[^>]*data-chip[^>]*>/g)].map((m) => m[0].match(/href="([^"]*)"/)[1]);
    assert.deepEqual(
      chips,
      uses.map((a) => `/privacy-policy#${a}`),
    );

    const live = (
      main.match(new RegExp(`aria-label="Get ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} on Google Play"`, 'g')) ||
      []
    ).length;
    const soon = (main.match(/data-coming-soon/g) || []).length;
    // Android is live for every app except Lodestra; iOS is coming soon for all.
    const expectedLive = name === 'Lodestra' ? 0 : 1;
    assert.equal(live, expectedLive);
    assert.equal(soon, 2 - expectedLive);
  });
}

test('EzCamel about text', () => {
  assert.match(readPage('/ezcamel'), /camelcamelcamel page for that item/);
});

test('lodestra keeps its description and drops the hard-coded coming-soon line', () => {
  const html = readPage('/lodestra');
  assert.ok(html.includes('Keep flights, stays, reservations and plans'));
  assert.ok(!html.includes('Coming soon to Google Play.'));
});
