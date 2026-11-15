# Build a Data explorer with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Data explorer (`data-explorer`, a template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A set of linked charts over one shared dataset that filter each other. It has a headline, a sentence of instructions with filter chips, a row of figures that recompute from the filtered rows, two to four charts and an optional detail table. It opens on selections the author chooses.

Use it when: Use it when readers will want to filter the data themselves after seeing the main finding. State the finding with its number in the headline. Set `initialSelections` so the piece opens on the view the headline describes. Use the figures and the `finding` callout to give the numbers for that view. Keep to one dataset and two to four small, plain charts. Readers click the charts to filter, so keep them all the same size.

Pick something else when: A fixed message that needs no exploration (use `executive-brief` or `visual-essay`). Charts over unrelated datasets, which cannot filter each other. More than four charts or five figures.

Instructions for the alternatives: `executive-brief` https://insightcharts.dev/agents/templates/executive-brief.md, `visual-essay` https://insightcharts.dev/agents/templates/visual-essay.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/data-explorer
```

The file lands at `components/insightcharts/templates/data-explorer.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { DataExplorer } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  {
    "rider": "Member",
    "day": "Weekday",
    "daypart": "Morning",
    "district": "Centre",
    "trips": 198,
    "minutes": 2376
  },
  {
    "rider": "Member",
    "day": "Weekday",
    "daypart": "Morning",
    "district": "Riverside",
    "trips": 114,
    "minutes": 1368
  },
  {
    "rider": "Member",
    "day": "Weekday",
    "daypart": "Morning",
    "district": "University",
    "trips": 125,
    "minutes": 1500
  }
]
```

How the example maps columns to props:

- `unit` = `"trips"`. Noun for what the figures total, used in figure context ("3,650 across all trips").

With the user's data, keep the props and change the column names.

## 5. Working example

```tsx
import { BarChart, DataExplorer, DonutChart, LollipopChart } from "insightcharts";

