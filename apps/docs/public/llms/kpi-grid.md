# KPI grid (`kpi-grid`)

> A responsive grid of trend cards drawn from one dataset: each metric shows its latest value, its change and a graphic, in one `stat-tile` variant or a deliberate mix of them.

- Component: `KpiGrid` (import from `insightcharts`)
- Spec type: `"kpi-grid"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

The top of a dashboard or a monthly report: three to eight metrics tracked over the same periods. Pass one table with a column per metric.

## Avoid

Figures without a series behind them (use `stat-row`); comparing the metrics with each other on one scale (use `line-chart` or `small-multiples`); more than eight cards.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/kpi-grid
```

The file lands at `components/insightcharts/molecules/kpi-grid.tsx`. `@insightcharts/kpi-grid-demo` adds a ready-made example next to it.

## Usage

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  { month: "2024-01-01", users: 38100, mrr: 412000, churn: 4.2, response: 4.1 },
  { month: "2024-02-01", users: 39400, mrr: 428000, churn: 4, response: 3.9 },
  { month: "2024-03-01", users: 39000, mrr: 431000, churn: 3.9, response: 3.8 },
  { month: "2024-04-01", users: 40800, mrr: 455000, churn: 3.6, response: 3.2 },
  { month: "2024-05-01", users: 42200, mrr: 470000, churn: 3.1, response: 3.4 },
  { month: "2024-06-01", users: 41900, mrr: 476000, churn: 2.9, response: 2.9 },
  { month: "2024-07-01", users: 43500, mrr: 498000, churn: 2.6, response: 2.7 },
  { month: "2024-08-01", users: 44100, mrr: 511000, churn: 2.4, response: 2.6 },
  { month: "2024-09-01", users: 44500, mrr: 524000, churn: 2.3, response: 2.4 },
  { month: "2024-10-01", users: 46000, mrr: 548000, churn: 2.2, response: 2.3 },
  { month: "2024-11-01", users: 47200, mrr: 566000, churn: 2.1, response: 2.2 },
  { month: "2024-12-01", users: 48200, mrr: 589000, churn: 2.1, response: 2.2 },
];

<KpiGrid
  title="Monthly active users rose from 38,100 to 48,200 in 2024"
  subtitle="Four product metrics by month, 2024. Change is measured against January."
  data={data}
  x="month"
  metrics={[
    { y: "users", label: "Monthly active users", format: "compact" },
    { y: "mrr", label: "Recurring revenue", format: "currency:USD" },
    { y: "churn", label: "Monthly churn", format: "{value}%", change: "absolute", upIsGood: false },
    { y: "response", label: "Median first response", format: "{value} h", upIsGood: false },
  ]}
  source="Internal analytics"
  note="Illustrative data"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "kpi-grid",
  "title": "Monthly active users rose from 38,100 to 48,200 in 2024",
  "subtitle": "Four product metrics by month, 2024. Change is measured against January.",
  "data": [
    { "month": "2024-01-01", "users": 38100, "mrr": 412000, "churn": 4.2, "response": 4.1 },
    { "month": "2024-02-01", "users": 39400, "mrr": 428000, "churn": 4, "response": 3.9 },
    { "month": "2024-03-01", "users": 39000, "mrr": 431000, "churn": 3.9, "response": 3.8 },
    { "month": "2024-04-01", "users": 40800, "mrr": 455000, "churn": 3.6, "response": 3.2 },
    { "month": "2024-05-01", "users": 42200, "mrr": 470000, "churn": 3.1, "response": 3.4 },
    { "month": "2024-06-01", "users": 41900, "mrr": 476000, "churn": 2.9, "response": 2.9 },
    { "month": "2024-07-01", "users": 43500, "mrr": 498000, "churn": 2.6, "response": 2.7 },
    { "month": "2024-08-01", "users": 44100, "mrr": 511000, "churn": 2.4, "response": 2.6 },
    { "month": "2024-09-01", "users": 44500, "mrr": 524000, "churn": 2.3, "response": 2.4 },
    { "month": "2024-10-01", "users": 46000, "mrr": 548000, "churn": 2.2, "response": 2.3 },
    { "month": "2024-11-01", "users": 47200, "mrr": 566000, "churn": 2.1, "response": 2.2 },
    { "month": "2024-12-01", "users": 48200, "mrr": 589000, "churn": 2.1, "response": 2.2 }
  ],
  "x": "month",
  "metrics": [
    { "y": "users", "label": "Monthly active users", "format": "compact" },
    { "y": "mrr", "label": "Recurring revenue", "format": "currency:USD" },
    {
      "y": "churn",
      "label": "Monthly churn",
      "format": "{value}%",
      "change": "absolute",
      "upIsGood": false
    },
    { "y": "response", "label": "Median first response", "format": "{value} h", "upIsGood": false }
  ],
  "source": "Internal analytics",
  "note": "Illustrative data"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DataInput` |  | One dataset in time order: a row per period, a column per metric. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` |  | Applied once, before the cards read the rows. |
