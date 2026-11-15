# Count poster (`count-poster`)

> A poster that counts at scale. Blocks of thousands of unit icons fill most of the sheet, a second band counts reference groups with the same icon at the same size in a muted colour, and a bottom row holds three small graphics: squares sized by area with a ratio bracket, thick bars with the numbers inside, and shares as nested outlines or filled silhouettes.

- Component: `CountPoster` (import from `insightcharts`)
- Spec type: `"count-poster"`
- Level: template. Category: infographic.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it when the subject is a large count of people or things in 2 to 6 groups and the reader should see the crowd: pupils by stage, trees planted by species, vehicles built by model. Give `hero` the groups and `reference` one to three quantities to compare them with. Both bands use the same `unit`, `icon` and icon size, so their areas compare. State the total in the title.

## Avoid

Counts under a few hundred (use `pictogram-chart` in a `poster`). Shares of one whole as the main point (use `waffle-chart` or `treemap`). A ranking of many named things (use `ranking-poster`). A flow from sources to destinations (use `flow-poster`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/count-poster
```

The file lands at `components/insightcharts/templates/count-poster.tsx`. `@insightcharts/count-poster-demo` adds a ready-made example next to it.

## Usage

```tsx
import { CountPoster } from "insightcharts";

<CountPoster
  theme="noir"
  kicker="Education"
  title="Norland's schools taught 1.84 million pupils in 2025"
  subtitle="Pupils enrolled in state schools by stage, autumn term 2025."
  unit={1000}
  unitLabel="1,000 people"
  icon="person"
  hero={{
    data: [
      { stage: "Primary", pupils: 820000 },
      { stage: "Lower secondary", pupils: 460000 },
      { stage: "Upper secondary", pupils: 390000 },
      { stage: "Vocational", pupils: 170000 },
    ],
    name: "stage",
    value: "pupils",
    title: "820,000 pupils were in primary school",
  }}
  reference={{
    data: [
      { group: "Teachers", people: 142000 },
      { group: "Support staff", people: 61000 },
      { group: "Pupils who left without a certificate", people: 38000 },
    ],
    name: "group",
    value: "people",
    title: "142,000 teachers taught them",
  }}
  area={{
    data: [
      { school: "Largest secondary school", pupils: 3640 },
      { school: "Median primary school", pupils: 280 },
    ],
    name: "school",
    value: "pupils",
    title: "The largest school had 3,640 pupils",
  }}
  bars={{
    data: [
      { year: "2000", m: 1.42 },
      { year: "2005", m: 1.51 },
      { year: "2010", m: 1.6 },
      { year: "2015", m: 1.69 },
      { year: "2020", m: 1.77 },
      { year: "2025", m: 1.84 },
    ],
    name: "year",
    value: "m",
    format: "{value}m",
    title: "Enrolment was 1.42 million in 2000",
  }}
  shares={{
    data: [
      { year: "2013", share: 6 },
      { year: "2017", share: 19 },
      { year: "2021", share: 44 },
      { year: "2025", share: 68 },
    ],
    name: "year",
    value: "share",
    highlight: "2025",
    wholeLabel: "All pupils",
    title: "68% of pupils had a school laptop in 2025",
  }}
  sources="Norland Ministry of Education, school census 2025"
  note="Norland is an invented country. All figures are illustrative."
  credit="InsightCharts"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "count-poster",
  "theme": "noir",
  "kicker": "Education",
  "title": "Norland's schools taught 1.84 million pupils in 2025",
  "subtitle": "Pupils enrolled in state schools by stage, autumn term 2025.",
  "unit": 1000,
  "unitLabel": "1,000 people",
  "icon": "person",
  "hero": {
    "data": [
      { "stage": "Primary", "pupils": 820000 },
      { "stage": "Lower secondary", "pupils": 460000 },
      { "stage": "Upper secondary", "pupils": 390000 },
      { "stage": "Vocational", "pupils": 170000 }
    ],
    "name": "stage",
    "value": "pupils",
    "title": "820,000 pupils were in primary school"
  },
  "reference": {
    "data": [
      { "group": "Teachers", "people": 142000 },
      { "group": "Support staff", "people": 61000 },
      { "group": "Pupils who left without a certificate", "people": 38000 }
    ],
    "name": "group",
    "value": "people",
    "title": "142,000 teachers taught them"
  },
  "area": {
    "data": [
      { "school": "Largest secondary school", "pupils": 3640 },
      { "school": "Median primary school", "pupils": 280 }
    ],
    "name": "school",
    "value": "pupils",
    "title": "The largest school had 3,640 pupils"
  },
  "bars": {
    "data": [
      { "year": "2000", "m": 1.42 },
      { "year": "2005", "m": 1.51 },
      { "year": "2010", "m": 1.6 },
      { "year": "2015", "m": 1.69 },
      { "year": "2020", "m": 1.77 },
      { "year": "2025", "m": 1.84 }
    ],
    "name": "year",
    "value": "m",
    "format": "{value}m",
    "title": "Enrolment was 1.42 million in 2000"
  },
  "shares": {
    "data": [
      { "year": "2013", "share": 6 },
      { "year": "2017", "share": 19 },
      { "year": "2021", "share": 44 },
      { "year": "2025", "share": 68 }
    ],
    "name": "year",
    "value": "share",
    "highlight": "2025",
    "wholeLabel": "All pupils",
    "title": "68% of pupils had a school laptop in 2025"
  },
  "sources": "Norland Ministry of Education, school census 2025",
  "note": "Norland is an invented country. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `hero` (required) | `{ data, name, value, title?, subtitle?, source?, ...unit-blocks props } \| Slot` |  | The hero band: one block of unit icons per row, drawn by `unit-blocks`. A full spec or element replaces it. |
| `unit` | `number` |  | Units one icon stands for, in both bands. Default: a round number that gives the hero about 2,000 icons. |
| `unitLabel` | `string` |  | What one icon stands for, e.g. "1,000 pupils". Printed as the key of both bands. |
| `icon` | `IconName \| "path://..."` | `"person"` | Icon of both bands. |
| `format` | `FormatSpec` | `"integer"` | How to print the counts. |
| `reference` | `{ data, name, value, title?, ... } \| Slot` |  | The second band: reference groups counted with the same icon at the same size, painted in the theme's context grey (`unit-blocks`). |
| `area` | `{ data, name, value, ratio?, title?, ... } \| Slot` |  | Bottom left: two to four values as squares sized by area, with a bracket stating how many times the largest is the smallest (`proportional-area`). `ratio` defaults to `"{ratio}x larger"`. |
| `bars` | `{ data, name, value, title?, ... } \| Slot` |  | Bottom middle: 3 to 8 values as thick rounded bars with the numbers inside (`block-bar`). |
| `shares` | `{ data, name, value, icon?, title?, ... } \| Slot` |  | Bottom right: shares of one whole. With `icon` each share is a silhouette filled to its level (`shape-fill`); without, the shares are outlines nested in one square (`nested-shares`). |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"noir"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
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

- Composes: [poster](https://insightcharts.dev/llms/poster.md), [unit-blocks](https://insightcharts.dev/llms/unit-blocks.md), [proportional-area](https://insightcharts.dev/llms/proportional-area.md), [block-bar](https://insightcharts.dev/llms/block-bar.md), [nested-shares](https://insightcharts.dev/llms/nested-shares.md), [shape-fill](https://insightcharts.dev/llms/shape-fill.md)
- Used by: no molecule or template yet

## More examples

### Forest, trees planted, with download

```tsx
import { CountPoster } from "insightcharts";

<CountPoster
  theme="forest"
  download
  kicker="Forestry"
  title="Foresters planted 2.4 million trees in the Aldern Valley from 2016 to 2025"
  subtitle="Trees planted by species, and trees lost over the same ten years."
  unit={1000}
  unitLabel="1,000 trees"
  icon="tree"
  hero={{
    data: [
      { species: "Oak", trees: 780000 },
      { species: "Birch", trees: 640000 },
      { species: "Scots pine", trees: 560000 },
      { species: "Alder", trees: 420000 },
    ],
    name: "species",
    value: "trees",
    title: "Oak was 780,000 of the 2.4 million trees",
  }}
  reference={{
    data: [
      { cause: "Felled for timber", trees: 310000 },
      { cause: "Lost to storms", trees: 95000 },
      { cause: "Lost to disease", trees: 64000 },
    ],
    name: "cause",
    value: "trees",
    title: "The valley lost 469,000 trees in the same years",
  }}
  area={{
    data: [{ year: "Woodland in 2025", ha: 18600 }, { year: "Planted in 2025", ha: 930 }],
    name: "year",
    value: "ha",
    format: "{value} ha",
    ratio: "{ratio}x the area",
    title: "Woodland covered 18,600 hectares in 2025",
  }}
  bars={{
    data: [
      { year: "2020", k: 180 },
      { year: "2021", k: 215 },
      { year: "2022", k: 240 },
      { year: "2023", k: 265 },
      { year: "2024", k: 290 },
      { year: "2025", k: 310 },
    ],
    name: "year",
    value: "k",
    format: "{value}k",
    title: "310,000 trees were planted in 2025",
  }}
  shares={{
    data: [{ species: "Birch", share: 92 }, { species: "Scots pine", share: 74 }],
    name: "species",
    value: "share",
    icon: "tree",
    title: "92% of birches were alive after five years",
  }}
  sources="Aldern Valley Forest Trust planting register"
  note="The Aldern Valley is an invented place. All figures are illustrative."
  credit="InsightCharts"
/>
```

### Blueprint, bicycles built, linked panels

```tsx
import { CountPoster } from "insightcharts";

<CountPoster
  theme="blueprint"
  linked
  kicker="Manufacturing"
  title="The Orrin works built 248,000 bicycles in 2025"
  subtitle="Bicycles built by model at one factory, January to December 2025."
  unit={200}
  unitLabel="200 bicycles"
  icon="bike"
  hero={{
    data: [
      { model: "City", bikes: 96000 },
      { model: "Electric", bikes: 71000 },
      { model: "Children's", bikes: 48000 },
      { model: "Cargo", bikes: 33000 },
    ],
    name: "model",
    value: "bikes",
    title: "96,000 of the bicycles were city models",
  }}
  reference={{
    data: [
      { group: "Built in 2015", bikes: 131000 },
      { group: "Returned under warranty in 2025", bikes: 6200 },
    ],
    name: "group",
    value: "bikes",
    title: "The works built 131,000 bicycles in 2015",
  }}
  area={{
    data: [
      { year: "Electric bikes in 2025", bikes: 71000 },
      { year: "Electric bikes in 2017", bikes: 5900 },
    ],
    name: "year",
    value: "bikes",
    title: "The works built 71,000 electric bicycles in 2025",
  }}
  bars={{
    data: [
      { year: "2020", k: 162 },
      { year: "2021", k: 181 },
      { year: "2022", k: 197 },
      { year: "2023", k: 214 },
      { year: "2024", k: 231 },
      { year: "2025", k: 248 },
    ],
    name: "year",
    value: "k",
    format: "{value}k",
    title: "Output was 162,000 bicycles in 2020",
  }}
  shares={{
    data: [
      { year: "2017", share: 4 },
      { year: "2019", share: 9 },
      { year: "2021", share: 15 },
      { year: "2023", share: 22 },
      { year: "2025", share: 29 },
    ],
    name: "year",
    value: "share",
    highlight: "2025",
    wholeLabel: "All bicycles built",
    title: "Electric models were 29% of output in 2025",
  }}
  sources="Orrin Cycle Works production log"
  note="The Orrin works is an invented factory. All figures are illustrative."
  credit="InsightCharts"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/count-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/count-poster.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
