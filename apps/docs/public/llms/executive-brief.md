# Executive brief (`executive-brief`)

> A one-page summary. It has a headline that states the main finding with its number, a deck, a row of three or four key figures, one hero chart with a takeaway callout, two smaller supporting exhibits, a short list of actions and a source note.

- Component: `ExecutiveBrief` (import from `insightcharts`)
- Spec type: `"executive-brief"`
- Level: template. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it when a decision-maker will spend about a minute on the page. State the main finding with its number and period in the headline. The headline and the hero chart should be enough for a reader who stops there. The figures, supporting exhibits and actions add detail. Use one accent colour for the subject (`highlight`) and leave everything else grey. Mark the cause on the hero as an annotation. The proportions suit a printed page.

## Avoid

More than one hero or more than three supporting exhibits (use `report-page`). A recurring set of numbers with no single finding (use `scorecard`). A story told in several steps (use `visual-essay`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/executive-brief
```

The file lands at `components/insightcharts/templates/executive-brief.tsx`. `@insightcharts/executive-brief-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, DumbbellChart, ExecutiveBrief, LineChart } from "insightcharts";

<ExecutiveBrief
  kicker="Retention review · Q4 2024"
  title="Monthly churn fell from 4.2% to 2.1% in 2024"
  deck="The new onboarding shipped in March. Accounts that joined before March still churn at 3.8% a month."
  byline="Growth analytics"
  date="2025-01-14"
  figures={[
    {
      value: "2.1%",
      label: "Monthly churn, December",
      delta: "−2.1 pts",
      deltaLabel: "vs January",
      upIsGood: false,
    },
    {
      value: 0.61,
      format: "percent",
      label: "New accounts finishing setup in week one",
      delta: "+19 pts",
      deltaLabel: "vs January",
    },
    {
      value: 1.12,
      format: "percent",
      label: "Net revenue retention",
      context: "Top quartile for the sector is 110%",
    },
    {
      value: "$1.9m",
      label: "Annual revenue retained",
      context: "Compared with churn staying at the January rate of 4.2%",
    },
  ]}
  hero={<LineChart
    data={[
      { month: "2024-01-01", churn: 4.2 },
      { month: "2024-02-01", churn: 4.3 },
      { month: "2024-03-01", churn: 4.1 },
      { month: "2024-04-01", churn: 3.6 },
      { month: "2024-05-01", churn: 3.1 },
      { month: "2024-06-01", churn: 2.9 },
      { month: "2024-07-01", churn: 2.6 },
      { month: "2024-08-01", churn: 2.4 },
      { month: "2024-09-01", churn: 2.3 },
      { month: "2024-10-01", churn: 2.2 },
      { month: "2024-11-01", churn: 2.1 },
      { month: "2024-12-01", churn: 2.1 },
    ]}
    x="month"
    y="churn"
    format="{value}%"
    zero
    title="Monthly churn fell from 4.1% in March to 2.1% in December"
    subtitle="Share of paying accounts cancelling each month, 2024"
    annotations={[
      { type: "line", axis: "x", value: "2024-03-01", label: "New onboarding ships" },
      { type: "band", axis: "y", from: 2, to: 2.5, label: "Target range" },
    ]}
    source="Billing system"
  />}
  takeaway={{
    lead: "Churn was between 2.1% and 2.4% from August to December",
    body: "The new onboarding shipped in March. Churn did not fall in the same months of 2023.",
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
    <BarChart
      data={[
        { reason: "Setup not finished", before: 38, after: 14 },
        { reason: "Too expensive", before: 22, after: 27 },
        { reason: "Missing a feature", before: 17, after: 24 },
        { reason: "Went to a rival", before: 13, after: 19 },
        { reason: "Company closed", before: 10, after: 16 },
      ]}
      x="reason"
      y="after"
      sort="none"
      orientation="horizontal"
      format="{value}%"
      highlight="Setup not finished"
      title="“Setup not finished” was the reason for 14% of cancellations in Q4"
      subtitle="Share of cancellations by stated reason, Q4 2024. “Setup not finished” was 38% in Q1"
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

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "executive-brief",
  "kicker": "Retention review · Q4 2024",
  "title": "Monthly churn fell from 4.2% to 2.1% in 2024",
  "deck": "The new onboarding shipped in March. Accounts that joined before March still churn at 3.8% a month.",
  "byline": "Growth analytics",
  "date": "2025-01-14",
  "figures": [
    {
      "value": "2.1%",
      "label": "Monthly churn, December",
      "delta": "−2.1 pts",
      "deltaLabel": "vs January",
      "upIsGood": false
    },
    {
      "value": 0.61,
      "format": "percent",
      "label": "New accounts finishing setup in week one",
      "delta": "+19 pts",
      "deltaLabel": "vs January"
    },
    {
      "value": 1.12,
      "format": "percent",
      "label": "Net revenue retention",
      "context": "Top quartile for the sector is 110%"
    },
    {
      "value": "$1.9m",
      "label": "Annual revenue retained",
      "context": "Compared with churn staying at the January rate of 4.2%"
    }
  ],
  "hero": {
    "type": "line-chart",
    "data": [
      { "month": "2024-01-01", "churn": 4.2 },
      { "month": "2024-02-01", "churn": 4.3 },
      { "month": "2024-03-01", "churn": 4.1 },
      { "month": "2024-04-01", "churn": 3.6 },
      { "month": "2024-05-01", "churn": 3.1 },
      { "month": "2024-06-01", "churn": 2.9 },
      { "month": "2024-07-01", "churn": 2.6 },
      { "month": "2024-08-01", "churn": 2.4 },
      { "month": "2024-09-01", "churn": 2.3 },
      { "month": "2024-10-01", "churn": 2.2 },
      { "month": "2024-11-01", "churn": 2.1 },
      { "month": "2024-12-01", "churn": 2.1 }
    ],
    "x": "month",
    "y": "churn",
    "format": "{value}%",
    "zero": true,
    "title": "Monthly churn fell from 4.1% in March to 2.1% in December",
    "subtitle": "Share of paying accounts cancelling each month, 2024",
    "annotations": [
      { "type": "line", "axis": "x", "value": "2024-03-01", "label": "New onboarding ships" },
      { "type": "band", "axis": "y", "from": 2, "to": 2.5, "label": "Target range" }
    ],
    "source": "Billing system"
  },
  "takeaway": {
    "lead": "Churn was between 2.1% and 2.4% from August to December",
    "body": "The new onboarding shipped in March. Churn did not fall in the same months of 2023."
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
      "type": "bar-chart",
      "data": [
        { "reason": "Setup not finished", "before": 38, "after": 14 },
        { "reason": "Too expensive", "before": 22, "after": 27 },
        { "reason": "Missing a feature", "before": 17, "after": 24 },
        { "reason": "Went to a rival", "before": 13, "after": 19 },
        { "reason": "Company closed", "before": 10, "after": 16 }
      ],
      "x": "reason",
      "y": "after",
      "sort": "none",
      "orientation": "horizontal",
      "format": "{value}%",
      "highlight": "Setup not finished",
      "title": "“Setup not finished” was the reason for 14% of cancellations in Q4",
      "subtitle": "Share of cancellations by stated reason, Q4 2024. “Setup not finished” was 38% in Q1"
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

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The main finding, as one plain sentence with the number and the period in it. |
| `kicker` | `string` |  | Small label above the title: the report series or team. |
| `deck` | `string` |  | One to three short sentences. Each states one more fact. |
| `byline` | `string` |  | Author line, shown as written. |
| `date` | `string` |  | Publication date. ISO dates are formatted for the locale. |
| `figures` | `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }[]` |  | Three or four key figures, most important first. Rendered with `stat-row`. |
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
| `theme` | `ThemeInput` |  | Theme override, passed on to everything inside. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to everything inside. |

## Composition

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [stat-row](https://insightcharts.dev/llms/stat-row.md), [chart-callout](https://insightcharts.dev/llms/chart-callout.md), [prose](https://insightcharts.dev/llms/prose.md), [source-note](https://insightcharts.dev/llms/source-note.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [dumbbell-chart](https://insightcharts.dev/llms/dumbbell-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md)
- Used by: no molecule or template yet

## More examples

### Public health: emergency department waits

```tsx
import { BarChart, DumbbellChart, ExecutiveBrief, LineChart } from "insightcharts";

<ExecutiveBrief
  kicker="Urgent care board · December 2024"
  title="78.6% of emergency patients were seen within four hours in December 2024"
  deck="The share was 71.2% in January. St Anne's opened a same-day assessment unit in September. Its four-hour performance rose from 68% to 81%."
  date="2025-01-09"
  figures={[
    {
      value: "78.6%",
      label: "Seen within four hours, December",
      delta: "+7.4 pts",
      deltaLabel: "vs January",
    },
    {
      value: "4h 50m",
      label: "Median time in department for admitted patients",
      delta: "−38 min",
      deltaLabel: "vs January",
      upIsGood: false,
    },
    {
      value: 412,
      label: "Waits over twelve hours",
      delta: -0.31,
      deltaLabel: "vs January",
      upIsGood: false,
    },
  ]}
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

## Links

- Registry item: https://insightcharts.dev/r/executive-brief.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/executive-brief.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
