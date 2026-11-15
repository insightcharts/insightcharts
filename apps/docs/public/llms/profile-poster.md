# Profile poster (`profile-poster`)

> A poster that describes one subject from four sides: the subject as one large silhouette filled to a share (`shape-fill`), two to four large figures, its place among other things on one scale (`scale-ladder`), and a table that sets it beside its peers with every number drawn as a small form (`glyph-table`).

- Component: `ProfilePoster` (import from `insightcharts`)
- Spec type: `"profile-poster"`
- Level: template. Category: infographic.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it for a fact sheet about one named thing: a vehicle, a reservoir, a building, a machine, a species. Give `portrait` one row with the share that defines the subject and the `icon` that stands for it, `figures` the numbers a reader should take away, `scale` the subject among 4 to 10 reference points, and `table` the subject beside 2 to 6 peers. Highlight the subject in `scale` and `table`. On a sheet at least 960px wide the silhouette, the figures and the scale stand in three columns.

## Avoid

Several subjects of equal weight (use `glyph-table` in a `poster`, or `ranking-poster`). A subject whose parts are the point (use `radial-poster`). A subject with no defining share: leave `portrait` to a full spec such as `stat-circles`, or use `scale-poster` when the scale is the whole subject. Change over time (use `timeline-poster`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/profile-poster
```

The file lands at `components/insightcharts/templates/profile-poster.tsx`. `@insightcharts/profile-poster-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ProfilePoster } from "insightcharts";

