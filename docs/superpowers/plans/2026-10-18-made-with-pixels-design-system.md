# Made With Pixels Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stock gray/purple look with a Raycast-derived, neon-duo "Made With Pixels" design system (DESIGN.md, Tailwind tokens, shared layout and components, `/styleguide`) and move every page onto it.

**Architecture:** Tokens live in Tailwind v4's `@theme` in `src/styles/global.css`, and `DESIGN.md` documents them. One `Layout.astro` owns `<html>`/head/fonts/glows/header/footer, and `LegalLayout.astro` wraps it for long-form pages. App data is typed in `src/data/apps.ts` and rendered by `AppRow` and `StoreBadge`. Tests are zero-dependency `node:test` files that read the built `dist/` HTML and `global.css`.

**Tech Stack:** Astro 5, Tailwind v4 (`@tailwindcss/vite`), Node 22 `node:test`, Google Fonts (Inter, JetBrains Mono).

**Spec:** `docs/superpowers/specs/2026-10-18-made-with-pixels-design-system-design.md`. Read it before each task. Also see the approved mockup (option A) at `.superpowers/brainstorm/41294-1792361351/content/accent-direction.html` and the Raycast source at `/private/tmp/claude-501/-Users-brandon-Code-lodestra/e842b187-3a94-4fa8-a406-5c5810ac9bec/scratchpad/designmd/raycast.DESIGN.md` (also at github.com/VoltAgent/awesome-design-md, `design-md/raycast/DESIGN.md`, commit `e06a96660396d741d0c106c8972172254dafbdc2`).

## Global Constraints

