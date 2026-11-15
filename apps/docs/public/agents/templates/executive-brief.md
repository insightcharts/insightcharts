# Build an Executive brief with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add an Executive brief (`executive-brief`, a template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

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

## 5. Working example

```tsx
import { DumbbellChart, ExecutiveBrief, LineChart, SlopeChart } from "insightcharts";

<ExecutiveBrief
  theme="ledger"
  kicker="Retention review · Q4 2024"
  title="Monthly churn fell from 4.2% to 2.1% in 2024"
  deck="The new onboarding shipped in March. Accounts that joined before March still churn at 3.8% a month."
  byline="Growth analytics"
  date="2025-01-14"
  figures={{
    variant: "tiles",
    items: [
      {
        surface: "outline-accent",
        edge: "top",
        value: "2.1%",
        label: "Monthly churn, December",
        delta: "−2.1 pts",
        deltaLabel: "vs January",
        upIsGood: false,
      },
      {
        surface: "outline-accent",
        edge: "top",
        value: 0.61,
        format: "percent",
        label: "New accounts finishing setup in week one",
        delta: "+19 pts",
        deltaLabel: "vs January",
      },
      {
        surface: "outline-accent",
        edge: "top",
        value: 1.12,
        format: "percent",
        label: "Net revenue retention",
        context: "Top quartile for the sector is 110%",
      },
      {
        surface: "outline-accent",
        edge: "top",
        value: "$1.9m",
        label: "Annual revenue retained",
        context: "Compared with churn staying at the January rate of 4.2%",
      },
    ],
  }}
  hero={<LineChart
    data={[
      { month: "2024-01-01", churn: 4.2, prior: 4.4 },
      { month: "2024-02-01", churn: 4.3, prior: 4.3 },
      { month: "2024-03-01", churn: 4.1, prior: 4.4 },
      { month: "2024-04-01", churn: 3.6, prior: 4.2 },
      { month: "2024-05-01", churn: 3.1, prior: 4.3 },
      { month: "2024-06-01", churn: 2.9, prior: 4.1 },
      { month: "2024-07-01", churn: 2.6, prior: 4.2 },
      { month: "2024-08-01", churn: 2.4, prior: 4.3 },
      { month: "2024-09-01", churn: 2.3, prior: 4.1 },
      { month: "2024-10-01", churn: 2.2, prior: 4.2 },
      { month: "2024-11-01", churn: 2.1, prior: 4.3 },
      { month: "2024-12-01", churn: 2.1, prior: 4.2 },
    ]}
    x="month"
    y={["churn", "prior"]}
    names={{ churn: "2024", prior: "2023" }}
    highlight="churn"
    contextLabels
    format="{value}%"
    zero
    title="Monthly churn fell from 4.1% in March to 2.1% in December"
    subtitle="Share of paying accounts cancelling each month, 2024 and the same months of 2023"
    annotations={[
      { type: "line", axis: "x", value: "2024-03-01", label: "New onboarding ships" },
      { type: "band", axis: "y", from: 2, to: 2.5, label: "Target range" },
    ]}
    source="Billing system"
  />}
  takeaway={{
    lead: "Churn was between 2.1% and 2.4% from August to December",
    body: "The new onboarding shipped in March. Churn was between 4.1% and 4.4% in every month of 2023.",
  }}
  supporting={[
    <DumbbellChart
      data={[
        { plan: "Starter", jan: 6.1, dec: 2.9 },
        { plan: "Team", jan: 4, dec: 2 },
        { plan: "Business", jan: 2.4, dec: 1.6 },
        { plan: "Enterprise", jan: 0.9, dec: 0.8 },
      ]}
      category="plan"
      from="jan"
      to="dec"
      names={{ jan: "January", dec: "December" }}
      format="{value}%"
      sort="none"
      highlight="Starter"
      title="Starter plan churn fell from 6.1% to 2.9%"
      subtitle="Monthly churn by plan, January and December 2024"
    />,
    <SlopeChart
      data={[
        { reason: "Setup not finished", before: 38, after: 14 },
        { reason: "Too expensive", before: 22, after: 27 },
        { reason: "Missing a feature", before: 17, after: 24 },
        { reason: "Went to a rival", before: 13, after: 19 },
        { reason: "Company closed", before: 10, after: 16 },
      ]}
      series="reason"
      y={["before", "after"]}
      names={{ before: "Q1", after: "Q4" }}
      format="{value}%"
      highlight="Setup not finished"
      height={260}
      title="“Setup not finished” fell from 38% to 14% of cancellations"
      subtitle="Share of cancellations by stated reason, Q1 and Q4 2024"
    />,
  ]}
  actions={[
    {
      title: "Offer the guided setup to the 2,400 accounts that joined before March",
      text: "These accounts churn at 3.8% a month.",
      owner: "Lifecycle · by end of February",
    },
    {
      title: "Make the setup checklist the default on the Team plan",
      text: "The checklist is opt-in on Team today. Team churn was 2.0% in December.",
      owner: "Product · Q1",
    },
    {
      title: "Measure churn again in March 2025",
      text: "That will give 12 months of data since the new onboarding shipped.",
      owner: "Growth analytics",
    },
  ]}
  sources={["Billing system", "Product analytics warehouse"]}
  period="January to December 2024, monthly"
  method="Churn is the share of accounts paying at the start of a month that cancel during it. Downgrades are not counted."
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "executive-brief",
  "theme": "ledger",
  "kicker": "Retention review · Q4 2024",
  "title": "Monthly churn fell from 4.2% to 2.1% in 2024",
  "deck": "The new onboarding shipped in March. Accounts that joined before March still churn at 3.8% a month.",
  "byline": "Growth analytics",
  "date": "2025-01-14",
  "figures": {
    "variant": "tiles",
    "items": [
      {
        "surface": "outline-accent",
        "edge": "top",
        "value": "2.1%",
        "label": "Monthly churn, December",
        "delta": "−2.1 pts",
        "deltaLabel": "vs January",
        "upIsGood": false
      },
      {
        "surface": "outline-accent",
        "edge": "top",
        "value": 0.61,
        "format": "percent",
        "label": "New accounts finishing setup in week one",
        "delta": "+19 pts",
        "deltaLabel": "vs January"
      },
      {
        "surface": "outline-accent",
        "edge": "top",
        "value": 1.12,
        "format": "percent",
        "label": "Net revenue retention",
        "context": "Top quartile for the sector is 110%"
      },
      {
        "surface": "outline-accent",
        "edge": "top",
        "value": "$1.9m",
        "label": "Annual revenue retained",
        "context": "Compared with churn staying at the January rate of 4.2%"
      }
    ]
  },
  "hero": {
    "type": "line-chart",
    "data": [
      { "month": "2024-01-01", "churn": 4.2, "prior": 4.4 },
      { "month": "2024-02-01", "churn": 4.3, "prior": 4.3 },
      { "month": "2024-03-01", "churn": 4.1, "prior": 4.4 },
      { "month": "2024-04-01", "churn": 3.6, "prior": 4.2 },
      { "month": "2024-05-01", "churn": 3.1, "prior": 4.3 },
      { "month": "2024-06-01", "churn": 2.9, "prior": 4.1 },
      { "month": "2024-07-01", "churn": 2.6, "prior": 4.2 },
      { "month": "2024-08-01", "churn": 2.4, "prior": 4.3 },
      { "month": "2024-09-01", "churn": 2.3, "prior": 4.1 },
      { "month": "2024-10-01", "churn": 2.2, "prior": 4.2 },
      { "month": "2024-11-01", "churn": 2.1, "prior": 4.3 },
      { "month": "2024-12-01", "churn": 2.1, "prior": 4.2 }
    ],
    "x": "month",
    "y": ["churn", "prior"],
    "names": { "churn": "2024", "prior": "2023" },
    "highlight": "churn",
    "contextLabels": true,
    "format": "{value}%",
    "zero": true,
    "title": "Monthly churn fell from 4.1% in March to 2.1% in December",
    "subtitle": "Share of paying accounts cancelling each month, 2024 and the same months of 2023",
    "annotations": [
      { "type": "line", "axis": "x", "value": "2024-03-01", "label": "New onboarding ships" },
      { "type": "band", "axis": "y", "from": 2, "to": 2.5, "label": "Target range" }
    ],
    "source": "Billing system"
  },
  "takeaway": {
    "lead": "Churn was between 2.1% and 2.4% from August to December",
    "body": "The new onboarding shipped in March. Churn was between 4.1% and 4.4% in every month of 2023."
  },
  "supporting": [
    {
      "type": "dumbbell-chart",
      "data": [
        { "plan": "Starter", "jan": 6.1, "dec": 2.9 },
        { "plan": "Team", "jan": 4, "dec": 2 },
        { "plan": "Business", "jan": 2.4, "dec": 1.6 },
        { "plan": "Enterprise", "jan": 0.9, "dec": 0.8 }
      ],
      "category": "plan",
      "from": "jan",
      "to": "dec",
      "names": { "jan": "January", "dec": "December" },
      "format": "{value}%",
      "sort": "none",
      "highlight": "Starter",
      "title": "Starter plan churn fell from 6.1% to 2.9%",
      "subtitle": "Monthly churn by plan, January and December 2024"
    },
    {
      "type": "slope-chart",
      "data": [
        { "reason": "Setup not finished", "before": 38, "after": 14 },
        { "reason": "Too expensive", "before": 22, "after": 27 },
        { "reason": "Missing a feature", "before": 17, "after": 24 },
        { "reason": "Went to a rival", "before": 13, "after": 19 },
        { "reason": "Company closed", "before": 10, "after": 16 }
      ],
      "series": "reason",
      "y": ["before", "after"],
      "names": { "before": "Q1", "after": "Q4" },
      "format": "{value}%",
      "highlight": "Setup not finished",
      "height": 260,
      "title": "“Setup not finished” fell from 38% to 14% of cancellations",
      "subtitle": "Share of cancellations by stated reason, Q1 and Q4 2024"
    }
  ],
  "actions": [
    {
      "title": "Offer the guided setup to the 2,400 accounts that joined before March",
      "text": "These accounts churn at 3.8% a month.",
      "owner": "Lifecycle · by end of February"
    },
    {
      "title": "Make the setup checklist the default on the Team plan",
      "text": "The checklist is opt-in on Team today. Team churn was 2.0% in December.",
      "owner": "Product · Q1"
    },
    {
      "title": "Measure churn again in March 2025",
      "text": "That will give 12 months of data since the new onboarding shipped.",
      "owner": "Growth analytics"
    }
  ],
  "sources": ["Billing system", "Product analytics warehouse"],
  "period": "January to December 2024, monthly",
  "method": "Churn is the share of accounts paying at the start of a month that cancel during it. Downgrades are not counted.",
  "note": "Illustrative data"
}
```

