import { PictogramChart } from "@/components/insightcharts/atoms/pictogram-chart";

const data = [
  { city: "Tokyo", people: 37.1 },
  { city: "Delhi", people: 33.8 },
  { city: "Shanghai", people: 29.9 },
  { city: "São Paulo", people: 22.8 },
  { city: "Mexico City", people: 22.5 },
];

export function PictogramChartDemo() {
  return (
    <PictogramChart
      data={data}
      name="city"
      value="people"
      unit={2}
      unitLabel="2 million people"
      format="{value}m"
      highlight="Delhi"
      title="Delhi had 33.8 million people in 2024, 3.3 million fewer than Tokyo"
      subtitle="Population of the five largest urban agglomerations, 2024"
      source="UN World Urbanization Prospects"
      note="Figures are approximate, for illustration"
    />
  );
}
