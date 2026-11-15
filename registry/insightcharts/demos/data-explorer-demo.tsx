import { DataExplorer } from "@/components/insightcharts/templates/data-explorer";
import { DonutChart } from "@/components/insightcharts/atoms/donut-chart";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";
import { LollipopChart } from "@/components/insightcharts/atoms/lollipop-chart";

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

export function DataExplorerDemo() {
  return (
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
        {
          label: "Average trip length, minutes",
          field: "minutes",
          per: "trips",
          format: "decimal:1",
        },
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
          transform={{
            type: "aggregate",
            groupBy: "rider",
            measures: { trips: { op: "sum", field: "trips" } },
          }}
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
          transform={{
            type: "aggregate",
            groupBy: "daypart",
            measures: { trips: { op: "sum", field: "trips" } },
          }}
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
          transform={{
            type: "aggregate",
            groupBy: "district",
            measures: { trips: { op: "sum", field: "trips" } },
          }}
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
  );
}
