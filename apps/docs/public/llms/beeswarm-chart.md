# Beeswarm chart (`beeswarm-chart`)

> Shows a distribution as one dot per row along a value axis, with dots stacked sideways where they would collide.

- Component: `BeeswarmChart` (import from `insightcharts`)
- Spec type: `"beeswarm-chart"`
- Level: atom. Category: distribution.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Showing a distribution while keeping every individual visible: 30 to about 2,000 named things (countries, players, schools), optionally in a few rows by group, with one or two highlighted.

## Avoid

More than about 2,000 rows or when only the summary matters (use histogram or box-plot); many groups with few rows each (use strip-plot); two numeric measures (use scatter-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/beeswarm-chart
```

The file lands at `components/insightcharts/atoms/beeswarm-chart.tsx`. `@insightcharts/beeswarm-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BeeswarmChart } from "insightcharts";

const data = [
  { country: "Qatar", rate: 0.4 },
  { country: "Kuwait", rate: 0.6 },
  { country: "UAE", rate: 0.9 },
  { country: "Saudi Arabia", rate: 1.2 },
  { country: "Japan", rate: 2.5 },
  { country: "Italy", rate: 2.9 },
  { country: "Germany", rate: 3 },
  { country: "United States", rate: 3.6 },
  { country: "France", rate: 3.1 },
  { country: "Spain", rate: 3.3 },
  { country: "United Kingdom", rate: 3.4 },
  { country: "Canada", rate: 3.2 },
  { country: "Australia", rate: 3.1 },
  { country: "South Korea", rate: 2.4 },
  { country: "Netherlands", rate: 2.8 },
  { country: "Sweden", rate: 2.6 },
  { country: "Norway", rate: 2.5 },
  { country: "Switzerland", rate: 2.3 },
  { country: "Poland", rate: 4.2 },
  { country: "Portugal", rate: 3.1 },
  { country: "Greece", rate: 3.9 },
  { country: "Ireland", rate: 2.7 },
  { country: "Denmark", rate: 2.4 },
  { country: "Finland", rate: 2.9 },
  { country: "Austria", rate: 2.7 },
  { country: "Belgium", rate: 2.9 },
  { country: "Czechia", rate: 3.4 },
  { country: "Hungary", rate: 4.4 },
  { country: "Romania", rate: 5.6 },
  { country: "Bulgaria", rate: 5.9 },
  { country: "Mexico", rate: 12.4 },
  { country: "Brazil", rate: 14.2 },
  { country: "Argentina", rate: 9.8 },
  { country: "Chile", rate: 7.9 },
  { country: "Colombia", rate: 13.1 },
  { country: "Peru", rate: 11.6 },
  { country: "China", rate: 6.3 },
  { country: "India", rate: 26.6 },
  { country: "Indonesia", rate: 21 },
  { country: "Vietnam", rate: 19.8 },
  { country: "Thailand", rate: 8.1 },
  { country: "Malaysia", rate: 7.4 },
  { country: "Philippines", rate: 24.3 },
  { country: "Pakistan", rate: 55.8 },
  { country: "Bangladesh", rate: 28.9 },
  { country: "Turkey", rate: 9.1 },
  { country: "Iran", rate: 12 },
  { country: "Egypt", rate: 19.2 },
  { country: "South Africa", rate: 33.5 },
  { country: "Kenya", rate: 37.2 },
  { country: "Ghana", rate: 42.1 },
  { country: "Ethiopia", rate: 46.8 },
  { country: "Tanzania", rate: 44.3 },
  { country: "Uganda", rate: 41 },
  { country: "Nigeria", rate: 107.2 },
  { country: "Niger", rate: 115.2 },
  { country: "Chad", rate: 101.1 },
  { country: "Mali", rate: 94 },
  { country: "Somalia", rate: 106.1 },
  { country: "Sierra Leone", rate: 100.8 },
  { country: "DR Congo", rate: 76 },
  { country: "Angola", rate: 66.5 },
  { country: "Mozambique", rate: 67.2 },
  { country: "Cameroon", rate: 69.8 },
  { country: "Senegal", rate: 37.4 },
  { country: "Rwanda", rate: 38.3 },
  { country: "Zambia", rate: 56.2 },
  { country: "Sudan", rate: 52.9 },
  { country: "Afghanistan", rate: 55.5 },
  { country: "Yemen", rate: 39.9 },
  { country: "Haiti", rate: 56.3 },
  { country: "Bolivia", rate: 23.7 },
  { country: "Guatemala", rate: 22.1 },
  { country: "Nepal", rate: 26.2 },
  { country: "Myanmar", rate: 40.1 },
  { country: "Cambodia", rate: 23.6 },
  { country: "Morocco", rate: 16.7 },
  { country: "Algeria", rate: 21.5 },
  { country: "Iraq", rate: 23.4 },
  { country: "Ukraine", rate: 7.8 },
  { country: "Russia", rate: 4.8 },
  { country: "Kazakhstan", rate: 9.7 },
  { country: "Uzbekistan", rate: 13.6 },
  { country: "Sri Lanka", rate: 6.4 },
];

