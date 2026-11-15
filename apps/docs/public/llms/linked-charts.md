# Linked charts (`linked-charts`)

> Two to four charts over one shared dataset in a responsive grid: clicking a mark in one filters the others, with the active filters shown as removable chips.

- Component: `LinkedCharts` (import from `insightcharts`)
- Spec type: `"linked-charts"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Exploration of one table along several dimensions: by region, by category and over time. Pass row-level data once; each chart aggregates it with its own `transform`, sets `select: true` and omits `data`.

## Avoid

A report that states one fixed fact (use `chart-callout` or `scrolly-chart`); charts over unrelated datasets (they cannot filter each other); more than four charts.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/linked-charts
```

The file lands at `components/insightcharts/molecules/linked-charts.tsx`. `@insightcharts/linked-charts-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, LinkedCharts } from "insightcharts";

const data = [
  { region: "Asia", year: "2020", source: "Hydro", twh: 1810 },
  { region: "Asia", year: "2020", source: "Wind", twh: 480 },
  { region: "Asia", year: "2020", source: "Solar", twh: 420 },
  { region: "Asia", year: "2021", source: "Hydro", twh: 1790 },
  { region: "Asia", year: "2021", source: "Wind", twh: 590 },
  { region: "Asia", year: "2021", source: "Solar", twh: 560 },
  { region: "Asia", year: "2022", source: "Hydro", twh: 1830 },
  { region: "Asia", year: "2022", source: "Wind", twh: 700 },
  { region: "Asia", year: "2022", source: "Solar", twh: 730 },
  { region: "Asia", year: "2023", source: "Hydro", twh: 1800 },
  { region: "Asia", year: "2023", source: "Wind", twh: 880 },
  { region: "Asia", year: "2023", source: "Solar", twh: 980 },
  { region: "Asia", year: "2024", source: "Hydro", twh: 1860 },
  { region: "Asia", year: "2024", source: "Wind", twh: 1010 },
  { region: "Asia", year: "2024", source: "Solar", twh: 1290 },
  { region: "Europe", year: "2020", source: "Hydro", twh: 640 },
  { region: "Europe", year: "2020", source: "Wind", twh: 510 },
  { region: "Europe", year: "2020", source: "Solar", twh: 190 },
  { region: "Europe", year: "2021", source: "Hydro", twh: 620 },
  { region: "Europe", year: "2021", source: "Wind", twh: 540 },
  { region: "Europe", year: "2021", source: "Solar", twh: 220 },
  { region: "Europe", year: "2022", source: "Hydro", twh: 560 },
  { region: "Europe", year: "2022", source: "Wind", twh: 580 },
  { region: "Europe", year: "2022", source: "Solar", twh: 270 },
  { region: "Europe", year: "2023", source: "Hydro", twh: 610 },
  { region: "Europe", year: "2023", source: "Wind", twh: 640 },
  { region: "Europe", year: "2023", source: "Solar", twh: 330 },
  { region: "Europe", year: "2024", source: "Hydro", twh: 650 },
  { region: "Europe", year: "2024", source: "Wind", twh: 690 },
  { region: "Europe", year: "2024", source: "Solar", twh: 390 },
  { region: "North America", year: "2020", source: "Hydro", twh: 690 },
  { region: "North America", year: "2020", source: "Wind", twh: 400 },
  { region: "North America", year: "2020", source: "Solar", twh: 150 },
  { region: "North America", year: "2021", source: "Hydro", twh: 680 },
  { region: "North America", year: "2021", source: "Wind", twh: 450 },
  { region: "North America", year: "2021", source: "Solar", twh: 190 },
  { region: "North America", year: "2022", source: "Hydro", twh: 700 },
  { region: "North America", year: "2022", source: "Wind", twh: 500 },
  { region: "North America", year: "2022", source: "Solar", twh: 240 },
  { region: "North America", year: "2023", source: "Hydro", twh: 660 },
  { region: "North America", year: "2023", source: "Wind", twh: 520 },
  { region: "North America", year: "2023", source: "Solar", twh: 290 },
  { region: "North America", year: "2024", source: "Hydro", twh: 670 },
  { region: "North America", year: "2024", source: "Wind", twh: 560 },
  { region: "North America", year: "2024", source: "Solar", twh: 360 },
  { region: "Latin America", year: "2020", source: "Hydro", twh: 720 },
  { region: "Latin America", year: "2020", source: "Wind", twh: 120 },
  { region: "Latin America", year: "2020", source: "Solar", twh: 40 },
  { region: "Latin America", year: "2021", source: "Hydro", twh: 690 },
  { region: "Latin America", year: "2021", source: "Wind", twh: 140 },
  { region: "Latin America", year: "2021", source: "Solar", twh: 60 },
  { region: "Latin America", year: "2022", source: "Hydro", twh: 740 },
  { region: "Latin America", year: "2022", source: "Wind", twh: 170 },
  { region: "Latin America", year: "2022", source: "Solar", twh: 90 },
  { region: "Latin America", year: "2023", source: "Hydro", twh: 760 },
  { region: "Latin America", year: "2023", source: "Wind", twh: 200 },
  { region: "Latin America", year: "2023", source: "Solar", twh: 120 },
  { region: "Latin America", year: "2024", source: "Hydro", twh: 730 },
  { region: "Latin America", year: "2024", source: "Wind", twh: 230 },
  { region: "Latin America", year: "2024", source: "Solar", twh: 160 },
];

<LinkedCharts
  title="Asia generated 46% of the renewable electricity in these four regions from 2020 to 2024"
  subtitle="Electricity generation from hydro, wind and solar, TWh, four regions, 2020 to 2024"
  data={data}
  labels={{ region: "Region", source: "Source", year: "Year" }}
  hint="Click a bar to filter the other charts"
  count
  charts={[
    <BarChart
      id="by-region"
      x="region"
      y="twh"
      select
      format="compact"
      height={200}
      title="By region"
      transform={{ type: "aggregate", groupBy: "region", measures: { twh: { op: "sum", field: "twh" } } }}
    />,
    <BarChart
      id="by-source"
      x="source"
      y="twh"
      select
      format="compact"
      height={200}
      title="By source"
      transform={{ type: "aggregate", groupBy: "source", measures: { twh: { op: "sum", field: "twh" } } }}
    />,
    <BarChart
      id="by-year"
      x="year"
      y="twh"
      series="source"
      stack
      orientation="vertical"
      sort="none"
      select="year"
      format="compact"
      height={240}
      title="By year"
      transform={{
        type: "aggregate",
        groupBy: ["year", "source"],
        measures: { twh: { op: "sum", field: "twh" } },
      }}
    />,
  ]}
  source="Ember, Global Electricity Review 2025"
  note="Regional figures rounded, illustrative"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "linked-charts",
  "title": "Asia generated 46% of the renewable electricity in these four regions from 2020 to 2024",
  "subtitle": "Electricity generation from hydro, wind and solar, TWh, four regions, 2020 to 2024",
  "data": [
    { "region": "Asia", "year": "2020", "source": "Hydro", "twh": 1810 },
    { "region": "Asia", "year": "2020", "source": "Wind", "twh": 480 },
    { "region": "Asia", "year": "2020", "source": "Solar", "twh": 420 },
    { "region": "Asia", "year": "2021", "source": "Hydro", "twh": 1790 },
    { "region": "Asia", "year": "2021", "source": "Wind", "twh": 590 },
    { "region": "Asia", "year": "2021", "source": "Solar", "twh": 560 },
    { "region": "Asia", "year": "2022", "source": "Hydro", "twh": 1830 },
    { "region": "Asia", "year": "2022", "source": "Wind", "twh": 700 },
    { "region": "Asia", "year": "2022", "source": "Solar", "twh": 730 },
    { "region": "Asia", "year": "2023", "source": "Hydro", "twh": 1800 },
    { "region": "Asia", "year": "2023", "source": "Wind", "twh": 880 },
    { "region": "Asia", "year": "2023", "source": "Solar", "twh": 980 },
    { "region": "Asia", "year": "2024", "source": "Hydro", "twh": 1860 },
    { "region": "Asia", "year": "2024", "source": "Wind", "twh": 1010 },
    { "region": "Asia", "year": "2024", "source": "Solar", "twh": 1290 },
    { "region": "Europe", "year": "2020", "source": "Hydro", "twh": 640 },
    { "region": "Europe", "year": "2020", "source": "Wind", "twh": 510 },
    { "region": "Europe", "year": "2020", "source": "Solar", "twh": 190 },
    { "region": "Europe", "year": "2021", "source": "Hydro", "twh": 620 },
    { "region": "Europe", "year": "2021", "source": "Wind", "twh": 540 },
    { "region": "Europe", "year": "2021", "source": "Solar", "twh": 220 },
    { "region": "Europe", "year": "2022", "source": "Hydro", "twh": 560 },
    { "region": "Europe", "year": "2022", "source": "Wind", "twh": 580 },
    { "region": "Europe", "year": "2022", "source": "Solar", "twh": 270 },
    { "region": "Europe", "year": "2023", "source": "Hydro", "twh": 610 },
    { "region": "Europe", "year": "2023", "source": "Wind", "twh": 640 },
    { "region": "Europe", "year": "2023", "source": "Solar", "twh": 330 },
    { "region": "Europe", "year": "2024", "source": "Hydro", "twh": 650 },
    { "region": "Europe", "year": "2024", "source": "Wind", "twh": 690 },
    { "region": "Europe", "year": "2024", "source": "Solar", "twh": 390 },
    { "region": "North America", "year": "2020", "source": "Hydro", "twh": 690 },
    { "region": "North America", "year": "2020", "source": "Wind", "twh": 400 },
    { "region": "North America", "year": "2020", "source": "Solar", "twh": 150 },
    { "region": "North America", "year": "2021", "source": "Hydro", "twh": 680 },
    { "region": "North America", "year": "2021", "source": "Wind", "twh": 450 },
    { "region": "North America", "year": "2021", "source": "Solar", "twh": 190 },
    { "region": "North America", "year": "2022", "source": "Hydro", "twh": 700 },
    { "region": "North America", "year": "2022", "source": "Wind", "twh": 500 },
    { "region": "North America", "year": "2022", "source": "Solar", "twh": 240 },
    { "region": "North America", "year": "2023", "source": "Hydro", "twh": 660 },
    { "region": "North America", "year": "2023", "source": "Wind", "twh": 520 },
    { "region": "North America", "year": "2023", "source": "Solar", "twh": 290 },
    { "region": "North America", "year": "2024", "source": "Hydro", "twh": 670 },
    { "region": "North America", "year": "2024", "source": "Wind", "twh": 560 },
    { "region": "North America", "year": "2024", "source": "Solar", "twh": 360 },
    { "region": "Latin America", "year": "2020", "source": "Hydro", "twh": 720 },
    { "region": "Latin America", "year": "2020", "source": "Wind", "twh": 120 },
    { "region": "Latin America", "year": "2020", "source": "Solar", "twh": 40 },
    { "region": "Latin America", "year": "2021", "source": "Hydro", "twh": 690 },
    { "region": "Latin America", "year": "2021", "source": "Wind", "twh": 140 },
    { "region": "Latin America", "year": "2021", "source": "Solar", "twh": 60 },
    { "region": "Latin America", "year": "2022", "source": "Hydro", "twh": 740 },
    { "region": "Latin America", "year": "2022", "source": "Wind", "twh": 170 },
    { "region": "Latin America", "year": "2022", "source": "Solar", "twh": 90 },
    { "region": "Latin America", "year": "2023", "source": "Hydro", "twh": 760 },
    { "region": "Latin America", "year": "2023", "source": "Wind", "twh": 200 },
    { "region": "Latin America", "year": "2023", "source": "Solar", "twh": 120 },
    { "region": "Latin America", "year": "2024", "source": "Hydro", "twh": 730 },
    { "region": "Latin America", "year": "2024", "source": "Wind", "twh": 230 },
    { "region": "Latin America", "year": "2024", "source": "Solar", "twh": 160 }
  ],
  "labels": { "region": "Region", "source": "Source", "year": "Year" },
  "hint": "Click a bar to filter the other charts",
  "count": true,
  "charts": [
    {
      "type": "bar-chart",
      "id": "by-region",
      "x": "region",
      "y": "twh",
      "select": true,
      "format": "compact",
      "height": 200,
      "title": "By region",
      "transform": {
        "type": "aggregate",
        "groupBy": "region",
        "measures": { "twh": { "op": "sum", "field": "twh" } }
      }
    },
    {
      "type": "bar-chart",
      "id": "by-source",
      "x": "source",
      "y": "twh",
      "select": true,
      "format": "compact",
      "height": 200,
      "title": "By source",
      "transform": {
        "type": "aggregate",
        "groupBy": "source",
        "measures": { "twh": { "op": "sum", "field": "twh" } }
      }
    },
    {
      "type": "bar-chart",
      "id": "by-year",
      "x": "year",
      "y": "twh",
      "series": "source",
      "stack": true,
      "orientation": "vertical",
      "sort": "none",
      "select": "year",
      "format": "compact",
      "height": 240,
      "title": "By year",
      "transform": {
        "type": "aggregate",
        "groupBy": ["year", "source"],
        "measures": { "twh": { "op": "sum", "field": "twh" } }
      }
    }
  ],
  "source": "Ember, Global Electricity Review 2025",
  "note": "Regional figures rounded, illustrative"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` (required) | `DataInput` |  | The shared, row-level dataset. |
