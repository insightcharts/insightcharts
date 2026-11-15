# Small multiple grid (`small-multiple-grid`)

> Repeats any chart spec once per value of a facet field, each panel with its own filtered rows and a title, in a grid that follows the container width.

- Component: `SmallMultipleGrid` (import from `insightcharts`)
- Spec type: `"small-multiple-grid"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Faceting a chart form the `small-multiples` atom does not draw: stacked bars, scatter plots, donuts, waffles, dumbbells, histograms. Also when each panel should be a full chart with its own tooltip and axis.

## Avoid

Line, area or bar facets that must share one value scale: use the `small-multiples` atom, which draws every panel in one chart on a common axis. Here each panel scales to its own rows unless the spec fixes the axis (for example `option: { xAxis: { max: 70 } }`), so say so in the subtitle or fix it. More than about twelve panels.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/small-multiple-grid
```

The file lands at `components/insightcharts/molecules/small-multiple-grid.tsx`. `@insightcharts/small-multiple-grid-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, SmallMultipleGrid } from "insightcharts";

const data = [
  { country: "Netherlands", age: "16-24", Usually: 18, Sometimes: 22 },
  { country: "Netherlands", age: "25-34", Usually: 44, Sometimes: 21 },
  { country: "Netherlands", age: "35-49", Usually: 41, Sometimes: 19 },
  { country: "Netherlands", age: "50-64", Usually: 33, Sometimes: 17 },
  { country: "Netherlands", age: "65+", Usually: 14, Sometimes: 9 },
  { country: "Sweden", age: "16-24", Usually: 14, Sometimes: 20 },
  { country: "Sweden", age: "25-34", Usually: 39, Sometimes: 22 },
  { country: "Sweden", age: "35-49", Usually: 37, Sometimes: 20 },
  { country: "Sweden", age: "50-64", Usually: 30, Sometimes: 16 },
  { country: "Sweden", age: "65+", Usually: 11, Sometimes: 8 },
  { country: "Germany", age: "16-24", Usually: 9, Sometimes: 15 },
  { country: "Germany", age: "25-34", Usually: 24, Sometimes: 18 },
  { country: "Germany", age: "35-49", Usually: 23, Sometimes: 16 },
  { country: "Germany", age: "50-64", Usually: 18, Sometimes: 13 },
  { country: "Germany", age: "65+", Usually: 8, Sometimes: 6 },
  { country: "France", age: "16-24", Usually: 8, Sometimes: 12 },
  { country: "France", age: "25-34", Usually: 25, Sometimes: 14 },
  { country: "France", age: "35-49", Usually: 24, Sometimes: 13 },
  { country: "France", age: "50-64", Usually: 17, Sometimes: 10 },
  { country: "France", age: "65+", Usually: 7, Sometimes: 5 },
  { country: "Spain", age: "16-24", Usually: 5, Sometimes: 9 },
  { country: "Spain", age: "25-34", Usually: 13, Sometimes: 12 },
  { country: "Spain", age: "35-49", Usually: 13, Sometimes: 11 },
  { country: "Spain", age: "50-64", Usually: 10, Sometimes: 8 },
  { country: "Spain", age: "65+", Usually: 4, Sometimes: 4 },
  { country: "Italy", age: "16-24", Usually: 3, Sometimes: 6 },
  { country: "Italy", age: "25-34", Usually: 9, Sometimes: 8 },
  { country: "Italy", age: "35-49", Usually: 9, Sometimes: 8 },
  { country: "Italy", age: "50-64", Usually: 7, Sometimes: 6 },
  { country: "Italy", age: "65+", Usually: 3, Sometimes: 3 },
];

<SmallMultipleGrid
  title="65% of Dutch workers aged 25 to 34 worked from home usually or sometimes in 2023"
  subtitle="Share of employed people working from home usually or sometimes, by age group, six EU countries, 2023. All panels run from 0 to 70%"
  data={data}
  facet="country"
  columns={3}
  panelHeight={170}
  legend={["Usually", "Sometimes"]}
  chart={<BarChart
    x="age"
    y={["Usually", "Sometimes"]}
    stack
    sort="none"
    orientation="horizontal"
    format="{value}%"
    labels={false}
    legend={false}
    option={{ xAxis: { max: 70 } }}
  />}
  source="Eurostat, Labour Force Survey"
  note="Rounded, illustrative"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "small-multiple-grid",
  "title": "65% of Dutch workers aged 25 to 34 worked from home usually or sometimes in 2023",
  "subtitle": "Share of employed people working from home usually or sometimes, by age group, six EU countries, 2023. All panels run from 0 to 70%",
  "data": [
    { "country": "Netherlands", "age": "16-24", "Usually": 18, "Sometimes": 22 },
    { "country": "Netherlands", "age": "25-34", "Usually": 44, "Sometimes": 21 },
    { "country": "Netherlands", "age": "35-49", "Usually": 41, "Sometimes": 19 },
    { "country": "Netherlands", "age": "50-64", "Usually": 33, "Sometimes": 17 },
    { "country": "Netherlands", "age": "65+", "Usually": 14, "Sometimes": 9 },
    { "country": "Sweden", "age": "16-24", "Usually": 14, "Sometimes": 20 },
    { "country": "Sweden", "age": "25-34", "Usually": 39, "Sometimes": 22 },
    { "country": "Sweden", "age": "35-49", "Usually": 37, "Sometimes": 20 },
    { "country": "Sweden", "age": "50-64", "Usually": 30, "Sometimes": 16 },
    { "country": "Sweden", "age": "65+", "Usually": 11, "Sometimes": 8 },
    { "country": "Germany", "age": "16-24", "Usually": 9, "Sometimes": 15 },
    { "country": "Germany", "age": "25-34", "Usually": 24, "Sometimes": 18 },
    { "country": "Germany", "age": "35-49", "Usually": 23, "Sometimes": 16 },
    { "country": "Germany", "age": "50-64", "Usually": 18, "Sometimes": 13 },
    { "country": "Germany", "age": "65+", "Usually": 8, "Sometimes": 6 },
    { "country": "France", "age": "16-24", "Usually": 8, "Sometimes": 12 },
    { "country": "France", "age": "25-34", "Usually": 25, "Sometimes": 14 },
    { "country": "France", "age": "35-49", "Usually": 24, "Sometimes": 13 },
    { "country": "France", "age": "50-64", "Usually": 17, "Sometimes": 10 },
    { "country": "France", "age": "65+", "Usually": 7, "Sometimes": 5 },
    { "country": "Spain", "age": "16-24", "Usually": 5, "Sometimes": 9 },
    { "country": "Spain", "age": "25-34", "Usually": 13, "Sometimes": 12 },
    { "country": "Spain", "age": "35-49", "Usually": 13, "Sometimes": 11 },
    { "country": "Spain", "age": "50-64", "Usually": 10, "Sometimes": 8 },
    { "country": "Spain", "age": "65+", "Usually": 4, "Sometimes": 4 },
    { "country": "Italy", "age": "16-24", "Usually": 3, "Sometimes": 6 },
    { "country": "Italy", "age": "25-34", "Usually": 9, "Sometimes": 8 },
    { "country": "Italy", "age": "35-49", "Usually": 9, "Sometimes": 8 },
    { "country": "Italy", "age": "50-64", "Usually": 7, "Sometimes": 6 },
    { "country": "Italy", "age": "65+", "Usually": 3, "Sometimes": 3 }
  ],
  "facet": "country",
  "columns": 3,
  "panelHeight": 170,
  "legend": ["Usually", "Sometimes"],
  "chart": {
    "type": "bar-chart",
    "x": "age",
    "y": ["Usually", "Sometimes"],
    "stack": true,
    "sort": "none",
    "orientation": "horizontal",
    "format": "{value}%",
    "labels": false,
    "legend": false,
    "option": { "xAxis": { "max": 70 } }
  },
  "source": "Eurostat, Labour Force Survey",
  "note": "Rounded, illustrative"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DataInput` |  | Rows for every panel together. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` |  | Applied before the rows are split by `facet`. |
| `facet` (required) | `string` |  | Field whose values each get a panel. |
| `chart` (required) | `InsightSpec \| (facet, rows) => ReactNode` |  | The chart repeated in every panel: a spec without `data` and without a `title`, or a render function from JSX. |
| `columns` | `number` |  | Preferred columns. Default: up to four, reduced to fit `minPanelWidth`. |
| `minPanelWidth` | `number` | `200` | Narrowest a panel may get before the grid drops a column. |
| `order` | `"data" \| "asc" \| "desc" \| string[]` | `"data"` | Panel order: data order, alphabetical, or an explicit list of facet values. |
| `panelHeight` | `number` | `160` | Plot height of each panel when the spec sets none. |
| `highlight` | `string \| string[]` |  | Passed to every panel as its `highlight`, so the same entity is emphasised everywhere. |
| `emphasis` | `string \| string[]` |  | Facet values whose panel titles are emphasised. |
| `legend` | `(string \| { label, color?, index?, shape?, muted? })[]` |  | One shared colour key above the panels (`legend-key` items, in series order). Set `legend: false` in the chart spec so panels do not repeat it. |
| `names` | `Record<string, string>` |  | Display names for facet values. |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | `4` | Heading level of the panel titles. |
| `title` | `string` |  | The main fact with its number, or a plain label. |
| `subtitle` | `string` |  | Measure, population, period, and whether the panels share a scale. |
| `source` | `string` |  | Shown under the grid as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | Theme override, passed on to every panel. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [legend-key](https://insightcharts.dev/llms/legend-key.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [waffle-chart](https://insightcharts.dev/llms/waffle-chart.md)
- Used by: [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Shared highlight, two columns, emphasised panel

```tsx
import { BarChart, SmallMultipleGrid } from "insightcharts";

