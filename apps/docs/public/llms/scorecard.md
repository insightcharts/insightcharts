# Scorecard (`scorecard`)

> A recurring report. It has a masthead with the report name and period, a headline that states the main change, a KPI grid with changes and sparklines, a ranked list beside one or two trend charts, an optional comparison table, short notes and a source note.

- Component: `Scorecard` (import from `insightcharts`)
- Spec type: `"scorecard"`
- Level: template. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it for weekly or monthly numbers. Keep the layout the same in every edition so readers know where each number is. Change the headline each edition to state the main change with its number. The headline and the KPI row should be enough for a reader who stops there. The ranking, trends and notes add detail. Highlight the one row or series the headline is about and leave the rest grey.

## Avoid

A one-off finding (use `executive-brief`). Readers who need to filter the data themselves (use `data-explorer`). More than six KPIs.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/scorecard
```

The file lands at `components/insightcharts/templates/scorecard.tsx`. `@insightcharts/scorecard-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, LineChart, Scorecard } from "insightcharts";

<Scorecard
  theme="noir"
  kicker="Online store scorecard"
  reportPeriod="October 2024"
  title="Orders rose 12% in October to 24,900"
  deck="The return rate was 11.4%. It was 8.4% in July, the month before free returns launched. Outerwear had the highest return rate at 19.2%."
  kpis={{
    data: [
      {
        month: "2023-11-01",
        orders: 18200,
        conversion: 2.61,
        aov: 64.1,
        returns: 8.1,
        outerwear: 13,
      },
      {
        month: "2023-12-01",
        orders: 26900,
        conversion: 3.02,
        aov: 66.8,
        returns: 8.4,
        outerwear: 13.2,
      },
      { month: "2024-01-01", orders: 17100, conversion: 2.55, aov: 63, returns: 9, outerwear: 13.6 },
      {
        month: "2024-02-01",
        orders: 16400,
        conversion: 2.58,
        aov: 62.4,
        returns: 8.2,
        outerwear: 13.1,
      },
      {
        month: "2024-03-01",
        orders: 17900,
        conversion: 2.66,
        aov: 62.9,
        returns: 8,
        outerwear: 12.9,
      },
      {
        month: "2024-04-01",
        orders: 18800,
        conversion: 2.71,
        aov: 62.2,
        returns: 7.9,
        outerwear: 13.3,
      },
      {
        month: "2024-05-01",
        orders: 19600,
        conversion: 2.74,
        aov: 61.8,
        returns: 8.3,
        outerwear: 13,
      },
      {
        month: "2024-06-01",
        orders: 19900,
        conversion: 2.78,
        aov: 61.5,
        returns: 8.1,
        outerwear: 13.4,
      },
      {
        month: "2024-07-01",
        orders: 20400,
        conversion: 2.83,
        aov: 61.9,
        returns: 8.4,
        outerwear: 13.2,
      },
      {
        month: "2024-08-01",
        orders: 21300,
        conversion: 2.9,
        aov: 61.2,
        returns: 9.6,
        outerwear: 13.5,
      },
      {
        month: "2024-09-01",
        orders: 22200,
        conversion: 2.97,
        aov: 60.8,
        returns: 10.5,
        outerwear: 16.1,
      },
      {
        month: "2024-10-01",
        orders: 24900,
        conversion: 3.1,
        aov: 61,
        returns: 11.4,
        outerwear: 17.8,
      },
    ],
    x: "month",
    compare: "previous",
    metrics: [
      {
        variant: "area",
        y: "orders",
        label: "Orders",
        format: "compact",
        deltaLabel: "vs September",
      },
      {
        variant: "area",
        y: "conversion",
        label: "Conversion rate",
        format: "{value}%",
        delta: "+0.13 pts",
        deltaLabel: "vs September",
      },
      {
        variant: "area",
        y: "aov",
        label: "Average order value",
        format: "currency:EUR",
        deltaLabel: "vs September",
      },
      {
        variant: "area",
        y: "returns",
        label: "Return rate",
        format: "{value}%",
        delta: "+0.9 pts",
        upIsGood: false,
        deltaLabel: "vs September",
      },
    ],
  }}
  ranking={{
    data: [
      { category: "Outerwear", revenue: 412, change: 0.31, returns: 19.2 },
      { category: "Footwear", revenue: 371, change: 0.08, returns: 14.1 },
      { category: "Knitwear", revenue: 298, change: 0.22, returns: 9.8 },
      { category: "Accessories", revenue: 164, change: -0.04, returns: 4.2 },
      { category: "Denim", revenue: 152, change: -0.11, returns: 12.6 },
      { category: "Home", revenue: 88, change: 0.02, returns: 3.1 },
    ],
    name: "category",
    value: "revenue",
    change: "change",
    format: "€{value}k",
    highlight: "Outerwear",
    title: "Outerwear revenue rose 31% to €412k in October",
    subtitle: "Revenue by category, October, with change on September",
  }}
  trends={[
    <LineChart
      data={[
        {
          month: "2023-11-01",
          orders: 18200,
          conversion: 2.61,
          aov: 64.1,
          returns: 8.1,
          outerwear: 13,
        },
        {
          month: "2023-12-01",
          orders: 26900,
          conversion: 3.02,
          aov: 66.8,
          returns: 8.4,
          outerwear: 13.2,
        },
        {
          month: "2024-01-01",
          orders: 17100,
          conversion: 2.55,
          aov: 63,
          returns: 9,
          outerwear: 13.6,
        },
        {
          month: "2024-02-01",
          orders: 16400,
          conversion: 2.58,
          aov: 62.4,
          returns: 8.2,
          outerwear: 13.1,
        },
        {
          month: "2024-03-01",
          orders: 17900,
          conversion: 2.66,
          aov: 62.9,
          returns: 8,
          outerwear: 12.9,
        },
        {
          month: "2024-04-01",
          orders: 18800,
          conversion: 2.71,
          aov: 62.2,
          returns: 7.9,
          outerwear: 13.3,
        },
        {
          month: "2024-05-01",
          orders: 19600,
          conversion: 2.74,
          aov: 61.8,
          returns: 8.3,
          outerwear: 13,
        },
        {
          month: "2024-06-01",
          orders: 19900,
          conversion: 2.78,
          aov: 61.5,
          returns: 8.1,
          outerwear: 13.4,
        },
        {
          month: "2024-07-01",
          orders: 20400,
          conversion: 2.83,
          aov: 61.9,
          returns: 8.4,
          outerwear: 13.2,
        },
        {
          month: "2024-08-01",
          orders: 21300,
          conversion: 2.9,
          aov: 61.2,
          returns: 9.6,
          outerwear: 13.5,
        },
        {
          month: "2024-09-01",
          orders: 22200,
          conversion: 2.97,
          aov: 60.8,
          returns: 10.5,
          outerwear: 16.1,
        },
        {
          month: "2024-10-01",
          orders: 24900,
          conversion: 3.1,
          aov: 61,
          returns: 11.4,
          outerwear: 17.8,
        },
      ]}
      x="month"
      y={["outerwear", "returns"]}
      names={{ outerwear: "Outerwear", returns: "All orders" }}
      format="{value}%"
      zero
      title="The return rate rose from 8.4% in July to 11.4% in October"
      subtitle="Share of orders returned by month of order, all orders and outerwear"
      annotations={[{ type: "line", axis: "x", value: "2024-08-01", label: "Free returns" }]}
    />,
    <BarChart
      data={[
        { category: "Outerwear", revenue: 412, change: 0.31, returns: 19.2 },
        { category: "Footwear", revenue: 371, change: 0.08, returns: 14.1 },
        { category: "Knitwear", revenue: 298, change: 0.22, returns: 9.8 },
        { category: "Accessories", revenue: 164, change: -0.04, returns: 4.2 },
        { category: "Denim", revenue: 152, change: -0.11, returns: 12.6 },
        { category: "Home", revenue: 88, change: 0.02, returns: 3.1 },
      ]}
      x="category"
      y="returns"
      sort="desc"
      orientation="horizontal"
      format="{value}%"
      highlight="Outerwear"
      title="19.2% of outerwear orders were returned in October"
      subtitle="Return rate by category, October"
    />,
  ]}
  notes={[
    {
      title: "Returns cost about €62k in October",
      text: "About 2,840 parcels came back. Carriage and handling cost €22 a parcel. At September's return rate of 10.5% the cost would have been about €58k.",
    },
    {
      title: "62% of outerwear returns give “too small” as the reason",
      text: "A size guide goes into test on 4 November.",
    },
    {
      title: "Orders were highest in December 2023 at 26,900",
      text: "October 2024 was the second-highest month of the 12.",
    },
  ]}
  sources={["Store order database", "Returns portal"]}
  period="November 2023 to October 2024"
  method="Return rate is by month of order and is revised for 30 days as parcels arrive."
  note="Illustrative data"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "scorecard",
  "theme": "noir",
  "kicker": "Online store scorecard",
  "reportPeriod": "October 2024",
  "title": "Orders rose 12% in October to 24,900",
  "deck": "The return rate was 11.4%. It was 8.4% in July, the month before free returns launched. Outerwear had the highest return rate at 19.2%.",
  "kpis": {
    "data": [
      {
        "month": "2023-11-01",
        "orders": 18200,
        "conversion": 2.61,
        "aov": 64.1,
        "returns": 8.1,
        "outerwear": 13
      },
      {
        "month": "2023-12-01",
        "orders": 26900,
        "conversion": 3.02,
        "aov": 66.8,
        "returns": 8.4,
        "outerwear": 13.2
      },
      {
        "month": "2024-01-01",
        "orders": 17100,
        "conversion": 2.55,
        "aov": 63,
        "returns": 9,
        "outerwear": 13.6
      },
      {
        "month": "2024-02-01",
        "orders": 16400,
        "conversion": 2.58,
        "aov": 62.4,
        "returns": 8.2,
        "outerwear": 13.1
      },
      {
        "month": "2024-03-01",
        "orders": 17900,
        "conversion": 2.66,
        "aov": 62.9,
        "returns": 8,
        "outerwear": 12.9
      },
      {
        "month": "2024-04-01",
        "orders": 18800,
        "conversion": 2.71,
        "aov": 62.2,
        "returns": 7.9,
        "outerwear": 13.3
      },
      {
        "month": "2024-05-01",
        "orders": 19600,
        "conversion": 2.74,
        "aov": 61.8,
        "returns": 8.3,
        "outerwear": 13
      },
      {
        "month": "2024-06-01",
        "orders": 19900,
        "conversion": 2.78,
        "aov": 61.5,
        "returns": 8.1,
        "outerwear": 13.4
      },
      {
        "month": "2024-07-01",
        "orders": 20400,
        "conversion": 2.83,
        "aov": 61.9,
        "returns": 8.4,
        "outerwear": 13.2
      },
      {
        "month": "2024-08-01",
        "orders": 21300,
        "conversion": 2.9,
        "aov": 61.2,
        "returns": 9.6,
        "outerwear": 13.5
      },
      {
        "month": "2024-09-01",
        "orders": 22200,
        "conversion": 2.97,
        "aov": 60.8,
        "returns": 10.5,
        "outerwear": 16.1
      },
      {
        "month": "2024-10-01",
        "orders": 24900,
        "conversion": 3.1,
        "aov": 61,
        "returns": 11.4,
        "outerwear": 17.8
      }
    ],
    "x": "month",
    "compare": "previous",
    "metrics": [
      {
        "variant": "area",
        "y": "orders",
        "label": "Orders",
        "format": "compact",
        "deltaLabel": "vs September"
      },
      {
        "variant": "area",
        "y": "conversion",
        "label": "Conversion rate",
        "format": "{value}%",
        "delta": "+0.13 pts",
        "deltaLabel": "vs September"
      },
      {
        "variant": "area",
        "y": "aov",
        "label": "Average order value",
        "format": "currency:EUR",
        "deltaLabel": "vs September"
      },
      {
        "variant": "area",
        "y": "returns",
        "label": "Return rate",
        "format": "{value}%",
        "delta": "+0.9 pts",
        "upIsGood": false,
        "deltaLabel": "vs September"
      }
    ]
  },
  "ranking": {
    "data": [
      { "category": "Outerwear", "revenue": 412, "change": 0.31, "returns": 19.2 },
      { "category": "Footwear", "revenue": 371, "change": 0.08, "returns": 14.1 },
      { "category": "Knitwear", "revenue": 298, "change": 0.22, "returns": 9.8 },
      { "category": "Accessories", "revenue": 164, "change": -0.04, "returns": 4.2 },
      { "category": "Denim", "revenue": 152, "change": -0.11, "returns": 12.6 },
      { "category": "Home", "revenue": 88, "change": 0.02, "returns": 3.1 }
    ],
    "name": "category",
    "value": "revenue",
    "change": "change",
    "format": "€{value}k",
    "highlight": "Outerwear",
    "title": "Outerwear revenue rose 31% to €412k in October",
    "subtitle": "Revenue by category, October, with change on September"
  },
  "trends": [
    {
      "type": "line-chart",
      "data": [
        {
          "month": "2023-11-01",
          "orders": 18200,
          "conversion": 2.61,
          "aov": 64.1,
          "returns": 8.1,
          "outerwear": 13
        },
        {
          "month": "2023-12-01",
          "orders": 26900,
          "conversion": 3.02,
          "aov": 66.8,
          "returns": 8.4,
          "outerwear": 13.2
        },
        {
          "month": "2024-01-01",
          "orders": 17100,
          "conversion": 2.55,
          "aov": 63,
          "returns": 9,
          "outerwear": 13.6
        },
        {
          "month": "2024-02-01",
          "orders": 16400,
          "conversion": 2.58,
          "aov": 62.4,
          "returns": 8.2,
          "outerwear": 13.1
        },
        {
          "month": "2024-03-01",
          "orders": 17900,
          "conversion": 2.66,
          "aov": 62.9,
          "returns": 8,
          "outerwear": 12.9
        },
        {
          "month": "2024-04-01",
          "orders": 18800,
          "conversion": 2.71,
          "aov": 62.2,
          "returns": 7.9,
          "outerwear": 13.3
        },
        {
          "month": "2024-05-01",
          "orders": 19600,
          "conversion": 2.74,
          "aov": 61.8,
          "returns": 8.3,
          "outerwear": 13
        },
        {
          "month": "2024-06-01",
          "orders": 19900,
          "conversion": 2.78,
          "aov": 61.5,
          "returns": 8.1,
          "outerwear": 13.4
        },
        {
          "month": "2024-07-01",
          "orders": 20400,
          "conversion": 2.83,
          "aov": 61.9,
          "returns": 8.4,
          "outerwear": 13.2
        },
        {
          "month": "2024-08-01",
          "orders": 21300,
          "conversion": 2.9,
          "aov": 61.2,
          "returns": 9.6,
          "outerwear": 13.5
        },
        {
          "month": "2024-09-01",
          "orders": 22200,
          "conversion": 2.97,
          "aov": 60.8,
          "returns": 10.5,
          "outerwear": 16.1
        },
        {
          "month": "2024-10-01",
          "orders": 24900,
          "conversion": 3.1,
          "aov": 61,
          "returns": 11.4,
          "outerwear": 17.8
        }
      ],
      "x": "month",
      "y": ["outerwear", "returns"],
      "names": { "outerwear": "Outerwear", "returns": "All orders" },
      "format": "{value}%",
      "zero": true,
      "title": "The return rate rose from 8.4% in July to 11.4% in October",
      "subtitle": "Share of orders returned by month of order, all orders and outerwear",
      "annotations": [{ "type": "line", "axis": "x", "value": "2024-08-01", "label": "Free returns" }]
    },
    {
      "type": "bar-chart",
      "data": [
        { "category": "Outerwear", "revenue": 412, "change": 0.31, "returns": 19.2 },
        { "category": "Footwear", "revenue": 371, "change": 0.08, "returns": 14.1 },
        { "category": "Knitwear", "revenue": 298, "change": 0.22, "returns": 9.8 },
        { "category": "Accessories", "revenue": 164, "change": -0.04, "returns": 4.2 },
        { "category": "Denim", "revenue": 152, "change": -0.11, "returns": 12.6 },
        { "category": "Home", "revenue": 88, "change": 0.02, "returns": 3.1 }
      ],
      "x": "category",
      "y": "returns",
      "sort": "desc",
      "orientation": "horizontal",
      "format": "{value}%",
      "highlight": "Outerwear",
      "title": "19.2% of outerwear orders were returned in October",
      "subtitle": "Return rate by category, October"
    }
  ],
  "notes": [
    {
      "title": "Returns cost about €62k in October",
      "text": "About 2,840 parcels came back. Carriage and handling cost €22 a parcel. At September's return rate of 10.5% the cost would have been about €58k."
    },
    {
      "title": "62% of outerwear returns give “too small” as the reason",
      "text": "A size guide goes into test on 4 November."
    },
    {
      "title": "Orders were highest in December 2023 at 26,900",
      "text": "October 2024 was the second-highest month of the 12."
    }
  ],
  "sources": ["Store order database", "Returns portal"],
  "period": "November 2023 to October 2024",
  "method": "Return rate is by month of order and is revised for 30 days as parcels arrive.",
  "note": "Illustrative data"
}
```

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

## Composition

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [kpi-grid](https://insightcharts.dev/llms/kpi-grid.md), [ranked-list](https://insightcharts.dev/llms/ranked-list.md), [comparison-table](https://insightcharts.dev/llms/comparison-table.md), [prose](https://insightcharts.dev/llms/prose.md), [source-note](https://insightcharts.dev/llms/source-note.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [bullet-chart](https://insightcharts.dev/llms/bullet-chart.md)
- Used by: no molecule or template yet

## More examples

### Sport: a table instead of a ranking

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

### Support desk: weekly, stacked channels and targets

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

## Links

- Registry item: https://insightcharts.dev/r/scorecard.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/scorecard.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
