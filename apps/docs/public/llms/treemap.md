# Treemap (`treemap`)

> Shows parts of a whole as nested rectangles sized by value, optionally grouped into categories.

- Component: `Treemap` (import from `insightcharts`)
- Spec type: `"treemap"`
- Level: atom. Category: part-to-whole.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Many parts (10 to 100) of very different sizes, or a two-level hierarchy, where the reader needs the largest parts rather than exact comparison: budgets, market capitalisation, export baskets.

## Avoid

Fewer than about 6 parts or values that need precise comparison (use bar-chart); 2 to 5 parts (use donut-chart or segmented-bar); values that can be negative (use bar-chart); change over time (use line-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/treemap
```

The file lands at `components/insightcharts/atoms/treemap.tsx`. `@insightcharts/treemap-demo` adds a ready-made example next to it.

## Usage

```tsx
import { Treemap } from "insightcharts";

const data = [
  { sector: "Energy", source: "Electricity and heat", gt: 15.8 },
  { sector: "Energy", source: "Transport", gt: 8.4 },
  { sector: "Energy", source: "Manufacturing and construction", gt: 6.3 },
  { sector: "Energy", source: "Buildings", gt: 3 },
  { sector: "Energy", source: "Fugitive emissions", gt: 3.3 },
  { sector: "Agriculture", source: "Livestock and manure", gt: 3.5 },
  { sector: "Agriculture", source: "Soils and rice", gt: 2.4 },
  { sector: "Industry", source: "Cement", gt: 1.6 },
  { sector: "Industry", source: "Chemicals and other", gt: 1.6 },
  { sector: "Waste", source: "Landfill and wastewater", gt: 1.7 },
  { sector: "Land use", source: "Deforestation and land-use change", gt: 1.4 },
];

<Treemap
  data={data}
  group="sector"
  name="source"
  value="gt"
  format="{value} Gt"
  title="Energy produced 75% of global greenhouse gas emissions in 2021"
  subtitle="Global emissions by sector and source, billion tonnes of CO2 equivalent, 2021"
  source="Climate Watch, World Resources Institute"
  note="Rounded, approximate figures for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "treemap",
  "data": [
    { "sector": "Energy", "source": "Electricity and heat", "gt": 15.8 },
    { "sector": "Energy", "source": "Transport", "gt": 8.4 },
    { "sector": "Energy", "source": "Manufacturing and construction", "gt": 6.3 },
    { "sector": "Energy", "source": "Buildings", "gt": 3 },
    { "sector": "Energy", "source": "Fugitive emissions", "gt": 3.3 },
    { "sector": "Agriculture", "source": "Livestock and manure", "gt": 3.5 },
    { "sector": "Agriculture", "source": "Soils and rice", "gt": 2.4 },
    { "sector": "Industry", "source": "Cement", "gt": 1.6 },
    { "sector": "Industry", "source": "Chemicals and other", "gt": 1.6 },
    { "sector": "Waste", "source": "Landfill and wastewater", "gt": 1.7 },
    { "sector": "Land use", "source": "Deforestation and land-use change", "gt": 1.4 }
  ],
  "group": "sector",
  "name": "source",
  "value": "gt",
  "format": "{value} Gt",
  "title": "Energy produced 75% of global greenhouse gas emissions in 2021",
  "subtitle": "Global emissions by sector and source, billion tonnes of CO2 equivalent, 2021",
  "source": "Climate Watch, World Resources Institute",
  "note": "Rounded, approximate figures for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Leaf name field: one tile per row. |
| `value` (required) | `string` |  | Value field: tile area. Non-positive values are dropped. |
| `group` | `string` |  | Parent field. Rows sharing a group are drawn together and share a colour. |
| `labels` | `boolean` | `true` | Print the value under the name where the tile is big enough. |
| `groupLabels` | `boolean` |  | Heading strip above each group. Default: on when `group` is set and not compact. |
| `names` | `Record<string, string>` |  | Display names for group keys. |

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
- Used by: [poster](https://insightcharts.dev/llms/poster.md), [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md), [flow-poster](https://insightcharts.dev/llms/flow-poster.md), [ranking-poster](https://insightcharts.dev/llms/ranking-poster.md)

## More examples

### Flat, with highlight

```tsx
import { Treemap } from "insightcharts";

const data = [
  { company: "Nvidia", cap: 3.3 },
  { company: "Apple", cap: 3.4 },
  { company: "Microsoft", cap: 3.1 },
  { company: "Alphabet", cap: 2.1 },
  { company: "Amazon", cap: 2 },
  { company: "Meta", cap: 1.5 },
  { company: "Tesla", cap: 0.8 },
  { company: "Broadcom", cap: 0.8 },
  // ... 7 more rows
];

<Treemap
  data={data}
  name="company"
  value="cap"
  format="${value}tn"
  highlight={["Nvidia", "Apple", "Microsoft"]}
  title="Apple, Nvidia and Microsoft were worth $9.8 trillion combined in late 2024"
  subtitle="Market capitalisation of the 15 largest US-listed companies, late 2024, $ trillion"
  source="Company filings, exchange data"
  note="Rounded, illustrative"
/>
```

### Stress: many small tiles and long names

```tsx
import { Treemap } from "insightcharts";

const data = [
  { area: "Health", programme: "Hospital and community health services", bn: 168 },
  { area: "Health", programme: "Primary care and prescribing", bn: 38 },
  { area: "Health", programme: "Public health grants to local authorities", bn: 4 },
  { area: "Social protection", programme: "State pension", bn: 124 },
  { area: "Social protection", programme: "Universal credit and legacy benefits", bn: 88 },
  { area: "Social protection", programme: "Disability and incapacity benefits", bn: 66 },
  { area: "Social protection", programme: "Housing benefit", bn: 16 },
  { area: "Social protection", programme: "Child benefit", bn: 12 },
  // ... 14 more rows
];

<Treemap
  data={data}
  group="area"
  name="programme"
  value="bn"
  format="£{value}bn"
  height={460}
  title="Social protection was £306bn of £910bn in UK public spending in 2023-24"
  subtitle="Public spending by area and programme, £ billion, 2023-24"
  source="HM Treasury Public Expenditure Statistical Analyses"
  note="Programme split is illustrative"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/treemap.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/treemap.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
