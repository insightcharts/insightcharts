# Reproduce the "Rings and a hero card, ocean" example of the InsightCharts KPI grid

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Rings and a hero card, ocean" example of `kpi-grid` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A responsive grid of trend cards drawn from one dataset: each metric shows its latest value, its change and a graphic, in one `stat-tile` variant or a deliberate mix of them.

Use it when: The top of a dashboard or a monthly report: three to eight metrics tracked over the same periods. Pass one table with a column per metric.

Pick something else when: Figures without a series behind them (use `stat-row`); comparing the metrics with each other on one scale (use `line-chart` or `small-multiples`); more than eight cards.

Instructions for the alternatives: `small-multiples` https://insightcharts.dev/agents/atoms/small-multiples.md, `line-chart` https://insightcharts.dev/agents/atoms/line-chart.md, `stat-row` https://insightcharts.dev/agents/molecules/stat-row.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/kpi-grid
```

The file lands at `components/insightcharts/molecules/kpi-grid.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { KpiGrid } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "year": "2017", "gw": 2.1, "farms": 3, "protectedShare": 0.031 },
  { "year": "2018", "gw": 3.4, "farms": 5, "protectedShare": 0.038 },
  { "year": "2019", "gw": 5, "farms": 8, "protectedShare": 0.044 }
]
```

How the example maps columns to props:

- `x` = `"year"`. Period field shared by every metric.

With the user's data, keep the props and change the column names.

## 5. The "Rings and a hero card, ocean" example

This example sets `theme="ocean"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { KpiGrid } from "insightcharts";

const data = [
  { year: "2017", gw: 2.1, farms: 3, protectedShare: 0.031 },
  { year: "2018", gw: 3.4, farms: 5, protectedShare: 0.038 },
  { year: "2019", gw: 5, farms: 8, protectedShare: 0.044 },
  { year: "2020", gw: 7.9, farms: 12, protectedShare: 0.052 },
  { year: "2021", gw: 11.2, farms: 17, protectedShare: 0.061 },
  { year: "2022", gw: 14.8, farms: 23, protectedShare: 0.069 },
  { year: "2023", gw: 19.6, farms: 31, protectedShare: 0.076 },
  { year: "2024", gw: 26.3, farms: 45, protectedShare: 0.083 },
];

<KpiGrid
  theme="ocean"
  title="Offshore wind capacity reached 26.3 GW in 2024"
  data={data}
  x="year"
  compare="previous"
  featured
  variants={["area", "ring", "ring"]}
  metrics={[
    { y: "gw", label: "Offshore wind capacity", format: "{value} GW" },
    { y: "farms", label: "Wind farms connected", max: 60, context: "60 are planned by 2026" },
    {
      y: "protectedShare",
      label: "Sea area protected",
      format: "percent",
      change: "absolute",
      max: 0.3,
      context: "The 2030 target is 30%",
    },
  ]}
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "ocean",
  "title": "Offshore wind capacity reached 26.3 GW in 2024",
  "data": [
    { "year": "2017", "gw": 2.1, "farms": 3, "protectedShare": 0.031 },
    { "year": "2018", "gw": 3.4, "farms": 5, "protectedShare": 0.038 },
    { "year": "2019", "gw": 5, "farms": 8, "protectedShare": 0.044 },
    { "year": "2020", "gw": 7.9, "farms": 12, "protectedShare": 0.052 },
    { "year": "2021", "gw": 11.2, "farms": 17, "protectedShare": 0.061 },
    { "year": "2022", "gw": 14.8, "farms": 23, "protectedShare": 0.069 },
    { "year": "2023", "gw": 19.6, "farms": 31, "protectedShare": 0.076 },
    { "year": "2024", "gw": 26.3, "farms": 45, "protectedShare": 0.083 }
  ],
  "x": "year",
  "compare": "previous",
  "featured": true,
  "variants": ["area", "ring", "ring"],
  "metrics": [
    { "y": "gw", "label": "Offshore wind capacity", "format": "{value} GW" },
    {
      "y": "farms",
      "label": "Wind farms connected",
      "max": 60,
      "context": "60 are planned by 2026"
    },
    {
      "y": "protectedShare",
      "label": "Sea area protected",
      "format": "percent",
      "change": "absolute",
      "max": 0.3,
      "context": "The 2030 target is 30%"
    }
  ],
  "note": "Illustrative data",
  "type": "kpi-grid"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `metrics` (required), `{ y, label, format?, upIsGood?, compare?, change?, deltaFormat?, deltaLabel?, context?, value?, delta?, kind?, variant?, surface?, tone?, size?, align?, orientation?, icon?, target?, targetLabel?, max?, parts?, rank?, rankOf?, unitValue?, showTrend? }[]`: One card per metric; each takes the props of `trend-card`, including its own `variant`, `surface`, `tone` and `size`. In the example: 3 items: an object with `y`, `label`, `format`; an object with `y`, `label`, `max`, `context`; an object with `y`, `label`, `format`, `change`, `max`, `context`.
