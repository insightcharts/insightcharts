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

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

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

## Composition

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [stat-row](https://insightcharts.dev/llms/stat-row.md), [chart-callout](https://insightcharts.dev/llms/chart-callout.md), [prose](https://insightcharts.dev/llms/prose.md), [source-note](https://insightcharts.dev/llms/source-note.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [dumbbell-chart](https://insightcharts.dev/llms/dumbbell-chart.md), [slope-chart](https://insightcharts.dev/llms/slope-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [heatmap](https://insightcharts.dev/llms/heatmap.md), [diverging-bar-chart](https://insightcharts.dev/llms/diverging-bar-chart.md)
- Used by: no molecule or template yet

## More examples

### Public health: emergency department waits

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

### Logistics: on-time delivery, two carriers

```tsx
import { DivergingBarChart, ExecutiveBrief, Heatmap, LineChart } from "insightcharts";

<ExecutiveBrief
  kicker="Operations review · 2024"
  title="On-time deliveries rose from 86.1% to 93.4% in 2024"
  deck="Route planning software went live in April. Partner carriers delivered 90.6% of parcels on time in December."
  byline="Network operations"
  date="2025-01-21"
  figures={[
    {
      value: "93.4%",
      label: "Parcels delivered on the promised day, December",
      delta: "+7.3 pts",
      deltaLabel: "vs January",
    },
    { value: "1.84m", label: "Parcels delivered in 2024", delta: 0.11, deltaLabel: "vs 2023" },
    {
      value: "€4.10",
      label: "Delivery cost per parcel",
      delta: "−€0.35",
      deltaLabel: "vs 2023",
      upIsGood: false,
    },
  ]}
  hero={<LineChart
    data={[
      { month: "2024-01-01", own: 88, partner: 83.1 },
      { month: "2024-02-01", own: 88.4, partner: 83 },
      { month: "2024-03-01", own: 88.9, partner: 83.6 },
      { month: "2024-04-01", own: 89.6, partner: 84.2 },
      { month: "2024-05-01", own: 90.8, partner: 85 },
      { month: "2024-06-01", own: 91.9, partner: 86.1 },
      { month: "2024-07-01", own: 92.8, partner: 87.3 },
      { month: "2024-08-01", own: 93.6, partner: 88.2 },
      { month: "2024-09-01", own: 94.1, partner: 89 },
      { month: "2024-10-01", own: 94.6, partner: 89.8 },
      { month: "2024-11-01", own: 95, partner: 90.4 },
      { month: "2024-12-01", own: 95.2, partner: 90.6 },
    ]}
    x="month"
    y={["own", "partner"]}
    names={{ own: "Own fleet", partner: "Partner carriers" }}
    format="{value}%"
    title="Own-fleet on-time delivery was 95.2% in December 2024"
    subtitle="Share of parcels delivered on the promised day, by carrier type, monthly, 2024"
    annotations={[
      { type: "line", axis: "x", value: "2024-04-01", label: "Route planning goes live" },
      { type: "line", axis: "y", value: 95, label: "Target, 95%" },
    ]}
  />}
  takeaway={{
    lead: "The own fleet met the 95% target in November and December",
    body: "Partner carriers were at 90.6% in December. That is 4.6 points below the own fleet.",
    tone: "positive",
  }}
  supporting={[
    <Heatmap
      data={[
        { window: "Morning", day: "Mon", share: 4.1 },
        { window: "Morning", day: "Tue", share: 3.8 },
        { window: "Morning", day: "Wed", share: 3.9 },
        { window: "Morning", day: "Thu", share: 4.4 },
        { window: "Morning", day: "Fri", share: 5.2 },
        { window: "Morning", day: "Sat", share: 4.9 },
        { window: "Afternoon", day: "Mon", share: 5.6 },
        { window: "Afternoon", day: "Tue", share: 5.1 },
        { window: "Afternoon", day: "Wed", share: 5.3 },
        { window: "Afternoon", day: "Thu", share: 6 },
        { window: "Afternoon", day: "Fri", share: 8.1 },
        { window: "Afternoon", day: "Sat", share: 6.4 },
        { window: "Evening", day: "Mon", share: 7.9 },
        { window: "Evening", day: "Tue", share: 7.2 },
        { window: "Evening", day: "Wed", share: 7.4 },
        { window: "Evening", day: "Thu", share: 8.8 },
        { window: "Evening", day: "Fri", share: 13.8 },
        { window: "Evening", day: "Sat", share: 9.1 },
      ]}
      x="day"
      y="window"
      value="share"
      format="{value}%"
      labels
      title="13.8% of Friday evening deliveries were late in Q4"
      subtitle="Share of parcels delivered late, by weekday and delivery window, Q4 2024"
    />,
    <DivergingBarChart
      data={[
        { region: "North", change: 9.8 },
        { region: "East", change: 8.4 },
        { region: "Central", change: 7.9 },
        { region: "South", change: 6.1 },
        { region: "Islands", change: -1.7 },
      ]}
      x="region"
      y="change"
      sort="none"
      format="{value} pts"
      title="On-time delivery in the Islands region fell 1.7 points in 2024"
      subtitle="Change in on-time share, January to December 2024, percentage points"
    />,
  ]}
  actions={[
    {
      title: "Add a second evening shift on Fridays",
      text: "13.8% of Friday evening deliveries were late in Q4.",
      owner: "Depot managers · by March",
    },
    {
      title: "Give partner carriers access to the route planner",
      text: "Partner carriers were 4.6 points below the own fleet in December.",
      owner: "Carrier management · Q2",
    },
    {
      title: "Review the ferry schedule for the Islands region",
      text: "It is the only region where on-time delivery fell in 2024.",
      owner: "Network planning",
    },
  ]}
  sources="Delivery management system"
  period="January to December 2024, monthly"
  method="A parcel is on time when it is delivered on the day promised at checkout."
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/executive-brief.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/executive-brief.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
