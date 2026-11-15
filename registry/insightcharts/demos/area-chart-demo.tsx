import { AreaChart } from "@/components/insightcharts/atoms/area-chart";

const data = [
  { year: "2014", gw: 180 },
  { year: "2015", gw: 229 },
  { year: "2016", gw: 306 },
  { year: "2017", gw: 405 },
  { year: "2018", gw: 512 },
  { year: "2019", gw: 633 },
  { year: "2020", gw: 774 },
  { year: "2021", gw: 945 },
  { year: "2022", gw: 1177 },
  { year: "2023", gw: 1610 },
];

export function AreaChartDemo() {
  return (
    <AreaChart
      data={data}
      x="year"
      y="gw"
      names={{ gw: "Installed solar capacity" }}
      format="{value} GW"
      title="World solar capacity rose from 180 GW in 2014 to 1,610 GW in 2023"
      subtitle="Cumulative installed solar PV capacity, gigawatts"
      source="IRENA, Renewable Capacity Statistics (rounded)"
      note="Figures are approximate, for illustration"
    />
  );
}
