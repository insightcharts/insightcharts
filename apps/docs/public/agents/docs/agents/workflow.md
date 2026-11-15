# The agent workflow

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Follow these seven steps in order for every figure. Each step lists what to do and what to check before the next one.

| Step | Output |
|---|---|
| 1. Find the fact | One sentence with a number and a period |
| 2. Choose the form | A component name |
| 3. Load the data | `data`, field names, `transform`, `format` |
| 4. Write the text | `title`, `subtitle`, `source`, `note` |
| 5. Highlight and annotate | `highlight`, `annotations` |
| 6. Theme | Nothing, or `theme` and `--ic-*` variables |
| 7. Verify | A typecheck and a look in a browser |

## 1. Find the fact

Do this:

1. Read the rows. Note the columns, the units, the period and the number of rows.
2. Write down the one fact the figure should show, with its number and its period: "Solar's share rose from 2.7% to 5.5% between 2019 and 2023".
3. Compute the number from the rows.
4. If the data has no single fact to state, write a plain label: "Solar and wind share of electricity, 2019 to 2023".
5. If you do not have the data, or do not know what the user wants to show, ask.

Check:

- The number can be found in the rows or computed from them.
- The sentence states no cause and no event that the data does not show.

## 2. Choose the form

Do this:

1. Match the job of the data to a component with the decision table in [Choosing a component](https://insightcharts.dev/docs/agents/choosing).
2. Read the `whenToUse` and `avoid` lines of the candidate. `avoid` names the component to use instead.
3. Check whether a molecule or a template covers the whole job before you lay out atoms by hand.
4. Fetch the component's instructions: `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

These defaults are usually right.

| Job | Component |
|---|---|
| One figure | `big-number` |
| A ranking or a comparison of categories | `bar-chart` |
| A change over time with five or more points | `line-chart` |
| One image to share | an infographic template, or `social-card` |

Check:

- The component name is in the catalogue. Do not invent one.
- The form is not a dual-axis chart, a gauge, a 3D chart or a pie with more than five slices.

## 3. Load the data

Do this:

1. Pass `data`. It accepts row objects, column arrays, CSV text, a URL, `{ url, path, format }`, `{ csv }`, `{ json }`, an Arrow-style table or an async function.
2. Name the fields as strings. Wide data has one column per series: `y={["solar", "wind"]}`. Long data has one row per observation: `y="value" series="source"`.
3. Reshape with `transform`, a JSON step or a list of steps applied in order. The steps are `filter`, `aggregate`, `sort`, `limit`, `top`, `fold`, `pivot`, `bin`, `derive`, `rename`, `select` and `parse`.
4. Set `format`. Use `"compact"`, `"integer"`, `"decimal:2"`, `"signed"`, `"year"`, `"currency:USD"`, `"percent"` for ratios (0.42 prints as 42%), `"percent-raw"` for whole percentages (42 prints as 42%), or a template such as `"{value} kg"`.
5. In Next.js, load on the server with `loadData` from `insightcharts/data` when the source should not be fetched by the browser.

```tsx
import { BarChart } from "insightcharts";

<BarChart
  data="/data/energy.csv"
  transform={[
    { type: "filter", field: "year", value: 2024 },
    { type: "aggregate", groupBy: "source", measures: { twh: { op: "sum", field: "twh" } } },
    { type: "sort", by: "twh", order: "desc" },
  ]}
  x="source"
  y="twh"
  format="compact"
  title="Renewable generation by source, 2024"
/>
```

Check:

- Every field prop names a column that exists after the transform.
- Numbers are numbers. Use a `parse` transform for columns that load as text.
- `"percent"` is used for ratios and `"percent-raw"` for whole percentages.

The full reference is the [data guide](https://insightcharts.dev/docs/data).

## 4. Write the text

Do this on every chart:

1. `title`: the fact from step 1, in one clause, with the number and the period.
2. `subtitle`: the measure, the unit, the population and the period. Example: "Share of electricity generation, 2023".
3. `source`: where the data comes from. Always set it.
4. `note`: caveats. Say so when the data is illustrative.

Check the title against [Writing rules for agents](https://insightcharts.dev/docs/agents/writing):

- One clause. No second half joined with a comma, "and", "but", a colon or a dash.
- The number is in it.
- No metaphor, no dramatic verb, no question, nothing the reader has to work out.

## 5. Highlight and annotate

Do this:

1. Set `highlight` to the one or two entities the title is about. The other series are drawn in grey. The key is a field name in wide data, a `series` value in long data, or a category label on a single-series bar chart.
2. Do not set a colour per series. Colour comes from the theme.
3. Add `annotations` for a date, a threshold or a single value. They are JSON in data coordinates.

```tsx
annotations={[
  { type: "line", axis: "x", value: "2020", label: "Pandemic" },
  { type: "band", axis: "y", from: 40, to: 60, label: "Target range" },
  { type: "point", x: "2023", y: 5.5, label: "5.5% in 2023" },
]}
```

Check:

- The highlighted entity is the one the title names.
- There are at most three annotations.
- Each annotation value matches a value on the chart's axis. On a category axis it is a category name. On a time axis it is an ISO date.
- Each label names the event or gives the value in plain words.

## 6. Theme

Do this:

1. Leave the theme alone unless the user asked for a look. With no configuration a chart follows the page, including dark mode and shadcn/ui variables.
2. For a brand colour, set `--ic-accent` and the other `--ic-*` variables in CSS, or pass partial tokens: `theme={{ accent: "#0f766e" }}`.
3. For a whole look, pass a theme name: `theme="editorial"`. The preset names are `insight`, `shadcn`, `editorial`, `ledger`, `mono`, `earth`, `science`, `poster`.
4. For a poster, pass a poster theme name. They are `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`.
5. To theme a whole section, wrap it in `InsightProvider` with a `theme`.

Check:

- The theme name is spelt exactly. An unknown name falls back to the surrounding theme with no error.
- No hex colour is set on a series.
- Text has enough contrast against the surface after an override.

The full reference is the [theming guide](https://insightcharts.dev/docs/theming).

## 7. Verify

Do this:

1. Run the typecheck. Props are typed, so a misspelt prop is an error in JSX.
2. For a spec, validate it against `https://insightcharts.dev/schema/insight-spec.json`.
3. Open the page in a browser at desktop width, at about 380 pixels wide and in dark mode.
4. Run the review list.

Review list:

- The title is one clause that states one fact with its number and period, or it is a plain label.
- Every number in the text can be found in or computed from the data.
- The subtitle names the measure and the period. There is a source.
- One series is highlighted. The others are grey.
- There is no legend where direct labels already identify the series.
- There are at most three annotations.
- A big number has a comparison, a denominator or a period.
- No label is clipped or overlaps another at either width.
- The chart can be read without hovering.
- In a scroll story, each step changes exactly one thing.
- A poster has a title with its number, a `sources` line, a poster theme and only built-in icon names.

## Compose several figures

| Job | Use |
|---|---|
| Several figures on one subject | A molecule or a template from the catalogue. Otherwise lay atoms out with CSS grid and `minmax(0, 1fr)` columns. |
| Charts that filter each other | Wrap them in `InsightData` with the rows, leave `data` off the charts and set `select` on the charts readers click. Or use `linked-charts`. |
| A sequence of steps | `Scrolly` from `insightcharts`, or the `scrolly-chart` molecule from JSON. Keep the same chart mounted and change one prop per step. |
| A whole page | A template: `executive-brief`, `report-page`, `visual-essay`, `scorecard`, `data-explorer`. |
| A poster | An infographic template, or the `poster` molecule with panels. |

## When no component fits

In order of preference:

1. Use a simpler form. Most unusual requests can be drawn as a ranked bar chart, a line chart with a highlight, or a big number with context.
2. Compose atoms with plain layout.
3. Pass ECharts settings through the `option` prop of a chart. It is merged over the generated option last.
4. Render a raw ECharts option with `Chart` and `Figure` from `insightcharts/core`. See [custom ECharts options](https://insightcharts.dev/docs/escape-hatch).

## Reference

- This page: https://insightcharts.dev/docs/agents/workflow
- These instructions as plain text: https://insightcharts.dev/agents/docs/agents/workflow.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
