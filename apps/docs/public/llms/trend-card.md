# Trend card (`trend-card`)

> A KPI card computed from a series: the latest value, its change against a baseline in the same data, and a trend graphic, in any `stat-tile` variant.

- Component: `TrendCard` (import from `insightcharts`)
- Spec type: `"trend-card"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

A metric whose recent history matters as much as its level: users, revenue, response time. Pass the series and field names; the figure, the change and the sparkline all come from the same rows, so they cannot disagree.

## Avoid

A number with no history (use `big-number` or `stat-tile`); several metrics from one dataset (use `kpi-grid`); a series the reader must read values from (use `line-chart`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/trend-card
```

The file lands at `components/insightcharts/molecules/trend-card.tsx`. `@insightcharts/trend-card-demo` adds a ready-made example next to it.

## Usage

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

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

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

## Composition

- Composes: [stat-tile](https://insightcharts.dev/llms/stat-tile.md), [sparkline](https://insightcharts.dev/llms/sparkline.md)
- Used by: [kpi-grid](https://insightcharts.dev/llms/kpi-grid.md)

## More examples

### Area along the bottom edge

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { month: "2024-01-01", users: 21400 },
  { month: "2024-02-01", users: 23900 },
  { month: "2024-03-01", users: 25100 },
  { month: "2024-04-01", users: 28800 },
  { month: "2024-05-01", users: 31600 },
  { month: "2024-06-01", users: 33200 },
  { month: "2024-07-01", users: 36900 },
  { month: "2024-08-01", users: 39800 },
  // ... 4 more rows
];

<TrendCard
  label="Monthly active users"
  data={data}
  x="month"
  y="users"
  format="integer"
  variant="area"
  style={{ maxWidth: 300 }}
/>
```

### Split, figure left and line right, ledger

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { month: "2024-01-01", users: 21400 },
  { month: "2024-02-01", users: 23900 },
  { month: "2024-03-01", users: 25100 },
  { month: "2024-04-01", users: 28800 },
  { month: "2024-05-01", users: 31600 },
  { month: "2024-06-01", users: 33200 },
  { month: "2024-07-01", users: 36900 },
  { month: "2024-08-01", users: 39800 },
  // ... 4 more rows
];

<TrendCard
  label="Monthly active users"
  data={data}
  x="month"
  y="users"
  format="integer"
  theme="ledger"
  variant="split"
  style={{ maxWidth: 440 }}
/>
```

### Filled ground with a line

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { month: "2024-01-01", users: 21400 },
  { month: "2024-02-01", users: 23900 },
  { month: "2024-03-01", users: 25100 },
  { month: "2024-04-01", users: 28800 },
  { month: "2024-05-01", users: 31600 },
  { month: "2024-06-01", users: 33200 },
  { month: "2024-07-01", users: 36900 },
  { month: "2024-08-01", users: 39800 },
  // ... 4 more rows
];

<TrendCard
  label="Monthly active users"
  data={data}
  x="month"
  y="users"
  format="integer"
  variant="filled"
  tone={4}
  style={{ maxWidth: 300 }}
/>
```

### Comparison with the first period, editorial

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { month: "2024-01-01", users: 21400 },
  { month: "2024-02-01", users: 23900 },
  { month: "2024-03-01", users: 25100 },
  { month: "2024-04-01", users: 28800 },
  { month: "2024-05-01", users: 31600 },
  { month: "2024-06-01", users: 33200 },
  { month: "2024-07-01", users: 36900 },
  { month: "2024-08-01", users: 39800 },
  // ... 4 more rows
];

<TrendCard
  label="Monthly active users"
  data={data}
  x="month"
  y="users"
  format="integer"
  theme="editorial"
  variant="comparison"
  style={{ maxWidth: 320 }}
/>
```

### Progress toward a target, science

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { month: "2024-01-01", users: 21400 },
  { month: "2024-02-01", users: 23900 },
  { month: "2024-03-01", users: 25100 },
  { month: "2024-04-01", users: 28800 },
  { month: "2024-05-01", users: 31600 },
  { month: "2024-06-01", users: 33200 },
  { month: "2024-07-01", users: 36900 },
  { month: "2024-08-01", users: 39800 },
  // ... 4 more rows
];

<TrendCard
  label="Monthly active users"
  data={data}
  x="month"
  y="users"
  format="integer"
  theme="science"
  variant="progress"
  target={50000}
  targetLabel="Q4 target"
  compare={3}
  style={{ maxWidth: 320 }}
/>
```

### Ring, forest

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { year: "2019", ha: 80 },
  { year: "2020", ha: 190 },
  { year: "2021", ha: 330 },
  { year: "2022", ha: 480 },
  { year: "2023", ha: 620 },
  { year: "2024", ha: 1240 },
];

<TrendCard
  theme="forest"
  label="Native woodland replanted, hectares"
  data={data}
  x="year"
  y="ha"
  format="integer"
  variant="ring"
  max={2000}
  context="The 2026 goal is 2,000 hectares."
  compare="previous"
  style={{ maxWidth: 360 }}
/>
```

