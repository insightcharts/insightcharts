# InsightCharts: contributor guide for agents and humans

InsightCharts is an open-source React library for **data stories**: composable, interactive infographics in the tradition of the best data journalism, built on Apache ECharts 6. The primary *implementer* is an AI agent; the primary *reader* is a person. Every design decision follows from that.

## Layout

```
packages/insightcharts/src/
  core/        the engine: Chart, defineChart, Figure, theme, mode, export, annotations, store, spec
  data/        server-safe loading (rows, CSV, URL, functions, Arrow) and JSON transforms
  story/       Scrolly: scroll / swipe / step-driven narrative
  themes/      theme presets
  atoms/       one file per chart or figure primitive
  molecules/   one file per combination of atoms
  templates/   one file per full layout built from molecules and atoms
  insight.tsx  <Insight spec={...}> renders any component from JSON
apps/gallery/  Vite dev gallery: renders every component from its meta.example
apps/docs/     the documentation site and shadcn registry
skills/        the installable agent skill
scripts/       build-index (generates the three index.ts files), build-manifest
```

`atoms/index.ts`, `molecules/index.ts`, `templates/index.ts` and `manifest.json` are **generated**. Never edit them; run `pnpm manifest` (which also regenerates the indexes).

## Commands

```bash
pnpm manifest                           # regenerate indexes + manifest.json, validates meta
pnpm --filter insightcharts typecheck   # must pass
pnpm --filter insightcharts test        # vitest
pnpm --filter insightcharts build       # tsup
pnpm gallery                            # http://localhost:5199  (may already be running; reuse it)
```

Gallery URLs: `/#bar-chart` shows one component plus every entry of its `examples` export; `?mode=dark` renders dark; `?w=380` constrains width for a mobile check; `?lab` is the engine integration page.

## The three levels

- **Atom**: one chart form or one figure primitive. Charts are built with `defineChart`; HTML primitives use `withMeta`. Atoms never import other atoms.
- **Molecule**: a recurring combination of atoms that makes one point (a stat row, a chart with a takeaway callout, a linked pair). Imports atoms.
- **Template**: a complete piece (an executive one-pager, a scroll-driven visual essay). Imports molecules and atoms. Takes its content as props so it works from JSON.

Every component declares `composes: [...]` in its meta listing the names it is built from. The docs cross-link from that, so keep it accurate.

## Writing a chart atom

Read `atoms/bar-chart.tsx` and `atoms/line-chart.tsx` first; they are the reference implementations. The shape is always:

```tsx
import { ScatterChart as EScatter } from "echarts/charts";
import { defineChart } from "../core/define";

export interface ScatterChartProps { /* chart-specific props, each with a JSDoc line */ }

export const ScatterChart = defineChart<ScatterChartProps>({
  name: "scatter-chart",            // kebab-case; file name must match; this is the registry id
  title: "Scatter chart",
  category: "relationship",         // comparison | trend | distribution | part-to-whole | relationship | flow | geo | poster | figure | text | layout | story | infographic
  description: "One sentence: what it shows.",
  whenToUse: "When this is the right form.",
  avoid: "When to pick something else, naming the alternative component.",
  use: [EScatter],                  // every ECharts series/component beyond the core set
  defaults: { },
  selectField: (p) => p.series,     // field a click selects on, for crossfiltering
  props: [ /* PropDoc for each chart-specific prop */ ],
  example: { type: "scatter-chart", data: [...], x: "...", y: "...", title: "One plain fact with its number" },
  build(p, ctx) { return { option, legend, alt }; },
});

// Optional: more states for the gallery and docs. Keys become example titles.
export const examples = { "With highlight": { ... }, "Long format": { ... } };
```

`defineChart` supplies data loading, transforms, crossfilter, theme, dark mode, highlight, annotations, figure chrome, legend, export, loading/empty/error states, lazy mounting and the `option` escape hatch. `build` must be a **pure function** of `(props, ctx)`.

Already registered in core, do not re-`use`: both renderers, Grid, Tooltip, Dataset, Transform, MarkLine, MarkArea, MarkPoint, Graphic, Aria, LabelLayout, UniversalTransition. Anything else (`VisualMapComponent`, `PolarComponent`, `GeoComponent`, `CustomChart`, ...) goes in `use`.

### What `build` receives (`ctx`)

| Member | Use |
|---|---|
| `ctx.rows` | Data after loading, crossfilter and `transform`. Plain objects. |
| `ctx.tokens` | Resolved theme: `surface ink inkSecondary muted grid axis accent context positive negative categorical[] sequential[] diverging[] fontFamily fontSize radius lineWidth`. Concrete colours, safe for canvas. |
| `ctx.color(key, index)` | Colour for an entity. Handles `highlight`. Call with no arguments for a single series (the accent). |
| `ctx.highlight` | The `highlight` prop as a string array. |
| `ctx.dimmed(key)` | True when `highlight` is set and excludes this key. |
| `ctx.selected(value)` | False when a click selection is active and excludes this value. Fade those marks (`alpha(color, 0.25)`). |
| `ctx.fmt` / `ctx.formatter(spec)` | Value formatter from the `format` prop / from any spec. |
| `ctx.width height compact mode animate locale` | `compact` is true under 480px: simplify. |

