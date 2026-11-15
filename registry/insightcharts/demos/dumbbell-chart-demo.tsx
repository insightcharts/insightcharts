import { DumbbellChart } from "@/components/insightcharts/atoms/dumbbell-chart";

const data = [
  { country: "South Korea", y2000: 76, y2023: 83.6 },
  { country: "Turkey", y2000: 71.1, y2023: 77.3 },
  { country: "Poland", y2000: 73.8, y2023: 78.6 },
  { country: "Japan", y2000: 81.2, y2023: 84.1 },
  { country: "Germany", y2000: 78.2, y2023: 81.2 },
  { country: "United States", y2000: 76.7, y2023: 78.4 },
];

export function DumbbellChartDemo() {
  return (
    <DumbbellChart
      data={data}
      category="country"
      from="y2000"
      to="y2023"
      names={{ y2000: "2000", y2023: "2023" }}
      gapLabel="Gain"
      format="decimal:1"
      height={280}
      title="Life expectancy in South Korea rose from 76.0 years in 2000 to 83.6 in 2023"
      subtitle="Life expectancy at birth, years, 2000 and 2023"
      source="OECD Health Statistics (rounded)"
      note="Figures are approximate, for illustration"
    />
  );
}
