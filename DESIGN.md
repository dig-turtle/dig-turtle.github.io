---
version: alpha
name: Made-With-Pixels
description: |
  The design system for apps.madewithpixels.xyz, the catalog of small, useful mobile apps published by Made With Pixels, LLC. A near-black canvas with a faint surface ladder, hairline borders, Inter with the ss03 stylistic set, tight radii and a white pill CTA, lit by one neon duo (magenta to cyan). The neon is deliberate and rare: one gradient phrase in the hero, soft glows bleeding in at the page edges, and app rows that light up on hover, focus and tap. Everything else stays dark and calm. The feel is a young studio hard at work on a growing empire of useful tools.

colors:
  canvas: "#07080a"
  surface: "#0d0d0d"
  surface-elevated: "#101111"
  surface-card: "#121212"
  hairline: "#242728"
  ink: "#f4f4f6"
  body: "#cdcdcd"
  mute: "#9c9c9d"
  ash: "#6a6b6c"
  primary: "#ffffff"
  on-primary: "#000000"
  accent-from: "#ff2fd6"
  accent-to: "#22d3ee"

typography:
  display-xl:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0
    fontFeature: '"calt", "kern", "liga", "ss03"'
  display-lg:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.17
    letterSpacing: 0.2px
    fontFeature: '"calt", "kern", "liga", "ss03"'
  heading-xl:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.2px
    fontFeature: '"calt", "kern", "liga", "ss03"'
  heading-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2px
    fontFeature: '"calt", "kern", "liga", "ss03"'
  heading-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2px
    fontFeature: '"calt", "kern", "liga", "ss03"'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
    fontFeature: '"calt", "kern", "liga", "ss03"'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
    fontFeature: '"calt", "kern", "liga", "ss03"'
  body-strong:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2px
    fontFeature: '"calt", "kern", "liga", "ss03"'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
    fontFeature: '"calt", "kern", "liga", "ss03"'
  caption-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.4px
    fontFeature: '"calt", "kern", "liga", "ss03"'
  button-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.2px
    fontFeature: '"calt", "kern", "liga", "ss03"'
  eyebrow:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.12em

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 16px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 16px
    height: 40px
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    border: 1px solid {colors.hairline}
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 16px
    height: 40px
  app-list:
    backgroundColor: "{colors.surface}"
    border: 1px solid {colors.hairline}
    rounded: "{rounded.lg}"
  app-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 12px 16px
    divider: 1px solid {colors.hairline}
  app-row-neon:
    backgroundColor: "color-mix(in srgb, {colors.accent-from} 6%, transparent)"
    arrowColor: "{colors.accent-from}"
  app-icon-tile:
    backgroundColor: "{colors.surface-card}"
    border: 1px solid {colors.hairline}
    textColor: "{colors.mute}"
    rounded: "{rounded.md}"
    size: 48px
  app-icon-tile-neon:
    backgroundImage: "linear-gradient(135deg, {colors.accent-from}, {colors.accent-to})"
    textColor: "{colors.on-primary}"
    shadow: "0 0 14px color-mix(in srgb, {colors.accent-from} 50%, transparent)"
  store-badge:
    height: 40px
  store-badge-coming-soon:
    opacity: 0.5
    labelColor: "{colors.mute}"
    labelTypography: "{typography.caption-sm}"
  focus-ring:
    outline: 2px solid {colors.accent-from}
    outlineOffset: 2px
  site-header:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    height: 56px
  site-footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.mute}"
    typography: "{typography.body-sm}"
    border: 1px solid {colors.hairline}
  legal-prose:
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    maxWidth: 65ch
---

Derived from Raycast's DESIGN.md (VoltAgent/awesome-design-md, `design-md/raycast/DESIGN.md` @ `e06a96660396d741d0c106c8972172254dafbdc2`, MIT), rewritten for Made With Pixels.

## Overview

apps.madewithpixels.xyz is the public face of Made With Pixels, LLC, a company that ships small, useful mobile apps. Most visitors arrive on a phone, from a Play Store listing or a Lodestra trip invite. They should leave thinking an exciting young professional is hard at work building an empire of useful tools.

The base is dark and quiet: a near-black `{colors.canvas}` with a faint surface ladder, 1px `{colors.hairline}` borders, Inter with `ss03`, tight radii and a white pill for the one primary action. The Made With Pixels layer is the **neon duo**, magenta `{colors.accent-from}` to cyan `{colors.accent-to}`. The duo is the brand, so it stays scarce.

**Key characteristics:**
- One dark mode. No light variant.
- One gradient-text phrase in the hero headline, and nowhere else as an always-on effect.
- Soft radial glows (magenta top-right, cyan bottom-left) bleeding in at the page edges.
- Apps shown as a **catalog list**: it looks intentional at 4 apps and still works at 15.
- App rows light up on hover, keyboard focus and tap. No row is lit permanently.
- Official store badges, unaltered, per store and per app; "Coming soon" badges are dimmed and labeled.

## Colors

