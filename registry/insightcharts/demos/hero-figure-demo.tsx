import { HeroFigure } from "@/components/insightcharts/molecules/hero-figure";
import { LineChart } from "@/components/insightcharts/atoms/line-chart";

export function HeroFigureDemo() {
  return (
    <HeroFigure
      theme="editorial"
      kicker="Energy transition"
      title="Solar supplied 11.1% of EU electricity in 2024"
      deck="Coal's share fell from 24.6% in 2015 to 9.8% in 2024."
      byline="By Ana Ruiz"
      date="2025-01-23"
      chart={<LineChart
        data={[
          { year: "2015", Solar: 2.9, Coal: 24.6, Wind: 9.2, Gas: 15.6 },
          { year: "2016", Solar: 3, Coal: 22, Wind: 9.5, Gas: 18.4 },
          { year: "2017", Solar: 3.4, Coal: 20.6, Wind: 11, Gas: 19.7 },
          { year: "2018", Solar: 3.7, Coal: 19.2, Wind: 11.4, Gas: 18.3 },
          { year: "2019", Solar: 4.2, Coal: 15, Wind: 13, Gas: 21 },
          { year: "2020", Solar: 5, Coal: 13, Wind: 14.4, Gas: 20.1 },
          { year: "2021", Solar: 5.4, Coal: 14.7, Wind: 13.3, Gas: 18.8 },
          { year: "2022", Solar: 7, Coal: 15.8, Wind: 15.1, Gas: 19.6 },
          { year: "2023", Solar: 9.1, Coal: 12.3, Wind: 17.5, Gas: 16.8 },
          { year: "2024", Solar: 11.1, Coal: 9.8, Wind: 17.4, Gas: 15.7 },
        ]}
        x="year"
        y={["Solar", "Coal", "Wind", "Gas"]}
        highlight={["Solar", "Coal"]}
        contextLabels
        format="{value}%"
        zero
        height={380}
        subtitle="Share of EU electricity generation by source, 2015 to 2024"
      />}
      source={{ name: "Ember, European Electricity Review 2025", url: "https://ember-energy.org" }}
      note="Figures are approximate, for illustration"
      period="2015 to 2024"
    />
  );
}
