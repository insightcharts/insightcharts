# Pictogram chart (`pictogram-chart`)

> Compares quantities with rows of repeated icons, each icon standing for a fixed number of units.

- Component: `PictogramChart` (import from `insightcharts`)
- Spec type: `"pictogram-chart"`
- Level: atom. Category: comparison.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A few categories (2 to 6) of countable things, people, homes, vehicles, where making the quantity concrete matters more than reading precise values.

## Avoid

More than about 8 categories or values that need precise comparison (use bar-chart); a share of one whole (use waffle-chart); values that would need more than about 60 icons in a row (raise `unit`, or use bar-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/pictogram-chart
```

The file lands at `components/insightcharts/atoms/pictogram-chart.tsx`. `@insightcharts/pictogram-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { PictogramChart } from "insightcharts";

const data = [
  { city: "Tokyo", people: 37.1 },
  { city: "Delhi", people: 33.8 },
  { city: "Shanghai", people: 29.9 },
  { city: "São Paulo", people: 22.8 },
  { city: "Mexico City", people: 22.5 },
];

<PictogramChart
  theme="magenta"
  data={data}
  name="city"
  value="people"
  unit={2}
  unitLabel="2 million people"
  format="{value}m"
  highlight="Delhi"
  title="Delhi had 33.8 million people in 2024, 3.3 million fewer than Tokyo"
  subtitle="Population of the five largest urban agglomerations, 2024"
  source="UN World Urbanization Prospects"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "pictogram-chart",
  "theme": "magenta",
  "data": [
    { "city": "Tokyo", "people": 37.1 },
    { "city": "Delhi", "people": 33.8 },
    { "city": "Shanghai", "people": 29.9 },
    { "city": "São Paulo", "people": 22.8 },
    { "city": "Mexico City", "people": 22.5 }
  ],
  "name": "city",
  "value": "people",
  "unit": 2,
  "unitLabel": "2 million people",
  "format": "{value}m",
  "highlight": "Delhi",
  "title": "Delhi had 33.8 million people in 2024, 3.3 million fewer than Tokyo",
  "subtitle": "Population of the five largest urban agglomerations, 2024",
  "source": "UN World Urbanization Prospects",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Category field: one row of icons per category. |
| `value` (required) | `string` |  | Value field. |
| `unit` | `number` |  | Units per icon. Default: a round number giving the largest row about ten icons. |
| `unitLabel` | `string` |  | What one icon stands for, for the key line, e.g. "1 million people". |
| `icon` | `IconName \| "path://..."` | `"person"` | Built-in icon name from `core/icons.ts` ("person", "house", "car", "tree", "coin", "drop", "bolt", "wind-turbine", "wheat" and about 60 more) or a custom single SVG path. |
| `icons` | `Record<string, string>` |  | Icon per category key; falls back to `icon`. |
| `perRow` | `number` |  | Wrap rows after this many icons. Default: as many as fit. |
| `labels` | `boolean` | `true` | Print the value after each row. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Row order. |

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
- Used by: [poster](https://insightcharts.dev/llms/poster.md), [explainer](https://insightcharts.dev/llms/explainer.md)

## More examples

### Houses, sorted

```tsx
import { PictogramChart } from "insightcharts";

const data = [
  { decade: "1970s", homes: 3.1 },
  { decade: "1980s", homes: 2.2 },
  { decade: "1990s", homes: 1.6 },
  { decade: "2000s", homes: 1.9 },
  { decade: "2010s", homes: 1.5 },
];

<PictogramChart
  data={data}
  name="decade"
  value="homes"
  unit={0.25}
  unitLabel="250,000 homes"
  icon="house"
  format="{value}m"
  title="The UK completed 3.1 million homes in the 1970s and 1.5 million in the 2010s"
  subtitle="New dwellings completed per decade, United Kingdom"
  source="ONS house building data"
  note="Rounded for illustration"
/>
```

### Shares as drops

```tsx
import { PictogramChart } from "insightcharts";

const data = [
  { use: "Agriculture", litres: 70 },
  { use: "Industry", litres: 19 },
  { use: "Households", litres: 11 },
];

<PictogramChart
  theme="forest"
  data={data}
  name="use"
  value="litres"
  unit={5}
  unitLabel="5 of every 100 litres"
  icon="drop"
  format="{value}%"
  height={200}
  title="Agriculture accounts for 70% of global freshwater withdrawals"
  subtitle="Share of global freshwater withdrawals by sector"
  source="FAO AQUASTAT"
  note="Figures are approximate, for illustration"
/>
```

### Stress: many icons wrap, long names

```tsx
import { PictogramChart } from "insightcharts";

const data = [
  { fleet: "Battery electric passenger cars", cars: 28.4 },
  { fleet: "Plug-in hybrids", cars: 12.1 },
  { fleet: "Hydrogen fuel cell", cars: 0.3 },
];

<PictogramChart
  theme="ledger"
  data={data}
  name="fleet"
  value="cars"
  unit={0.5}
  unitLabel="500,000 cars"
  icon="car"
  format="{value}m"
  height={300}
  title="There were 28.4 million battery electric cars on the road in 2023"
  subtitle="Electric cars on the road worldwide, 2023"
  source="IEA Global EV Outlook 2024"
  note="Figures are approximate, for illustration"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/pictogram-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/pictogram-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
