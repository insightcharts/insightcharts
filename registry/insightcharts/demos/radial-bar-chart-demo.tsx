import { RadialBarChart } from "@/components/insightcharts/atoms/radial-bar-chart";

const data = [
  { hour: "00:00", trips: 2.1 },
  { hour: "01:00", trips: 1.2 },
  { hour: "02:00", trips: 0.8 },
  { hour: "03:00", trips: 0.6 },
  { hour: "04:00", trips: 0.7 },
  { hour: "05:00", trips: 1.4 },
  { hour: "06:00", trips: 3.6 },
  { hour: "07:00", trips: 6.9 },
  { hour: "08:00", trips: 8.8 },
  { hour: "09:00", trips: 6.4 },
  { hour: "10:00", trips: 5.1 },
  { hour: "11:00", trips: 5.3 },
  { hour: "12:00", trips: 5.9 },
  { hour: "13:00", trips: 5.6 },
  { hour: "14:00", trips: 5.4 },
  { hour: "15:00", trips: 6 },
  { hour: "16:00", trips: 7.4 },
  { hour: "17:00", trips: 9.2 },
  { hour: "18:00", trips: 8.1 },
  { hour: "19:00", trips: 6 },
  { hour: "20:00", trips: 4.6 },
  { hour: "21:00", trips: 3.9 },
  { hour: "22:00", trips: 3.3 },
  { hour: "23:00", trips: 2.7 },
];

export function RadialBarChartDemo() {
  return (
    <RadialBarChart
      data={data}
      x="hour"
      y="trips"
      format="{value}%"
      centerLabel="24 hours"
      highlight={["08:00", "17:00"]}
      title="Weekday bike-share trips peak at 9.2% in the 5pm hour and 8.8% in the 8am hour"
      subtitle="Share of daily bike-share trips starting in each hour, weekdays"
      source="Illustrative bike-share data"
    />
  );
}