Helpers (import from `../core/...`): `shapeSeries` (wide/long rows to aligned series; use it for every x/y/series chart), `categoryAxis valueAxis timeAxis hiddenAxis tooltipHtml labelStyle morph escapeHtml` (parts), `alpha mix ramp inkOn luminance` (color), `distinct extent groupRows toNumber niceStep` (data/transform), `describeExtremes` (shape), `formatDate isTemporal` (format), `measureText truncateText wrapText dodge` (layout: measure labels instead of estimating from character counts; `dodge` spreads converging end labels).

A definition may set `height: (props, rows, width) => number` to give the plot a natural height when the `height` prop is absent, e.g. `rows.length * 32 + 40` for row-based charts. `width` is the measured plot width in px (undefined before first layout), so a graphic can be taller on a phone.

### Rules that make it look and behave like InsightCharts

These are requirements, not preferences. They come from the data-journalism canon and from accessibility law.

1. **Colour by job.** Identity: `ctx.color(key, i)` in stable entity order, never cycled past 8 (fold to "Other" or use small multiples). Magnitude: `tokens.sequential` via `ramp()`. Polarity: `tokens.diverging`. Up/down: `positive`/`negative` plus a non-colour cue. Never hard-code a hex.
2. **Text never wears the series colour.** Labels use `ink`, `inkSecondary` or `muted`. Text inside a fill uses `inkOn(fill)`.
3. **Mark specs.** Bars at most 24px thick, `tokens.radius` on the data end, square at the baseline. Lines `tokens.lineWidth`. Markers 8px with a 2px `surface` border. Area fills are a wash (`alpha(color, 0.1)`). Touching fills are separated by a `surface`-coloured border, not a dark stroke.
4. **Chrome recedes.** Hairline solid gridlines in `tokens.grid`, no boxes, no axis ticks. Use the parts helpers and you get this for free.
5. **Direct labels before legends, selectively.** Label the end of a line, the tip of a bar, the extremes. Never a number on every point of a dense chart. Return `legend` items for 2+ series unless they are all directly labelled.
6. **Honest scales.** Zero baseline for anything that encodes by length or area (bars, areas). Position encodings (lines, dots) may float. No dual axes. No 3D. Log and index rebasing must be stated in the subtitle by the author; expose them as explicit props.
7. **Tooltips are a bonus, never load-bearing.** The chart must read without hovering. Build tooltips with `tooltipHtml` (it escapes).
8. **Morphing.** Spread `...morph` into each series and give series a stable `id`, so scroll steps animate between states. Custom series are the exception: universal transition recreates their elements, so give each element returned by `renderItem` a stable `id`/`name` and a `transition` list (`["shape", "style", "x", "y"]`) instead, and leave `...morph` off.
9. **Alt text.** Return `alt`: chart type, measures, then the main pattern and notable values. Not just "bar chart of x by y".
10. **Responsive.** Handle `ctx.compact`: fewer ticks, shorter labels, horizontal layouts. Check at `?w=380`.
11. **Everything is JSON-serialisable** except callbacks. No required function props. Field names are strings.
12. **Custom forms use ECharts `custom` series** (`renderItem`) with `dimensions`/`encode` set so tooltips work; decoration that is not data goes in `graphic`. Icons scale by count (ISOTYPE), never by area.

Example data should be small, realistic and plausible; if illustrative, say so in `note`. All text in examples and docs follows the writing rules below.

## Writing rules for every title, heading and sentence

These apply to chart titles, subtitles, decks, callouts, story steps, prose, docs headings and descriptions. They are hard requirements.

Write one plain statement of fact, the way a person would say it out loud, with the real numbers and the period in it.

| Write this | Not this |
|---|---|
| Monthly churn fell from 4.2% to 2.1% in 2024 | Churn halved after the March onboarding revamp, and the gain has held for six months |
| Renewables supplied 98% of Norway's electricity in 2023 | Norway runs almost entirely on renewable electricity |
| Acme had 266 active teams in December 2024, 2.4 times Globex | Acme pulled away from the pack in late 2023 |
| Solar's share rose from 2.7% to 5.5% between 2019 and 2023 | Solar is closing the gap with wind |
| Households wasted 631 million tonnes of food in 2022 | It is not a rich-country habit |

- One clause. No second half joined with a comma, "and", "but", "while", "yet", a semicolon, a colon or a dash that adds a twist, a consequence or a follow-up. If there are two facts, write two sentences or put the second in the subtitle.
- Put the number in. "Fell from 4.2% to 2.1%", not "halved"; "98%", not "almost entirely"; "3 of 12", not "a handful".
- No metaphor, idiom or figure of speech: no "pulled away from the pack", "closing the gap", "sea of grey", "tells the story", "the long tail", "did the work".
- No teasing or alluding to something the reader has to work out: no "one hospital explains most of it", "the next gain is elsewhere", "here is where it goes".
- No dramatic verbs (soared, plunged, surged, skyrocketed, slashed) and no staged contrast ("not X, but Y"; "it's not just X").
- No rhetorical questions, no groups of three for rhythm, no sign-off lines.
- A plain label is always acceptable when there is no single fact to state: "Monthly churn, 2024".
- Subtitles name the measure, unit, population and period. Sources name the source.


