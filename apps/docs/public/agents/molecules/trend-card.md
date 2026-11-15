# Build a Trend card with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Trend card (`trend-card`, a molecule) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A KPI card computed from a series: the latest value, its change against a baseline in the same data, and a trend graphic, in any `stat-tile` variant.

Use it when: A metric whose recent history matters as much as its level: users, revenue, response time. Pass the series and field names; the figure, the change and the sparkline all come from the same rows, so they cannot disagree.

Pick something else when: A number with no history (use `big-number` or `stat-tile`); several metrics from one dataset (use `kpi-grid`); a series the reader must read values from (use `line-chart`).

Instructions for the alternatives: `big-number` https://insightcharts.dev/agents/atoms/big-number.md, `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `stat-tile` https://insightcharts.dev/agents/atoms/stat-tile.md, `kpi-grid` https://insightcharts.dev/agents/molecules/kpi-grid.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/trend-card
```

The file lands at `components/insightcharts/molecules/trend-card.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { TrendCard } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "month": "2024-01-01", "users": 38100 },
  { "month": "2024-02-01", "users": 39400 },
  { "month": "2024-03-01", "users": 39000 }
]
```

How the example maps columns to props:

- `y` = `"users"`. Value field: the series drawn and the source of the figure and its change.
- `x` = `"month"`. Period field, used to name the baseline and in the sparkline tooltip.

With the user's data, keep the props and change the column names.

## 5. Working example

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { month: "2024-01-01", users: 38100 },
  { month: "2024-02-01", users: 39400 },
  { month: "2024-03-01", users: 39000 },
  { month: "2024-04-01", users: 40800 },
  { month: "2024-05-01", users: 42200 },
  { month: "2024-06-01", users: 41900 },
  { month: "2024-07-01", users: 43500 },
  { month: "2024-08-01", users: 44100 },
  { month: "2024-09-01", users: 44500 },
  { month: "2024-10-01", users: 46000 },
  { month: "2024-11-01", users: 47200 },
  { month: "2024-12-01", users: 48210 },
];

<TrendCard
  label="Monthly active users"
  data={data}
  x="month"
  y="users"
  format="compact"
  style={{ maxWidth: 300 }}
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "trend-card",
  "label": "Monthly active users",
  "data": [
    { "month": "2024-01-01", "users": 38100 },
    { "month": "2024-02-01", "users": 39400 },
    { "month": "2024-03-01", "users": 39000 },
    { "month": "2024-04-01", "users": 40800 },
    { "month": "2024-05-01", "users": 42200 },
    { "month": "2024-06-01", "users": 41900 },
    { "month": "2024-07-01", "users": 43500 },
    { "month": "2024-08-01", "users": 44100 },
    { "month": "2024-09-01", "users": 44500 },
    { "month": "2024-10-01", "users": 46000 },
    { "month": "2024-11-01", "users": 47200 },
    { "month": "2024-12-01", "users": 48210 }
  ],
  "x": "month",
  "y": "users",
  "format": "compact",
  "style": { "maxWidth": 300 }
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `parts`, `{ label: string; value: number }[]`: Composition of the latest value, for `breakdown`. Not used in the example.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` (required) | `string` |  | What the figure measures, sentence case. |
| `data` | `DataInput` |  | Rows in time order, one per period. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` |  | Applied to the rows before anything is computed. |
| `y` (required) | `string` |  | Value field: the series drawn and the source of the figure and its change. |
| `x` | `string` |  | Period field, used to name the baseline and in the sparkline tooltip. |
| `value` | `number \| string` |  | The figure shown. Default: the last row's `y`. |
| `delta` | `number \| string` |  | The change shown. Default: computed from the series according to `compare`. |
| `compare` | `"first" \| "previous" \| number` | `"first"` | Baseline for the computed change: first row, previous row, or a number of rows back (12 for year-on-year in monthly data). |
| `change` | `"percent" \| "absolute"` | `"percent"` | Relative change, or the difference between the two values (use for rates and shares). An absolute change of a percentage is shown in percentage points. |
| `deltaFormat` | `FormatSpec` |  | Format for a computed absolute change, e.g. `"{value} pp"` or `"signed"`. Default: points ("+1.9 pts") when `format` is a percentage, otherwise `format`. |
| `deltaLabel` | `string` |  | What the change is against. Default: "since {first period}" when `x` is given. |
| `upIsGood` | `boolean` | `true` | Whether an increase is good news; decides the delta colour. |
| `context` | `string` |  | A line under the figure that gives it meaning. |
| `format` | `FormatSpec` | `"auto"` | Number format for the figure and the sparkline tooltip. |
| `kind` | `"line" \| "bar"` | `"line"` | Sparkline form: a line for a trend, bars for discrete counts. |
| `area` | `boolean` | `false` | Light fill under the line; the scale then includes zero. |
| `trendPosition` | `"bottom" \| "right"` | `"bottom"` | Where the sparkline sits; `right` falls back to `bottom` in narrow cards. |
| `variant` | `StatTileVariant` |  | The tile display: any `stat-tile` variant (`sparkline`, `area`, `bars`, `dots`, `split`, `compact`, `progress`, `ring`, `comparison`, `delta-first`, `icon`, `breakdown`, `rank`, `unit`, `hero`, `filled`, `tinted`, `borderless`, `outline-accent`, `plain`). The series is passed as the tile's `series`; `comparison` takes the baseline value and both period names from the rows. Omit for the original card with an interactive `sparkline` atom (tooltip on hover). |
| `showTrend` | `boolean` | `true` | With a `variant` that does not draw the series itself (`filled`, `icon`, `hero`, `delta-first`...), a line is drawn at the bottom; set false to leave it off. |
| `surface` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent"` |  | The tile's ground, with any `variant`. |
| `tone` | `"neutral" \| "accent" \| "positive" \| "negative" \| number` |  | Colour of the tile's graphic or ground; a number picks a categorical colour, 0-based. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tile scale. |
| `align` | `"left" \| "center" \| "right"` |  | Text alignment. |
| `orientation` | `"vertical" \| "horizontal"` |  | Graphic under or beside the figure, as in `stat-tile`. |
| `icon` | `IconInput` |  | Icon for the `icon` and `unit` variants. |
| `target` | `number` |  | Goal for the `progress` and `ring` variants. |
| `targetLabel` | `string` | `"Target"` | Name for the target. |
| `max` | `number` |  | End of the scale for `progress` and `ring`; total count for `unit`. |
| `parts` | `{ label: string; value: number }[]` |  | Composition of the latest value, for `breakdown`. |
| `rank` | `number` |  | Position for the `rank` variant. |
| `rankOf` | `number` |  | Entries ranked. |
| `unitValue` | `number` |  | What one icon stands for in `unit`. |
| `edge` | `"left" \| "top"` |  | Edge of the rule on an `outline-accent` surface. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |
| `theme` | `ThemeInput` |  | A theme name such as `"ledger"`, or token overrides, passed on to the tile. A named theme paints its own ground. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `stat-tile` (atom), `sparkline` (atom)
- Used by: `kpi-grid` (molecule)

## Rules for this form

- Each chart inside follows the rules of its own component.
- Every chart inside needs its own `title` that states one fact, or a plain label.
- An icon prop takes a built-in icon name or a `path://` string holding one SVG path. A name that is not built in falls back to another icon, so use only the names in the icons guide.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.
- An icon is decoration. The label beside it must carry the meaning.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] No example data or example text is left in place.

## Reference

- Component reference with every example: https://insightcharts.dev/llms/trend-card.md
- Registry item: https://insightcharts.dev/r/trend-card.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/trend-card.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/trend-card
- These instructions as plain text: https://insightcharts.dev/agents/molecules/trend-card.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
