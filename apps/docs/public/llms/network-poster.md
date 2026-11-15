# Network poster (`network-poster`)

> A poster of who is connected to whom: a full-width arc diagram with one arc per connection, as thick as its value (`arc-diagram`), a strip of two to four large figures, and a bottom row where the same entities return as circles joined by lines (`bubble-network`) and as a ranking of centred pills (`pill-rank`).

- Component: `NetworkPoster` (import from `insightcharts`)
- Spec type: `"network-poster"`
- Level: template. Category: infographic.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it when the connections between 5 to about 20 named things are the subject: ferry crossings between harbours, joint papers between institutes, freight between rail yards. Give `hero` one row per connection and the `order` the entities sit in, `map` the entities with a size and optional hand-placed `x` and `y`, and `rank` one measure of each entity. With `linked`, a click on an entity in any of the three highlights it in the other two.

## Avoid

A flow from sources to destinations in one direction (use `flow-poster` or `sankey-chart`). More than about 20 entities or 40 connections, because the arcs cover each other. Entities with no meaningful order and few links (use `bubble-network` in a `poster`). Parts of one subject (use `radial-poster`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/network-poster
```

The file lands at `components/insightcharts/templates/network-poster.tsx`. `@insightcharts/network-poster-demo` adds a ready-made example next to it.

## Usage

```tsx
import { NetworkPoster } from "insightcharts";

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
    { value: "31k", label: "passengers on the quietest route", context: "Storholm to Outer Holm" },
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
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "network-poster",
  "theme": "dusk",
  "linked": true,
  "kicker": "Ferries",
  "title": "Skerry Isles ferries carried 1.66 million passengers on 12 routes in 2025",
  "subtitle": "Passengers carried between pairs of harbours, thousands, both directions, 2025.",
  "hero": {
    "data": [
      { "a": "Port Aven", "b": "Brae", "k": 412 },
      { "a": "Port Aven", "b": "Storholm", "k": 268 },
      { "a": "Port Aven", "b": "Little Skerry", "k": 96 },
      { "a": "Brae", "b": "Storholm", "k": 187 },
      { "a": "Brae", "b": "Tarn Head", "k": 74 },
      { "a": "Storholm", "b": "Tarn Head", "k": 153 },
      { "a": "Storholm", "b": "Ness", "k": 121 },
      { "a": "Tarn Head", "b": "Ness", "k": 88 },
      { "a": "Ness", "b": "Outer Holm", "k": 43 },
      { "a": "Little Skerry", "b": "Brae", "k": 52 },
      { "a": "Port Aven", "b": "Ness", "k": 139 },
      { "a": "Storholm", "b": "Outer Holm", "k": 31 }
    ],
    "from": "a",
    "to": "b",
    "value": "k",
    "order": ["Port Aven", "Little Skerry", "Brae", "Storholm", "Tarn Head", "Ness", "Outer Holm"],
    "colorBy": "series",
    "format": "{value}k",
    "title": "412,000 passengers crossed between Port Aven and Brae"
  },
  "figures": [
    { "value": "412k", "label": "passengers on the busiest route", "context": "Port Aven to Brae" },
    {
      "value": "31k",
      "label": "passengers on the quietest route",
      "context": "Storholm to Outer Holm"
    },
    { "value": "4", "label": "of the 12 routes call at Port Aven" }
  ],
  "map": {
    "data": [
      { "harbour": "Port Aven", "k": 915, "x": 12, "y": 62 },
      { "harbour": "Little Skerry", "k": 148, "x": 22, "y": 18 },
      { "harbour": "Brae", "k": 725, "x": 38, "y": 40 },
      { "harbour": "Storholm", "k": 760, "x": 56, "y": 80 },
      { "harbour": "Tarn Head", "k": 315, "x": 66, "y": 22 },
      { "harbour": "Ness", "k": 391, "x": 84, "y": 46 },
      { "harbour": "Outer Holm", "k": 74, "x": 93, "y": 82 }
    ],
    "name": "harbour",
    "value": "k",
    "x": "x",
    "y": "y",
    "links": [
      { "from": "Port Aven", "to": "Brae" },
      { "from": "Port Aven", "to": "Storholm" },
      { "from": "Port Aven", "to": "Little Skerry" },
      { "from": "Brae", "to": "Storholm" },
      { "from": "Brae", "to": "Tarn Head" },
      { "from": "Storholm", "to": "Tarn Head" },
      { "from": "Storholm", "to": "Ness" },
      { "from": "Tarn Head", "to": "Ness" },
      { "from": "Ness", "to": "Outer Holm" },
      { "from": "Little Skerry", "to": "Brae" },
      { "from": "Port Aven", "to": "Ness" },
      { "from": "Storholm", "to": "Outer Holm" }
    ],
    "format": "{value}k",
    "highlight": "Port Aven",
    "tag": "Busiest harbour",
    "title": "915,000 passengers used Port Aven",
    "subtitle": "Passengers through each harbour, thousands. Positions are approximate."
  },
  "rank": {
    "data": [
      { "harbour": "Port Aven", "sailings": 46 },
      { "harbour": "Storholm", "sailings": 38 },
      { "harbour": "Brae", "sailings": 33 },
      { "harbour": "Ness", "sailings": 21 },
      { "harbour": "Tarn Head", "sailings": 16 },
      { "harbour": "Little Skerry", "sailings": 8 },
      { "harbour": "Outer Holm", "sailings": 4 }
    ],
    "name": "harbour",
    "value": "sailings",
    "title": "Port Aven had 46 sailings a day",
    "subtitle": "Scheduled departures per day, summer 2025."
  },
  "sources": "Skerry Isles Ferries, annual traffic return 2025",
  "note": "The Skerry Isles are invented. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `hero` (required) | `{ data, from, to, value?, order?, colorBy?, arcLabels?, orientation?, format?, highlight?, title?, ... } \| Slot` |  | The hero: one arc per pair of connected entities, drawn by `arc-diagram`. Rows joining the same pair are summed. A full spec or element replaces it. |
| `figures` | `{ value: string; label: string; context?: string; icon?: string; tag?: string }[]` |  | Two to four large figures in a strip under the hero. |
| `map` | `{ data, name, value, links?, x?, y?, layout?, tag?, highlight?, format?, title?, ... } \| Slot` |  | Bottom left: the entities as circles sized by `value` and joined by `links: { from, to, value? }[]` (`bubble-network`). `x` and `y` (0 to 100) place the circles by hand. |
| `rank` | `{ data, name, value, highlight?, compare?, format?, title?, ... } \| Slot` |  | Bottom right: the entities ranked by one measure as centred pills (`pill-rank`). With only one of `map` and `rank`, that one takes the full width. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"dusk"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
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

- Composes: [poster](https://insightcharts.dev/llms/poster.md), [arc-diagram](https://insightcharts.dev/llms/arc-diagram.md), [bubble-network](https://insightcharts.dev/llms/bubble-network.md), [pill-rank](https://insightcharts.dev/llms/pill-rank.md)
- Used by: no molecule or template yet

## More examples

### Noir, joint papers, a hub layout, with download

```tsx
import { NetworkPoster } from "insightcharts";

<NetworkPoster
  theme="noir"
  download
  kicker="Research"
  title="Six Norland institutes published 369 joint papers in 2025"
  subtitle="Papers with authors at two of the six institutes, by pair, 2025."
  hero={{
    data: [
      { a: "Marlow", b: "Halden", papers: 84 },
      { a: "Marlow", b: "Orrin", papers: 61 },
      { a: "Marlow", b: "Carrow", papers: 37 },
      { a: "Halden", b: "Orrin", papers: 52 },
      { a: "Halden", b: "Kestrel", papers: 29 },
      { a: "Orrin", b: "Carrow", papers: 44 },
      { a: "Orrin", b: "Aldern", papers: 18 },
      { a: "Carrow", b: "Kestrel", papers: 23 },
      { a: "Kestrel", b: "Aldern", papers: 12 },
      { a: "Marlow", b: "Aldern", papers: 9 },
    ],
    from: "a",
    to: "b",
    value: "papers",
    order: ["Marlow", "Halden", "Orrin", "Carrow", "Kestrel", "Aldern"],
    colorBy: "none",
    highlight: "Marlow",
    title: "Marlow and Halden shared 84 papers",
  }}
  figures={[
    { value: "191", label: "of the 369 papers had a Marlow author" },
    { value: "84", label: "papers were shared by Marlow and Halden" },
    { value: "39", label: "papers had an Aldern author" },
  ]}
  map={{
    data: [
      { institute: "Marlow", staff: 640 },
      { institute: "Halden", staff: 510 },
      { institute: "Orrin", staff: 470 },
      { institute: "Carrow", staff: 290 },
      { institute: "Kestrel", staff: 180 },
      { institute: "Aldern", staff: 95 },
    ],
    name: "institute",
    value: "staff",
    layout: "hub",
    links: [
      { from: "Marlow", to: "Halden", value: 84 },
      { from: "Marlow", to: "Orrin", value: 61 },
      { from: "Marlow", to: "Carrow", value: 37 },
      { from: "Halden", to: "Orrin", value: 52 },
      { from: "Halden", to: "Kestrel", value: 29 },
      { from: "Orrin", to: "Carrow", value: 44 },
      { from: "Orrin", to: "Aldern", value: 18 },
      { from: "Carrow", to: "Kestrel", value: 23 },
      { from: "Kestrel", to: "Aldern", value: 12 },
      { from: "Marlow", to: "Aldern", value: 9 },
    ],
    highlight: "Marlow",
    tag: "640 researchers",
    linkLabels: false,
    title: "Marlow employed 640 researchers",
    subtitle: "Research staff at each institute. Line width is the number of joint papers.",
  }}
  rank={{
    data: [
      { institute: "Marlow", staff: 640 },
      { institute: "Halden", staff: 510 },
      { institute: "Orrin", staff: 470 },
      { institute: "Carrow", staff: 290 },
      { institute: "Kestrel", staff: 180 },
      { institute: "Aldern", staff: 95 },
    ],
    name: "institute",
    value: "staff",
    highlight: "Marlow",
    title: "Aldern employed 95 researchers",
  }}
  sources="Norland Research Council, publication register 2025"
  note="The institutes are invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

### Forest, five rail yards, arcs and figures only

```tsx
import { NetworkPoster } from "insightcharts";

<NetworkPoster
  theme="forest"
  kicker="Rail freight"
  title="Halden's five rail yards exchanged 1,670 wagons a week in 2025"
  subtitle="Wagons moved between pairs of yards per week, both directions, average for 2025."
  hero={{
    data: [
      { a: "Northgate", b: "Mill Lane", wagons: 310 },
      { a: "Northgate", b: "Quarry Junction", wagons: 190 },
      { a: "Mill Lane", b: "Quarry Junction", wagons: 240 },
      { a: "Mill Lane", b: "Harbour East", wagons: 420 },
      { a: "Quarry Junction", b: "Harbour East", wagons: 160 },
      { a: "Harbour East", b: "Southfield", wagons: 280 },
      { a: "Northgate", b: "Southfield", wagons: 70 },
    ],
    from: "a",
    to: "b",
    value: "wagons",
    order: ["Northgate", "Mill Lane", "Quarry Junction", "Harbour East", "Southfield"],
    colorBy: "series",
    title: "Mill Lane and Harbour East exchanged 420 wagons a week",
  }}
  figures={[
    { value: "420", label: "wagons a week on the busiest pair" },
    { value: "70", label: "wagons a week between Northgate and Southfield" },
  ]}
  sources="Halden Rail Freight, yard movements 2025"
  note="The Halden yards are invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/network-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/network-poster.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
