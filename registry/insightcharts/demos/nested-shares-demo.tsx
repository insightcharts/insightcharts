import { NestedShares } from "@/components/insightcharts/atoms/nested-shares";

const data = [
  { year: "2005", share: 4 },
  { year: "2010", share: 7 },
  { year: "2015", share: 12 },
  { year: "2020", share: 19 },
  { year: "2025", share: 27 },
];

export function NestedSharesDemo() {
  return (
    <NestedShares
      data={data}
      name="year"
      value="share"
      format="{value}%"
      highlight="2025"
      wholeLabel="All trips in the city"
      title="Bicycles made 27% of trips in Port Aldwin in 2025"
      subtitle="Share of all trips made by bicycle, 2005 to 2025"
      source="Illustrative data"
      note="Invented figures for a fictional city"
    />
  );
}