All colors are Tailwind v4 theme tokens in `src/styles/global.css` (`@theme`). Use the semantic utilities (`bg-canvas`, `bg-surface`, `text-ink`, `text-body`, `text-mute`, `border-hairline`), never Tailwind's stock palette (`gray-*`, `purple-*`, `pink-*`).

### Surface
- **Canvas** (`{colors.canvas}`, `#07080a`): the page background everywhere.
- **Surface** (`{colors.surface}`, `#0d0d0d`): the app list and other panels.
- **Surface Elevated** (`{colors.surface-elevated}`, `#101111`): a panel inside a panel.
- **Surface Card** (`{colors.surface-card}`, `#121212`): icon tiles and small chips.
- **Hairline** (`{colors.hairline}`, `#242728`): every 1px border and row divider.

### Text
- **Ink** (`{colors.ink}`, `#f4f4f6`): headings, app names, the brand.
- **Body** (`{colors.body}`, `#cdcdcd`): paragraphs and default text.
- **Mute** (`{colors.mute}`, `#9c9c9d`): descriptions, metadata, footer links, the "Coming soon" label. Still AA on every surface.
- **Ash** (`{colors.ash}`, `#6a6b6c`): decorative glyphs or text at 18px and up only. Never body text: it fails AA at small sizes.

### Action
- **Primary** (`{colors.primary}`, `#ffffff`) with **On Primary** (`{colors.on-primary}`, `#000000`): the white pill. At most one per screen.

### Neon duo
- **Accent From** (`{colors.accent-from}`, `#ff2fd6`, magenta) and **Accent To** (`{colors.accent-to}`, `#22d3ee`, cyan).
- Every neon use derives from these two variables: gradient text, glows, the lit row, the icon-tile gradient and the focus ring. Never hard-code the hex values or use another accent.
- Where neon may appear: the one hero gradient phrase, the edge glows, the lit state of app rows, and focus rings. Nowhere else.

**Per-app accent override.** A future app page can wear its own duo by setting the two variables on a wrapper. Everything inside follows:

```html
<div style="--color-accent-from: #ffb020; --color-accent-to: #ff5a36">…</div>
```

App pages wear the Made With Pixels duo today; no variants exist yet.

## Typography

**Inter** for everything, with `font-feature-settings: "calt", "kern", "liga", "ss03"` set on `body` (the `ss03` alternates are part of the look). **JetBrains Mono** only for the small uppercase eyebrow (`{typography.eyebrow}`).

| Token | Size | Weight | Line height | Use |
|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 600 | 1.1 | Hero headline (the gradient phrase lives here) |
| `{typography.display-lg}` | 56px | 500 | 1.17 | App page title |
| `{typography.heading-xl}` | 24px | 500 | 1.6 | Section heading, legal H2 |
| `{typography.heading-md}` | 20px | 500 | 1.4 | Sub-section, legal H3 |
| `{typography.heading-sm}` | 18px | 500 | 1.4 | App name in a row |
| `{typography.body-lg}` | 18px | 400 | 1.6 | Hero subline |
| `{typography.body-md}` | 16px | 400 | 1.6 | Default body, legal prose |
| `{typography.body-strong}` | 16px | 500 | 1.4 | Header brand, emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.6 | Row description, footer |
| `{typography.caption-sm}` | 12px | 400 | 1.5 | "Coming soon" label, "Last updated" |
| `{typography.button-md}` | 14px | 500 | 1.6 | Button labels |

Hero copy is short, confident and momentum-flavored. Headings use the scale; don't invent sizes.

## Layout

- **Spacing:** Tailwind's default 4px scale (`p-2` = 8px, `gap-3` = 12px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px). Sections sit `{spacing.section}` (96px, `py-24`) apart on desktop, 64px on tablet, 48px on phones.
- **Container:** single centered column. The catalog and hero sit around `max-w-3xl`; legal pages use a ~65ch reading measure (`max-w-prose`).
- **Mobile first:** design the phone layout first, then widen. Everything is one column on phones.
- **Whitespace:** the dark canvas runs edge to edge with no decorative dividers between sections. The glows are the only decoration.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 | Flat on `{colors.canvas}` | Hero, footer, prose |
| 1 | 1px `{colors.hairline}` border on `{colors.surface}` | App list, panels |
| 2 | One notch up the surface ladder | Panel inside a panel, icon tiles |

No drop shadows on cards. The only glow-shadows are neon: the lit icon tile's magenta glow and the page-edge glows (`glow-from`, `glow-to` utilities: radial gradients at ~24% and ~20% of the accent). Glows are absolutely positioned, `pointer-events: none`, `aria-hidden`, and sit behind content.

## Shapes

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips |
| `{rounded.sm}` | 6px | Inline controls |
| `{rounded.md}` | 8px | App icon tile |
| `{rounded.lg}` | 10px | App list, panels |
| `{rounded.xl}` | 16px | Large feature panel |
| `{rounded.full}` | 9999px | Buttons (pills) |

Corners stay between 4 and 16px except for pills. In Tailwind: `rounded-xs` through `rounded-xl`, `rounded-full`.

## Components

Components live in `src/components/` and `src/layouts/`. Reuse them; don't re-create their markup on a page.

