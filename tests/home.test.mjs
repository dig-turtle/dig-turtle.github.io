import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage } from './helpers.mjs';

const html = readPage('/');

// Return the full outer HTML of every element whose opening tag matches `opener`,
// following nested tags of the same name until the element closes.
function elements(source, tag, attr) {
  const out = [];
  const open = new RegExp(`<${tag}\\b[^>]*\\b${attr}\\b[^>]*>`, 'g');
  for (const m of source.matchAll(open)) {
    const re = new RegExp(`<${tag}\\b|</${tag}>`, 'g');
    re.lastIndex = m.index + m[0].length;
    let depth = 1;
    let end = source.length;
    for (const t of source.matchAll(re)) {
      if (t.index < re.lastIndex) continue;
      depth += t[0].startsWith('</') ? -1 : 1;
      if (depth === 0) {
        end = t.index + t[0].length;
        break;
      }
    }
    out.push(source.slice(m.index, end));
  }
  return out;
}

const rows = elements(html, 'li', 'data-app');
const rowName = (row) => row.match(/data-app="([^"]*)"/)[1].replace(/&amp;/g, '&');

test('four apps in order', () => {
  assert.deepEqual(rows.map(rowName), ['Skip The Paywall', 'EzCamel', 'Clash of Cards: War', 'Lodestra']);
});

test('live play links', () => {
  for (const id of ['io.bwvolleyball.paywall', 'io.bwvolleyball.ez.camel', 'io.bwvolleyball.cards.war']) {
    assert.ok(
      html.includes(`href="https://play.google.com/store/apps/details?id=${id}"`),
      `missing Play link for ${id}`,
    );
  }
});

test('lodestra row', () => {
  const row = rows.find((r) => rowName(r) === 'Lodestra');
  assert.ok(row, 'no Lodestra row');
  assert.doesNotMatch(row, /<a\b[^>]*href="[^"]*play\.google\.com/);
  assert.doesNotMatch(row, /<a\b[^>]*href="[^"]*apple\.com/);
  assert.equal((row.match(/data-coming-soon/g) || []).length, 2);
  assert.match(row, /<a\b[^>]*href="\/lodestra"/);
});

test('coming soon count', () => {
  const soon = elements(html, 'span', 'data-coming-soon');
  assert.equal(soon.length, 5);
  for (const el of soon) {
    assert.ok(el.includes('Coming soon'), `coming-soon badge without label: ${el}`);
    assert.doesNotMatch(el, /<a\b/);
  }
});

test('cleanup', () => {
  assert.ok(!html.includes('font-awesome'));
  assert.ok(!html.includes('fa-'));
  assert.ok(!html.includes('Join the Community'));
});

test('brand', () => {
  assert.ok(html.includes('Made With Pixels'));
  assert.ok(html.includes('© 2026 Made With Pixels, LLC'));
});

test('tap enabler', () => {
  assert.ok(html.includes('touchstart'));
});

test('no styleguide link', () => {
  assert.ok(!html.includes('href="/styleguide"'));
});

test('lodestra page', () => {
  const page = readPage('/lodestra');
  assert.ok(page.includes('© 2026 Made With Pixels, LLC'));
  assert.match(page, /href="\/lodestra\/privacy-policy"/);
});
