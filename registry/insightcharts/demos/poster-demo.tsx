import { Poster } from "@/components/insightcharts/molecules/poster";
import { BigNumber } from "@/components/insightcharts/atoms/big-number";
import { PictogramChart } from "@/components/insightcharts/atoms/pictogram-chart";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";
import { DonutChart } from "@/components/insightcharts/atoms/donut-chart";

export function PosterDemo() {
  return (
    <Poster
      theme="noir"
      kicker="Transport"
      title="Riverton's bike-share scheme carried 4.2 million trips in 2025"
      subtitle="Trips, bikes and reasons for riding in the city's public bike-share scheme, January to December 2025."
      panels={[
        {
          span: 4,
          valign: "center",
          content: <BigNumber
            size="hero"
            value="4.2 million"
            label="Trips in 2025"
            context="3.4 million in 2024"
          />,
        },
        {
          span: 8,
          title: "Old Town had 1,150 of the scheme's 3,000 bikes",
          content: <PictogramChart
            data={[
              { district: "Old Town", bikes: 1150 },
              { district: "Harbour", bikes: 820 },
              { district: "University", bikes: 640 },
              { district: "Northside", bikes: 390 },
            ]}
            name="district"
            value="bikes"
            unit={50}
            unitLabel="50 bikes"
            icon="bike"
            highlight="Old Town"
          />,
          source: "Riverton Transport Office",
        },
        {
          span: 7,
          title: "670,000 trips were made on Wednesdays in 2025",
          subtitle: "Trips by day of the week, thousands, 2025",
          content: <BarChart
            data={[
              { day: "Mon", trips: 610 },
              { day: "Tue", trips: 655 },
              { day: "Wed", trips: 670 },
              { day: "Thu", trips: 662 },
              { day: "Fri", trips: 640 },
              { day: "Sat", trips: 520 },
              { day: "Sun", trips: 443 },
            ]}
            x="day"
            y="trips"
            orientation="vertical"
            sort="none"
            highlight="Wed"
            format="{value}k"
            height={260}
          />,
        },
        {
          span: 5,
          title: "46% of trips were commutes",
          subtitle: "Share of trips by stated purpose, rider survey, 2025",
          content: <DonutChart
            data={[
              { purpose: "Commuting", share: 46 },
              { purpose: "Leisure", share: 27 },
              { purpose: "Errands", share: 18 },
              { purpose: "Other", share: 9 },
            ]}
            name="purpose"
            value="share"
            format="{value}%"
            centerValue="46%"
            centerLabel="Commuting"
            height={260}
          />,
        },
      ]}
      sources={["Riverton Transport Office", "Riverton rider survey 2025"]}
      note="Riverton is an invented city. All figures are illustrative."
      credit="InsightCharts"
    />
  );
}
