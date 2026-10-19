# Unified privacy policy and per-app about pages

Date: 2026-10-18 · Branch: `feat/unified-privacy-about-pages` · Follows the design system (PR #2, `DESIGN.md`).

## Why

The site has two privacy policies that are each wrong for most readers. `/privacy-policy` says the apps collect nothing and vaguely mentions "third-party ad networks". `/lodestra/privacy-policy` covers only Lodestra and has a placeholder comment where ads will go. Every app shows ads, Lodestra will too before launch, and Lodestra uses the person's own Google Drive. Google's OAuth reviewers, Play reviewers and ordinary users all need one honest page where they can find their app and see exactly what applies to it.

Apps also have no page of their own, except Lodestra. Each app gets a short about page, reached by tapping its row on the home page.

## Goals

- One privacy policy at `/privacy-policy` covering every app. It is organised by **kind of data use**, and each section is marked with the apps it applies to.
- An about page for every app in the catalog, with a short description and that app's store badges.
- Home page rows become clickable (anywhere except a store badge) and open the app's about page. **Rows keep their store badges** (the user chose option A).
- `/lodestra/privacy-policy` keeps working as a redirect into the unified policy.

## Non-goals

- No changes to the Terms of Service.
- No PostHog integration in any app. This change only writes the policy text for it.
- No per-app accent colours (DESIGN.md's override stays unused).
- No screenshots, feature lists or extra content on about pages. A short description is the only content, by the user's choice.

## Anti-goals (fail even if it "works")

- **`/lodestra/invite` moves or changes in any way.** It must not be touched: same path, ids, script, `noindex` and behaviour.
- **`/lodestra/privacy-policy` 404s.** It's planned for the Google OAuth consent screen.
- **App links appear in the footer.** The footer stays exactly "© 2026 Made With Pixels, LLC" plus Privacy Policy and Terms of Service, identical on every page.
- **The policy claims something untrue.** This covers an app chip on a section that doesn't apply to it yet, or calling analytics "anonymous". PostHog uses a per-install ID, so the data is pseudonymous, and "anonymous" could contradict the Play Data Safety form.
- **Drive data is ever described as going to ads or analytics.** Google API Limited Use forbids it, and the policy must say it never happens.

## Constraints

- Follow `DESIGN.md` and `CLAUDE.md`: semantic token utilities only, reuse `Layout`, `LegalLayout`, `AppRow`, `StoreBadge`, and keep one gradient title per page. No new dependencies. Tests use `node:test` and `node:fs` only (`npm test` builds, then tests).
- Static site on GitHub Pages, so there are no server-side redirects.
- The site isn't released for Lodestra yet, so there are no upgrade or compat concerns beyond the two URLs above.

## Decided (by the user)

- **Data-use sections and who they apply to:**
  - **On your device:** all apps. No servers of ours. What you enter stays on the phone.
  - **Ads:** all four apps, Lodestra included, since it ships with ads before launch. The ads are Google AdMob (publisher `pub-6216655107273980` in `app-ads.txt`).
  - **Analytics (PostHog):** **Lodestra only** for now. EzCamel and Skip The Paywall may get it later. **Clash of Cards: War never does.** The section names PostHog.
  - **Google Drive:** Lodestra only. The person's own Drive, under their control.
- About page content is only a short description plus the store badges. The user's EzCamel description is: "It quickly helps users get from an amazon store listing to the camel camel camel page for the item."
- Each about page is reached by tapping the app's row, not a store badge. Badges stay on the rows.
- App links stay out of the footer.

## Design

### Data: `src/data/apps.ts` is the single source of truth

Extend `App` so each app carries everything its about page and the policy chips need:

- `slug`: the about page path. Today's `page?` field becomes required for every app.
- `about`: the short description paragraph for the about page.
- `dataUses`: a list from `'device' | 'ads' | 'analytics' | 'drive'`.

The policy's per-section app chips are **generated from `dataUses`**, and so is the "which sections apply" list on each about page. Adding PostHog to EzCamel later is then a one-line data change, and the two pages can't disagree. A short comment on `dataUses` says each entry must be true of the shipped app (or of the app at its first release, for an unreleased app) before it is added.

Values:

| App | path | dataUses |
|---|---|---|
| Skip The Paywall | `/skip-the-paywall` | device, ads |
| EzCamel | `/ezcamel` | device, ads |
| Clash of Cards: War | `/clash-of-cards-war` | device, ads |
| Lodestra | `/lodestra` | device, ads, analytics, drive |

About copy (Claude's drafts, apart from EzCamel's, which is based on the user's sentence; the user corrects these in review):

- **Skip The Paywall:** "Share a news article from your browser to Skip The Paywall and pick a public paywall-removal site to open it with. It's one tap from a locked article to a readable one."
- **EzCamel:** "EzCamel quickly gets you from an Amazon listing to the camelcamelcamel page for that item, so you can check its price history before you buy. Share the Amazon link to EzCamel and it opens the right page."
- **Clash of Cards: War:** "The classic card game of war, with a new twist. Flip, battle and see if you can take the whole deck."
- **Lodestra:** keep today's paragraph from `/lodestra` ("Keep flights, stays, reservations and plans…").

### About pages

- A shared component or layout (for example `src/layouts/AppLayout.astro`, the builder's call) renders one app. It mirrors today's `/lodestra` page: the eyebrow "An app by Made With Pixels", the app name as the page `h1` (display-lg), the one-line `description` as the tagline in mute, then a `surface` panel with the `about` paragraph and both `StoreBadge`s, with per-app `label`s as on the rows.
- Below the panel is an in-content link to the policy, for example "How {name} handles your data". Next to or under it are small chips (surface-card, hairline, `rounded-xs`, caption size), one per entry in `dataUses`. Each chip links to that section's anchor on `/privacy-policy`. The chips stay calm: no neon.
- The `h1` uses the gradient (`text-gradient-accent`), the page's one gradient title, to match the other pages. *Claude's call:* today's `/lodestra` `h1` is plain ink, and this brings app pages in line with "one gradient title per page".
- Pages: `src/pages/skip-the-paywall.astro`, `ezcamel.astro`, `clash-of-cards-war.astro`, and the existing `lodestra/index.astro`, rewritten to use the shared layout. Alternatively, one dynamic route with `getStaticPaths` over `apps`, as long as it doesn't capture `/lodestra/invite` or `/lodestra/privacy-policy`. The builder chooses. `/lodestra` must stay at `/lodestra`.
- Coming-soon handling comes free from `StoreBadge`. Drop the hard-coded "Coming soon to Google Play." line on `/lodestra`, since the badge label already says it.

### Home rows become clickable, keeping badges

- Every app now has a page, so every row's name is a link to it. Use the stretched-link pattern: the name `<a>` gets an `after:absolute after:inset-0` overlay on a `relative` row, so a tap anywhere on the row follows it. The badge group sits above the overlay (`relative z-10`) so badge taps still go to the store. The row stays a single tab stop for the page link, plus one tab stop per live badge.
- Keep the existing neon states (`hover:`, `has-[:focus-visible]:`, `active:`). The arrow `→` now honestly means "opens the about page". The always-on underline on the name stays.
- Update `DESIGN.md`'s AppRow section. The current text says "The row itself is not one big link"; it should describe the stretched link with badges layered above it.

### Unified privacy policy (`/privacy-policy`)

Still uses `LegalLayout` (gradient `h1`, `accent-bar` h2s, "Last updated: …" with the month: October 2026). Sections in order, each `h2` with a stable `id`:

1. **Overview:** who we are, that this covers every app, and how to read the chips.
2. **Contents:** a short jump list of the data-use sections, each with its apps.
3. `#on-device` **On your device.** Chips: all apps. Data you enter is stored on your device. We have no servers and never receive it. Uninstalling deletes it. Also include one sentence (the user's decision, "honesty is the best policy"): when you share a link to an app, it opens that link on the site you choose, and that site's own privacy policy applies. This covers Skip The Paywall and EzCamel. It is not a separate section and has no `dataUses` value.
4. `#ads` **Ads.** Chips: all four. The user confirmed that all four apps use Google AdMob and no other ad network, and that they show Google's EEA/UK consent prompt (Lodestra from its first release). Google AdMob may collect the advertising ID, device information, IP address and ad interaction data to show, measure and limit ads. Users in the EEA/UK see a consent prompt (Google UMP). Users can reset or delete the advertising ID in Android settings. Link to [how Google uses information from sites or apps that use its services](https://policies.google.com/technologies/partner-sites) and the Google Privacy Policy. Ads in Lodestra are never targeted using trip contents or Drive data. *Claude's call:* this is narrower than the old Lodestra comment about "contextual keywords from trip destinations". Limited Use forbids using Drive data for ads, and trips live in Drive, so the safe promise is no trip-based targeting. The builder flags it in the PR if the user disagrees.
5. `#analytics` **Analytics.** Chips: Lodestra. The app sends usage events (screens viewed, features used, crashes and errors, app version, device model and OS) to PostHog with a random per-install ID that is not tied to your name, email or Google account. Trip contents and Drive data are never sent. Link to PostHog's privacy policy. *Claude's call:* PostHog's region (EU or US) isn't decided, so the text says where PostHog stores data only generically. The PR description flags this as something to fill in when PostHog is set up.
6. `#google-drive` **Google Sign-In and Google Drive.** Chips: Lodestra. Carry over today's Lodestra policy content: the two scopes (`drive.appdata`, `drive.file`), data going directly between the device and Google, the Google API Services User Data Policy and Limited Use statement, **Sharing a Trip**, and deleting Drive data and revoking access. Lead with the user's framing: it's your own Drive, and you're in control of that data.
7. **What we don't do:** we don't sell data, we don't use Drive data for ads or analytics, and we don't send app content to servers of ours.
8. **Deleting your data:** uninstalling covers on-device data. Drive steps link to `#google-drive`. Covers resetting the advertising ID.
9. **Children's Privacy:** apps are not directed at children under 13. *Claude's call:* this replaces the old claim that "we don't collect any user data", which is no longer true with ads.
10. **Changes to This Policy** and **Contact Us**, with today's text and email. Keep the existing sentence "please contact us at <mailto link>." that `tests/legal.test.mjs` checks.

Chips on the policy are app names, generated from `apps.ts` `dataUses`. The "On your device" section can show a single "All apps" chip when every app has `device`. Each chip links to the app's about page. *Claude's call:* this makes them useful without being neon.

### `/lodestra/privacy-policy` redirect

Replace the page with a static redirect to `/privacy-policy#google-drive`. Astro's `redirects` config produces a meta-refresh page in static builds; a hand-written page is equally fine. Either way the page must have a meta refresh, a `rel="canonical"` to `/privacy-policy`, `noindex`, and a visible fallback link in case refresh is blocked. The fallback should still look like the site and carry the footer, so the "footer everywhere" test keeps passing; otherwise that test is adjusted deliberately. *Claude's call:* the PR description recommends registering `https://apps.madewithpixels.xyz/privacy-policy` itself on the OAuth consent screen, since Google's verifiers may not follow a meta refresh. The redirect stays regardless.

### Tests (`tests/*.test.mjs`)

Update the tests that encode the old structure and add coverage for the new one:

- **legal:** the `LEGAL` list drops `/lodestra/privacy-policy`. New test: it redirects to `/privacy-policy#google-drive`, has a canonical link to `/privacy-policy` and is `noindex`.
- **Policy:** every section `id` exists. The chips under each section exactly match the apps whose `dataUses` include it. Clash of Cards never appears under analytics. "anonymous" does not appear in the analytics section. PostHog and AdMob are named.
- **Home:** every row links its name to its about page. Badges stay on rows with per-app labels. The stretched-link overlay exists and the badge group sits above it.
- **About pages:** each exists, has the gradient `h1` with the app name, the about text, both badges, and links to each of its `dataUses` anchors.
- Replace the existing "lodestra page links its privacy policy" test with the generic about-page policy link.
- **Invite:** `tests/invite.test.mjs` must pass unchanged.
- Footer tests stay unchanged and must pass on every page, including the new ones.

## Left to the builder

- A shared layout versus a dynamic route for the about pages.
- Exact chip markup and wording of the policy link, within DESIGN.md.
- Final policy prose, within the facts above. Plain, short and specific.
- Whether to add an "App page" entry to `/styleguide`.

## Delivery

Superpowers plan, subagent-driven execution, then a PR to `main` that the user merges. The dev server (`npm run dev`, port 4321) runs throughout so the user can watch.
