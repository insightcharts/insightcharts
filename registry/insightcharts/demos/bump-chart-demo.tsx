import { BumpChart } from "@/components/insightcharts/atoms/bump-chart";

const data = [
  { year: "2019", Tesla: 0.37, BYD: 0.23, SAIC: 0.16, Volkswagen: 0.14, Hyundai: 0.13, Geely: 0.12 },
  { year: "2020", Tesla: 0.5, BYD: 0.18, SAIC: 0.27, Volkswagen: 0.42, Hyundai: 0.2, Geely: 0.1 },
  { year: "2021", Tesla: 0.94, BYD: 0.6, SAIC: 0.68, Volkswagen: 0.76, Hyundai: 0.35, Geely: 0.2 },
  { year: "2022", Tesla: 1.31, BYD: 1.86, SAIC: 0.72, Volkswagen: 0.83, Hyundai: 0.51, Geely: 0.65 },
  { year: "2023", Tesla: 1.81, BYD: 3.02, SAIC: 0.79, Volkswagen: 1, Hyundai: 0.57, Geely: 0.93 },
  { year: "2024", Tesla: 1.79, BYD: 4.27, SAIC: 0.9, Volkswagen: 1.04, Hyundai: 0.56, Geely: 1.39 },
];

export function BumpChartDemo() {
  return (
    <BumpChart
      theme="poster"
      data={data}
      x="year"
      y={["Tesla", "BYD", "SAIC", "Volkswagen", "Hyundai", "Geely"]}
      highlight="BYD"
      format="{value}m"
      height={300}
      title="BYD rose from fifth in 2020 to first in 2022"
      subtitle="Rank among six carmakers by plug-in vehicles sold worldwide, 2019 to 2024"
      source="Company reports"
      note="Approximate figures."
    />
  );
}
