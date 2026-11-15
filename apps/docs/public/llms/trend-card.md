# Trend card (`trend-card`)

> A KPI card computed from a series: the latest value, its change against a baseline in the same data, and a sparkline of the series.

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
| `theme` | `ThemeInput` |  | Theme override, passed on to the tile and sparkline. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [stat-tile](https://insightcharts.dev/llms/stat-tile.md), [sparkline](https://insightcharts.dev/llms/sparkline.md)
- Used by: [kpi-grid](https://insightcharts.dev/llms/kpi-grid.md)

## More examples

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
