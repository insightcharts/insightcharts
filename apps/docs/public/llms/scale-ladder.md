# Scale ladder (`scale-ladder`)

> A tall vertical band graded along one scale (linear or log, running up or down) with each item placed at its true position and labelled with an icon, its name and its value on alternating sides.

- Component: `ScaleLadder` (import from `insightcharts`)
- Spec type: `"scale-ladder"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Answering how deep, how high, how hot, how old or how far each of 4 to about 20 things is on one shared scale, when the reader needs the positions themselves: depths, altitudes, temperatures, ages, distances. Use `zones` to name ranges along the scale.

## Avoid

Comparing sizes rather than positions (use bar-chart or lollipop-chart); events with start and end dates (use timeline-chart); a distribution of many unnamed values (use strip-plot or histogram).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/scale-ladder
```

The file lands at `components/insightcharts/atoms/scale-ladder.tsx`. `@insightcharts/scale-ladder-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ScaleLadder } from "insightcharts";

const data = [
  { thing: "Fridge", c: 4 },
  { thing: "Chocolate melts", c: 34 },
  { thing: "Egg white sets", c: 62 },
  { thing: "Water boils", c: 100, icon: "drop" },
  { thing: "Sugar caramelises", c: 170 },
  { thing: "Deep-frying oil", c: 180, icon: "drop" },
  { thing: "Bread bakes", c: 220 },
  { thing: "Home oven at full heat", c: 250 },
  { thing: "Wood-fired pizza oven", c: 450 },
];

<ScaleLadder
  theme="magenta"
  data={data}
  name="thing"
  value="c"
  iconField="icon"
  format="{value}°C"
  scaleLabel="Temperature"
  min={0}
  max={500}
  zones={[
    { from: 0, to: 100, label: "Below boiling" },
    { from: 100, to: 250, label: "Home oven range" },
    { from: 250, to: 500, label: "Wood-fired oven range" },
  ]}
  title="Nine kitchen temperatures from 4°C to 450°C"
  subtitle="Typical temperatures in a kitchen, degrees Celsius"
  note="Approximate, rounded figures."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "theme": "magenta",
  "type": "scale-ladder",
  "data": [
    { "thing": "Fridge", "c": 4 },
    { "thing": "Chocolate melts", "c": 34 },
    { "thing": "Egg white sets", "c": 62 },
    { "thing": "Water boils", "c": 100, "icon": "drop" },
    { "thing": "Sugar caramelises", "c": 170 },
    { "thing": "Deep-frying oil", "c": 180, "icon": "drop" },
    { "thing": "Bread bakes", "c": 220 },
    { "thing": "Home oven at full heat", "c": 250 },
    { "thing": "Wood-fired pizza oven", "c": 450 }
  ],
  "name": "thing",
  "value": "c",
  "iconField": "icon",
  "format": "{value}°C",
  "scaleLabel": "Temperature",
  "min": 0,
  "max": 500,
  "zones": [
    { "from": 0, "to": 100, "label": "Below boiling" },
    { "from": 100, "to": 250, "label": "Home oven range" },
    { "from": 250, "to": 500, "label": "Wood-fired oven range" }
  ],
  "title": "Nine kitchen temperatures from 4°C to 450°C",
  "subtitle": "Typical temperatures in a kitchen, degrees Celsius",
  "note": "Approximate, rounded figures."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Field holding each item's name. |
| `value` (required) | `string` |  | Field holding each item's position on the scale. |
| `icon` | `IconInput` |  | One icon for every item: a built-in name or a `path://` string. Items without an icon get a dot. |
| `iconField` | `string` |  | Field holding a per-item icon name or `path://` string. Overrides `icon`. |
| `scale` | `"linear" \| "log"` | `"linear"` | Log spaces the scale by powers of ten; the heading over the band says so. |
| `direction` | `"up" \| "down"` | `"up"` | `up`: larger values higher (height, temperature). `down`: larger values lower (depth, age). |
| `min` | `number` |  | Start of the scale. Default: a round number at or below the smallest value. |
| `max` | `number` |  | End of the scale. Default: a round number at or above the largest value. |
| `ticks` | `number[]` |  | Values that get a boxed label on the band. Default: round steps, or powers of ten on a log scale. |
| `zones` | `{ from: number; to: number; label: string }[]` |  | Named ranges along the scale, shaded across the graphic and named along its outer edge. |
| `scaleLabel` | `string` |  | Heading over the band: the measure and its unit, e.g. "Depth, metres". |
| `names` | `Record<string, string>` |  | Display names for item keys. |
| `bandWidth` | `number` |  | Width of the band in px, at most 40% of the plot width. Default 60, or 46 on narrow screens. |

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
- Used by: [profile-poster](https://insightcharts.dev/llms/profile-poster.md), [scale-poster](https://insightcharts.dev/llms/scale-poster.md)

## More examples

### Depth, log scale, running down, one highlighted

```tsx
import { ScaleLadder } from "insightcharts";

const data = [
  { thing: "Water main", m: 1.2, icon: "drop" },
  { thing: "Street tree roots", m: 2, icon: "tree" },
  { thing: "Cellar floor", m: 3, icon: "house" },
  { thing: "Main sewer", m: 6 },
  { thing: "Metro platform", m: 24, icon: "person" },
  { thing: "Road tunnel", m: 40, icon: "car" },
  { thing: "Geothermal borehole", m: 180, icon: "bolt" },
  { thing: "Drinking-water well", m: 320, icon: "drop" },
];

<ScaleLadder
  data={data}
  name="thing"
  value="m"
  iconField="icon"
  scale="log"
  direction="down"
  scaleLabel="Depth below street level, metres"
  format="{value} m"
  highlight="Drinking-water well"
  title="The drinking-water well reached 320 metres below street level"
  subtitle="Depth of eight things under one city street, metres below street level"
  note="Illustrative figures for an invented city."
/>
```

### Stress: 14 items, crowded values, long names

```tsx
import { ScaleLadder } from "insightcharts";

const data = [
  { structure: "Cathedral spire", m: 96 },
  { structure: "Old telecommunications tower", m: 142 },
  { structure: "Harbour crane", m: 68 },
  { structure: "Riverside residential tower, phase two", m: 131 },
  { structure: "City hall clock tower", m: 74 },
  { structure: "Northgate office block", m: 88 },
  { structure: "Stadium floodlight mast", m: 62 },
  { structure: "University library", m: 41 },
  // ... 6 more rows
];

<ScaleLadder
  theme="blueprint"
  data={data}
  name="structure"
  value="m"
  icon="square"
  scaleLabel="Height, metres"
  format="{value} m"
  min={0}
  title="The port wind turbine reached 198 metres at its blade tip"
  subtitle="Height of 14 structures in one city, metres above ground"
  note="Illustrative figures for an invented city."
/>
```

### Height, one icon for all, one highlighted

```tsx
import { ScaleLadder } from "insightcharts";

const data = [
  { tree: "Apple tree", m: 5 },
  { tree: "Silver birch", m: 20 },
  { tree: "English oak", m: 30 },
  { tree: "Norway spruce", m: 45 },
  { tree: "Douglas fir", m: 75 },
  { tree: "Coast redwood", m: 115 },
];

<ScaleLadder
  theme="forest"
  data={data}
  name="tree"
  value="m"
  icon="tree"
  scaleLabel="Height, metres"
  format="{value} m"
  min={0}
  max={120}
  ticks={[0, 30, 60, 90, 120]}
  highlight="Coast redwood"
  title="The coast redwood reaches 115 metres, 23 times the apple tree"
  subtitle="Height of six trees at maturity, metres"
  note="Approximate, rounded figures for illustration."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/scale-ladder.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/scale-ladder.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
