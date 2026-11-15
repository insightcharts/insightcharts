import { ScatterChart } from "@/components/insightcharts/atoms/scatter-chart";

const data = [
  { country: "United States", spend: 12555, life: 77.5 },
  { country: "Switzerland", spend: 8049, life: 83.9 },
  { country: "Germany", spend: 8011, life: 80.8 },
  { country: "Norway", spend: 7771, life: 83.2 },
  { country: "Netherlands", spend: 6729, life: 81.4 },
  { country: "France", spend: 6630, life: 82.4 },
  { country: "Canada", spend: 6319, life: 81.6 },
  { country: "Sweden", spend: 6438, life: 83.1 },
  { country: "Australia", spend: 6372, life: 83.3 },
  { country: "United Kingdom", spend: 5493, life: 80.7 },
  { country: "Japan", spend: 5251, life: 84.5 },
  { country: "Italy", spend: 4291, life: 82.7 },
  { country: "Spain", spend: 4432, life: 83.3 },
  { country: "South Korea", spend: 4570, life: 83.6 },
  { country: "Portugal", spend: 4162, life: 81.5 },
  { country: "Israel", spend: 3444, life: 82.6 },
  { country: "Poland", spend: 2973, life: 76.5 },
  { country: "Chile", spend: 2699, life: 81 },
  { country: "Mexico", spend: 1181, life: 75.4 },
];

export function ScatterChartDemo() {
  return (
    <ScatterChart
      data={data}
      x="spend"
      y="life"
      label="country"
      highlight="United States"
      labels={["United States", "Japan", "Mexico", "Switzerland", "Poland"]}
      xFormat="currency:USD"
      xLabel="Health spending per person"
      yLabel="Life expectancy, years"
      title="The United States spent $12,555 per person on health in 2022"
      subtitle="Health spending per person (US$, PPP) against life expectancy at birth, OECD countries, 2022. US life expectancy was 77.5 years."
      source="OECD Health Statistics (rounded)"
      note="Figures are approximate, for illustration"
    />
  );
}