| `x` | `string` |  | Period field shared by every metric. |
| `metrics` (required) | `{ y, label, format?, upIsGood?, compare?, change?, deltaFormat?, deltaLabel?, context?, value?, delta?, kind?, variant?, surface?, tone?, size?, align?, orientation?, icon?, target?, targetLabel?, max?, parts?, rank?, rankOf?, unitValue?, showTrend? }[]` |  | One card per metric; each takes the props of `trend-card`, including its own `variant`, `surface`, `tone` and `size`. |
| `variant` | `StatTileVariant` |  | The display of every card: any `stat-tile` variant (`sparkline`, `area`, `bars`, `dots`, `split`, `compact`, `progress`, `ring`, `comparison`, `delta-first`, `icon`, `breakdown`, `rank`, `hero`, `filled`, `tinted`, `borderless`, `outline-accent`). Omit for the original cards with an interactive sparkline. |
| `variants` | `StatTileVariant[]` |  | A display per card, by position, so one grid mixes them on purpose: `["split", "area", "bars", "progress"]`. A metric's own `variant` wins; cards past the end use `variant`. |
| `surface` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent"` |  | The ground of every card. |
| `tone` | `"neutral" \| "accent" \| "positive" \| "negative" \| number \| "series"` |  | Tone of every card. `series` gives each card the next categorical colour. |
| `layout` | `"cards" \| "dividers"` | `"cards"` | Separate cards, or open tiles with hairlines between them. |
| `featured` | `boolean` | `false` | The first card spans two columns and is set one size larger. |
| `density` | `"dense" \| "default" \| "roomy"` | `"default"` | Spacing and type scale: cards are `sm`, `md` or `lg`, with 8, 12 or 16px between them. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |
| `compare` | `"first" \| "previous" \| number` | `"first"` | Baseline for every card's change; a metric can override it. |
| `change` | `"percent" \| "absolute"` | `"percent"` | Relative change, or the difference between the two values; a metric can override it. An absolute change of a percentage metric is shown in percentage points ("−2.1 pts"). |
| `deltaFormat` | `FormatSpec` |  | Format for absolute changes, e.g. `"{value} pp"` or `"signed"`; a metric can override it. Default: points for percentage formats, otherwise the metric's own `format`. |
| `columns` | `number` |  | Preferred columns. Default: up to four, reduced to fit cards of at least 200px. |
| `title` | `string` |  | The main fact with its number, or a plain label. |
| `subtitle` | `string` |  | Population and period. |
| `source` | `string` |  | Shown under the grid as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A theme name such as `"ledger"`, or token overrides, passed on to every card. A named theme paints its own ground. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [trend-card](https://insightcharts.dev/llms/trend-card.md), [stat-tile](https://insightcharts.dev/llms/stat-tile.md)
- Used by: [scorecard](https://insightcharts.dev/llms/scorecard.md)

## More examples

### Area cards, one colour per metric

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  {
    month: "2024-01-01",
    users: 21400,
    mrr: 412000,
    churn: 4.2,
    response: 4.1,
    nps: 31,
    tickets: 1840,
  },
  {
    month: "2024-02-01",
    users: 23900,
    mrr: 428000,
    churn: 4,
    response: 3.9,
    nps: 32,
    tickets: 1778,
  },
  {
    month: "2024-03-01",
    users: 25100,
    mrr: 431000,
    churn: 3.9,
    response: 3.8,
    nps: 34,
    tickets: 1716,
  },
  {
    month: "2024-04-01",
    users: 28800,
    mrr: 455000,
    churn: 3.6,
    response: 3.2,
    nps: 35,
    tickets: 1654,
  },
  {
    month: "2024-05-01",
    users: 31600,
    mrr: 470000,
    churn: 3.1,
    response: 3.4,
    nps: 37,
    tickets: 1592,
  },
  {
    month: "2024-06-01",
    users: 33200,
    mrr: 476000,
    churn: 2.9,
    response: 2.9,
    nps: 38,
    tickets: 1530,
  },
  {
    month: "2024-07-01",
    users: 36900,
    mrr: 498000,
    churn: 2.6,
    response: 2.7,
    nps: 39,
    tickets: 1468,
  },
  {
    month: "2024-08-01",
    users: 39800,
    mrr: 511000,
    churn: 2.4,
    response: 2.6,
    nps: 41,
    tickets: 1406,
  },
  // ... 4 more rows
];

<KpiGrid
  title="Recurring revenue rose from $412,000 to $589,000 in 2024"
  data={data}
  x="month"
  variant="area"
  tone="series"
  metrics={[
    { y: "users", label: "Monthly active users", format: "integer", icon: "group", target: 50000 },
    {
      y: "mrr",
      label: "Recurring revenue",
      format: "currency:USD",
      icon: "banknote",
      target: 600000,
    },
    {
      y: "churn",
      label: "Monthly churn",
      format: "{value}%",
      change: "absolute",
      upIsGood: false,
      icon: "heart",
    },
    {
      y: "response",
      label: "Median first response",
      format: "{value} h",
      upIsGood: false,
      icon: "clock",
    },
  ]}
  note="Illustrative data"
/>
```

### Featured split card with a mix of displays, ledger

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  {
    month: "2024-01-01",
    users: 21400,
    mrr: 412000,
    churn: 4.2,
    response: 4.1,
    nps: 31,
    tickets: 1840,
  },
  {
    month: "2024-02-01",
    users: 23900,
    mrr: 428000,
    churn: 4,
    response: 3.9,
    nps: 32,
    tickets: 1778,
  },
  {
    month: "2024-03-01",
    users: 25100,
    mrr: 431000,
    churn: 3.9,
    response: 3.8,
    nps: 34,
    tickets: 1716,
  },
  {
    month: "2024-04-01",
    users: 28800,
    mrr: 455000,
    churn: 3.6,
    response: 3.2,
    nps: 35,
    tickets: 1654,
  },
  {
    month: "2024-05-01",
    users: 31600,
    mrr: 470000,
    churn: 3.1,
    response: 3.4,
    nps: 37,
    tickets: 1592,
  },
  {
    month: "2024-06-01",
    users: 33200,
    mrr: 476000,
    churn: 2.9,
    response: 2.9,
    nps: 38,
    tickets: 1530,
  },
  {
    month: "2024-07-01",
    users: 36900,
    mrr: 498000,
    churn: 2.6,
    response: 2.7,
    nps: 39,
    tickets: 1468,
  },
  {
    month: "2024-08-01",
    users: 39800,
    mrr: 511000,
    churn: 2.4,
    response: 2.6,
    nps: 41,
    tickets: 1406,
  },
  // ... 4 more rows
];

<KpiGrid
  theme="ledger"
  title="Monthly active users rose from 21,400 to 48,210 in 2024"
  subtitle="Five product metrics by month, 2024. Change is measured against January."
  data={data}
  x="month"
  featured
  columns={3}
  variants={["split", "progress", "bars", "dots", "area"]}
  metrics={[
    {
      y: "users",
      label: "Monthly active users",
      format: "integer",
      icon: "group",
      target: 50000,
      surface: "filled",
    },
    {
      y: "mrr",
      label: "Recurring revenue",
      format: "currency:USD",
      icon: "banknote",
      target: 600000,
      targetLabel: "Plan",
    },
    {
      y: "churn",
      label: "Monthly churn",
      format: "{value}%",
      change: "absolute",
      upIsGood: false,
      icon: "heart",
    },
    {
      y: "response",
      label: "Median first response",
      format: "{value} h",
      upIsGood: false,
      icon: "clock",
    },
    { y: "nps", label: "Net promoter score", change: "absolute" },
  ]}
  note="Illustrative data"
/>
```

### Dividers instead of cards, editorial

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  { year: "2017", solar: 1.9, wind: 5.6, coal: 38.2, gas: 22.9 },
  { year: "2018", solar: 2.4, wind: 6.1, coal: 37.9, gas: 23 },
  { year: "2019", solar: 2.9, wind: 6.9, coal: 36.4, gas: 23.5 },
  { year: "2020", solar: 3.6, wind: 7.8, coal: 35.1, gas: 23.4 },
  { year: "2021", solar: 4.4, wind: 8.4, coal: 36, gas: 22.8 },
  { year: "2022", solar: 5.6, wind: 9.3, coal: 35.6, gas: 22.2 },
  { year: "2023", solar: 7.1, wind: 10.1, coal: 34.9, gas: 22.4 },
  { year: "2024", solar: 9.2, wind: 10.9, coal: 33.8, gas: 22.1 },
];

