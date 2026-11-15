import { RankedList } from "@/components/insightcharts/molecules/ranked-list";

const data = [
  { city: "Copenhagen", country: "Denmark", share: 49, change: 0.04 },
  { city: "Amsterdam", country: "Netherlands", share: 35, change: 0.01 },
  { city: "Utrecht", country: "Netherlands", share: 34, change: 0.02 },
  { city: "Münster", country: "Germany", share: 31, change: 0 },
  { city: "Antwerp", country: "Belgium", share: 26, change: 0.05 },
  { city: "Malmö", country: "Sweden", share: 25, change: -0.01 },
  { city: "Bordeaux", country: "France", share: 13, change: 0.06 },
  { city: "Paris", country: "France", share: 11, change: 0.07 },
];

export function RankedListDemo() {
  return (
    <RankedList
      title="11% of commuting trips in Paris are made by bicycle"
      subtitle="Share of commuting trips made by bicycle, selected European cities, with change since 2019"
      data={data}
      name="city"
      detail="country"
      value="share"
      format="{value}%"
      change="change"
      highlight="Paris"
      source="City mobility surveys"
      note="Illustrative data"
    />
  );
}
