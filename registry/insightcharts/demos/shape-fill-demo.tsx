import { ShapeFill } from "@/components/insightcharts/atoms/shape-fill";

const data = [
  { reservoir: "Carrow", level: 63 },
  { reservoir: "Upper Fen", level: 41 },
  { reservoir: "Stonebeck", level: 88 },
];

export function ShapeFillDemo() {
  return (
    <ShapeFill
      theme="blueprint"
      data={data}
      name="reservoir"
      value="level"
      icon="drop"
      format="{value}%"
      title="Carrow Reservoir was 63% full on 1 September 2025"
      subtitle="Water stored as a share of capacity, three reservoirs, 1 September 2025"
      source="Illustrative data"
      note="Invented figures for fictional reservoirs"
    />
  );
}
