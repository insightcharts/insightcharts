# Unit blocks (`unit-blocks`)

> Shows the size of each group as a solid block of small icons, one icon per fixed number of units.

- Component: `UnitBlocks` (import from `insightcharts`)
- Spec type: `"unit-blocks"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Large counts of people or things in 2 to 12 groups, where the reader should see the crowd itself: 20,350 marathon finishers by age group, one figure per 10 runners.

## Avoid

Precise comparison of close values (use block-bar or bar-chart); fewer than about 30 icons per group (use pictogram-chart or icon-array-grid); shares of one whole (use waffle-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/unit-blocks
```

The file lands at `components/insightcharts/atoms/unit-blocks.tsx`. `@insightcharts/unit-blocks-demo` adds a ready-made example next to it.

## Usage

```tsx
import { UnitBlocks } from "insightcharts";

const data = [
  { age: "Under 30", finishers: 4180 },
  { age: "30 to 39", finishers: 6920 },
  { age: "40 to 49", finishers: 5340 },
  { age: "50 to 59", finishers: 2760 },
  { age: "60 and over", finishers: 1150 },
];

<UnitBlocks
  data={data}
  name="age"
  value="finishers"
  unit={10}
  unitLabel="10 finishers"
  format="integer"
  title="6,920 of the 20,350 finishers were aged 30 to 39"
  subtitle="Finishers of the Lakeshore Marathon by age group, 2025"
  source="Illustrative data"
  note="Invented figures for a fictional race"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "unit-blocks",
  "data": [
    { "age": "Under 30", "finishers": 4180 },
    { "age": "30 to 39", "finishers": 6920 },
    { "age": "40 to 49", "finishers": 5340 },
    { "age": "50 to 59", "finishers": 2760 },
    { "age": "60 and over", "finishers": 1150 }
  ],
  "name": "age",
  "value": "finishers",
  "unit": 10,
  "unitLabel": "10 finishers",
  "format": "integer",
  "title": "6,920 of the 20,350 finishers were aged 30 to 39",
  "subtitle": "Finishers of the Lakeshore Marathon by age group, 2025",
  "source": "Illustrative data",
  "note": "Invented figures for a fictional race"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Group field: one block of icons per row of data. |
| `value` (required) | `string` |  | Value field: the quantity each block counts out. |
| `unit` | `number` |  | Units per icon. Default: a round number that gives about 2,000 icons in total. |
| `unitLabel` | `string` |  | What one icon stands for, for the key line, e.g. "10 finishers". |
| `icon` | `IconName \| "path://..."` | `"person"` | Built-in icon name or a custom single SVG path. |
| `series` | `string` |  | Field that colours the blocks. Default: one colour per group, up to eight groups. |
| `layout` | `"packed" \| "columns"` | `"packed"` | `packed`: equal block heights, widths follow the counts. `columns`: equal widths, blocks grow upwards from a baseline. |
| `columns` | `number` |  | Blocks per line in the `columns` layout. Default: all, two on a phone. |
| `iconSize` | `number` |  | Icon height in px. Default: the largest that fits, chosen per chart. To put two charts on one scale, give both the same `unit` and `iconSize`: the icon size, the gaps and the worth of an icon are then identical and the chart takes the height it needs. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order of the blocks. |

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
- Used by: [count-poster](https://insightcharts.dev/llms/count-poster.md)

## More examples

### Highlight, click to select

```tsx
import { UnitBlocks } from "insightcharts";

const data = [
  { age: "Under 30", finishers: 4180 },
  { age: "30 to 39", finishers: 6920 },
  { age: "40 to 49", finishers: 5340 },
  { age: "50 to 59", finishers: 2760 },
  { age: "60 and over", finishers: 1150 },
];

<UnitBlocks
  data={data}
  name="age"
  value="finishers"
  unit={10}
  unitLabel="10 finishers"
  format="integer"
  highlight="60 and over"
  select
  title="1,150 finishers were aged 60 or over"
  subtitle="Finishers of the Lakeshore Marathon by age group, 2025"
  source="Illustrative data"
  note="Invented figures for a fictional race"
/>
```

### Stress: 20,350 icons, one per finisher

```tsx
import { UnitBlocks } from "insightcharts";

const data = [
  { age: "Under 30", finishers: 4180 },
  { age: "30 to 39", finishers: 6920 },
  { age: "40 to 49", finishers: 5340 },
  { age: "50 to 59", finishers: 2760 },
  { age: "60 and over", finishers: 1150 },
];

<UnitBlocks
  data={data}
  name="age"
  value="finishers"
  unit={1}
  unitLabel="1 finisher"
  format="integer"
  title="20,350 people finished the Lakeshore Marathon in 2025"
  subtitle="Finishers by age group. Every figure is one runner"
  source="Illustrative data"
  note="Invented figures for a fictional race"
/>
```

### Columns of squares, coloured by a series field

```tsx
import { UnitBlocks } from "insightcharts";

const data = [
  { depot: "Northgate", buses: 412, fuel: "Electric" },
  { depot: "Harbour Road", buses: 268, fuel: "Electric" },
  { depot: "Millbrook", buses: 655, fuel: "Diesel" },
  { depot: "Eastfield", buses: 381, fuel: "Diesel" },
  { depot: "Quarry Lane", buses: 97, fuel: "Hydrogen" },
];

<UnitBlocks
  data={data}
  name="depot"
  value="buses"
  series="fuel"
  unit={1}
  unitLabel="1 bus"
  icon="square"
  layout="columns"
  title="Millbrook depot ran 655 diesel buses in 2025"
  subtitle="Buses in service by depot and fuel, 2025"
  source="Illustrative data"
  note="Invented figures for a fictional operator"
/>
```

### Stress: twelve uneven groups, long names

```tsx
import { UnitBlocks } from "insightcharts";

const data = [
  { species: "Common starling", birds: 9840 },
  { species: "House sparrow", birds: 7120 },
  { species: "Wood pigeon", birds: 5310 },
  { species: "Blackbird", birds: 3980 },
  { species: "Blue tit", birds: 3460 },
  { species: "European goldfinch", birds: 2210 },
  { species: "Great spotted woodpecker", birds: 640 },
  { species: "Long-tailed tit", birds: 580 },
  // ... 4 more rows
];

<UnitBlocks
  data={data}
  name="species"
  value="birds"
  unit={20}
  unitLabel="20 birds"
  icon="circle"
  format="integer"
  title="Volunteers counted 9,840 starlings in one weekend in 2025"
  subtitle="Birds recorded in one weekend garden count by species, 2025"
  source="Illustrative data"
  note="Invented figures for a fictional survey"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/unit-blocks.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/unit-blocks.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