<KpiGrid
  theme="editorial"
  title="Solar supplied 9.2% of electricity in 2024"
  subtitle="Share of generation by source, 2017 to 2024, with the change since 2017"
  data={data}
  x="year"
  layout="dividers"
  variant="sparkline"
  change="absolute"
  deltaFormat="{value} pts"
  metrics={[
    { y: "solar", label: "Solar", format: "{value}%" },
    { y: "wind", label: "Wind", format: "{value}%", tone: 1 },
    { y: "gas", label: "Gas", format: "{value}%", tone: "neutral", upIsGood: false },
    { y: "coal", label: "Coal", format: "{value}%", tone: "neutral", upIsGood: false },
  ]}
  note="Illustrative data"
/>
```

### Dense compact rows in two columns, mono

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  {
    month: "2024-01-01",
    users: 21400,
    mrr: 412000,
    churn: 4.2,
    response: 4.1,
    nps: 31,
    tickets: 1840,
  },
  {
    month: "2024-02-01",
    users: 23900,
    mrr: 428000,
    churn: 4,
    response: 3.9,
    nps: 32,
    tickets: 1778,
  },
  {
    month: "2024-03-01",
    users: 25100,
    mrr: 431000,
    churn: 3.9,
    response: 3.8,
    nps: 34,
    tickets: 1716,
  },
  {
    month: "2024-04-01",
    users: 28800,
    mrr: 455000,
    churn: 3.6,
    response: 3.2,
    nps: 35,
    tickets: 1654,
  },
  {
    month: "2024-05-01",
    users: 31600,
    mrr: 470000,
    churn: 3.1,
    response: 3.4,
    nps: 37,
    tickets: 1592,
  },
  {
    month: "2024-06-01",
    users: 33200,
    mrr: 476000,
    churn: 2.9,
    response: 2.9,
    nps: 38,
    tickets: 1530,
  },
  {
    month: "2024-07-01",
    users: 36900,
    mrr: 498000,
    churn: 2.6,
    response: 2.7,
    nps: 39,
    tickets: 1468,
  },
  {
    month: "2024-08-01",
    users: 39800,
    mrr: 511000,
    churn: 2.4,
    response: 2.6,
    nps: 41,
    tickets: 1406,
  },
  // ... 4 more rows
];

<KpiGrid
  theme="mono"
  data={data}
  x="month"
  variant="compact"
  density="dense"
  columns={2}
  compare="previous"
  metrics={[
    { y: "users", label: "Monthly active users", format: "integer", icon: "group", target: 50000 },
    {
      y: "mrr",
      label: "Recurring revenue",
      format: "currency:USD",
      icon: "banknote",
      target: 600000,
    },
    {
      y: "churn",
      label: "Monthly churn",
      format: "{value}%",
      change: "absolute",
      upIsGood: false,
      icon: "heart",
    },
    {
      y: "response",
      label: "Median first response",
      format: "{value} h",
      upIsGood: false,
      icon: "clock",
    },
    { y: "nps", label: "Net promoter score", change: "absolute" },
    { y: "tickets", label: "Support tickets", upIsGood: false },
  ]}
  note="Illustrative data"
/>
```

