# Unified Privacy Policy and App Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One privacy policy at `/privacy-policy`, with one section per kind of data use and app chips on each, plus an about page for every app. The home rows open those pages and keep their store badges.

**Architecture:** `src/data/apps.ts` becomes the single source of truth. Each app gets a `page` path, an `about` paragraph and a `dataUses` list. A shared `AppLayout.astro` renders the about pages. The policy and the about pages both draw their chips from `dataUses`, through one small `Chip.astro`. `/lodestra/privacy-policy` becomes a Layout-based meta-refresh page that points at `/privacy-policy#google-drive`.

**Tech Stack:** Astro 5, Tailwind v4, Node 22 `node:test` over built `dist/` HTML.

**Spec:** `docs/superpowers/specs/2026-10-18-unified-privacy-and-app-pages-design.md`. Read it before each task, and follow `DESIGN.md` and `CLAUDE.md`.

## Global Constraints

- No new dependencies. Tests use `node:test` plus `node:fs` and the helpers in `tests/helpers.mjs` (`readPage`, `allPages`).
- **`src/pages/lodestra/invite.astro` is not modified.** `git diff main -- src/pages/lodestra/invite.astro` must be empty, and `tests/invite.test.mjs` passes unchanged.
- `/lodestra/privacy-policy` must still build to `dist/lodestra/privacy-policy/index.html`, and it must redirect to `/privacy-policy#google-drive`.
- The footer stays exactly as it is: `© 2026 Made With Pixels, LLC` plus `/privacy-policy` and `/terms-of-service`, on every page. No app links in the footer.
- Use semantic token utilities only (`bg-surface`, `bg-surface-card`, `border-hairline`, `text-ink`, `text-body`, `text-mute`, `ring-accent`, `text-gradient-accent`). No stock palette and no hex values. Each page has exactly one gradient title.
- `dataUses` truth table, copied verbatim from the spec. Skip The Paywall, EzCamel and Clash of Cards: War get `device, ads`. Lodestra gets `device, ads, analytics, drive`. Clash of Cards never gets `analytics`.
- Section anchors: `on-device`, `ads`, `analytics`, `google-drive`.
- About page paths: `/skip-the-paywall`, `/ezcamel`, `/clash-of-cards-war`, `/lodestra`.
- The word "anonymous" never appears on the policy page.
- Work on branch `feat/unified-privacy-about-pages`. Commit per task. The owner merges the PR. The dev server (`npm run dev`, :4321) is already running for the owner, so don't start another one on that port.

## Review Focus

1. **Badge taps under the stretched link:** the row-wide overlay must not swallow badge taps. Store badges have to stay clickable above it, or every badge tap on the home page opens the about page instead of the store. Task 2's test pins `relative z-10` on the badge group, and Task 4 checks it by hand by clicking a badge.
2. **The fragment survives the redirect:** `/lodestra/privacy-policy` must land on the Drive section, not the top of the page. Task 3's test pins `url=/privacy-policy#google-drive` in the meta refresh and in the fallback link, and Task 4 opens it in a browser.
3. **Chips drift from the truth table:** a chip on the wrong section is a false privacy claim. Task 3's test checks every section's chips against the exact table above, and Task 1's test checks every about page's chips.
4. **Chips inherit the prose link styling:** LegalLayout's `[&_a]:underline` and `[&_a]:text-ink` win on specificity, so a chip inside the policy would look like a body link. Task 3 makes the chip classes important (Tailwind v4 `!` suffix) where they clash, and Task 4 checks by eye.
5. **Narrow phones:** at 360px, the chip rows and the about-page badges must wrap with no horizontal scroll. Task 4 checks this by hand at 360px.

---

### Task 1: App data, Chip component and about pages

**Files:**
- Modify: `src/data/apps.ts`
- Create: `src/components/Chip.astro`, `src/layouts/AppLayout.astro`, `src/pages/skip-the-paywall.astro`, `src/pages/ezcamel.astro`, `src/pages/clash-of-cards-war.astro`
- Modify: `src/pages/lodestra/index.astro` (rewrite it onto `AppLayout`)
- Create: `tests/about.test.mjs`
- Modify: `tests/home.test.mjs`. Delete the test `lodestra page links its privacy policy in the content, below the badges`; its replacement goes in `about.test.mjs`.

