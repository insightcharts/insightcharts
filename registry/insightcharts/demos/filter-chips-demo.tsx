import { FilterChips } from "@/components/insightcharts/molecules/filter-chips";

export function FilterChipsDemo() {
  return (
    <FilterChips
      labels={{ region: "Region", source: "Source", year: "Year" }}
      selections={{
        "by-region": { field: "region", values: ["Asia", "Europe"] },
        "by-source": { field: "source", values: ["Solar"] },
        "by-year": { field: "year", range: [2020, 2024] },
      }}
    />
  );
}
