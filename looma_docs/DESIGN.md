---
version: alpha
name: Looma-design-system
description: >-
  **Source of truth:** marketing landing implemented in `apps/web/features/marketing/components/*`
  (composed from `apps/web/app/page.tsx`). Editorial, light-band marketing shell on a near-white
  canvas with true-black CTAs, warm stone body copy, and Newsreader display headlines—Geist Sans for
  UI/body and Geist Mono for code. Root `app/layout.tsx` loads fonts; `app/globals.css` defines the
  dark app chrome outside `<main>`—the landing overrides the main column to light `{colors.canvas}`.

# Implemented palette (Tailwind arbitrary hex on landing). Prefer these names when centralizing.

colors:
  canvas: "#FDFCFC"
  surface-muted: "#F5F3F1"
  surface-card: "#ffffff"
  ink: "#000000"
  primary: "#000000"
  primary-hover: "rgba(0,0,0,0.85)"
  body: "#44403C"
  muted: "#57534E"
  muted-softer: "#78716C"
  label-strong: "#1C1917"
  border: "#E0DFDD"
  border-soft: "#E9E6E2"
  technical-line: "#E8E8E6"
  code-default: "#292524"
  syntax-keyword: "#F05252"
  syntax-string: "#315BA8"
  demo-chrome: "#000000"
  demo-chrome-muted: "rgba(255,255,255,0.6)"
  demo-pre-bg: "rgba(255,255,255,0.08)"
  demo-pre-text: "#E0DFDD"
  recording-dot: "#F41A2F"
  on-primary: "#ffffff"
  semantic-error: "#dc2626"
  semantic-success: "#16a34a"

typography:
  # Loaded in app/layout.tsx: Newsreader (display), Geist (sans), Geist Mono (mono).
  # Sizes below mirror responsive utilities on hero + demo sections (see landing-hero-section.tsx).
  display-hero:
    fontFamily: "var(--font-newsreader), ui-serif, Georgia, serif"
    fontSize: "clamp(2.75rem, 2.5rem + 1vw, 3.5rem)"
    fontWeight: 400
    lineHeight: "1.05–1.08"
    letterSpacing: "-0.02em"
  display-section:
    fontFamily: "var(--font-newsreader), ui-serif, Georgia, serif"
    fontSize: "clamp(2.75rem, 2.5rem + 1vw, 3.5rem)"
    fontWeight: 400
    lineHeight: "1.05–1.08"
    letterSpacing: "-0.02em"
  display-card-title:
    fontFamily: "var(--font-newsreader), ui-serif, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  eyebrow:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "default"
  body-lead:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "default"
  body-md:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "default"
  nav-link:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "default"
  wordmark:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  button-md:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "default"
  button-lg:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "default"
  code-block:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "1.85–1.9"
    letterSpacing: "default"

rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  xl-plus: 14px
  hero-frame: 18px
  card-2xl: 16px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  base: 16px
  md: 20px
  lg: 24px
  xl: 32px
  xxl: 48px
  section-tight: 48px
  section: 64px
  section-loose: 80px

layout:
  container-max: "1280px"
  container-padding-x: "16px / 24px / 32px (sm:px-6 lg:px-8)"
  header-height: 72px

shadows:
  hero-showcase: "0 18px 60px rgb(0 0 0 / 0.05)"
  card-soft: "0 12px 28px rgb(0 0 0 / 0.06)"
  card-softer: "0 2px 12px rgb(0 0 0 / 0.05)"
  outline-cta: "0 1px 8px rgb(0 0 0 / 0.06)"
  outline-cta-strong: "0 2px 10px rgb(0 0 0 / 0.05)"

components:
  landing-main:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    backdropBlur: true
    textColor: "{colors.muted}"
    height: "{layout.header-height}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    heights: "36px (header), 56px (hero/section CTAs)"
  button-outline:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    borderColor: "{colors.border}"
    rounded: "{rounded.pill}"
  hero-replay-frame:
    borderColor: "{colors.border}"
    backgroundColor: "{colors.surface-muted}"
    rounded: "{rounded.hero-frame}"
    shadow: "{shadows.hero-showcase}"
  workflow-code-panel:
    backgroundColor: "{colors.surface-card}"
    borderColor: "{colors.border}"
    rounded: "{rounded.card-2xl}"
    shadow: "{shadows.card-softer}"
  demo-session-preview:
    backgroundColor: "{colors.demo-chrome}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  technical-crosshair-frame:
    lineColor: "{colors.technical-line}"
---

## Overview

