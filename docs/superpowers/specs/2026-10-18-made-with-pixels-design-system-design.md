# Made With Pixels design system

Date: 2026-10-18
Site: apps.madewithpixels.xyz (this repo: Astro 5 + Tailwind v4, deployed to GitHub Pages)

## Intent

The site is the public face of Made With Pixels LLC, the owner's newly formed company that publishes small, useful mobile apps (Skip The Paywall, EzCamel, Clash of Cards: War, Lodestra). People mostly arrive from a Play Store listing or a Lodestra trip-invite link.

The owner wants visitors to come away thinking an **exciting young professional, hard at work building a mobile-app empire of useful tools**, made this. The aesthetic they're after is **cyberpunk / "digital empire."** The current purple→pink gradient was an attempt at that, but on stock Tailwind gray it reads as a generic template.

The approach: start from a public DESIGN.md that is close to what's wanted, then customize it into the site's own system. The owner chose **Raycast** as the base and **neon duo (magenta→cyan)** as the accent treatment from a mockup comparison.

## Goals

1. A `DESIGN.md` at the repo root that is this site's design system. It is derived from Raycast's, rewritten for Made With Pixels, and kept in the same format: YAML token frontmatter followed by markdown rationale (Google Labs `design.md` "alpha" format), so AI coding tools can follow it.
2. Those tokens implemented in Tailwind v4's `@theme` block in `src/styles/global.css`, so pages use semantic utilities (`bg-canvas`, `text-ink`, `border-hairline`, …) instead of stock grays and purples.
3. One shared layout and a small set of components, so every page gets the system without repeating markup.
4. A `/styleguide` page showing the tokens and components as a living reference.
5. Every existing page moved onto the system, plus the homepage cleanup below.
6. A `CLAUDE.md` at the repo root telling AI tools to follow `DESIGN.md` for UI work.

## Non-goals

- **Legal wording.** The body text of `/privacy-policy`, `/terms-of-service` and `/lodestra/privacy-policy` stays as written, including where it names "Dig Turtle & Filicode". Changing who the legal documents name is a separate legal decision the owner hasn't made. Only their presentation (layout, typography) changes. Their `<title>` and meta description also stay, since they mirror the document text.
- **Per-app brands.** App pages (e.g. `/lodestra`) wear the Made With Pixels neon for now. The owner may later derive per-app variants, so the accent must be easy to override (see Constraints), but no variants get built now.
- Deployment, domain, `CNAME`, `public/app-ads.txt`, `public/.well-known/assetlinks.json`. Untouched.
- New pages beyond `/styleguide`, a blog, analytics, socials.

## Anti-goals (failure even if it "works")

- **A Raycast clone.** The red-stripe hero, Raycast's white-on-black identity and its product screenshots must not survive. Color, the hero treatment and the voice have to read as Made With Pixels.
- **Neon everywhere.** The gradient should feel deliberate: roughly one gradient moment in the hero plus featured/hover states, and soft glows at the edges. Not on every heading, the way the current site does it.
- **Altered store badges.** Apple's and Google's badge guidelines forbid recoloring or modifying the badge artwork. Restyle placement, sizing and the "coming soon" treatment only.
- **Breaking the Lodestra invite flow** (details under Pages).

## The look (decided)

**Base, from Raycast.** Near-black canvas with a faint surface ladder for panels, hairline 1px borders, Inter with the `ss03` stylistic set (`"calt","kern","liga","ss03"`) site-wide, tight radii (6–10px on cards), generous section rhythm, and a white pill as the primary CTA. The source file is `design-md/raycast/DESIGN.md` in github.com/VoltAgent/awesome-design-md (MIT) at commit `e06a96660396d741d0c106c8972172254dafbdc2`. Use its color, typography, radius and spacing tokens as the starting values.

Raycast's key values for reference: canvas `#07080a`, surface `#0d0d0d`, elevated `#101111`, card `#121212`, hairline `#242728`. Text runs ink `#f4f4f6`, body `#cdcdcd`, mute `#9c9c9d`, ash `#6a6b6c`. Primary pill is `#ffffff` on `#000000`. Type scale runs display-xl 64/600 down to caption-sm 12/400. Radii: 4/6/8/10/16/full. Spacing: 2/4/8/12/16/24/32, section 96.

