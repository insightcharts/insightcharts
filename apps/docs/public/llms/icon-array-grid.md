# Icon array grid (`icon-array-grid`)

> Compares many counts as a grid of labelled tiles, each holding an array of N icons with its name and number.

- Component: `IconArrayGrid` (import from `insightcharts`)
- Spec type: `"icon-array-grid"`
- Level: atom. Category: poster.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Counts of up to about 150 in 4 to 24 categories, especially rates per 100 or per 1,000: cars per 100 households in 12 districts. Set `total` so every tile shows the same full array with the uncounted icons as ghosts.

## Avoid

Counts in the thousands (use unit-blocks); two to six categories where one row of icons each is enough (use pictogram-chart); values that need precise comparison or ranking (use block-bar or bar-chart); one share of one whole (use waffle-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/icon-array-grid
```

The file lands at `components/insightcharts/atoms/icon-array-grid.tsx`. `@insightcharts/icon-array-grid-demo` adds a ready-made example next to it.

## Usage

```tsx
import { IconArrayGrid } from "insightcharts";

const data = [
  { district: "Ashby", cars: 118 },
  { district: "Brook End", cars: 104 },
  { district: "Castle Hill", cars: 97 },
  { district: "Dockside", cars: 41 },
  { district: "Eastfield", cars: 88 },
  { district: "Fairmile", cars: 126 },
  { district: "Greenway", cars: 73 },
  { district: "Hollins", cars: 110 },
  { district: "Old Town", cars: 36 },
  { district: "Priory", cars: 92 },
  { district: "Riverside", cars: 58 },
  { district: "Station Quarter", cars: 29 },
];

<IconArrayGrid
  theme="sunrise"
  data={data}
  name="district"
  value="cars"
  icon="car"
  unitLabel="1 car per 100 households"
  columns={4}
  title="Fairmile had 126 cars per 100 households in 2025"
  subtitle="Cars per 100 households in 12 districts of Port Aldwin, 2025"
  source="Illustrative data"
  note="Invented figures for a fictional city"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "icon-array-grid",
  "theme": "sunrise",
  "data": [
    { "district": "Ashby", "cars": 118 },
    { "district": "Brook End", "cars": 104 },
    { "district": "Castle Hill", "cars": 97 },
    { "district": "Dockside", "cars": 41 },
    { "district": "Eastfield", "cars": 88 },
    { "district": "Fairmile", "cars": 126 },
    { "district": "Greenway", "cars": 73 },
    { "district": "Hollins", "cars": 110 },
    { "district": "Old Town", "cars": 36 },
    { "district": "Priory", "cars": 92 },
    { "district": "Riverside", "cars": 58 },
    { "district": "Station Quarter", "cars": 29 }
  ],
  "name": "district",
  "value": "cars",
  "icon": "car",
  "unitLabel": "1 car per 100 households",
  "columns": 4,
  "title": "Fairmile had 126 cars per 100 households in 2025",
  "subtitle": "Cars per 100 households in 12 districts of Port Aldwin, 2025",
  "source": "Illustrative data",
  "note": "Invented figures for a fictional city"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Category field: one tile per row. |
| `value` (required) | `string` |  | Value field: the count each tile shows. |
| `unit` | `number` | `1` | Units per icon. |
| `unitLabel` | `string` |  | What one icon stands for, for the key line, e.g. "1 car". |
| `total` | `number` |  | Draw every tile out of this many units, with uncounted icons as ghosts: 100 for a rate per 100. |
| `icon` | `IconName \| "path://..."` | `"circle"` | Built-in icon name or a custom single SVG path. |
| `perRow` | `number` | `10` | Icons per line inside a tile. |
| `columns` | `number` |  | Most tiles per line. Default: as many as fit at a readable size. Narrow containers use fewer. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order of the tiles. |

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

### Out of 100, with ghosts, highlight, click to select

```tsx
import { IconArrayGrid } from "insightcharts";

const data = [
  { ward: "Abbey", voted: 71 },
  { ward: "Bridge", voted: 64 },
  { ward: "Canal", voted: 38 },
  { ward: "Deanery", voted: 59 },
  { ward: "Elm Park", voted: 67 },
  { ward: "Foundry", voted: 44 },
  { ward: "Grange", voted: 76 },
  { ward: "Haymarket", voted: 52 },
];

<IconArrayGrid
  data={data}
  name="ward"
  value="voted"
  total={100}
  icon="person"
  perRow={20}
  unitLabel="1 in every 100 registered voters"
  format="{value}%"
  highlight="Canal"
  select
  title="38 in every 100 registered voters in Canal ward voted in 2025"
  subtitle="Turnout at the 2025 council election by ward, voters per 100 registered"
  source="Illustrative data"
  note="Invented figures for a fictional council"
/>
```

### Squares, five per line, sorted

```tsx
import { IconArrayGrid } from "insightcharts";

const data = [
  { club: "Harriers", medals: 23 },
  { club: "Lakeside", medals: 17 },
  { club: "Northgate", medals: 31 },
  { club: "Old Mill", medals: 8 },
  { club: "Quayside", medals: 12 },
  { club: "Westbrook", medals: 4 },
];

<IconArrayGrid
  theme="noir"
  data={data}
  name="club"
  value="medals"
  icon="square"
  perRow={5}
  columns={6}
  sort="desc"
  unitLabel="1 medal"
  title="Northgate won 31 medals at the 2025 county championships"
  subtitle="Medals won by club, 2025 county athletics championships"
  source="Illustrative data"
  note="Invented figures"
/>
```

### Stress: 24 tiles, long names, uneven counts

```tsx
import { IconArrayGrid } from "insightcharts";

const data = [
  { area: "Aldermoor and the northern villages", points: 142 },
  { area: "Barrow", points: 3 },
  { area: "Charnwood Forest", points: 87 },
  { area: "Denby", points: 0 },
  { area: "East Leake and Stanford", points: 61 },
  { area: "Fosse", points: 118 },
  { area: "Great Glen", points: 24 },
  { area: "Hathern", points: 9 },
  // ... 16 more rows
];

<IconArrayGrid
  theme="blueprint"
  data={data}
  name="area"
  value="points"
  icon="bolt"
  perRow={15}
  unitLabel="1 public charge point"
  title="Loughborough Central had 150 public charge points in 2025"
  subtitle="Public electric vehicle charge points by area, 2025"
  source="Illustrative data"
  note="Invented figures"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/icon-array-grid.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/icon-array-grid.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
