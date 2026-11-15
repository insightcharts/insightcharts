# Waffle chart (`waffle-chart`)

> Shows shares of a whole as counted cells in a grid, such as 37 in every 100.

- Component: `WaffleChart` (import from `insightcharts`)
- Spec type: `"waffle-chart"`
- Level: atom. Category: part-to-whole.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

One share ("37 in every 100") or a handful of categories that add up to a whole, where the reader should be able to count the units.

## Avoid

Comparing shares across several groups (use bar-chart with stack "percent"); more than about 6 categories or shares under 1% (use bar-chart); a compact inline part-to-whole (use segmented-bar).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/waffle-chart
```

The file lands at `components/insightcharts/atoms/waffle-chart.tsx`. `@insightcharts/waffle-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { WaffleChart } from "insightcharts";

<WaffleChart
  data={[{ group: "Have never been online", share: 33 }]}
  name="group"
  value="share"
  total={100}
  restLabel="Use the internet"
  title="33% of the world's population had never used the internet in 2023"
  subtitle="Share of the global population, 2023. Each square is 1% of people"
  source="ITU Facts and Figures 2023"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "waffle-chart",
  "data": [{ "group": "Have never been online", "share": 33 }],
  "name": "group",
  "value": "share",
  "total": 100,
  "restLabel": "Use the internet",
  "title": "33% of the world's population had never used the internet in 2023",
  "subtitle": "Share of the global population, 2023. Each square is 1% of people",
  "source": "ITU Facts and Figures 2023",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Value field. Each category's cells are its share of the whole. |
| `name` | `string` |  | Category field. Omit for a single share. |
| `total` | `number` |  | The whole. Default: the sum of the values. Set to 100 with one value to show a single share against an empty remainder. |
| `rows` | `number` | `10` | Grid rows. |
| `columns` | `number` | `10` | Grid columns. |
| `shape` | `"square" \| "circle"` | `"square"` | Cell shape. |
| `restLabel` | `string` |  | Label for the unfilled remainder when `total` exceeds the sum. |
| `names` | `Record<string, string>` |  | Display names for category keys. |

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
- Used by: [poster](https://insightcharts.dev/llms/poster.md), [proportion-statement](https://insightcharts.dev/llms/proportion-statement.md), [small-multiple-grid](https://insightcharts.dev/llms/small-multiple-grid.md), [social-card](https://insightcharts.dev/llms/social-card.md)

## More examples

### Several categories

```tsx
import { WaffleChart } from "insightcharts";

const data = [
  { source: "Coal", twh: 35.4 },
  { source: "Gas", twh: 22.5 },
  { source: "Hydro", twh: 14.3 },
  { source: "Nuclear", twh: 9.1 },
  { source: "Wind", twh: 7.8 },
  { source: "Solar", twh: 5.5 },
  { source: "Other", twh: 5.4 },
];

<WaffleChart
  data={data}
  name="source"
  value="twh"
  format="{value}%"
  title="Coal and gas generated 57.9% of the world's electricity in 2023"
  subtitle="Share of global electricity generation by source, 2023"
  source="Ember, Global Electricity Review 2024"
  note="Figures are approximate, for illustration"
/>
```

### Highlight, circles

```tsx
import { WaffleChart } from "insightcharts";

const data = [
  { source: "Coal", twh: 35.4 },
  { source: "Gas", twh: 22.5 },
  { source: "Hydro", twh: 14.3 },
  { source: "Nuclear", twh: 9.1 },
  { source: "Wind", twh: 7.8 },
  { source: "Solar", twh: 5.5 },
  { source: "Other", twh: 5.4 },
];

<WaffleChart
  data={data}
  name="source"
  value="twh"
  shape="circle"
  highlight={["Wind", "Solar"]}
  format="{value}%"
  title="Wind and solar generated 13.3% of the world's electricity in 2023"
  subtitle="Share of global electricity generation by source, 2023"
  source="Ember, Global Electricity Review 2024"
  note="Figures are approximate, for illustration"
/>
```

### Stress: long names, wide grid, rounding

```tsx
import { WaffleChart } from "insightcharts";

const data = [
  { answer: "Strongly agree that the policy should be extended", n: 333 },
  { answer: "Somewhat agree", n: 333 },
  { answer: "Neither agree nor disagree, or did not answer the question", n: 334 },
  { answer: "Disagree", n: 4 },
];

<WaffleChart
  data={data}
  name="answer"
  value="n"
  rows={5}
  columns={20}
  height={130}
  title="Survey responses on extending the policy, 1,004 adults"
  subtitle="Each cell is 1% of responses. Largest-remainder rounding keeps the grid total at 100"
  source="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/waffle-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/waffle-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
