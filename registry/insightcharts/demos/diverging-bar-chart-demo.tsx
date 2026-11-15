import { DivergingBarChart } from "@/components/insightcharts/atoms/diverging-bar-chart";

const data = [
  { city: "Austin", change: 21.3 },
  { city: "Phoenix", change: 11.2 },
  { city: "Seattle", change: 8.1 },
  { city: "Chicago", change: -2.9 },
  { city: "San Francisco", change: -7.4 },
  { city: "St. Louis", change: -11.6 },
];

export function DivergingBarChartDemo() {
  return (
    <DivergingBarChart
      data={data}
      x="city"
      y="change"
      format="{value}%"
      height={260}
      title="Austin's population grew 21.3% between 2010 and 2020"
      subtitle="Population change, 2010 to 2020"
      note="Illustrative figures."
    />
  );
}
