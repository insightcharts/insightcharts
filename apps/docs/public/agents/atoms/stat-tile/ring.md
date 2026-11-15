# Reproduce the "Ring" example of the InsightCharts Stat tile

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Ring" example of `stat-tile` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A compact KPI tile: label, value, change against a baseline and an optional graphic. Twenty variants display the same data as a card, a trend, progress toward a target, a comparison, a breakdown, a rank or a count of icons.

Use it when: Dashboard grids and KPI rows of three to six figures. Pass the data once (`value`, `delta`, `series`, `target`, `parts`, `icon`) and choose the display with `variant`; change `surface`, `tone` and `size` to set emphasis. Give every tile a delta or a context line.

Pick something else when: The single number a story leads with (use `big-number` with `size: "hero"`). Do not put a full chart with axes in the trend slot. Use `unit` only for counts up to 60 icons.

Instructions for the alternatives: `big-number` https://insightcharts.dev/agents/atoms/big-number.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/stat-tile
```

The file lands at `components/insightcharts/atoms/stat-tile.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { StatTile } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, not as a `data` array.

Required props, with what the example passes:

- `label` (`string`): What it measures, sentence case. Example: `"Monthly active users"`.
- `value` (`number | string`): The figure. Numbers are formatted with `format`. `progress`, `ring` and `unit` need a number. Example: `48210`.

## 5. The "Ring" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { StatTile } from "insightcharts";

