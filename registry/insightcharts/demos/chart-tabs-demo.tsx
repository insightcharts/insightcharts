import { registerComponents } from "insightcharts";
import { ChartTabs } from "@/components/insightcharts/molecules/chart-tabs";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";

registerComponents({ BarChart });

export function ChartTabsDemo() {
  return (
    <ChartTabs
      title="CO2 emissions of six large emitters, 2023"
      tabsPosition="below"
      chart={{
        type: "bar-chart",
        data: [
          { country: "China", total: 11.9, perCapita: 8.4, change: 0.38 },
          { country: "United States", total: 4.9, perCapita: 14.3, change: -0.13 },
          { country: "India", total: 3.1, perCapita: 2.1, change: 0.74 },
          { country: "Russia", total: 1.8, perCapita: 12.5, change: 0.1 },
          { country: "Japan", total: 1, perCapita: 8, change: -0.19 },
          { country: "Germany", total: 0.6, perCapita: 7.1, change: -0.28 },
        ],
        x: "country",
        y: "total",
        sort: "desc",
        orientation: "horizontal",
        height: 280,
        highlight: "China",
        format: "{value} Gt",
        subtitle: "CO2 emissions from fossil fuels, billion tonnes, 2023",
      }}
      views={[
        { label: "Total", id: "total" },
        {
          label: "Per capita",
          id: "per-capita",
          props: {
            y: "perCapita",
            highlight: "United States",
            format: "{value} t",
            subtitle: "CO2 emissions per person, tonnes, 2023",
          },
        },
        {
          label: "Change since 2010",
          id: "change",
          props: {
            y: "change",
            highlight: "India",
            format: "percent",
            subtitle: "Change in CO2 emissions, 2010 to 2023",
          },
        },
      ]}
      source="Global Carbon Budget 2024"
      note="Rounded, approximate figures for illustration"
    />
  );
}
