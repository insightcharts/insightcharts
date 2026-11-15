# Reproduce the "Every other line as context" example of the InsightCharts Small multiples

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Every other line as context" example of `small-multiples` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Repeats one small line, area or bar chart per value of a facet field on a shared scale, each panel titled.

Use it when: The same measure for 4 to about 24 entities when one chart would have too many overlapping lines; pair with `highlight` to pick out one panel, or `context` to show every other line faintly behind each.

Pick something else when: Three or fewer series (use line-chart with direct labels); when exact comparison between two entities matters most (use line-chart with `highlight`); a single value per entity (use bar-chart).

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
npx shadcn@latest add @insightcharts/small-multiples
```

The file lands at `components/insightcharts/atoms/small-multiples.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { SmallMultiples } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "city": "Phoenix", "month": "Jan", "temp": 12.4 },
  { "city": "Phoenix", "month": "Feb", "temp": 14.1 },
  { "city": "Phoenix", "month": "Mar", "temp": 17.6 }
]
```

How the example maps columns to props:

- `facet` = `"city"`. Field whose values each get a panel.
- `x` = `"month"`. Time or ordered category field, shared by every panel.
- `y` = `"temp"`. Value field, or several (one series each in every panel).

With the user's data, keep the props and change the column names.

## 5. The "Every other line as context" example

This example sets `theme="earth"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { SmallMultiples } from "insightcharts";

