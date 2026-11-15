import { OrbitChart } from "@/components/insightcharts/atoms/orbit-chart";

const data = [
  { supplier: "Halden Cells", tier: "Tier 1", spend: 84 },
  { supplier: "Orrin Motors", tier: "Tier 1", spend: 61 },
  { supplier: "Vale Castings", tier: "Tier 1", spend: 37 },
  { supplier: "Kestrel Wiring", tier: "Tier 2", spend: 22 },
  { supplier: "Brask Cathodes", tier: "Tier 2", spend: 48 },
  { supplier: "Lumen Glass", tier: "Tier 2", spend: 15 },
  { supplier: "Pell Magnets", tier: "Tier 2", spend: 29 },
  { supplier: "Tarn Lithium", tier: "Tier 3", spend: 33 },
  { supplier: "Iver Copper", tier: "Tier 3", spend: 19 },
  { supplier: "Sorrel Graphite", tier: "Tier 3", spend: 12 },
  { supplier: "Moss Resins", tier: "Tier 3", spend: 6 },
  { supplier: "Dunmore Nickel", tier: "Tier 3", spend: 26 },
];

export function OrbitChartDemo() {
  return (
    <OrbitChart
      theme="noir"
      data={data}
      name="supplier"
      ring="tier"
      value="spend"
      format="${value}m"
      centerLabel="Car plant"
      highlight="Brask Cathodes"
      ringLabel="Tier 1 sells to the plant, each further ring sells to the ring inside it"
      sizeLabel="annual spend"
      title="Brask Cathodes is a tier 2 supplier with $48 million of annual spend"
      subtitle="12 suppliers to one car plant by supply-chain tier, annual spend in $ million"
      note="Illustrative figures for invented companies"
    />
  );
}