| `transform` | `Transform \| Transform[]` |  | Applied once to the shared data. |
| `charts` | `Slot[]` |  | Two to four chart specs or elements. Give each `select: true` (or a field name) and a stable `id`, and leave out `data`. |
| `columns` | `number` |  | Preferred columns. Default two; fewer when charts would be narrower than `minChartWidth`. |
| `minChartWidth` | `number` | `260` | Narrowest a chart may get before the grid drops a column. |
| `filters` | `boolean` | `true` | Show the filter line (`filter-chips`). |
| `hint` | `string` | `"Click a mark to filter the other charts"` | Shown in the filter line while nothing is selected. |
| `labels` | `Record<string, string>` |  | Display names for the fields in the chips. |
| `count` | `boolean` | `false` | Show the filtered row count at the end of the filter line. |
| `unit` | `string` | `"rows"` | Noun for the count. |
| `selections` | `Record<string, Selection>` |  | Controlled selections, keyed by chart id. |
| `onSelectionsChange` | `(selections) => void` |  | Called when the selections change. |
| `title` | `string` |  | Heading for the group. |
| `subtitle` | `string` |  | Measure, population and period shared by the charts. |
| `source` | `string` |  | Shown under the grid as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `children` | `ReactNode` |  | JSX alternative to `charts`. |
| `before` | `Slot \| Slot[]` |  | Content rendered inside the shared store above the grid: figures, text, a custom component that calls `useInsightData()`, or a spec that omits `data` (e.g. `stat-row`, `data-table`). It sees the same filtered rows as the charts. |
| `after` | `Slot \| Slot[]` |  | Content rendered inside the shared store below the grid, e.g. a detail table of the filtered rows. |
| `gap` | `number` | `24` | Space in px between the `before` slot, the grid and the `after` slot. |
| `theme` | `ThemeInput` |  | Theme override, passed on to every chart. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [filter-chips](https://insightcharts.dev/llms/filter-chips.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [line-chart](https://insightcharts.dev/llms/line-chart.md)
- Used by: [data-explorer](https://insightcharts.dev/llms/data-explorer.md)

## More examples

### Two charts, no row count

```tsx
import { BarChart, LineChart, LinkedCharts } from "insightcharts";

const data = [
  { region: "Asia", year: "2020", source: "Hydro", twh: 1810 },
  { region: "Asia", year: "2020", source: "Wind", twh: 480 },
  { region: "Asia", year: "2020", source: "Solar", twh: 420 },
  { region: "Asia", year: "2021", source: "Hydro", twh: 1790 },
  { region: "Asia", year: "2021", source: "Wind", twh: 590 },
  { region: "Asia", year: "2021", source: "Solar", twh: 560 },
  { region: "Asia", year: "2022", source: "Hydro", twh: 1830 },
  { region: "Asia", year: "2022", source: "Wind", twh: 700 },
  // ... 52 more rows
];

<LinkedCharts
  data={data}
  labels={{ region: "Region", year: "Year" }}
  charts={[
    <BarChart
      id="pair-region"
      x="region"
      y="twh"
      select
      format="compact"
      height={200}
      title="Generation by region"
      transform={{ type: "aggregate", groupBy: "region", measures: { twh: { op: "sum", field: "twh" } } }}
    />,
    <LineChart
      id="pair-year"
      x="year"
      y="twh"
      series="source"
      format="compact"
      height={200}
      title="Generation by source over time"
      transform={{
        type: "aggregate",
        groupBy: ["year", "source"],
        measures: { twh: { op: "sum", field: "twh" } },
      }}
    />,
  ]}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/linked-charts.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/linked-charts.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
