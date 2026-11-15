import { AtlasPoster } from "@/components/insightcharts/templates/atlas-poster";

export function AtlasPosterDemo() {
  return (
    <AtlasPoster
      theme="forest"
      kicker="Food"
      title="Norland's orchards picked 2.4 million tonnes of apples in 2025"
      subtitle="Harvest, regions, varieties, prices and exports of the apple crop."
      statement={{
        value: "2.4m",
        label: "Tonnes of apples picked in 2025",
        context: "2.1 million tonnes in 2024",
        icon: "apple",
      }}
      spokes={{
        data: [
          { use: "Eaten fresh", share: 38 },
          { use: "Juice", share: 24 },
          { use: "Cider", share: 15 },
          { use: "Sauce and purée", share: 9 },
          { use: "Dried", share: 5 },
          { use: "Animal feed", share: 5 },
          { use: "Vinegar", share: 4 },
        ],
        name: "use",
        value: "share",
        format: "{value}%",
        icon: "apple",
        highlight: "Eaten fresh",
        title: "38% of the harvest was eaten fresh",
      }}
      network={{
        data: [
          { region: "Eastmark", kt: 720 },
          { region: "Sundby", kt: 540 },
          { region: "Lowlands", kt: 460 },
          { region: "Highmoor", kt: 310 },
          { region: "Fjordland", kt: 220 },
          { region: "Aldern", kt: 150 },
        ],
        name: "region",
        value: "kt",
        links: [
          { from: "Eastmark", to: "Sundby" },
          { from: "Eastmark", to: "Lowlands" },
          { from: "Eastmark", to: "Highmoor" },
          { from: "Eastmark", to: "Aldern" },
          { from: "Sundby", to: "Fjordland" },
          { from: "Lowlands", to: "Fjordland" },
        ],
        highlight: "Eastmark",
        tag: "Largest",
        format: "{value} kt",
        title: "Eastmark picked 720,000 tonnes",
        subtitle: "Harvest by region, thousand tonnes. Lines are fruit-train routes.",
      }}
      trend={{
        data: [
          { year: "2010", mt: 1.5 },
          { year: "2011", mt: 1.56 },
          { year: "2012", mt: 1.48 },
          { year: "2013", mt: 1.65 },
          { year: "2014", mt: 1.72 },
          { year: "2015", mt: 1.69 },
          { year: "2016", mt: 1.81 },
          { year: "2017", mt: 1.9 },
          { year: "2018", mt: 2.05 },
          { year: "2019", mt: 2.2 },
          { year: "2020", mt: 2.52 },
          { year: "2021", mt: 2.31 },
          { year: "2022", mt: 1.98 },
          { year: "2023", mt: 2.15 },
          { year: "2024", mt: 2.1 },
          { year: "2025", mt: 2.4 },
        ],
        x: "year",
        y: "mt",
        format: "{value}m t",
        title: "The harvest was 2.52 million tonnes in 2020",
        subtitle: "Apples picked per year, million tonnes, 2010 to 2025",
      }}
      area={{
        data: [{ land: "All farmland", ha: 2100000 }, { land: "Orchards", ha: 84000 }],
        name: "land",
        value: "ha",
        format: "compact",
        ratio: "{ratio}x the area",
        title: "Orchards covered 84,000 hectares",
        subtitle: "Hectares, 2025",
      }}
      slope={{
        data: [
          { variety: "Gala", y2015: 22, y2025: 27 },
          { variety: "Elstar", y2015: 25, y2025: 18 },
          { variety: "Jonagold", y2015: 20, y2025: 14 },
          { variety: "Braeburn", y2015: 12, y2025: 15 },
        ],
        series: "variety",
        y: ["y2015", "y2025"],
        names: { y2015: "2015", y2025: "2025" },
        highlight: "Gala",
        format: "{value}%",
        title: "Gala rose from 22% to 27% of the harvest",
      }}
      rank={{
        data: [
          { country: "Vesterhav", kt: 190 },
          { country: "Kalmar", kt: 140 },
          { country: "Ostland", kt: 95 },
          { country: "Meridia", kt: 60 },
          { country: "Tavria", kt: 35 },
        ],
        name: "country",
        value: "kt",
        format: "{value} kt",
        highlight: "Vesterhav",
        title: "Vesterhav bought 190,000 tonnes",
      }}
      parts={{
        data: [
          { part: "Shop", cents: 71 },
          { part: "Grower", cents: 62 },
          { part: "Packing and storage", cents: 34 },
          { part: "Transport", cents: 21 },
          { part: "Sales tax", cents: 17 },
        ],
        name: "part",
        value: "cents",
        format: "{value}c",
        highlight: "Grower",
        title: "Growers received 62 cents of a €2.05 kilo",
      }}
      map={{
        data: [
          { region: "Fjordland", code: "Fj", yield: 22, col: 0, row: 0 },
          { region: "Highmoor", code: "Hi", yield: 27, col: 1, row: 0 },
          { region: "Norvik", code: "No", yield: 19, col: 2, row: 0 },
          { region: "Aldern", code: "Al", yield: 24, col: 0, row: 1 },
          { region: "Eastmark", code: "Ea", yield: 41, col: 1, row: 1 },
          { region: "Castren", code: "Ca", yield: 33, col: 2, row: 1 },
          { region: "Lowlands", code: "Lo", yield: 35, col: 1, row: 2 },
          { region: "Sundby", code: "Su", yield: 38, col: 2, row: 2 },
        ],
        region: "region",
        value: "yield",
        code: "code",
        title: "Eastmark picked 41 tonnes a hectare",
        subtitle: "Yield by region, tonnes per hectare",
      }}
      circles={{
        data: [
          { who: "per person in Norland", kg: 24 },
          { who: "per person in Vesterhav", kg: 17 },
          { who: "per person in Kalmar", kg: 9 },
        ],
        name: "who",
        value: "kg",
        unit: "kg",
        title: "Norlanders ate 24 kg of apples each",
      }}
      stats={[
        { icon: "apple", count: 4, total: 10, text: "apples were sold loose." },
        { icon: "book", count: 2, total: 10, text: "pickers were students." },
        { icon: "tree", count: 3, total: 10, text: "orchard trees were under ten years old." },
      ]}
      sources={["Norland Fruit Growers' Association", "Norland Statistics Office"]}
      note="Norland and its neighbours are invented. All figures are illustrative."
      credit="InsightCharts"
    />
  );
}
