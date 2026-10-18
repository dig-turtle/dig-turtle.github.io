import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { themeColors } from './helpers.mjs';

const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

function frontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(m, 'DESIGN.md has YAML frontmatter');
  return m[1];
}

function frontmatterColors(fm) {
  const block = fm.match(/^colors:\n((?:[ \t]+.*\n?)*)/m);
  assert.ok(block, 'frontmatter has a colors: block');
  const colors = {};
  for (const m of block[1].matchAll(/^\s+([a-z0-9-]+):\s*"(#[0-9a-fA-F]{3,8})"/gm)) {
    colors[m[1]] = m[2].toLowerCase();
  }
  return colors;
}

test('frontmatter tokens match theme', () => {
  const doc = frontmatterColors(frontmatter(read('DESIGN.md')));
  const theme = themeColors();
  assert.ok(Object.keys(theme).length > 0, 'theme has colors');
  for (const [name, value] of Object.entries(theme)) {
    assert.equal(doc[name], value, `DESIGN.md colors.${name}`);
  }
});

test('is ours, not Raycast\'s', () => {
  const md = read('DESIGN.md');
  assert.match(frontmatter(md), /^name:\s*Made-With-Pixels\s*$/m);
  const hits = md.split('\n').filter((line) => /raycast/i.test(line));
  const count = (md.match(/raycast/gi) || []).length;
  assert.ok(count <= 2, `"Raycast" appears ${count} times`);
  for (const line of hits) {
    assert.match(line, /derived from|credit|MIT/i, `non-credit Raycast line: ${line}`);
  }
});

test('claude points at design', () => {
  assert.ok(read('CLAUDE.md').includes('DESIGN.md'));
});
