# Bullet chart (`bullet-chart`)

> Compares one measure per row with its target, optionally against qualitative bands such as poor / fair / good.

- Component: `BulletChart` (import from `insightcharts`)
- Spec type: `"bullet-chart"`
- Level: atom. Category: comparison.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

Progress against a target or budget for one to about 10 measures, including measures in different units (`scale: "independent"`); a compact scorecard instead of a row of gauges.

## Avoid

No target or thresholds to compare with (use bar-chart); a single share of a whole (use progress-meter); change over time (use line-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/bullet-chart
```

The file lands at `components/insightcharts/atoms/bullet-chart.tsx`. `@insightcharts/bullet-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BulletChart } from "insightcharts";

const data = [
  { region: "North America", sales: 94, target: 80 },
  { region: "Europe", sales: 71, target: 85 },
  { region: "Asia Pacific", sales: 63, target: 60 },
  { region: "Latin America", sales: 38, target: 55 },
];

<BulletChart
  theme="mono"
  data={data}
  category="region"
  value="sales"
  target="target"
  bands={[50, 75, 110]}
  bandNames={["Below plan", "On plan", "Stretch"]}
  names={{ sales: "Sales", target: "Target" }}
  format="currency:USD"
  height={240}
  title="Europe sold $71 million against a target of $85 million in 2024"
  subtitle="Sales against target by region, $ millions, 2024"
  source="Company accounts"
  note="Illustrative figures."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "bullet-chart",
  "theme": "mono",
  "data": [
    { "region": "North America", "sales": 94, "target": 80 },
    { "region": "Europe", "sales": 71, "target": 85 },
    { "region": "Asia Pacific", "sales": 63, "target": 60 },
    { "region": "Latin America", "sales": 38, "target": 55 }
  ],
  "category": "region",
  "value": "sales",
  "target": "target",
  "bands": [50, 75, 110],
  "bandNames": ["Below plan", "On plan", "Stretch"],
  "names": { "sales": "Sales", "target": "Target" },
  "format": "currency:USD",
  "height": 240,
  "title": "Europe sold $71 million against a target of $85 million in 2024",
  "subtitle": "Sales against target by region, $ millions, 2024",
  "source": "Company accounts",
  "note": "Illustrative figures."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `category` (required) | `string` |  | Field naming each row. |
| `value` (required) | `string` |  | Field with the measured value. Values below zero are not supported. |
| `target` | `string` |  | Field with the target, drawn as a tick across the bar. |
| `bands` | `number[] \| string[]` |  | Ascending upper bounds of qualitative bands, or the fields holding them per row. Omit unless the thresholds are real. |
| `bandNames` | `string[]` |  | Band names, lowest first, for the legend and tooltip. |
| `max` | `number \| string` |  | End of the scale: a number or a per-row field. Default: just past the largest value, target or band. |
| `scale` | `"shared" \| "independent"` | `"shared"` | One axis for all rows, or each row on its own scale (different units). |
| `formatField` | `string` |  | Field holding a format spec per row, for mixed units. |
| `names` | `Record<string, string>` |  | Display names for the value and target fields. |

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
- Used by: [scorecard](https://insightcharts.dev/llms/scorecard.md)

## More examples

### Scorecard with a separate scale per row

```tsx
import { BulletChart } from "insightcharts";

const data = [
  { kpi: "Revenue", actual: 4.6, goal: 5, low: 3.5, mid: 4.5, high: 6, unit: "${value}m" },
  { kpi: "Gross margin", actual: 41, goal: 38, low: 25, mid: 35, high: 50, unit: "{value}%" },
  {
    kpi: "New customers",
    actual: 1320,
    goal: 1500,
    low: 900,
    mid: 1300,
    high: 1800,
    unit: "integer",
  },
  {
    kpi: "Customer satisfaction",
    actual: 4.4,
    goal: 4.5,
    low: 3.5,
    mid: 4.2,
    high: 5,
    unit: "decimal:1",
  },
  {
    kpi: "Average order value",
    actual: 58,
    goal: 52,
    low: 40,
    mid: 50,
    high: 65,
    unit: "currency:EUR",
  },
];

<BulletChart
  theme="ledger"
  data={data}
  category="kpi"
  value="actual"
  target="goal"
  bands={["low", "mid", "high"]}
  bandNames={["Poor", "Acceptable", "Good"]}
  scale="independent"
  formatField="unit"
  names={{ actual: "Actual", goal: "Target" }}
  height={300}
  title="Third-quarter revenue was $4.6 million against a target of $5.0 million"
  subtitle="Third-quarter results against target"
  note="Illustrative figures."
/>
```

### No thresholds, one row highlighted

```tsx
import { BulletChart } from "insightcharts";

const data = [
  { team: "Payments", done: 86, plan: 80 },
  { team: "Search", done: 74, plan: 80 },
  { team: "Onboarding", done: 52, plan: 80 },
  { team: "Mobile", done: 91, plan: 80 },
  { team: "Data platform", done: 79, plan: 80 },
];

<BulletChart
  data={data}
  category="team"
  value="done"
  target="plan"
  highlight="Onboarding"
  names={{ done: "Delivered", plan: "Committed" }}
  format="{value}%"
  height={260}
  title="Onboarding delivered 52% of its quarterly roadmap"
  subtitle="Share of quarterly roadmap delivered, by team. The tick marks the 80% commitment."
  note="Illustrative figures."
/>
```

### Stress: 10 rows with long labels

```tsx
import { BulletChart } from "insightcharts";

const data = [
  { measure: "Percentage of emergency patients seen within four hours", actual: 71, standard: 95 },
  {
    measure: "Ambulance response to life-threatening calls within target",
    actual: 64,
    standard: 90,
  },
  {
    measure: "Cancer patients starting treatment within 62 days of referral",
    actual: 62,
    standard: 85,
  },
  { measure: "Planned operations within 18 weeks", actual: 58, standard: 92 },
  { measure: "Diagnostic tests within six weeks", actual: 76, standard: 99 },
  { measure: "GP appointments within two weeks", actual: 83, standard: 85 },
  { measure: "Mental health referrals seen within four weeks", actual: 69, standard: 75 },
  { measure: "Beds occupied by patients fit for discharge (inverted)", actual: 88, standard: 95 },
  // ... 2 more rows
];

<BulletChart
  theme="dusk"
  data={data}
  category="measure"
  value="actual"
  target="standard"
  max={100}
  names={{ actual: "Performance", standard: "Standard" }}
  format="{value}%"
  height={440}
  title="The health service missed all 10 national standards in the latest month"
  subtitle="Performance against the national standard, % of cases"
  note="Illustrative figures."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/bullet-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/bullet-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
