import { LinkedCharts } from "@/components/insightcharts/molecules/linked-charts";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";

const data = [
  { region: "Asia", year: "2020", source: "Hydro", twh: 1810 },
  { region: "Asia", year: "2020", source: "Wind", twh: 480 },
  { region: "Asia", year: "2020", source: "Solar", twh: 420 },
  { region: "Asia", year: "2021", source: "Hydro", twh: 1790 },
  { region: "Asia", year: "2021", source: "Wind", twh: 590 },
  { region: "Asia", year: "2021", source: "Solar", twh: 560 },
  { region: "Asia", year: "2022", source: "Hydro", twh: 1830 },
  { region: "Asia", year: "2022", source: "Wind", twh: 700 },
  { region: "Asia", year: "2022", source: "Solar", twh: 730 },
  { region: "Asia", year: "2023", source: "Hydro", twh: 1800 },
  { region: "Asia", year: "2023", source: "Wind", twh: 880 },
  { region: "Asia", year: "2023", source: "Solar", twh: 980 },
  { region: "Asia", year: "2024", source: "Hydro", twh: 1860 },
  { region: "Asia", year: "2024", source: "Wind", twh: 1010 },
  { region: "Asia", year: "2024", source: "Solar", twh: 1290 },
  { region: "Europe", year: "2020", source: "Hydro", twh: 640 },
  { region: "Europe", year: "2020", source: "Wind", twh: 510 },
  { region: "Europe", year: "2020", source: "Solar", twh: 190 },
  { region: "Europe", year: "2021", source: "Hydro", twh: 620 },
  { region: "Europe", year: "2021", source: "Wind", twh: 540 },
  { region: "Europe", year: "2021", source: "Solar", twh: 220 },
  { region: "Europe", year: "2022", source: "Hydro", twh: 560 },
  { region: "Europe", year: "2022", source: "Wind", twh: 580 },
  { region: "Europe", year: "2022", source: "Solar", twh: 270 },
  { region: "Europe", year: "2023", source: "Hydro", twh: 610 },
  { region: "Europe", year: "2023", source: "Wind", twh: 640 },
  { region: "Europe", year: "2023", source: "Solar", twh: 330 },
  { region: "Europe", year: "2024", source: "Hydro", twh: 650 },
  { region: "Europe", year: "2024", source: "Wind", twh: 690 },
  { region: "Europe", year: "2024", source: "Solar", twh: 390 },
  { region: "North America", year: "2020", source: "Hydro", twh: 690 },
  { region: "North America", year: "2020", source: "Wind", twh: 400 },
  { region: "North America", year: "2020", source: "Solar", twh: 150 },
  { region: "North America", year: "2021", source: "Hydro", twh: 680 },
  { region: "North America", year: "2021", source: "Wind", twh: 450 },
  { region: "North America", year: "2021", source: "Solar", twh: 190 },
  { region: "North America", year: "2022", source: "Hydro", twh: 700 },
  { region: "North America", year: "2022", source: "Wind", twh: 500 },
  { region: "North America", year: "2022", source: "Solar", twh: 240 },
  { region: "North America", year: "2023", source: "Hydro", twh: 660 },
  { region: "North America", year: "2023", source: "Wind", twh: 520 },
  { region: "North America", year: "2023", source: "Solar", twh: 290 },
  { region: "North America", year: "2024", source: "Hydro", twh: 670 },
  { region: "North America", year: "2024", source: "Wind", twh: 560 },
  { region: "North America", year: "2024", source: "Solar", twh: 360 },
  { region: "Latin America", year: "2020", source: "Hydro", twh: 720 },
  { region: "Latin America", year: "2020", source: "Wind", twh: 120 },
  { region: "Latin America", year: "2020", source: "Solar", twh: 40 },
  { region: "Latin America", year: "2021", source: "Hydro", twh: 690 },
  { region: "Latin America", year: "2021", source: "Wind", twh: 140 },
  { region: "Latin America", year: "2021", source: "Solar", twh: 60 },
  { region: "Latin America", year: "2022", source: "Hydro", twh: 740 },
  { region: "Latin America", year: "2022", source: "Wind", twh: 170 },
  { region: "Latin America", year: "2022", source: "Solar", twh: 90 },
  { region: "Latin America", year: "2023", source: "Hydro", twh: 760 },
  { region: "Latin America", year: "2023", source: "Wind", twh: 200 },
  { region: "Latin America", year: "2023", source: "Solar", twh: 120 },
  { region: "Latin America", year: "2024", source: "Hydro", twh: 730 },
  { region: "Latin America", year: "2024", source: "Wind", twh: 230 },
  { region: "Latin America", year: "2024", source: "Solar", twh: 160 },
];

export function LinkedChartsDemo() {
  return (
    <LinkedCharts
      title="Asia generated 46% of the renewable electricity in these four regions from 2020 to 2024"
      subtitle="Electricity generation from hydro, wind and solar, TWh, four regions, 2020 to 2024"
      data={data}
      labels={{ region: "Region", source: "Source", year: "Year" }}
      hint="Click a bar to filter the other charts"
      count
      charts={[
        <BarChart
          id="by-region"
          x="region"
          y="twh"
          select
          format="compact"
          height={200}
          title="By region"
          transform={{ type: "aggregate", groupBy: "region", measures: { twh: { op: "sum", field: "twh" } } }}
        />,
        <BarChart
          id="by-source"
          x="source"
          y="twh"
          select
          format="compact"
          height={200}
          title="By source"
          transform={{ type: "aggregate", groupBy: "source", measures: { twh: { op: "sum", field: "twh" } } }}
        />,
        <BarChart
          id="by-year"
          x="year"
          y="twh"
          series="source"
          stack
          orientation="vertical"
          sort="none"
          select="year"
          format="compact"
          height={240}
          title="By year"
          transform={{
            type: "aggregate",
            groupBy: ["year", "source"],
            measures: { twh: { op: "sum", field: "twh" } },
          }}
        />,
      ]}
      source="Ember, Global Electricity Review 2025"
      note="Regional figures rounded, illustrative"
    />
  );
}
