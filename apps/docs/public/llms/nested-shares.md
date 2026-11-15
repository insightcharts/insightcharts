# Nested shares (`nested-shares`)

> Shows several shares of the same whole, such as one share at five dates, as outlines nested from one corner of a square, each enclosing an area equal to its share.

- Component: `NestedShares` (import from `insightcharts`)
- Spec type: `"nested-shares"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

How much of one whole something was at 2 to 8 dates or in 2 to 8 categories, when the growth of a share is the point: bicycles made 4% of trips in 2005 and 27% in 2025.

## Avoid

Shares that are parts of each other and should add up (use waffle-chart or treemap); more than 8 items or precise reading of a trend (use line-chart); shares within a point or two of each other, where outlines coincide (use block-bar).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/nested-shares
```

The file lands at `components/insightcharts/atoms/nested-shares.tsx`. `@insightcharts/nested-shares-demo` adds a ready-made example next to it.

## Usage

```tsx
import { NestedShares } from "insightcharts";

const data = [
  { year: "2005", share: 4 },
  { year: "2010", share: 7 },
  { year: "2015", share: 12 },
  { year: "2020", share: 19 },
  { year: "2025", share: 27 },
];

<NestedShares
  theme="ocean"
  data={data}
  name="year"
  value="share"
  format="{value}%"
  highlight="2025"
  wholeLabel="All trips in the city"
  title="Bicycles made 27% of trips in Port Aldwin in 2025"
  subtitle="Share of all trips made by bicycle, 2005 to 2025"
  source="Illustrative data"
  note="Invented figures for a fictional city"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "nested-shares",
  "theme": "ocean",
  "data": [
    { "year": "2005", "share": 4 },
    { "year": "2010", "share": 7 },
    { "year": "2015", "share": 12 },
    { "year": "2020", "share": 19 },
    { "year": "2025", "share": 27 }
  ],
  "name": "year",
  "value": "share",
  "format": "{value}%",
  "highlight": "2025",
  "wholeLabel": "All trips in the city",
  "title": "Bicycles made 27% of trips in Port Aldwin in 2025",
  "subtitle": "Share of all trips made by bicycle, 2005 to 2025",
  "source": "Illustrative data",
  "note": "Invented figures for a fictional city"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Field naming each share: a period ("2025") or a category. |
| `value` (required) | `string` |  | Value field: each row's share of the whole. |
| `total` | `number` |  | The whole. Default: 1 when every value is at most 1, otherwise 100. |
| `wholeLabel` | `string` |  | What the outer square stands for, printed under it, e.g. "All trips". |
| `corner` | `"bottom-left" \| "top-left"` | `"bottom-left"` | The corner every outline grows from. |

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
- Used by: [count-poster](https://insightcharts.dev/llms/count-poster.md), [timeline-poster](https://insightcharts.dev/llms/timeline-poster.md)

## More examples

### From the top corner, click to select

```tsx
import { NestedShares } from "insightcharts";

const data = [
  { year: "1995", share: 0.62 },
  { year: "2005", share: 0.48 },
  { year: "2015", share: 0.31 },
  { year: "2025", share: 0.14 },
];

<NestedShares
  data={data}
  name="year"
  value="share"
  format="percent"
  corner="top-left"
  select
  wholeLabel="All household waste"
  title="Landfill took 14% of household waste in 2025"
  subtitle="Share of household waste sent to landfill in Marlow County, 1995 to 2025"
  source="Illustrative data"
  note="Invented figures for a fictional county"
/>
```

### By category, one highlighted

```tsx
import { NestedShares } from "insightcharts";

const data = [
  { group: "Aged 16 to 24", share: 71 },
  { group: "Aged 25 to 44", share: 58 },
  { group: "Aged 45 to 64", share: 33 },
  { group: "Aged 65 and over", share: 12 },
];

<NestedShares
  theme="magenta"
  data={data}
  name="group"
  value="share"
  format="{value}%"
  highlight="Aged 65 and over"
  wholeLabel="Everyone in the age group"
  title="12% of people aged 65 and over paid by phone in 2025"
  subtitle="Share of each age group that made a contactless phone payment in the past month"
  source="Illustrative data"
  note="Invented survey figures"
/>
```

### Stress: eight close shares, long names

```tsx
import { NestedShares } from "insightcharts";

const data = [
  { item: "First quarter of 2024", share: 2.1 },
  { item: "Second quarter of 2024", share: 2.4 },
  { item: "Third quarter of 2024", share: 3 },
  { item: "Fourth quarter of 2024", share: 3.2 },
  { item: "First quarter of 2025", share: 8.5 },
  { item: "Second quarter of 2025", share: 9.1 },
  { item: "Third quarter of 2025", share: 44 },
  { item: "Fourth quarter of 2025, provisional estimate", share: 46.5 },
];

<NestedShares
  theme="paper"
  data={data}
  name="item"
  value="share"
  format="{value}%"
  wholeLabel="All new car registrations"
  title="Electric cars were 46.5% of new registrations in the fourth quarter of 2025"
  subtitle="Battery electric share of new car registrations by quarter"
  source="Illustrative data"
  note="Invented figures"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/nested-shares.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/nested-shares.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