### Icons on tinted cards, earth

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  {
    month: "2024-01-01",
    users: 21400,
    mrr: 412000,
    churn: 4.2,
    response: 4.1,
    nps: 31,
    tickets: 1840,
  },
  {
    month: "2024-02-01",
    users: 23900,
    mrr: 428000,
    churn: 4,
    response: 3.9,
    nps: 32,
    tickets: 1778,
  },
  {
    month: "2024-03-01",
    users: 25100,
    mrr: 431000,
    churn: 3.9,
    response: 3.8,
    nps: 34,
    tickets: 1716,
  },
  {
    month: "2024-04-01",
    users: 28800,
    mrr: 455000,
    churn: 3.6,
    response: 3.2,
    nps: 35,
    tickets: 1654,
  },
  {
    month: "2024-05-01",
    users: 31600,
    mrr: 470000,
    churn: 3.1,
    response: 3.4,
    nps: 37,
    tickets: 1592,
  },
  {
    month: "2024-06-01",
    users: 33200,
    mrr: 476000,
    churn: 2.9,
    response: 2.9,
    nps: 38,
    tickets: 1530,
  },
  {
    month: "2024-07-01",
    users: 36900,
    mrr: 498000,
    churn: 2.6,
    response: 2.7,
    nps: 39,
    tickets: 1468,
  },
  {
    month: "2024-08-01",
    users: 39800,
    mrr: 511000,
    churn: 2.4,
    response: 2.6,
    nps: 41,
    tickets: 1406,
  },
  // ... 4 more rows
];

