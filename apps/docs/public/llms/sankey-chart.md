# Sankey chart (`sankey-chart`)

> Shows how a quantity flows from sources through stages to destinations, with link width proportional to the flow.

- Component: `SankeyChart` (import from `insightcharts`)
- Spec type: `"sankey-chart"`
- Level: atom. Category: flow.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Where things come from and where they go: energy from fuel to end use, budget from revenue to spending, users from channel to outcome. Works best with 2 to 4 stages and up to about 20 nodes.

## Avoid

A single sequence of steps with drop-off (use funnel-chart); comparing a few totals (use bar-chart); flows that loop back (cycles cannot be drawn and are dropped); more than about 40 links.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/sankey-chart
```

The file lands at `components/insightcharts/atoms/sankey-chart.tsx`. `@insightcharts/sankey-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { SankeyChart } from "insightcharts";

const data = [
  { from: "Coal", to: "Electricity", twh: 290 },
  { from: "Gas", to: "Electricity", twh: 210 },
  { from: "Gas", to: "Heat", twh: 330 },
  { from: "Wind and solar", to: "Electricity", twh: 240 },
  { from: "Nuclear", to: "Electricity", twh: 120 },
  { from: "Oil", to: "Transport", twh: 560 },
  { from: "Oil", to: "Heat", twh: 90 },
  { from: "Electricity", to: "Homes", twh: 280 },
  { from: "Electricity", to: "Industry", twh: 330 },
  { from: "Electricity", to: "Transport", twh: 30 },
  { from: "Electricity", to: "Losses", twh: 220 },
  { from: "Heat", to: "Homes", twh: 270 },
  { from: "Heat", to: "Industry", twh: 150 },
];

<SankeyChart
  theme="noir"
  data={data}
  from="from"
  to="to"
  value="twh"
  format="{value} TWh"
  title="220 TWh of the 860 TWh used to generate electricity was lost"
  subtitle="Energy flows from fuel to end use, terawatt-hours per year"
  source="Illustrative national energy balance"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "theme": "noir",
  "type": "sankey-chart",
  "data": [
    { "from": "Coal", "to": "Electricity", "twh": 290 },
    { "from": "Gas", "to": "Electricity", "twh": 210 },
    { "from": "Gas", "to": "Heat", "twh": 330 },
    { "from": "Wind and solar", "to": "Electricity", "twh": 240 },
    { "from": "Nuclear", "to": "Electricity", "twh": 120 },
    { "from": "Oil", "to": "Transport", "twh": 560 },
    { "from": "Oil", "to": "Heat", "twh": 90 },
    { "from": "Electricity", "to": "Homes", "twh": 280 },
    { "from": "Electricity", "to": "Industry", "twh": 330 },
    { "from": "Electricity", "to": "Transport", "twh": 30 },
    { "from": "Electricity", "to": "Losses", "twh": 220 },
    { "from": "Heat", "to": "Homes", "twh": 270 },
    { "from": "Heat", "to": "Industry", "twh": 150 }
  ],
  "from": "from",
  "to": "to",
  "value": "twh",
  "format": "{value} TWh",
  "title": "220 TWh of the 860 TWh used to generate electricity was lost",
  "subtitle": "Energy flows from fuel to end use, terawatt-hours per year",
  "source": "Illustrative national energy balance"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `from` | `string` | `"source"` | Field naming where each flow starts. Not called `source` because that is the figure's source line. |
| `to` | `string` | `"target"` | Field naming where each flow ends. |
| `value` | `string` | `"value"` | Flow size field. Non-positive flows are dropped. |
| `orientation` | `"auto" \| "horizontal" \| "vertical"` | `"auto"` | Left to right, or top to bottom for narrow columns with short names. |
| `labels` | `boolean` | `true` | Print each node's total after its name. |
| `names` | `Record<string, string>` |  | Display names for node keys. |

## Common props

