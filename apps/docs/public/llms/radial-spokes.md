# Radial spokes (`radial-spokes`)

> Draws one spoke per row radiating from a centre disc, each as long as its value, with the name and value set on an outer ring.

- Component: `RadialSpokes` (import from `insightcharts`)
- Spec type: `"radial-spokes"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A poster of 4 to 12 effects, causes or attributes of one subject, which sits in the centre as an icon or a short label: what a household's energy goes on, the side effects of one drug, the scores of one product.

## Avoid

Precise comparison or a ranking (use bar-chart or pill-rank); a dimension that is a cycle, such as hours or months (use radial-bar-chart); more than 12 rows (use bar-chart); several subjects compared on the same attributes (use small-multiples or heatmap).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/radial-spokes
```

The file lands at `components/insightcharts/atoms/radial-spokes.tsx`. `@insightcharts/radial-spokes-demo` adds a ready-made example next to it.

## Usage

```tsx
import { RadialSpokes } from "insightcharts";

const data = [
  { use: "Space heating", share: 42 },
  { use: "Hot water", share: 17 },
  { use: "Cooking", share: 6 },
  { use: "Fridge and freezer", share: 8 },
  { use: "Laundry", share: 7 },
  { use: "Lighting", share: 5 },
  { use: "Screens and computers", share: 9 },
  { use: "Everything else", share: 6 },
];

<RadialSpokes
  theme="forest"
  data={data}
  name="use"
  value="share"
  format="{value}%"
  icon="house"
  highlight="Space heating"
  title="Space heating uses 42% of a home's energy"
  subtitle="Share of household energy by end use, a typical home in a cool climate"
  note="Illustrative figures"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "theme": "forest",
  "type": "radial-spokes",
  "data": [
    { "use": "Space heating", "share": 42 },
    { "use": "Hot water", "share": 17 },
    { "use": "Cooking", "share": 6 },
    { "use": "Fridge and freezer", "share": 8 },
    { "use": "Laundry", "share": 7 },
    { "use": "Lighting", "share": 5 },
    { "use": "Screens and computers", "share": 9 },
    { "use": "Everything else", "share": 6 }
  ],
  "name": "use",
  "value": "share",
  "format": "{value}%",
  "icon": "house",
  "highlight": "Space heating",
  "title": "Space heating uses 42% of a home's energy",
  "subtitle": "Share of household energy by end use, a typical home in a cool climate",
  "note": "Illustrative figures"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Name field: one spoke per row, in data order, clockwise. |
| `value` (required) | `string` |  | Value field: spoke length from the centre disc. |
| `shape` | `"bar" \| "line"` | `"bar"` | A thick tapered bar with a round head, or a thin line ending in a dot. |
| `icon` | `string` |  | Icon in the centre disc: a built-in name or `path://`. |
| `centerLabel` | `string` |  | Short text in the centre disc, used when there is no `icon`. |
| `ring` | `boolean` | `true` | Dotted outer ring at the scale maximum, where the labels sit. |
| `max` | `number` |  | Value that reaches the outer ring. Default: the largest value. |
| `startAngle` | `number` | `0` | Angle of the first spoke in degrees clockwise from 12 o'clock. |
| `sweep` | `number` | `360` | Arc the spokes are spread over, in degrees. 180 makes a fan. |
| `colorBy` | `"single" \| "value"` | `"single"` | The accent for every spoke, or a shade by value along the sequential ramp. |

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
- Used by: [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md), [radial-poster](https://insightcharts.dev/llms/radial-poster.md)

## More examples

### Thin lines, centre label, click to select

```tsx
import { RadialSpokes } from "insightcharts";

const data = [
  { aspect: "Battery life", score: 8.6 },
  { aspect: "Camera", score: 7.1 },
  { aspect: "Screen", score: 9 },
  { aspect: "Speed", score: 6.4 },
  { aspect: "Build", score: 7.8 },
  { aspect: "Value", score: 5.2 },
];

<RadialSpokes
  data={data}
  name="aspect"
  value="score"
  shape="line"
  max={10}
  format={{ minimumFractionDigits: 1 }}
  centerLabel="Model K phone"
  select
  title="Reviewers scored the Model K's screen 9.0 out of 10"
  subtitle="Average review score by aspect, out of 10. The ring marks 10."
  note="Illustrative scores for an invented phone"
/>
```

### Fan over 180 degrees, shaded by value

```tsx
import { RadialSpokes } from "insightcharts";

const data = [
  { effect: "Drowsiness", pct: 31 },
  { effect: "Dry mouth", pct: 22 },
  { effect: "Headache", pct: 14 },
  { effect: "Nausea", pct: 9 },
  { effect: "Dizziness", pct: 6 },
  { effect: "Rash", pct: 2 },
];

<RadialSpokes
  theme="noir"
  data={data}
  name="effect"
  value="pct"
  format="{value}%"
  sweep={180}
  colorBy="value"
  icon="drop"
  title="31% of trial patients reported drowsiness"
  subtitle="Share of 840 patients reporting each side effect in a 12-week trial"
  note="Illustrative figures for an invented medicine"
/>
```

### Stress: 12 spokes, long labels, values from 0 to 96

```tsx
import { RadialSpokes } from "insightcharts";

const data = [
  { cost: "Unplanned maintenance and emergency call-outs", k: 96 },
  { cost: "Fuel", k: 71 },
  { cost: "Crew wages and overtime", k: 88 },
  { cost: "Port fees", k: 34 },
  { cost: "Insurance", k: 27 },
  { cost: "Training", k: 0 },
  { cost: "Catering", k: 12 },
  { cost: "Navigation and satellite communications", k: 19 },
  // ... 4 more rows
];

<RadialSpokes
  theme="magenta"
  data={data}
  name="cost"
  value="k"
  format="£{value}k"
  centerLabel="One ferry"
  highlight={["Unplanned maintenance and emergency call-outs"]}
  height={560}
  title="Unplanned maintenance cost £96,000 per ferry in 2024"
  subtitle="Annual running cost of one ferry by item, £ thousand, 2024"
  note="Illustrative figures for an invented operator"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/radial-spokes.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/radial-spokes.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
