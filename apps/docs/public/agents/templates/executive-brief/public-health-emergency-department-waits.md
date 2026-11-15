# Reproduce the "Public health: emergency department waits" example of the InsightCharts Executive brief

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Public health: emergency department waits" example of `executive-brief` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A one-page summary. It has a headline that states the main finding with its number, a deck, a row of three or four key figures, one hero chart with a takeaway callout, two smaller supporting exhibits, a short list of actions and a source note.

Use it when: Use it when a decision-maker will spend about a minute on the page. State the main finding with its number and period in the headline. The headline and the hero chart should be enough for a reader who stops there. The figures, supporting exhibits and actions add detail. Use one accent colour for the subject (`highlight`) and leave everything else grey. Mark the cause on the hero as an annotation. The proportions suit a printed page.

Pick something else when: More than one hero or more than three supporting exhibits (use `report-page`). A recurring set of numbers with no single finding (use `scorecard`). A story told in several steps (use `visual-essay`).

Instructions for the alternatives: `visual-essay` https://insightcharts.dev/agents/templates/visual-essay.md, `report-page` https://insightcharts.dev/agents/templates/report-page.md, `scorecard` https://insightcharts.dev/agents/templates/scorecard.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/executive-brief
```

The file lands at `components/insightcharts/templates/executive-brief.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ExecutiveBrief } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Public health: emergency department waits" example

