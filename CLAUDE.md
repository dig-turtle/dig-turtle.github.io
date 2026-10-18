# CLAUDE.md

Astro 5 + Tailwind v4 static site for apps.madewithpixels.xyz (Made With Pixels, LLC), deployed to GitHub Pages.

## UI

- Follow `DESIGN.md` for all UI work: tokens, components, the neon rules and the Do's and Don'ts.
- Use the semantic token utilities from `src/styles/global.css` (`bg-canvas`, `bg-surface`, `text-ink`, `text-body`, `text-mute`, `border-hairline`, `bg-primary`, `text-gradient-accent`, `ring-accent`, `glow-from`, `glow-to`), not Tailwind's stock palette (`gray-*`, `purple-*`, …) or hard-coded hex values.
- Reuse the shared layouts and components in `src/layouts/` and `src/components/`.

## Commands

- `npm run dev` — dev server on http://localhost:4321
- `npm test` — builds the site, then runs `node --test` over `tests/**/*.test.mjs`

No new dependencies without asking; tests use `node:test` and `node:fs` only.
