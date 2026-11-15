# Timeline chart (`timeline-chart`)

> Places events and spans on a time axis in labelled lanes, with each item named directly.

- Component: `TimelineChart` (import from `insightcharts`)
- Spec type: `"timeline-chart"`
- Level: atom. Category: trend.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

When things happened and how long they lasted: project phases, terms of office, product launches, the sequence of events in a story. Mix spans (start and end) with point milestones (start only).

## Avoid

A measured value changing over time (use line-chart, with annotations for the events); more than about 40 items (filter, or split into several timelines); durations to be compared precisely with no interest in when (use bar-chart).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/timeline-chart
```

The file lands at `components/insightcharts/atoms/timeline-chart.tsx`. `@insightcharts/timeline-chart-demo` adds a ready-made example next to it.

## Usage

```tsx
import { TimelineChart } from "insightcharts";

const data = [
  { mission: "Mercury", programme: "Crewed programmes", from: "1958-10", to: "1963-05" },
  { mission: "Gemini", programme: "Crewed programmes", from: "1961-12", to: "1966-11" },
  { mission: "Apollo", programme: "Crewed programmes", from: "1961-05", to: "1972-12" },
  { mission: "Skylab", programme: "Crewed programmes", from: "1973-05", to: "1974-02" },
  { mission: "Shuttle development", programme: "Crewed programmes", from: "1972-01", to: "1981-04" },
  { mission: "Glenn orbits Earth", programme: "Milestones", from: "1962-02-20" },
  { mission: "Apollo 1 fire", programme: "Milestones", from: "1967-01-27" },
  { mission: "First Moon landing", programme: "Milestones", from: "1969-07-20" },
  { mission: "Apollo-Soyuz", programme: "Milestones", from: "1975-07-15" },
  { mission: "First Shuttle flight", programme: "Milestones", from: "1981-04-12" },
];

<TimelineChart
  theme="editorial"
  data={data}
  name="mission"
  start="from"
  end="to"
  lane="programme"
  highlight={["Apollo", "First Moon landing"]}
  title="The Apollo programme ran from May 1961 to December 1972"
  subtitle="NASA human spaceflight programmes and milestones, 1958 to 1981"
  source="NASA History Office"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "theme": "editorial",
  "type": "timeline-chart",
  "data": [
    { "mission": "Mercury", "programme": "Crewed programmes", "from": "1958-10", "to": "1963-05" },
    { "mission": "Gemini", "programme": "Crewed programmes", "from": "1961-12", "to": "1966-11" },
    { "mission": "Apollo", "programme": "Crewed programmes", "from": "1961-05", "to": "1972-12" },
    { "mission": "Skylab", "programme": "Crewed programmes", "from": "1973-05", "to": "1974-02" },
    {
      "mission": "Shuttle development",
      "programme": "Crewed programmes",
      "from": "1972-01",
      "to": "1981-04"
    },
    { "mission": "Glenn orbits Earth", "programme": "Milestones", "from": "1962-02-20" },
    { "mission": "Apollo 1 fire", "programme": "Milestones", "from": "1967-01-27" },
    { "mission": "First Moon landing", "programme": "Milestones", "from": "1969-07-20" },
    { "mission": "Apollo-Soyuz", "programme": "Milestones", "from": "1975-07-15" },
    { "mission": "First Shuttle flight", "programme": "Milestones", "from": "1981-04-12" }
  ],
  "name": "mission",
  "start": "from",
  "end": "to",
  "lane": "programme",
  "highlight": ["Apollo", "First Moon landing"],
  "title": "The Apollo programme ran from May 1961 to December 1972",
  "subtitle": "NASA human spaceflight programmes and milestones, 1958 to 1981",
  "source": "NASA History Office",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` (required) | `string` |  | Label field: what the event or span is. |
| `start` (required) | `string` |  | Start field: ISO date, year or timestamp. |
| `end` | `string` |  | End field. Rows without an end are point milestones. |
| `lane` | `string` |  | Field that groups rows into labelled lanes. |
| `precision` | `"year" \| "month" \| "day"` |  | Date precision in tooltips. Default: chosen from the span of the data. |

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
- Used by: [timeline-story](https://insightcharts.dev/llms/timeline-story.md)

## More examples

### Single lane, milestones only

```tsx
import { TimelineChart } from "insightcharts";

const data = [
  { event: "WHO told of pneumonia cluster", date: "2019-12-31" },
  { event: "Virus genome published", date: "2020-01-11" },
  { event: "Pandemic declared", date: "2020-03-11" },
  { event: "First vaccine trial results", date: "2020-11-09" },
  { event: "First approved dose given", date: "2020-12-08" },
];

<TimelineChart
  data={data}
  name="event"
  start="date"
  height={200}
  highlight="First approved dose given"
  title="The first approved Covid-19 vaccine dose was given on 8 December 2020"
  subtitle="Key dates in the first year of Covid-19, December 2019 to December 2020"
  source="WHO, MHRA"
  note="Figures are approximate, for illustration"
/>
```

### Project plan with lanes

```tsx
import { TimelineChart } from "insightcharts";

const data = [
  { task: "Discovery", team: "Design", start: "2025-01-06", end: "2025-02-14" },
  { task: "Prototype", team: "Design", start: "2025-02-10", end: "2025-04-04" },
  { task: "Design system", team: "Design", start: "2025-03-17", end: "2025-06-27" },
  { task: "API", team: "Engineering", start: "2025-02-24", end: "2025-05-30" },
  { task: "Web app", team: "Engineering", start: "2025-04-07", end: "2025-08-15" },
  { task: "Beta", team: "Engineering", start: "2025-07-01" },
  { task: "Hardening", team: "Engineering", start: "2025-08-04", end: "2025-09-19" },
  { task: "Pricing research", team: "Go to market", start: "2025-03-03", end: "2025-04-25" },
  // ... 2 more rows
];

<TimelineChart
  theme="ocean"
  data={data}
  name="task"
  start="start"
  end="end"
  lane="team"
  title="Public launch is planned for 23 September 2025"
  subtitle="Product roadmap by team, 2025"
  note="Illustrative plan"
/>
```

### Stress: long names, crowded lanes, centuries

```tsx
import { TimelineChart } from "insightcharts";

const data = [
  { who: "Elizabeth I", house: "Tudor", from: 1558, to: 1603 },
  { who: "James VI and I", house: "Stuart", from: 1603, to: 1625 },
  { who: "Charles I", house: "Stuart", from: 1625, to: 1649 },
  { who: "Commonwealth and Protectorate", house: "Interregnum", from: 1649, to: 1660 },
  { who: "Charles II", house: "Stuart", from: 1660, to: 1685 },
  { who: "James II", house: "Stuart", from: 1685, to: 1688 },
  { who: "William III and Mary II", house: "Stuart", from: 1689, to: 1702 },
  { who: "Anne", house: "Stuart", from: 1702, to: 1714 },
  // ... 13 more rows
];

<TimelineChart
  theme="earth"
  data={data}
  name="who"
  start="from"
  end="to"
  lane="house"
  height={420}
  title="Victoria reigned from 1837 to 1901"
  subtitle="English and British monarchs by royal house, 1558 to 1901"
  source="Royal Household"
  note="Figures are approximate, for illustration"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/timeline-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/timeline-chart.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
