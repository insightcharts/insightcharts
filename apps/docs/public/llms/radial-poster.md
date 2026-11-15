# Radial poster (`radial-poster`)

> A poster with one subject in the middle of the sheet: a wheel of spokes round an icon (`radial-spokes`), two to four large figures standing either side of it, and a bottom row with the same subject's surroundings on concentric rings (`orbit-chart`) and a ranking as centred pills (`pill-rank`).

- Component: `RadialPoster` (import from `insightcharts`)
- Spec type: `"radial-poster"`
- Level: template. Category: infographic.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it when the poster is about the 4 to 12 parts, causes, effects or scores of one thing: what a household's water goes on, the species one tree supports, where one home's energy goes. Give `hero` the spokes and an `icon` for the centre, state the total in the title, and use `figures` for the two to four numbers a reader should take away.

## Avoid

Parts of a whole that must be compared precisely (use `bar-chart` in a `poster`). Positions on one scale (use `scale-poster`). Change over time (use `timeline-poster`). Connections between many things (use `network-poster`). Large counts shown as crowds (use `count-poster`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/radial-poster
```

The file lands at `components/insightcharts/templates/radial-poster.tsx`. `@insightcharts/radial-poster-demo` adds a ready-made example next to it.

## Usage

```tsx
import { RadialPoster } from "insightcharts";

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
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "radial-poster",
  "theme": "magenta",
  "kicker": "Water",
  "title": "A person on Verne Street used 142 litres of water a day in 2025",
  "subtitle": "Litres of mains water per person per day by use, 212 metered homes, 2025.",
  "hero": {
    "data": [
      { "use": "Shower", "litres": 44 },
      { "use": "Toilet", "litres": 31 },
      { "use": "Washing machine", "litres": 19 },
      { "use": "Kitchen tap", "litres": 17 },
      { "use": "Garden", "litres": 12 },
      { "use": "Dishwasher", "litres": 9 },
      { "use": "Bath", "litres": 6 },
      { "use": "Other", "litres": 4 }
    ],
    "name": "use",
    "value": "litres",
    "icon": "drop",
    "format": "{value} L",
    "highlight": "Shower"
  },
  "figures": [
    { "value": "44 L", "label": "went on showers", "context": "31% of the daily total" },
    { "value": "9 min", "label": "was the average length of a shower" },
    { "value": "6 L", "label": "went on baths" },
    { "value": "€1.12", "label": "was the cost of one person's water for a day" }
  ],
  "rings": {
    "data": [
      { "fixture": "Bath", "room": "Bathroom", "litres": 80 },
      { "fixture": "Shower, 8 min", "room": "Bathroom", "litres": 64 },
      { "fixture": "Toilet flush", "room": "Bathroom", "litres": 6 },
      { "fixture": "Washing machine", "room": "Kitchen", "litres": 50 },
      { "fixture": "Dishwasher", "room": "Kitchen", "litres": 12 },
      { "fixture": "Washing-up bowl", "room": "Kitchen", "litres": 8 },
      { "fixture": "Hose, 10 min", "room": "Garden", "litres": 150 },
      { "fixture": "Watering can", "room": "Garden", "litres": 10 }
    ],
    "name": "fixture",
    "ring": "room",
    "value": "litres",
    "format": "{value} L",
    "icon": "house",
    "ringLabel": "One ring per room",
    "sizeLabel": "litres per use",
    "highlight": "Hose, 10 min",
    "title": "Ten minutes with a hose used 150 litres",
    "height": 460
  },
  "rank": {
    "data": [
      { "district": "Harbour", "litres": 168 },
      { "district": "Old Town", "litres": 155 },
      { "district": "Verne Street", "litres": 142 },
      { "district": "Northgate", "litres": 136 },
      { "district": "Riverside", "litres": 129 },
      { "district": "Mill Lane", "litres": 117 }
    ],
    "name": "district",
    "value": "litres",
    "format": "{value} L",
    "highlight": "Verne Street",
    "title": "Verne Street ranked third of six districts"
  },
  "sources": "Verne Street metering study 2025",
  "note": "Verne Street and its figures are invented. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `hero` (required) | `{ data, name, value, icon?, centerLabel?, shape?, sweep?, max?, highlight?, format?, title?, ... } \| Slot` |  | The hero: one spoke per row round a centre disc, drawn by `radial-spokes`. A full spec or element replaces it. |
| `figures` | `{ value: string; label: string; context?: string; icon?: string; tag?: string }[]` |  | Two to four large figures. On a sheet at least 960px wide they stand in two columns either side of the hero; on a narrower one they run in a row under it. |
| `rings` | `{ data, name, ring, value?, rings?, ringLabel?, sizeLabel?, icon?, centerLabel?, title?, ... } \| Slot` |  | Bottom left: named things on concentric rings, one ring per category, level or period (`orbit-chart`). |
| `rank` | `{ data, name, value, highlight?, compare?, format?, title?, ... } \| Slot` |  | Bottom right: a ranking as centred pills (`pill-rank`). With only one of `rings` and `rank`, that one takes the full width. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"magenta"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
| `mode` | `"light" \| "dark" \| "auto" \| "system"` | `"light"` | Colour mode of the poster and everything in it. A poster paints its own ground and does not follow the page unless you set `auto`. Only `paper` has a different dark variant. |
| `download` | `boolean` | `false` | Show a "Download PNG" control under the poster that saves the whole poster as one image. |
| `maxWidth` | `number \| string` | `1100` | Widest the poster is drawn. It is centred in wider containers. |
| `linked` | `boolean` | `false` | Make the marks clickable. Clicking a mark in one graphic highlights the same name in every other graphic that has it, and filters the graphics that read the shared `data`. Click it again, or the empty ground of that graphic, to clear. |
| `data` | `DataInput` |  | Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions. |
| `sources` | `string \| string[]` |  | Where the data comes from, shown in the footer. |
| `note` | `string` |  | Caveat shown in the footer, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the poster, shown at the right of the footer. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Heading level of the title. Panel headings are one level down. |

## Composition

- Composes: [poster](https://insightcharts.dev/llms/poster.md), [radial-spokes](https://insightcharts.dev/llms/radial-spokes.md), [orbit-chart](https://insightcharts.dev/llms/orbit-chart.md), [pill-rank](https://insightcharts.dev/llms/pill-rank.md)
- Used by: no molecule or template yet

## More examples

### Forest, one tree, no rings, with download

```tsx
import { RadialPoster } from "insightcharts";

<RadialPoster
  theme="forest"
  download
  kicker="Woodland"
  title="One oak in Halden Wood supported 284 species in 2025"
  subtitle="Species recorded on a single 180-year-old oak by group, April to September 2025."
  hero={{
    data: [
      { group: "Insects", species: 126 },
      { group: "Lichens", species: 58 },
      { group: "Fungi", species: 41 },
      { group: "Birds", species: 23 },
      { group: "Mosses", species: 19 },
      { group: "Mammals", species: 11 },
      { group: "Spiders", species: 6 },
    ],
    name: "group",
    value: "species",
    icon: "tree",
    shape: "line",
    highlight: "Insects",
  }}
  figures={[
    { value: "126", label: "of the 284 species were insects" },
    { value: "180", label: "years is the age of the tree" },
    { value: "23", label: "bird species fed or nested on it" },
    { value: "58", label: "lichens grew on its bark" },
  ]}
  rank={{
    data: [
      { tree: "Oak", species: 284 },
      { tree: "Willow", species: 251 },
      { tree: "Birch", species: 229 },
      { tree: "Hawthorn", species: 149 },
      { tree: "Beech", species: 98 },
      { tree: "Ash", species: 68 },
    ],
    name: "tree",
    value: "species",
    highlight: "Oak",
    title: "Willow supported 251 species",
  }}
  sources="Halden Wood survey 2025"
  note="Halden Wood is an invented place. All figures are illustrative."
  credit="InsightCharts"
/>
```

### Noir, a half wheel, linked to the ranking

```tsx
import { RadialPoster } from "insightcharts";

<RadialPoster
  theme="noir"
  linked
  kicker="Home energy"
  title="Heating took 5,900 of the 11,400 kWh one Carrow house used in 2025"
  subtitle="Electricity used by one all-electric house by end use, kilowatt-hours, 2025."
  hero={{
    data: [
      { use: "Heating", kwh: 5900 },
      { use: "Hot water", kwh: 2100 },
      { use: "Car charging", kwh: 1800 },
      { use: "Appliances", kwh: 900 },
      { use: "Cooking", kwh: 450 },
      { use: "Lighting", kwh: 250 },
    ],
    name: "use",
    value: "kwh",
    icon: "house",
    sweep: 180,
    startAngle: -90,
    format: "{value} kWh",
  }}
  figures={[
    { value: "52%", label: "of the electricity went on heating" },
    { value: "€2,514", label: "was the electricity bill for the year" },
  ]}
  rank={{
    data: [
      { use: "Heating", eur: 1298 },
      { use: "Hot water", eur: 462 },
      { use: "Car charging", eur: 306 },
      { use: "Appliances", eur: 252 },
      { use: "Cooking", eur: 126 },
      { use: "Lighting", eur: 70 },
    ],
    name: "use",
    value: "eur",
    format: "€{value}",
    title: "Heating cost €1,298 of the €2,514",
  }}
  sources="Carrow house smart-meter export"
  note="The Carrow house is invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/radial-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/radial-poster.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
