# Segmented bar (`segmented-bar`)

> Splits one whole into proportional segments along a single horizontal bar.

- Component: `SegmentedBar` (import from `insightcharts`)
- Spec type: `"segmented-bar"`
- Level: atom. Category: part-to-whole.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A compact part-to-whole for cards, table cells and stat rows: budget split, device mix, vote share. The legend carries names in block order.

## Avoid

Comparing compositions across several groups (use bar-chart with stack "percent"); more than about 6 parts or many slivers (use bar-chart); when the reader should count units (use waffle-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/segmented-bar
```

The file lands at `components/insightcharts/atoms/segmented-bar.tsx`. `@insightcharts/segmented-bar-demo` adds a ready-made example next to it.

## Usage

```tsx
import { SegmentedBar } from "insightcharts";

const data = [
  { party: "Labour", seats: 411 },
  { party: "Conservative", seats: 121 },
  { party: "Liberal Democrat", seats: 72 },
  { party: "SNP", seats: 9 },
  { party: "Others", seats: 37 },
];

<SegmentedBar
  data={data}
  name="party"
  value="seats"
  title="Labour won 411 of 650 seats in the 2024 general election"
  subtitle="Seats in the House of Commons by party after the 2024 general election"
  source="House of Commons Library"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "segmented-bar",
  "data": [
    { "party": "Labour", "seats": 411 },
    { "party": "Conservative", "seats": 121 },
    { "party": "Liberal Democrat", "seats": 72 },
    { "party": "SNP", "seats": 9 },
    { "party": "Others", "seats": 37 }
  ],
  "name": "party",
  "value": "seats",
  "title": "Labour won 411 of 650 seats in the 2024 general election",
  "subtitle": "Seats in the House of Commons by party after the 2024 general election",
  "source": "House of Commons Library",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Category field: one segment per distinct value. |
| `value` (required) | `string` |  | Value field. |
| `size` | `"tall" \| "thin"` | `"tall"` | 28px with shares printed inside where they fit, or 8px unlabelled. |
| `sort` | `"none" \| "desc"` | `"none"` | Segment order; the legend follows it. |
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
- Used by: [metric-breakdown](https://insightcharts.dev/llms/metric-breakdown.md), [poster](https://insightcharts.dev/llms/poster.md), [comparison-brief](https://insightcharts.dev/llms/comparison-brief.md), [explainer](https://insightcharts.dev/llms/explainer.md)

## More examples

### Thin, for cards

```tsx
import { SegmentedBar } from "insightcharts";

const data = [
  { device: "Mobile", sessions: 58200 },
  { device: "Desktop", sessions: 31400 },
  { device: "Tablet", sessions: 6100 },
];

<SegmentedBar
  data={data}
  name="device"
  value="sessions"
  size="thin"
  title="Mobile accounted for 61% of sessions in the last 30 days"
  subtitle="Sessions by device, last 30 days"
/>
```

### With highlight

```tsx
import { SegmentedBar } from "insightcharts";

const data = [
  { item: "Housing", spend: 33 },
  { item: "Transport", spend: 17 },
  { item: "Food", spend: 13 },
  { item: "Healthcare", spend: 8 },
  { item: "Everything else", spend: 29 },
];

<SegmentedBar
  data={data}
  name="item"
  value="spend"
  highlight="Housing"
  title="Housing was 33% of US consumer spending in 2023"
  subtitle="Share of annual consumer spending, United States, 2023"
  source="BLS Consumer Expenditure Survey"
  note="Figures are approximate, for illustration"
/>
```

### Stress: many parts, long names, slivers

```tsx
import { SegmentedBar } from "insightcharts";

const data = [
  { cause: "Cardiovascular diseases", deaths: 19.8 },
  { cause: "Cancers", deaths: 10 },
  { cause: "Chronic respiratory diseases", deaths: 4 },
  { cause: "Digestive diseases", deaths: 2.6 },
  { cause: "Lower respiratory infections", deaths: 2.2 },
  { cause: "Neonatal disorders", deaths: 1.8 },
  { cause: "Alzheimer's disease and other dementias", deaths: 1.8 },
  { cause: "Diabetes", deaths: 1.6 },
  // ... 3 more rows
];

<SegmentedBar
  data={data}
  name="cause"
  value="deaths"
  format="{value}m"
  title="Cardiovascular diseases cause 19.8 million deaths a year"
  subtitle="Deaths by cause, world, millions per year"
  source="IHME Global Burden of Disease"
  note="Rounded, approximate figures for illustration"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/segmented-bar.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/segmented-bar.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
