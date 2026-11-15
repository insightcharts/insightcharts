import { FlowPoster } from "@/components/insightcharts/templates/flow-poster";

export function FlowPosterDemo() {
  return (
    <FlowPoster
      theme="magenta"
      kicker="Fishing"
      title="Six ports on the Verran Coast landed 412,000 tonnes of fish in 2025"
      subtitle="Landings by port, the buyers of Port Alda's catch, and how much each buyer relies on Port Alda. Thousand tonnes (kt)."
      format="{value} kt"
      producers={{
        data: [
          { port: "Port Alda", kt: 148 },
          { port: "Skerry", kt: 96 },
          { port: "Marrow Bay", kt: 71 },
          { port: "Tolven", kt: 52 },
          { port: "Hask", kt: 28 },
          { port: "Lund", kt: 17 },
        ],
        name: "port",
        value: "kt",
        title: "Port Alda landed 148,000 of the 412,000 tonnes",
      }}
      flow={{
        data: [
          { buyer: "Canneries", kt: 46 },
          { buyer: "Fresh markets", kt: 34 },
          { buyer: "Frozen export", kt: 29 },
          { buyer: "Fishmeal plants", kt: 21 },
          { buyer: "Restaurants", kt: 11 },
          { buyer: "Smokehouses", kt: 7 },
        ],
        name: "buyer",
        value: "kt",
        trunk: "Port Alda",
        title: "Canneries bought 46,000 tonnes of Port Alda's catch",
      }}
      scale={{
        data: [
          { buyer: "Canneries", fromAlda: 56, kt: 82 },
          { buyer: "Fresh markets", fromAlda: 35, kt: 96 },
          { buyer: "Frozen export", fromAlda: 23, kt: 124 },
          { buyer: "Fishmeal plants", fromAlda: 34, kt: 61 },
          { buyer: "Restaurants", fromAlda: 29, kt: 38 },
          { buyer: "Smokehouses", fromAlda: 64, kt: 11 },
        ],
        name: "buyer",
        value: "fromAlda",
        size: "kt",
        sizeFormat: "{value} kt",
        scaleLabel: "From Port Alda",
        title: "Smokehouses bought 64% of their fish from Port Alda",
        subtitle: "Share of each buyer's fish landed at Port Alda (position) and all the fish it bought (area)",
      }}
      sources="Verran Coast Fisheries Board landing returns"
      note="The Verran Coast is an invented place. All figures are illustrative."
      credit="InsightCharts"
    />
  );
}
