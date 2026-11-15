import { SmallMultipleGrid } from "@/components/insightcharts/molecules/small-multiple-grid";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";

const data = [
  { country: "Netherlands", age: "16-24", Usually: 18, Sometimes: 22 },
  { country: "Netherlands", age: "25-34", Usually: 44, Sometimes: 21 },
  { country: "Netherlands", age: "35-49", Usually: 41, Sometimes: 19 },
  { country: "Netherlands", age: "50-64", Usually: 33, Sometimes: 17 },
  { country: "Netherlands", age: "65+", Usually: 14, Sometimes: 9 },
  { country: "Sweden", age: "16-24", Usually: 14, Sometimes: 20 },
  { country: "Sweden", age: "25-34", Usually: 39, Sometimes: 22 },
  { country: "Sweden", age: "35-49", Usually: 37, Sometimes: 20 },
  { country: "Sweden", age: "50-64", Usually: 30, Sometimes: 16 },
  { country: "Sweden", age: "65+", Usually: 11, Sometimes: 8 },
  { country: "Germany", age: "16-24", Usually: 9, Sometimes: 15 },
  { country: "Germany", age: "25-34", Usually: 24, Sometimes: 18 },
  { country: "Germany", age: "35-49", Usually: 23, Sometimes: 16 },
  { country: "Germany", age: "50-64", Usually: 18, Sometimes: 13 },
  { country: "Germany", age: "65+", Usually: 8, Sometimes: 6 },
  { country: "France", age: "16-24", Usually: 8, Sometimes: 12 },
  { country: "France", age: "25-34", Usually: 25, Sometimes: 14 },
  { country: "France", age: "35-49", Usually: 24, Sometimes: 13 },
  { country: "France", age: "50-64", Usually: 17, Sometimes: 10 },
  { country: "France", age: "65+", Usually: 7, Sometimes: 5 },
  { country: "Spain", age: "16-24", Usually: 5, Sometimes: 9 },
  { country: "Spain", age: "25-34", Usually: 13, Sometimes: 12 },
  { country: "Spain", age: "35-49", Usually: 13, Sometimes: 11 },
  { country: "Spain", age: "50-64", Usually: 10, Sometimes: 8 },
  { country: "Spain", age: "65+", Usually: 4, Sometimes: 4 },
  { country: "Italy", age: "16-24", Usually: 3, Sometimes: 6 },
  { country: "Italy", age: "25-34", Usually: 9, Sometimes: 8 },
  { country: "Italy", age: "35-49", Usually: 9, Sometimes: 8 },
  { country: "Italy", age: "50-64", Usually: 7, Sometimes: 6 },
  { country: "Italy", age: "65+", Usually: 3, Sometimes: 3 },
];

export function SmallMultipleGridDemo() {
  return (
    <SmallMultipleGrid
      title="65% of Dutch workers aged 25 to 34 worked from home usually or sometimes in 2023"
      subtitle="Share of employed people working from home usually or sometimes, by age group, six EU countries, 2023. All panels run from 0 to 70%"
      data={data}
      facet="country"
      columns={3}
      panelHeight={170}
      legend={["Usually", "Sometimes"]}
      chart={<BarChart
        x="age"
        y={["Usually", "Sometimes"]}
        stack
        sort="none"
        orientation="horizontal"
        format="{value}%"
        labels={false}
        legend={false}
        option={{ xAxis: { max: 70 } }}
      />}
      source="Eurostat, Labour Force Survey"
      note="Rounded, illustrative"
    />
  );
}
