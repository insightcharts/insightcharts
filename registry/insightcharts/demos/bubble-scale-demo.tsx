import { BubbleScale } from "@/components/insightcharts/atoms/bubble-scale";

const data = [
  { material: "Lithium", imported: 100, kt: 38 },
  { material: "Cobalt", imported: 86, kt: 21 },
  { material: "Graphite", imported: 98, kt: 96 },
  { material: "Nickel", imported: 71, kt: 164 },
  { material: "Manganese", imported: 96, kt: 52 },
  { material: "Copper", imported: 48, kt: 410 },
  { material: "Aluminium", imported: 59, kt: 290 },
  { material: "Rare earths", imported: 100, kt: 9 },
  { material: "Silicon metal", imported: 64, kt: 73 },
  { material: "Zinc", imported: 22, kt: 118 },
  { material: "Steel scrap", imported: 4, kt: 520 },
  { material: "Tin", imported: 78, kt: 14 },
];

export function BubbleScaleDemo() {
  return (
    <BubbleScale
      theme="sunrise"
      data={data}
      name="material"
      value="imported"
      size="kt"
      format="{value}%"
      sizeFormat="{value} kt"
      domain={[0, 100]}
      ticks={[0, 20, 40, 60, 80, 100]}
      scaleLabel="Imported"
      title="Imports supply between 4% and 100% of the region's demand for 12 materials"
      subtitle="Share of each material imported (position) and annual demand in thousand tonnes (area), 12 battery and grid materials"
      note="Illustrative figures for an invented region"
    />
  );
}
