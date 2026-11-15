import { BarChart } from "@/components/insightcharts/atoms/bar-chart";

const data = [
  { country: "Norway", share: 98 },
  { country: "Brazil", share: 89 },
  { country: "Canada", share: 68 },
];

export function BarChartDemo() {
  return (
    <BarChart
      data={data}
      x="country"
      y="share"
      format="{value}%"
      title="Renewables supplied 98% of Norway's electricity in 2023"
      theme="ledger"
    />
  );
}
