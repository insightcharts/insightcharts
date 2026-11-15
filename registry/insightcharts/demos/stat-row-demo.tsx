import { StatRow } from "@/components/insightcharts/molecules/stat-row";

export function StatRowDemo() {
  return (
    <StatRow
      title="Renewables supplied 31.7% of the world's electricity in 2024"
      subtitle="Global electricity generation, 2024"
      items={[
        {
          value: 0.317,
          format: "percent",
          label: "Share from renewables",
          delta: "+1.9 pts",
          deltaLabel: "vs 2023",
        },
        { value: 2131, label: "Solar generation, TWh", delta: 0.29, deltaLabel: "vs 2023" },
        { value: 2494, label: "Wind generation, TWh", delta: 0.079, deltaLabel: "vs 2023" },
        {
          value: 0.409,
          format: "percent",
          label: "Share from all clean sources",
          context: "Above 40% for the first time since the 1940s",
        },
      ]}
      source="Ember, Global Electricity Review 2025"
      note="Figures are approximate, for illustration"
    />
  );
}
