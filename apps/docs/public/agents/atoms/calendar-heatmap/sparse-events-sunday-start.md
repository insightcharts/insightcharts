# Reproduce the "Sparse events, Sunday start" example of the InsightCharts Calendar heatmap

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Sparse events, Sunday start" example of `calendar-heatmap` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Colours every day of one or more years by a value, laid out as a grid of weeks.

Use it when: Daily data over months or years where weekly rhythm, seasonality, streaks and gaps matter: activity, sales, incidents, habits.

Pick something else when: Reading the trend or exact values (use line-chart); fewer than about three months of days (use bar-chart); a non-daily grain such as hour by weekday (use heatmap).

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
npx shadcn@latest add @insightcharts/calendar-heatmap
```

The file lands at `components/insightcharts/atoms/calendar-heatmap.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { CalendarHeatmap } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "date": "2025-01-01", "incidents": 3 },
  { "date": "2025-01-06", "incidents": 3 },
  { "date": "2025-01-08", "incidents": 2 }
]
```

How the example maps columns to props:

- `date` = `"date"`. Date field: ISO strings, Dates or epoch milliseconds. One cell per calendar day.
- `value` = `"incidents"`. Numeric field that colours each day. Rows sharing a day are summed.

With the user's data, keep the props and change the column names.

## 5. The "Sparse events, Sunday start" example

This example sets `theme="earth"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { CalendarHeatmap } from "insightcharts";

