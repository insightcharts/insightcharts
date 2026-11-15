# Make charts accessible

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: Every chart in the user's project has a title that states its fact, an accurate text alternative, a data table where exact values matter, and readable contrast.

Review and fix the accessibility of InsightCharts components in the user's project. The library supplies the features under "Built in". The steps are what you must do. If the user has not said which pages or charts to review, ask.

## Built in

Do not rebuild these.

- Each chart is exposed as an image (`role="img"`) with a generated description: the chart type and measures, then the main pattern and notable values.
- The title is a heading, the subtitle a paragraph, the legend a labelled list and the source a `<figcaption>`, inside a `<figure>`.
- Series are labelled directly or listed in a legend. Direction has an arrow or a sign as well as a colour.
- The default categorical palette is ordered so that neighbouring colours stay distinguishable under the common colour-vision deficiencies, in light and dark.
- Charts read without hovering. No information is only in a tooltip.
- With a reduced-motion preference, charts draw without transitions. `animate` cannot override this.
- The loading skeleton has `role="status"`. Load errors have `role="alert"`. An empty dataset shows "No data to show."
- `Scrolly` keeps all step text in the document and makes every step reachable by keyboard.

## Steps

1. Write each `title` as one plain statement of the main fact with its number and period. A reader who cannot see the chart then still gets the fact.
2. Read the generated description of each chart: it is the `aria-label` of the element with `data-slot="ic-chart"`. If the title states a different fact from the description, pass your own `alt`.
3. Write `alt` in this order: the chart type and measures, then the main pattern, then the notable values.
4. Add `table` to every chart whose exact figures a reader may need. It adds a collapsible "View data" table with the rows the chart drew.
5. For a dataset over 200 rows, also add `exportable={["csv"]}`. The table shows the first 200 rows.
6. If you changed `ink`, `inkSecondary`, `muted` or `surface`, check the contrast of each text colour against `surface`: at least 4.5:1.
7. If you replaced `categorical`, test neighbouring colours with a colour-vision simulator. Otherwise keep the default order.
8. If the interface depends on click filtering (`select`), offer the same filters as ordinary buttons or a `<select>`. See "Known limits".
9. For a raw `Chart` from `insightcharts/core`, always pass `alt`. It has no generated description.
10. Give an `Icon` that carries meaning a `title`.

## Props

| Prop | On | Purpose |
|---|---|---|
| `alt` | every chart, and `Chart` | Replaces the generated description. |
| `table` | every chart | Adds the "View data" table. |
| `exportable` | every chart | Adds the export menu. CSV and JSON hold the rows the chart drew. |
| `title`, `subtitle`, `source` | every chart | Rendered as HTML text, read in order. |
| `animate` | every chart, `InsightProvider` | `false` turns animation off for everyone. |

HTML components such as `big-number` and `callout` render as text and take no `alt`.

## Minimal example

```tsx
import { BarChart } from "insightcharts";

const signups = [
  { channel: "Search", signups: 420 },
  { channel: "Referral", signups: 310 },
  { channel: "Social", signups: 180 },
  { channel: "Email", signups: 95 },
];

export function SignupsByChannel() {
  return (
    <BarChart
      data={signups}
      x="channel"
      y="signups"
      title="Search brought in 420 signups in May 2025"
      subtitle="New accounts in May 2025, by channel"
      source="Product database"
      table
      alt="Bar chart of signups by channel in May 2025. Search leads with 420, followed by referral with 310, social with 180 and email with 95."
    />
  );
}
```

## Known limits

Tell the user about these when they affect the work.

- Marks inside a chart are not individually focusable. Keyboard and screen-reader users get the description and the data table.
- Click selection (`select`) is pointer-only. To filter from your own controls, read the store with `useInsightData()` inside `InsightData` and call `store.select(owner, { field, values })` or `store.clear()`.
- The "View data" table shows the first 200 rows.

## Verify

1. Inspect the DOM: one `<figure>` per chart, a heading for the title, `role="img"` with an `aria-label` on the plot.
2. Read each `aria-label`. It must name the chart type, the measure and the main values, and agree with the title.
3. Tab through the page. The "View data" control and the export menu must be reachable and operable from the keyboard.
4. Turn on the reduced-motion preference and reload. Charts must draw without transitions.
5. Check text contrast in light and dark mode.
6. Check at about 380px wide that no label is clipped.

## Common mistakes

- An `alt` that only names the chart: "Bar chart of signups by channel". State the pattern and the values.
- A title that is a topic label when the data has one clear fact.
- Text coloured with a series colour. Text uses `ink`, `inkSecondary` or `muted`.
- Meaning carried by colour alone after a palette change.
- Filtering that works only by clicking marks.
- Setting `alt` on an HTML component such as `big-number`. It has no such prop.

## Reference

- This page: https://insightcharts.dev/docs/accessibility
- These instructions as plain text: https://insightcharts.dev/agents/docs/accessibility.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