const data = [
  { city: "Phoenix", month: "Jan", temp: 12.4 },
  { city: "Phoenix", month: "Feb", temp: 14.1 },
  { city: "Phoenix", month: "Mar", temp: 17.6 },
  { city: "Phoenix", month: "Apr", temp: 22.8 },
  { city: "Phoenix", month: "May", temp: 27.9 },
  { city: "Phoenix", month: "Jun", temp: 31.2 },
  { city: "Phoenix", month: "Jul", temp: 33 },
  { city: "Phoenix", month: "Aug", temp: 31.8 },
  { city: "Phoenix", month: "Sep", temp: 28.1 },
  { city: "Phoenix", month: "Oct", temp: 21.7 },
  { city: "Phoenix", month: "Nov", temp: 15.6 },
  { city: "Phoenix", month: "Dec", temp: 12.1 },
  { city: "Seattle", month: "Jan", temp: 5.6 },
  { city: "Seattle", month: "Feb", temp: 6.8 },
  { city: "Seattle", month: "Mar", temp: 8.6 },
  { city: "Seattle", month: "Apr", temp: 10.9 },
  { city: "Seattle", month: "May", temp: 14.2 },
  { city: "Seattle", month: "Jun", temp: 16.9 },
  { city: "Seattle", month: "Jul", temp: 19.6 },
  { city: "Seattle", month: "Aug", temp: 19.8 },
  { city: "Seattle", month: "Sep", temp: 17.1 },
  { city: "Seattle", month: "Oct", temp: 12.3 },
  { city: "Seattle", month: "Nov", temp: 8.1 },
  { city: "Seattle", month: "Dec", temp: 5.6 },
  { city: "Chicago", month: "Jan", temp: -3.2 },
  { city: "Chicago", month: "Feb", temp: -1.2 },
  { city: "Chicago", month: "Mar", temp: 4.4 },
  { city: "Chicago", month: "Apr", temp: 10.5 },
  { city: "Chicago", month: "May", temp: 16.1 },
  { city: "Chicago", month: "Jun", temp: 21.7 },
  { city: "Chicago", month: "Jul", temp: 24.3 },
  { city: "Chicago", month: "Aug", temp: 23.4 },
  { city: "Chicago", month: "Sep", temp: 19.1 },
  { city: "Chicago", month: "Oct", temp: 12.1 },
  { city: "Chicago", month: "Nov", temp: 5.4 },
  { city: "Chicago", month: "Dec", temp: -1 },
  { city: "Miami", month: "Jan", temp: 20.1 },
  { city: "Miami", month: "Feb", temp: 21.2 },
  { city: "Miami", month: "Mar", temp: 22.6 },
  { city: "Miami", month: "Apr", temp: 24.4 },
  { city: "Miami", month: "May", temp: 26.6 },
  { city: "Miami", month: "Jun", temp: 28.1 },
  { city: "Miami", month: "Jul", temp: 28.8 },
  { city: "Miami", month: "Aug", temp: 28.9 },
  { city: "Miami", month: "Sep", temp: 28.2 },
  { city: "Miami", month: "Oct", temp: 26.3 },
  { city: "Miami", month: "Nov", temp: 23.5 },
  { city: "Miami", month: "Dec", temp: 21.3 },
  { city: "Denver", month: "Jan", temp: -0.6 },
  { city: "Denver", month: "Feb", temp: 0.8 },
  { city: "Denver", month: "Mar", temp: 4.9 },
  { city: "Denver", month: "Apr", temp: 8.7 },
  { city: "Denver", month: "May", temp: 13.8 },
  { city: "Denver", month: "Jun", temp: 19.8 },
  { city: "Denver", month: "Jul", temp: 23.4 },
  { city: "Denver", month: "Aug", temp: 22.2 },
  { city: "Denver", month: "Sep", temp: 17.4 },
  { city: "Denver", month: "Oct", temp: 10.2 },
  { city: "Denver", month: "Nov", temp: 3.8 },
  { city: "Denver", month: "Dec", temp: -0.9 },
  { city: "Boston", month: "Jan", temp: -1.5 },
  { city: "Boston", month: "Feb", temp: -0.2 },
  { city: "Boston", month: "Mar", temp: 3.6 },
  { city: "Boston", month: "Apr", temp: 9.4 },
  { city: "Boston", month: "May", temp: 14.9 },
  { city: "Boston", month: "Jun", temp: 20.2 },
  { city: "Boston", month: "Jul", temp: 23.4 },
  { city: "Boston", month: "Aug", temp: 22.6 },
  { city: "Boston", month: "Sep", temp: 18.6 },
  { city: "Boston", month: "Oct", temp: 12.4 },
  { city: "Boston", month: "Nov", temp: 6.9 },
  { city: "Boston", month: "Dec", temp: 1.6 },
  { city: "Anchorage", month: "Jan", temp: -8.2 },
  { city: "Anchorage", month: "Feb", temp: -6.4 },
  { city: "Anchorage", month: "Mar", temp: -3.3 },
  { city: "Anchorage", month: "Apr", temp: 2.7 },
  { city: "Anchorage", month: "May", temp: 8.6 },
  { city: "Anchorage", month: "Jun", temp: 13.1 },
  { city: "Anchorage", month: "Jul", temp: 15.1 },
  { city: "Anchorage", month: "Aug", temp: 13.9 },
  { city: "Anchorage", month: "Sep", temp: 9.4 },
  { city: "Anchorage", month: "Oct", temp: 1.6 },
  { city: "Anchorage", month: "Nov", temp: -5.2 },
  { city: "Anchorage", month: "Dec", temp: -7.4 },
  { city: "Honolulu", month: "Jan", temp: 23 },
  { city: "Honolulu", month: "Feb", temp: 23.1 },
  { city: "Honolulu", month: "Mar", temp: 23.7 },
  { city: "Honolulu", month: "Apr", temp: 24.6 },
  { city: "Honolulu", month: "May", temp: 25.6 },
  { city: "Honolulu", month: "Jun", temp: 26.8 },
  { city: "Honolulu", month: "Jul", temp: 27.4 },
  { city: "Honolulu", month: "Aug", temp: 27.9 },
  { city: "Honolulu", month: "Sep", temp: 27.6 },
  { city: "Honolulu", month: "Oct", temp: 26.8 },
  { city: "Honolulu", month: "Nov", temp: 25.3 },
  { city: "Honolulu", month: "Dec", temp: 23.9 },
];

