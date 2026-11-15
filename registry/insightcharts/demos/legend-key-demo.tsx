import { LegendKey } from "@/components/insightcharts/atoms/legend-key";

export function LegendKeyDemo() {
  return (
    <LegendKey
      title="Source of electricity"
      items={["Solar", "Wind", "Hydro", "Gas", { label: "Other", muted: true }]}
    />
  );
}
