import { SocialCard } from "@/components/insightcharts/templates/social-card";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";

export function SocialCardDemo() {
  return (
    <SocialCard
      aspect="1:1"
      kicker="Climate"
      title="The world was 1.6°C warmer in 2024 than in 1850 to 1900"
      exhibit={<BarChart
        data={[
          { year: "2015", c: 1.17 },
          { year: "2016", c: 1.31 },
          { year: "2017", c: 1.22 },
          { year: "2018", c: 1.14 },
          { year: "2019", c: 1.26 },
          { year: "2020", c: 1.31 },
          { year: "2021", c: 1.14 },
          { year: "2022", c: 1.18 },
          { year: "2023", c: 1.48 },
          { year: "2024", c: 1.6 },
        ]}
        x="year"
        y="c"
        orientation="vertical"
        sort="none"
        highlight="2024"
        format="{value}°C"
        labels={false}
        subtitle="Global average temperature above the 1850 to 1900 level"
        annotations={[{ type: "line", axis: "y", value: 1.5, label: "Paris Agreement limit" }]}
      />}
      source="Copernicus Climate Change Service, ERA5 (rounded)"
      note="Figures are approximate, for illustration"
      credit="InsightCharts"
    />
  );
}
