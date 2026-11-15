# Stat circles (`stat-circles`)

> Shows a few related magnitudes as plain circles sized by area, each with its number set large and a short label.

- Component: `StatCircles` (import from `insightcharts`)
- Spec type: `"stat-circles"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

The poster way to show two to six related magnitudes whose rough proportion is the point: kilograms per person in three countries, the same quantity in three years, a total and its parts set side by side.

## Avoid

More than six values or values that need precise comparison (use bar-chart); a single number (use big-number); many circles of one whole (use circle-pack); values close together, where areas look the same (use bar-chart or dumbbell-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/stat-circles
```

The file lands at `components/insightcharts/atoms/stat-circles.tsx`. `@insightcharts/stat-circles-demo` adds a ready-made example next to it.

## Usage

```tsx
import { StatCircles } from "insightcharts";

const data = [
  { who: "per person in the United States", kg: 124 },
  { who: "per person in Brazil", kg: 100 },
  { who: "per person in China", kg: 63 },
  { who: "per person in India", kg: 6 },
];

<StatCircles
  data={data}
  name="who"
  value="kg"
  unit="kg"
  title="Meat supply in the United States was 124 kg per person in 2021"
  subtitle="Meat supply per person per year, kilograms, 2021"
  source="FAO food balance sheets"
  note="Rounded, approximate figures for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "stat-circles",
  "data": [
    { "who": "per person in the United States", "kg": 124 },
    { "who": "per person in Brazil", "kg": 100 },
    { "who": "per person in China", "kg": 63 },
    { "who": "per person in India", "kg": 6 }
  ],
  "name": "who",
  "value": "kg",
  "unit": "kg",
  "title": "Meat supply in the United States was 124 kg per person in 2021",
  "subtitle": "Meat supply per person per year, kilograms, 2021",
  "source": "FAO food balance sheets",
  "note": "Rounded, approximate figures for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Label field: the short text under or beside each circle. |
| `value` (required) | `string` |  | Value field: circle area, and the number printed large. Non-positive values are dropped. |
| `unit` | `string` |  | Unit printed small after each number, e.g. "kg". Leave out when `format` already includes it. |
| `layout` | `"row" \| "steps" \| "nested"` | `"row"` | Circles centred on one line, standing on a shared baseline, or drawn inside each other from a shared lowest point. Narrow containers stack a row or steps into a column. |
| `colorBy` | `"item" \| "value" \| "single"` | `"item"` | A colour per circle, a shade by value along the sequential ramp, or the accent for all. |
| `icon` | `string \| Record<string, string>` |  | Icon above the number in large circles: one for all, or a map from label to icon. Built-in name or `path://`. |

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
- Used by: [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md), [ranking-poster](https://insightcharts.dev/llms/ranking-poster.md), [scale-poster](https://insightcharts.dev/llms/scale-poster.md)

## More examples

### Nested, shaded by value

```tsx
import { StatCircles } from "insightcharts";

const data = [
  { what: "litres to grow one kilogram of beef", litres: 15400 },
  { what: "litres for one kilogram of cheese", litres: 5060 },
  { what: "litres for one kilogram of rice", litres: 2500 },
  { what: "litres for one kilogram of potatoes", litres: 290 },
];

<StatCircles
  data={data}
  name="what"
  value="litres"
  layout="nested"
  colorBy="value"
  format="integer"
  title="One kilogram of beef takes 15,400 litres of water to produce"
  subtitle="Water footprint of four foods, litres per kilogram, global average"
  source="Water Footprint Network"
  note="Rounded, approximate figures for illustration"
/>
```

### Steps, with icons, highlight and click to select

```tsx
import { StatCircles } from "insightcharts";

const data = [
  { year: "trees planted in 2021", trees: 1200 },
  { year: "trees planted in 2022", trees: 2900 },
  { year: "trees planted in 2023", trees: 5100 },
  { year: "trees planted in 2024", trees: 8400 },
];

<StatCircles
  data={data}
  name="year"
  value="trees"
  layout="steps"
  icon="tree"
  highlight="trees planted in 2024"
  select
  title="The city planted 8,400 trees in 2024"
  subtitle="Street trees planted per year, 2021 to 2024"
  note="Illustrative figures for an invented city"
/>
```

### Stress: six circles, long labels, values from 2 to 9,800

```tsx
import { StatCircles } from "insightcharts";

const data = [
  {
    item: "tonnes of household waste collected at the kerbside each week across the whole metropolitan area",
    t: 9800,
  },
  { item: "tonnes sent to the energy-from-waste plant", t: 4100 },
  { item: "tonnes of paper and card recycled", t: 1500 },
  { item: "tonnes of glass", t: 420 },
  { item: "tonnes of small electrical items", t: 35 },
  { item: "tonnes of batteries", t: 2 },
];

<StatCircles
  data={data}
  name="item"
  value="t"
  unit="t"
  colorBy="single"
  title="The city collects 9,800 tonnes of household waste a week"
  subtitle="Household waste by destination, tonnes per week"
  note="Illustrative figures for an invented city"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/stat-circles.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/stat-circles.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
