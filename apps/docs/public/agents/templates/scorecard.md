# Build a Scorecard with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Scorecard (`scorecard`, a template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

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

## 5. Working example

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

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

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

This example sets `theme="noir"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `kpis`, `{ data, x, metrics, compare?, change?, columns? }`: The headline metrics: the props of `kpi-grid`. One time-ordered dataset, one card per metric. In the example: a config with 12 rows of `data` and the fields `x: "month"`.
- `ranking`, `{ data, name, value, change?, highlight?, title?, ... } | Slot`: A ranking: the props of `ranked-list`, or any spec or element. In the example: a config with 6 rows of `data` and the fields `name: "category"`, `value: "revenue"`, `change: "change"`.
- `trends`, `Slot[]`: One or two trend exhibits, shown beside the ranking in wide containers. In the example: 2 items: a `line-chart` spec with 12 rows; a `bar-chart` spec with 6 rows.
- `table`, `{ data, columns, highlight?, sort?, title?, ... } | Slot`: A comparison across entities: the props of `comparison-table`, or any spec or element. Not used in the example.
- `notes`, `(string | { title, text? })[]`: Short notes on what changed in the period. Each states one fact with its number. In the example: 3 items: an object with `title`, `text`.

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

- Component reference with every example: https://insightcharts.dev/llms/scorecard.md
- Registry item: https://insightcharts.dev/r/scorecard.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/scorecard.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/scorecard
- These instructions as plain text: https://insightcharts.dev/agents/templates/scorecard.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
