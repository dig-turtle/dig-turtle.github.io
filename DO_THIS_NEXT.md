# Do this next

Open items after the unified privacy policy and per-app about pages (PR #3, merged 2026-10-18).

## Before Google OAuth verification (Lodestra)

- [ ] Register `https://apps.madewithpixels.xyz/privacy-policy` directly as the privacy policy URL on the OAuth consent screen. `/lodestra/privacy-policy` still redirects there (meta refresh to `#google-drive`), but Google's checks may not follow a redirect.
- [ ] Confirm what Google profile data Lodestra's sign-in reads (name, email, display name used in invites) and disclose it in the `#google-drive` section of `src/pages/privacy-policy.astro`.

## When PostHog is set up (Lodestra first)

- [ ] Fill in PostHog's data region (EU or US) in the Analytics section of `src/pages/privacy-policy.astro`.
- [ ] Decide on IP capture: turn on "discard client IP" in the PostHog project, or add IP address to the Analytics list in the policy.
- [ ] If EzCamel or Skip The Paywall add PostHog, add `'analytics'` to that app's `dataUses` in `src/data/apps.ts` only once it ships. That one change updates the policy chips and the about page. Also update the expected chips in `tests/policy.test.mjs` and `tests/about.test.mjs`. Clash of Cards: War never gets analytics.

## Content to check

- [ ] Review the about copy for Skip The Paywall and Clash of Cards: War in `src/data/apps.ts`. Both were drafted by Claude; EzCamel's is expanded from the owner's sentence.
- [ ] Confirm the Ads promise that Lodestra ads are never targeted using trip contents or Drive data.
- [ ] Optional: restore a longer meta description for `/lodestra`. It's currently the tagline; `AppLayout` uses `app.description`.

## Nice to have

- [ ] The "badges sit above the stretched link" test in `tests/home.test.mjs` uses a regex tied to the `StoreBadge` markup, so it's brittle. Make it sturdier if `StoreBadge` changes.
- [ ] The `/lodestra/privacy-policy` redirect page has no `h1`. It's minor, since the page refreshes immediately.

## Never

- Never move `/lodestra/invite`. The Android app opens it directly.
- Never put app links in the footer.
