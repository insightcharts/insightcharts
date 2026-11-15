# Data explorer (`data-explorer`)

> A set of linked charts over one shared dataset that filter each other. It has a headline, a sentence of instructions with filter chips, a row of figures that recompute from the filtered rows, two to four charts and an optional detail table. It opens on selections the author chooses.

- Component: `DataExplorer` (import from `insightcharts`)
- Spec type: `"data-explorer"`
- Level: template. Category: story.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it when readers will want to filter the data themselves after seeing the main finding. State the finding with its number in the headline. Set `initialSelections` so the piece opens on the view the headline describes. Use the figures and the `finding` callout to give the numbers for that view. Keep to one dataset and two to four small, plain charts. Readers click the charts to filter, so keep them all the same size.

## Avoid

A fixed message that needs no exploration (use `executive-brief` or `visual-essay`). Charts over unrelated datasets, which cannot filter each other. More than four charts or five figures.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/data-explorer
```

The file lands at `components/insightcharts/templates/data-explorer.tsx`. `@insightcharts/data-explorer-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, DataExplorer } from "insightcharts";

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
    <BarChart
      id="by-rider"
      x="rider"
      y="trips"
      select
      sort="none"
      orientation="horizontal"
      format="integer"
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
    <BarChart
      id="by-district"
      x="district"
      y="trips"
      select
      sort="desc"
      orientation="horizontal"
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

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "data-explorer",
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
      "type": "bar-chart",
      "id": "by-rider",
      "x": "rider",
      "y": "trips",
      "select": true,
      "sort": "none",
      "orientation": "horizontal",
      "format": "integer",
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
      "type": "bar-chart",
      "id": "by-district",
      "x": "district",
      "y": "trips",
      "select": true,
      "sort": "desc",
      "orientation": "horizontal",
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
| `theme` | `ThemeInput` |  | Theme override, passed on to everything inside. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to everything inside. |

## Composition

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [callout](https://insightcharts.dev/llms/callout.md), [filter-chips](https://insightcharts.dev/llms/filter-chips.md), [stat-row](https://insightcharts.dev/llms/stat-row.md), [linked-charts](https://insightcharts.dev/llms/linked-charts.md), [data-table](https://insightcharts.dev/llms/data-table.md), [source-note](https://insightcharts.dev/llms/source-note.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md)
- Used by: no molecule or template yet

## More examples

### Education: rates rather than totals, two starting filters

```tsx
import { BarChart, DataExplorer } from "insightcharts";

const data = [
  { phase: "Primary", meals: "Eligible", term: "Autumn", sessions: 410, missed: 31.16 },
  { phase: "Primary", meals: "Eligible", term: "Spring", sessions: 410, missed: 34.44 },
  { phase: "Primary", meals: "Eligible", term: "Summer", sessions: 410, missed: 33.21 },
  { phase: "Primary", meals: "Not eligible", term: "Autumn", sessions: 1320, missed: 60.72 },
  { phase: "Primary", meals: "Not eligible", term: "Spring", sessions: 1320, missed: 68.64 },
  { phase: "Primary", meals: "Not eligible", term: "Summer", sessions: 1320, missed: 64.68 },
  { phase: "Secondary", meals: "Eligible", term: "Autumn", sessions: 300, missed: 39.3 },
  { phase: "Secondary", meals: "Eligible", term: "Spring", sessions: 300, missed: 43.8 },
  // ... 10 more rows
];

<DataExplorer
  kicker="School attendance · 2023/24"
  title="Secondary pupils on free school meals missed 14.5% of sessions in 2023/24"
  deck="The rate for all pupils was 7.2%. For secondary pupils on free school meals it was 13.1% in the autumn term and 15.8% in the summer term."
  instructions="Click a bar to filter the other charts and the figures. The bars show absence rates, not totals."
  data={data}
  unit="pupil groups"
  labels={{ phase: "School type", meals: "Free school meals", term: "Term" }}
  initialSelections={{
    "by-phase": { field: "phase", values: ["Secondary"] },
    "by-meals": { field: "meals", values: ["Eligible"] },
  }}
  figures={[
    {
      label: "Absence rate",
      field: "missed",
      per: "sessions",
      format: { style: "percent", maximumFractionDigits: 1 },
    },
    { label: "Sessions missed, thousands", field: "missed", format: "decimal:1" },
    { label: "Sessions possible, thousands", field: "sessions", format: "integer" },
  ]}
  charts={[
    <BarChart
      id="by-phase"
      x="phase"
      y="rate"
      select
      sort="none"
      orientation="horizontal"
      format={{ style: "percent", maximumFractionDigits: 1 }}
      title="School type"
      subtitle="Absence rate"
      transform={[
        {
          type: "aggregate",
          groupBy: "phase",
          measures: { missed: { op: "sum", field: "missed" }, sessions: { op: "sum", field: "sessions" } },
        },
        { type: "derive", as: "rate", op: "divide", fields: ["missed", "sessions"] },
      ]}
    />,
    <BarChart
      id="by-meals"
      x="meals"
      y="rate"
      select
      sort="none"
      orientation="horizontal"
      format={{ style: "percent", maximumFractionDigits: 1 }}
      title="Free school meals"
      subtitle="Absence rate"
      transform={[
        {
          type: "aggregate",
          groupBy: "meals",
          measures: { missed: { op: "sum", field: "missed" }, sessions: { op: "sum", field: "sessions" } },
        },
        { type: "derive", as: "rate", op: "divide", fields: ["missed", "sessions"] },
      ]}
    />,
    <BarChart
      id="by-term"
      x="term"
      y="rate"
      select
      sort="none"
      orientation="vertical"
      format={{ style: "percent", maximumFractionDigits: 1 }}
      height={200}
      title="Term"
      subtitle="Absence rate"
      transform={[
        {
          type: "aggregate",
          groupBy: "term",
          measures: { missed: { op: "sum", field: "missed" }, sessions: { op: "sum", field: "sessions" } },
        },
        { type: "derive", as: "rate", op: "divide", fields: ["missed", "sessions"] },
      ]}
    />,
  ]}
  sources="Local authority attendance returns"
  period="School year 2023/24"
  method="A session is half a school day. The absence rate is sessions missed, authorised or not, as a share of sessions possible."
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/data-explorer.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/data-explorer.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
