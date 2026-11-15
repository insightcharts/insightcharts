# Pill rank (`pill-rank`)

> Shows a ranked list as horizontally centred rounded bars, with each name in capitals on its pill, the value at the left edge and the rank at the right.

- Component: `PillRank` (import from `insightcharts`)
- Spec type: `"pill-rank"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A poster ranking of 4 to about 20 named things where the order and the overall silhouette matter more than fine differences: top cities, largest employers, league tables, with one row highlighted and optional reference rows set apart below.

## Avoid

Precise comparison of values (use bar-chart, where bars share a baseline); negative values (use diverging-bar-chart); change in rank over time (use bump-chart); more than about 25 rows (use data-table).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/pill-rank
```

The file lands at `components/insightcharts/atoms/pill-rank.tsx`. `@insightcharts/pill-rank-demo` adds a ready-made example next to it.

## Usage

```tsx
import { PillRank } from "insightcharts";

const data = [
  { river: "Nile", km: 6650 },
  { river: "Amazon", km: 6400 },
  { river: "Yangtze", km: 6300 },
  { river: "Mississippi-Missouri", km: 6275 },
  { river: "Yenisei", km: 5539 },
  { river: "Yellow River", km: 5464 },
  { river: "Ob-Irtysh", km: 5410 },
  { river: "Congo", km: 4700 },
  { river: "Danube", km: 2850 },
  { river: "Rhine", km: 1230 },
];

<PillRank
  theme="paper"
  data={data}
  name="river"
  value="km"
  format="{value} km"
  highlight="Congo"
  compare={["Danube", "Rhine"]}
  compareLabel="Europe, for comparison"
  title="The Congo is 4,700 km long"
  subtitle="Length of eight major river systems and two European rivers, kilometres"
  source="Encyclopaedia Britannica"
  note="Lengths of river systems are approximate and vary by source"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "pill-rank",
  "theme": "paper",
  "data": [
    { "river": "Nile", "km": 6650 },
    { "river": "Amazon", "km": 6400 },
    { "river": "Yangtze", "km": 6300 },
    { "river": "Mississippi-Missouri", "km": 6275 },
    { "river": "Yenisei", "km": 5539 },
    { "river": "Yellow River", "km": 5464 },
    { "river": "Ob-Irtysh", "km": 5410 },
    { "river": "Congo", "km": 4700 },
    { "river": "Danube", "km": 2850 },
    { "river": "Rhine", "km": 1230 }
  ],
  "name": "river",
  "value": "km",
  "format": "{value} km",
  "highlight": "Congo",
  "compare": ["Danube", "Rhine"],
  "compareLabel": "Europe, for comparison",
  "title": "The Congo is 4,700 km long",
  "subtitle": "Length of eight major river systems and two European rivers, kilometres",
  "source": "Encyclopaedia Britannica",
  "note": "Lengths of river systems are approximate and vary by source"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Name field: one row per data row. |
| `value` (required) | `string` |  | Value field: pill width. Non-positive values are dropped. |
| `sort` | `boolean` | `true` | Sort rows largest first. Set false to keep the data order. |
| `compare` | `string[]` |  | Names of rows that are not ranked: drawn below a dotted rule, without a rank number. |
| `compareLabel` | `string` |  | Short heading over the comparison rows, e.g. "For comparison". |
| `max` | `number` |  | Value that fills the full pill width. Default: the largest value. |
| `ranks` | `boolean` | `true` | Show the rank number at the right edge. |

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
- Used by: [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md), [network-poster](https://insightcharts.dev/llms/network-poster.md), [radial-poster](https://insightcharts.dev/llms/radial-poster.md), [ranking-poster](https://insightcharts.dev/llms/ranking-poster.md)

## More examples

### No highlight, click to select

```tsx
import { PillRank } from "insightcharts";

const data = [
  { hobby: "Reading", pct: 71 },
  { hobby: "Walking", pct: 64 },
  { hobby: "Cooking", pct: 58 },
  { hobby: "Gardening", pct: 41 },
  { hobby: "Cycling", pct: 33 },
  { hobby: "Swimming", pct: 27 },
  { hobby: "Knitting", pct: 12 },
];

<PillRank
  data={data}
  name="hobby"
  value="pct"
  format="{value}%"
  select
  title="71% of adults surveyed read for pleasure"
  subtitle="Share of 1,200 adults who did each activity in the past month"
  note="Illustrative survey figures"
/>
```

### Stress: 16 rows, long names, values from 3 to 2,140

```tsx
import { PillRank } from "insightcharts";

const data = [
  { port: "Port of Saint-Hilaire-du-Rosier", teu: 2140 },
  { port: "Kessel Deepwater", teu: 1730 },
  { port: "Marrow Bay", teu: 1205 },
  { port: "New Alderney Container Terminal", teu: 980 },
  { port: "Tolland", teu: 760 },
  { port: "Vasque", teu: 512 },
  { port: "Great Northern Free Harbour and Dry Dock", teu: 430 },
  { port: "Orm", teu: 298 },
  // ... 8 more rows
];

<PillRank
  theme="blueprint"
  data={data}
  name="port"
  value="teu"
  format="compact"
  highlight="Tolland"
  title="Tolland handled 760 thousand containers in 2024"
  subtitle="Container throughput of 16 ports, thousand TEU, 2024"
  note="Illustrative figures for invented ports"
/>
```

### Data order, no ranks

```tsx
import { PillRank } from "insightcharts";

const data = [
  { day: "Monday", visits: 312 },
  { day: "Tuesday", visits: 344 },
  { day: "Wednesday", visits: 371 },
  { day: "Thursday", visits: 366 },
  { day: "Friday", visits: 428 },
  { day: "Saturday", visits: 502 },
  { day: "Sunday", visits: 287 },
];

<PillRank
  theme="dusk"
  data={data}
  name="day"
  value="visits"
  sort={false}
  ranks={false}
  highlight="Saturday"
  title="The library had 502 visits on Saturday"
  subtitle="Visits per day, one week in March"
  note="Illustrative figures"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/pill-rank.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/pill-rank.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