### Bars for weekly counts, blueprint

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { week: "week 1", units: 212 },
  { week: "week 2", units: 240 },
  { week: "week 3", units: 198 },
  { week: "week 4", units: 265 },
  { week: "week 5", units: 281 },
  { week: "week 6", units: 254 },
  { week: "week 7", units: 302 },
  { week: "week 8", units: 318 },
];

<TrendCard
  theme="blueprint"
  label="Units assembled per shift"
  data={data}
  x="week"
  y="units"
  variant="bars"
  style={{ maxWidth: 300 }}
/>
```

### Change first on a tinted ground, sunrise

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { week: "week 44", visits: 15400 },
  { week: "week 45", visits: 15900 },
  { week: "week 46", visits: 16200 },
  { week: "week 47", visits: 16000 },
  { week: "week 48", visits: 17100 },
  { week: "week 49", visits: 17800 },
  { week: "week 50", visits: 18640 },
];

<TrendCard
  theme="sunrise"
  label="Store visits per week"
  data={data}
  x="week"
  y="visits"
  format="integer"
  variant="delta-first"
  surface="tinted"
  tone={1}
  style={{ maxWidth: 300 }}
/>
```

### Dots, large, noir

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { matchday: "matchday 5", points: 9 },
  { matchday: "matchday 10", points: 19 },
  { matchday: "matchday 15", points: 28 },
  { matchday: "matchday 20", points: 40 },
  { matchday: "matchday 25", points: 49 },
  { matchday: "matchday 30", points: 61 },
];

<TrendCard
  theme="noir"
  label="Points after each block of five matches"
  data={data}
  x="matchday"
  y="points"
  variant="dots"
  size="lg"
  compare="previous"
  style={{ maxWidth: 360 }}
/>
```

### Compact row, mono

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { month: "2024-01-01", users: 21400 },
  { month: "2024-02-01", users: 23900 },
  { month: "2024-03-01", users: 25100 },
  { month: "2024-04-01", users: 28800 },
  { month: "2024-05-01", users: 31600 },
  { month: "2024-06-01", users: 33200 },
  { month: "2024-07-01", users: 36900 },
  { month: "2024-08-01", users: 39800 },
  // ... 4 more rows
];

<TrendCard
  label="Monthly active users"
  data={data}
  x="month"
  y="users"
  format="integer"
  theme="mono"
  variant="compact"
  compare="previous"
  style={{ maxWidth: 440 }}
/>
```

### Hero with an outline rule, paper

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { year: "2019", bill: 1138 },
  { year: "2020", bill: 1042 },
  { year: "2021", bill: 1277 },
  { year: "2022", bill: 2100 },
  { year: "2023", bill: 1960 },
  { year: "2024", bill: 1717 },
];

<TrendCard
  theme="paper"
  label="Average annual energy bill"
  data={data}
  x="year"
  y="bill"
  format="currency:GBP"
  compare="previous"
  upIsGood={false}
  variant="hero"
  surface="outline-accent"
  style={{ maxWidth: 420 }}
/>
```

### Down is good, trend on the right

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { month: "2024-01-01", hours: 4.1 },
  { month: "2024-02-01", hours: 3.9 },
  { month: "2024-03-01", hours: 3.8 },
  { month: "2024-04-01", hours: 3.2 },
  { month: "2024-05-01", hours: 3.4 },
  { month: "2024-06-01", hours: 2.9 },
  { month: "2024-07-01", hours: 2.7 },
  { month: "2024-08-01", hours: 2.4 },
  // ... 1 more rows
];

<TrendCard
  label="Median first-response time"
  data={data}
  x="month"
  y="hours"
  format="{value} h"
  upIsGood={false}
  trendPosition="right"
  style={{ maxWidth: 440 }}
/>
```

### Absolute change against the previous period, bars

```tsx
import { TrendCard } from "insightcharts";

const data = [
  { month: "2024-01-01", rate: 3.9 },
  { month: "2024-02-01", rate: 3.8 },
  { month: "2024-03-01", rate: 3.8 },
  { month: "2024-04-01", rate: 3.6 },
  { month: "2024-05-01", rate: 3.5 },
  { month: "2024-06-01", rate: 3.6 },
  { month: "2024-07-01", rate: 3.4 },
  { month: "2024-08-01", rate: 3.7 },
  // ... 4 more rows
];

<TrendCard
  label="Unemployment rate"
  data={data}
  x="month"
  y="rate"
  format="{value}%"
  compare="previous"
  change="absolute"
  upIsGood={false}
  kind="bar"
  context="Highest month of 2024"
  style={{ maxWidth: 300 }}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/trend-card.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/trend-card.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
