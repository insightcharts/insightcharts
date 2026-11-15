import { RibbonChart } from "@/components/insightcharts/atoms/ribbon-chart";

const data = [
  { year: "2019", Potatoes: 7.4, Carrots: 5.1, Onions: 4.2, Beans: 2.6, Squash: 1.2 },
  { year: "2020", Potatoes: 6.9, Carrots: 5.6, Onions: 3.8, Beans: 3.1, Squash: 2.3 },
  { year: "2021", Potatoes: 6.1, Carrots: 5.9, Onions: 3.1, Beans: 3.4, Squash: 3.9 },
  { year: "2022", Potatoes: 5.2, Carrots: 6.3, Onions: 2.9, Beans: 3.2, Squash: 5 },
  { year: "2023", Potatoes: 4.8, Carrots: 6, Onions: 2.4, Beans: 3.6, Squash: 6.1 },
  { year: "2024", Potatoes: 4.1, Carrots: 6.2, Onions: 2.2, Beans: 3.5, Squash: 6.8 },
];

export function RibbonChartDemo() {
  return (
    <RibbonChart
      data={data}
      x="year"
      y={["Potatoes", "Carrots", "Onions", "Beans", "Squash"]}
      format="{value} t"
      title="The squash harvest rose from 1.2 to 6.8 tonnes between 2019 and 2024"
      subtitle="Harvest of five crops at one community farm, tonnes, 2019 to 2024, largest at the top each year"
      note="Illustrative figures."
    />
  );
}
