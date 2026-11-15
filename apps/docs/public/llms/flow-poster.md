# Flow poster (`flow-poster`)

> A portrait poster of where something comes from and where it goes, in three stacked bands painted in one colour: the producers as large labelled tiles, the leading producer's output fanning out as ribbons to an aligned column of destinations, and the destinations as bubbles on a scale of how much each depends on that producer.

- Component: `FlowPoster` (import from `insightcharts`)
- Spec type: `"flow-poster"`
- Level: template. Category: infographic.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it when one producer leads and the reader should follow its output: ports and the buyers of one port's catch, regions and the users of one region's electricity, terminals and the routes out of the largest. Give `producers` 4 to 10 rows, `flow` 4 to 12 destinations of the leading producer, and `scale` the same destinations with a share (position) and a size. Keep the destination names identical in `flow` and `scale` so `linked` can join them.

## Avoid

Flows through more than one stage or between many sources and many destinations (use `sankey-chart` in a `poster`). A count of people or things (use `count-poster`). Many measures of the same entities (use `matrix-poster`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/flow-poster
```

The file lands at `components/insightcharts/templates/flow-poster.tsx`. `@insightcharts/flow-poster-demo` adds a ready-made example next to it.

## Usage

```tsx
import { FlowPoster } from "insightcharts";

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
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "flow-poster",
  "theme": "magenta",
  "kicker": "Fishing",
  "title": "Six ports on the Verran Coast landed 412,000 tonnes of fish in 2025",
  "subtitle": "Landings by port, the buyers of Port Alda's catch, and how much each buyer relies on Port Alda. Thousand tonnes (kt).",
  "format": "{value} kt",
  "producers": {
    "data": [
      { "port": "Port Alda", "kt": 148 },
      { "port": "Skerry", "kt": 96 },
      { "port": "Marrow Bay", "kt": 71 },
      { "port": "Tolven", "kt": 52 },
      { "port": "Hask", "kt": 28 },
      { "port": "Lund", "kt": 17 }
    ],
    "name": "port",
    "value": "kt",
    "title": "Port Alda landed 148,000 of the 412,000 tonnes"
  },
  "flow": {
    "data": [
      { "buyer": "Canneries", "kt": 46 },
      { "buyer": "Fresh markets", "kt": 34 },
      { "buyer": "Frozen export", "kt": 29 },
      { "buyer": "Fishmeal plants", "kt": 21 },
      { "buyer": "Restaurants", "kt": 11 },
      { "buyer": "Smokehouses", "kt": 7 }
    ],
    "name": "buyer",
    "value": "kt",
    "trunk": "Port Alda",
    "title": "Canneries bought 46,000 tonnes of Port Alda's catch"
  },
  "scale": {
    "data": [
      { "buyer": "Canneries", "fromAlda": 56, "kt": 82 },
      { "buyer": "Fresh markets", "fromAlda": 35, "kt": 96 },
      { "buyer": "Frozen export", "fromAlda": 23, "kt": 124 },
      { "buyer": "Fishmeal plants", "fromAlda": 34, "kt": 61 },
      { "buyer": "Restaurants", "fromAlda": 29, "kt": 38 },
      { "buyer": "Smokehouses", "fromAlda": 64, "kt": 11 }
    ],
    "name": "buyer",
    "value": "fromAlda",
    "size": "kt",
    "sizeFormat": "{value} kt",
    "scaleLabel": "From Port Alda",
    "title": "Smokehouses bought 64% of their fish from Port Alda",
    "subtitle": "Share of each buyer's fish landed at Port Alda (position) and all the fish it bought (area)"
  },
  "sources": "Verran Coast Fisheries Board landing returns",
  "note": "The Verran Coast is an invented place. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `producers` (required) | `{ data, name, value, title?, subtitle?, source?, ...treemap props } \| Slot` |  | Top band: the producers as tiles sized by output (`treemap`). The leading one is painted in the accent. |
| `lead` | `string` |  | The producer the flow starts from. Default: the largest row of `producers`. It names the block the ribbons leave. |
| `flow` (required) | `{ data, name, value, trunk?, tagged?, tagLabel?, title?, ...fan-flow props } \| Slot` |  | Middle band: one ribbon per destination, as thick as its value, ending at a column of names, values and shares (`fan-flow`). |
| `scale` | `{ data, name, value, size, scaleLabel?, sizeFormat?, title?, ...bubble-scale props } \| Slot` |  | Bottom band: one bubble per destination, placed by `value` on a 0 to 100 scale and sized by `size` (`bubble-scale`). Set `domain` and `ticks` for a scale that is not a percentage. |
| `format` | `FormatSpec` |  | How to print the quantities of the top and middle bands, e.g. `"{value} kt"`. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"magenta"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
| `mode` | `"light" \| "dark" \| "auto" \| "system"` | `"light"` | Colour mode of the poster and everything in it. A poster paints its own ground and does not follow the page unless you set `auto`. Only `paper` has a different dark variant. |
| `download` | `boolean` | `false` | Show a "Download PNG" control under the poster that saves the whole poster as one image. |
| `maxWidth` | `number \| string` | `920` | Widest the poster is drawn. It is centred in wider containers. |
| `linked` | `boolean` | `false` | Make the marks clickable. Clicking a mark in one graphic highlights the same name in every other graphic that has it, and filters the graphics that read the shared `data`. Click it again, or the empty ground of that graphic, to clear. |
| `data` | `DataInput` |  | Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions. |
| `sources` | `string \| string[]` |  | Where the data comes from, shown in the footer. |
| `note` | `string` |  | Caveat shown in the footer, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the poster, shown at the right of the footer. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Heading level of the title. Panel headings are one level down. |

## Composition

- Composes: [poster](https://insightcharts.dev/llms/poster.md), [treemap](https://insightcharts.dev/llms/treemap.md), [fan-flow](https://insightcharts.dev/llms/fan-flow.md), [bubble-scale](https://insightcharts.dev/llms/bubble-scale.md)
- Used by: no molecule or template yet

## More examples

### Ocean, electricity from one region, linked

```tsx
import { FlowPoster } from "insightcharts";

<FlowPoster
  theme="ocean"
  linked
  kicker="Energy"
  title="Norrask generated 175 TWh of electricity in 2025"
  subtitle="Generation by region, the users of Fjordland's output, and Fjordland's share of each user's supply. Terawatt-hours (TWh)."
  format="{value} TWh"
  producers={{
    data: [
      { region: "Fjordland", twh: 64 },
      { region: "Highmoor", twh: 41 },
      { region: "Eastmark", twh: 33 },
      { region: "Sundby", twh: 22 },
      { region: "Lowlands", twh: 15 },
    ],
    name: "region",
    value: "twh",
    title: "Fjordland generated 64 of the 175 TWh",
  }}
  flow={{
    data: [
      { user: "Fjordland homes", twh: 22 },
      { user: "Capital region", twh: 14 },
      { user: "Aluminium smelters", twh: 11 },
      { user: "Export to Vesterhav", twh: 8 },
      { user: "Export to Kalmar", twh: 5 },
      { user: "Data centres", twh: 4 },
    ],
    name: "user",
    value: "twh",
    trunk: "Fjordland",
    tagged: ["Export to Vesterhav", "Export to Kalmar"],
    tagLabel: "Leaves the country",
    title: "Fjordland's own homes used 22 of its 64 TWh",
  }}
  scale={{
    data: [
      { user: "Fjordland homes", share: 81, twh: 27 },
      { user: "Capital region", share: 38, twh: 37 },
      { user: "Aluminium smelters", share: 92, twh: 12 },
      { user: "Export to Vesterhav", share: 12, twh: 67 },
      { user: "Export to Kalmar", share: 7, twh: 71 },
      { user: "Data centres", share: 57, twh: 7 },
    ],
    name: "user",
    value: "share",
    size: "twh",
    sizeFormat: "{value} TWh",
    scaleLabel: "From Fjordland",
    title: "Aluminium smelters took 92% of their electricity from Fjordland",
    subtitle: "Fjordland's share of each user's electricity (position) and the user's total demand (area)",
  }}
  sources="Norrask Grid Agency annual balance"
  note="Norrask is an invented country. All figures are illustrative."
  credit="InsightCharts"
/>
```

### Sunrise, containers through one port, with download

```tsx
import { FlowPoster } from "insightcharts";

<FlowPoster
  theme="sunrise"
  download
  kicker="Trade"
  title="The Port of Hallin handled 9.6 million containers in 2025"
  subtitle="Containers by terminal, the routes out of North Quay, and North Quay's share of each destination's containers. Thousand containers."
  format="integer"
  producers={{
    data: [
      { terminal: "North Quay", teu: 3400 },
      { terminal: "Delta", teu: 2300 },
      { terminal: "Old Dock", teu: 1700 },
      { terminal: "Riverside", teu: 1300 },
      { terminal: "Eastgate", teu: 900 },
    ],
    name: "terminal",
    value: "teu",
    title: "North Quay handled 3.4 million of the 9.6 million containers",
  }}
  flow={{
    data: [
      { route: "Mereford by rail", teu: 980 },
      { route: "Castren by rail", teu: 720 },
      { route: "Ulm Lakes by barge", teu: 610 },
      { route: "Hallin city by road", teu: 520 },
      { route: "Dunmore by road", teu: 340 },
      { route: "Skaw by feeder ship", teu: 230 },
    ],
    name: "route",
    value: "teu",
    trunk: "North Quay",
    title: "980,000 containers left North Quay by rail for Mereford",
  }}
  scale={{
    data: [
      { route: "Mereford by rail", share: 70, teu: 1400 },
      { route: "Castren by rail", share: 45, teu: 1600 },
      { route: "Ulm Lakes by barge", share: 80, teu: 760 },
      { route: "Hallin city by road", share: 25, teu: 2080 },
      { route: "Dunmore by road", share: 30, teu: 1130 },
      { route: "Skaw by feeder ship", share: 10, teu: 2300 },
    ],
    name: "route",
    value: "share",
    size: "teu",
    sizeFormat: "integer",
    scaleLabel: "Via North Quay",
    title: "Ulm Lakes received 80% of its containers through North Quay",
    subtitle: "North Quay's share of each destination's containers (position) and all the containers it received, thousands (area)",
  }}
  sources="Hallin Port Authority throughput statistics"
  note="The Port of Hallin is an invented port. All figures are illustrative."
  credit="InsightCharts"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/flow-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/flow-poster.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
