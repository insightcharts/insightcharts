# Matrix poster (`matrix-poster`)

> One wide landscape graphic that compares 4 to 12 entities on five to seven measures: two measures as S-curves between parallel scales on the left, joined to a table on the right in which every other number is drawn as dots, squares, icons, a ring, a circle or a bar. Both halves share one row order and one colour per entity.

- Component: `MatrixPoster` (import from `insightcharts`)
- Spec type: `"matrix-poster"`
- Level: template. Category: infographic.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it for profiles of a handful of comparable things with measures in different units: cities, species, products, stations, teams. Pass one row per entity with every measure in it. Put the two measures whose relationship matters in `curve` and the rest in `columns`, choosing a counted glyph (`dots`, `blocks`, `icons`) for small whole numbers, `ring` for shares, `bar` or `circle` for magnitudes. Leave `highlight` out to give every entity its own colour, derived from the theme when its palette is smaller than the number of entities; set it to draw one or two entities in colour and the rest in grey.

## Avoid

One measure across entities (use `pill-rank` or `bar-chart`). More than 12 entities (use `data-table` or `heatmap`). A subject with a total and its parts (use `ranking-poster` or `flow-poster`). A phone-first piece: the table stacks into cards under 600px and the poster becomes long.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/matrix-poster
```

The file lands at `components/insightcharts/templates/matrix-poster.tsx`. `@insightcharts/matrix-poster-demo` adds a ready-made example next to it.

## Usage

```tsx
import { MatrixPoster } from "insightcharts";

<MatrixPoster
  theme="paper"
  kicker="Cities"
  title="A one-bedroom flat in Avenmouth rented for €1,640 a month in 2025"
  subtitle="Eight cities of Norland compared on rent, pay and five measures of daily life, 2025."
  rows={[
    {
      city: "Avenmouth",
      rent: 1640,
      pay: 3900,
      transit: 38,
      parks: 14,
      lanes: 212,
      cafes: 23,
      sun: 148,
    },
    {
      city: "Brackley Bay",
      rent: 1480,
      pay: 3300,
      transit: 22,
      parks: 9,
      lanes: 96,
      cafes: 17,
      sun: 201,
    },
    {
      city: "Castren",
      rent: 1310,
      pay: 3600,
      transit: 41,
      parks: 17,
      lanes: 184,
      cafes: 19,
      sun: 132,
    },
    {
      city: "Dunmore",
      rent: 1150,
      pay: 2900,
      transit: 27,
      parks: 11,
      lanes: 120,
      cafes: 12,
      sun: 165,
    },
    {
      city: "Eastwick",
      rent: 980,
      pay: 3100,
      transit: 33,
      parks: 21,
      lanes: 240,
      cafes: 15,
      sun: 121,
    },
    {
      city: "Fenhallow",
      rent: 860,
      pay: 2500,
      transit: 18,
      parks: 8,
      lanes: 54,
      cafes: 9,
      sun: 176,
    },
    {
      city: "Greyport",
      rent: 740,
      pay: 2700,
      transit: 24,
      parks: 12,
      lanes: 88,
      cafes: 11,
      sun: 190,
    },
    { city: "Hallin", rent: 610, pay: 2200, transit: 12, parks: 6, lanes: 31, cafes: 7, sun: 210 },
  ]}
  name="city"
  nameLabel="City"
  curve={{
    left: "rent",
    right: "pay",
    leftLabel: "Rent, € a month",
    rightLabel: "Median pay, € a month",
    format: "integer",
    title: "Median pay in Avenmouth was €3,900 a month",
  }}
  columns={[
    { field: "transit", label: "Trips by public transport", glyph: "ring", format: "{value}%" },
    { field: "parks", label: "Parks per 100,000 people", glyph: "dots" },
    { field: "lanes", label: "Cycle lanes, km", glyph: "bar" },
    { field: "cafes", label: "Cafés per 10,000 people", glyph: "blocks" },
    { field: "sun", label: "Sunny days a year", glyph: "circle" },
  ]}
  table={{ title: "Eastwick had 240 km of cycle lanes" }}
  sources="Norland Statistics Office, city indicators 2025"
  note="Norland and its cities are invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "matrix-poster",
  "theme": "paper",
  "kicker": "Cities",
  "title": "A one-bedroom flat in Avenmouth rented for €1,640 a month in 2025",
  "subtitle": "Eight cities of Norland compared on rent, pay and five measures of daily life, 2025.",
  "rows": [
    {
      "city": "Avenmouth",
      "rent": 1640,
      "pay": 3900,
      "transit": 38,
      "parks": 14,
      "lanes": 212,
      "cafes": 23,
      "sun": 148
    },
    {
      "city": "Brackley Bay",
      "rent": 1480,
      "pay": 3300,
      "transit": 22,
      "parks": 9,
      "lanes": 96,
      "cafes": 17,
      "sun": 201
    },
    {
      "city": "Castren",
      "rent": 1310,
      "pay": 3600,
      "transit": 41,
      "parks": 17,
      "lanes": 184,
      "cafes": 19,
      "sun": 132
    },
    {
      "city": "Dunmore",
      "rent": 1150,
      "pay": 2900,
      "transit": 27,
      "parks": 11,
      "lanes": 120,
      "cafes": 12,
      "sun": 165
    },
    {
      "city": "Eastwick",
      "rent": 980,
      "pay": 3100,
      "transit": 33,
      "parks": 21,
      "lanes": 240,
      "cafes": 15,
      "sun": 121
    },
    {
      "city": "Fenhallow",
      "rent": 860,
      "pay": 2500,
      "transit": 18,
      "parks": 8,
      "lanes": 54,
      "cafes": 9,
      "sun": 176
    },
    {
      "city": "Greyport",
      "rent": 740,
      "pay": 2700,
      "transit": 24,
      "parks": 12,
      "lanes": 88,
      "cafes": 11,
      "sun": 190
    },
    {
      "city": "Hallin",
      "rent": 610,
      "pay": 2200,
      "transit": 12,
      "parks": 6,
      "lanes": 31,
      "cafes": 7,
      "sun": 210
    }
  ],
  "name": "city",
  "nameLabel": "City",
  "curve": {
    "left": "rent",
    "right": "pay",
    "leftLabel": "Rent, € a month",
    "rightLabel": "Median pay, € a month",
    "format": "integer",
    "title": "Median pay in Avenmouth was €3,900 a month"
  },
  "columns": [
    {
      "field": "transit",
      "label": "Trips by public transport",
      "glyph": "ring",
      "format": "{value}%"
    },
    { "field": "parks", "label": "Parks per 100,000 people", "glyph": "dots" },
    { "field": "lanes", "label": "Cycle lanes, km", "glyph": "bar" },
    { "field": "cafes", "label": "Cafés per 10,000 people", "glyph": "blocks" },
    { "field": "sun", "label": "Sunny days a year", "glyph": "circle" }
  ],
  "table": { "title": "Eastwick had 240 km of cycle lanes" },
  "sources": "Norland Statistics Office, city indicators 2025",
  "note": "Norland and its cities are invented. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` (required) | `Row[]` |  | One object per entity, holding the name and every measure. |
