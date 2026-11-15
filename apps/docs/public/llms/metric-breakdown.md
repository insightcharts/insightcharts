# Metric breakdown (`metric-breakdown`)

> A headline number with its composition underneath: one segmented bar and a key giving each part's value and share.

- Component: `MetricBreakdown` (import from `insightcharts`)
- Spec type: `"metric-breakdown"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

A total that the reader will immediately want split: a budget by department, revenue by product line, emissions by sector. Two to six parts that add up to the number above them.

## Avoid

Parts that do not sum to the headline; more than about six parts (use `bar-chart`); composition compared across groups or over time (use `bar-chart` with `stack: "percent"` or `area-chart`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/metric-breakdown
```

The file lands at `components/insightcharts/molecules/metric-breakdown.tsx`. `@insightcharts/metric-breakdown-demo` adds a ready-made example next to it.

## Usage

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [
  { sector: "Energy supply", mt: 862 },
  { sector: "Transport", mt: 804 },
  { sector: "Industry", mt: 701 },
  { sector: "Buildings", mt: 437 },
  { sector: "Agriculture", mt: 378 },
  { sector: "Waste", mt: 109 },
];

<MetricBreakdown
  label="Greenhouse gas emissions, EU-27, 2022"
  context="Million tonnes of CO2 equivalent. 31% below the 1990 level."
  data={data}
  name="sector"
  value="mt"
  format="integer"
  source="European Environment Agency"
  note="Rounded, approximate figures for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "metric-breakdown",
  "label": "Greenhouse gas emissions, EU-27, 2022",
  "context": "Million tonnes of CO2 equivalent. 31% below the 1990 level.",
  "data": [
    { "sector": "Energy supply", "mt": 862 },
    { "sector": "Transport", "mt": 804 },
    { "sector": "Industry", "mt": 701 },
    { "sector": "Buildings", "mt": 437 },
    { "sector": "Agriculture", "mt": 378 },
    { "sector": "Waste", "mt": 109 }
  ],
  "name": "sector",
  "value": "mt",
  "format": "integer",
  "source": "European Environment Agency",
  "note": "Rounded, approximate figures for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` (required) | `string` |  | What the headline number measures. |
| `data` | `DataInput` |  | One row per part. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` |  | Applied before the parts are summed. |
| `name` (required) | `string` |  | Field naming each part. |
| `value` (required) | `string` |  | Field with each part's value. |
| `total` | `number \| string` |  | The headline number. Default: the sum of the parts. |
| `context` | `string` |  | The line under the headline number. |
| `delta` | `number \| string` |  | Change in the headline number. Numbers render as signed percentages. |
| `deltaLabel` | `string` |  | What the delta is against. |
| `upIsGood` | `boolean` | `true` | Whether an increase is good news. |
| `size` | `"hero" \| "stat"` | `"stat"` | `hero` when this opens a piece. |
| `show` | `"both" \| "value" \| "share"` | `"both"` | What the key prints beside each part. |
| `sort` | `"none" \| "desc"` | `"none"` | Order parts by size; the bar and the key follow. |
| `names` | `Record<string, string>` |  | Display names for part keys. |
| `format` | `FormatSpec` | `"auto"` | Number format for the headline and the parts. |
| `source` | `string` |  | Shown underneath as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | Theme override, passed on to the number and the bar. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [big-number](https://insightcharts.dev/llms/big-number.md), [segmented-bar](https://insightcharts.dev/llms/segmented-bar.md)
- Used by: no molecule or template yet

## More examples

### Three parts, shares only

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [
  { plan: "Enterprise", mrr: 318000 },
  { plan: "Team", mrr: 201000 },
  { plan: "Starter", mrr: 70000 },
];

<MetricBreakdown
  label="Monthly recurring revenue"
  delta={0.064}
  deltaLabel="vs September"
  data={data}
  name="plan"
  value="mrr"
  format="currency:USD"
  show="share"
  note="Illustrative data"
  style={{ maxWidth: 420 }}
/>
```

### Hero, sorted

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [
  { party: "Conservative", seats: 121 },
  { party: "Labour", seats: 411 },
  { party: "Liberal Democrat", seats: 72 },
  { party: "SNP", seats: 9 },
  { party: "Others", seats: 37 },
];

<MetricBreakdown
  size="hero"
  sort="desc"
  label="Seats in the House of Commons, 2024"
  data={data}
  name="party"
  value="seats"
  source="House of Commons Library"
  note="Figures are approximate, for illustration"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/metric-breakdown.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/metric-breakdown.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