**Looma** marketing (`LandingPage` → `apps/web/app/page.tsx`) uses a **light editorial band**: canvas `{colors.canvas}` (#FDFCFC), near-black ink for display and CTAs (`{colors.ink}` / `{colors.primary}`), and stone-toned supporting text (`{colors.body}`, `{colors.muted}`). The feel is still in the same family as ElevenLabs-style marketing (quiet, generous whitespace, pill CTAs, soft cards)—but **fonts and exact hex values follow the current code**, not the earlier Waldenburg + Inter + `#f5f5f5` analysis.

- **Display:** **Newsreader** via Tailwind `font-display` (`--font-newsreader` in `app/layout.tsx`), weight **400**, tight tracking **-0.02em**.
- **UI / body:** **Geist Sans** (`font-sans` / `--font-geist-sans`).
- **Code samples:** **Geist Mono** (`font-mono` / `--font-geist-mono`).

**App shell note:** Theme follows **`next-themes`** (`class` on `<html>`: `light` or `dark`). Marketing uses the same shadcn semantic utilities (`bg-background`, `text-foreground`, …) as the rest of the app so the home page respects the user’s theme—no separate forced palette on `<main>`.

**Key characteristics (as implemented)**

- Canvas #FDFCFC; cards and quiet panels #F5F3F1; borders #E0DFDD / #E9E6E2.
- Primary CTA: **true black** fill, white label, hover `black/85`.
- Outline CTA: white or near-white fill, `#E0DFDD` border, light shadow on some variants.
- Display headings: Newsreader 400, responsive clamp ~44px–56px on hero/sections.
- **Embedded demo chrome** (`LandingDemoSessionPreview`): dark `#000000` panel with monospace body—distinct from the light page canvas.

## Colors

### Core

| Token | Hex | Where it appears |
| ----- | --- | ---------------- |
| `{colors.canvas}` | #FDFCFC | `<main>`, header/footer bands, sections |
| `{colors.surface-muted}` | #F5F3F1 | Hero showcase shell, feature tiles, ghost button hover |
| `{colors.surface-card}` | #ffffff | Outline buttons, inner cards, code panel |
| `{colors.ink}` / `{colors.primary}` | #000000 | Display text, wordmark, filled CTAs |
| `{colors.primary-hover}` | rgba(0,0,0,0.85) | `hover:bg-black/85` on buttons |
| `{colors.on-primary}` | #ffffff | Text on black buttons / dark demo UI |

### Text

| Token | Hex | Use |
| ----- | --- | --- |
| `{colors.body}` | #44403C | Hero / section supporting paragraphs, footer links |
| `{colors.muted}` | #57534E | Eyebrows, nav, secondary copy, card subtitles |
| `{colors.muted-softer}` | #78716C | Integration row labels (idle state) |
| `{colors.label-strong}` | #1C1917 | Strong list labels (e.g. workflow API names) |

### Lines & structure

| Token | Hex | Use |
| ----- | --- | --- |
| `{colors.border}` | #E0DFDD | Default card and button borders |
| `{colors.border-soft}` | #E9E6E2 | Inner dividers (demo feature split) |
| `{colors.technical-line}` | #E8E8E6 | `TechnicalCrosshairFrame` rules |

### Code syntax (workflow marketing)

| Token | Hex | Use |
| ----- | --- | --- |
| `{colors.code-default}` | #292524 | Default monospace body in `WorkflowCodePanel` |
| `{colors.syntax-keyword}` | #F05252 | Keywords (`import`, `const`, `await`, …) |
| `{colors.syntax-string}` | #315BA8 | Strings / identifiers in examples |

### Demo / product-in-marketing

| Token | Hex | Use |
| ----- | --- | --- |
| `{colors.demo-chrome}` | #000000 | `LandingDemoSessionPreview` outer surface |
| `{colors.recording-dot}` | #F41A2F | Recording status indicator |
| `{colors.demo-pre-text}` | #E0DFDD | Preformatted sample text on dark panel |

### Decorative gradients (local only)

`DemoFeatureGrid` uses **multi-stop radial/linear gradients** (e.g. warm orange, red, blue) inside specific marketing tiles. These are **not** global brand tokens—keep them scoped to that component unless promoted deliberately to shared tokens.

### Semantic (shared app / forms)

- `{colors.semantic-error}` (#dc2626), `{colors.semantic-success}` (#16a34a) — align with `globals.css` / shadcn-style usage outside strict landing literals.

### Dark mode (CSS tokens)

The light palette above maps 1:1 to the shadcn variables in `:root` inside [apps/web/app/globals.css](apps/web/app/globals.css). The `.dark` block mirrors that discipline with a **warm stone** dark palette (not zinc-blue) so the brand keeps the same temperature across modes. Theme switching is wired through `next-themes` in [apps/web/providers/theme-provider.tsx](apps/web/providers/theme-provider.tsx) (`attribute="class"`, `defaultTheme="system"`).

| shadcn variable | Light (`:root`) | Dark (`.dark`) | Notes |
| --------------- | --------------- | -------------- | ----- |
| `--background` | #FDFCFC | #0C0A09 | Page canvas |
| `--foreground` | #000000 | #FAFAF9 | Primary text |
| `--card` / `--popover` | #FFFFFF | #1C1917 | Elevated surface |
| `--card-foreground` / `--popover-foreground` | #000000 | #FAFAF9 | |
| `--primary` | #000000 | #FAFAF9 | Inverted ink pill in dark |
| `--primary-foreground` | #FFFFFF | #0C0A09 | |
| `--secondary` / `--muted` / `--accent` | #F5F3F1 | #292524 | Quiet surface, ghost hover |
| `--secondary-foreground` | #1C1917 | #FAFAF9 | |
| `--accent-foreground` | #000000 | #FAFAF9 | |
| `--muted-foreground` | #57534E | #A8A29E | Captions, sub-titles |
| `--destructive` | #DC2626 | #EF4444 | |
| `--destructive-foreground` | #FEF2F2 | #FEF2F2 | |
| `--border` / `--input` | #E0DFDD | #292524 | |
| `--ring` | #57534E | #78716C | Focus outline |
| `--radius` | 0.5rem | 0.5rem | Shared |

**Principles**

- Both modes use the **same warm neutral family** (stone), keeping the editorial tone consistent.
- **Primary inverts** between modes (ink pill in light, cream pill in dark) so the “single primary action” concept survives.
- **No chroma accent** is bound to shadcn `--accent` — the previous bright green has been removed; saturated colors are kept scoped to local marketing art (e.g. `DemoFeatureGrid` gradients).
- Components should keep using semantic utilities (`bg-background`, `text-foreground`, `bg-primary`, `border-border`, …); avoid hard-coded hexes for new app surfaces so both themes follow automatically.

## Typography

### Stack

| Role | Implementation |
| ---- | -------------- |
| Display | `next/font` **Newsreader** → `--font-newsreader` → `font-display` |
| Sans | **Geist** → `--font-geist-sans` → `font-sans` on `<body>` |
| Mono | **Geist Mono** → `--font-geist-mono` → `font-mono` |

Newsreader weights loaded today: **400, 500, 600** (`layout.tsx`). Display marketing uses **400** (`font-normal`).

### Hierarchy (marketing)

| Pattern | Implementation | Notes |
| ------- | ---------------- | ----- |
| Hero / section H1–H2 | `font-display`, `font-normal`, `tracking-[-0.02em]`, responsive `text-[2.75rem]` → `xl:text-[3.5rem]` | See `landing-hero-section`, `landing-demo-section`, `workflow-section`, `bottom-cta-section` |
| Eyebrow | `text-[15px] sm:text-base`, `{colors.muted}` | e.g. “Replay-native reviews” |
| Lead body | `text-lg sm:text-xl`, `leading-snug`, `{colors.body}` | Hero right column |
| Nav | `text-sm`, `{colors.muted}`, `hover:text-black` | `landing-header` |
| Wordmark | `text-xl font-semibold text-black` | Header + footer |
| Workflow titles | `font-display text-xl sm:text-2xl text-black` | `WorkflowCopyBlock` |
| Code panel | `font-mono text-[13px] sm:text-sm`, `{colors.code-default}` | `WorkflowCodePanel` |

### Principles

- **Display stays Newsreader at 400** for marketing heroes and section titles unless a component explicitly needs semibold (e.g. some text inside the dark demo preview).
- **Body stays Geist sans** for readability; do not drop body to weight 300.
- **Code stays Geist Mono** with syntax colors only inside sample blocks.

## Layout

### Container

- **Max width:** `max-w-7xl` → **1280px** (`{layout.container-max}`).
- **Horizontal padding:** `px-4 sm:px-6 lg:px-8` (`{layout.container-padding-x}`).

### Vertical rhythm

Sections use Tailwind spacing such as `py-20 sm:py-24 lg:py-28` (demo), `py-12 sm:py-16 lg:py-20` (integrations, workflow, bottom CTA), and hero top padding `pt-24 sm:pt-32 lg:pt-40`—favor **generous** vertical gaps consistent with editorial landing pages.

### Grid

- Hero and demo: **two columns** from `lg:grid-cols-2` with large horizontal gaps (`lg:gap-x-14`, `xl:gap-x-20`).
- Feature grid: `lg:grid-cols-4` with wide feature tiles spanning 2 columns (`demo-feature-grid.tsx`).

## Elevation & depth

| Treatment | Value | Use |
| --------- | ----- | --- |
| Hero showcase | `{shadows.hero-showcase}` | Outer replay frame in hero |
| Floating white cards | `{shadows.card-soft}` | Nested cards in demo feature grid |
| Code panel | `{shadows.card-softer}` | `WorkflowCodePanel` |
| Outline CTAs | `{shadows.outline-cta}` / `{shadows.outline-cta-strong}` | Hero secondary, integration CTAs |

Hairlines: default **1px** `{colors.border}` on cards; technical frame uses `{colors.technical-line}`.

## Shapes

| Token | px | Use |
| ----- | -- | --- |
| `{rounded.hero-frame}` | 18 | Hero replay outer shell |
| `{rounded.card-2xl}` | 16 | `rounded-2xl` — feature tiles, workflow code panel |
| `{rounded.lg}` | 8 | `rounded-lg` — matches `--radius` in `globals.css` (0.5rem) |
| `{rounded.xl}` | 12 | `rounded-xl` — nested inner cards, icon wells |
| `{rounded.md}` | 6 | `rounded-md` — demo session chrome (`--radius-md`) |
| `{rounded.pill}` | full | All primary/outline CTAs, badges |

## Components (file map)

| Document id | Source file | Notes |
| ----------- | ----------- | ----- |
| `landing-main` | `landing-page.tsx` | Sets canvas + default text |
| `top-nav` | `landing-header.tsx` | Sticky, `bg-[#FDFCFC]/90`, **72px** toolbar, nav + Login + Sign up |
| Hero | `landing-hero-section.tsx` | Two-column hero, CTAs, `HeroReplayShowcase` frame |
| Integrations | `integration-harness-section.tsx` | Crosshair frame + logo grid |
| Demo narrative | `landing-demo-section.tsx` | Headline + CTA + `DemoFeatureGrid` |
| Feature tiles | `demo-feature-grid.tsx` | Includes local gradient marketing art |
| Workflow | `workflow-section.tsx` | Copy + code + diagram blocks |
| Bottom CTA | `bottom-cta-section.tsx` | Framed CTA row |
| Footer | `landing-footer.tsx` | 4-column grid on large screens |
| Session preview | `landing-demo-session-preview.tsx` | Dark “device” chrome for animated steps |
| Technical frame | `technical-crosshair-frame.tsx` | `{colors.technical-line}` rules, black corner dots |

### Buttons (implemented)

- **Primary:** `bg-black text-white rounded-full`, hover `bg-black/85`, heights **36px** (header `h-9`) or **56px** (`h-14` hero/sections).
- **Outline:** `bg-white`, border `#E0DFDD` or `border-black/[0.08]`, optional light shadow; hover often `bg-[#F5F3F1]`.
- **Ghost (header login):** `hover:bg-[#F5F3F1]`, muted text.

## Do’s and don’ts

### Do

- Keep marketing **on `{colors.canvas}`** with black pills for primary actions.
- Use **Newsreader + Geist** pairing for new marketing sections.
- Use `{colors.border}` / `{colors.surface-muted}` for cards to match existing tiles.
- Reuse **`TechnicalCrosshairFrame`** when adding wide “spec sheet” sections.

### Don’t

- Don’t assume **Waldenburg / Inter** or `#f5f5f5` / `#292524` CTA colors for new landing work—they are **not** what `apps/web` ships today.
- Don’t move saturated demo-only gradients into global tokens without review.
- Don’t style new marketing sections with **one-off hex** for surfaces or body text—use semantic tokens so light and dark both stay readable.

## Responsive behavior

Marketing follows **Tailwind defaults**: `sm` ≥640px, `md` ≥768px, `lg` ≥1024px, `xl` ≥1280px.

- Nav links hidden below **`md`** (`hidden md:flex` in header)—**no hamburger** in current implementation; small screens show wordmark + CTAs only.
- Hero and demo headlines scale with responsive `text-*` utilities (see hero file).
- `DemoFeatureGrid` collapses to single column until `lg:grid-cols-4`.

## Iteration guide

1. Prefer editing **`features/marketing/components/*`**; keep `app/page.tsx` thin.
2. When adding colors, **extend the YAML table above**, then use Tailwind theme or CSS variables so literals don’t spread (today many hexes are inline in class names).
3. Pill for CTAs; **16px** (`rounded-2xl`) for large cards unless matching the **18px** hero frame.
4. Pair display changes with **`font-display`** and body with default sans.

## Known gaps

- Marketing uses **many inline hex classes**; centralizing to `globals.css` `@theme` or shared tokens would match this doc mechanically.
- **`html` uses `light` / `dark`** from `next-themes`; marketing shares the same token pipeline—test the home page in both modes when changing colors.
- In-app surfaces (dashboard, replay viewer, auth) are not fully specified here.
- `DemoFeatureGrid` animation / gradient details are intentionally local.