<KpiGrid
  theme="earth"
  data={data}
  x="month"
  variant="icon"
  surface="tinted"
  tone="series"
  metrics={[
    { y: "users", label: "Monthly active users", format: "integer", icon: "group", target: 50000 },
    {
      y: "mrr",
      label: "Recurring revenue",
      format: "currency:USD",
      icon: "banknote",
      target: 600000,
    },
    {
      y: "churn",
      label: "Monthly churn",
      format: "{value}%",
      change: "absolute",
      upIsGood: false,
      icon: "heart",
    },
    {
      y: "response",
      label: "Median first response",
      format: "{value} h",
      upIsGood: false,
      icon: "clock",
    },
  ]}
  note="Illustrative data"
/>
```

### Filled cards, roomy, poster

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  {
    month: "2024-01-01",
    users: 21400,
    mrr: 412000,
    churn: 4.2,
    response: 4.1,
    nps: 31,
    tickets: 1840,
  },
  {
    month: "2024-02-01",
    users: 23900,
    mrr: 428000,
    churn: 4,
    response: 3.9,
    nps: 32,
    tickets: 1778,
  },
  {
    month: "2024-03-01",
    users: 25100,
    mrr: 431000,
    churn: 3.9,
    response: 3.8,
    nps: 34,
    tickets: 1716,
  },
  {
    month: "2024-04-01",
    users: 28800,
    mrr: 455000,
    churn: 3.6,
    response: 3.2,
    nps: 35,
    tickets: 1654,
  },
  {
    month: "2024-05-01",
    users: 31600,
    mrr: 470000,
    churn: 3.1,
    response: 3.4,
    nps: 37,
    tickets: 1592,
  },
  {
    month: "2024-06-01",
    users: 33200,
    mrr: 476000,
    churn: 2.9,
    response: 2.9,
    nps: 38,
    tickets: 1530,
  },
  {
    month: "2024-07-01",
    users: 36900,
    mrr: 498000,
    churn: 2.6,
    response: 2.7,
    nps: 39,
    tickets: 1468,
  },
  {
    month: "2024-08-01",
    users: 39800,
    mrr: 511000,
    churn: 2.4,
    response: 2.6,
    nps: 41,
    tickets: 1406,
  },
  // ... 4 more rows
];

<KpiGrid
  theme="poster"
  data={data}
  x="month"
  variant="filled"
  tone="series"
  density="roomy"
  columns={2}
  metrics={[
    { y: "users", label: "Monthly active users", format: "integer", icon: "group", target: 50000 },
    {
      y: "mrr",
      label: "Recurring revenue",
      format: "currency:USD",
      icon: "banknote",
      target: 600000,
    },
    {
      y: "churn",
      label: "Monthly churn",
      format: "{value}%",
      change: "absolute",
      upIsGood: false,
      icon: "heart",
    },
    {
      y: "response",
      label: "Median first response",
      format: "{value} h",
      upIsGood: false,
      icon: "clock",
    },
  ]}
  note="Illustrative data"
/>
```

