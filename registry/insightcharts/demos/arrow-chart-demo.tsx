import { ArrowChart } from "@/components/insightcharts/atoms/arrow-chart";

const data = [
  { group: "Under 30", y2019: 62, y2024: 71 },
  { group: "30 to 44", y2019: 58, y2024: 63 },
  { group: "45 to 64", y2019: 49, y2024: 47 },
  { group: "65 and over", y2019: 41, y2024: 34 },
];

export function ArrowChartDemo() {
  return (
    <ArrowChart
      theme="editorial"
      data={data}
      category="group"
      from="y2019"
      to="y2024"
      names={{ y2019: "2019", y2024: "2024" }}
      format="{value}%"
      changeLabel="Change"
      height={220}
      title="Support among under-30s rose from 62% in 2019 to 71% in 2024"
      subtitle="Share in favour of the congestion charge, by age group, 2019 to 2024"
      source="City residents survey"
      note="Illustrative figures."
    />
  );
}
