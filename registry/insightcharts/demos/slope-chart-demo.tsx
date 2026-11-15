import { SlopeChart } from "@/components/insightcharts/atoms/slope-chart";

const data = [
  { country: "United Kingdom", y2012: 39, y2023: 1 },
  { country: "Germany", y2012: 44, y2023: 26 },
  { country: "United States", y2012: 37, y2023: 16 },
  { country: "Poland", y2012: 84, y2023: 61 },
  { country: "India", y2012: 71, y2023: 75 },
  { country: "Japan", y2012: 29, y2023: 32 },
];

export function SlopeChartDemo() {
  return (
    <SlopeChart
      data={data}
      series="country"
      y={["y2012", "y2023"]}
      names={{ y2012: "2012", y2023: "2023" }}
      highlight="United Kingdom"
      format="{value}%"
      title="The UK's coal share of electricity fell from 39% to 1% between 2012 and 2023"
      subtitle="Share of electricity generated from coal, 2012 and 2023"
      source="Ember (rounded)"
      note="Figures are approximate, for illustration"
    />
  );
}