const data = [
  { date: "2025-01-01", incidents: 3 },
  { date: "2025-01-06", incidents: 3 },
  { date: "2025-01-08", incidents: 2 },
  { date: "2025-01-11", incidents: 1 },
  { date: "2025-01-15", incidents: 2 },
  { date: "2025-01-16", incidents: 3 },
  { date: "2025-01-21", incidents: 2 },
  { date: "2025-01-22", incidents: 3 },
  { date: "2025-01-26", incidents: 1 },
  { date: "2025-01-29", incidents: 3 },
  { date: "2025-01-31", incidents: 3 },
  { date: "2025-02-05", incidents: 3 },
  { date: "2025-02-10", incidents: 2 },
  { date: "2025-02-12", incidents: 2 },
  { date: "2025-02-15", incidents: 1 },
  { date: "2025-02-19", incidents: 2 },
  { date: "2025-02-20", incidents: 1 },
  { date: "2025-02-25", incidents: 2 },
  { date: "2025-02-26", incidents: 3 },
  { date: "2025-03-02", incidents: 1 },
  { date: "2025-03-05", incidents: 3 },
  { date: "2025-03-07", incidents: 3 },
  { date: "2025-03-12", incidents: 2 },
  { date: "2025-03-17", incidents: 3 },
  { date: "2025-03-19", incidents: 3 },
  { date: "2025-03-22", incidents: 1 },
  { date: "2025-03-26", incidents: 2 },
  { date: "2025-03-27", incidents: 5 },
  { date: "2025-04-01", incidents: 3 },
  { date: "2025-04-02", incidents: 3 },
  { date: "2025-04-06", incidents: 1 },
  { date: "2025-04-09", incidents: 4 },
  { date: "2025-04-11", incidents: 3 },
  { date: "2025-04-16", incidents: 3 },
  { date: "2025-04-21", incidents: 3 },
  { date: "2025-04-23", incidents: 2 },
  { date: "2025-04-26", incidents: 1 },
  { date: "2025-04-30", incidents: 3 },
  { date: "2025-05-01", incidents: 2 },
  { date: "2025-05-06", incidents: 2 },
  { date: "2025-05-07", incidents: 2 },
  { date: "2025-05-11", incidents: 1 },
  { date: "2025-05-14", incidents: 2 },
  { date: "2025-05-16", incidents: 2 },
  { date: "2025-05-21", incidents: 3 },
  { date: "2025-05-26", incidents: 2 },
  { date: "2025-05-28", incidents: 2 },
  { date: "2025-05-31", incidents: 1 },
  { date: "2025-06-04", incidents: 3 },
  { date: "2025-06-05", incidents: 3 },
  { date: "2025-06-10", incidents: 4 },
  { date: "2025-06-11", incidents: 2 },
  { date: "2025-06-15", incidents: 1 },
  { date: "2025-06-18", incidents: 3 },
  { date: "2025-06-20", incidents: 4 },
  { date: "2025-06-25", incidents: 4 },
  { date: "2025-06-30", incidents: 3 },
  { date: "2025-07-02", incidents: 4 },
  { date: "2025-07-05", incidents: 1 },
  { date: "2025-07-09", incidents: 2 },
  { date: "2025-07-10", incidents: 3 },
  { date: "2025-07-15", incidents: 3 },
  { date: "2025-07-16", incidents: 2 },
  { date: "2025-07-20", incidents: 1 },
  { date: "2025-07-23", incidents: 2 },
  { date: "2025-07-25", incidents: 4 },
  { date: "2025-07-30", incidents: 2 },
  { date: "2025-08-04", incidents: 3 },
  { date: "2025-08-06", incidents: 1 },
  { date: "2025-08-11", incidents: 1 },
  { date: "2025-08-15", incidents: 1 },
  { date: "2025-08-18", incidents: 1 },
  { date: "2025-08-23", incidents: 1 },
  { date: "2025-08-24", incidents: 1 },
  { date: "2025-08-28", incidents: 2 },
  { date: "2025-08-31", incidents: 1 },
  { date: "2025-09-02", incidents: 2 },
  { date: "2025-09-07", incidents: 1 },
  { date: "2025-09-12", incidents: 4 },
  { date: "2025-09-14", incidents: 1 },
  { date: "2025-09-17", incidents: 2 },
  { date: "2025-09-21", incidents: 1 },
  { date: "2025-09-22", incidents: 2 },
  { date: "2025-09-27", incidents: 1 },
  { date: "2025-09-28", incidents: 1 },
  { date: "2025-10-02", incidents: 2 },
  { date: "2025-10-05", incidents: 1 },
  { date: "2025-10-07", incidents: 4 },
  { date: "2025-10-12", incidents: 1 },
  { date: "2025-10-17", incidents: 4 },
  { date: "2025-10-19", incidents: 1 },
  { date: "2025-10-22", incidents: 2 },
  { date: "2025-10-26", incidents: 1 },
  { date: "2025-10-27", incidents: 3 },
  { date: "2025-11-01", incidents: 1 },
  { date: "2025-11-02", incidents: 1 },
  { date: "2025-11-06", incidents: 3 },
  { date: "2025-11-09", incidents: 1 },
  { date: "2025-11-11", incidents: 3 },
  { date: "2025-11-16", incidents: 1 },
  { date: "2025-11-21", incidents: 3 },
  { date: "2025-11-23", incidents: 1 },
  { date: "2025-11-26", incidents: 3 },
  { date: "2025-11-30", incidents: 1 },
  { date: "2025-12-01", incidents: 4 },
  { date: "2025-12-06", incidents: 1 },
  { date: "2025-12-07", incidents: 1 },
  { date: "2025-12-11", incidents: 3 },
  { date: "2025-12-14", incidents: 1 },
  { date: "2025-12-16", incidents: 2 },
  { date: "2025-12-21", incidents: 1 },
  { date: "2025-12-26", incidents: 7 },
  { date: "2025-12-28", incidents: 1 },
  { date: "2025-12-31", incidents: 6 },
];

