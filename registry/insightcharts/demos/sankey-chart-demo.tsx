import { SankeyChart } from "@/components/insightcharts/atoms/sankey-chart";

const data = [
  { from: "Coal", to: "Electricity", twh: 290 },
  { from: "Gas", to: "Electricity", twh: 210 },
  { from: "Gas", to: "Heat", twh: 330 },
  { from: "Wind and solar", to: "Electricity", twh: 240 },
  { from: "Nuclear", to: "Electricity", twh: 120 },
  { from: "Oil", to: "Transport", twh: 560 },
  { from: "Oil", to: "Heat", twh: 90 },
  { from: "Electricity", to: "Homes", twh: 280 },
  { from: "Electricity", to: "Industry", twh: 330 },
  { from: "Electricity", to: "Transport", twh: 30 },
  { from: "Electricity", to: "Losses", twh: 220 },
  { from: "Heat", to: "Homes", twh: 270 },
  { from: "Heat", to: "Industry", twh: 150 },
];

export function SankeyChartDemo() {
  return (
    <SankeyChart
      data={data}
      from="from"
      to="to"
      value="twh"
      format="{value} TWh"
      title="220 TWh of the 860 TWh used to generate electricity was lost"
      subtitle="Energy flows from fuel to end use, terawatt-hours per year"
      source="Illustrative national energy balance"
    />
  );
}
