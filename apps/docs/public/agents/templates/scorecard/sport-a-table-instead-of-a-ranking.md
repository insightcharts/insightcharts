# Reproduce the "Sport: a table instead of a ranking" example of the InsightCharts Scorecard

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Sport: a table instead of a ranking" example of `scorecard` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A recurring report. It has a masthead with the report name and period, a headline that states the main change, a KPI grid with changes and sparklines, a ranked list beside one or two trend charts, an optional comparison table, short notes and a source note.

Use it when: Use it for weekly or monthly numbers. Keep the layout the same in every edition so readers know where each number is. Change the headline each edition to state the main change with its number. The headline and the KPI row should be enough for a reader who stops there. The ranking, trends and notes add detail. Highlight the one row or series the headline is about and leave the rest grey.

Pick something else when: A one-off finding (use `executive-brief`). Readers who need to filter the data themselves (use `data-explorer`). More than six KPIs.

Instructions for the alternatives: `executive-brief` https://insightcharts.dev/agents/templates/executive-brief.md, `data-explorer` https://insightcharts.dev/agents/templates/data-explorer.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/scorecard
```

The file lands at `components/insightcharts/templates/scorecard.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { Scorecard } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Sport: a table instead of a ranking" example

This example sets `theme="blueprint"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { LineChart, Scorecard } from "insightcharts";

<Scorecard
  theme="blueprint"
  kicker="Harbour City FC · first-team report"
  reportPeriod="After 19 of 38 matches"
  title="Harbour City are second with 36 points after 19 matches"
  deck="That is 10 points more than at the same stage last season. Goals conceded fell from 1.67 a match in August to 0.60 in December."
  kpis={{
    data: [
      { month: "August", ppg: 1.33, gf: 1, ga: 1.67, xgd: -0.21 },
      { month: "September", ppg: 1.5, gf: 1.25, ga: 1.25, xgd: 0.05 },
      { month: "October", ppg: 2, gf: 1.75, ga: 1, xgd: 0.42 },
      { month: "November", ppg: 2.25, gf: 2, ga: 0.75, xgd: 0.71 },
      { month: "December", ppg: 2.4, gf: 2.2, ga: 0.6, xgd: 0.88 },
    ],
    x: "month",
    compare: "first",
    change: "absolute",
    columns: 4,
    metrics: [
      {
        variant: "dots",
        y: "ppg",
        label: "Points per match",
        format: "decimal:2",
        deltaLabel: "vs August",
      },
      {
        variant: "dots",
        y: "gf",
        label: "Goals scored per match",
        format: "decimal:2",
        deltaLabel: "vs August",
      },
      {
        variant: "dots",
        y: "ga",
        label: "Goals conceded per match",
        format: "decimal:2",
        upIsGood: false,
        deltaLabel: "vs August",
      },
      {
        variant: "dots",
        y: "xgd",
        label: "Expected goal difference per match",
        format: { signDisplay: "exceptZero", maximumFractionDigits: 2 },
        deltaLabel: "vs August",
      },
    ],
  }}
  trends={[
    <LineChart
      data={[
        { match: "1", "2024/25": 0, "2023/24": 1 },
        { match: "2", "2024/25": 1, "2023/24": 4 },
        { match: "3", "2024/25": 1, "2023/24": 4 },
        { match: "4", "2024/25": 4, "2023/24": 5 },
        { match: "5", "2024/25": 5, "2023/24": 6 },
        { match: "6", "2024/25": 8, "2023/24": 9 },
        { match: "7", "2024/25": 9, "2023/24": 9 },
        { match: "8", "2024/25": 12, "2023/24": 10 },
        { match: "9", "2024/25": 13, "2023/24": 13 },
        { match: "10", "2024/25": 16, "2023/24": 14 },
        { match: "11", "2024/25": 19, "2023/24": 14 },
        { match: "12", "2024/25": 20, "2023/24": 17 },
        { match: "13", "2024/25": 23, "2023/24": 18 },
        { match: "14", "2024/25": 26, "2023/24": 18 },
        { match: "15", "2024/25": 27, "2023/24": 21 },
        { match: "16", "2024/25": 30, "2023/24": 22 },
        { match: "17", "2024/25": 33, "2023/24": 22 },
        { match: "18", "2024/25": 33, "2023/24": 25 },
        { match: "19", "2024/25": 36, "2023/24": 26 },
      ]}
      x="match"
      y={["2024/25", "2023/24"]}
      highlight="2024/25"
      contextLabels
      zero
      height={280}
      title="Harbour City have 36 points after 19 matches, against 26 last season"
      subtitle="Cumulative league points by match played"
      annotations={[{ type: "line", axis: "x", value: "8", label: "Back three introduced" }]}
    />,
  ]}
  table={{
    data: [
      { team: "Northfield", played: 19, gd: 21, points: 41, f1: 3, f2: 3, f3: 1, f4: 3, f5: 0 },
      { team: "Harbour City", played: 19, gd: 14, points: 36, f1: 3, f2: 3, f3: 3, f4: 1, f5: 3 },
      { team: "Easton Vale", played: 19, gd: 12, points: 35, f1: 1, f2: 0, f3: 3, f4: 1, f5: 1 },
      { team: "Calder Rovers", played: 19, gd: 9, points: 33, f1: 0, f2: 3, f3: 1, f4: 0, f5: 3 },
      { team: "Westmoor", played: 19, gd: 3, points: 31, f1: 3, f2: 1, f3: 0, f4: 1, f5: 1 },
      { team: "St Olave's", played: 19, gd: 1, points: 29, f1: 1, f2: 1, f3: 0, f4: 3, f5: 0 },
    ],
    title: "Harbour City are 5 points behind Northfield",
    subtitle: "League table, top six, with points from each of the last five matches",
    highlight: "Harbour City",
    columns: [
      { key: "team", label: "Team" },
      { key: "played", label: "Played", hideBelow: 520 },
      { key: "gd", label: "Goal difference", format: "signed", hideBelow: 420 },
      {
        key: "form",
        label: "Last five",
        kind: "sparkline",
        mark: "bar",
        fields: ["f1", "f2", "f3", "f4", "f5"],
      },
      { key: "points", label: "Points", kind: "bar", format: "integer" },
    ],
  }}
  notes={[
    "Harbour City took 13 points from the last five matches. Northfield took 10.",
    "Expected goal difference rose from −0.21 a match in August to +0.88 in December.",
  ]}
  sources="Club performance analysis"
  note="Illustrative data. The clubs are fictional."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "blueprint",
  "kicker": "Harbour City FC · first-team report",
  "reportPeriod": "After 19 of 38 matches",
  "title": "Harbour City are second with 36 points after 19 matches",
  "deck": "That is 10 points more than at the same stage last season. Goals conceded fell from 1.67 a match in August to 0.60 in December.",
  "kpis": {
    "data": [
      { "month": "August", "ppg": 1.33, "gf": 1, "ga": 1.67, "xgd": -0.21 },
      { "month": "September", "ppg": 1.5, "gf": 1.25, "ga": 1.25, "xgd": 0.05 },
      { "month": "October", "ppg": 2, "gf": 1.75, "ga": 1, "xgd": 0.42 },
      { "month": "November", "ppg": 2.25, "gf": 2, "ga": 0.75, "xgd": 0.71 },
      { "month": "December", "ppg": 2.4, "gf": 2.2, "ga": 0.6, "xgd": 0.88 }
    ],
    "x": "month",
    "compare": "first",
    "change": "absolute",
    "columns": 4,
    "metrics": [
      {
        "variant": "dots",
        "y": "ppg",
        "label": "Points per match",
        "format": "decimal:2",
        "deltaLabel": "vs August"
      },
      {
        "variant": "dots",
        "y": "gf",
        "label": "Goals scored per match",
        "format": "decimal:2",
        "deltaLabel": "vs August"
      },
      {
        "variant": "dots",
        "y": "ga",
        "label": "Goals conceded per match",
        "format": "decimal:2",
        "upIsGood": false,
        "deltaLabel": "vs August"
      },
      {
        "variant": "dots",
        "y": "xgd",
        "label": "Expected goal difference per match",
        "format": { "signDisplay": "exceptZero", "maximumFractionDigits": 2 },
        "deltaLabel": "vs August"
      }
    ]
  },
  "trends": [
    {
      "type": "line-chart",
      "data": [
        { "match": "1", "2024/25": 0, "2023/24": 1 },
        { "match": "2", "2024/25": 1, "2023/24": 4 },
        { "match": "3", "2024/25": 1, "2023/24": 4 },
        { "match": "4", "2024/25": 4, "2023/24": 5 },
        { "match": "5", "2024/25": 5, "2023/24": 6 },
        { "match": "6", "2024/25": 8, "2023/24": 9 },
        { "match": "7", "2024/25": 9, "2023/24": 9 },
        { "match": "8", "2024/25": 12, "2023/24": 10 },
        { "match": "9", "2024/25": 13, "2023/24": 13 },
        { "match": "10", "2024/25": 16, "2023/24": 14 },
        { "match": "11", "2024/25": 19, "2023/24": 14 },
        { "match": "12", "2024/25": 20, "2023/24": 17 },
        { "match": "13", "2024/25": 23, "2023/24": 18 },
        { "match": "14", "2024/25": 26, "2023/24": 18 },
        { "match": "15", "2024/25": 27, "2023/24": 21 },
        { "match": "16", "2024/25": 30, "2023/24": 22 },
        { "match": "17", "2024/25": 33, "2023/24": 22 },
        { "match": "18", "2024/25": 33, "2023/24": 25 },
        { "match": "19", "2024/25": 36, "2023/24": 26 }
      ],
      "x": "match",
      "y": ["2024/25", "2023/24"],
      "highlight": "2024/25",
      "contextLabels": true,
      "zero": true,
      "height": 280,
      "title": "Harbour City have 36 points after 19 matches, against 26 last season",
      "subtitle": "Cumulative league points by match played",
      "annotations": [{ "type": "line", "axis": "x", "value": "8", "label": "Back three introduced" }]
    }
  ],
  "table": {
    "data": [
      {
        "team": "Northfield",
        "played": 19,
        "gd": 21,
        "points": 41,
        "f1": 3,
        "f2": 3,
        "f3": 1,
        "f4": 3,
        "f5": 0
      },
      {
        "team": "Harbour City",
        "played": 19,
        "gd": 14,
        "points": 36,
        "f1": 3,
        "f2": 3,
        "f3": 3,
        "f4": 1,
        "f5": 3
      },
      {
        "team": "Easton Vale",
        "played": 19,
        "gd": 12,
        "points": 35,
        "f1": 1,
        "f2": 0,
        "f3": 3,
        "f4": 1,
        "f5": 1
      },
      {
        "team": "Calder Rovers",
        "played": 19,
        "gd": 9,
        "points": 33,
        "f1": 0,
        "f2": 3,
        "f3": 1,
        "f4": 0,
        "f5": 3
      },
      {
        "team": "Westmoor",
        "played": 19,
        "gd": 3,
        "points": 31,
        "f1": 3,
        "f2": 1,
        "f3": 0,
        "f4": 1,
        "f5": 1
      },
      {
        "team": "St Olave's",
        "played": 19,
        "gd": 1,
        "points": 29,
        "f1": 1,
        "f2": 1,
        "f3": 0,
        "f4": 3,
        "f5": 0
      }
    ],
    "title": "Harbour City are 5 points behind Northfield",
    "subtitle": "League table, top six, with points from each of the last five matches",
    "highlight": "Harbour City",
    "columns": [
      { "key": "team", "label": "Team" },
      { "key": "played", "label": "Played", "hideBelow": 520 },
      { "key": "gd", "label": "Goal difference", "format": "signed", "hideBelow": 420 },
      {
        "key": "form",
        "label": "Last five",
        "kind": "sparkline",
        "mark": "bar",
        "fields": ["f1", "f2", "f3", "f4", "f5"]
      },
      { "key": "points", "label": "Points", "kind": "bar", "format": "integer" }
    ]
  },
  "notes": [
    "Harbour City took 13 points from the last five matches. Northfield took 10.",
    "Expected goal difference rose from −0.21 a match in August to +0.88 in December."
  ],
  "sources": "Club performance analysis",
  "note": "Illustrative data. The clubs are fictional.",
  "type": "scorecard"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `kpis`, `{ data, x, metrics, compare?, change?, columns? }`: The headline metrics: the props of `kpi-grid`. One time-ordered dataset, one card per metric. In the example: a config with 5 rows of `data` and the fields `x: "month"`.
- `ranking`, `{ data, name, value, change?, highlight?, title?, ... } | Slot`: A ranking: the props of `ranked-list`, or any spec or element. Not used in the example.
- `trends`, `Slot[]`: One or two trend exhibits, shown beside the ranking in wide containers. In the example: 1 item: a `line-chart` spec with 19 rows.
- `table`, `{ data, columns, highlight?, sort?, title?, ... } | Slot`: A comparison across entities: the props of `comparison-table`, or any spec or element. In the example: a config with 6 rows of `data`.
- `notes`, `(string | { title, text? })[]`: Short notes on what changed in the period. Each states one fact with its number. In the example: 2 items: text.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The main change this period, as one plain sentence with the number in it. |
| `kicker` | `string` |  | The name of the report, e.g. "Store scorecard". Shown in the masthead. |
| `reportPeriod` | `string` |  | The period reported, e.g. "October 2024". Shown opposite the report name. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. |
| `kpis` | `{ data, x, metrics, compare?, change?, columns? }` |  | The headline metrics: the props of `kpi-grid`. One time-ordered dataset, one card per metric. |
| `ranking` | `{ data, name, value, change?, highlight?, title?, ... } \| Slot` |  | A ranking: the props of `ranked-list`, or any spec or element. |
| `trends` | `Slot[]` |  | One or two trend exhibits, shown beside the ranking in wide containers. |
| `table` | `{ data, columns, highlight?, sort?, title?, ... } \| Slot` |  | A comparison across entities: the props of `comparison-table`, or any spec or element. |
| `notes` | `(string \| { title, text? })[]` |  | Short notes on what changed in the period. Each states one fact with its number. |
| `notesTitle` | `string` | `"Notes"` | Heading of the notes. |
| `sources` | `string \| { name, url? } \| (string \| { name, url? })[]` |  | Where the data comes from, shown in the closing source note. Entries with a `url` are linked. |
| `period` | `string` |  | The period the data covers. |
| `method` | `string` |  | How the numbers were produced: definitions, adjustments, exclusions. |
| `note` | `string` |  | Caveats the reader should know, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the piece. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Heading level of the title; section headings follow one level down. |
| `maxWidth` | `number \| string` |  | Widest the piece may get. It is centred in wider containers. |
| `theme` | `ThemeInput` |  | A built-in theme name (`"editorial"`, `"ledger"`, `"noir"`...) or a theme object, passed on to everything inside. A named theme with its own surface paints that surface behind the whole piece. |
| `frame` | `boolean` |  | Paint the theme's surface behind the piece, with page padding. Default: on when `theme` is a named theme with its own surface. Set false when the host already paints it. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to everything inside. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `headline` (atom), `kpi-grid` (molecule), `ranked-list` (molecule), `comparison-table` (molecule), `prose` (atom), `source-note` (atom), `line-chart` (atom), `bar-chart` (atom), `bullet-chart` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each chart inside follows the rules of its own component.
- Every chart inside needs its own `title` that states one fact, or a plain label.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Set `level` to the heading level that fits the page outline.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `sources` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/scorecard.md
- Component reference with every example: https://insightcharts.dev/llms/scorecard.md
- Registry item: https://insightcharts.dev/r/scorecard.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/scorecard.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/scorecard#example-sport-a-table-instead-of-a-ranking
- These instructions as plain text: https://insightcharts.dev/agents/templates/scorecard/sport-a-table-instead-of-a-ranking.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