<BeeswarmChart
  data={data}
  value="rate"
  label="country"
  highlight={["Nigeria", "India", "United States"]}
  title="Nigeria had 107.2 under-five deaths per 1,000 live births in 2022"
  subtitle="Deaths before age five per 1,000 live births, 84 countries, 2022"
  source="UN IGME (rounded)"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "beeswarm-chart",
  "data": [
    { "country": "Qatar", "rate": 0.4 },
    { "country": "Kuwait", "rate": 0.6 },
    { "country": "UAE", "rate": 0.9 },
    { "country": "Saudi Arabia", "rate": 1.2 },
    { "country": "Japan", "rate": 2.5 },
    { "country": "Italy", "rate": 2.9 },
    { "country": "Germany", "rate": 3 },
    { "country": "United States", "rate": 3.6 },
    { "country": "France", "rate": 3.1 },
    { "country": "Spain", "rate": 3.3 },
    { "country": "United Kingdom", "rate": 3.4 },
    { "country": "Canada", "rate": 3.2 },
    { "country": "Australia", "rate": 3.1 },
    { "country": "South Korea", "rate": 2.4 },
    { "country": "Netherlands", "rate": 2.8 },
    { "country": "Sweden", "rate": 2.6 },
    { "country": "Norway", "rate": 2.5 },
    { "country": "Switzerland", "rate": 2.3 },
    { "country": "Poland", "rate": 4.2 },
    { "country": "Portugal", "rate": 3.1 },
    { "country": "Greece", "rate": 3.9 },
    { "country": "Ireland", "rate": 2.7 },
    { "country": "Denmark", "rate": 2.4 },
    { "country": "Finland", "rate": 2.9 },
    { "country": "Austria", "rate": 2.7 },
    { "country": "Belgium", "rate": 2.9 },
    { "country": "Czechia", "rate": 3.4 },
    { "country": "Hungary", "rate": 4.4 },
    { "country": "Romania", "rate": 5.6 },
    { "country": "Bulgaria", "rate": 5.9 },
    { "country": "Mexico", "rate": 12.4 },
    { "country": "Brazil", "rate": 14.2 },
    { "country": "Argentina", "rate": 9.8 },
    { "country": "Chile", "rate": 7.9 },
    { "country": "Colombia", "rate": 13.1 },
    { "country": "Peru", "rate": 11.6 },
    { "country": "China", "rate": 6.3 },
    { "country": "India", "rate": 26.6 },
    { "country": "Indonesia", "rate": 21 },
    { "country": "Vietnam", "rate": 19.8 },
    { "country": "Thailand", "rate": 8.1 },
    { "country": "Malaysia", "rate": 7.4 },
    { "country": "Philippines", "rate": 24.3 },
    { "country": "Pakistan", "rate": 55.8 },
    { "country": "Bangladesh", "rate": 28.9 },
    { "country": "Turkey", "rate": 9.1 },
    { "country": "Iran", "rate": 12 },
    { "country": "Egypt", "rate": 19.2 },
    { "country": "South Africa", "rate": 33.5 },
    { "country": "Kenya", "rate": 37.2 },
    { "country": "Ghana", "rate": 42.1 },
    { "country": "Ethiopia", "rate": 46.8 },
    { "country": "Tanzania", "rate": 44.3 },
    { "country": "Uganda", "rate": 41 },
    { "country": "Nigeria", "rate": 107.2 },
    { "country": "Niger", "rate": 115.2 },
    { "country": "Chad", "rate": 101.1 },
    { "country": "Mali", "rate": 94 },
    { "country": "Somalia", "rate": 106.1 },
    { "country": "Sierra Leone", "rate": 100.8 },
    { "country": "DR Congo", "rate": 76 },
    { "country": "Angola", "rate": 66.5 },
    { "country": "Mozambique", "rate": 67.2 },
    { "country": "Cameroon", "rate": 69.8 },
    { "country": "Senegal", "rate": 37.4 },
    { "country": "Rwanda", "rate": 38.3 },
    { "country": "Zambia", "rate": 56.2 },
    { "country": "Sudan", "rate": 52.9 },
    { "country": "Afghanistan", "rate": 55.5 },
    { "country": "Yemen", "rate": 39.9 },
    { "country": "Haiti", "rate": 56.3 },
    { "country": "Bolivia", "rate": 23.7 },
    { "country": "Guatemala", "rate": 22.1 },
    { "country": "Nepal", "rate": 26.2 },
    { "country": "Myanmar", "rate": 40.1 },
    { "country": "Cambodia", "rate": 23.6 },
    { "country": "Morocco", "rate": 16.7 },
    { "country": "Algeria", "rate": 21.5 },
    { "country": "Iraq", "rate": 23.4 },
    { "country": "Ukraine", "rate": 7.8 },
    { "country": "Russia", "rate": 4.8 },
    { "country": "Kazakhstan", "rate": 9.7 },
    { "country": "Uzbekistan", "rate": 13.6 },
    { "country": "Sri Lanka", "rate": 6.4 }
  ],
  "value": "rate",
  "label": "country",
  "highlight": ["Nigeria", "India", "United States"],
  "title": "Nigeria had 107.2 under-five deaths per 1,000 live births in 2022",
  "subtitle": "Deaths before age five per 1,000 live births, 84 countries, 2022",
  "source": "UN IGME (rounded)",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Numeric field that positions each dot along the axis. |
