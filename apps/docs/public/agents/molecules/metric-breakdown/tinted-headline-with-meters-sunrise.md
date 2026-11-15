# Reproduce the "Tinted headline with meters, sunrise" example of the InsightCharts Metric breakdown

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Tinted headline with meters, sunrise" example of `metric-breakdown` (a molecule) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A headline number with its composition underneath: one segmented bar and a key giving each part's value and share.

Use it when: A total that the reader will immediately want split: a budget by department, revenue by product line, emissions by sector. Two to six parts that add up to the number above them.

Pick something else when: Parts that do not sum to the headline; more than about six parts (use `bar-chart`); composition compared across groups or over time (use `bar-chart` with `stack: "percent"` or `area-chart`).

Instructions for the alternatives: `area-chart` https://insightcharts.dev/agents/atoms/area-chart.md, `bar-chart` https://insightcharts.dev/agents/atoms/bar-chart.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/metric-breakdown
```

The file lands at `components/insightcharts/molecules/metric-breakdown.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { MetricBreakdown } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "dept": "Grocery", "eur": 412000 },
  { "dept": "Household", "eur": 186000 },
  { "dept": "Clothing", "eur": 121000 }
]
```

How the example maps columns to props:

- `name` = `"dept"`. Field naming each part.
- `value` = `"eur"`. Field with each part's value.

With the user's data, keep the props and change the column names.

## 5. The "Tinted headline with meters, sunrise" example

This example sets `theme="sunrise"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { MetricBreakdown } from "insightcharts";

const data = [
  { dept: "Grocery", eur: 412000 },
  { dept: "Household", eur: 186000 },
  { dept: "Clothing", eur: 121000 },
  { dept: "Garden", eur: 75000 },
];

<MetricBreakdown
  theme="sunrise"
  variant="tinted"
  tone={1}
  label="Store revenue, week 50 of 2024"
  delta={0.092}
  deltaLabel="vs week 50 of 2023"
  data={data}
  name="dept"
  value="eur"
  format="currency:EUR"
  display="meters"
  layout="side"
  bar={false}
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "sunrise",
  "variant": "tinted",
  "tone": 1,
  "label": "Store revenue, week 50 of 2024",
  "delta": 0.092,
  "deltaLabel": "vs week 50 of 2023",
  "data": [
    { "dept": "Grocery", "eur": 412000 },
    { "dept": "Household", "eur": 186000 },
    { "dept": "Clothing", "eur": 121000 },
    { "dept": "Garden", "eur": 75000 }
  ],
  "name": "dept",
  "value": "eur",
  "format": "currency:EUR",
  "display": "meters",
  "layout": "side",
  "bar": false,
  "note": "Illustrative data",
  "type": "metric-breakdown"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` (required) | `string` |  | What the headline number measures. |
| `data` | `DataInput` |  | One row per part. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` |  | Applied before the parts are summed. |
| `name` (required) | `string` |  | Field naming each part. |
| `value` (required) | `string` |  | Field with each part's value. |
| `total` | `number \| string` |  | The headline number. Default: the sum of the parts. |
| `context` | `string` |  | The line under the headline number. |
| `delta` | `number \| string` |  | Change in the headline number. Numbers render as signed percentages. |
| `deltaLabel` | `string` |  | What the delta is against. |
| `upIsGood` | `boolean` | `true` | Whether an increase is good news. |
| `size` | `"hero" \| "stat"` | `"stat"` | `hero` when this opens a piece. |
| `show` | `"both" \| "value" \| "share"` | `"both"` | What the key prints beside each part. |
| `sort` | `"none" \| "desc"` | `"none"` | Order parts by size; the bar and the key follow. |
| `names` | `Record<string, string>` |  | Display names for part keys. |
| `format` | `FormatSpec` | `"auto"` | Number format for the headline and the parts. |
| `source` | `string` |  | Shown underneath as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `variant` | `"plain" \| "filled" \| "tinted" \| "with-icon" \| "with-ring" \| "with-trend"` | `"plain"` | How the headline number is dressed: passed to `big-number`. |
| `icon` | `IconInput` |  | Icon for the headline when `variant` is `with-icon`. |
| `tone` | `"neutral" \| "accent" \| "positive" \| "negative" \| number` |  | Tone of a filled or tinted headline. |
| `display` | `"key" \| "inline" \| "meters" \| "tiles"` | `"key"` | How the parts are shown: a list with values and shares, one wrapped line, a `progress-meter` per part scaled to the total, or a `stat-tile` per part. |
| `tileVariant` | `StatTileVariant` | `"progress"` | The tile display when `display` is `tiles`: `progress`, `ring`, `filled`, `tinted`, `plain`... Each tile gets the part's value, the total as `max` and the part's categorical colour. |
| `tileSurface` | `"plain" \| "borderless" \| "filled" \| "tinted" \| "outline-accent"` |  | The ground of each tile when `display` is `tiles`. |
| `layout` | `"stacked" \| "side"` | `"stacked"` | `side` puts the headline left and the parts right from 600px. |
| `columns` | `number` |  | Columns for the key, meters or tiles. Default: by width. |
| `bar` | `boolean` | `true` | Set false to leave out the segmented bar, e.g. with `meters` or `tiles`. |
| `dividers` | `boolean` | `true` | Hairlines between key rows. |
| `density` | `"dense" \| "default" \| "roomy"` | `"default"` | Spacing between the bar, the key rows and the tiles. |
| `frame` | `boolean` |  | Set false to stop a named theme painting its ground. |
| `theme` | `ThemeInput` |  | A theme name such as `"earth"`, or token overrides, passed on to the number and the bar. A named theme paints its own ground. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `big-number` (atom), `segmented-bar` (atom), `progress-meter` (atom), `stat-tile` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each chart inside follows the rules of its own component.
- Every chart inside needs its own `title` that states one fact, or a plain label.
- An icon prop takes a built-in icon name or a `path://` string holding one SVG path. A name that is not built in falls back to another icon, so use only the names in the icons guide.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.
- An icon is decoration. The label beside it must carry the meaning.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/molecules/metric-breakdown.md
- Component reference with every example: https://insightcharts.dev/llms/metric-breakdown.md
- Registry item: https://insightcharts.dev/r/metric-breakdown.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/metric-breakdown.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/metric-breakdown#example-tinted-headline-with-meters-sunrise
- These instructions as plain text: https://insightcharts.dev/agents/molecules/metric-breakdown/tinted-headline-with-meters-sunrise.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
