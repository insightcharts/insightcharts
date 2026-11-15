import { DataTable } from "@/components/insightcharts/atoms/data-table";

export function DataTableDemo() {
  return (
    <DataTable
      caption="Wind and solar supplied 67% of Denmark's electricity in 2024"
      subtitle="Electricity generation by country, 2024"
      source="Ember (illustrative figures)"
      highlight="Denmark"
      sort={{ key: "share", direction: "desc" }}
      columns={[
        { key: "country", label: "Country" },
        { key: "share", label: "Wind and solar share", format: "percent", bar: true, width: "38%" },
        { key: "twh", label: "Generation, TWh", format: "decimal:1" },
        {
          key: "change",
          label: "Change vs 2023",
          format: { style: "percent", signDisplay: "exceptZero", maximumFractionDigits: 1 },
        },
      ]}
      rows={[
        { country: "Germany", share: 0.43, twh: 209.4, change: 0.031 },
        { country: "Spain", share: 0.42, twh: 112.8, change: 0.044 },
        { country: "Denmark", share: 0.67, twh: 23.1, change: 0.012 },
        { country: "Netherlands", share: 0.41, twh: 49.6, change: 0.058 },
        { country: "Portugal", share: 0.46, twh: 22.9, change: 0.027 },
        { country: "France", share: 0.14, twh: 73.5, change: 0.009 },
        { country: "Poland", share: 0.24, twh: 40.2, change: -0.004 },
      ]}
    />
  );
}
