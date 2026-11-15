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
| `variant` | `"plain" \| "filled" \| "tinted" \| "with-icon" \| "with-ring" \| "with-trend"` | `"plain"` | How the headline number is dressed: passed to `big-number`. |
| `icon` | `IconInput` |  | Icon for the headline when `variant` is `with-icon`. |
| `tone` | `"neutral" \| "accent" \| "positive" \| "negative" \| number` |  | Tone of a filled or tinted headline. |
| `display` | `"key" \| "inline" \| "meters" \| "tiles"` | `"key"` | How the parts are shown: a list with values and shares, one wrapped line, a `progress-meter` per part scaled to the total, or a `stat-tile` per part. |
| `tileVariant` | `StatTileVariant` | `"progress"` | The tile display when `display` is `tiles`: `progress`, `ring`, `filled`, `tinted`, `plain`... Each tile gets the part's value, the total as `max` and the part's categorical colour. |
| `tileSurface` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent"` |  | The ground of each tile when `display` is `tiles`. |
| `layout` | `"stacked" \| "side"` | `"stacked"` | `side` puts the headline left and the parts right from 600px. |
| `columns` | `number` |  | Columns for the key, meters or tiles. Default: by width. |
| `bar` | `boolean` | `true` | Set false to leave out the segmented bar, e.g. with `meters` or `tiles`. |
| `dividers` | `boolean` | `true` | Hairlines between key rows. |
| `density` | `"dense" \| "default" \| "roomy"` | `"default"` | Spacing between the bar, the key rows and the tiles. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |
| `theme` | `ThemeInput` |  | A theme name such as `"earth"`, or token overrides, passed on to the number and the bar. A named theme paints its own ground. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [big-number](https://insightcharts.dev/llms/big-number.md), [segmented-bar](https://insightcharts.dev/llms/segmented-bar.md), [progress-meter](https://insightcharts.dev/llms/progress-meter.md), [stat-tile](https://insightcharts.dev/llms/stat-tile.md)
- Used by: no molecule or template yet

## More examples

### Headline beside the parts, ledger

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [
  { plan: "Enterprise", mrr: 318000 },
  { plan: "Team", mrr: 201000 },
  { plan: "Starter", mrr: 70000 },
];

<MetricBreakdown
  label="Monthly recurring revenue, December 2024"
  delta={0.124}
  deltaLabel="vs September"
  data={data}
  name="plan"
  value="mrr"
  format="currency:USD"
  note="Illustrative data"
  theme="ledger"
  layout="side"
  size="hero"
/>
```

### A meter per part, science

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
  theme="science"
  label="Greenhouse gas emissions, EU-27, 2022"
  context="Million tonnes of CO2 equivalent"
  data={data}
  name="sector"
  value="mt"
  format="integer"
  display="meters"
  bar={false}
  sort="desc"
  columns={2}
  source="European Environment Agency"
  note="Rounded, approximate figures for illustration"
/>
```

### A progress tile per part

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [
  { plan: "Enterprise", mrr: 318000 },
  { plan: "Team", mrr: 201000 },
  { plan: "Starter", mrr: 70000 },
];

<MetricBreakdown
  label="Monthly recurring revenue, December 2024"
  delta={0.124}
  deltaLabel="vs September"
  data={data}
  name="plan"
  value="mrr"
  format="currency:USD"
  note="Illustrative data"
  display="tiles"
/>
```

### Ring tiles with a filled headline, forest

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [{ owner: "State", ha: 6820 }, { owner: "Private", ha: 4340 }, { owner: "Community", ha: 1240 }];

<MetricBreakdown
  theme="forest"
  variant="filled"
  label="Tree cover surveyed in 2024, hectares"
  data={data}
  name="owner"
  value="ha"
  format="integer"
  display="tiles"
  tileVariant="ring"
  bar={false}
  note="Illustrative data"
/>
```

### Inline key with an icon, earth

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [
  { stream: "Recycled", t: 48200 },
  { stream: "Composted", t: 17100 },
  { stream: "Incinerated", t: 24300 },
  { stream: "Landfilled", t: 10800 },
];

<MetricBreakdown
  theme="earth"
  variant="with-icon"
  icon="bin"
  label="Household waste collected in 2024, tonnes"
  data={data}
  name="stream"
  value="t"
  format="integer"
  display="inline"
  note="Illustrative data"
  style={{ maxWidth: 520 }}
/>
```

### Filled tiles, noir

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [
  { kind: "Open play", goals: 41 },
  { kind: "Set pieces", goals: 17 },
  { kind: "Penalties", goals: 6 },
  { kind: "Own goals", goals: 4 },
];

<MetricBreakdown
  theme="noir"
  size="hero"
  label="Goals scored in 30 league matches"
  data={data}
  name="kind"
  value="goals"
  display="tiles"
  tileVariant="filled"
  note="Illustrative data"
/>
```

### Dense key without dividers, mono

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [
  { channel: "Email", n: 612 },
  { channel: "Chat", n: 388 },
  { channel: "Phone", n: 104 },
  { channel: "Forum", n: 54 },
];

<MetricBreakdown
  theme="mono"
  label="Support tickets closed in December 2024"
  data={data}
  name="channel"
  value="n"
  density="dense"
  dividers={false}
  show="both"
  note="Illustrative data"
  style={{ maxWidth: 380 }}
/>
```

### Tinted headline with meters, sunrise

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [
  { dept: "Grocery", eur: 412000 },
  { dept: "Household", eur: 186000 },
  { dept: "Clothing", eur: 121000 },
  { dept: "Garden", eur: 75000 },
];

<MetricBreakdown
  theme="sunrise"
  variant="tinted"
  tone={1}
  label="Store revenue, week 50 of 2024"
  delta={0.092}
  deltaLabel="vs week 50 of 2023"
  data={data}
  name="dept"
  value="eur"
  format="currency:EUR"
  display="meters"
  layout="side"
  bar={false}
  note="Illustrative data"
/>
```

### Roomy, tinted tiles, dusk

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [{ cls: "Couchette", n: 736000 }, { cls: "Sleeper", n: 644000 }, { cls: "Seat", n: 460000 }];

<MetricBreakdown
  theme="dusk"
  density="roomy"
  label="Night train passengers, 2024"
  data={data}
  name="cls"
  value="n"
  format="compact"
  display="tiles"
  tileVariant="progress"
  tileSurface="tinted"
  note="Illustrative data"
/>
```

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
