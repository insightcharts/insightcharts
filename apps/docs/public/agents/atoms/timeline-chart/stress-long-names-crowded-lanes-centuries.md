# Reproduce the "Stress: long names, crowded lanes, centuries" example of the InsightCharts Timeline chart

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Stress: long names, crowded lanes, centuries" example of `timeline-chart` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Places events and spans on a time axis in labelled lanes, with each item named directly.

Use it when: When things happened and how long they lasted: project phases, terms of office, product launches, the sequence of events in a story. Mix spans (start and end) with point milestones (start only).

Pick something else when: A measured value changing over time (use line-chart, with annotations for the events); more than about 40 items (filter, or split into several timelines); durations to be compared precisely with no interest in when (use bar-chart).

Instructions for the alternatives: `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/timeline-chart
```

The file lands at `components/insightcharts/atoms/timeline-chart.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { TimelineChart } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "who": "Elizabeth I", "house": "Tudor", "from": 1558, "to": 1603 },
  { "who": "James VI and I", "house": "Stuart", "from": 1603, "to": 1625 },
  { "who": "Charles I", "house": "Stuart", "from": 1625, "to": 1649 }
]
```

How the example maps columns to props:

- `name` = `"who"`. Label field: what the event or span is.
- `start` = `"from"`. Start field: ISO date, year or timestamp.
- `end` = `"to"`. End field. Rows without an end are point milestones.
- `lane` = `"house"`. Field that groups rows into labelled lanes.

With the user's data, keep the props and change the column names.

## 5. The "Stress: long names, crowded lanes, centuries" example

This example sets `theme="earth"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

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
  { who: "George I", house: "Hanover", from: 1714, to: 1727 },
  { who: "George II", house: "Hanover", from: 1727, to: 1760 },
  { who: "George III", house: "Hanover", from: 1760, to: 1820 },
  { who: "George IV", house: "Hanover", from: 1820, to: 1830 },
  { who: "William IV", house: "Hanover", from: 1830, to: 1837 },
  { who: "Victoria", house: "Hanover", from: 1837, to: 1901 },
  { who: "Spanish Armada defeated", house: "Events", from: 1588 },
  { who: "Gunpowder Plot", house: "Events", from: 1605 },
  { who: "Great Fire of London", house: "Events", from: 1666 },
  { who: "Acts of Union", house: "Events", from: 1707 },
  { who: "American independence declared", house: "Events", from: 1776 },
  { who: "Battle of Waterloo", house: "Events", from: 1815 },
  { who: "Great Reform Act", house: "Events", from: 1832 },
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

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "earth",
  "data": [
    { "who": "Elizabeth I", "house": "Tudor", "from": 1558, "to": 1603 },
    { "who": "James VI and I", "house": "Stuart", "from": 1603, "to": 1625 },
    { "who": "Charles I", "house": "Stuart", "from": 1625, "to": 1649 },
    { "who": "Commonwealth and Protectorate", "house": "Interregnum", "from": 1649, "to": 1660 },
    { "who": "Charles II", "house": "Stuart", "from": 1660, "to": 1685 },
    { "who": "James II", "house": "Stuart", "from": 1685, "to": 1688 },
    { "who": "William III and Mary II", "house": "Stuart", "from": 1689, "to": 1702 },
    { "who": "Anne", "house": "Stuart", "from": 1702, "to": 1714 },
    { "who": "George I", "house": "Hanover", "from": 1714, "to": 1727 },
    { "who": "George II", "house": "Hanover", "from": 1727, "to": 1760 },
    { "who": "George III", "house": "Hanover", "from": 1760, "to": 1820 },
    { "who": "George IV", "house": "Hanover", "from": 1820, "to": 1830 },
    { "who": "William IV", "house": "Hanover", "from": 1830, "to": 1837 },
    { "who": "Victoria", "house": "Hanover", "from": 1837, "to": 1901 },
    { "who": "Spanish Armada defeated", "house": "Events", "from": 1588 },
    { "who": "Gunpowder Plot", "house": "Events", "from": 1605 },
    { "who": "Great Fire of London", "house": "Events", "from": 1666 },
    { "who": "Acts of Union", "house": "Events", "from": 1707 },
    { "who": "American independence declared", "house": "Events", "from": 1776 },
    { "who": "Battle of Waterloo", "house": "Events", "from": 1815 },
    { "who": "Great Reform Act", "house": "Events", "from": 1832 }
  ],
  "name": "who",
  "start": "from",
  "end": "to",
  "lane": "house",
  "height": 420,
  "title": "Victoria reigned from 1837 to 1901",
  "subtitle": "English and British monarchs by royal house, 1558 to 1901",
  "source": "Royal Household",
  "note": "Figures are approximate, for illustration",
  "type": "timeline-chart"
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

Every chart also accepts these common props:

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

- Built from: nothing. It is a primitive.
- Used by: `timeline-story` (template)

## Rules for this form

- Keep the periods in chronological order.
- A line encodes by position and may use an axis that does not start at zero. A filled area encodes by area and starts at zero.
- If you rebase to an index or use a log scale, say so in `subtitle`.
- Do not set colours per series. Set `highlight` to the one or two entities the title is about. The others are drawn in grey.
- Use at most three `annotations`. Their values must match values in the data.
- No dual axes and no 3D. The chart must read without hovering.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The chart is exposed as an image (`role="img"`) with a description the component writes from the data. Set `alt` when the title states a different fact from that description: chart type and measures first, then the main pattern and the notable values.
- Set `table` to add a collapsible "View data" table under the chart, for readers who need exact values or use a screen reader.
- The title is a heading, the legend a list and the source a `<figcaption>`. Do not repeat them in surrounding markup.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] One entity is highlighted and the others are grey, or the chart has one series.
- [ ] The chart can be read without hovering.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/timeline-chart.md
- Component reference with every example: https://insightcharts.dev/llms/timeline-chart.md
- Registry item: https://insightcharts.dev/r/timeline-chart.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/timeline-chart.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/timeline-chart#example-stress-long-names-crowded-lanes-centuries
- These instructions as plain text: https://insightcharts.dev/agents/atoms/timeline-chart/stress-long-names-crowded-lanes-centuries.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
