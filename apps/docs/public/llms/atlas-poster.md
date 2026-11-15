# Atlas poster (`atlas-poster`)

> A landscape spread of up to eleven small illustrations of one subject, each a different graphic form, in three bands of unequal panels: a statement in large type, spokes round an icon and a network of circles; a smooth trend with its peak labelled, nested squares and a slope chart; a pill ranking, a treemap, a tile map and sized circles; and a closing row of icon statements.

- Component: `AtlasPoster` (import from `insightcharts`)
- Spec type: `"atlas-poster"`
- Level: template. Category: infographic.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it when one subject has many small facts of different kinds (shares, places, a trend, a change, a ranking, a map) and none of them should dominate: a crop, an industry, a service, a country's internet. Fill at least eight regions. Give every panel a short heading that states its one number. Every region is optional, and each band shares its width among the panels that are present.

## Avoid

One dominant fact or graphic (use `count-poster`, `flow-poster` or `ranking-poster`). The same measures across several entities (use `matrix-poster`). Fewer than six panels (use `poster` and place them yourself). A phone-first piece: the spread becomes one long column under 600px.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/atlas-poster
```

The file lands at `components/insightcharts/templates/atlas-poster.tsx`. `@insightcharts/atlas-poster-demo` adds a ready-made example next to it.

## Usage

```tsx
import { AtlasPoster } from "insightcharts";

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
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "atlas-poster",
  "theme": "forest",
  "kicker": "Food",
  "title": "Norland's orchards picked 2.4 million tonnes of apples in 2025",
  "subtitle": "Harvest, regions, varieties, prices and exports of the apple crop.",
  "statement": {
    "value": "2.4m",
    "label": "Tonnes of apples picked in 2025",
    "context": "2.1 million tonnes in 2024",
    "icon": "apple"
  },
  "spokes": {
    "data": [
      { "use": "Eaten fresh", "share": 38 },
      { "use": "Juice", "share": 24 },
      { "use": "Cider", "share": 15 },
      { "use": "Sauce and purée", "share": 9 },
      { "use": "Dried", "share": 5 },
      { "use": "Animal feed", "share": 5 },
      { "use": "Vinegar", "share": 4 }
    ],
    "name": "use",
    "value": "share",
    "format": "{value}%",
    "icon": "apple",
    "highlight": "Eaten fresh",
    "title": "38% of the harvest was eaten fresh"
  },
  "network": {
    "data": [
      { "region": "Eastmark", "kt": 720 },
      { "region": "Sundby", "kt": 540 },
      { "region": "Lowlands", "kt": 460 },
      { "region": "Highmoor", "kt": 310 },
      { "region": "Fjordland", "kt": 220 },
      { "region": "Aldern", "kt": 150 }
    ],
    "name": "region",
    "value": "kt",
    "links": [
      { "from": "Eastmark", "to": "Sundby" },
      { "from": "Eastmark", "to": "Lowlands" },
      { "from": "Eastmark", "to": "Highmoor" },
      { "from": "Eastmark", "to": "Aldern" },
      { "from": "Sundby", "to": "Fjordland" },
      { "from": "Lowlands", "to": "Fjordland" }
    ],
    "highlight": "Eastmark",
    "tag": "Largest",
    "format": "{value} kt",
    "title": "Eastmark picked 720,000 tonnes",
    "subtitle": "Harvest by region, thousand tonnes. Lines are fruit-train routes."
  },
  "trend": {
    "data": [
      { "year": "2010", "mt": 1.5 },
      { "year": "2011", "mt": 1.56 },
      { "year": "2012", "mt": 1.48 },
      { "year": "2013", "mt": 1.65 },
      { "year": "2014", "mt": 1.72 },
      { "year": "2015", "mt": 1.69 },
      { "year": "2016", "mt": 1.81 },
      { "year": "2017", "mt": 1.9 },
      { "year": "2018", "mt": 2.05 },
      { "year": "2019", "mt": 2.2 },
      { "year": "2020", "mt": 2.52 },
      { "year": "2021", "mt": 2.31 },
      { "year": "2022", "mt": 1.98 },
      { "year": "2023", "mt": 2.15 },
      { "year": "2024", "mt": 2.1 },
      { "year": "2025", "mt": 2.4 }
    ],
    "x": "year",
    "y": "mt",
    "format": "{value}m t",
    "title": "The harvest was 2.52 million tonnes in 2020",
    "subtitle": "Apples picked per year, million tonnes, 2010 to 2025"
  },
  "area": {
    "data": [{ "land": "All farmland", "ha": 2100000 }, { "land": "Orchards", "ha": 84000 }],
    "name": "land",
    "value": "ha",
    "format": "compact",
    "ratio": "{ratio}x the area",
    "title": "Orchards covered 84,000 hectares",
    "subtitle": "Hectares, 2025"
  },
  "slope": {
    "data": [
      { "variety": "Gala", "y2015": 22, "y2025": 27 },
      { "variety": "Elstar", "y2015": 25, "y2025": 18 },
      { "variety": "Jonagold", "y2015": 20, "y2025": 14 },
      { "variety": "Braeburn", "y2015": 12, "y2025": 15 }
    ],
    "series": "variety",
    "y": ["y2015", "y2025"],
    "names": { "y2015": "2015", "y2025": "2025" },
    "highlight": "Gala",
    "format": "{value}%",
    "title": "Gala rose from 22% to 27% of the harvest"
  },
  "rank": {
    "data": [
      { "country": "Vesterhav", "kt": 190 },
      { "country": "Kalmar", "kt": 140 },
      { "country": "Ostland", "kt": 95 },
      { "country": "Meridia", "kt": 60 },
      { "country": "Tavria", "kt": 35 }
    ],
    "name": "country",
    "value": "kt",
    "format": "{value} kt",
    "highlight": "Vesterhav",
    "title": "Vesterhav bought 190,000 tonnes"
  },
  "parts": {
    "data": [
      { "part": "Shop", "cents": 71 },
      { "part": "Grower", "cents": 62 },
      { "part": "Packing and storage", "cents": 34 },
      { "part": "Transport", "cents": 21 },
      { "part": "Sales tax", "cents": 17 }
    ],
    "name": "part",
    "value": "cents",
    "format": "{value}c",
    "highlight": "Grower",
    "title": "Growers received 62 cents of a €2.05 kilo"
  },
  "map": {
    "data": [
      { "region": "Fjordland", "code": "Fj", "yield": 22, "col": 0, "row": 0 },
      { "region": "Highmoor", "code": "Hi", "yield": 27, "col": 1, "row": 0 },
      { "region": "Norvik", "code": "No", "yield": 19, "col": 2, "row": 0 },
      { "region": "Aldern", "code": "Al", "yield": 24, "col": 0, "row": 1 },
      { "region": "Eastmark", "code": "Ea", "yield": 41, "col": 1, "row": 1 },
      { "region": "Castren", "code": "Ca", "yield": 33, "col": 2, "row": 1 },
      { "region": "Lowlands", "code": "Lo", "yield": 35, "col": 1, "row": 2 },
      { "region": "Sundby", "code": "Su", "yield": 38, "col": 2, "row": 2 }
    ],
    "region": "region",
    "value": "yield",
    "code": "code",
    "title": "Eastmark picked 41 tonnes a hectare",
    "subtitle": "Yield by region, tonnes per hectare"
  },
  "circles": {
    "data": [
      { "who": "per person in Norland", "kg": 24 },
      { "who": "per person in Vesterhav", "kg": 17 },
      { "who": "per person in Kalmar", "kg": 9 }
    ],
    "name": "who",
    "value": "kg",
    "unit": "kg",
    "title": "Norlanders ate 24 kg of apples each"
  },
  "stats": [
    { "icon": "apple", "count": 4, "total": 10, "text": "apples were sold loose." },
    { "icon": "book", "count": 2, "total": 10, "text": "pickers were students." },
    { "icon": "tree", "count": 3, "total": 10, "text": "orchard trees were under ten years old." }
  ],
  "sources": ["Norland Fruit Growers' Association", "Norland Statistics Office"],
  "note": "Norland and its neighbours are invented. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `statement` | `{ value, label, context?, icon? }` |  | Band 1, left: the subject's main number in large light type, in the accent colour. |
