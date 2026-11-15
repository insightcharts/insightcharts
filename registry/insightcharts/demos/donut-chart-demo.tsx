import { DonutChart } from "@/components/insightcharts/atoms/donut-chart";

const data = [
  { tenure: "Own outright", households: 8.8 },
  { tenure: "Own with a mortgage", households: 7.4 },
  { tenure: "Rent privately", households: 4.9 },
  { tenure: "Rent social housing", households: 4.1 },
];

export function DonutChartDemo() {
  return (
    <DonutChart
      theme="paper"
      data={data}
      name="tenure"
      value="households"
      format="{value}m"
      centerLabel="households"
      highlight="Rent privately"
      title="4.9 million households in England rented privately in 2022-23"
      subtitle="Households by tenure, England, 2022-23"
      source="English Housing Survey"
      note="Figures are approximate, for illustration"
    />
  );
}