### Layout
The shared page shell. Header with the brand **"Made With Pixels"** in `{colors.ink}` (links home). The two edge glows (`glow-from` top-right, `glow-to` bottom-left). Footer on a `{colors.hairline}` top rule reading exactly **"© 2026 Made With Pixels, LLC"**, with Privacy Policy and Terms of Service links; app pages may add their own links (e.g. Lodestra Privacy Policy).

### Button
- **Primary:** white pill (`bg-primary text-on-primary rounded-full`), `{typography.button-md}`, ~40px tall. One per screen.
- **Secondary:** transparent pill with a `{colors.hairline}` border and `{colors.ink}` text.
- Both use `ring-accent` for the focus-visible ring.

### AppRow
One app in the catalog list. Rows stack inside an `app-list` panel (`bg-surface border border-hairline rounded-lg`), separated by hairline dividers.
- **Contents:** icon tile, app name (`{colors.ink}`), one-line description (`{colors.mute}`), and the app's own store badges. An app with its own page links its name there. The row itself is not one big link, since it contains badge links.
- **Icon tile:** 48px, `{rounded.md}`, `{colors.surface-card}` with a hairline border. Without a real icon it shows the app's first letter in `{colors.mute}`; a real icon image fills the tile when one exists.
- **Neon state:** on `hover`, `:focus-within` and `:active` (tap), the row gets a faint magenta wash (accent-from at ~6%), the icon tile turns into the accent gradient with a magenta glow, and the arrow turns `{colors.accent-from}`. Tap must visibly flash even when it navigates away. Use Tailwind's `hover:` (it is gated to hover-capable devices), `focus-within:` and `active:`.
- **Never permanent.** No row is lit by default, and there is no `featured` flag.
- Transitions are short (~150ms) and disappear under `prefers-reduced-motion: reduce`.

### StoreBadge
One store (Google Play or App Store) for one app. Status is set per store, per app.
- **Live:** the official, unaltered badge image (same URLs the site uses today), ~40px tall, wrapped in a link to the store listing, with `ring-accent` focus.
- **Coming soon:** the same official image dimmed (`opacity-50`), **not a link**, with a visible "Coming soon" label in `{typography.caption-sm}` `{colors.mute}` beside or under it. The label shows without hover, since most visitors are on phones.
- Only placement, size and the coming-soon dimming may change. Never recolor, crop, filter or redraw the artwork.

### LegalLayout
Long-form reading for policies and terms: the Layout shell, a ~65ch measure (`max-w-prose`), `{typography.body-md}` in `{colors.body}`, headings from the scale in `{colors.ink}`, links in `{colors.ink}` with an underline, "Last updated" in `{colors.mute}`. Calm: no gradient text, no lit states.

### Focus
Every interactive element shows a visible focus ring from the accent (`ring-accent`: 2px `{colors.accent-from}` outline, 2px offset, soft magenta halo).

## Do's and Don'ts

### Do
- Follow this file for all UI, and use the semantic token utilities.
- Keep the neon to one always-on moment (the hero phrase) plus glows, lit rows and focus rings.
- Derive every neon use from `--color-accent-from` and `--color-accent-to`.
- Light app rows on hover, focus-within and tap, so phone visitors see the neon too.
- Show each store's status per app, with a visible "Coming soon" label.
- Build depth from the surface ladder and hairlines.
- Check body text meets WCAG AA (4.5:1) on its surface.
- Respect `prefers-reduced-motion: reduce`: no transitions or animation.

### Don't
- **Don't clone the source system.** No striped hero banners, no product screenshots as decoration, no borrowed brand or voice. Color, hero and copy read as Made With Pixels.
- **Don't put neon everywhere.** No gradient on every heading, no accent-colored body text, no permanently lit or "featured" row.
- **Don't alter store badges.** No recoloring, filters, borders drawn over the artwork or custom badge art. Coming-soon badges are not links.
- **Don't break the Lodestra invite flow.** `/lodestra/invite` keeps its ids (`headline`, `detail`, `play`, `open`), the `hidden` attribute on `#open`, its `define:vars` script and its `noindex` meta. Its Play badge stays a live link.
- Don't use Tailwind's stock grays or purples, or hard-code hex colors in pages.
- Don't use `{colors.ash}` for body text.
- Don't add a light mode or drop shadows on cards.
- Don't add a second primary button color: white is the action.

## Responsive Behavior

| Name | Width | Key changes |
|---|---|---|
| mobile | < 640px | Default. One column; hero headline ~36–40px; badges wrap under the row text; section padding 48px |
| sm | 640px | Hero headline ~44px; badges can sit beside the row text |
| md | 768px | Section padding 64px |
| lg | 1024px | Hero headline at `{typography.display-xl}` 64px; section padding 96px |

- **Touch targets:** buttons and badge links are at least 40px tall; rows have comfortable 12–16px padding.
- **Tap feedback:** the `:active` neon flash is the phone equivalent of hover. Don't rely on hover for any information.
- **Glows** scale down on phones and never cause horizontal scroll (clip them with `overflow-hidden` on the shell).