### Progress toward targets, science

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  { year: "2019", measles: 0.9, polio: 0.93, hpv: 0.52 },
  { year: "2020", measles: 0.87, polio: 0.91, hpv: 0.5 },
  { year: "2021", measles: 0.86, polio: 0.9, hpv: 0.55 },
  { year: "2022", measles: 0.88, polio: 0.91, hpv: 0.58 },
  { year: "2023", measles: 0.9, polio: 0.92, hpv: 0.61 },
  { year: "2024", measles: 0.91, polio: 0.93, hpv: 0.64 },
];

<KpiGrid
  theme="science"
  title="Measles vaccination coverage reached 91% in 2024"
  subtitle="Coverage by vaccine, 2019 to 2024, against the WHO target"
  data={data}
  x="year"
  variant="progress"
  change="absolute"
  tone="series"
  metrics={[
    { y: "measles", label: "Measles, first dose", format: "percent", target: 0.95, max: 1 },
    { y: "polio", label: "Polio, third dose", format: "percent", target: 0.95, max: 1 },
    { y: "hpv", label: "HPV, girls aged 15", format: "percent", target: 0.9, max: 1 },
  ]}
  note="Illustrative data"
/>
```

### Change first, noir

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  { matchday: "matchday 5", points: 9, scored: 10, conceded: 7, attendance: 38900 },
  { matchday: "matchday 10", points: 19, scored: 22, conceded: 12, attendance: 39600 },
  { matchday: "matchday 15", points: 28, scored: 31, conceded: 18, attendance: 40100 },
  { matchday: "matchday 20", points: 40, scored: 45, conceded: 22, attendance: 40800 },
  { matchday: "matchday 25", points: 49, scored: 55, conceded: 27, attendance: 41000 },
  { matchday: "matchday 30", points: 61, scored: 68, conceded: 31, attendance: 41200 },
];

<KpiGrid
  theme="noir"
  title="The club had 61 points after 30 matches"
  subtitle="Season totals after each block of five matches. Change is against matchday 25."
  data={data}
  x="matchday"
  compare="previous"
  variant="delta-first"
  layout="dividers"
  metrics={[
    { y: "points", label: "Points" },
    { y: "scored", label: "Goals scored", tone: 1 },
    { y: "conceded", label: "Goals conceded", upIsGood: false, tone: 2 },
    { y: "attendance", label: "Average attendance", format: "integer", tone: 1 },
  ]}
  note="Illustrative data"
/>
```

### Comparison with the first week, sunrise

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  { week: "Week 44", visits: 15400, orders: 5010, basket: 41.2 },
  { week: "Week 45", visits: 15900, orders: 5180, basket: 41.6 },
  { week: "Week 46", visits: 16200, orders: 5260, basket: 41.9 },
  { week: "Week 47", visits: 16000, orders: 5230, basket: 42.4 },
  { week: "Week 48", visits: 17100, orders: 5640, basket: 42 },
  { week: "Week 49", visits: 17800, orders: 5890, basket: 42.3 },
  { week: "Week 50", visits: 18640, orders: 6120, basket: 42.6 },
];

<KpiGrid
  theme="sunrise"
  data={data}
  x="week"
  variant="comparison"
  metrics={[
    { y: "visits", label: "Store visits", format: "integer" },
    { y: "orders", label: "Orders", format: "integer" },
    { y: "basket", label: "Average basket", format: "currency:EUR" },
  ]}
  note="Illustrative data"