<CalendarHeatmap
  theme="earth"
  data={data}
  date="date"
  value="incidents"
  weekStart="sunday"
  title="Incidents logged per day, 2025"
  subtitle="Daily incident count, weeks starting on Sunday"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "earth",
  "data": [
    { "date": "2025-01-01", "incidents": 3 },
    { "date": "2025-01-06", "incidents": 3 },
    { "date": "2025-01-08", "incidents": 2 },
    { "date": "2025-01-11", "incidents": 1 },
    { "date": "2025-01-15", "incidents": 2 },
    { "date": "2025-01-16", "incidents": 3 },
    { "date": "2025-01-21", "incidents": 2 },
    { "date": "2025-01-22", "incidents": 3 },
    { "date": "2025-01-26", "incidents": 1 },
    { "date": "2025-01-29", "incidents": 3 },
    { "date": "2025-01-31", "incidents": 3 },
    { "date": "2025-02-05", "incidents": 3 },
    { "date": "2025-02-10", "incidents": 2 },
    { "date": "2025-02-12", "incidents": 2 },
    { "date": "2025-02-15", "incidents": 1 },
    { "date": "2025-02-19", "incidents": 2 },
    { "date": "2025-02-20", "incidents": 1 },
    { "date": "2025-02-25", "incidents": 2 },
    { "date": "2025-02-26", "incidents": 3 },
    { "date": "2025-03-02", "incidents": 1 },
    { "date": "2025-03-05", "incidents": 3 },
    { "date": "2025-03-07", "incidents": 3 },
    { "date": "2025-03-12", "incidents": 2 },
    { "date": "2025-03-17", "incidents": 3 },
    { "date": "2025-03-19", "incidents": 3 },
    { "date": "2025-03-22", "incidents": 1 },
    { "date": "2025-03-26", "incidents": 2 },
    { "date": "2025-03-27", "incidents": 5 },
    { "date": "2025-04-01", "incidents": 3 },
    { "date": "2025-04-02", "incidents": 3 },
    { "date": "2025-04-06", "incidents": 1 },
    { "date": "2025-04-09", "incidents": 4 },
    { "date": "2025-04-11", "incidents": 3 },
    { "date": "2025-04-16", "incidents": 3 },
    { "date": "2025-04-21", "incidents": 3 },
    { "date": "2025-04-23", "incidents": 2 },
    { "date": "2025-04-26", "incidents": 1 },
    { "date": "2025-04-30", "incidents": 3 },
    { "date": "2025-05-01", "incidents": 2 },
    { "date": "2025-05-06", "incidents": 2 },
    { "date": "2025-05-07", "incidents": 2 },
    { "date": "2025-05-11", "incidents": 1 },
    { "date": "2025-05-14", "incidents": 2 },
    { "date": "2025-05-16", "incidents": 2 },
    { "date": "2025-05-21", "incidents": 3 },
    { "date": "2025-05-26", "incidents": 2 },
    { "date": "2025-05-28", "incidents": 2 },
    { "date": "2025-05-31", "incidents": 1 },
    { "date": "2025-06-04", "incidents": 3 },
    { "date": "2025-06-05", "incidents": 3 },
    { "date": "2025-06-10", "incidents": 4 },
    { "date": "2025-06-11", "incidents": 2 },
    { "date": "2025-06-15", "incidents": 1 },
    { "date": "2025-06-18", "incidents": 3 },
    { "date": "2025-06-20", "incidents": 4 },
    { "date": "2025-06-25", "incidents": 4 },
    { "date": "2025-06-30", "incidents": 3 },
    { "date": "2025-07-02", "incidents": 4 },
    { "date": "2025-07-05", "incidents": 1 },
    { "date": "2025-07-09", "incidents": 2 },
    { "date": "2025-07-10", "incidents": 3 },
    { "date": "2025-07-15", "incidents": 3 },
    { "date": "2025-07-16", "incidents": 2 },
    { "date": "2025-07-20", "incidents": 1 },
    { "date": "2025-07-23", "incidents": 2 },
    { "date": "2025-07-25", "incidents": 4 },
    { "date": "2025-07-30", "incidents": 2 },
    { "date": "2025-08-04", "incidents": 3 },
    { "date": "2025-08-06", "incidents": 1 },
    { "date": "2025-08-11", "incidents": 1 },
    { "date": "2025-08-15", "incidents": 1 },
    { "date": "2025-08-18", "incidents": 1 },
    { "date": "2025-08-23", "incidents": 1 },
    { "date": "2025-08-24", "incidents": 1 },
    { "date": "2025-08-28", "incidents": 2 },
    { "date": "2025-08-31", "incidents": 1 },
    { "date": "2025-09-02", "incidents": 2 },
    { "date": "2025-09-07", "incidents": 1 },
    { "date": "2025-09-12", "incidents": 4 },
    { "date": "2025-09-14", "incidents": 1 },
    { "date": "2025-09-17", "incidents": 2 },
    { "date": "2025-09-21", "incidents": 1 },
    { "date": "2025-09-22", "incidents": 2 },
    { "date": "2025-09-27", "incidents": 1 },
    { "date": "2025-09-28", "incidents": 1 },
    { "date": "2025-10-02", "incidents": 2 },
    { "date": "2025-10-05", "incidents": 1 },
    { "date": "2025-10-07", "incidents": 4 },
    { "date": "2025-10-12", "incidents": 1 },
    { "date": "2025-10-17", "incidents": 4 },
    { "date": "2025-10-19", "incidents": 1 },
    { "date": "2025-10-22", "incidents": 2 },
    { "date": "2025-10-26", "incidents": 1 },
    { "date": "2025-10-27", "incidents": 3 },
    { "date": "2025-11-01", "incidents": 1 },
    { "date": "2025-11-02", "incidents": 1 },
    { "date": "2025-11-06", "incidents": 3 },
    { "date": "2025-11-09", "incidents": 1 },
    { "date": "2025-11-11", "incidents": 3 },
    { "date": "2025-11-16", "incidents": 1 },
    { "date": "2025-11-21", "incidents": 3 },
    { "date": "2025-11-23", "incidents": 1 },
    { "date": "2025-11-26", "incidents": 3 },
    { "date": "2025-11-30", "incidents": 1 },
    { "date": "2025-12-01", "incidents": 4 },
    { "date": "2025-12-06", "incidents": 1 },
    { "date": "2025-12-07", "incidents": 1 },
    { "date": "2025-12-11", "incidents": 3 },
    { "date": "2025-12-14", "incidents": 1 },
    { "date": "2025-12-16", "incidents": 2 },
    { "date": "2025-12-21", "incidents": 1 },
    { "date": "2025-12-26", "incidents": 7 },
    { "date": "2025-12-28", "incidents": 1 },
    { "date": "2025-12-31", "incidents": 6 }
  ],
  "date": "date",
  "value": "incidents",
  "weekStart": "sunday",
  "title": "Incidents logged per day, 2025",
  "subtitle": "Daily incident count, weeks starting on Sunday",
  "note": "Illustrative data",
  "type": "calendar-heatmap"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `date` (required) | `string` |  | Date field: ISO strings, Dates or epoch milliseconds. One cell per calendar day. |
| `value` (required) | `string` |  | Numeric field that colours each day. Rows sharing a day are summed. |
| `orientation` | `"auto" \| "horizontal" \| "vertical"` | `"auto"` | Weeks left to right, or top to bottom. `auto` goes vertical under 480px. |
| `weekStart` | `"monday" \| "sunday"` | `"monday"` | First day of the week. |
| `domain` | `[number, number]` |  | Fix the ends of the colour scale. Default: 0 to the maximum. |
| `height` | `number \| string` |  | Common prop, but note the default: when omitted the height follows the cell size, which follows the width, so cells stay square. |

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
- Used by: no molecule or template yet.

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/calendar-heatmap.md
- Component reference with every example: https://insightcharts.dev/llms/calendar-heatmap.md
- Registry item: https://insightcharts.dev/r/calendar-heatmap.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/calendar-heatmap.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/calendar-heatmap#example-sparse-events-sunday-start
- These instructions as plain text: https://insightcharts.dev/agents/atoms/calendar-heatmap/sparse-events-sunday-start.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