- `variants`, `StatTileVariant[]`: A display per card, by position, so one grid mixes them on purpose: `["split", "area", "bars", "progress"]`. A metric's own `variant` wins; cards past the end use `variant`. In the example: 3 items: `"area"`; `"ring"`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DataInput` |  | One dataset in time order: a row per period, a column per metric. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` |  | Applied once, before the cards read the rows. |
| `x` | `string` |  | Period field shared by every metric. |
| `metrics` (required) | `{ y, label, format?, upIsGood?, compare?, change?, deltaFormat?, deltaLabel?, context?, value?, delta?, kind?, variant?, surface?, tone?, size?, align?, orientation?, icon?, target?, targetLabel?, max?, parts?, rank?, rankOf?, unitValue?, showTrend? }[]` |  | One card per metric; each takes the props of `trend-card`, including its own `variant`, `surface`, `tone` and `size`. |
| `variant` | `StatTileVariant` |  | The display of every card: any `stat-tile` variant (`sparkline`, `area`, `bars`, `dots`, `split`, `compact`, `progress`, `ring`, `comparison`, `delta-first`, `icon`, `breakdown`, `rank`, `hero`, `filled`, `tinted`, `borderless`, `outline-accent`). Omit for the original cards with an interactive sparkline. |
| `variants` | `StatTileVariant[]` |  | A display per card, by position, so one grid mixes them on purpose: `["split", "area", "bars", "progress"]`. A metric's own `variant` wins; cards past the end use `variant`. |
| `surface` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent"` |  | The ground of every card. |
| `tone` | `"neutral" \| "accent" \| "positive" \| "negative" \| number \| "series"` |  | Tone of every card. `series` gives each card the next categorical colour. |
| `layout` | `"cards" \| "dividers"` | `"cards"` | Separate cards, or open tiles with hairlines between them. |
| `featured` | `boolean` | `false` | The first card spans two columns and is set one size larger. |
| `density` | `"dense" \| "default" \| "roomy"` | `"default"` | Spacing and type scale: cards are `sm`, `md` or `lg`, with 8, 12 or 16px between them. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |
| `compare` | `"first" \| "previous" \| number` | `"first"` | Baseline for every card's change; a metric can override it. |
| `change` | `"percent" \| "absolute"` | `"percent"` | Relative change, or the difference between the two values; a metric can override it. An absolute change of a percentage metric is shown in percentage points ("−2.1 pts"). |
| `deltaFormat` | `FormatSpec` |  | Format for absolute changes, e.g. `"{value} pp"` or `"signed"`; a metric can override it. Default: points for percentage formats, otherwise the metric's own `format`. |
| `columns` | `number` |  | Preferred columns. Default: up to four, reduced to fit cards of at least 200px. |
| `title` | `string` |  | The main fact with its number, or a plain label. |
| `subtitle` | `string` |  | Population and period. |
| `source` | `string` |  | Shown under the grid as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | A theme name such as `"ledger"`, or token overrides, passed on to every card. A named theme paints its own ground. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `trend-card` (molecule), `stat-tile` (atom)
- Used by: `scorecard` (template)

## Rules for this form

- Each chart inside follows the rules of its own component.
- Every chart inside needs its own `title` that states one fact, or a plain label.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/kpi-grid.md
- Component reference with every example: https://insightcharts.dev/llms/kpi-grid.md
- Registry item: https://insightcharts.dev/r/kpi-grid.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/kpi-grid.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/kpi-grid#example-rings-and-a-hero-card-ocean
- These instructions as plain text: https://insightcharts.dev/agents/molecules/kpi-grid/rings-and-a-hero-card-ocean.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
