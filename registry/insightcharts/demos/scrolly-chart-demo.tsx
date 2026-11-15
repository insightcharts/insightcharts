import { registerComponents } from "insightcharts";
import { ScrollyChart } from "@/components/insightcharts/molecules/scrolly-chart";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";

registerComponents({ BarChart });

export function ScrollyChartDemo() {
  return (
    <ScrollyChart
      chart={{
        type: "bar-chart",
        data: [
          { source: "Coal", y2015: 24.6, y2024: 9.8 },
          { source: "Gas", y2015: 15.8, y2024: 15.7 },
          { source: "Nuclear", y2015: 27.1, y2024: 23.7 },
          { source: "Wind", y2015: 9.2, y2024: 17.4 },
          { source: "Hydro", y2015: 12, y2024: 13.2 },
          { source: "Solar", y2015: 2.9, y2024: 11.1 },
        ],
        x: "source",
        y: "y2015",
        sort: "none",
        orientation: "horizontal",
        format: "{value}%",
        height: 300,
        title: "EU electricity generation by source, 2015",
        subtitle: "Share of EU electricity generation, %",
        source: "Ember, European Electricity Review 2025",
        note: "Rounded, approximate figures for illustration",
      }}
      steps={[
        {
          id: "baseline",
          label: "2015",
          content: "In 2015 **nuclear and coal** together supplied 51.7% of the EU's electricity.",
        },
        {
          id: "coal",
          content: "Coal supplied 24.6% in 2015. Only nuclear supplied more.",
          highlight: "Coal",
        },
        {
          id: "today",
          label: "2024",
          content: "In 2024 coal supplied 9.8%.",
          highlight: "Coal",
          y: "y2024",
          title: "EU electricity generation by source, 2024",
        },
        {
          id: "solar",
          content: "**Solar** supplied 11.1% in 2024. It supplied 2.9% in 2015.",
          highlight: "Solar",
          y: "y2024",
          title: "Solar supplied 11.1% of EU electricity in 2024",
        },
      ]}
      stepHeight="70vh"
      stickyTop={16}
    />
  );
}