| `spokes` | `{ data, name, value, icon?, centerLabel?, highlight?, title?, ...radial-spokes props } \| Slot` |  | Band 1, middle: 4 to 12 attributes as spokes round a centre icon (`radial-spokes`). |
| `network` | `{ data, name, value, links, highlight?, tag?, title?, ...bubble-network props } \| Slot` |  | Band 1, right: named places or things as circles sized by value and joined by lines (`bubble-network`). |
| `trend` | `{ data, x, y, peak?, format?, title?, ...area-chart props } \| Slot` |  | Band 2, wide: one measure over an ordered dimension as a smooth filled curve (`area-chart`). The highest point is labelled with its value and position; `peak` replaces that label, and `peak: false` removes it. |
| `area` | `{ data, name, value, ratio?, title?, ...proportional-area props } \| Slot` |  | Band 2: two or three quantities as squares nested from one corner, with a bracket stating the ratio (`proportional-area`, `layout: "nested"`). |
| `slope` | `{ data, series, y: [from, to], names?, highlight?, title?, ...slope-chart props } \| Slot` |  | Band 2: each entity at two dates, joined by a line and labelled at the end (`slope-chart`). |
| `rank` | `{ data, name, value, highlight?, title?, ...pill-rank props } \| Slot` |  | Band 3: a ranking of 4 to 6 rows as centred pills (`pill-rank`). Pass a `bar-chart` spec for bars instead. |
| `parts` | `{ data, name, value, title?, ...treemap props } \| Slot` |  | Band 3: the parts of one whole as tiles (`treemap`). |
| `map` | `{ data, region, value, code?, geo?, title?, ...choropleth-map props } \| Slot` |  | Band 3: a tile map shaded by value (`choropleth-map`). Give every row `col` and `row`, the tile's place in the grid, and the template builds the squares; `code` names the field printed on each tile. Pass `geo` to use your own GeoJSON. |
| `circles` | `{ data, name, value, unit?, title?, ...stat-circles props } \| Slot` |  | Band 3: two to four magnitudes as sized circles (`stat-circles`). |
| `stats` | `{ count, total?, text, icon?, value? }[]` |  | Closing row: up to three "3 in 10" statements, each a row of icons with some filled (`icon-stat`). |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"forest"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
| `mode` | `"light" \| "dark" \| "auto" \| "system"` | `"light"` | Colour mode of the poster and everything in it. A poster paints its own ground and does not follow the page unless you set `auto`. Only `paper` has a different dark variant. |
| `download` | `boolean` | `false` | Show a "Download PNG" control under the poster that saves the whole poster as one image. |
| `maxWidth` | `number \| string` | `1440` | Widest the poster is drawn. It is centred in wider containers. |
| `linked` | `boolean` | `false` | Make the marks clickable. Clicking a mark in one graphic highlights the same name in every other graphic that has it, and filters the graphics that read the shared `data`. Click it again, or the empty ground of that graphic, to clear. |
| `data` | `DataInput` |  | Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions. |
| `sources` | `string \| string[]` |  | Where the data comes from, shown in the footer. |
| `note` | `string` |  | Caveat shown in the footer, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the poster, shown at the right of the footer. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Heading level of the title. Panel headings are one level down. |