const data = [
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Morning",
    district: "Centre",
    trips: 198,
    minutes: 2376,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Morning",
    district: "Riverside",
    trips: 114,
    minutes: 1368,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Morning",
    district: "University",
    trips: 125,
    minutes: 1500,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Morning",
    district: "Docklands",
    trips: 83,
    minutes: 996,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Midday",
    district: "Centre",
    trips: 99,
    minutes: 1188,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Midday",
    district: "Riverside",
    trips: 57,
    minutes: 684,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Midday",
    district: "University",
    trips: 62,
    minutes: 744,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Midday",
    district: "Docklands",
    trips: 42,
    minutes: 504,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Evening",
    district: "Centre",
    trips: 213,
    minutes: 2556,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Evening",
    district: "Riverside",
    trips: 123,
    minutes: 1476,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Evening",
    district: "University",
    trips: 134,
    minutes: 1608,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Evening",
    district: "Docklands",
    trips: 90,
    minutes: 1080,
  },
  { rider: "Member", day: "Weekday", daypart: "Night", district: "Centre", trips: 46, minutes: 552 },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Night",
    district: "Riverside",
    trips: 26,
    minutes: 312,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Night",
    district: "University",
    trips: 29,
    minutes: 348,
  },
  {
    rider: "Member",
    day: "Weekday",
    daypart: "Night",
    district: "Docklands",
    trips: 19,
    minutes: 228,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Morning",
    district: "Centre",
    trips: 57,
    minutes: 684,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Morning",
    district: "Riverside",
    trips: 33,
    minutes: 396,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Morning",
    district: "University",
    trips: 36,
    minutes: 432,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Morning",
    district: "Docklands",
    trips: 24,
    minutes: 288,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Midday",
    district: "Centre",
    trips: 114,
    minutes: 1368,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Midday",
    district: "Riverside",
    trips: 66,
    minutes: 792,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Midday",
    district: "University",
    trips: 72,
    minutes: 864,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Midday",
    district: "Docklands",
    trips: 48,
    minutes: 576,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Evening",
    district: "Centre",
    trips: 84,
    minutes: 1008,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Evening",
    district: "Riverside",
    trips: 48,
    minutes: 576,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Evening",
    district: "University",
    trips: 53,
    minutes: 636,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Evening",
    district: "Docklands",
    trips: 35,
    minutes: 420,
  },
  { rider: "Member", day: "Weekend", daypart: "Night", district: "Centre", trips: 34, minutes: 408 },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Night",
    district: "Riverside",
    trips: 20,
    minutes: 240,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Night",
    district: "University",
    trips: 22,
    minutes: 264,
  },
  {
    rider: "Member",
    day: "Weekend",
    daypart: "Night",
    district: "Docklands",
    trips: 14,
    minutes: 168,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Morning",
    district: "Centre",
    trips: 18,
    minutes: 342,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Morning",
    district: "Riverside",
    trips: 24,
    minutes: 456,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Morning",
    district: "University",
    trips: 10,
    minutes: 190,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Morning",
    district: "Docklands",
    trips: 8,
    minutes: 152,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Midday",
    district: "Centre",
    trips: 54,
    minutes: 1026,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Midday",
    district: "Riverside",
    trips: 72,
    minutes: 1368,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Midday",
    district: "University",
    trips: 29,
    minutes: 551,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Midday",
    district: "Docklands",
    trips: 25,
    minutes: 475,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Evening",
    district: "Centre",
    trips: 42,
    minutes: 798,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Evening",
    district: "Riverside",
    trips: 56,
    minutes: 1064,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Evening",
    district: "University",
    trips: 22,
    minutes: 418,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Evening",
    district: "Docklands",
    trips: 20,
    minutes: 380,
  },
  { rider: "Casual", day: "Weekday", daypart: "Night", district: "Centre", trips: 15, minutes: 285 },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Night",
    district: "Riverside",
    trips: 20,
    minutes: 380,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Night",
    district: "University",
    trips: 8,
    minutes: 152,
  },
  {
    rider: "Casual",
    day: "Weekday",
    daypart: "Night",
    district: "Docklands",
    trips: 7,
    minutes: 133,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Morning",
    district: "Centre",
    trips: 27,
    minutes: 729,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Morning",
    district: "Riverside",
    trips: 36,
    minutes: 972,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Morning",
    district: "University",
    trips: 14,
    minutes: 378,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Morning",
    district: "Docklands",
    trips: 13,
    minutes: 351,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Midday",
    district: "Centre",
    trips: 156,
    minutes: 4212,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Midday",
    district: "Riverside",
    trips: 208,
    minutes: 5616,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Midday",
    district: "University",
    trips: 83,
    minutes: 2241,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Midday",
    district: "Docklands",
    trips: 73,
    minutes: 1971,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Evening",
    district: "Centre",
    trips: 93,
    minutes: 2511,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Evening",
    district: "Riverside",
    trips: 124,
    minutes: 3348,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Evening",
    district: "University",
    trips: 50,
    minutes: 1350,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Evening",
    district: "Docklands",
    trips: 43,
    minutes: 1161,
  },
  { rider: "Casual", day: "Weekend", daypart: "Night", district: "Centre", trips: 24, minutes: 648 },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Night",
    district: "Riverside",
    trips: 32,
    minutes: 864,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Night",
    district: "University",
    trips: 13,
    minutes: 351,
  },
  {
    rider: "Casual",
    day: "Weekend",
    daypart: "Night",
    district: "Docklands",
    trips: 11,
    minutes: 297,
  },
];

