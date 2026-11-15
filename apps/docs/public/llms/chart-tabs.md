# Chart tabs (`chart-tabs`)

> One chart frame with a segmented control that switches between several views of the same data, morphing between views that share a chart type.

- Component: `ChartTabs` (import from `insightcharts`)
- Spec type: `"chart-tabs"`
- Level: molecule. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

The same entities under two to five measures or scalings where each view changes the reading: total / per capita / change, absolute / share, linear / log. Give the frame a plain label as its title. Each view's `subtitle` names its measure.

## Avoid

Hiding the most important view behind a tab (show it first, or show both with `small-multiple-grid`); unrelated charts (give each its own figure); more than five views.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/chart-tabs
```

The file lands at `components/insightcharts/molecules/chart-tabs.tsx`. `@insightcharts/chart-tabs-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, ChartTabs, registerComponents } from "insightcharts";

// Specs passed as data are resolved by name when rendered.
registerComponents({ BarChart });

<ChartTabs
  title="CO2 emissions of six large emitters, 2023"
  tabsPosition="below"
  chart={{
    type: "bar-chart",
    data: [
      { country: "China", total: 11.9, perCapita: 8.4, change: 0.38 },
      { country: "United States", total: 4.9, perCapita: 14.3, change: -0.13 },
      { country: "India", total: 3.1, perCapita: 2.1, change: 0.74 },
      { country: "Russia", total: 1.8, perCapita: 12.5, change: 0.1 },
      { country: "Japan", total: 1, perCapita: 8, change: -0.19 },
      { country: "Germany", total: 0.6, perCapita: 7.1, change: -0.28 },
    ],
    x: "country",
    y: "total",
    sort: "desc",
    orientation: "horizontal",
    height: 280,
    highlight: "China",
    format: "{value} Gt",
    subtitle: "CO2 emissions from fossil fuels, billion tonnes, 2023",
  }}
  views={[
    { label: "Total", id: "total" },
    {
      label: "Per capita",
      id: "per-capita",
      props: {
        y: "perCapita",
        highlight: "United States",
        format: "{value} t",
        subtitle: "CO2 emissions per person, tonnes, 2023",
      },
    },
    {
      label: "Change since 2010",
      id: "change",
      props: {
        y: "change",
        highlight: "India",
        format: "percent",
        subtitle: "Change in CO2 emissions, 2010 to 2023",
      },
    },
  ]}
  source="Global Carbon Budget 2024"
  note="Rounded, approximate figures for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "chart-tabs",
  "title": "CO2 emissions of six large emitters, 2023",
  "tabsPosition": "below",
  "chart": {
    "type": "bar-chart",
    "data": [
      { "country": "China", "total": 11.9, "perCapita": 8.4, "change": 0.38 },
      { "country": "United States", "total": 4.9, "perCapita": 14.3, "change": -0.13 },
      { "country": "India", "total": 3.1, "perCapita": 2.1, "change": 0.74 },
      { "country": "Russia", "total": 1.8, "perCapita": 12.5, "change": 0.1 },
      { "country": "Japan", "total": 1, "perCapita": 8, "change": -0.19 },
      { "country": "Germany", "total": 0.6, "perCapita": 7.1, "change": -0.28 }
    ],
    "x": "country",
    "y": "total",
    "sort": "desc",
    "orientation": "horizontal",
    "height": 280,
    "highlight": "China",
    "format": "{value} Gt",
    "subtitle": "CO2 emissions from fossil fuels, billion tonnes, 2023"
  },
  "views": [
    { "label": "Total", "id": "total" },
    {
      "label": "Per capita",
      "id": "per-capita",
      "props": {
        "y": "perCapita",
        "highlight": "United States",
        "format": "{value} t",
        "subtitle": "CO2 emissions per person, tonnes, 2023"
      }
    },
    {
      "label": "Change since 2010",
      "id": "change",
      "props": {
        "y": "change",
        "highlight": "India",
        "format": "percent",
        "subtitle": "Change in CO2 emissions, 2010 to 2023"
      }
    }
  ],
  "source": "Global Carbon Budget 2024",
  "note": "Rounded, approximate figures for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `chart` | `InsightSpec` |  | The base chart spec every view starts from: `{ type, data, ... }`. |
| `views` (required) | `{ label, id?, props?, chart? }[]` |  | Two to five views. `props` are merged over `chart`; or give a view its own complete `chart` slot. |
| `defaultView` | `string \| number` |  | The view shown first: an id, a label or an index. |
| `view` | `string \| number` |  | Controlled active view. |
| `onViewChange` | `(id, index) => void` |  | Called when the reader switches view. |
| `tabsLabel` | `string` | `"Chart view"` | Accessible name of the tab list. |
| `tabsPosition` | `"right" \| "below"` | `"right"` | Tabs beside the title or under it. Under 560px they always go underneath. |
| `title` | `string` |  | A plain label or fact that is true of every view. |
| `subtitle` | `string` |  | What the views share; each view's own `subtitle` names its measure. |
| `source` | `string` |  | Shown under the chart as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `children` | `ReactNode` |  | Extra content under the chart. |
| `theme` | `ThemeInput` |  | Theme override, passed on to the chart. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [line-chart](https://insightcharts.dev/llms/line-chart.md)
- Used by: no molecule or template yet

## More examples

### Tabs beside the title, a different chart per view

```tsx
import { BarChart, ChartTabs, LineChart } from "insightcharts";

<ChartTabs
  title="Solar supplied 11.1% of EU electricity in 2024"
  defaultView="Trend"
  views={[
    {
      label: "Trend",
      chart: <LineChart
        data={[
          { year: "2019", Solar: 4.2, Coal: 15 },
          { year: "2020", Solar: 5, Coal: 13 },
          { year: "2021", Solar: 5.4, Coal: 14.7 },
          { year: "2022", Solar: 7, Coal: 15.8 },
          { year: "2023", Solar: 9.1, Coal: 12.3 },
          { year: "2024", Solar: 11.1, Coal: 9.8 },
        ]}
        x="year"
        y={["Solar", "Coal"]}
        format="{value}%"
        height={260}
        subtitle="Solar and coal share of EU electricity generation, 2019 to 2024"
      />,
    },
    {
      label: "2024",
      chart: <BarChart
        data={[{ source: "Solar", share: 11.1 }, { source: "Coal", share: 9.8 }]}
        x="source"
        y="share"
        format="{value}%"
        height={260}
        highlight="Solar"
        subtitle="Share of EU electricity generation, 2024. Coal supplied 9.8%."
      />,
    },
  ]}
  source="Ember"
  note="Figures are approximate, for illustration"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/chart-tabs.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/chart-tabs.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
