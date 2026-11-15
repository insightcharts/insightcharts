import { RadialPoster } from "@/components/insightcharts/templates/radial-poster";

export function RadialPosterDemo() {
  return (
    <RadialPoster
      theme="magenta"
      kicker="Water"
      title="A person on Verne Street used 142 litres of water a day in 2025"
      subtitle="Litres of mains water per person per day by use, 212 metered homes, 2025."
      hero={{
        data: [
          { use: "Shower", litres: 44 },
          { use: "Toilet", litres: 31 },
          { use: "Washing machine", litres: 19 },
          { use: "Kitchen tap", litres: 17 },
          { use: "Garden", litres: 12 },
          { use: "Dishwasher", litres: 9 },
          { use: "Bath", litres: 6 },
          { use: "Other", litres: 4 },
        ],
        name: "use",
        value: "litres",
        icon: "drop",
        format: "{value} L",
        highlight: "Shower",
      }}
      figures={[
        { value: "44 L", label: "went on showers", context: "31% of the daily total" },
        { value: "9 min", label: "was the average length of a shower" },
        { value: "6 L", label: "went on baths" },
        { value: "€1.12", label: "was the cost of one person's water for a day" },
      ]}
      rings={{
        data: [
          { fixture: "Bath", room: "Bathroom", litres: 80 },
          { fixture: "Shower, 8 min", room: "Bathroom", litres: 64 },
          { fixture: "Toilet flush", room: "Bathroom", litres: 6 },
          { fixture: "Washing machine", room: "Kitchen", litres: 50 },
          { fixture: "Dishwasher", room: "Kitchen", litres: 12 },
          { fixture: "Washing-up bowl", room: "Kitchen", litres: 8 },
          { fixture: "Hose, 10 min", room: "Garden", litres: 150 },
          { fixture: "Watering can", room: "Garden", litres: 10 },
        ],
        name: "fixture",
        ring: "room",
        value: "litres",
        format: "{value} L",
        icon: "house",
        ringLabel: "One ring per room",
        sizeLabel: "litres per use",
        highlight: "Hose, 10 min",
        title: "Ten minutes with a hose used 150 litres",
        height: 460,
      }}
      rank={{
        data: [
          { district: "Harbour", litres: 168 },
          { district: "Old Town", litres: 155 },
          { district: "Verne Street", litres: 142 },
          { district: "Northgate", litres: 136 },
          { district: "Riverside", litres: 129 },
          { district: "Mill Lane", litres: 117 },
        ],
        name: "district",
        value: "litres",
        format: "{value} L",
        highlight: "Verne Street",
        title: "Verne Street ranked third of six districts",
      }}
      sources="Verne Street metering study 2025"
      note="Verne Street and its figures are invented. All figures are illustrative."
      credit="InsightCharts"
    />
  );
}