<DataExplorer
  theme="science"
  kicker="City bike share · June"
  title="Casual riders' trips averaged 24.6 minutes in June, against 12.0 for members"
  deck="70% of casual trips were at weekends. 40% started in Riverside. The view below is filtered to casual riders."
  instructions="Click a bar to filter the other charts and the figures. Click it again to clear."
  finding={{
    lead: "Casual riders made 1.43 million of the 3.65 million trips in June",
    body: "520,000 of them were at weekend middays. Members made 34% of their trips at weekends.",
  }}
  data={data}
  unit="trips"
  figuresVariant="outline-accent"
  labels={{ rider: "Rider", daypart: "Time of day", district: "District", day: "Day" }}
  initialSelections={{ "by-rider": { field: "rider", values: ["Casual"] } }}
  figures={[
    { label: "Trips, thousands", field: "trips", format: "integer" },
    { label: "Average trip length, minutes", field: "minutes", per: "trips", format: "decimal:1" },
    {
      label: "Share taken at weekends",
      field: "trips",
      where: { field: "day", value: "Weekend" },
      per: "trips",
      format: "percent",
    },
    {
      label: "Share starting in Riverside",
      field: "trips",
      where: { field: "district", value: "Riverside" },
      per: "trips",
      format: "percent",
    },
  ]}
  charts={[
    <DonutChart
      id="by-rider"
      name="rider"
      value="trips"
      select
      format="integer"
      height={220}
      title="Rider"
      subtitle="Trips, thousands"
      transform={{ type: "aggregate", groupBy: "rider", measures: { trips: { op: "sum", field: "trips" } } }}
    />,
    <BarChart
      id="by-day"
      x="day"
      y="trips"
      select
      sort="none"
      orientation="horizontal"
      format="integer"
      title="Day"
      subtitle="Trips, thousands"
      transform={{ type: "aggregate", groupBy: "day", measures: { trips: { op: "sum", field: "trips" } } }}
    />,
    <BarChart
      id="by-daypart"
      x="daypart"
      y="trips"
      select
      sort="none"
      orientation="vertical"
      format="integer"
      height={220}
      title="Time of day"
      subtitle="Trips, thousands"
      transform={{ type: "aggregate", groupBy: "daypart", measures: { trips: { op: "sum", field: "trips" } } }}
    />,
    <LollipopChart
      id="by-district"
      x="district"
      y="trips"
      select
      sort="desc"
      format="integer"
      title="Start district"
      subtitle="Trips, thousands"
      transform={{ type: "aggregate", groupBy: "district", measures: { trips: { op: "sum", field: "trips" } } }}
    />,
  ]}
  table={{
    caption: "Selected trips by start district and time of day",
    transform: [
      {
        type: "aggregate",
        groupBy: ["district", "daypart"],
        measures: { trips: { op: "sum", field: "trips" }, minutes: { op: "sum", field: "minutes" } },
      },
      { type: "derive", as: "length", op: "divide", fields: ["minutes", "trips"] },
      { type: "sort", by: "trips", order: "desc" },
      { type: "limit", n: 6 },
    ],
    columns: [
      { key: "district", label: "District" },
      { key: "daypart", label: "Time of day" },
      { key: "trips", label: "Trips, thousands", format: "integer", bar: true, width: "34%" },
      { key: "length", label: "Average minutes", format: "decimal:1" },
    ],
  }}
  sources="City bike-share operator, trip records"
  period="June 2024"
  method="A trip is a hire of more than one minute. Morning is 6 to 10am, evening 4 to 8pm."
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "data-explorer",
  "theme": "science",
  "kicker": "City bike share · June",
  "title": "Casual riders' trips averaged 24.6 minutes in June, against 12.0 for members",
  "deck": "70% of casual trips were at weekends. 40% started in Riverside. The view below is filtered to casual riders.",
  "instructions": "Click a bar to filter the other charts and the figures. Click it again to clear.",
  "finding": {
    "lead": "Casual riders made 1.43 million of the 3.65 million trips in June",
    "body": "520,000 of them were at weekend middays. Members made 34% of their trips at weekends."
  },
  "data": [
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Morning",
      "district": "Centre",
      "trips": 198,
      "minutes": 2376
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Morning",
      "district": "Riverside",
      "trips": 114,
      "minutes": 1368
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Morning",
      "district": "University",
      "trips": 125,
      "minutes": 1500
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Morning",
      "district": "Docklands",
      "trips": 83,
      "minutes": 996
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Midday",
      "district": "Centre",
      "trips": 99,
      "minutes": 1188
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Midday",
      "district": "Riverside",
      "trips": 57,
      "minutes": 684
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Midday",
      "district": "University",
      "trips": 62,
      "minutes": 744
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Midday",
      "district": "Docklands",
      "trips": 42,
      "minutes": 504
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Evening",
      "district": "Centre",
      "trips": 213,
      "minutes": 2556
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Evening",
      "district": "Riverside",
      "trips": 123,
      "minutes": 1476
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Evening",
      "district": "University",
      "trips": 134,
      "minutes": 1608
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Evening",
      "district": "Docklands",
      "trips": 90,
      "minutes": 1080
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Night",
      "district": "Centre",
      "trips": 46,
      "minutes": 552
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Night",
      "district": "Riverside",
      "trips": 26,
      "minutes": 312
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Night",
      "district": "University",
      "trips": 29,
      "minutes": 348
    },
    {
      "rider": "Member",
      "day": "Weekday",
      "daypart": "Night",
      "district": "Docklands",
      "trips": 19,
      "minutes": 228
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Morning",
      "district": "Centre",
      "trips": 57,
      "minutes": 684
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Morning",
      "district": "Riverside",
      "trips": 33,
      "minutes": 396
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Morning",
      "district": "University",
      "trips": 36,
      "minutes": 432
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Morning",
      "district": "Docklands",
      "trips": 24,
      "minutes": 288
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Midday",
      "district": "Centre",
      "trips": 114,
      "minutes": 1368
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Midday",
      "district": "Riverside",
      "trips": 66,
      "minutes": 792
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Midday",
      "district": "University",
      "trips": 72,
      "minutes": 864
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Midday",
      "district": "Docklands",
      "trips": 48,
      "minutes": 576
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Evening",
      "district": "Centre",
      "trips": 84,
      "minutes": 1008
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Evening",
      "district": "Riverside",
      "trips": 48,
      "minutes": 576
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Evening",
      "district": "University",
      "trips": 53,
      "minutes": 636
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Evening",
      "district": "Docklands",
      "trips": 35,
      "minutes": 420
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Night",
      "district": "Centre",
      "trips": 34,
      "minutes": 408
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Night",
      "district": "Riverside",
      "trips": 20,
      "minutes": 240
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Night",
      "district": "University",
      "trips": 22,
      "minutes": 264
    },
    {
      "rider": "Member",
      "day": "Weekend",
      "daypart": "Night",
      "district": "Docklands",
      "trips": 14,
      "minutes": 168
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Morning",
      "district": "Centre",
      "trips": 18,
      "minutes": 342
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Morning",
      "district": "Riverside",
      "trips": 24,
      "minutes": 456
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Morning",
      "district": "University",
      "trips": 10,
      "minutes": 190
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Morning",
      "district": "Docklands",
      "trips": 8,
      "minutes": 152
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Midday",
      "district": "Centre",
      "trips": 54,
      "minutes": 1026
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Midday",
      "district": "Riverside",
      "trips": 72,
      "minutes": 1368
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Midday",
      "district": "University",
      "trips": 29,
      "minutes": 551
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Midday",
      "district": "Docklands",
      "trips": 25,
      "minutes": 475
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Evening",
      "district": "Centre",
      "trips": 42,
      "minutes": 798
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Evening",
      "district": "Riverside",
      "trips": 56,
      "minutes": 1064
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Evening",
      "district": "University",
      "trips": 22,
      "minutes": 418
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Evening",
      "district": "Docklands",
      "trips": 20,
      "minutes": 380
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Night",
      "district": "Centre",
      "trips": 15,
      "minutes": 285
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Night",
      "district": "Riverside",
      "trips": 20,
      "minutes": 380
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Night",
      "district": "University",
      "trips": 8,
      "minutes": 152
    },
    {
      "rider": "Casual",
      "day": "Weekday",
      "daypart": "Night",
      "district": "Docklands",
      "trips": 7,
      "minutes": 133
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Morning",
      "district": "Centre",
      "trips": 27,
      "minutes": 729
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Morning",
      "district": "Riverside",
      "trips": 36,
      "minutes": 972
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Morning",
      "district": "University",
      "trips": 14,
      "minutes": 378
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Morning",
      "district": "Docklands",
      "trips": 13,
      "minutes": 351
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Midday",
      "district": "Centre",
      "trips": 156,
      "minutes": 4212
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Midday",
      "district": "Riverside",
      "trips": 208,
      "minutes": 5616
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Midday",
      "district": "University",
      "trips": 83,
      "minutes": 2241
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Midday",
      "district": "Docklands",
      "trips": 73,
      "minutes": 1971
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Evening",
      "district": "Centre",
      "trips": 93,
      "minutes": 2511
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Evening",
      "district": "Riverside",
      "trips": 124,
      "minutes": 3348
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Evening",
      "district": "University",
      "trips": 50,
      "minutes": 1350
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Evening",
      "district": "Docklands",
      "trips": 43,
      "minutes": 1161
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Night",
      "district": "Centre",
      "trips": 24,
      "minutes": 648
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Night",
      "district": "Riverside",
      "trips": 32,
      "minutes": 864
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Night",
      "district": "University",
      "trips": 13,
      "minutes": 351
    },
    {
      "rider": "Casual",
      "day": "Weekend",
      "daypart": "Night",
      "district": "Docklands",
      "trips": 11,
      "minutes": 297
    }
  ],
  "unit": "trips",
  "figuresVariant": "outline-accent",
  "labels": { "rider": "Rider", "daypart": "Time of day", "district": "District", "day": "Day" },
  "initialSelections": { "by-rider": { "field": "rider", "values": ["Casual"] } },
  "figures": [
    { "label": "Trips, thousands", "field": "trips", "format": "integer" },
    {
      "label": "Average trip length, minutes",
      "field": "minutes",
      "per": "trips",
      "format": "decimal:1"
    },
    {
      "label": "Share taken at weekends",
      "field": "trips",
      "where": { "field": "day", "value": "Weekend" },
      "per": "trips",
      "format": "percent"
    },
    {
      "label": "Share starting in Riverside",
      "field": "trips",
      "where": { "field": "district", "value": "Riverside" },
      "per": "trips",
      "format": "percent"
    }
  ],
  "charts": [
    {
      "type": "donut-chart",
      "id": "by-rider",
      "name": "rider",
      "value": "trips",
      "select": true,
      "format": "integer",
      "height": 220,
      "title": "Rider",
      "subtitle": "Trips, thousands",
      "transform": {
        "type": "aggregate",
        "groupBy": "rider",
        "measures": { "trips": { "op": "sum", "field": "trips" } }
      }
    },
    {
      "type": "bar-chart",
      "id": "by-day",
      "x": "day",
      "y": "trips",
      "select": true,
      "sort": "none",
      "orientation": "horizontal",
      "format": "integer",
      "title": "Day",
      "subtitle": "Trips, thousands",
      "transform": {
        "type": "aggregate",
        "groupBy": "day",
        "measures": { "trips": { "op": "sum", "field": "trips" } }
      }
    },
    {
      "type": "bar-chart",
      "id": "by-daypart",
      "x": "daypart",
      "y": "trips",
      "select": true,
      "sort": "none",
      "orientation": "vertical",
      "format": "integer",
      "height": 220,
      "title": "Time of day",
      "subtitle": "Trips, thousands",
      "transform": {
        "type": "aggregate",
        "groupBy": "daypart",
        "measures": { "trips": { "op": "sum", "field": "trips" } }
      }
    },
    {
      "type": "lollipop-chart",
      "id": "by-district",
      "x": "district",
      "y": "trips",
      "select": true,
      "sort": "desc",
      "format": "integer",
      "title": "Start district",
      "subtitle": "Trips, thousands",
      "transform": {
        "type": "aggregate",
        "groupBy": "district",
        "measures": { "trips": { "op": "sum", "field": "trips" } }
      }
    }
  ],
  "table": {
    "caption": "Selected trips by start district and time of day",
    "transform": [
      {
        "type": "aggregate",
        "groupBy": ["district", "daypart"],
        "measures": {
          "trips": { "op": "sum", "field": "trips" },
          "minutes": { "op": "sum", "field": "minutes" }
        }
      },
      { "type": "derive", "as": "length", "op": "divide", "fields": ["minutes", "trips"] },
      { "type": "sort", "by": "trips", "order": "desc" },
      { "type": "limit", "n": 6 }
    ],
    "columns": [
      { "key": "district", "label": "District" },
      { "key": "daypart", "label": "Time of day" },
      {
        "key": "trips",
        "label": "Trips, thousands",
        "format": "integer",
        "bar": true,
        "width": "34%"
      },
      { "key": "length", "label": "Average minutes", "format": "decimal:1" }
    ]
  },
  "sources": "City bike-share operator, trip records",
  "period": "June 2024",
  "method": "A trip is a hire of more than one minute. Morning is 6 to 10am, evening 4 to 8pm.",
  "note": "Illustrative data"
}
```

This example sets `theme="science"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `finding`, `{ lead?, body?, label? }`: A callout saying what to look for in the starting view. In the example: an object with `lead`, `body`.
- `charts` (required), `Slot[]`: Two to four chart specs. Give each a stable `id`, `select: true` (or a field name) and its own aggregating `transform`; leave out `data`. In the example: 4 items: a `donut-chart` spec; a `bar-chart` spec; a `lollipop-chart` spec.
- `figures`, `{ label, field?, op?, where?: { field, value }, per?, format?, context? }[]`: Figures recomputed from the filtered rows: `op` over `field` (default sum; count without a field), optionally restricted by `where` and divided by the sum of `per` for a rate or share. While a filter is active each shows the all-rows value as context. In the example: 4 items: an object with `label`, `field`, `format`; an object with `label`, `field`, `per`, `format`; an object with `label`, `field`, `where`, `per`, `format`.
- `figuresVariant`, `StatRowProps["variant"]`: How the figures are displayed: any `variant` of `stat-row`, e.g. `tiles`, `tinted` or `outline-accent`. Extra fields on a figure (`tone`, `surface`, `icon`...) are passed to its `stat-row` item. In the example: `"outline-accent"`.
- `table`, `{ transform?, columns?, caption?, sort?, highlight?, ... }`: A detail table of the filtered rows: the props of `data-table` without `rows`, plus a `transform` applied first. In the example: an object with `caption`, `transform`, `columns`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | What the starting view shows, as one plain sentence with the number in it. |
| `kicker` | `string` |  | Small label above the title. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. |
| `instructions` | `string` |  | One sentence saying what can be clicked and what happens. Shown in the filter line. |
| `finding` | `{ lead?, body?, label? }` |  | A callout saying what to look for in the starting view. |
| `data` (required) | `DataInput` |  | The shared, row-level dataset: rows, CSV text, a URL or a loader. |
| `transform` | `Transform \| Transform[]` |  | Applied once to the shared data. |
| `charts` (required) | `Slot[]` |  | Two to four chart specs. Give each a stable `id`, `select: true` (or a field name) and its own aggregating `transform`; leave out `data`. |
| `initialSelections` | `Record<string, { field, values?, range? }>` |  | Selections the piece opens with, keyed by chart `id`. A button restores them after the reader changes the filter. |
| `figures` | `{ label, field?, op?, where?: { field, value }, per?, format?, context? }[]` |  | Figures recomputed from the filtered rows: `op` over `field` (default sum; count without a field), optionally restricted by `where` and divided by the sum of `per` for a rate or share. While a filter is active each shows the all-rows value as context. |
| `figuresVariant` | `StatRowProps["variant"]` | `"plain"` | How the figures are displayed: any `variant` of `stat-row`, e.g. `tiles`, `tinted` or `outline-accent`. Extra fields on a figure (`tone`, `surface`, `icon`...) are passed to its `stat-row` item. |
| `table` | `{ transform?, columns?, caption?, sort?, highlight?, ... }` |  | A detail table of the filtered rows: the props of `data-table` without `rows`, plus a `transform` applied first. |
| `labels` | `Record<string, string>` |  | Display names for fields in the filter chips. |
| `unit` | `string` | `"rows"` | Noun for what the figures total, used in figure context ("3,650 across all trips"). |
| `count` | `boolean` | `false` | Show the filtered row count beside the chips. |
| `rowUnit` | `string` | `"rows"` | Noun for one row of `data` in that count. |
| `columns` | `number` |  | Preferred chart columns. |
| `restoreLabel` | `string` | `"Back to the starting view"` | Label of the button that restores `initialSelections`. |
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

- Built from: `headline` (atom), `callout` (atom), `filter-chips` (molecule), `stat-row` (molecule), `linked-charts` (molecule), `data-table` (atom), `source-note` (atom), `bar-chart` (atom), `donut-chart` (atom), `lollipop-chart` (atom), `segmented-bar` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each step or section states one fact. Change one thing per step.
- Each chart inside follows the rules of its own component.
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

- Component reference with every example: https://insightcharts.dev/llms/data-explorer.md
- Registry item: https://insightcharts.dev/r/data-explorer.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/data-explorer.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/data-explorer
- These instructions as plain text: https://insightcharts.dev/agents/templates/data-explorer.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
