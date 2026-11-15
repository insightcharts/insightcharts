import { LineChart } from "@/components/insightcharts/atoms/line-chart";

const data = [
  { year: "2019", solar: 2.7, wind: 5.3 },
  { year: "2020", solar: 3.2, wind: 5.9 },
  { year: "2021", solar: 3.7, wind: 6.5 },
  { year: "2022", solar: 4.6, wind: 7.3 },
  { year: "2023", solar: 5.5, wind: 7.8 },
];

export function LineChartDemo() {
  return (
    <LineChart
      data={data}
      x="year"
      y={["solar", "wind"]}
      format="{value}%"
      title="Solar's share rose from 2.7% to 5.5% between 2019 and 2023"
    />
  );
}