This example sets `theme="science"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BarChart, DumbbellChart, ExecutiveBrief, LineChart } from "insightcharts";

<ExecutiveBrief
  theme="science"
  kicker="Urgent care board · December 2024"
  title="78.6% of emergency patients were seen within four hours in December 2024"
  deck="The share was 71.2% in January. St Anne's opened a same-day assessment unit in September. Its four-hour performance rose from 68% to 81%."
  date="2025-01-09"
  figures={{
    variant: "tiles",
    items: [
      {
        variant: "icon",
        icon: "hospital",
        value: "78.6%",
        label: "Seen within four hours, December",
        delta: "+7.4 pts",
        deltaLabel: "vs January",
      },
      {
        variant: "icon",
        icon: "clock",
        value: "4h 50m",
        label: "Median time in department for admitted patients",
        delta: "−38 min",
        deltaLabel: "vs January",
        upIsGood: false,
      },
      {
        variant: "icon",
        icon: "person",
        value: 412,
        label: "Waits over twelve hours",
        delta: -0.31,
        deltaLabel: "vs January",
        upIsGood: false,
      },
    ],
  }}
  hero={<LineChart
    data={[
      { month: "2024-01-01", within: 71.2 },
      { month: "2024-02-01", within: 70.4 },
      { month: "2024-03-01", within: 69.8 },
      { month: "2024-04-01", within: 70.9 },
      { month: "2024-05-01", within: 72.3 },
      { month: "2024-06-01", within: 73 },
      { month: "2024-07-01", within: 72.1 },
      { month: "2024-08-01", within: 71.6 },
      { month: "2024-09-01", within: 73.4 },
      { month: "2024-10-01", within: 75.8 },
      { month: "2024-11-01", within: 77.9 },
      { month: "2024-12-01", within: 78.6 },
    ]}
    x="month"
    y="within"
    format="{value}%"
    title="Four-hour performance rose from 73.4% in September to 78.6% in December"
    subtitle="Share of emergency attendances admitted, transferred or discharged within four hours, all sites, 2024"
    annotations={[
      { type: "line", axis: "x", value: "2024-09-01", label: "Assessment unit opens" },
      { type: "line", axis: "y", value: 78, label: "National standard, 78%" },
    ]}
  />}
  takeaway={{
    lead: "The 78% national standard was met in December",
    body: "Performance was 77.9% in November and 78.6% in December. It was between 69.8% and 73.4% from January to September.",
    tone: "positive",
  }}
  supporting={[
    <DumbbellChart
      data={[
        { site: "St Anne's", before: 68, after: 81 },
        { site: "Riverside", before: 72, after: 79 },
        { site: "Northgate", before: 74, after: 76 },
        { site: "Queen Mary", before: 70, after: 71 },
      ]}
      category="site"
      from="before"
      to="after"
      names={{ before: "Jan to Aug", after: "Sep to Dec" }}
      format="{value}%"
      sort="gap"
      highlight="St Anne's"
      title="St Anne's rose from 68% to 81% after its unit opened"
      subtitle="Four-hour performance by site, before and after September"
    />,
    <BarChart
      data={[
        { stage: "Arrival to triage", minutes: 14 },
        { stage: "Triage to clinician", minutes: 68 },
        { stage: "Tests and decision", minutes: 87 },
        { stage: "Waiting for a bed", minutes: 121 },
      ]}
      x="stage"
      y="minutes"
      sort="none"
      orientation="horizontal"
      format="{value} min"
      highlight="Waiting for a bed"
      title="Admitted patients waited a median of 121 minutes for a bed"
      subtitle="Median minutes per stage, admitted patients, Q4 2024"
    />,
  ]}
  actions={[
    "Open a same-day assessment unit at Riverside",
    "Fund weekend discharge teams to cut the 121-minute wait for a bed",
    "Report four-hour performance separately for each of the four sites",
  ]}
  sources="Trust emergency care dataset"
  period="January to December 2024"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "science",
  "kicker": "Urgent care board · December 2024",
  "title": "78.6% of emergency patients were seen within four hours in December 2024",
  "deck": "The share was 71.2% in January. St Anne's opened a same-day assessment unit in September. Its four-hour performance rose from 68% to 81%.",
  "date": "2025-01-09",
  "figures": {
    "variant": "tiles",
    "items": [
      {
        "variant": "icon",
        "icon": "hospital",
        "value": "78.6%",
        "label": "Seen within four hours, December",
        "delta": "+7.4 pts",
        "deltaLabel": "vs January"
      },
      {
        "variant": "icon",
        "icon": "clock",
        "value": "4h 50m",
        "label": "Median time in department for admitted patients",
        "delta": "−38 min",
        "deltaLabel": "vs January",
        "upIsGood": false
      },
      {
        "variant": "icon",
        "icon": "person",
        "value": 412,
        "label": "Waits over twelve hours",
        "delta": -0.31,
        "deltaLabel": "vs January",
        "upIsGood": false
      }
    ]
  },
  "hero": {
    "type": "line-chart",
    "data": [
      { "month": "2024-01-01", "within": 71.2 },
      { "month": "2024-02-01", "within": 70.4 },
      { "month": "2024-03-01", "within": 69.8 },
      { "month": "2024-04-01", "within": 70.9 },
      { "month": "2024-05-01", "within": 72.3 },
      { "month": "2024-06-01", "within": 73 },
      { "month": "2024-07-01", "within": 72.1 },
      { "month": "2024-08-01", "within": 71.6 },
      { "month": "2024-09-01", "within": 73.4 },
      { "month": "2024-10-01", "within": 75.8 },
      { "month": "2024-11-01", "within": 77.9 },
      { "month": "2024-12-01", "within": 78.6 }
    ],
    "x": "month",
    "y": "within",
    "format": "{value}%",
    "title": "Four-hour performance rose from 73.4% in September to 78.6% in December",
    "subtitle": "Share of emergency attendances admitted, transferred or discharged within four hours, all sites, 2024",
    "annotations": [
      { "type": "line", "axis": "x", "value": "2024-09-01", "label": "Assessment unit opens" },
      { "type": "line", "axis": "y", "value": 78, "label": "National standard, 78%" }
    ]
  },
  "takeaway": {
    "lead": "The 78% national standard was met in December",
    "body": "Performance was 77.9% in November and 78.6% in December. It was between 69.8% and 73.4% from January to September.",
    "tone": "positive"
  },
  "supporting": [
    {
      "type": "dumbbell-chart",
      "data": [
        { "site": "St Anne's", "before": 68, "after": 81 },
        { "site": "Riverside", "before": 72, "after": 79 },
        { "site": "Northgate", "before": 74, "after": 76 },
        { "site": "Queen Mary", "before": 70, "after": 71 }
      ],
      "category": "site",
      "from": "before",
      "to": "after",
      "names": { "before": "Jan to Aug", "after": "Sep to Dec" },
      "format": "{value}%",
      "sort": "gap",
      "highlight": "St Anne's",
      "title": "St Anne's rose from 68% to 81% after its unit opened",
      "subtitle": "Four-hour performance by site, before and after September"
    },
    {
      "type": "bar-chart",
      "data": [
        { "stage": "Arrival to triage", "minutes": 14 },
        { "stage": "Triage to clinician", "minutes": 68 },
        { "stage": "Tests and decision", "minutes": 87 },
        { "stage": "Waiting for a bed", "minutes": 121 }
      ],
      "x": "stage",
      "y": "minutes",
      "sort": "none",
      "orientation": "horizontal",
      "format": "{value} min",
      "highlight": "Waiting for a bed",
      "title": "Admitted patients waited a median of 121 minutes for a bed",
      "subtitle": "Median minutes per stage, admitted patients, Q4 2024"
    }
  ],
  "actions": [
    "Open a same-day assessment unit at Riverside",
    "Fund weekend discharge teams to cut the 121-minute wait for a bed",
    "Report four-hour performance separately for each of the four sites"
  ],
  "sources": "Trust emergency care dataset",
  "period": "January to December 2024",
  "note": "Illustrative data",
  "type": "executive-brief"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `figures`, `StatRowItem[] | StatRowProps`: Three or four key figures, most important first. A list of `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }`, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn. In the example: an object with `variant`, `items`.
- `hero` (required), `Slot`: The hero exhibit: a chart spec or element whose `title` states one fact with its number. Gets a height of 340px (260px on phones) unless it sets one. In the example: a `line-chart` spec with 12 rows.
- `takeaway`, `{ lead?, body?, label?, tone? }`: The callout beside the hero. `lead` is one short sentence stating the main fact. `body` gives the supporting numbers. In the example: an object with `lead`, `body`, `tone`.
- `supporting`, `Slot[]`: Two (at most three) smaller exhibits shown side by side; they stack in narrow containers. Default height 220px. In the example: 2 items: a `dumbbell-chart` spec with 4 rows; a `bar-chart` spec with 4 rows.
- `actions`, `(string | { title, text?, owner? })[]`: Recommended actions, numbered. Two to four. In the example: 3 items: `"Open a same-day assessment unit at Riverside"`; text.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The main finding, as one plain sentence with the number and the period in it. |
| `kicker` | `string` |  | Small label above the title: the report series or team. |
| `deck` | `string` |  | One to three short sentences. Each states one more fact. |
| `byline` | `string` |  | Author line, shown as written. |
| `date` | `string` |  | Publication date. ISO dates are formatted for the locale. |
| `figures` | `StatRowItem[] \| StatRowProps` |  | Three or four key figures, most important first. A list of `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }`, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn. |
| `hero` (required) | `Slot` |  | The hero exhibit: a chart spec or element whose `title` states one fact with its number. Gets a height of 340px (260px on phones) unless it sets one. |
| `takeaway` | `{ lead?, body?, label?, tone? }` |  | The callout beside the hero. `lead` is one short sentence stating the main fact. `body` gives the supporting numbers. |
| `supporting` | `Slot[]` |  | Two (at most three) smaller exhibits shown side by side; they stack in narrow containers. Default height 220px. |
| `actions` | `(string \| { title, text?, owner? })[]` |  | Recommended actions, numbered. Two to four. |
| `actionsTitle` | `string` | `"What to do"` | Heading of the actions list. |
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

- Built from: `headline` (atom), `stat-row` (molecule), `chart-callout` (molecule), `prose` (atom), `source-note` (atom), `line-chart` (atom), `dumbbell-chart` (atom), `slope-chart` (atom), `bar-chart` (atom), `heatmap` (atom), `diverging-bar-chart` (atom)
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

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/executive-brief.md
- Component reference with every example: https://insightcharts.dev/llms/executive-brief.md
- Registry item: https://insightcharts.dev/r/executive-brief.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/executive-brief.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/executive-brief#example-public-health-emergency-department-waits
- These instructions as plain text: https://insightcharts.dev/agents/templates/executive-brief/public-health-emergency-department-waits.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
