import { NetworkPoster } from "@/components/insightcharts/templates/network-poster";

export function NetworkPosterDemo() {
  return (
    <NetworkPoster
      theme="dusk"
      linked
      kicker="Ferries"
      title="Skerry Isles ferries carried 1.66 million passengers on 12 routes in 2025"
      subtitle="Passengers carried between pairs of harbours, thousands, both directions, 2025."
      hero={{
        data: [
          { a: "Port Aven", b: "Brae", k: 412 },
          { a: "Port Aven", b: "Storholm", k: 268 },
          { a: "Port Aven", b: "Little Skerry", k: 96 },
          { a: "Brae", b: "Storholm", k: 187 },
          { a: "Brae", b: "Tarn Head", k: 74 },
          { a: "Storholm", b: "Tarn Head", k: 153 },
          { a: "Storholm", b: "Ness", k: 121 },
          { a: "Tarn Head", b: "Ness", k: 88 },
          { a: "Ness", b: "Outer Holm", k: 43 },
          { a: "Little Skerry", b: "Brae", k: 52 },
          { a: "Port Aven", b: "Ness", k: 139 },
          { a: "Storholm", b: "Outer Holm", k: 31 },
        ],
        from: "a",
        to: "b",
        value: "k",
        order: ["Port Aven", "Little Skerry", "Brae", "Storholm", "Tarn Head", "Ness", "Outer Holm"],
        colorBy: "series",
        format: "{value}k",
        title: "412,000 passengers crossed between Port Aven and Brae",
      }}
      figures={[
        { value: "412k", label: "passengers on the busiest route", context: "Port Aven to Brae" },
        {
          value: "31k",
          label: "passengers on the quietest route",
          context: "Storholm to Outer Holm",
        },
        { value: "4", label: "of the 12 routes call at Port Aven" },
      ]}
      map={{
        data: [
          { harbour: "Port Aven", k: 915, x: 12, y: 62 },
          { harbour: "Little Skerry", k: 148, x: 22, y: 18 },
          { harbour: "Brae", k: 725, x: 38, y: 40 },
          { harbour: "Storholm", k: 760, x: 56, y: 80 },
          { harbour: "Tarn Head", k: 315, x: 66, y: 22 },
          { harbour: "Ness", k: 391, x: 84, y: 46 },
          { harbour: "Outer Holm", k: 74, x: 93, y: 82 },
        ],
        name: "harbour",
        value: "k",
        x: "x",
        y: "y",
        links: [
          { from: "Port Aven", to: "Brae" },
          { from: "Port Aven", to: "Storholm" },
          { from: "Port Aven", to: "Little Skerry" },
          { from: "Brae", to: "Storholm" },
          { from: "Brae", to: "Tarn Head" },
          { from: "Storholm", to: "Tarn Head" },
          { from: "Storholm", to: "Ness" },
          { from: "Tarn Head", to: "Ness" },
          { from: "Ness", to: "Outer Holm" },
          { from: "Little Skerry", to: "Brae" },
          { from: "Port Aven", to: "Ness" },
          { from: "Storholm", to: "Outer Holm" },
        ],
        format: "{value}k",
        highlight: "Port Aven",
        tag: "Busiest harbour",
        title: "915,000 passengers used Port Aven",
        subtitle: "Passengers through each harbour, thousands. Positions are approximate.",
      }}
      rank={{
        data: [
          { harbour: "Port Aven", sailings: 46 },
          { harbour: "Storholm", sailings: 38 },
          { harbour: "Brae", sailings: 33 },
          { harbour: "Ness", sailings: 21 },
          { harbour: "Tarn Head", sailings: 16 },
          { harbour: "Little Skerry", sailings: 8 },
          { harbour: "Outer Holm", sailings: 4 },
        ],
        name: "harbour",
        value: "sailings",
        title: "Port Aven had 46 sailings a day",
        subtitle: "Scheduled departures per day, summer 2025.",
      }}
      sources="Skerry Isles Ferries, annual traffic return 2025"
      note="The Skerry Isles are invented. All figures are illustrative."
      credit="InsightCharts"
    />
  );
}