<ProfilePoster
  theme="blueprint"
  kicker="Public transport"
  title="The Line 9 electric bus ended a working day with 34% of its charge"
  subtitle="One 12-metre battery bus on Marlow's Line 9, average of 60 working days in 2025."
  portrait={{
    data: [{ state: "Charge left at 23:00", charge: 34 }],
    name: "state",
    value: "charge",
    icon: "bus",
    title: "Charge left at the end of the day",
  }}
  figures={[
    { value: "204 km", label: "driven on a working day" },
    { value: "310 km", label: "of range on a full charge" },
    { value: "4 h", label: "to recharge overnight at the depot" },
  ]}
  scale={{
    data: [
      { vehicle: "Electric scooter", km: 35, icon: "bolt" },
      { vehicle: "Electric bike", km: 70, icon: "bike" },
      { vehicle: "Delivery van", km: 210, icon: "truck" },
      { vehicle: "Line 9 bus", km: 310, icon: "bus" },
      { vehicle: "Family car", km: 420, icon: "car" },
      { vehicle: "Long-haul truck", km: 520, icon: "truck" },
    ],
    name: "vehicle",
    value: "km",
    iconField: "icon",
    min: 0,
    max: 600,
    format: "{value} km",
    scaleLabel: "Range, km",
    highlight: "Line 9 bus",
    title: "Range of six electric vehicles",
  }}
  table={{
    rows: [
      { vehicle: "Line 9 bus", seats: 41, cost: 0.21, co2: 14, noise: 62 },
      { vehicle: "Diesel bus", seats: 43, cost: 0.58, co2: 71, noise: 78 },
      { vehicle: "Tram", seats: 64, cost: 0.17, co2: 9, noise: 70 },
    ],
    name: "vehicle",
    nameLabel: "Vehicle",
    highlight: "Line 9 bus",
    title: "The Line 9 bus emitted 14 g of CO2 per passenger-kilometre",
    columns: [
      { field: "seats", label: "Seats", glyph: "icons", icon: "person", unit: 5 },
      { field: "cost", label: "Energy cost per km", glyph: "bar", format: "€{value}", max: 0.6 },
      { field: "co2", label: "CO2 per passenger-km", glyph: "circle", format: "{value} g" },
      { field: "noise", label: "Noise at 10 m", glyph: "bar", format: "{value} dB", max: 80 },
    ],
  }}
  sources="Marlow Transit depot telemetry, 2025"
  note="Marlow Transit and the Line 9 bus are invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "profile-poster",
  "theme": "blueprint",
  "kicker": "Public transport",
  "title": "The Line 9 electric bus ended a working day with 34% of its charge",
  "subtitle": "One 12-metre battery bus on Marlow's Line 9, average of 60 working days in 2025.",
  "portrait": {
    "data": [{ "state": "Charge left at 23:00", "charge": 34 }],
    "name": "state",
    "value": "charge",
    "icon": "bus",
    "title": "Charge left at the end of the day"
  },
  "figures": [
    { "value": "204 km", "label": "driven on a working day" },
    { "value": "310 km", "label": "of range on a full charge" },
    { "value": "4 h", "label": "to recharge overnight at the depot" }
  ],
  "scale": {
    "data": [
      { "vehicle": "Electric scooter", "km": 35, "icon": "bolt" },
      { "vehicle": "Electric bike", "km": 70, "icon": "bike" },
      { "vehicle": "Delivery van", "km": 210, "icon": "truck" },
      { "vehicle": "Line 9 bus", "km": 310, "icon": "bus" },
      { "vehicle": "Family car", "km": 420, "icon": "car" },
      { "vehicle": "Long-haul truck", "km": 520, "icon": "truck" }
    ],
    "name": "vehicle",
    "value": "km",
    "iconField": "icon",
    "min": 0,
    "max": 600,
    "format": "{value} km",
    "scaleLabel": "Range, km",
    "highlight": "Line 9 bus",
    "title": "Range of six electric vehicles"
  },
  "table": {
    "rows": [
      { "vehicle": "Line 9 bus", "seats": 41, "cost": 0.21, "co2": 14, "noise": 62 },
      { "vehicle": "Diesel bus", "seats": 43, "cost": 0.58, "co2": 71, "noise": 78 },
      { "vehicle": "Tram", "seats": 64, "cost": 0.17, "co2": 9, "noise": 70 }
    ],
    "name": "vehicle",
    "nameLabel": "Vehicle",
    "highlight": "Line 9 bus",
    "title": "The Line 9 bus emitted 14 g of CO2 per passenger-kilometre",
    "columns": [
      { "field": "seats", "label": "Seats", "glyph": "icons", "icon": "person", "unit": 5 },
      {
        "field": "cost",
        "label": "Energy cost per km",
        "glyph": "bar",
        "format": "€{value}",
        "max": 0.6
      },
      { "field": "co2", "label": "CO2 per passenger-km", "glyph": "circle", "format": "{value} g" },
      {
        "field": "noise",
        "label": "Noise at 10 m",
        "glyph": "bar",
        "format": "{value} dB",
        "max": 80
      }
    ]
  },
  "sources": "Marlow Transit depot telemetry, 2025",
  "note": "Marlow Transit and the Line 9 bus are invented. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `portrait` (required) | `{ data, name, value, icon, max?, format?, title?, ... } \| Slot` |  | The portrait: one silhouette filled from the bottom to the share in its row, with the number beside it, drawn by `shape-fill`. `format` defaults to `"{value}%"`. A full spec or element replaces it. |
| `figures` | `{ value: string; label: string; context?: string; icon?: string; tag?: string }[]` |  | Two to four large figures about the subject. In the three-column layout they stand between the silhouette and the scale; otherwise they run in a strip. |
| `scale` | `{ data, name, value, iconField?, direction?, scale?, min?, max?, zones?, scaleLabel?, highlight?, format?, title?, ... } \| Slot` |  | The subject among 4 to 10 other things on one scale (`scale-ladder`). It is drawn as tall as the silhouette. |
| `table` | `{ rows, name, columns, nameLabel?, highlight?, order?, title?, ... } \| Slot` |  | The subject beside its peers, one row each, with a glyph per measure (`glyph-table`). `columns` is `{ field, label?, glyph?, unit?, format?, max?, icon? }[]`. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"blueprint"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
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

