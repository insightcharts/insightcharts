import { RankingPoster } from "@/components/insightcharts/templates/ranking-poster";

export function RankingPosterDemo() {
  return (
    <RankingPoster
      theme="dusk"
      kicker="Music"
      title="The Solvik Festival sold 184,000 tickets in 2025"
      subtitle="Tickets, crowds and spending at a three-day music festival, 11 to 13 July 2025."
      figures={[
        { value: "184,000", label: "Tickets sold in 2025", context: "171,000 in 2024" },
        {
          data: [
            { day: "Friday", share: 84 },
            { day: "Saturday", share: 100 },
            { day: "Sunday", share: 91 },
          ],
          name: "day",
          value: "share",
          icon: "group",
          title: "Saturday sold 100% of its 64,000 places",
        },
      ]}
      breakdowns={[
        {
          data: [
            { ticket: "Weekend pass", k: 92 },
            { ticket: "Day ticket", k: 61 },
            { ticket: "Camping pass", k: 23 },
            { ticket: "VIP pass", k: 8 },
          ],
          name: "ticket",
          value: "k",
          format: "{value}k",
          title: "92,000 tickets were weekend passes",
        },
        {
          data: [
            { home: "Solvik region", k: 71 },
            { home: "Rest of the country", k: 64 },
            { home: "Neighbouring countries", k: 37 },
            { home: "Further away", k: 12 },
          ],
          name: "home",
          value: "k",
          format: "{value}k",
          title: "71,000 ticket holders lived in the Solvik region",
        },
      ]}
      ranking={{
        data: [
          { act: "Halden Lights", crowd: 61000 },
          { act: "Mirra Sol", crowd: 58500 },
          { act: "The Quiet Engines", crowd: 52000 },
          { act: "Ada Vance", crowd: 47500 },
          { act: "Northfold", crowd: 41000 },
          { act: "Juno Marsh", crowd: 36500 },
          { act: "Saltwater Choir", crowd: 31000 },
          { act: "Okapi Club", crowd: 26500 },
          { act: "Tess Arden", crowd: 22000 },
          { act: "Low Tide Radio", crowd: 17500 },
        ],
        name: "act",
        value: "crowd",
        format: "integer",
        highlight: "Halden Lights",
        title: "Halden Lights played to 61,000 people on Saturday",
        subtitle: "Largest crowd at each of the ten most-attended acts",
      }}
      pack={{
        data: [
          { item: "Food stalls", k: 3400 },
          { item: "Beer", k: 2900 },
          { item: "Merchandise", k: 2300 },
          { item: "Wine and cocktails", k: 1600 },
          { item: "Soft drinks", k: 1100 },
          { item: "Camping shop", k: 900 },
          { item: "Coffee", k: 700 },
          { item: "Lockers and charging", k: 500 },
          { item: "Water", k: 400 },
          { item: "Ice cream", k: 400 },
        ],
        name: "item",
        value: "k",
        format: "€{value}k",
        icon: {
          "Food stalls": "fork-knife",
          Beer: "cup",
          Merchandise: "bag",
          "Wine and cocktails": "bottle",
          "Soft drinks": "bottle",
          "Camping shop": "cart",
          Coffee: "cup",
        },
        title: "Visitors spent €3.4 million at food stalls",
        subtitle: "Spending on site by category, thousand euros",
      }}
      circles={{
        data: [
          { year: "per visitor in 2019", kg: 2.6 },
          { year: "per visitor in 2022", kg: 1.9 },
          { year: "per visitor in 2025", kg: 1.2 },
        ],
        name: "year",
        value: "kg",
        unit: "kg",
        title: "Each visitor left 1.2 kg of waste in 2025",
      }}
      figure={{
        value: "€14.2m",
        label: "Spent on site by visitors in 2025",
        context: "€77 for each ticket sold",
      }}
      sources="Solvik Festival annual report 2025"
      note="The Solvik Festival and its acts are invented. All figures are illustrative."
      credit="InsightCharts"
    />
  );
}
