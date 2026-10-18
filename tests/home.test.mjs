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

test('row neon uses hover, keyboard focus and tap, not focus-within', () => {
  for (const row of rows) {
    const cls = row.match(/<li\b[^>]*class="([^"]*)"/)[1];
    assert.ok(cls.includes('has-[:focus-visible]:'), 'row lacks a focus-visible neon state');
    assert.ok(cls.includes('active:'), 'row lacks a tap (active) neon state');
    assert.ok(!row.includes('focus-within'), 'row markup still uses focus-within');
  }
});

test('live badge links name their app', () => {
  for (const name of ['Skip The Paywall', 'EzCamel', 'Clash of Cards: War']) {
    const row = rows.find((r) => rowName(r) === name);
    const link = row.match(/<a\b[^>]*href="https:\/\/play\.google\.com[^"]*"[^>]*>/)?.[0] ?? '';
    const label = link.match(/aria-label="([^"]*)"/)?.[1]?.replace(/&amp;/g, '&');
    assert.equal(label, `Get ${name} on Google Play`);
  }
});

test('rows with a page show a persistent link cue', () => {
  const row = rows.find((r) => rowName(r) === 'Lodestra');
  const link = row.match(/<a\b[^>]*href="\/lodestra"[^>]*>/)?.[0] ?? '';
  const classes = (link.match(/class="([^"]*)"/)?.[1] ?? '').split(/\s+/);
  assert.ok(classes.includes('underline'), `no always-on underline: ${link}`);
});