<StatTile
  label="Monthly active users"
  value={48210}
  delta={0.083}
  deltaLabel="vs September"
  series={[21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210]}
  variant="ring"
  target={50000}
  context="Q4 target is 50,000"
  style={{ maxWidth: 300 }}
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "label": "Monthly active users",
  "value": 48210,
  "delta": 0.083,
  "deltaLabel": "vs September",
  "series": [21400, 23900, 25100, 28800, 31600, 33200, 36900, 39800, 44500, 45300, 46900, 48210],
  "variant": "ring",
  "target": 50000,
  "context": "Q4 target is 50,000",
  "style": { "maxWidth": 300 },
  "type": "stat-tile"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` (required) | `string` |  | What it measures, sentence case. |
| `value` (required) | `number \| string` |  | The figure. Numbers are formatted with `format`. `progress`, `ring` and `unit` need a number. |
| `delta` | `number \| string` |  | Change against a baseline. Numbers render as signed percentages (0.12 is +12%). `comparison` computes it from `value` and `comparison` when omitted. |
| `deltaLabel` | `string` |  | What the delta is against, e.g. "vs last month". |
| `upIsGood` | `boolean` | `true` | Whether an increase is an improvement. Sets the delta colour; the arrow and sign always show the direction. |
| `context` | `string` |  | A line that states a comparison or reference for the number. |
| `variant` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent" \| "sparkline" \| "area" \| "bars" \| "dots" \| "progress" \| "ring" \| "comparison" \| "delta-first" \| "icon" \| "unit" \| "breakdown" \| "rank" \| "split" \| "compact" \| "hero"` | `"plain"` | The display. Grounds: `plain` (bordered card), `borderless`, `filled` (solid tone with contrasting ink), `tinted` (10% wash), `outline-accent` (a 2px rule on one edge). Trends, from `series`: `sparkline` (line), `area` (filled, edge to edge along the bottom, zero-based), `bars` (columns, zero-based), `dots`, `split` (figure left, line in a tinted panel right), `compact` (one line: label, small line, value, change). Goals, from `target` or `max`: `progress` (bar with the target marked), `ring`. Others: `comparison` (needs `comparison`: two labelled bars), `delta-first` (the change is the large figure), `icon` (needs `icon`: a tinted badge), `unit` (the count as repeated icons, up to 60), `breakdown` (needs `parts`: a segmented bar with a key), `rank` (needs `rank`: "3rd of 12" with a position strip), `hero` (a numeral of 40 to 96px). A variant whose data is missing renders as `plain`. |
| `surface` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent"` |  | The ground, independent of the display, so any variant can sit on any ground: `variant: "sparkline", surface: "filled"`. Default: the variant's own, otherwise `plain`. |
| `tone` | `"neutral" \| "accent" \| "positive" \| "negative" \| number` | `"accent"` | Colour of the graphic and of a filled or tinted ground. A number picks from the theme's categorical palette, 0-based. `neutral` is ink. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Type and padding scale: 22, 28 or 36px numerals with 12, 16 or 20px padding. The numeral shrinks to fit a narrow tile. |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Text alignment. |
| `orientation` | `"vertical" \| "horizontal"` |  | Graphic under the figure or beside it, for `sparkline`, `bars`, `dots`, `ring` and `icon`. Default `vertical`, `horizontal` for `ring`. Falls back to vertical under about 250px (180px for `ring` and `icon`). |
| `series` | `number[]` |  | Past values in time order, oldest first, ending with the current value, in the units of `value`. A numeric `trend` array is used when `series` is omitted. |
| `target` | `number` |  | The goal for `value`, marked on `progress` and `ring`. |
| `targetLabel` | `string` | `"Target"` | Name for the target. |
| `max` | `number` |  | End of the scale for `progress` and `ring`, and the total count drawn by `unit`. Default: the target, or 1 for a share. |
| `comparison` | `number \| string` |  | The value compared with, for `comparison`: a previous period or a peer. |
| `comparisonLabel` | `string` | `"Before"` | Names the comparison value, e.g. "September". |
| `valueLabel` | `string` | `"Now"` | Names the current value in `comparison`, e.g. "December". |
| `parts` | `{ label: string; value: number }[]` |  | What the value is made of, for `breakdown`. Should sum to `value`. Past six parts the smallest fold into Other. |
| `icon` | `IconInput` |  | A built-in icon name or `path://...`, for `icon` and `unit`. `unit` defaults to `circle`. |
| `unitValue` | `number` | `1` | What one icon stands for in `unit`. A caption states it when it is not 1. |
| `rank` | `number` |  | Position in a ranking, 1 is first, for `rank`. |
| `rankOf` | `number` |  | Number of entries ranked. Up to 32 are drawn as one segment each. |
| `edge` | `"left" \| "top"` | `"left"` | Which edge carries the rule on an `outline-accent` surface. |
| `trend` | `Slot \| number[]` |  | A chart spec, a React element, or an array of numbers drawn as a sparkline. Works in every variant that does not draw `series` itself. |
| `trendPosition` | `"bottom" \| "right"` | `"bottom"` | Where the trend slot sits; `right` falls back to `bottom` in narrow tiles. |
| `format` | `FormatSpec` | `"auto"` | Number format for `value`, `target`, `max`, `comparison` and `series`. |
| `theme` | `ThemeInput` |  | A theme name such as `"ledger"`, or token overrides. A named theme paints its own ground behind the tile. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |
| `children` | `ReactNode` |  | Extra content at the bottom of the tile. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: nothing. It is a primitive.
- Used by: `before-after` (molecule), `kpi-grid` (molecule), `metric-breakdown` (molecule), `section` (molecule), `stat-row` (molecule), `trend-card` (molecule), `timeline-story` (template)

## Rules for this form

- Give every number its unit and its period in the label.
- A single number needs a comparison, a denominator or a period beside it.
- An icon prop takes a built-in icon name or a `path://` string holding one SVG path. A name that is not built in falls back to another icon, so use only the names in the icons guide.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- An icon is decoration. The label beside it must carry the meaning.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/stat-tile.md
- Component reference with every example: https://insightcharts.dev/llms/stat-tile.md
- Registry item: https://insightcharts.dev/r/stat-tile.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/stat-tile.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/stat-tile#example-ring
- These instructions as plain text: https://insightcharts.dev/agents/atoms/stat-tile/ring.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
