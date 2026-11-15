# Reproduce the "Support desk: weekly, stacked channels and targets" example of the InsightCharts Scorecard

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Support desk: weekly, stacked channels and targets" example of `scorecard` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

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

## 5. The "Support desk: weekly, stacked channels and targets" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { BarChart, BulletChart, Scorecard } from "insightcharts";

<Scorecard
  kicker="Support desk scorecard"
  reportPeriod="Week 42, 2024"
  title="Median first response time fell to 38 minutes in week 42"
  deck="It was 64 minutes in week 31. Chat handled 46% of tickets in week 42."
  kpis={{
    data: [
      { week: "W31", tickets: 1840, response: 64, resolved: 71, csat: 4.21 },
      { week: "W32", tickets: 1795, response: 62, resolved: 72, csat: 4.2 },
      { week: "W33", tickets: 1910, response: 66, resolved: 70, csat: 4.18 },
      { week: "W34", tickets: 1880, response: 61, resolved: 73, csat: 4.24 },
      { week: "W35", tickets: 1960, response: 58, resolved: 74, csat: 4.25 },
      { week: "W36", tickets: 2010, response: 57, resolved: 74, csat: 4.27 },
      { week: "W37", tickets: 1985, response: 55, resolved: 76, csat: 4.3 },
      { week: "W38", tickets: 2090, response: 52, resolved: 77, csat: 4.31 },
      { week: "W39", tickets: 2140, response: 49, resolved: 79, csat: 4.36 },
      { week: "W40", tickets: 2075, response: 45, resolved: 81, csat: 4.4 },
      { week: "W41", tickets: 2180, response: 41, resolved: 83, csat: 4.43 },
      { week: "W42", tickets: 2230, response: 38, resolved: 84, csat: 4.46 },
    ],
    x: "week",
    compare: "previous",
    metrics: [
      {
        variant: "bars",
        y: "response",
        label: "Median first response",
        format: "{value} min",
        upIsGood: false,
        deltaLabel: "vs week 41",
      },
      {
        variant: "bars",
        y: "tickets",
        label: "Tickets opened",
        format: "integer",
        upIsGood: false,
        deltaLabel: "vs week 41",
      },
      {
        variant: "bars",
        y: "resolved",
        label: "Resolved within 24 hours",
        format: "{value}%",
        delta: "+1 pt",
        deltaLabel: "vs week 41",
      },
      {
        variant: "bars",
        y: "csat",
        label: "Satisfaction score out of 5",
        format: "decimal:2",
        change: "absolute",
        deltaLabel: "vs week 41",
      },
    ],
  }}
  ranking={{
    data: [
      { queue: "Billing", tickets: 612, change: 0.09, resolved: 88, target: 80 },
      { queue: "Login and access", tickets: 498, change: 0.21, resolved: 71, target: 80 },
      { queue: "Shipping", tickets: 431, change: -0.05, resolved: 86, target: 80 },
      { queue: "Returns", tickets: 356, change: 0.02, resolved: 90, target: 80 },
      { queue: "Product questions", tickets: 333, change: -0.03, resolved: 85, target: 80 },
    ],
    name: "queue",
    value: "tickets",
    change: "change",
    upIsGood: false,
    highlight: "Login and access",
    title: "Login and access tickets rose 21% to 498 in week 42",
    subtitle: "Tickets by queue, week 42, with change on week 41",
  }}
  trends={[
    <BarChart
      data={[
        { week: "W37", email: 900, chat: 735, phone: 350 },
        { week: "W38", email: 905, chat: 840, phone: 345 },
        { week: "W39", email: 880, chat: 920, phone: 340 },
        { week: "W40", email: 820, chat: 925, phone: 330 },
        { week: "W41", email: 830, chat: 1010, phone: 340 },
        { week: "W42", email: 870, chat: 1025, phone: 335 },
      ]}
      x="week"
      y={["email", "chat", "phone"]}
      names={{ email: "Email", chat: "Chat", phone: "Phone" }}
      stack
      sort="none"
      orientation="vertical"
      height={240}
      title="Chat handled 1,025 of 2,230 tickets in week 42"
      subtitle="Tickets opened by channel, weeks 37 to 42"
    />,
    <BulletChart
      data={[
        { queue: "Billing", tickets: 612, change: 0.09, resolved: 88, target: 80 },
        { queue: "Login and access", tickets: 498, change: 0.21, resolved: 71, target: 80 },
        { queue: "Shipping", tickets: 431, change: -0.05, resolved: 86, target: 80 },
        { queue: "Returns", tickets: 356, change: 0.02, resolved: 90, target: 80 },
        { queue: "Product questions", tickets: 333, change: -0.03, resolved: 85, target: 80 },
      ]}
      category="queue"
      value="resolved"
      target="target"
      names={{ resolved: "Resolved within 24 hours", target: "Target" }}
      max={100}
      format="{value}%"
      highlight="Login and access"
      title="71% of login and access tickets were resolved within 24 hours"
      subtitle="Share resolved within 24 hours by queue, week 42, against the 80% target"
    />,
  ]}
  notes={[
    {
      title: "Chat staffing rose from 9 to 14 agents in week 39",
      text: "Median first response was 49 minutes in week 39 and 38 minutes in week 42.",
    },
    {
      title: "A password reset fault on 14 October produced 96 login tickets",
      text: "The fault was fixed the same day.",
    },
  ]}
  sources="Help desk system"
  period="Weeks 31 to 42, 2024"
  method="First response is the time from ticket creation to the first reply by an agent, in working hours."
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "kicker": "Support desk scorecard",
  "reportPeriod": "Week 42, 2024",
  "title": "Median first response time fell to 38 minutes in week 42",
  "deck": "It was 64 minutes in week 31. Chat handled 46% of tickets in week 42.",
  "kpis": {
    "data": [
      { "week": "W31", "tickets": 1840, "response": 64, "resolved": 71, "csat": 4.21 },
      { "week": "W32", "tickets": 1795, "response": 62, "resolved": 72, "csat": 4.2 },
      { "week": "W33", "tickets": 1910, "response": 66, "resolved": 70, "csat": 4.18 },
      { "week": "W34", "tickets": 1880, "response": 61, "resolved": 73, "csat": 4.24 },
      { "week": "W35", "tickets": 1960, "response": 58, "resolved": 74, "csat": 4.25 },
      { "week": "W36", "tickets": 2010, "response": 57, "resolved": 74, "csat": 4.27 },
      { "week": "W37", "tickets": 1985, "response": 55, "resolved": 76, "csat": 4.3 },
      { "week": "W38", "tickets": 2090, "response": 52, "resolved": 77, "csat": 4.31 },
      { "week": "W39", "tickets": 2140, "response": 49, "resolved": 79, "csat": 4.36 },
      { "week": "W40", "tickets": 2075, "response": 45, "resolved": 81, "csat": 4.4 },
      { "week": "W41", "tickets": 2180, "response": 41, "resolved": 83, "csat": 4.43 },
      { "week": "W42", "tickets": 2230, "response": 38, "resolved": 84, "csat": 4.46 }
    ],
    "x": "week",
    "compare": "previous",
    "metrics": [
      {
        "variant": "bars",
        "y": "response",
        "label": "Median first response",
        "format": "{value} min",
        "upIsGood": false,
        "deltaLabel": "vs week 41"
      },
      {
        "variant": "bars",
        "y": "tickets",
        "label": "Tickets opened",
        "format": "integer",
        "upIsGood": false,
        "deltaLabel": "vs week 41"
      },
      {
        "variant": "bars",
        "y": "resolved",
        "label": "Resolved within 24 hours",
        "format": "{value}%",
        "delta": "+1 pt",
        "deltaLabel": "vs week 41"
      },
      {
        "variant": "bars",
        "y": "csat",
        "label": "Satisfaction score out of 5",
        "format": "decimal:2",
        "change": "absolute",
        "deltaLabel": "vs week 41"
      }
    ]
  },
  "ranking": {
    "data": [
      { "queue": "Billing", "tickets": 612, "change": 0.09, "resolved": 88, "target": 80 },
      { "queue": "Login and access", "tickets": 498, "change": 0.21, "resolved": 71, "target": 80 },
      { "queue": "Shipping", "tickets": 431, "change": -0.05, "resolved": 86, "target": 80 },
      { "queue": "Returns", "tickets": 356, "change": 0.02, "resolved": 90, "target": 80 },
      {
        "queue": "Product questions",
        "tickets": 333,
        "change": -0.03,
        "resolved": 85,
        "target": 80
      }
    ],
    "name": "queue",
    "value": "tickets",
    "change": "change",
    "upIsGood": false,
    "highlight": "Login and access",
    "title": "Login and access tickets rose 21% to 498 in week 42",
    "subtitle": "Tickets by queue, week 42, with change on week 41"
  },
  "trends": [
    {
      "type": "bar-chart",
      "data": [
        { "week": "W37", "email": 900, "chat": 735, "phone": 350 },
        { "week": "W38", "email": 905, "chat": 840, "phone": 345 },
        { "week": "W39", "email": 880, "chat": 920, "phone": 340 },
        { "week": "W40", "email": 820, "chat": 925, "phone": 330 },
        { "week": "W41", "email": 830, "chat": 1010, "phone": 340 },
        { "week": "W42", "email": 870, "chat": 1025, "phone": 335 }
      ],
      "x": "week",
      "y": ["email", "chat", "phone"],
      "names": { "email": "Email", "chat": "Chat", "phone": "Phone" },
      "stack": true,
      "sort": "none",
      "orientation": "vertical",
      "height": 240,
      "title": "Chat handled 1,025 of 2,230 tickets in week 42",
      "subtitle": "Tickets opened by channel, weeks 37 to 42"
    },
    {
      "type": "bullet-chart",
      "data": [
        { "queue": "Billing", "tickets": 612, "change": 0.09, "resolved": 88, "target": 80 },
        {
          "queue": "Login and access",
          "tickets": 498,
          "change": 0.21,
          "resolved": 71,
          "target": 80
        },
        { "queue": "Shipping", "tickets": 431, "change": -0.05, "resolved": 86, "target": 80 },
        { "queue": "Returns", "tickets": 356, "change": 0.02, "resolved": 90, "target": 80 },
        {
          "queue": "Product questions",
          "tickets": 333,
          "change": -0.03,
          "resolved": 85,
          "target": 80
        }
      ],
      "category": "queue",
      "value": "resolved",
      "target": "target",
      "names": { "resolved": "Resolved within 24 hours", "target": "Target" },
      "max": 100,
      "format": "{value}%",
      "highlight": "Login and access",
      "title": "71% of login and access tickets were resolved within 24 hours",
      "subtitle": "Share resolved within 24 hours by queue, week 42, against the 80% target"
    }
  ],
  "notes": [
    {
      "title": "Chat staffing rose from 9 to 14 agents in week 39",
      "text": "Median first response was 49 minutes in week 39 and 38 minutes in week 42."
    },
    {
      "title": "A password reset fault on 14 October produced 96 login tickets",
      "text": "The fault was fixed the same day."
    }
  ],
  "sources": "Help desk system",
  "period": "Weeks 31 to 42, 2024",
  "method": "First response is the time from ticket creation to the first reply by an agent, in working hours.",
  "note": "Illustrative data",
  "type": "scorecard"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `kpis`, `{ data, x, metrics, compare?, change?, columns? }`: The headline metrics: the props of `kpi-grid`. One time-ordered dataset, one card per metric. In the example: a config with 12 rows of `data` and the fields `x: "week"`.
- `ranking`, `{ data, name, value, change?, highlight?, title?, ... } | Slot`: A ranking: the props of `ranked-list`, or any spec or element. In the example: a config with 5 rows of `data` and the fields `name: "queue"`, `value: "tickets"`, `change: "change"`.
- `trends`, `Slot[]`: One or two trend exhibits, shown beside the ranking in wide containers. In the example: 2 items: a `bar-chart` spec with 6 rows; a `bullet-chart` spec with 5 rows.
- `table`, `{ data, columns, highlight?, sort?, title?, ... } | Slot`: A comparison across entities: the props of `comparison-table`, or any spec or element. Not used in the example.
- `notes`, `(string | { title, text? })[]`: Short notes on what changed in the period. Each states one fact with its number. In the example: 2 items: an object with `title`, `text`.

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
- This page: https://insightcharts.dev/templates/scorecard#example-support-desk-weekly-stacked-channels-and-targets
- These instructions as plain text: https://insightcharts.dev/agents/templates/scorecard/support-desk-weekly-stacked-channels-and-targets.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