- No new dependencies, runtime or dev. Tests use `node:test` plus `node:fs`, nothing else.
- Accent pair is exactly `--color-accent-from: #ff2fd6` and `--color-accent-to: #22d3ee`. Every neon use derives from these two variables.
- Raycast base values: canvas `#07080a`, surface `#0d0d0d`, surface-elevated `#101111`, surface-card `#121212`, hairline `#242728`, ink `#f4f4f6`, body `#cdcdcd`, mute `#9c9c9d`, ash `#6a6b6c`, primary `#ffffff` / on-primary `#000000`. Radii 4/6/8/10/16/full.
- Inter with `font-feature-settings: "calt","kern","liga","ss03"` on `body`.
- Footer on every page reads exactly `© 2026 Made With Pixels, LLC`. Header brand reads `Made With Pixels`.
- No page in `dist/` contains "Dig Turtle" or "Filicode".
- Neon row state on hover, keyboard focus (`:focus-visible` inside the row; not `:focus-within`, per controller ruling), and `:active` (tap), never permanently. Hover is gated to hover-capable devices (Tailwind v4's `hover:` already does this).
- Body text meets WCAG AA (≥ 4.5:1) on its surface. `ash` is decorative or ≥ 18px only.
- Store badge artwork is the official images, unaltered (same URLs the site uses today). Coming-soon badges are not links and show a visible "Coming soon" label without hover.
- Respect `prefers-reduced-motion: reduce` (no transitions or animation).
- Work on branch `feat/design-system`. Commit per task. The owner merges the PR.

## Review Focus

1. **iPhone taps:** Mobile Safari doesn't apply `:active` unless a touch listener exists, so the tap flash would be invisible on iPhones. Layout registers a passive `touchstart` no-op, and Task 3's test pins it.
2. **Contrast:** dark-gray tokens (`ash`, `stone`) used for descriptions or footer text fail AA. Task 1's contrast test pins the pairs, and text in Tasks 3–6 uses `mute` or lighter.
3. **Narrow phones:** at 360px, a row with a long name plus two badges must wrap (badges drop below the text), with no horizontal scroll. Task 7 checks this by hand at 360px.
4. **Invite flow:** the move must keep ids `headline`, `detail`, `play` and `open`, the `hidden` attribute on `#open`, and the inline `define:vars` script, and gradient headline text must stay legible when the script injects a long trip name. Task 4's test pins the markup, and Task 7 checks a long name by hand.
5. **Taps that navigate away:** the flash must show during the press even when the tap opens the Play Store. Apply the `:active` state with no transition-in (transition only on release). Task 7 checks it by hand in a mobile emulator.

---

### Task 1: Tokens, base styles and test harness

**Files:**
- Modify: `src/styles/global.css`, `package.json`
- Create: `tests/helpers.mjs`, `tests/tokens.test.mjs`

**Interfaces:**
- Produces: Tailwind color utilities `canvas`, `surface`, `surface-elevated`, `surface-card`, `hairline`, `ink`, `body`, `mute`, `ash`, `primary`, `on-primary`, `accent-from`, `accent-to`. Fonts `--font-sans` (Inter stack) and `--font-mono` (JetBrains Mono stack). Radius tokens matching the Raycast scale.
- Custom utilities (`@utility`):
  - `text-gradient-accent`: accent-from→accent-to gradient text, with `color: var(--color-accent-from)` as fallback.
  - `ring-accent`: the focus-visible ring.
  - `glow-from` / `glow-to`: the radial glow backgrounds.
- `tests/helpers.mjs` exports:
  - `readPage(route: string): string`: reads `dist/<route>/index.html`, or `dist/index.html` for `/`.
  - `allPages(): string[]`: every `.html` path under `dist`.
  - `themeColors(): Record<string, string>`: parses `--color-*: #hex` from `src/styles/global.css`.
- `npm test` runs `astro build && node --test "tests/**/*.test.mjs"`.

- [ ] **Step 1: Write `tests/tokens.test.mjs`**
  - `accent pair is exact`: `themeColors()['accent-from'] === '#ff2fd6'` and `['accent-to'] === '#22d3ee'`.
  - `raycast base values`: canvas, hairline, ink, body and mute equal the Global Constraints values.
  - `text tokens meet AA`: WCAG relative-luminance contrast ≥ 4.5 for each of `ink`, `body`, `mute` on each of `canvas`, `surface`, `surface-card`. Write a small `contrast(hexA, hexB)` in the test file.
  - `reduced motion`: `global.css` contains `prefers-reduced-motion: reduce`.
  - `ss03 enabled`: `global.css` contains `"ss03"`.
- [ ] **Step 2:** Run `npm test` and confirm it fails on the missing tokens.
- [ ] **Step 3: Implement the `@theme` tokens, base layer and utilities in `global.css`.**
  - Base layer: `body` gets `bg-canvas text-body font-sans` plus the font features.
  - Under reduced motion, transitions and animations are off.
- [ ] **Step 4:** Run `npm test` and confirm everything passes.
- [ ] **Step 5:** Commit: `feat(ds): design tokens, base styles, test harness`.

### Task 2: DESIGN.md and CLAUDE.md

**Files:**
- Create: `DESIGN.md`, `CLAUDE.md`, `tests/design-md.test.mjs`

**Interfaces:**
- Consumes: the token names and values from Task 1. DESIGN.md must use the same names.

- [ ] **Step 1: Write `tests/design-md.test.mjs`**
  - `frontmatter tokens match theme`: parse the `colors:` block in DESIGN.md's YAML frontmatter (simple `key: "#hex"` lines), and every color in `themeColors()` appears there with the same value.
  - `is ours, not Raycast's`: `name:` is `Made-With-Pixels`, and the word "Raycast" appears only on lines that credit the source (≤ 2 occurrences).
  - `claude points at design`: `CLAUDE.md` contains `DESIGN.md`.
- [ ] **Step 2:** Run the test and confirm it fails.
- [ ] **Step 3: Write `DESIGN.md`.**
  - Format: Google Labs `design.md` alpha, with frontmatter `version: alpha`, `name`, `description`, `colors`, `typography`, `rounded`, `spacing`, `components`.
  - Then markdown sections in the source's order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts, Responsive Behavior.
  - Rewrite every section for Made With Pixels:
    - the neon duo and where it may appear
    - the hover/focus/tap rule
    - the catalog app row
    - the coming-soon badge rule
    - the per-app accent override (set the two accent variables on a wrapper)
    - the anti-goals from the spec as Don'ts
  - Credit the source (repo, path, commit, MIT) in one line.
- [ ] **Step 4: Write `CLAUDE.md`.** Cover:
  - Follow `DESIGN.md` for all UI.
  - Use the semantic token utilities, not Tailwind's stock palette.
  - The commands: `npm run dev`, `npm test`.
- [ ] **Step 5:** Run `npm test` and confirm it passes.
- [ ] **Step 6:** Commit: `docs(ds): DESIGN.md and CLAUDE.md`.

### Task 3: Layout, app components and homepage

**Files:**
- Create: `src/layouts/Layout.astro`, `src/data/apps.ts`, `src/components/StoreBadge.astro`, `src/components/AppRow.astro`, `src/components/Button.astro`, `tests/home.test.mjs`
- Modify: `src/pages/index.astro` (rewrite), `src/pages/lodestra/index.astro` (move onto Layout, same copy)

**Interfaces:**
- Consumes: Task 1 utilities.
- Produces:
  - `Layout.astro` props: `{ title: string; description?: string; noindex?: boolean; footerLinks?: { href: string; label: string }[] }`. Default footer links are Privacy Policy `/privacy-policy` and Terms of Service `/terms-of-service`, and `footerLinks` are appended after them. Layout renders the header brand link to `/`, the two glows, `<slot />`, the footer, the fonts `<link>`, and the touchstart enabler: `<script is:inline>document.addEventListener('touchstart',function(){},{passive:true})</script>`.
  - `src/data/apps.ts`:
    ```ts
    export type StoreLink = { status: 'live'; url: string } | { status: 'coming-soon' };
    export interface App { name: string; description: string; page?: string; icon?: string; stores: { android: StoreLink; ios: StoreLink } }
    export const apps: App[];
    ```
  - `StoreBadge.astro` props: `{ store: 'android' | 'ios'; link: StoreLink; id?: string }`. A live badge is `<a href={url}>` wrapping the official badge `<img>`. A coming-soon badge is a non-link `<span data-coming-soon>` with the dimmed badge and a visible "Coming soon" label. Badge images use the URLs in today's `index.astro`.
  - `AppRow.astro` props: `{ app: App }`. Renders `<li data-app={app.name}>`. The name links to `app.page` when set. The icon tile shows `app.icon` if set, otherwise a placeholder built from the app's first letter. Badges sit at the right, or wrap below on narrow screens. The neon state uses `hover:`, `has-[:focus-visible]:` (keyboard focus) and `active:` (no transition on `active`).
  - `Button.astro` props: `{ href: string; variant?: 'primary' | 'secondary'; id?: string; hidden?: boolean }`. `primary` is the white pill.

- [ ] **Step 1: Write `tests/home.test.mjs`** (against `readPage('/')`):
  - `four apps in order`: the `data-app` values are exactly `Skip The Paywall`, `EzCamel`, `Clash of Cards: War`, `Lodestra`.
  - `live play links`: there are anchors to `https://play.google.com/store/apps/details?id=io.bwvolleyball.paywall`, `…id=io.bwvolleyball.ez.camel` and `…id=io.bwvolleyball.cards.war`.
  - `lodestra row`: the Lodestra row has no `play.google.com` or `apple.com` anchor, has 2 `data-coming-soon`, and links to `/lodestra`.
  - `coming soon count`: the page has 5 `data-coming-soon` elements (4 iOS + Lodestra Play), and each contains the text "Coming soon".
  - `cleanup`: no `font-awesome`, `fa-`, or `Join the Community`.
  - `brand`: contains `Made With Pixels` and `© 2026 Made With Pixels, LLC`.
  - `tap enabler`: contains `touchstart`.
  - `no styleguide link`: no `href="/styleguide"`.
  - `lodestra page`: `readPage('/lodestra')` contains the footer string and a `/lodestra/privacy-policy` link.
- [ ] **Step 2:** Run the test and confirm it fails.
- [ ] **Step 3: Implement** the Layout, data, components and both pages.
  - App data, names and descriptions are copied from today's `index.astro`. Lodestra's description is `A trip organizer for Android`, with `page: '/lodestra'`. Drop the dead `image` field.
  - Hero: brand eyebrow, a headline with one `text-gradient-accent` phrase, and a subline. The copy is the builder's call, per the spec.
- [ ] **Step 4:** Run `npm test` and confirm it passes.
- [ ] **Step 5:** Commit: `feat(ds): layout, app row, store badges, new homepage`.

### Task 4: Invite page

**Files:**
- Modify: `src/pages/lodestra/invite.astro`
- Create: `tests/invite.test.mjs`

**Interfaces:**
- Consumes: `Layout` (`noindex`, `footerLinks` About Lodestra `/lodestra` and Lodestra Privacy Policy `/lodestra/privacy-policy`), `StoreBadge` (`store="android"`, `link={{status:'live', url: playUrl}}`, `id="play"`), and `Button` (`id="open"`, `href="#"`, `hidden`, primary).

- [ ] **Step 1: Write `tests/invite.test.mjs`** (against `readPage('/lodestra/invite')`):
  - The page has `id="headline"`, `id="detail"`, `id="play"`, and an `id="open"` element carrying the `hidden` attribute.
  - It has `name="robots" content="noindex"`.
  - The inline script still contains `intent://`, `S.browser_fallback_url` and `referrer=`.
  - The `#play` anchor's href is `https://play.google.com/store/apps/details?id=io.bwvolleyball.lodestra`.
- [ ] **Step 2:** Run the test and confirm it fails.
- [ ] **Step 3: Move the page onto Layout.** The script block is unchanged, character for character. The headline uses the gradient phrase style and wraps cleanly.
- [ ] **Step 4:** Run `npm test` and confirm it passes.
- [ ] **Step 5:** Commit: `feat(ds): invite page on the design system`.

### Task 5: Legal pages and entity rename

**Files:**
- Create: `src/layouts/LegalLayout.astro`, `tests/legal.test.mjs`
- Modify: `src/pages/privacy-policy.astro`, `src/pages/terms-of-service.astro`, `src/pages/lodestra/privacy-policy.astro`

**Interfaces:**
- Consumes: `Layout`.
- Produces: `LegalLayout.astro` props `{ title: string; description: string; heading: string; updated: string; footerLinks?: … }`. It renders the heading, the "Last updated: {updated}" line, and a long-form reading container: about a 65ch measure, the body type ladder, h2 and h3 from the type scale, and plain section rhythm instead of today's gray boxes.

- [ ] **Step 1: Write `tests/legal.test.mjs`**:
  - `no old names anywhere`: for every file in `allPages()`, no `Dig Turtle` and no `Filicode`.
  - `footer everywhere`: every page in `allPages()` contains `© 2026 Made With Pixels, LLC`.
  - `entity named`: the 3 legal pages each contain `Made With Pixels, LLC` in the body text and in `<title>`.
  - `updated date`: the 3 legal pages each contain `Last updated: October 2026`.
- [ ] **Step 2:** Run the test and confirm it fails.
- [ ] **Step 3: Move the 3 pages onto LegalLayout.**
  - Apply the rename exactly as the spec's Pages table says: grammar fixes only where the rename forces them, and every other sentence unchanged.
  - Diff the visible text against `main` to confirm.
- [ ] **Step 4:** Run `npm test` and confirm it passes.
- [ ] **Step 5:** Commit: `feat(ds): legal pages on the design system; Made With Pixels, LLC`.

### Task 6: Styleguide

**Files:**
- Create: `src/pages/styleguide.astro`, `tests/styleguide.test.mjs`

**Interfaces:**
- Consumes: everything above. It renders the real components, not copies.

- [ ] **Step 1: Write `tests/styleguide.test.mjs`** (against `readPage('/styleguide')`):
  - It has `noindex`.
  - Each color token name from `themeColors()` appears.
  - It has at least one `data-app`, one `data-coming-soon`, and a live badge anchor.
  - It contains `text-gradient-accent`.
- [ ] **Step 2:** Run the test and confirm it fails.
- [ ] **Step 3: Implement the sections:**
  - color swatches with hex values
  - type scale samples
  - radii and spacing
  - buttons (primary, secondary, focus)
  - an app row in default state, with a note that hover, focus and tap all light it
  - an app row with a sample `icon` and with the placeholder
  - live and coming-soon badges
  - an accent-override demo: a wrapper that sets the two accent variables to another pair, to show how per-app theming works
- [ ] **Step 4:** Run `npm test` and confirm it passes.
- [ ] **Step 5:** Commit: `feat(ds): styleguide page`.

### Task 7: Visual pass and PR

- [ ] **Step 1:** Run `npm test` from a clean `dist` and confirm all pass.
- [ ] **Step 2:** Run `npm run preview` and check every route at 360px and 1280px widths:
  - no horizontal scroll
  - rows wrap with long names
  - the neon appears on hover and tab focus, and flashes on tap (mobile emulation)
  - `/lodestra/invite#n=A%20really%20long%20trip%20name%20for%20the%20summer&by=Sam&r=writer` stays legible
  - the homepage compares well against mockup option A
  - Fix anything found, then rerun the tests.
- [ ] **Step 3:** Ask the owner before pushing. Then push `feat/design-system` with `-u origin feat/design-system` (the branch currently tracks `origin/main`) and open a PR to `main`, with screenshots in the description.
