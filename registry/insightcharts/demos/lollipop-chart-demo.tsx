import { LollipopChart } from "@/components/insightcharts/atoms/lollipop-chart";

const data = [
  { country: "Netherlands", share: 27 },
  { country: "Denmark", share: 19 },
  { country: "Germany", share: 10 },
  { country: "Sweden", share: 9 },
  { country: "Japan", share: 8 },
  { country: "France", share: 4 },
  { country: "United Kingdom", share: 2 },
  { country: "United States", share: 1 },
];

export function LollipopChartDemo() {
  return (
    <LollipopChart
      theme="mono"
      data={data}
      x="country"
      y="share"
      format="{value}%"
      height={300}
      title="27% of trips in the Netherlands are made by bike"
      subtitle="Share of all trips made by bicycle"
      source="National travel surveys, latest available year (rounded)"
      note="Figures are approximate, for illustration"
    />
  );
}
