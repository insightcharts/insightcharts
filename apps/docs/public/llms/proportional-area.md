# Proportional area (`proportional-area`)

> Compares two to eight values as squares or circles whose areas are proportional to the values, each printed with its name and number.

- Component: `ProportionalArea` (import from `insightcharts`)
- Spec type: `"proportional-area"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A few quantities that differ a lot (2 times to 100 times), where the reader should feel the difference in size: lake areas, budgets, market sizes. Nest them to show one quantity inside another.

## Avoid

Values within about 30% of each other, where areas look the same (use block-bar or bar-chart); more than 8 values (use treemap or bar-chart); parts of one whole (use treemap or waffle-chart); negative values.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/proportional-area
```

The file lands at `components/insightcharts/atoms/proportional-area.tsx`. `@insightcharts/proportional-area-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ProportionalArea } from "insightcharts";

const data = [
  { lake: "Superior", area: 82100 },
  { lake: "Victoria", area: 68900 },
  { lake: "Tanganyika", area: 32900 },
  { lake: "Erie", area: 25700 },
  { lake: "Titicaca", area: 8370 },
];

<ProportionalArea
  theme="blueprint"
  data={data}
  name="lake"
  value="area"
  format="integer"
  ratio
  title="Lake Superior covers 82,100 km², 9.8 times Lake Titicaca"
  subtitle="Surface area of five lakes, square kilometres"
  source="Approximate published figures"
  note="Rounded, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "proportional-area",
  "theme": "blueprint",
  "data": [
    { "lake": "Superior", "area": 82100 },
    { "lake": "Victoria", "area": 68900 },
    { "lake": "Tanganyika", "area": 32900 },
    { "lake": "Erie", "area": 25700 },
    { "lake": "Titicaca", "area": 8370 }
  ],
  "name": "lake",
  "value": "area",
  "format": "integer",
  "ratio": true,
  "title": "Lake Superior covers 82,100 km², 9.8 times Lake Titicaca",
  "subtitle": "Surface area of five lakes, square kilometres",
  "source": "Approximate published figures",
  "note": "Rounded, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Category field: one shape per row. |
| `value` (required) | `string` |  | Value field. Each shape's area is proportional to it. |
| `shape` | `"square" \| "circle"` | `"square"` | Squares or circles. |
| `layout` | `"row" \| "nested" \| "packed"` | `"row"` | `row`: side by side on a common baseline. `nested`: inside one another from a shared corner (squares) or lowest point (circles). `packed`: clustered together. |
| `ratio` | `boolean \| string` |  | Print how many times the largest value is the smallest. `true` for "{largest} is {ratio} times {smallest}", or a template with those placeholders. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order of the shapes in the row layout. Nested and packed always draw largest first. |

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
- Used by: [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md), [count-poster](https://insightcharts.dev/llms/count-poster.md)

## More examples

### Nested squares, highlight, click to select

```tsx
import { ProportionalArea } from "insightcharts";

const data = [
  { market: "All groceries", sales: 412 },
  { market: "Fresh produce", sales: 96 },
  { market: "Organic produce", sales: 21 },
  { market: "Organic berries", sales: 3.4 },
];

<ProportionalArea
  data={data}
  name="market"
  value="sales"
  layout="nested"
  format="£{value}m"
  highlight="Organic produce"
  select
  ratio="{largest} is {ratio} times {smallest}"
  title="Organic produce took £21m of £412m grocery sales in 2025"
  subtitle="Annual sales of one regional grocer by category, £ million, 2025"
  source="Illustrative data"
  note="Invented figures"
/>
```

### Circles in a row

```tsx
import { ProportionalArea } from "insightcharts";

const data = [
  { reactor: "Harlow A", output: 1650 },
  { reactor: "Brant Point", output: 1100 },
  { reactor: "Selby 2", output: 470 },
  { reactor: "Test unit", output: 40 },
];

<ProportionalArea
  theme="sunrise"
  data={data}
  name="reactor"
  value="output"
  shape="circle"
  format="{value} MW"
  ratio
  title="Harlow A has a capacity of 1,650 MW"
  subtitle="Generating capacity of four power stations, megawatts"
  source="Illustrative data"
  note="Invented figures"
/>
```

### Nested circles

```tsx
import { ProportionalArea } from "insightcharts";

const data = [
  { body: "Whole catchment", area: 5200 },
  { body: "Farmland", area: 2900 },
  { body: "Woodland", area: 1150 },
  { body: "Open water", area: 160 },
];

<ProportionalArea
  theme="noir"
  data={data}
  name="body"
  value="area"
  shape="circle"
  layout="nested"
  format="{value} km²"
  title="Farmland covers 2,900 km² of the 5,200 km² catchment"
  subtitle="Land cover of the River Teme catchment, square kilometres"
  source="Illustrative data"
  note="Invented figures"
/>
```

### Stress: eight packed circles, very uneven, long names

```tsx
import { ProportionalArea } from "insightcharts";

const data = [
  { fund: "State pension and retirement benefits", spend: 124 },
  { fund: "Health services", spend: 88 },
  { fund: "Schools", spend: 52 },
  { fund: "Defence", spend: 31 },
  { fund: "Transport infrastructure", spend: 18 },
  { fund: "Courts and prisons", spend: 7.5 },
  { fund: "Overseas aid", spend: 2.2 },
  { fund: "National parks and heritage sites", spend: 0.6 },
];

<ProportionalArea
  theme="forest"
  data={data}
  name="fund"
  value="spend"
  shape="circle"
  layout="packed"
  format="{value}bn"
  ratio
  title="Pensions took 124bn of the 323.3bn budget"
  subtitle="Planned public spending by area, billions, 2025"
  source="Illustrative data"
  note="Invented figures for a fictional country"
/>
```

### Packed squares

```tsx
import { ProportionalArea } from "insightcharts";

const data = [
  { fund: "Pensions", spend: 124 },
  { fund: "Health", spend: 88 },
  { fund: "Schools", spend: 52 },
  { fund: "Defence", spend: 31 },
  { fund: "Transport", spend: 18 },
  { fund: "Courts", spend: 7.5 },
];

<ProportionalArea
  theme="earth"
  data={data}
  name="fund"
  value="spend"
  layout="packed"
  format="{value}bn"
  title="Health took 88bn of planned spending in 2025"
  subtitle="Planned public spending by area, billions, 2025"
  source="Illustrative data"
  note="Invented figures for a fictional country"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/proportional-area.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/proportional-area.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