- Composes: [poster](https://insightcharts.dev/llms/poster.md), [shape-fill](https://insightcharts.dev/llms/shape-fill.md), [scale-ladder](https://insightcharts.dev/llms/scale-ladder.md), [glyph-table](https://insightcharts.dev/llms/glyph-table.md)
- Used by: no molecule or template yet

## More examples

### Dusk, a reservoir, depths read downwards, linked

```tsx
import { ProfilePoster } from "insightcharts";

<ProfilePoster
  theme="dusk"
  linked
  kicker="Water supply"
  title="Carrow Reservoir was 63% full on 1 September 2025"
  subtitle="Water stored in Carrow Reservoir as a share of its 65 million cubic metre capacity."
  portrait={{
    data: [{ reservoir: "Carrow", full: 63 }],
    name: "reservoir",
    value: "full",
    icon: "drop",
    title: "Share of capacity in store",
  }}
  figures={[
    { value: "41 million", label: "cubic metres of water were in store" },
    { value: "212,000", label: "homes take their water from it" },
    { value: "9 m", label: "below the spillway was the water level" },
  ]}
  scale={{
    data: [
      { level: "Spillway crest", m: 0, icon: "wave" },
      { level: "Water on 1 September", m: 9, icon: "drop" },
      { level: "Upper intake", m: 14, icon: "pin" },
      { level: "Lower intake", m: 31, icon: "pin" },
      { level: "Old mill bridge", m: 38, icon: "building" },
      { level: "Reservoir floor", m: 52, icon: "mountain" },
    ],
    name: "level",
    value: "m",
    iconField: "icon",
    direction: "down",
    min: 0,
    max: 60,
    format: "{value} m",
    scaleLabel: "Depth below the spillway, m",
    highlight: "Water on 1 September",
    title: "The lower intake is 31 m below the spillway",
  }}
  table={{
    rows: [
      { reservoir: "Carrow", full: 63, stored: 41, homes: 212, age: 71 },
      { reservoir: "Upper Fen", full: 41, stored: 12, homes: 64, age: 38 },
      { reservoir: "Stonebeck", full: 88, stored: 57, homes: 188, age: 54 },
      { reservoir: "Hollin Moss", full: 72, stored: 23, homes: 97, age: 102 },
    ],
    name: "reservoir",
    nameLabel: "Reservoir",
    title: "Stonebeck Reservoir was 88% full on the same day",
    columns: [
      { field: "full", label: "Share of capacity", glyph: "ring", format: "{value}%" },
      { field: "stored", label: "Water in store, million m³", glyph: "circle" },
      {
        field: "homes",
        label: "Homes supplied, thousands",
        glyph: "icons",
        icon: "house",
        unit: 20,
      },
      { field: "age", label: "Age, years", glyph: "bar" },
    ],
  }}
  sources="Carrow Water, reservoir levels bulletin"
  note="Carrow Water and its reservoirs are invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

### Paper, a wind turbine, no table, with download

```tsx
import { ProfilePoster } from "insightcharts";

<ProfilePoster
  theme="paper"
  download
  kicker="Wind power"
  title="The Aldern turbine ran at 38% of its full output in 2025"
  subtitle="Electricity generated by one 4.2 MW turbine as a share of its output at full power all year."
  portrait={{
    data: [{ measure: "Capacity factor, 2025", share: 38 }],
    name: "measure",
    value: "share",
    icon: "wind-turbine",
    title: "Share of full output",
  }}
  figures={[
    { value: "14 GWh", label: "of electricity generated in 2025" },
    { value: "3,700", label: "homes' use of electricity for a year" },
  ]}
  scale={{
    data: [
      { thing: "Oak tree", m: 24, icon: "tree" },
      { thing: "Electricity pylon", m: 50, icon: "bolt" },
      { thing: "Aldern church spire", m: 62, icon: "building" },
      { thing: "Turbine hub", m: 105, icon: "wind-turbine" },
      { thing: "Turbine blade tip", m: 170, icon: "wind-turbine" },
    ],
    name: "thing",
    value: "m",
    iconField: "icon",
    min: 0,
    max: 200,
    format: "{value} m",
    scaleLabel: "Height, m",
    highlight: ["Turbine hub", "Turbine blade tip"],
    title: "The blade tip reaches 170 m",
  }}
  sources="Aldern Community Energy, generation report 2025"
  note="Aldern Community Energy is invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/profile-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/profile-poster.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