## Writing an HTML atom, molecule or template

Use `withMeta(Component, meta)` (see `atoms/big-number.tsx`). Style with inline styles that read the chrome variables (`var(--_ic-ink)`, `--_ic-ink-2`, `--_ic-muted`, `--_ic-grid`, `--_ic-axis`, `--_ic-context`, `--_ic-surface`, `--_ic-accent`, `--_ic-positive`, `--_ic-negative`, `--_ic-font`, `--_ic-font-display`), which you set on your root with `chromeVars(theme[mode])` exactly as `big-number.tsx` does. Add a `data-slot="ic-..."` to every meaningful element so consumers can restyle. No CSS files, no Tailwind classes, no UI-library imports inside the package: it must work in any React app.

No component may have a prop named `type`: in a JSON spec, `type` is the component name. Exported names must be unique across a level; prefix file-private helpers with `_` or do not export them (the index generator re-exports everything except `examples`).

Use `useContainerWidth()` from `../core/use-container-width` for width-driven layout.

Slots that take content accept `Slot` (`ReactNode | InsightSpec`) and render through `renderSlot(slot)`, so the component works from JSX and from JSON. Layouts use CSS grid/flex with `minWidth: 0` on children and container-width-driven breakpoints (measure with `ResizeObserver`; do not use viewport media queries, components live inside arbitrary columns).

## Infographics: the poster style

Infographics are a set of templates (`category: "infographic"`) that compose one large designed graphic: a poster. They have little text, one dominant visualization or several illustrations laid out together, and a strong painted background. They are built from the same atoms plus a group of poster primitives (`category: "poster"`).

Poster primitives and infographic templates follow every rule above (colour by job, honest scales, JSON-serialisable props, alt text, the writing rules) with these differences, which apply only to them:

- **They paint for a poster surface.** A poster theme (`src/themes/posters.ts`) sets `surface` to the poster's background and supplies 2 to 4 strong colours. Always read colours from `ctx.tokens`; never hard-code them. Marks may be large flat fills.
- **Labels go inside the marks** when they fit: name and value printed in the block, bubble or bar, in `inkOn(fill)`. Measure with `measureText` and move the label outside (with a leader line if needed) or drop it when it does not fit. Never let text overflow or overlap.
- **Type is part of the graphic.** Values may be set large (`tokens.displayFamily`, 20 to 64 px, scaled to the mark). Small supporting labels stay at 11 to 13 px in `inkSecondary` or `muted`.
- **No axes or gridlines by default.** Scale is read from direct labels, unit keys ("one figure = 1,000 people") and proportional area. Offer axes as an opt-in prop where they help.
- **Area and count encodings are welcome**, with their value always printed: squares and circles sized by area (`Math.sqrt`), unit icons by count. Never scale an icon's width and height both by the value.
- **Icons** come from `core/icons.ts` (`resolveIcon`, `iconSymbol`); every icon prop accepts a built-in name or a `path://` string.
- **Interactive.** Every mark has a tooltip built with `tooltipHtml`, hover emphasis that dims the rest, an entrance animation, and click selection (`selectField` / `ctx.selected`). Use ECharts `custom` series (`renderItem`) with `dimensions`/`encode`, stable ids and `...morph`.
- **Hover dimming on a custom series** needs `focus: "self"` (or `"series"`) and an explicit `blur` style on the element that `renderItem` returns; a series-level `emphasis.focus` does nothing for custom series.
- **Sized by content.** Give the definition a `height` hook so the graphic takes the height its layout needs, and lay out by `ctx.width` so it reflows on a phone instead of shrinking to illegibility.
- **Still true.** Bars start at zero. No 3D, no drop shadows, no decorative gradients on data marks (a background gradient on the poster frame is allowed). Decoration never encodes data and data marks are never decorated.

## Definition of done for a component

1. File is `src/<level>s/<name>.tsx`, name matches `meta.name`, with a complete `meta` (description, whenToUse, avoid, props, example, composes).
2. `pnpm manifest` and `pnpm --filter insightcharts typecheck` pass.
3. You looked at it in the gallery (`/#name`) in light, `?mode=dark` and `?w=380`, with a real browser screenshot, and fixed what was wrong: overlapping labels, clipped text, illegible contrast, wasted space.
4. An `examples` export shows the important states (highlight, long-format data, a stress case).

## Style

TypeScript strict. No new runtime dependencies without discussion (peer deps are `react`, `react-dom`, `echarts`). Comments explain why, not what. Prose in docs and metadata is plain and specific; no marketing language.
