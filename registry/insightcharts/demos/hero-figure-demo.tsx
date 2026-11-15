import { HeroFigure } from "@/components/insightcharts/molecules/hero-figure";
import { LineChart } from "@/components/insightcharts/atoms/line-chart";

export function HeroFigureDemo() {
  return (
    <HeroFigure
      kicker="Energy transition"
      title="Solar supplied 11.1% of EU electricity in 2024"
      deck="Coal's share fell from 24.6% in 2015 to 9.8% in 2024."
      byline="By Ana Ruiz"
      date="2025-01-23"
      chart={<LineChart
        data={[
          { year: "2015", Solar: 2.9, Coal: 24.6 },
          { year: "2016", Solar: 3, Coal: 22 },
          { year: "2017", Solar: 3.4, Coal: 20.6 },
          { year: "2018", Solar: 3.7, Coal: 19.2 },
          { year: "2019", Solar: 4.2, Coal: 15 },
          { year: "2020", Solar: 5, Coal: 13 },
          { year: "2021", Solar: 5.4, Coal: 14.7 },
          { year: "2022", Solar: 7, Coal: 15.8 },
          { year: "2023", Solar: 9.1, Coal: 12.3 },
          { year: "2024", Solar: 11.1, Coal: 9.8 },
        ]}
        x="year"
        y={["Solar", "Coal"]}
        format="{value}%"
        zero
        height={380}
        subtitle="Solar and coal share of EU electricity generation, 2015 to 2024"
        annotations={[{ type: "point", x: "2024", y: 11.1, label: "Solar 11.1%", position: "left" }]}
      />}
      source={{ name: "Ember, European Electricity Review 2025", url: "https://ember-energy.org" }}
      note="Figures are approximate, for illustration"
      period="2015 to 2024"
    />
  );
}