/>
```

### Bars on a poster ground, blueprint

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  { week: "week 1", units: 212, scrap: 31, overtime: 46 },
  { week: "week 2", units: 240, scrap: 28, overtime: 52 },
  { week: "week 3", units: 198, scrap: 33, overtime: 40 },
  { week: "week 4", units: 265, scrap: 24, overtime: 58 },
  { week: "week 5", units: 281, scrap: 22, overtime: 61 },
  { week: "week 6", units: 254, scrap: 25, overtime: 49 },
  { week: "week 7", units: 302, scrap: 19, overtime: 66 },
  { week: "week 8", units: 318, scrap: 17, overtime: 70 },
];

<KpiGrid
  theme="blueprint"
  data={data}
  x="week"
  variant="bars"
  metrics={[
    { y: "units", label: "Units assembled per shift" },
    { y: "scrap", label: "Units scrapped per shift", upIsGood: false },
    { y: "overtime", label: "Overtime hours per week", upIsGood: false },
  ]}
  note="Illustrative data"
/>
```

### Outline rule with dots, six metrics, paper

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  {
    month: "2024-01-01",
    users: 21400,
    mrr: 412000,
    churn: 4.2,
    response: 4.1,
    nps: 31,
    tickets: 1840,
  },
  {
    month: "2024-02-01",
    users: 23900,
    mrr: 428000,
    churn: 4,
    response: 3.9,
    nps: 32,
    tickets: 1778,
  },
  {
    month: "2024-03-01",
    users: 25100,
    mrr: 431000,
    churn: 3.9,
    response: 3.8,
    nps: 34,
    tickets: 1716,
  },
  {
    month: "2024-04-01",
    users: 28800,
    mrr: 455000,
    churn: 3.6,
    response: 3.2,
    nps: 35,
    tickets: 1654,
  },
  {
    month: "2024-05-01",
    users: 31600,
    mrr: 470000,
    churn: 3.1,
    response: 3.4,
    nps: 37,
    tickets: 1592,
  },
  {
    month: "2024-06-01",
    users: 33200,
    mrr: 476000,
    churn: 2.9,
    response: 2.9,
    nps: 38,
    tickets: 1530,
  },
  {
    month: "2024-07-01",
    users: 36900,
    mrr: 498000,
    churn: 2.6,
    response: 2.7,
    nps: 39,
    tickets: 1468,
  },
  {
    month: "2024-08-01",
    users: 39800,
    mrr: 511000,
    churn: 2.4,
    response: 2.6,
    nps: 41,
    tickets: 1406,
  },
  // ... 4 more rows
];

<KpiGrid
  theme="paper"
  data={data}
  x="month"
  variant="dots"
  surface="outline-accent"
  columns={3}
  metrics={[
    { y: "users", label: "Monthly active users", format: "integer", icon: "group", target: 50000 },
    {
      y: "mrr",
      label: "Recurring revenue",
      format: "currency:USD",
      icon: "banknote",
      target: 600000,
    },
    {
      y: "churn",
      label: "Monthly churn",
      format: "{value}%",
      change: "absolute",
      upIsGood: false,
      icon: "heart",
    },
    {
      y: "response",
      label: "Median first response",
      format: "{value} h",
      upIsGood: false,
      icon: "clock",
    },
    { y: "nps", label: "Net promoter score", change: "absolute" },
    { y: "tickets", label: "Support tickets", upIsGood: false },
  ]}
  note="Illustrative data"