Every chart also accepts these (shared by all charts; also at https://insightcharts.dev/llms/guides/common-props.md):

| Prop | Type | Description |
|---|---|---|
| `data` | `DataInput` | Rows, CSV text, a URL, `{ url, path }`, an async function, or an Arrow-style table. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` | A pipeline of transforms applied before drawing. |
| `title` | `string` | The title. One plain statement of what the data shows, with the number and the period ("Monthly churn fell from 4.2% to 2.1% in 2024"), or a plain label ("Monthly churn, 2024"). One clause, no figures of speech. |
| `subtitle` | `string` | Measure, unit, population, period. |
| `source` | `string` | Data source, shown as "Source: ...". |
| `note` | `string` | Method notes or caveats. |
| `height` | `number \| string` | CSS height of the plot. Default 360. |
| `aspect` | `number` | Width / height. Overrides `height`. |
| `highlight` | `string \| string[]` | The entity (or entities) the title is about. Every other series is drawn in grey. |
| `annotations` | `Annotation[]` | Reference lines, shaded bands and callouts, in data coordinates. |
| `format` | `FormatSpec` | How to print values: `"compact"`, `"percent"`, `"currency:USD"`, `"{value} kg"`, Intl options, or a function. |
| `legend` | `boolean` | Show the legend. Default: shown when there are two or more series. |
| `select` | `boolean \| string` | Make marks clickable to filter. Inside `<InsightData>` the selection filters every other chart. Pass a field name, or `true` to use the chart's category field. |
| `onSelect` | `(values: string[], field: string) => void` | Called with the selected values whenever the selection changes. |
| `option` | `EChartsOption \| ((option: EChartsOption, ctx: BuildContext) => EChartsOption)` | Deep-merged over the generated ECharts option, or a function that receives and returns it. Use it for ECharts settings no prop covers. |
| `theme` | `ThemeInput` | A built-in theme name (`"editorial"`, `"ledger"`, `"noir"`...), or a theme object. A named theme paints its own background behind the chart. |
| `frame` | `boolean` | Paint the theme's background behind the chart. Default: on for a named theme with its own surface. |
| `mode` | `ModeInput` | `"auto"` (default) follows the page, `"system"` follows the OS, or force `"light"` / `"dark"`. |
| `renderer` | `RendererInput` | `"auto"` (default) uses SVG for light charts and canvas for heavy ones. |
| `animate` | `boolean` | Set false to disable animation for this chart. Reduced-motion preferences are always respected. |
| `lazy` | `boolean` | Mount the chart only when it scrolls within 200px of the viewport. Default true (from `InsightProvider`). |
| `group` | `string` | Link tooltips with other charts sharing this group id. |
| `exportable` | `boolean \| ExportFormat[]` | Show an export menu: `true` or a list of formats from png, jpeg, svg, pdf, csv, json. |
| `table` | `boolean` | Show a collapsible "View data" table under the chart. |
| `alt` | `string` | Accessible description: the chart type and measures, then the main pattern and the notable values. |
| `id` | `string` | Stable id for this chart's selection in the shared store. |
| `onEvents` | `Record<string, ChartEventHandler>` | ECharts event handlers: `{ click: (params, chart) => {} }`. |
| `onReady` | `(chart: EChartsInstance) => void` | Called with the ECharts instance once it is initialised. |
| `className` | `string` | Class on the figure element. |
| `style` | `CSSProperties` | Inline style on the figure element. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: no molecule or template yet

## More examples

### Two stages, highlight

```tsx
import { SankeyChart } from "insightcharts";

const data = [
  { channel: "Organic search", outcome: "Signed up", users: 4200 },
  { channel: "Organic search", outcome: "Left", users: 9800 },
  { channel: "Paid ads", outcome: "Signed up", users: 1500 },
  { channel: "Paid ads", outcome: "Left", users: 10500 },
  { channel: "Referral", outcome: "Signed up", users: 2600 },
  { channel: "Referral", outcome: "Left", users: 2400 },
];

<SankeyChart
  data={data}
  from="channel"
  to="outcome"
  value="users"
  highlight="Referral"
  height={300}
  title="52% of referred visitors signed up last quarter"
  subtitle="Visitors by acquisition channel and outcome, last quarter"
  note="Illustrative data"
/>
```

### Vertical

```tsx
import { SankeyChart } from "insightcharts";

const data = [
  { from: "Taxes", to: "Budget", bn: 820 },
  { from: "Borrowing", to: "Budget", bn: 130 },
  { from: "Other", to: "Budget", bn: 90 },
  { from: "Budget", to: "Health", bn: 250 },
  { from: "Budget", to: "Welfare", bn: 310 },
  { from: "Budget", to: "Schools", bn: 120 },
  { from: "Budget", to: "Defence", bn: 60 },
  { from: "Budget", to: "Interest", bn: 110 },
  // ... 1 more rows
];

<SankeyChart
  theme="ocean"
  data={data}
  from="from"
  to="to"
  value="bn"
  format="£{value}bn"
  orientation="vertical"
  title="Borrowing funded £130bn of the £1,040bn budget"
  subtitle="Government revenue by source and spending by area, £ billion"
  note="Illustrative data"
/>
```

### Stress: four stages, many nodes, long names, a loop

```tsx
import { SankeyChart } from "insightcharts";

const data = [
  { from: "Domestic crude oil production", to: "Refineries", pj: 410 },
  { from: "Imported crude oil", to: "Refineries", pj: 620 },
  { from: "Natural gas fields", to: "Gas processing plants", pj: 540 },
  { from: "Imported liquefied natural gas", to: "Gas processing plants", pj: 180 },
  { from: "Coal mines", to: "Power stations", pj: 260 },
  { from: "Wind farms", to: "Power stations", pj: 150 },
  { from: "Solar parks", to: "Power stations", pj: 90 },
  { from: "Hydroelectric dams", to: "Power stations", pj: 70 },
  // ... 16 more rows
];

<SankeyChart
  theme="ledger"
  data={data}
  from="from"
  to="to"
  value="pj"
  format="{value} PJ"
  height={520}
  title="Power stations lost 400 PJ of the 1,060 PJ they took in"
  subtitle="National energy balance from primary supply to final use, petajoules"
  note="Illustrative data. One circular flow in the data is left out"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/sankey-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/sankey-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