**Interfaces:**
- Produces, in `apps.ts`:
  - `export type DataUse = 'device' | 'ads' | 'analytics' | 'drive'`
  - `export const dataUseInfo: Record<DataUse, { anchor: string; label: string }>`, with values `device → on-device / "On your device"`, `ads → ads / "Ads"`, `analytics → analytics / "Analytics"`, `drive → google-drive / "Google Drive"`
  - `App` gains `page: string` (now required), `about: string` and `dataUses: DataUse[]`
  - `export function appsUsing(use: DataUse): App[]`, which returns apps in catalog order
  - A comment on `dataUses` saying each entry must be true of the shipped app, or of the app at its first release for an unreleased app, before it is added.
- Produces `Chip.astro`, with props `{ label: string; href?: string }`. It renders `<a data-chip href>` when `href` is given and `<span data-chip>` otherwise. Styling: `rounded-xs border border-hairline bg-surface-card px-2 py-0.5 text-xs leading-[1.5] text-body`, plus `ring-accent` and `hover:text-ink` on links. No neon.
- Produces `AppLayout.astro`, with props `{ app: App }`.

- [ ] **Step 1: Write the failing test `tests/about.test.mjs`**

```js
const PAGES = {
  'Skip The Paywall': { path: '/skip-the-paywall', uses: ['on-device', 'ads'] },
  EzCamel: { path: '/ezcamel', uses: ['on-device', 'ads'] },
  'Clash of Cards: War': { path: '/clash-of-cards-war', uses: ['on-device', 'ads'] },
  Lodestra: { path: '/lodestra', uses: ['on-device', 'ads', 'analytics', 'google-drive'] },
};
// for each [name, {path, uses}]:
test(`${name} about page`, () => {
  // main = <main>…</main> of readPage(path)
  // h1 class includes text-gradient-accent; h1 text (tags stripped, &amp; decoded) === name
  // exactly one text-gradient-accent element inside <main>
  // main contains the eyebrow "An app by Made With Pixels"
  // main contains a link to /privacy-policy whose text includes `How ${name} handles your data`
  // data-chip hrefs in main, in order, deepEqual uses.map(a => `/privacy-policy#${a}`)
  // two StoreBadge renders (live <a aria-label="Get NAME on Google Play"> or data-coming-soon), matching apps.ts store status
});
test('EzCamel about text', () => assert.match(readPage('/ezcamel'), /camelcamelcamel page for that item/));
test('lodestra keeps its description and drops the hard-coded coming-soon line', () => {
  // includes 'Keep flights, stays, reservations and plans'; does not include 'Coming soon to Google Play.'
});
```

- [ ] **Step 2: Run `npm test` and confirm that `about.test.mjs` fails, because the new pages don't exist yet**

- [ ] **Step 3: Implement the data change, `Chip`, `AppLayout` and the four pages**

  **Data.** Set `page` and `dataUses` from Global Constraints. The `about` copy is verbatim from the spec's "About copy" list. Lodestra's `about` is today's paragraph on `/lodestra`.

  **AppLayout markup.** Mirror today's `/lodestra` page, with these changes:
  - The `h1` wears `text-gradient-accent`.
  - The description becomes the tagline.
  - The `surface` panel holds the `about` text and two `StoreBadge`s, with the same `label`s as AppRow.
  - Below the panel goes an in-content link, "How {name} handles your data", to `/privacy-policy`, styled like today's Lodestra policy link.
  - Under that goes a `flex flex-wrap gap-2` row with one `Chip` per `dataUses` entry: `label` is `dataUseInfo[use].label` and `href` is `/privacy-policy#${anchor}`.

  **Page titles.** Use `{name} - {description}` style titles (today's Lodestra title is "Lodestra - Trip Organizer", so keep that one), with `description` as the meta description.

  **Pages.** Each page is a three-line file: find the app in `apps` and render `<AppLayout app={…} />`.

- [ ] **Step 4: Run `npm test`. Expect every test to pass, including `invite.test.mjs` (its "What's Lodestra?" link still points at `/lodestra`).**

- [ ] **Step 5: Commit** with `feat: about page for every app, driven by apps.ts`

---

### Task 2: Home rows open the about page and keep their badges

**Files:**
- Modify: `src/components/AppRow.astro`, `DESIGN.md` (AppRow section, plus the `app-row` component note if needed), `tests/home.test.mjs`

**Interfaces:**
- Consumes `App.page` (now always set) from Task 1.

- [ ] **Step 1: Write the failing tests in `tests/home.test.mjs`**

```js
const PATHS = { 'Skip The Paywall': '/skip-the-paywall', EzCamel: '/ezcamel', 'Clash of Cards: War': '/clash-of-cards-war', Lodestra: '/lodestra' };
test('every row links its name to its about page with a stretched link', () => {
  // for each row: the <a href=PATHS[name]> exists; its class includes 'after:absolute' and 'after:inset-0'; it is still underlined ('underline')
  // the <li> class includes 'relative'
});
test('badges sit above the stretched link', () => {
  // for each row: the badge wrapper (the element that contains the StoreBadges) has class tokens 'relative' and 'z-10'
});
```

  Generalise `rows with a page show a persistent link cue` to every row, and keep `live badge links name their app` unchanged.

- [ ] **Step 2: Run `npm test` and confirm that the new tests fail**

- [ ] **Step 3: Update `AppRow.astro`**
  - Drop the `app.page ?` branch, since the name is always a link.
  - Add `relative` to the `<li>`.
  - Add `after:absolute after:inset-0 after:content-['']` to the name link. Keep its own `ring-accent`, so the row's `has-[:focus-visible]` neon still triggers from it.
  - Add `relative z-10` to the badge `div`.
  - Keep the neon classes as they are.

- [ ] **Step 4: Update `DESIGN.md` AppRow**
  - Replace "The row itself is not one big link, since it contains badge links." with a description of the stretched-link pattern: the name link's `::after` covers the row, so a tap anywhere opens the app's page, and the badge group sits above it (`relative z-10`) so badge taps go to the store.
  - State that every app has an about page.
  - Add a short "AppLayout" entry under Components describing the about page.

- [ ] **Step 5: Run `npm test` and confirm that everything passes, including `design-md.test.mjs`**

- [ ] **Step 6: Commit** with `feat: app rows open the app's about page`

---

### Task 3: Unified privacy policy and the Lodestra redirect

**Files:**
- Modify: `src/pages/privacy-policy.astro` (full rewrite), `src/pages/lodestra/privacy-policy.astro` (becomes the redirect), `src/layouts/Layout.astro` (add `<slot name="head" />` at the end of `<head>`), `src/components/Chip.astro` (only if the prose-style override needs it), `tests/legal.test.mjs`
- Create: `tests/policy.test.mjs`

**Interfaces:**
- Consumes `apps`, `appsUsing`, `dataUseInfo` and `Chip` from Task 1.
- Produces Layout's named slot `head`.

- [ ] **Step 1: Write the failing tests**

  **`tests/policy.test.mjs`** checks `/privacy-policy`:

```js
const EXPECT = {
  'on-device': ['All apps'],
  ads: ['Skip The Paywall', 'EzCamel', 'Clash of Cards: War', 'Lodestra'],
  analytics: ['Lodestra'],
  'google-drive': ['Lodestra'],
};
// section(id) = html from `<h2 id="${id}"` up to the next `<h2` (or </article>)
test('each data-use section lists exactly the apps it applies to', () => {
  // for each id: data-chip texts (tags stripped, &amp; decoded) in section(id) deepEqual EXPECT[id]
});
test('app chips link to the app pages', () => { /* in ads section: chip hrefs deepEqual the four about paths in catalog order */ });
test('names the processors', () => { /* section('ads') includes 'AdMob'; section('analytics') includes 'PostHog' */ });
test('never calls analytics anonymous', () => assert.doesNotMatch(html, /anonymous/i));
test('drive section keeps the Google API commitments', () => {
  // section('google-drive') includes 'drive.appdata', 'drive.file', 'Limited Use', 'api-services-user-data-policy', 'Sharing a Trip'
});
test('shared links open on the site you choose', () => { /* section('on-device') matches /site you choose/ and /privacy policy applies/ */ });
test('contents list links each data-use section', () => { /* hrefs '#on-device','#ads','#analytics','#google-drive' all present before the first <h2 id= */ });
test('one gradient title', () => { /* exactly one text-gradient-accent inside <main> */ });
```

  **`tests/legal.test.mjs`** changes:
  - `LEGAL` becomes `['/privacy-policy', '/terms-of-service']`.
  - `updated date` asserts `Last updated: October 2026` for `/privacy-policy` and `Last updated: 2026` for `/terms-of-service`.
  - Add:

```js
test('lodestra privacy policy redirects to the Drive section', () => {
  const html = readPage('/lodestra/privacy-policy');
  assert.match(html, /<meta http-equiv="refresh" content="0;\s*url=\/privacy-policy#google-drive"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/apps\.madewithpixels\.xyz\/privacy-policy"/);
  assert.match(html, /<meta name="robots" content="noindex"/);
  assert.match(html, /<a\b[^>]*href="\/privacy-policy#google-drive"/);
});
```

  The `footer everywhere` and `footer links` tests stay unchanged and must cover the redirect page too.

- [ ] **Step 2: Run `npm test` and confirm that the new and changed tests fail**

- [ ] **Step 3: Add the head slot, then build the redirect page**
  - In `Layout.astro`, add `<slot name="head" />` as the last child of `<head>`.
  - `lodestra/privacy-policy.astro` uses `Layout` with `noindex` and the title `Privacy Policy - Made With Pixels, LLC`.
  - Put the meta refresh and canonical in `slot="head"`.
  - The body is a short centred line, "Lodestra's privacy policy is now part of our [Privacy Policy]," linking to `/privacy-policy#google-drive`.

- [ ] **Step 4: Rewrite `privacy-policy.astro`**
  - Follow the spec's section list 1–10 in order, with its facts, using `LegalLayout`, `heading="Privacy Policy"` and `updated="October 2026"`.
  - The four data-use `h2`s carry the ids above.
  - Right under each of those `h2`s goes a `flex flex-wrap gap-2` chip row: `appsUsing(use)` mapped to `<Chip label={app.name} href={app.page} />`. When `appsUsing(use).length === apps.length`, use a single `<Chip label="All apps" />` instead.
  - The contents list (section 2) shows each section's label with its app names in mute text, linking `#anchor`.
  - Carry the Drive and sharing prose over from the current `src/pages/lodestra/privacy-policy.astro`. Read it before overwriting it in Step 3, or copy it first.
  - Links:
    - Google's partner-sites page: `https://policies.google.com/technologies/partner-sites`
    - Google Privacy Policy: `https://policies.google.com/privacy`
    - PostHog privacy: `https://posthog.com/privacy`
    - Revoke access: `https://myaccount.google.com/permissions`
  - Keep the Contact sentence "please contact us at <a href="mailto:brillianceanimationstudios@gmail.com">…</a>." exactly, for the existing test.
  - **Chip styling inside prose.** If LegalLayout's `[&_a]` styles override the chips, give `Chip`'s link classes the `!` suffix (`no-underline!`, `text-body!`) rather than touching LegalLayout.

- [ ] **Step 5: Run `npm test` and confirm that everything passes**

- [ ] **Step 6: Commit** with `feat: one privacy policy for every app; lodestra policy redirects`

---

### Task 4: Hand check and PR

**Files:** none, unless the checks find something.

- [ ] **Step 1: Run `npm test` and confirm that everything passes. Also run `git diff main -- src/pages/lodestra/invite.astro` and confirm the output is empty.**

- [ ] **Step 2: Check by hand on the running dev server (http://localhost:4321), at a 360px and a desktop width**
  - Tapping a row's text or tile opens its about page. Tapping a live Play badge opens Play. No horizontal scroll at 360px.
  - Every about page: the gradient title, the badges and the chips wrap cleanly, and every chip lands on its section.
  - `/privacy-policy`: the chips look like calm chips, not underlined body links. The contents links jump to their sections.
  - `/lodestra/privacy-policy` lands on `/privacy-policy#google-drive` with the Drive heading in view.
  - `/lodestra/invite` looks and behaves exactly as before.

- [ ] **Step 3: Open the PR to `main`** (the owner merges it). The PR body summarises the change and flags:
  - The PostHog data region, to fill in once PostHog is set up.
  - The suggestion to register `https://apps.madewithpixels.xyz/privacy-policy` directly on the OAuth consent screen.
  - That the about copy for Skip The Paywall and Clash of Cards is Claude's draft.
  - The "no trip-based ad targeting" promise.
