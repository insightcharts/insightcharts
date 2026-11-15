import { TimelinePoster } from "@/components/insightcharts/templates/timeline-poster";

export function TimelinePosterDemo() {
  return (
    <TimelinePoster
      theme="sunrise"
      kicker="Electricity"
      title="Wind supplied 8.6 TWh of Orrin Island's electricity in 2025"
      subtitle="Electricity generated on Orrin Island by source, terawatt-hours, every second year from 2015 to 2025."
      hero={{
        data: [
          { year: "2015", Coal: 9.2, Gas: 6.1, Hydro: 2.2, Wind: 1.4, Solar: 0.3 },
          { year: "2017", Coal: 8, Gas: 6.4, Hydro: 2.3, Wind: 2.6, Solar: 0.6 },
          { year: "2019", Coal: 6.1, Gas: 6, Hydro: 2.1, Wind: 4.3, Solar: 1.3 },
          { year: "2021", Coal: 4, Gas: 5.4, Hydro: 2.4, Wind: 5.9, Solar: 2.4 },
          { year: "2023", Coal: 2.3, Gas: 4.7, Hydro: 2.2, Wind: 7.4, Solar: 3.7 },
          { year: "2025", Coal: 1.1, Gas: 4, Hydro: 2.3, Wind: 8.6, Solar: 4.9 },
        ],
        x: "year",
        y: ["Coal", "Gas", "Hydro", "Wind", "Solar"],
        colorBy: "series",
        title: "Coal supplied 9.2 TWh in 2015",
      }}
      milestones={[
        { at: "2017", value: "62", label: "turbines started at the Skerry wind farm" },
        { at: "2021", value: "5.9 TWh", label: "came from wind", context: "Gas supplied 5.4 TWh" },
        { at: "2025", value: "1.1 TWh", label: "came from coal", context: "9.2 TWh in 2015" },
      ]}
      bars={{
        data: [
          { year: "2015", g: 520 },
          { year: "2017", g: 455 },
          { year: "2019", g: 370 },
          { year: "2021", g: 290 },
          { year: "2023", g: 215 },
          { year: "2025", g: 160 },
        ],
        name: "year",
        value: "g",
        format: "{value} g",
        marker: { after: "2017", label: "Skerry wind farm opened" },
        title: "A kilowatt-hour emitted 160 g of CO2 in 2025",
        subtitle: "Grams of CO2 per kilowatt-hour generated.",
      }}
      shares={{
        data: [
          { year: "2015", share: 9 },
          { year: "2019", share: 28 },
          { year: "2021", share: 41 },
          { year: "2025", share: 65 },
        ],
        name: "year",
        value: "share",
        highlight: "2025",
        wholeLabel: "All electricity generated",
        title: "Wind and solar supplied 65% of electricity in 2025",
      }}
      sources="Orrin Island Grid Office, annual generation statistics"
      note="Orrin Island is an invented place. All figures are illustrative."
      credit="InsightCharts"
    />
  );
}
