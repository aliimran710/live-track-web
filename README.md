# Live Track — GPS tracking site

The public product site for the Live Track fleet GPS tracking platform. It explains
what the system does and how a position travels from a device in a vehicle to an
operator's screen.

Content is drawn from the operator panel's system documentation
(`../gps-tracker/document.md`) and rewritten as customer-facing copy. Every number on the
page is one the platform actually produces.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle into dist/
npm run preview  # serve the built bundle
```

Node 20 or newer.

## Stack

Deliberately matched to the operator panel at `../gps-tracker`, so components move between
the two projects without edits.

| | |
|---|---|
| React 18.3 + TypeScript 5.8 | same as the panel |
| Vite 5.4 with `@vitejs/plugin-react-swc` | same as the panel |
| Tailwind 3.4, `tailwind.config.ts` | same token structure as the panel |
| shadcn/ui on Radix | components copied from the panel for version parity |
| framer-motion 12 | scroll, reveals, the route rail |
| three + @react-three/fiber | two scenes only, both lazy-loaded |
| Lenis | weighted scrolling, skipped under reduced motion |

## Design

**The mark is the brief.** The Live Track logo is a map pin holding a navigation arrow.
The page is built on that: one route runs down the left edge, a heading-rotated vehicle
marker rides it as you scroll, and each section is a waypoint on the track.

**Colour.** Brand navy `#04003A` is `primary` in both themes. The accent is the logo's
cyan. Beyond that the page uses the panel's own six vehicle-state colours — moving, idle,
stopped, offline, disabled, total — and only where they mean what they mean there.

Status colours exist twice. `STATUS_HEX` in `src/lib/content.ts` is for fills, bars and
dots. `statusInk()` resolves through CSS variables and darkens on the light theme, and is
what anything *read* must use. Putting `STATUS_HEX` on text will fail contrast on paper.

**Type.** Archivo (expanded, `wdth` 115) for display, Public Sans for body, Martian Mono
for coordinates, timestamps and eyebrow labels. Self-hosted through `@fontsource-variable`.

## Layout

```
src/
  lib/content.ts          every word and number on the page
  lib/signalProgress.ts   scroll bridge between section 03 and its WebGL scene
  lib/useActiveSection.ts which waypoint owns the viewport
  components/layout/      header, footer, theme, smooth scroll, section primitives
  components/rail/        the route rail (the signature element)
  components/three/       both WebGL scenes, their mount guard and static fallback
  components/sections/    twelve sections, one file each
  components/figures/     the animated diagrams the sections use
  components/ui/          shadcn components
```

To change copy, edit `src/lib/content.ts`. Nothing else holds text.

## Themes

Dark-first: the navy canvas is the default on a fresh visit regardless of the operating
system setting, because the route glow and both 3D scenes are built for it. A visitor's
own choice is stored in `localStorage` under `livetrack-theme` and always wins. The
pre-rebrand key `zm-theme` is still read as a fallback, so nobody loses their pick.

The header logo swaps with the theme — `/brand/dark-theme.png` (white mark) on navy,
`/brand/light-theme.png` (black mark) on paper.

## WebGL

Two scenes, both `React.lazy` and both mounted only when they come near the viewport:

- `HeroScene` — a city plate of instanced boxes, a route traced across it, a car driving
  the route, a geofence it passes through, and the satellite fix pulsing beneath it. The
  car body is one `ExtrudeGeometry` from a side-profile `Shape`, which is what makes it
  read as a vehicle instead of stacked boxes; the glass band is extruded a hair wider than
  the body so it stays visible from the side. It is painted near-white on purpose — a
  route-coloured car on a route-coloured road reads as one glowing smear.
- `SignalChainScene` — device → satellite → server → operator panel, with a packet the
  scroll position walks forward.

Every shape is a three.js primitive. Nothing is downloaded, there is no model file and no
licence to track. `SceneMount` renders `CanvasFallback` — the same territory drawn flat in
SVG — when the visitor prefers reduced motion or the browser has no WebGL.

The three.js chunk is ~820 KB (220 KB gzipped) and is never part of the first paint.

## Accessibility and motion

- `prefers-reduced-motion` disables Lenis, all scroll scrubbing, both canvases and the rail
  marker. Everything renders in its final state.
- Status colour is never the only signal; every coloured dot has a text label beside it.
- Focus rings are visible and use the accent colour.
- The route rail is `aria-hidden`: it is decoration, and the waypoint eyebrows carry the
  same information as text.

## Known TODOs

1. **The contact form posts nowhere.** `onSubmit` in `src/components/sections/Contact.tsx`
   validates, waits, and shows the success state. Point it at the Live Track lead
   endpoint; the TODO marks the spot.
2. **`dark-theme.png` has transparent speckle punched through the letterforms.** On the
   navy canvas this shows as faint navy specks inside the white text — hard to see at
   header size, obvious if the mark is ever used large. The black `light-theme.png` is
   clean, so a correct white export can be derived from it.
3. **The logo PNGs are 448 KB and 228 KB**, used exactly as supplied. They are 2170 px
   wide and display at roughly 100 px, so only the active theme's file is fetched and it
   still dwarfs the rest of the page. Re-export both at about 300 px wide.
4. **The favicon is the full 3:1 lockup**, which is illegible at 16 px. The fix is a
   square, pin-only export; that asset does not exist yet.
5. Footer links are labels, not routes. There are no other pages yet.