| `name` | `string` |  | Field holding the entity name. Default: the first key of the first row. |
| `nameLabel` | `string` |  | Heading of the table's name column. |
| `curve` (required) | `{ left, right, leftLabel?, rightLabel?, leftFormat?, rightFormat?, leftTop?, rightTop?, title?, subtitle?, source?, ...curve-rank props }` |  | Left graphic: the two measures joined by one S-curve per entity (`curve-rank`). The poster's rows are ordered by `left`, largest first. |
| `columns` (required) | `{ field, label?, glyph?, unit?, format?, max?, icon? }[]` |  | Right graphic: the glyph columns of the table, in order (`glyph-table`). Three to five read well beside the curves. |
| `table` | `{ title?, subtitle?, source?, note? }` |  | Short heading and source line over and under the table. |
| `order` | `string[]` |  | Entity names in display order, for both graphics. Default: largest first on the curve's left measure. |
| `highlight` | `string \| string[]` |  | Entities drawn in colour while every other one turns grey. Without it each entity has its own colour in both graphics. |
| `title` (required) | `string` |  | The poster's one fact, as a plain sentence with its number. |
| `kicker` | `string` |  | Small label above the title: the topic. |
| `subtitle` | `string` |  | One line under the title: the measure, population and period. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"paper"` | Poster theme: `noir`, `magenta`, `dusk`, `ocean`, `forest`, `blueprint`, `sunrise`, `paper`, any other theme name, or a theme object. |
| `mode` | `"light" \| "dark" \| "auto" \| "system"` | `"light"` | Colour mode of the poster and everything in it. A poster paints its own ground and does not follow the page unless you set `auto`. Only `paper` has a different dark variant. |
| `download` | `boolean` | `false` | Show a "Download PNG" control under the poster that saves the whole poster as one image. |
| `maxWidth` | `number \| string` | `1400` | Widest the poster is drawn. It is centred in wider containers. |
| `linked` | `boolean` | `false` | Make the marks clickable. Clicking a mark in one graphic highlights the same name in every other graphic that has it, and filters the graphics that read the shared `data`. Click it again, or the empty ground of that graphic, to clear. |
| `sources` | `string \| string[]` |  | Where the data comes from, shown in the footer. |
| `note` | `string` |  | Caveat shown in the footer, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the poster, shown at the right of the footer. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Heading level of the title. Panel headings are one level down. |

## Composition

- Composes: [poster](https://insightcharts.dev/llms/poster.md), [curve-rank](https://insightcharts.dev/llms/curve-rank.md), [glyph-table](https://insightcharts.dev/llms/glyph-table.md)
- Used by: no molecule or template yet

## More examples

### Noir, eight seabirds, linked

```tsx
import { MatrixPoster } from "insightcharts";