| `group` | `string` |  | Field that splits the dots into rows, one swarm per group. |
| `series` | `string` |  | Field that colours dots by category. Beyond 6 categories the rest turn grey. |
| `label` | `string` |  | Field naming each dot, for tooltips, `highlight` and labels on highlighted dots. |
| `radius` | `number` |  | Dot radius in px. Default 5 down to 3 by row count; shrinks if a swarm would overflow its row. |
| `median` | `boolean` | `false` | Mark each row's median with a vertical tick. |
| `names` | `Record<string, string>` |  | Display names for series keys. |

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
- Used by: no molecule or template yet

## More examples

### Rows by group, with medians

```tsx
import { BeeswarmChart } from "insightcharts";

const data = [
  { player: "Guard 1", position: "Guard", height: 194 },
  { player: "Guard 2", position: "Guard", height: 194 },
  { player: "Guard 3", position: "Guard", height: 191 },
  { player: "Guard 4", position: "Guard", height: 187 },
  { player: "Guard 5", position: "Guard", height: 189 },
  { player: "Guard 6", position: "Guard", height: 188 },
  { player: "Guard 7", position: "Guard", height: 192 },
  { player: "Guard 8", position: "Guard", height: 191 },
  // ... 372 more rows
];

<BeeswarmChart
  data={data}
  value="height"
  group="position"
  label="player"
  median
  format="{value} cm"
  height={380}
  title="Height of 380 professional basketball players by position"
  subtitle="Height in centimetres. The tick marks the median of each position."
  note="Illustrative data"
/>
```

### Colour by series, long format

```tsx
import { BeeswarmChart } from "insightcharts";

const data = [
  { person: "Engineering 1", team: "Engineering", level: "Junior", salary: 112 },
  { person: "Engineering 2", team: "Engineering", level: "Junior", salary: 109 },
  { person: "Engineering 3", team: "Engineering", level: "Junior", salary: 114 },
  { person: "Engineering 4", team: "Engineering", level: "Junior", salary: 127 },
  { person: "Engineering 5", team: "Engineering", level: "Senior", salary: 154 },
  { person: "Engineering 6", team: "Engineering", level: "Junior", salary: 127 },
  { person: "Engineering 7", team: "Engineering", level: "Lead", salary: 170 },
  { person: "Engineering 8", team: "Engineering", level: "Junior", salary: 124 },
  // ... 202 more rows
];

<BeeswarmChart
  data={data}
  value="salary"
  group="team"
  series="level"
  label="person"
  format="${value}k"
  height={420}
  title="Base salary by team and level"
  subtitle="Thousands of dollars, 210 employees"
  note="Illustrative data"
/>
```

### Highlight a whole row

```tsx
import { BeeswarmChart } from "insightcharts";

const data = [
  { person: "Engineering 1", team: "Engineering", level: "Junior", salary: 112 },
  { person: "Engineering 2", team: "Engineering", level: "Junior", salary: 109 },
  { person: "Engineering 3", team: "Engineering", level: "Junior", salary: 114 },
  { person: "Engineering 4", team: "Engineering", level: "Junior", salary: 127 },
  { person: "Engineering 5", team: "Engineering", level: "Senior", salary: 154 },
  { person: "Engineering 6", team: "Engineering", level: "Junior", salary: 127 },
  { person: "Engineering 7", team: "Engineering", level: "Lead", salary: 170 },
  { person: "Engineering 8", team: "Engineering", level: "Junior", salary: 124 },
  // ... 202 more rows
];

<BeeswarmChart
  data={data}
  value="salary"
  group="team"
  label="person"
  highlight="Support"
  format="${value}k"
  height={380}
  title="Base salary by team"
  subtitle="Thousands of dollars, 210 employees. Support is highlighted."
  note="Illustrative data"
/>
```

### Stress: 2,000 dots

```tsx
import { BeeswarmChart } from "insightcharts";

const data = [
  { id: "Trip 1", minutes: 28.8 },
  { id: "Trip 2", minutes: 17.1 },
  { id: "Trip 3", minutes: 17.1 },
  { id: "Trip 4", minutes: 16.4 },
  { id: "Trip 5", minutes: 32.2 },
  { id: "Trip 6", minutes: 16.8 },
  { id: "Trip 7", minutes: 14.4 },
  { id: "Trip 8", minutes: 15.8 },
  // ... 1992 more rows
];

<BeeswarmChart
  data={data}
  value="minutes"
  label="id"
  format="{value} min"
  height={420}
  title="Duration of 2,000 bike-share trips"
  subtitle="Minutes per trip"
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/beeswarm-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/beeswarm-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
