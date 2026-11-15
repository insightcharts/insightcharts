import { ComparisonTable } from "@/components/insightcharts/molecules/comparison-table";

const data = [
  {
    "2019": 40.1,
    "2020": 44.2,
    "2021": 40.9,
    "2022": 44.5,
    "2023": 52.6,
    "2024": 58.9,
    country: "Germany",
    share: 58.9,
    twh: 498,
  },
  {
    "2019": 37.5,
    "2020": 44.1,
    "2021": 46.7,
    "2022": 42.2,
    "2023": 50.3,
    "2024": 56.8,
    country: "Spain",
    share: 56.8,
    twh: 264,
  },
  {
    "2019": 18.2,
    "2020": 26.1,
    "2021": 33,
    "2022": 40.1,
    "2023": 47.7,
    "2024": 52.4,
    country: "Netherlands",
    share: 52.4,
    twh: 121,
  },
  {
    "2019": 39.9,
    "2020": 41.7,
    "2021": 40.3,
    "2022": 35.6,
    "2023": 43.8,
    "2024": 49,
    country: "Italy",
    share: 49,
    twh: 264,
  },
  {
    "2019": 20.9,
    "2020": 24.2,
    "2021": 22.5,
    "2022": 24.4,
    "2023": 27,
    "2024": 28.3,
    country: "France",
    share: 28.3,
    twh: 536,
  },
  {
    "2019": 14.1,
    "2020": 17.2,
    "2021": 16.9,
    "2022": 20.6,
    "2023": 26.4,
    "2024": 29.5,
    country: "Poland",
    share: 29.5,
    twh: 167,
  },
];

export function ComparisonTableDemo() {
  return (
    <ComparisonTable
      title="The Netherlands' renewable share of electricity rose from 18.2% to 52.4% between 2019 and 2024"
      subtitle="Renewable share of electricity generation, selected EU countries, 2019 to 2024"
      data={data}
      columns={[
        { key: "country", label: "Country" },
        { key: "twh", label: "Generation, TWh", kind: "bar", format: "integer", hideBelow: 560 },
        { key: "share", label: "Share, 2024", format: "{value}%" },
        {
          key: "trend",
          label: "2019 to 2024",
          kind: "sparkline",
          fields: ["2019", "2020", "2021", "2022", "2023", "2024"],
          format: "{value}%",
        },
        {
          key: "change",
          label: "Change",
          kind: "delta",
          fields: ["2019", "2020", "2021", "2022", "2023", "2024"],
          change: "absolute",
          format: "{value} pts",
        },
      ]}
      sort={{ key: "share" }}
      highlight="Netherlands"
      source="Ember, European Electricity Review 2025"
      note="Rounded, illustrative"
    />
  );
}
