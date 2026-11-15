# Build an Atlas poster with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add an Atlas poster (`atlas-poster`, an infographic template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

A landscape spread of up to eleven small illustrations of one subject, each a different graphic form, in three bands of unequal panels: a statement in large type, spokes round an icon and a network of circles; a smooth trend with its peak labelled, nested squares and a slope chart; a pill ranking, a treemap, a tile map and sized circles; and a closing row of icon statements.

Use it when: Use it when one subject has many small facts of different kinds (shares, places, a trend, a change, a ranking, a map) and none of them should dominate: a crop, an industry, a service, a country's internet. Fill at least eight regions. Give every panel a short heading that states its one number. Every region is optional, and each band shares its width among the panels that are present.

Pick something else when: One dominant fact or graphic (use `count-poster`, `flow-poster` or `ranking-poster`). The same measures across several entities (use `matrix-poster`). Fewer than six panels (use `poster` and place them yourself). A phone-first piece: the spread becomes one long column under 600px.

Instructions for the alternatives: `ranking-poster` https://insightcharts.dev/agents/templates/ranking-poster.md, `matrix-poster` https://insightcharts.dev/agents/templates/matrix-poster.md, `count-poster` https://insightcharts.dev/agents/templates/count-poster.md, `flow-poster` https://insightcharts.dev/agents/templates/flow-poster.md, `poster` https://insightcharts.dev/agents/molecules/poster.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/atlas-poster
```

The file lands at `components/insightcharts/templates/atlas-poster.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { AtlasPoster } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Regions" below. Each region holds its own `data` rows and the field names that read them. It also has a shared `data` prop: Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions.

## 5. Working example

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

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

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

This example sets `theme="forest"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

## Regions

Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`.

- `statement`, `{ value, label, context?, icon? }`: Band 1, left: the subject's main number in large light type, in the accent colour. In the example: an object with `value`, `label`, `context`, `icon`.
- `spokes`, `{ data, name, value, icon?, centerLabel?, highlight?, title?, ...radial-spokes props } | Slot`: Band 1, middle: 4 to 12 attributes as spokes round a centre icon (`radial-spokes`). In the example: a config with 7 rows of `data` and the fields `name: "use"`, `value: "share"`.
- `network`, `{ data, name, value, links, highlight?, tag?, title?, ...bubble-network props } | Slot`: Band 1, right: named places or things as circles sized by value and joined by lines (`bubble-network`). In the example: a config with 6 rows of `data` and the fields `name: "region"`, `value: "kt"`.
- `trend`, `{ data, x, y, peak?, format?, title?, ...area-chart props } | Slot`: Band 2, wide: one measure over an ordered dimension as a smooth filled curve (`area-chart`). The highest point is labelled with its value and position; `peak` replaces that label, and `peak: false` removes it. In the example: a config with 16 rows of `data` and the fields `x: "year"`, `y: "mt"`.
- `area`, `{ data, name, value, ratio?, title?, ...proportional-area props } | Slot`: Band 2: two or three quantities as squares nested from one corner, with a bracket stating the ratio (`proportional-area`, `layout: "nested"`). In the example: a config with 2 rows of `data` and the fields `name: "land"`, `value: "ha"`.
- `slope`, `{ data, series, y: [from, to], names?, highlight?, title?, ...slope-chart props } | Slot`: Band 2: each entity at two dates, joined by a line and labelled at the end (`slope-chart`). In the example: a config with 4 rows of `data` and the fields `series: "variety"`.
- `rank`, `{ data, name, value, highlight?, title?, ...pill-rank props } | Slot`: Band 3: a ranking of 4 to 6 rows as centred pills (`pill-rank`). Pass a `bar-chart` spec for bars instead. In the example: a config with 5 rows of `data` and the fields `name: "country"`, `value: "kt"`.
- `parts`, `{ data, name, value, title?, ...treemap props } | Slot`: Band 3: the parts of one whole as tiles (`treemap`). In the example: a config with 5 rows of `data` and the fields `name: "part"`, `value: "cents"`.
- `map`, `{ data, region, value, code?, geo?, title?, ...choropleth-map props } | Slot`: Band 3: a tile map shaded by value (`choropleth-map`). Give every row `col` and `row`, the tile's place in the grid, and the template builds the squares; `code` names the field printed on each tile. Pass `geo` to use your own GeoJSON. In the example: a config with 8 rows of `data` and the fields `region: "region"`, `value: "yield"`, `code: "code"`.
- `circles`, `{ data, name, value, unit?, title?, ...stat-circles props } | Slot`: Band 3: two to four magnitudes as sized circles (`stat-circles`). In the example: a config with 3 rows of `data` and the fields `name: "who"`, `value: "kg"`, `unit: "kg"`.
- `stats`, `{ count, total?, text, icon?, value? }[]`: Closing row: up to three "3 in 10" statements, each a row of icons with some filled (`icon-stat`). In the example: 3 items: an object with `icon`, `count`, `total`, `text`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

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

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `poster` (molecule), `radial-spokes` (atom), `bubble-network` (atom), `area-chart` (atom), `proportional-area` (atom), `slope-chart` (atom), `pill-rank` (atom), `treemap` (atom), `choropleth-map` (atom), `stat-circles` (atom), `icon-stat` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- `title` is the poster's one fact with its number. Keep other text short.
- Do not set colours. Pick a poster theme with `theme`. A poster keeps its own colours in dark mode.
- Set `sources`. Say in `note` when figures are illustrative.
- A poster becomes one column under 600px wide, in the order of its regions. Order them for that reading.
- Set `download` when the user wants the whole piece as one PNG. It adds a "Download PNG" control under the piece.
- Set `linked` to make a click on a mark filter the other regions.
- Poster themes: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Set `level` to the heading level that fits the page outline.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] The poster keeps its own colours on a dark page.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `sources` is set.
- [ ] No example data or example text is left in place.

## Reference

- Component reference with every example: https://insightcharts.dev/llms/atlas-poster.md
- Registry item: https://insightcharts.dev/r/atlas-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/atlas-poster.tsx
- How to choose a different infographic: https://insightcharts.dev/agents/infographics.md
- This page: https://insightcharts.dev/templates/atlas-poster
- These instructions as plain text: https://insightcharts.dev/agents/templates/atlas-poster.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
