# Funnel chart (`funnel-chart`)

> Shows how many remain at each step of a sequence, with conversion and drop-off between steps.

- Component: `FunnelChart` (import from `insightcharts`)
- Spec type: `"funnel-chart"`
- Level: atom. Category: flow.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A strict sequence where each stage is a subset of the one before: sign-up flows, hiring pipelines, sales stages, applications to admissions. 3 to 7 stages.

## Avoid

Stages that are not sequential subsets, or categories with no order (use bar-chart); flows that split to several destinations (use sankey-chart); conversion tracked over time (use line-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/funnel-chart
```

The file lands at `components/insightcharts/atoms/funnel-chart.tsx`. `@insightcharts/funnel-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { FunnelChart } from "insightcharts";

const data = [
  { step: "Visited the pricing page", users: 48200 },
  { step: "Started a free trial", users: 9640 },
  { step: "Connected a data source", users: 5310 },
  { step: "Invited a teammate", users: 2230 },
  { step: "Became a paying customer", users: 1480 },
];

<FunnelChart
  data={data}
  stage="step"
  value="users"
  format="integer"
  title="20% of pricing-page visitors started a free trial"
  subtitle="Users reaching each step of the sign-up funnel, last 90 days"
  source="Product analytics"
  note="Illustrative data"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "funnel-chart",
  "data": [
    { "step": "Visited the pricing page", "users": 48200 },
    { "step": "Started a free trial", "users": 9640 },
    { "step": "Connected a data source", "users": 5310 },
    { "step": "Invited a teammate", "users": 2230 },
    { "step": "Became a paying customer", "users": 1480 }
  ],
  "stage": "step",
  "value": "users",
  "format": "integer",
  "title": "20% of pricing-page visitors started a free trial",
  "subtitle": "Users reaching each step of the sign-up funnel, last 90 days",
  "source": "Product analytics",
  "note": "Illustrative data"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `stage` (required) | `string` |  | Stage field. Rows are read in data order; the first row is the top of the funnel. |
| `value` (required) | `string` |  | Count field. |
| `dropoff` | `boolean` | `true` | State the drop-off between consecutive stages. |
| `dropoffLabel` | `string` | `"dropped off"` | Word for what is lost between stages. |

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

### Three stages, highlight

```tsx
import { FunnelChart } from "insightcharts";

const data = [
  { stage: "Applied", people: 12400 },
  { stage: "Interviewed", people: 1860 },
  { stage: "Offered a place", people: 930 },
];

<FunnelChart
  theme="blueprint"
  data={data}
  stage="stage"
  value="people"
  highlight="Offered a place"
  dropoffLabel="rejected"
  height={220}
  title="930 of 12,400 applicants were offered a place"
  subtitle="Applications to the graduate scheme, 2024 intake"
  source="HR recruitment data"
  note="Illustrative data"
/>
```

### Four stages, custom drop-off word

```tsx
import { FunnelChart } from "insightcharts";

const data = [
  { stage: "Started an application", loans: 8400 },
  { stage: "Submitted documents", loans: 5880 },
  { stage: "Approved", loans: 3360 },
  { stage: "Drew down the loan", loans: 2940 },
];

<FunnelChart
  theme="editorial"
  data={data}
  stage="stage"
  value="loans"
  format="integer"
  dropoffLabel="lost"
  height={300}
  title="2,940 of 8,400 loan applications ended in a loan"
  subtitle="Small-business loan applications at each stage, 2024"
  note="Illustrative data"
/>
```

### Stress: seven stages, long names, big numbers

```tsx
import { FunnelChart } from "insightcharts";

const data = [
  { stage: "Impressions served across all paid channels", n: 18400000 },
  { stage: "Clicked through to the landing page", n: 2210000 },
  { stage: "Viewed at least one product", n: 1480000 },
  { stage: "Added an item to the basket", n: 412000 },
  { stage: "Reached checkout", n: 236000 },
  { stage: "Entered payment details", n: 171000 },
  { stage: "Completed purchase", n: 148000 },
];

<FunnelChart
  theme="earth"
  data={data}
  stage="stage"
  value="n"
  format="compact"
  height={420}
  title="12% of ad impressions led to a click"
  subtitle="Campaign funnel from ad impression to purchase, fourth quarter"
  source="Marketing analytics"
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/funnel-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/funnel-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
