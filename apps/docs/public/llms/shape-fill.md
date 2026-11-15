# Shape fill (`shape-fill`)

> Shows one or more percentages as icon silhouettes filled from the bottom to that level, with the number printed large beside each.

- Component: `ShapeFill` (import from `insightcharts`)
- Spec type: `"shape-fill"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

One to six shares of a full amount where the object itself says what is measured: how full a reservoir is, how charged a fleet is, what share of homes have a heat pump.

## Avoid

The fill height only approximates the share, because an irregular silhouette holds less area at its narrow end, so the number must always stay printed; for values to be compared precisely use block-bar or bar-chart, for a counted share use waffle-chart, for a compact inline meter use progress-meter.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/shape-fill
```

The file lands at `components/insightcharts/atoms/shape-fill.tsx`. `@insightcharts/shape-fill-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ShapeFill } from "insightcharts";

const data = [
  { reservoir: "Carrow", level: 63 },
  { reservoir: "Upper Fen", level: 41 },
  { reservoir: "Stonebeck", level: 88 },
];

<ShapeFill
  theme="blueprint"
  data={data}
  name="reservoir"
  value="level"
  icon="drop"
  format="{value}%"
  title="Carrow Reservoir was 63% full on 1 September 2025"
  subtitle="Water stored as a share of capacity, three reservoirs, 1 September 2025"
  source="Illustrative data"
  note="Invented figures for fictional reservoirs"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "theme": "blueprint",
  "type": "shape-fill",
  "data": [
    { "reservoir": "Carrow", "level": 63 },
    { "reservoir": "Upper Fen", "level": 41 },
    { "reservoir": "Stonebeck", "level": 88 }
  ],
  "name": "reservoir",
  "value": "level",
  "icon": "drop",
  "format": "{value}%",
  "title": "Carrow Reservoir was 63% full on 1 September 2025",
  "subtitle": "Water stored as a share of capacity, three reservoirs, 1 September 2025",
  "source": "Illustrative data",
  "note": "Invented figures for fictional reservoirs"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Label field: one silhouette per row. |
| `value` (required) | `string` |  | Value field: how full each silhouette is, against `max`. |
| `max` | `number` |  | The value that fills a silhouette completely. Default: 1 when every value is at most 1, otherwise 100. |
| `icon` | `IconName \| "path://..."` | `"drop"` | Built-in icon name or a custom single SVG path. |
| `icons` | `Record<string, string>` |  | Icon per label; falls back to `icon`. |
| `columns` | `number` |  | Silhouettes per line. Default: up to four, two on a phone. |
| `colorBy` | `"single" \| "item"` | `"single"` | `single`: every silhouette in the accent colour. `item`: one colour per row. |
| `iconSize` | `number` |  | Silhouette height in px. Default: sized to the width, or grown to fill the box when the `height` prop or `aspect` is given, so one silhouette can be the main figure of a poster. |

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
- Used by: [count-poster](https://insightcharts.dev/llms/count-poster.md), [profile-poster](https://insightcharts.dev/llms/profile-poster.md), [ranking-poster](https://insightcharts.dev/llms/ranking-poster.md)

## More examples

### One silhouette

```tsx
import { ShapeFill } from "insightcharts";

const data = [{ what: "of homes in Eastvale had a heat pump", share: 0.18 }];

<ShapeFill
  data={data}
  name="what"
  value="share"
  icon="house"
  format="percent"
  title="18% of homes in Eastvale had a heat pump in 2025"
  subtitle="Share of occupied homes with a heat pump installed, 2025"
  source="Illustrative data"
  note="Invented figure for a fictional town"
/>
```

### One silhouette sized by the height prop

```tsx
import { ShapeFill } from "insightcharts";

const data = [{ what: "of the battery fleet was charged at 6am", share: 0.72 }];

<ShapeFill
  theme="ocean"
  data={data}
  name="what"
  value="share"
  icon="bolt"
  format="percent"
  height={460}
  title="72% of the battery fleet was charged at 6am on 3 March 2025"
  subtitle="Share of 140 electric buses with a full charge at the start of service"
  source="Illustrative data"
  note="Invented figure for a fictional operator"
/>
```

### Highlight, click to select

```tsx
import { ShapeFill } from "insightcharts";

const data = [
  { district: "Northbank", cover: 34 },
  { district: "Old Town", cover: 9 },
  { district: "Riverside", cover: 22 },
  { district: "Hillcrest", cover: 47 },
];

<ShapeFill
  theme="dusk"
  data={data}
  name="district"
  value="cover"
  icon="tree"
  format="{value}%"
  highlight="Old Town"
  select
  title="Trees covered 9% of Old Town in 2025"
  subtitle="Tree canopy as a share of land area by district, 2025"
  source="Illustrative data"
  note="Invented figures for a fictional city"
/>
```

### Stress: six items, mixed icons, long labels

```tsx
import { ShapeFill } from "insightcharts";

const data = [
  { item: "Electric buses charged and ready at 6am", ready: 92 },
  { item: "Households on a time-of-use electricity tariff", ready: 27 },
  { item: "Company cars that are battery electric", ready: 54 },
  { item: "Street trees surviving their first five years", ready: 71 },
  { item: "Reservoir storage", ready: 3 },
  { item: "Adults with a savings account", ready: 100 },
];

<ShapeFill
  theme="poster"
  data={data}
  name="item"
  value="ready"
  icons={{
    "Electric buses charged and ready at 6am": "bolt",
    "Households on a time-of-use electricity tariff": "house",
    "Company cars that are battery electric": "car",
    "Street trees surviving their first five years": "tree",
    "Reservoir storage": "drop",
    "Adults with a savings account": "person",
  }}
  columns={3}
  colorBy="item"
  format="{value}%"
  title="Six shares from the 2025 city report"
  subtitle="Each silhouette is filled to the share shown beside it"
  source="Illustrative data"
  note="Invented figures"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/shape-fill.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/shape-fill.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
