# Donut chart (`donut-chart`)

> Shows how 2 to 5 parts make up one whole, with each slice labelled by name and share.

- Component: `DonutChart` (import from `insightcharts`)
- Spec type: `"donut-chart"`
- Level: atom. Category: part-to-whole.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A simple composition with one dominant part, or one part the title is about, where the total itself is worth printing in the centre.

## Avoid

More than 5 categories or parts of similar size that must be ranked (use bar-chart); a single figure (use big-number); composition compared across groups or time (use bar-chart with stack "percent"); a compact card (use segmented-bar).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/donut-chart
```

The file lands at `components/insightcharts/atoms/donut-chart.tsx`. `@insightcharts/donut-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { DonutChart } from "insightcharts";

const data = [
  { tenure: "Own outright", households: 8.8 },
  { tenure: "Own with a mortgage", households: 7.4 },
  { tenure: "Rent privately", households: 4.9 },
  { tenure: "Rent social housing", households: 4.1 },
];

<DonutChart
  data={data}
  name="tenure"
  value="households"
  format="{value}m"
  centerLabel="households"
  highlight="Rent privately"
  title="4.9 million households in England rented privately in 2022-23"
  subtitle="Households by tenure, England, 2022-23"
  source="English Housing Survey"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "donut-chart",
  "data": [
    { "tenure": "Own outright", "households": 8.8 },
    { "tenure": "Own with a mortgage", "households": 7.4 },
    { "tenure": "Rent privately", "households": 4.9 },
    { "tenure": "Rent social housing", "households": 4.1 }
  ],
  "name": "tenure",
  "value": "households",
  "format": "{value}m",
  "centerLabel": "households",
  "highlight": "Rent privately",
  "title": "4.9 million households in England rented privately in 2022-23",
  "subtitle": "Households by tenure, England, 2022-23",
  "source": "English Housing Survey",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Category field: one slice per distinct value. |
| `value` (required) | `string` |  | Value field. |
| `maxSlices` | `number` | `5` | Most slices drawn, including "Other"; smaller categories are folded. |
| `centerLabel` | `string` |  | Small label in the hole, e.g. "Total". Turns the centre text on. |
| `centerValue` | `string \| number` |  | Big text in the hole. Default: the formatted total when `centerLabel` is set. |
| `otherLabel` | `string` | `"Other"` | Name of the folded slice. |
| `names` | `Record<string, string>` |  | Display names for category keys. |

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
| `theme` | `ThemeInput` | A full theme, `{ light, dark }` partial tokens, or flat tokens applied to both modes. Merged over the surrounding `InsightProvider` theme. |
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
- Used by: [poster](https://insightcharts.dev/llms/poster.md)

## More examples

### Two slices, no centre

```tsx
import { DonutChart } from "insightcharts";

const data = [{ answer: "Remote or hybrid", share: 41 }, { answer: "On site every day", share: 59 }];

<DonutChart
  data={data}
  name="answer"
  value="share"
  format="{value}%"
  highlight="Remote or hybrid"
  title="41% of employed adults work remotely or hybrid"
  subtitle="Share of employed adults by working pattern"
  source="Illustrative survey data"
/>
```

### Folded into Other, custom centre

```tsx
import { DonutChart } from "insightcharts";

const data = [
  { source: "Coal", twh: 10434 },
  { source: "Gas", twh: 6634 },
  { source: "Hydro", twh: 4210 },
  { source: "Nuclear", twh: 2686 },
  { source: "Wind", twh: 2304 },
  { source: "Solar", twh: 1631 },
  { source: "Bioenergy", twh: 697 },
  { source: "Other fossil", twh: 786 },
  // ... 1 more rows
];

<DonutChart
  data={data}
  name="source"
  value="twh"
  format="compact"
  centerLabel="TWh generated"
  centerValue="29,471"
  title="Coal generated 35% of the world's electricity in 2023"
  subtitle="Global electricity generation by source, 2023, terawatt-hours"
  source="Ember, Global Electricity Review 2024"
  note="Figures are approximate, for illustration"
/>
```

### Stress: long names and a sliver

```tsx
import { DonutChart } from "insightcharts";

const data = [
  { item: "Salaries, pensions and other staff-related expenditure", cost: 612 },
  { item: "Buildings and facilities management", cost: 188 },
  { item: "Information technology and software licences", cost: 94 },
  { item: "Travel", cost: 3 },
];

<DonutChart
  data={data}
  name="item"
  value="cost"
  format="currency:GBP"
  centerLabel="Total budget"
  title="Staff costs made up 68% of the departmental budget"
  subtitle="Departmental spending by category, £ thousands"
  source="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/donut-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/donut-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