## Composition

- Composes: [poster](https://insightcharts.dev/llms/poster.md), [radial-spokes](https://insightcharts.dev/llms/radial-spokes.md), [bubble-network](https://insightcharts.dev/llms/bubble-network.md), [area-chart](https://insightcharts.dev/llms/area-chart.md), [proportional-area](https://insightcharts.dev/llms/proportional-area.md), [slope-chart](https://insightcharts.dev/llms/slope-chart.md), [pill-rank](https://insightcharts.dev/llms/pill-rank.md), [treemap](https://insightcharts.dev/llms/treemap.md), [choropleth-map](https://insightcharts.dev/llms/choropleth-map.md), [stat-circles](https://insightcharts.dev/llms/stat-circles.md), [icon-stat](https://insightcharts.dev/llms/icon-stat.md)
- Used by: no molecule or template yet

## More examples

### Dusk, a space programme, ten panels, with download

```tsx
import { AtlasPoster } from "insightcharts";

<AtlasPoster
  theme="dusk"
  download
  kicker="Space"
  title="The Norland Space Agency put 42 satellites into orbit in 2025"
  subtitle="Satellites, launches, ground stations, costs and budget of one national space programme."
  statement={{ value: "42", label: "Satellites launched in 2025", context: "38 in 2024", icon: "satellite" }}
  spokes={{
    data: [
      { purpose: "Earth observation", n: 14 },
      { purpose: "Communications", n: 11 },
      { purpose: "Navigation", n: 6 },
      { purpose: "Weather", n: 5 },
      { purpose: "Science", n: 4 },
      { purpose: "Technology tests", n: 2 },
    ],
    name: "purpose",
    value: "n",
    icon: "satellite",
    highlight: "Earth observation",
    title: "14 of the satellites observe the Earth",
  }}
  network={{
    data: [
      { station: "Skarvik", passes: 96 },
      { station: "Holm Pass", passes: 64 },
      { station: "Sundby", passes: 48 },
      { station: "Tarn Head", passes: 31 },
      { station: "Aldern", passes: 22 },
    ],
    name: "station",
    value: "passes",
    links: [
      { from: "Skarvik", to: "Holm Pass" },
      { from: "Skarvik", to: "Sundby" },
      { from: "Skarvik", to: "Tarn Head" },
      { from: "Skarvik", to: "Aldern" },
      { from: "Sundby", to: "Aldern" },
    ],
    highlight: "Skarvik",
    tag: "Control centre",
    title: "Skarvik tracked 96 satellite passes a day",
    subtitle: "Passes tracked per day by ground station. Lines are data links.",
  }}
  trend={{
    data: [
      { year: "2013", n: 3 },
      { year: "2014", n: 4 },
      { year: "2015", n: 4 },
      { year: "2016", n: 6 },
      { year: "2017", n: 9 },
      { year: "2018", n: 8 },
      { year: "2019", n: 13 },
      { year: "2020", n: 17 },
      { year: "2021", n: 24 },
      { year: "2022", n: 31 },
      { year: "2023", n: 46 },
      { year: "2024", n: 38 },
      { year: "2025", n: 42 },
    ],
    x: "year",
    y: "n",
    format: "integer",
    title: "The agency launched 46 satellites in 2023",
    subtitle: "Satellites put into orbit per year, 2013 to 2025",
  }}
  area={{
    data: [{ year: "2025", t: 60 }, { year: "2015", t: 4 }],
    name: "year",
    value: "t",
    format: "{value} t",
    ratio: "{ratio}x the mass",
    title: "60 tonnes reached orbit in 2025",
    subtitle: "Mass put into orbit per year, tonnes",
  }}
  slope={{
    data: [
      { rocket: "Small launcher", y2015: 41, y2025: 18 },
      { rocket: "Medium launcher", y2015: 22, y2025: 7 },
      { rocket: "Shared ride", y2015: 15, y2025: 4 },
    ],
    series: "rocket",
    y: ["y2015", "y2025"],
    names: { y2015: "2015", y2025: "2025" },
    highlight: "Shared ride",
    format: "€{value}k",
    title: "A shared ride cost €4,000 a kilogram in 2025",
    subtitle: "Launch price per kilogram, thousand euros",
  }}
  rank={{
    data: [
      { programme: "Launch services", m: 310 },
      { programme: "Earth observation", m: 240 },
      { programme: "Communications", m: 150 },
      { programme: "Science missions", m: 90 },
      { programme: "Ground stations", m: 60 },
    ],
    name: "programme",
    value: "m",
    format: "€{value}m",
    highlight: "Launch services",
    title: "Launch services cost €310 million",
  }}
  parts={{
    data: [
      { builder: "Agency workshops", n: 18 },
      { builder: "Universities", n: 13 },
      { builder: "Industry", n: 11 },
    ],
    name: "builder",
    value: "n",
    highlight: "Universities",
    title: "Universities built 13 of the 42 satellites",
  }}
  circles={{
    data: [
      { kind: "kg, relay satellite", kg: 4200 },
      { kind: "kg, weather satellite", kg: 1100 },
      { kind: "kg, cubesat", kg: 12 },
    ],
    name: "kind",
    value: "kg",
    format: "integer",
    title: "A relay satellite weighs 4,200 kg",
  }}
  stats={[
    { icon: "rocket", count: 9, total: 10, text: "launches reached their planned orbit." },
    { icon: "satellite", count: 3, total: 10, text: "satellites were built by universities." },
  ]}
  sources="Norland Space Agency annual report 2025"
  note="The Norland Space Agency is invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

### Sunrise, a country's internet, linked

```tsx
import { AtlasPoster } from "insightcharts";

<AtlasPoster
  theme="sunrise"
  linked
  kicker="The internet"
  title="94% of Norland's households were online in 2025"
  subtitle="Use, traffic, networks and speeds of the internet in one country."
  statement={{
    value: "94%",
    label: "Households with an internet connection in 2025",
    context: "81% in 2015",
    icon: "laptop",
  }}
  spokes={{
    data: [
      { use: "Messaging", share: 81 },
      { use: "Video", share: 64 },
      { use: "News", share: 52 },
      { use: "Shopping", share: 31 },
      { use: "Banking", share: 28 },
      { use: "Learning", share: 12 },
      { use: "Games", share: 24 },
    ],
    name: "use",
    value: "share",
    format: "{value}%",
    icon: "phone",
    highlight: "Messaging",
    title: "81% of adults sent a message online every day",
  }}
  network={{
    data: [
      { site: "Norvik", mw: 180 },
      { site: "Castren", mw: 120 },
      { site: "Sundby", mw: 75 },
      { site: "Eastmark", mw: 40 },
      { site: "Aldern", mw: 25 },
      { site: "Skarvik", mw: 15 },
    ],
    name: "site",
    value: "mw",
    links: [
      { from: "Norvik", to: "Castren" },
      { from: "Norvik", to: "Sundby" },
      { from: "Norvik", to: "Skarvik" },
      { from: "Norvik", to: "Aldern" },
      { from: "Castren", to: "Eastmark" },
      { from: "Sundby", to: "Eastmark" },
    ],
    highlight: "Norvik",
    tag: "Main exchange",
    format: "{value} MW",
    title: "Norvik's data centres drew 180 MW",
    subtitle: "Data-centre power by site, megawatts. Lines are trunk fibre routes.",
  }}
  trend={{
    data: [
      { hour: "00:00", gbps: 31 },
      { hour: "01:00", gbps: 22 },
      { hour: "02:00", gbps: 16 },
      { hour: "03:00", gbps: 13 },
      { hour: "04:00", gbps: 12 },
      { hour: "05:00", gbps: 15 },
      { hour: "06:00", gbps: 24 },
      { hour: "07:00", gbps: 38 },
      { hour: "08:00", gbps: 47 },
      { hour: "09:00", gbps: 52 },
      { hour: "10:00", gbps: 55 },
      { hour: "11:00", gbps: 58 },
      { hour: "12:00", gbps: 61 },
      { hour: "13:00", gbps: 60 },
      { hour: "14:00", gbps: 59 },
      { hour: "15:00", gbps: 62 },
      { hour: "16:00", gbps: 68 },
      { hour: "17:00", gbps: 77 },
      { hour: "18:00", gbps: 88 },
      { hour: "19:00", gbps: 97 },
      { hour: "20:00", gbps: 104 },
      { hour: "21:00", gbps: 98 },
      { hour: "22:00", gbps: 76 },
      { hour: "23:00", gbps: 49 },
    ],
    x: "hour",
    y: "gbps",
    format: "{value} Gbps",
    title: "Traffic reached 104 Gbps at 8pm",
    subtitle: "Traffic at the Norvik exchange by hour, an average weekday in 2025",
  }}
  area={{
    data: [{ homes: "All homes", k: 2600 }, { homes: "Homes with fibre", k: 1590 }],
    name: "homes",
    value: "k",
    format: "{value}k",
    ratio: false,
    title: "1.59 million of 2.6 million homes had fibre",
  }}
  slope={{
    data: [
      { tech: "Fibre", y2015: 8, y2025: 61 },
      { tech: "Cable", y2015: 34, y2025: 22 },
      { tech: "Copper line", y2015: 51, y2025: 9 },
      { tech: "Mobile only", y2015: 7, y2025: 8 },
    ],
    series: "tech",
    y: ["y2015", "y2025"],
    names: { y2015: "2015", y2025: "2025" },
    highlight: "Fibre",
    format: "{value}%",
    title: "Fibre rose from 8% to 61% of connections",
  }}
  rank={{
    data: [
      { region: "Norvik", mbps: 412 },
      { region: "Castren", mbps: 368 },
      { region: "Sundby", mbps: 290 },
      { region: "Eastmark", mbps: 214 },
      { region: "Highmoor", mbps: 96 },
    ],
    name: "region",
    value: "mbps",
    format: "{value} Mbps",
    highlight: "Norvik",
    title: "Norvik's median download speed was 412 Mbps",
  }}
  parts={{
    data: [
      { kind: "Video", share: 58 },
      { kind: "Games and downloads", share: 14 },
      { kind: "Web and apps", share: 12 },
      { kind: "Video calls", share: 9 },
      { kind: "Other", share: 7 },
    ],
    name: "kind",
    value: "share",
    format: "{value}%",
    highlight: "Video",
    title: "Video was 58% of traffic",
  }}
  map={{
    data: [
      { region: "Fjordland", code: "Fj", share: 34, col: 0, row: 0 },
      { region: "Highmoor", code: "Hi", share: 28, col: 1, row: 0 },
      { region: "Norvik", code: "No", share: 86, col: 2, row: 0 },
      { region: "Aldern", code: "Al", share: 47, col: 0, row: 1 },
      { region: "Eastmark", code: "Ea", share: 58, col: 1, row: 1 },
      { region: "Castren", code: "Ca", share: 79, col: 2, row: 1 },
      { region: "Lowlands", code: "Lo", share: 52, col: 1, row: 2 },
      { region: "Sundby", code: "Su", share: 71, col: 2, row: 2 },
    ],
    region: "region",
    value: "share",
    code: "code",
    format: "{value}%",
    title: "Fibre reached 86% of homes in Norvik",
    subtitle: "Homes with fibre available, by region",
  }}
  circles={{
    data: [
      { year: "GB a month in 2015", gb: 38 },
      { year: "GB a month in 2020", gb: 142 },
      { year: "GB a month in 2025", gb: 410 },
    ],
    name: "year",
    value: "gb",
    format: "integer",
    title: "A household used 410 GB a month in 2025",
  }}
  stats={[
    { icon: "cart", count: 1, total: 10, text: "adults had never bought anything online." },
    { icon: "phone", count: 7, total: 10, text: "minutes online were spent on a phone." },
    { icon: "lock", count: 4, total: 10, text: "adults used a password manager." },
  ]}
  sources={["Norland Communications Authority", "Norvik Internet Exchange"]}
  note="Norland is an invented country. All figures are illustrative."
  credit="InsightCharts"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/atlas-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/atlas-poster.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