<SmallMultiples
  theme="earth"
  data={data}
  facet="city"
  x="month"
  y="temp"
  context
  format="{value}°"
  height={380}
  title="Chicago's average monthly temperature ranges from -3.2°C to 24.3°C"
  subtitle="Average monthly temperature, °C. Honolulu ranges from 23.0 to 27.9. Grey lines show the other cities."
  source="NOAA climate normals (rounded)"
  note="Figures are approximate, for illustration"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "earth",
  "data": [
    { "city": "Phoenix", "month": "Jan", "temp": 12.4 },
    { "city": "Phoenix", "month": "Feb", "temp": 14.1 },
    { "city": "Phoenix", "month": "Mar", "temp": 17.6 },
    { "city": "Phoenix", "month": "Apr", "temp": 22.8 },
    { "city": "Phoenix", "month": "May", "temp": 27.9 },
    { "city": "Phoenix", "month": "Jun", "temp": 31.2 },
    { "city": "Phoenix", "month": "Jul", "temp": 33 },
    { "city": "Phoenix", "month": "Aug", "temp": 31.8 },
    { "city": "Phoenix", "month": "Sep", "temp": 28.1 },
    { "city": "Phoenix", "month": "Oct", "temp": 21.7 },
    { "city": "Phoenix", "month": "Nov", "temp": 15.6 },
    { "city": "Phoenix", "month": "Dec", "temp": 12.1 },
    { "city": "Seattle", "month": "Jan", "temp": 5.6 },
    { "city": "Seattle", "month": "Feb", "temp": 6.8 },
    { "city": "Seattle", "month": "Mar", "temp": 8.6 },
    { "city": "Seattle", "month": "Apr", "temp": 10.9 },
    { "city": "Seattle", "month": "May", "temp": 14.2 },
    { "city": "Seattle", "month": "Jun", "temp": 16.9 },
    { "city": "Seattle", "month": "Jul", "temp": 19.6 },
    { "city": "Seattle", "month": "Aug", "temp": 19.8 },
    { "city": "Seattle", "month": "Sep", "temp": 17.1 },
    { "city": "Seattle", "month": "Oct", "temp": 12.3 },
    { "city": "Seattle", "month": "Nov", "temp": 8.1 },
    { "city": "Seattle", "month": "Dec", "temp": 5.6 },
    { "city": "Chicago", "month": "Jan", "temp": -3.2 },
    { "city": "Chicago", "month": "Feb", "temp": -1.2 },
    { "city": "Chicago", "month": "Mar", "temp": 4.4 },
    { "city": "Chicago", "month": "Apr", "temp": 10.5 },
    { "city": "Chicago", "month": "May", "temp": 16.1 },
    { "city": "Chicago", "month": "Jun", "temp": 21.7 },
    { "city": "Chicago", "month": "Jul", "temp": 24.3 },
    { "city": "Chicago", "month": "Aug", "temp": 23.4 },
    { "city": "Chicago", "month": "Sep", "temp": 19.1 },
    { "city": "Chicago", "month": "Oct", "temp": 12.1 },
    { "city": "Chicago", "month": "Nov", "temp": 5.4 },
    { "city": "Chicago", "month": "Dec", "temp": -1 },
    { "city": "Miami", "month": "Jan", "temp": 20.1 },
    { "city": "Miami", "month": "Feb", "temp": 21.2 },
    { "city": "Miami", "month": "Mar", "temp": 22.6 },
    { "city": "Miami", "month": "Apr", "temp": 24.4 },
    { "city": "Miami", "month": "May", "temp": 26.6 },
    { "city": "Miami", "month": "Jun", "temp": 28.1 },
    { "city": "Miami", "month": "Jul", "temp": 28.8 },
    { "city": "Miami", "month": "Aug", "temp": 28.9 },
    { "city": "Miami", "month": "Sep", "temp": 28.2 },
    { "city": "Miami", "month": "Oct", "temp": 26.3 },
    { "city": "Miami", "month": "Nov", "temp": 23.5 },
    { "city": "Miami", "month": "Dec", "temp": 21.3 },
    { "city": "Denver", "month": "Jan", "temp": -0.6 },
    { "city": "Denver", "month": "Feb", "temp": 0.8 },
    { "city": "Denver", "month": "Mar", "temp": 4.9 },
    { "city": "Denver", "month": "Apr", "temp": 8.7 },
    { "city": "Denver", "month": "May", "temp": 13.8 },
    { "city": "Denver", "month": "Jun", "temp": 19.8 },
    { "city": "Denver", "month": "Jul", "temp": 23.4 },
    { "city": "Denver", "month": "Aug", "temp": 22.2 },
    { "city": "Denver", "month": "Sep", "temp": 17.4 },
    { "city": "Denver", "month": "Oct", "temp": 10.2 },
    { "city": "Denver", "month": "Nov", "temp": 3.8 },
    { "city": "Denver", "month": "Dec", "temp": -0.9 },
    { "city": "Boston", "month": "Jan", "temp": -1.5 },
    { "city": "Boston", "month": "Feb", "temp": -0.2 },
    { "city": "Boston", "month": "Mar", "temp": 3.6 },
    { "city": "Boston", "month": "Apr", "temp": 9.4 },
    { "city": "Boston", "month": "May", "temp": 14.9 },
    { "city": "Boston", "month": "Jun", "temp": 20.2 },
    { "city": "Boston", "month": "Jul", "temp": 23.4 },
    { "city": "Boston", "month": "Aug", "temp": 22.6 },
    { "city": "Boston", "month": "Sep", "temp": 18.6 },
    { "city": "Boston", "month": "Oct", "temp": 12.4 },
    { "city": "Boston", "month": "Nov", "temp": 6.9 },
    { "city": "Boston", "month": "Dec", "temp": 1.6 },
    { "city": "Anchorage", "month": "Jan", "temp": -8.2 },
    { "city": "Anchorage", "month": "Feb", "temp": -6.4 },
    { "city": "Anchorage", "month": "Mar", "temp": -3.3 },
    { "city": "Anchorage", "month": "Apr", "temp": 2.7 },
    { "city": "Anchorage", "month": "May", "temp": 8.6 },
    { "city": "Anchorage", "month": "Jun", "temp": 13.1 },
    { "city": "Anchorage", "month": "Jul", "temp": 15.1 },
    { "city": "Anchorage", "month": "Aug", "temp": 13.9 },
    { "city": "Anchorage", "month": "Sep", "temp": 9.4 },
    { "city": "Anchorage", "month": "Oct", "temp": 1.6 },
    { "city": "Anchorage", "month": "Nov", "temp": -5.2 },
    { "city": "Anchorage", "month": "Dec", "temp": -7.4 },
    { "city": "Honolulu", "month": "Jan", "temp": 23 },
    { "city": "Honolulu", "month": "Feb", "temp": 23.1 },
    { "city": "Honolulu", "month": "Mar", "temp": 23.7 },
    { "city": "Honolulu", "month": "Apr", "temp": 24.6 },
    { "city": "Honolulu", "month": "May", "temp": 25.6 },
    { "city": "Honolulu", "month": "Jun", "temp": 26.8 },
    { "city": "Honolulu", "month": "Jul", "temp": 27.4 },
    { "city": "Honolulu", "month": "Aug", "temp": 27.9 },
    { "city": "Honolulu", "month": "Sep", "temp": 27.6 },
    { "city": "Honolulu", "month": "Oct", "temp": 26.8 },
    { "city": "Honolulu", "month": "Nov", "temp": 25.3 },
    { "city": "Honolulu", "month": "Dec", "temp": 23.9 }
  ],
  "facet": "city",
  "x": "month",
  "y": "temp",
  "context": true,
  "format": "{value}°",
  "height": 380,
  "title": "Chicago's average monthly temperature ranges from -3.2°C to 24.3°C",
  "subtitle": "Average monthly temperature, °C. Honolulu ranges from 23.0 to 27.9. Grey lines show the other cities.",
  "source": "NOAA climate normals (rounded)",
  "note": "Figures are approximate, for illustration",
  "type": "small-multiples"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `facet` (required) | `string` |  | Field whose values each get a panel. |
| `x` (required) | `string` |  | Time or ordered category field, shared by every panel. |
| `y` (required) | `string \| string[]` |  | Value field, or several (one series each in every panel). |
| `series` | `string` |  | Field that splits rows into series inside each panel (long data). |
| `kind` | `"line" \| "area" \| "bar"` | `"line"` | What each panel draws. Area and bar panels start at zero. |
| `columns` | `number` |  | Preferred number of columns; reduced automatically on narrow containers. |
| `scales` | `"shared" \| "free"` | `"shared"` | Shared value scale across panels, or each panel on its own (say so in the subtitle). |
| `context` | `boolean` | `false` | Draw every other panel's line faintly behind each panel's own. |
| `latest` | `boolean` |  | Print the latest value beside each panel title. Default: on for a single series. |
| `names` | `Record<string, string>` |  | Display names for facet values and series keys. |

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
- Used by: `visual-essay` (template)

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

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/small-multiples.md
- Component reference with every example: https://insightcharts.dev/llms/small-multiples.md
- Registry item: https://insightcharts.dev/r/small-multiples.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/small-multiples.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/small-multiples#example-every-other-line-as-context
- These instructions as plain text: https://insightcharts.dev/agents/atoms/small-multiples/every-other-line-as-context.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