<MatrixPoster
  theme="noir"
  linked
  kicker="Wildlife"
  title="21,400 pairs of guillemots bred on the Skerry Isles in 2025"
  subtitle="Eight seabird species compared on wingspan, breeding pairs and four other measures."
  rows={[
    { bird: "Gannet", wingspan: 180, pairs: 5200, eggs: 1, dive: 22, years: 17, mass: 3000 },
    { bird: "Fulmar", wingspan: 107, pairs: 8900, eggs: 1, dive: 3, years: 30, mass: 800 },
    { bird: "Kittiwake", wingspan: 105, pairs: 14600, eggs: 2, dive: 1, years: 12, mass: 400 },
    { bird: "Shag", wingspan: 100, pairs: 1900, eggs: 3, dive: 45, years: 12, mass: 1900 },
    { bird: "Arctic tern", wingspan: 80, pairs: 3100, eggs: 2, dive: 1, years: 13, mass: 110 },
    { bird: "Guillemot", wingspan: 67, pairs: 21400, eggs: 1, dive: 60, years: 23, mass: 950 },
    { bird: "Razorbill", wingspan: 65, pairs: 6700, eggs: 1, dive: 35, years: 13, mass: 620 },
    { bird: "Puffin", wingspan: 55, pairs: 11800, eggs: 1, dive: 40, years: 18, mass: 400 },
  ]}
  name="bird"
  nameLabel="Species"
  curve={{
    left: "wingspan",
    right: "pairs",
    leftLabel: "Wingspan, cm",
    rightLabel: "Breeding pairs",
    format: "integer",
    title: "The gannet's wingspan is 180 cm",
  }}
  columns={[
    { field: "eggs", label: "Eggs in a clutch", glyph: "dots" },
    { field: "dive", label: "Deepest dive, m", glyph: "bar", format: "{value} m" },
    { field: "years", label: "Typical lifespan, years", glyph: "blocks" },
    { field: "mass", label: "Body mass, g", glyph: "circle", format: "integer" },
  ]}
  table={{ title: "Guillemots dive to 60 metres" }}
  sources="Skerry Isles seabird census 2025"
  note="The Skerry Isles and the colony counts are invented. Species measurements are rounded typical values."
  credit="InsightCharts"
/>
```

### Blueprint, ten weather stations, one highlighted, with download

```tsx
import { MatrixPoster } from "insightcharts";

<MatrixPoster
  theme="blueprint"
  download
  kicker="Weather"
  title="Skarvik recorded 2,240 mm of rain in 2025"
  subtitle="Ten weather stations in Norland compared on rainfall, altitude and five other measures, 2025."
  rows={[
    {
      station: "Skarvik",
      altitude: 12,
      rain: 2240,
      wet: 231,
      july: 13,
      snow: 18,
      wind: 31,
      sun: 1090,
    },
    {
      station: "Holm Pass",
      altitude: 940,
      rain: 1860,
      wet: 204,
      july: 9,
      snow: 142,
      wind: 27,
      sun: 1180,
    },
    {
      station: "Tarn Head",
      altitude: 610,
      rain: 1610,
      wet: 196,
      july: 11,
      snow: 96,
      wind: 22,
      sun: 1240,
    },
    {
      station: "Aldern",
      altitude: 180,
      rain: 1240,
      wet: 172,
      july: 15,
      snow: 31,
      wind: 16,
      sun: 1410,
    },
    {
      station: "Norvik",
      altitude: 35,
      rain: 1090,
      wet: 168,
      july: 14,
      snow: 24,
      wind: 24,
      sun: 1380,
    },
    {
      station: "Castren",
      altitude: 95,
      rain: 880,
      wet: 151,
      july: 17,
      snow: 19,
      wind: 14,
      sun: 1620,
    },
    {
      station: "Mereford",
      altitude: 240,
      rain: 760,
      wet: 139,
      july: 18,
      snow: 27,
      wind: 13,
      sun: 1710,
    },
    { station: "Sundby", altitude: 8, rain: 690, wet: 128, july: 17, snow: 11, wind: 21, sun: 1840 },
    {
      station: "Dunmore",
      altitude: 310,
      rain: 610,
      wet: 117,
      july: 19,
      snow: 38,
      wind: 12,
      sun: 1790,
    },
    {
      station: "Eastmark",
      altitude: 420,
      rain: 480,
      wet: 96,
      july: 20,
      snow: 44,
      wind: 15,
      sun: 1930,
    },
  ]}
  name="station"
  nameLabel="Station"
  highlight="Skarvik"
  curve={{
    left: "rain",
    right: "altitude",
    leftLabel: "Rain in 2025, mm",
    rightLabel: "Altitude, m",
    format: "integer",
    title: "Skarvik stands 12 metres above the sea",
  }}
  columns={[
    { field: "wet", label: "Days with rain", glyph: "dots", unit: 10 },
    { field: "july", label: "Mean July temperature", glyph: "bar", format: "{value}°C" },
    { field: "snow", label: "Days with snow", glyph: "bar" },
    { field: "wind", label: "Mean wind, km/h", glyph: "circle" },
    { field: "sun", label: "Hours of sunshine", glyph: "bar", format: "integer" },
  ]}
  table={{ title: "Rain fell at Skarvik on 231 days" }}
  sources="Norland Meteorological Institute station records 2025"
  note="Norland and its weather stations are invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/matrix-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/matrix-poster.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
