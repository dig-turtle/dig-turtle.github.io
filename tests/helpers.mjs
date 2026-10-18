import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = join(root, 'dist');

export function readPage(route) {
  const clean = route.replace(/^\/+|\/+$/g, '');
  const file = clean === '' ? join(dist, 'index.html') : join(dist, clean, 'index.html');
  return readFileSync(file, 'utf8');
}

export function allPages() {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) out.push(p);
    }
  };
  walk(dist);
  return out;
}

export function themeColors() {
  const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
  const colors = {};
  for (const m of css.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    colors[m[1]] = m[2].toLowerCase();
  }
  return colors;
}