/>
```

### Rings and a hero card, ocean

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  { year: "2017", gw: 2.1, farms: 3, protectedShare: 0.031 },
  { year: "2018", gw: 3.4, farms: 5, protectedShare: 0.038 },
  { year: "2019", gw: 5, farms: 8, protectedShare: 0.044 },
  { year: "2020", gw: 7.9, farms: 12, protectedShare: 0.052 },
  { year: "2021", gw: 11.2, farms: 17, protectedShare: 0.061 },
  { year: "2022", gw: 14.8, farms: 23, protectedShare: 0.069 },
  { year: "2023", gw: 19.6, farms: 31, protectedShare: 0.076 },
  { year: "2024", gw: 26.3, farms: 45, protectedShare: 0.083 },
];

<KpiGrid
  theme="ocean"
  title="Offshore wind capacity reached 26.3 GW in 2024"
  data={data}
  x="year"
  compare="previous"
  featured
  variants={["area", "ring", "ring"]}
  metrics={[
    { y: "gw", label: "Offshore wind capacity", format: "{value} GW" },
    { y: "farms", label: "Wind farms connected", max: 60, context: "60 are planned by 2026" },
    {
      y: "protectedShare",
      label: "Sea area protected",
      format: "percent",
      change: "absolute",
      max: 0.3,
      context: "The 2030 target is 30%",
    },
  ]}
  note="Illustrative data"
/>
```

### Two columns, change against the previous month

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  { month: "2024-01-01", users: 38100, mrr: 412000, churn: 4.2, response: 4.1 },
  { month: "2024-02-01", users: 39400, mrr: 428000, churn: 4, response: 3.9 },
  { month: "2024-03-01", users: 39000, mrr: 431000, churn: 3.9, response: 3.8 },
  { month: "2024-04-01", users: 40800, mrr: 455000, churn: 3.6, response: 3.2 },
  { month: "2024-05-01", users: 42200, mrr: 470000, churn: 3.1, response: 3.4 },
  { month: "2024-06-01", users: 41900, mrr: 476000, churn: 2.9, response: 2.9 },
  { month: "2024-07-01", users: 43500, mrr: 498000, churn: 2.6, response: 2.7 },
  { month: "2024-08-01", users: 44100, mrr: 511000, churn: 2.4, response: 2.6 },
  // ... 4 more rows
];

<KpiGrid
  data={data}
  x="month"
  compare="previous"
  columns={2}
  metrics={[
    { y: "users", label: "Monthly active users", format: "compact" },
    { y: "mrr", label: "Recurring revenue", format: "currency:USD", kind: "bar" },
  ]}
/>
```

### Six metrics

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  {
    month: "2024-01-01",
    users: 38100,
    mrr: 412000,
    churn: 4.2,
    response: 4.1,
    nps: 31,
    tickets: 1840,
  },
  {
    month: "2024-02-01",
    users: 39400,
    mrr: 428000,
    churn: 4,
    response: 3.9,
    nps: 32,
    tickets: 1778,
  },
  {
    month: "2024-03-01",
    users: 39000,
    mrr: 431000,
    churn: 3.9,
    response: 3.8,
    nps: 34,
    tickets: 1716,
  },
  {
    month: "2024-04-01",
    users: 40800,
    mrr: 455000,
    churn: 3.6,
    response: 3.2,
    nps: 35,
    tickets: 1654,
  },
  {
    month: "2024-05-01",
    users: 42200,
    mrr: 470000,
    churn: 3.1,
    response: 3.4,
    nps: 37,
    tickets: 1592,
  },
  {
    month: "2024-06-01",
    users: 41900,
    mrr: 476000,
    churn: 2.9,
    response: 2.9,
    nps: 38,
    tickets: 1530,
  },
  {
    month: "2024-07-01",
    users: 43500,
    mrr: 498000,
    churn: 2.6,
    response: 2.7,
    nps: 39,
    tickets: 1468,
  },
  {
    month: "2024-08-01",
    users: 44100,
    mrr: 511000,
    churn: 2.4,
    response: 2.6,
    nps: 41,
    tickets: 1406,
  },
  // ... 4 more rows
];

<KpiGrid
  data={data}
  x="month"
  metrics={[
    { y: "users", label: "Monthly active users", format: "compact" },
    { y: "mrr", label: "Recurring revenue", format: "currency:USD" },
    { y: "churn", label: "Monthly churn", format: "{value}%", change: "absolute", upIsGood: false },
    { y: "response", label: "Median first response", format: "{value} h", upIsGood: false },
    { y: "nps", label: "Net promoter score", change: "absolute" },
    { y: "tickets", label: "Support tickets", upIsGood: false },
  ]}
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/kpi-grid.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/kpi-grid.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
