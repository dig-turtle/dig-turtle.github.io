import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { allPages, readPage } from './helpers.mjs';

const LEGAL = ['/privacy-policy', '/terms-of-service'];
const ENTITY = 'Made With Pixels, LLC';

test('no old names anywhere', () => {
  for (const file of allPages()) {
    const html = readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /Dig Turtle/, file);
    assert.doesNotMatch(html, /Filicode/, file);
  }
});

test('footer everywhere', () => {
  for (const file of allPages()) {
    assert.ok(readFileSync(file, 'utf8').includes(`© 2026 ${ENTITY}`), file);
  }
});

test('entity named in body text and title', () => {
  for (const route of LEGAL) {
    const html = readPage(route);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? '';
    assert.ok(main.includes(ENTITY), `${route} body`);
    assert.ok(title.includes(ENTITY), `${route} title: ${title}`);
  }
});

test('updated date', () => {
  assert.ok(readPage('/privacy-policy').includes('Last updated: October 2026'), '/privacy-policy');
  assert.ok(readPage('/terms-of-service').includes('Last updated: 2026'), '/terms-of-service');
});

test('lodestra privacy policy redirects to the Drive section', () => {
  const html = readPage('/lodestra/privacy-policy');
  assert.match(html, /<meta http-equiv="refresh" content="0;\s*url=\/privacy-policy#google-drive"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/apps\.madewithpixels\.xyz\/privacy-policy"/);
  assert.match(html, /<meta name="robots" content="noindex"/);
  assert.match(html, /<a\b[^>]*href="\/privacy-policy#google-drive"/);
});

test('privacy policy contact email is a mailto link', () => {
  const html = readPage('/privacy-policy');
  assert.match(
    html,
    /please contact us at <a\b[^>]*href="mailto:brillianceanimationstudios@gmail\.com"[^>]*>brillianceanimationstudios@gmail\.com<\/a>\./,
  );
  assert.doesNotMatch(html, /social media channels/);
});

test('header brand wears the gradient on every page', () => {
  for (const file of allPages()) {
    const html = readFileSync(file, 'utf8');
    const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? '';
    const brand = header.match(/<a\b[^>]*href="\/"[^>]*>\s*Made With Pixels\s*<\/a>/)?.[0];
    assert.ok(brand, `${file}: no header brand`);
    assert.match(brand, /text-gradient-accent/, file);
  }
});

test('legal heading in the gradient; section h2s get the accent bar', () => {
  for (const route of LEGAL) {
    const html = readPage(route);
    const h1 = html.match(/<h1\b[^>]*>/)?.[0] ?? '';
    assert.match(h1, /text-gradient-accent/, `${route} h1`);
    assert.ok(html.includes('[&_h2]:accent-bar'), `${route} h2 accent`);
  }
});

test('footer links are identical on every page: privacy and terms only', () => {
  for (const file of allPages()) {
    const html = readFileSync(file, 'utf8');
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? '';
    const hrefs = [...footer.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map((m) => m[1]);
    assert.deepEqual(hrefs, ['/privacy-policy', '/terms-of-service'], file);
  }
});