**Made With Pixels layer: neon duo.** This is what the owner approved in the mockup:
- Accent pair: magenta `#ff2fd6` → cyan `#22d3ee`.
- One gradient-text phrase in the hero headline.
- Soft radial glows (magenta top-right, cyan bottom-left, around 18–28% opacity) bleeding in at the page edges.
- App rows on hover and keyboard focus get a faint magenta wash, a gradient icon tile with a magenta glow, and a magenta arrow. This is **hover/focus only**: no row wears it permanently, and there is no `featured` flag. That's my call, to keep the neon to one always-on moment (the mockup showed it on the first row only to demonstrate the state).
- Everything else stays dark and calm.

**The empire feel.** Apps are shown as a **catalog list** (Raycast-store style). It has to look intentional with 4 apps and still work at 15. The mockup's "See all apps" pill is dropped, because there is no all-apps page.

**App rows (owner's decision: fewer clicks to the install flow).** Each row shows the icon tile, name, a one-line description, and **its own store badges**: Google Play and App Store. A badge is either live (it links to the store listing) or **coming soon** (grayed out, not a link, labeled "Coming soon" in a way that works without hover, since most visitors are on phones). The status is set **per store, per app**. Today:

| App | Google Play | App Store |
|---|---|---|
| Skip The Paywall | live | coming soon |
| EzCamel | live | coming soon |
| Clash of Cards: War | live | coming soon |
| Lodestra | coming soon | coming soon |

An app with its own page (only Lodestra today) also links its name to that page. The row itself is not one big link, because it contains the badge links. The hover/focus treatment applies to the row as a whole.

**Brand name:** "Made With Pixels" in the header/hero. Footer: "© 2026 Made With Pixels LLC". Shared footer links: Privacy Policy, Terms of Service. App pages may add their own links, e.g. Lodestra Privacy Policy.

## Constraints

- **Stack stays the same:** Astro 5, Tailwind v4 via `@tailwindcss/vite`, static output, GitHub Pages. No new runtime dependencies. Font loading via Google Fonts `<link>` or `@fontsource` is the builder's call.
- **Accent is two variables.** Every neon use (gradient text, glows, featured states, focus rings) derives from an accent-from/accent-to pair, so a future app page can override just those two values.
- **Accessibility:** body text meets WCAG AA contrast on its surface. Interactive elements have a visible focus style (accent ring). Gradient text is decorative and must still be legible. Respect `prefers-reduced-motion` for any motion.
- **Mobile-first:** most visitors arrive from a phone.

## Pages

| Route | What changes |
|---|---|
| `/` | New hero (brand name, headline with one gradient phrase, short subline). Catalog list of apps. **Remove** the "Join the Community" box, the dead social links and the Font Awesome stylesheet. **Keep** the grayed-out App Store badges, because iOS is planned. **Add Lodestra** to the list (my call, approved by the owner), coming soon on both stores because it isn't on Google Play yet. Badge states are as in the App rows table. |
| `/lodestra` | Moves onto the layout and components. Same copy. |
| `/lodestra/invite` | Moves onto the layout. Its Play badge stays a live link even though Lodestra isn't listed yet: the script rewrites it with an install referrer, and the page is only reached by invitees. The inline script must keep working unchanged. It relies on element ids `headline`, `detail`, `play` and `open`, the `hidden` attribute on `#open`, the `define:vars={{ playUrl }}` script, and `<meta name="robots" content="noindex">`. "Open in Lodestra" becomes a primary button. |
| `/privacy-policy`, `/terms-of-service`, `/lodestra/privacy-policy` | Calm long-form reading style (comfortable measure, body ladder, headings from the type scale). Wording unchanged. |
| `/styleguide` | New. Shows color tokens, type scale, radii/spacing, buttons, app row (default, hover/focus), store badges (live and coming soon) and focus states. `noindex`, not linked from the main nav. |

The `featuredApps` data currently has an `image` field pointing at `/images/*.png`, which doesn't exist in `public/`, so there are no app icons today. The row's icon tile needs a sensible treatment without real icons, and should be able to show a real icon later.

## Repo housekeeping

- Add `.superpowers/` to `.gitignore` (brainstorm mockups live there).
- Work happens on branch `feat/design-system` and lands via PR. The owner merges.

## Left to the builder

- Token names in `@theme`, and how faithfully to map Raycast's full scale versus trimming it to what the site uses.
- Component boundaries and file layout under `src/components/` and `src/layouts/`.
- Exact hero copy (keep it short, confident and momentum-flavored; "Useful apps, shipped fast." was mockup placeholder, not a decision).
- How the "Coming soon" badge state and the app-row icon placeholder look, within the anti-goals.
- How much of Raycast's prose in `DESIGN.md` to keep versus rewrite. Anything left must describe this site, not Raycast. Credit the source in the file.
- Whether to replace the README's Astro starter boilerplate (optional).
