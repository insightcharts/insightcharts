# KPI grid (`kpi-grid`)

> A responsive grid of trend cards drawn from one dataset: each metric shows its latest value, its change and a sparkline.

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
| `metrics` (required) | `{ y, label, format?, upIsGood?, compare?, change?, deltaFormat?, deltaLabel?, context?, value?, delta?, kind? }[]` |  | One card per metric; each takes the props of `trend-card`. |
| `compare` | `"first" \| "previous" \| number` | `"first"` | Baseline for every card's change; a metric can override it. |
| `change` | `"percent" \| "absolute"` | `"percent"` | Relative change, or the difference between the two values; a metric can override it. An absolute change of a percentage metric is shown in percentage points ("−2.1 pts"). |
| `deltaFormat` | `FormatSpec` |  | Format for absolute changes, e.g. `"{value} pp"` or `"signed"`; a metric can override it. Default: points for percentage formats, otherwise the metric's own `format`. |
| `columns` | `number` |  | Preferred columns. Default: up to four, reduced to fit cards of at least 200px. |
| `title` | `string` |  | The main fact with its number, or a plain label. |
| `subtitle` | `string` |  | Population and period. |
| `source` | `string` |  | Shown under the grid as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | Theme override, passed on to every card. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [trend-card](https://insightcharts.dev/llms/trend-card.md)
- Used by: [scorecard](https://insightcharts.dev/llms/scorecard.md)

## More examples

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
