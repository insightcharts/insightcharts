import { BulletChart } from "@/components/insightcharts/atoms/bullet-chart";

const data = [
  { region: "North America", sales: 94, target: 80 },
  { region: "Europe", sales: 71, target: 85 },
  { region: "Asia Pacific", sales: 63, target: 60 },
  { region: "Latin America", sales: 38, target: 55 },
];

export function BulletChartDemo() {
  return (
    <BulletChart
      theme="mono"
      data={data}
      category="region"
      value="sales"
      target="target"
      bands={[50, 75, 110]}
      bandNames={["Below plan", "On plan", "Stretch"]}
      names={{ sales: "Sales", target: "Target" }}
      format="currency:USD"
      height={240}
      title="Europe sold $71 million against a target of $85 million in 2024"
      subtitle="Sales against target by region, $ millions, 2024"
      source="Company accounts"
      note="Illustrative figures."
    />
  );
}