This example sets `theme="ledger"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `figures`, `StatRowItem[] | StatRowProps`: Three or four key figures, most important first. A list of `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }`, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn. In the example: an object with `variant`, `items`.
- `hero` (required), `Slot`: The hero exhibit: a chart spec or element whose `title` states one fact with its number. Gets a height of 340px (260px on phones) unless it sets one. In the example: a `line-chart` spec with 12 rows.
- `takeaway`, `{ lead?, body?, label?, tone? }`: The callout beside the hero. `lead` is one short sentence stating the main fact. `body` gives the supporting numbers. In the example: an object with `lead`, `body`.
- `supporting`, `Slot[]`: Two (at most three) smaller exhibits shown side by side; they stack in narrow containers. Default height 220px. In the example: 2 items: a `dumbbell-chart` spec with 4 rows; a `slope-chart` spec with 5 rows.
- `actions`, `(string | { title, text?, owner? })[]`: Recommended actions, numbered. Two to four. In the example: 3 items: an object with `title`, `text`, `owner`.

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

- Component reference with every example: https://insightcharts.dev/llms/executive-brief.md
- Registry item: https://insightcharts.dev/r/executive-brief.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/executive-brief.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/executive-brief
- These instructions as plain text: https://insightcharts.dev/agents/templates/executive-brief.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