const data = [
  { country: "Netherlands", age: "16-24", Usually: 18, Sometimes: 22 },
  { country: "Netherlands", age: "25-34", Usually: 44, Sometimes: 21 },
  { country: "Netherlands", age: "35-49", Usually: 41, Sometimes: 19 },
  { country: "Netherlands", age: "50-64", Usually: 33, Sometimes: 17 },
  { country: "Netherlands", age: "65+", Usually: 14, Sometimes: 9 },
  { country: "Germany", age: "16-24", Usually: 9, Sometimes: 15 },
  { country: "Germany", age: "25-34", Usually: 24, Sometimes: 18 },
  { country: "Germany", age: "35-49", Usually: 23, Sometimes: 16 },
  // ... 12 more rows
];

<SmallMultipleGrid
  title="44% of Dutch workers aged 25 to 34 usually worked from home in 2023"
  subtitle="Share usually working from home, by age group, 2023. Panels are on their own scales"
  data={data}
  facet="country"
  columns={2}
  highlight="25-34"
  emphasis="Netherlands"
  chart={<BarChart x="age" y="Usually" sort="none" orientation="vertical" format="{value}%" />}
  note="Illustrative data"
/>
```

### A waffle chart in each panel

```tsx
import { SmallMultipleGrid, WaffleChart } from "insightcharts";

const data = [
  { region: "Europe", group: "Online", share: 91 },
  { region: "Americas", group: "Online", share: 87 },
  { region: "Asia-Pacific", group: "Online", share: 66 },
  { region: "Africa", group: "Online", share: 37 },
];

<SmallMultipleGrid
  data={data}
  facet="region"
  panelHeight={150}
  chart={<WaffleChart name="group" value="share" total={100} legend={false} />}
  title="91% of people in Europe used the internet in 2023"
  subtitle="Share of the population using the internet, by region, 2023"
  source="ITU Facts and Figures 2023"
  note="Figures are approximate, for illustration"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/small-multiple-grid.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/small-multiple-grid.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
