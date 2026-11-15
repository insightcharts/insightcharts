# Ranking poster (`ranking-poster`)

> A poster of one subject by the numbers, in four rows: two figures in large type or as filled silhouettes, two treemaps side by side, a full-width ranking of centred pills with one row highlighted, and packed circles with icons beside a column of sized circles and a closing figure.

- Component: `RankingPoster` (import from `insightcharts`)
- Spec type: `"ranking-poster"`
- Level: template. Category: infographic.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it for a profile of one event, place or organisation that has a headline total, two ways to split it, a ranking of 6 to 12 named things and a few supporting magnitudes: a festival, a race, a nature reserve, a library service. Put the total in the title and repeat it as the first figure. Highlight the ranking row the heading is about.

## Avoid

A subject whose point is a count of people or things (use `count-poster`). Several entities compared on the same measures (use `matrix-poster`). Eight or more small graphics on one subject (use `atlas-poster`). A ranking alone (use `pill-rank` in a `poster`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/ranking-poster
```

The file lands at `components/insightcharts/templates/ranking-poster.tsx`. `@insightcharts/ranking-poster-demo` adds a ready-made example next to it.

## Usage

```tsx
import { RankingPoster } from "insightcharts";

<RankingPoster
  theme="dusk"
  kicker="Music"
  title="The Solvik Festival sold 184,000 tickets in 2025"
  subtitle="Tickets, crowds and spending at a three-day music festival, 11 to 13 July 2025."
  figures={[
    { value: "184,000", label: "Tickets sold in 2025", context: "171,000 in 2024" },
    {
      data: [{ day: "Friday", share: 84 }, { day: "Saturday", share: 100 }, { day: "Sunday", share: 91 }],
      name: "day",
      value: "share",
      icon: "group",
      title: "Saturday sold 100% of its 64,000 places",
    },
  ]}
  breakdowns={[
    {
      data: [
        { ticket: "Weekend pass", k: 92 },
        { ticket: "Day ticket", k: 61 },
        { ticket: "Camping pass", k: 23 },
        { ticket: "VIP pass", k: 8 },
      ],
      name: "ticket",
      value: "k",
      format: "{value}k",
      title: "92,000 tickets were weekend passes",
    },
    {
      data: [
        { home: "Solvik region", k: 71 },
        { home: "Rest of the country", k: 64 },
        { home: "Neighbouring countries", k: 37 },
        { home: "Further away", k: 12 },
      ],
      name: "home",
      value: "k",
      format: "{value}k",
      title: "71,000 ticket holders lived in the Solvik region",
    },
  ]}
  ranking={{
    data: [
      { act: "Halden Lights", crowd: 61000 },
      { act: "Mirra Sol", crowd: 58500 },
      { act: "The Quiet Engines", crowd: 52000 },
      { act: "Ada Vance", crowd: 47500 },
      { act: "Northfold", crowd: 41000 },
      { act: "Juno Marsh", crowd: 36500 },
      { act: "Saltwater Choir", crowd: 31000 },
      { act: "Okapi Club", crowd: 26500 },
      { act: "Tess Arden", crowd: 22000 },
      { act: "Low Tide Radio", crowd: 17500 },
    ],
    name: "act",
    value: "crowd",
    format: "integer",
    highlight: "Halden Lights",
    title: "Halden Lights played to 61,000 people on Saturday",
    subtitle: "Largest crowd at each of the ten most-attended acts",
  }}
  pack={{
    data: [
      { item: "Food stalls", k: 3400 },
      { item: "Beer", k: 2900 },
      { item: "Merchandise", k: 2300 },
      { item: "Wine and cocktails", k: 1600 },
      { item: "Soft drinks", k: 1100 },
      { item: "Camping shop", k: 900 },
      { item: "Coffee", k: 700 },
      { item: "Lockers and charging", k: 500 },
      { item: "Water", k: 400 },
      { item: "Ice cream", k: 400 },
    ],
    name: "item",
    value: "k",
    format: "€{value}k",
    icon: {
      "Food stalls": "fork-knife",
      Beer: "cup",
      Merchandise: "bag",
      "Wine and cocktails": "bottle",
      "Soft drinks": "bottle",
      "Camping shop": "cart",
      Coffee: "cup",
    },
    title: "Visitors spent €3.4 million at food stalls",
    subtitle: "Spending on site by category, thousand euros",
  }}
  circles={{
    data: [
      { year: "per visitor in 2019", kg: 2.6 },
      { year: "per visitor in 2022", kg: 1.9 },
      { year: "per visitor in 2025", kg: 1.2 },
    ],
    name: "year",
    value: "kg",
    unit: "kg",
    title: "Each visitor left 1.2 kg of waste in 2025",
  }}
  figure={{
    value: "€14.2m",
    label: "Spent on site by visitors in 2025",
    context: "€77 for each ticket sold",
  }}
  sources="Solvik Festival annual report 2025"
  note="The Solvik Festival and its acts are invented. All figures are illustrative."
  credit="InsightCharts"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "ranking-poster",
  "theme": "dusk",
  "kicker": "Music",
  "title": "The Solvik Festival sold 184,000 tickets in 2025",
  "subtitle": "Tickets, crowds and spending at a three-day music festival, 11 to 13 July 2025.",
  "figures": [
    { "value": "184,000", "label": "Tickets sold in 2025", "context": "171,000 in 2024" },
    {
      "data": [
        { "day": "Friday", "share": 84 },
        { "day": "Saturday", "share": 100 },
        { "day": "Sunday", "share": 91 }
      ],
      "name": "day",
      "value": "share",
      "icon": "group",
      "title": "Saturday sold 100% of its 64,000 places"
    }
  ],
  "breakdowns": [
    {
      "data": [
        { "ticket": "Weekend pass", "k": 92 },
        { "ticket": "Day ticket", "k": 61 },
        { "ticket": "Camping pass", "k": 23 },
        { "ticket": "VIP pass", "k": 8 }
      ],
      "name": "ticket",
      "value": "k",
      "format": "{value}k",
      "title": "92,000 tickets were weekend passes"
    },
    {
      "data": [
        { "home": "Solvik region", "k": 71 },
        { "home": "Rest of the country", "k": 64 },
        { "home": "Neighbouring countries", "k": 37 },
        { "home": "Further away", "k": 12 }
      ],
      "name": "home",
      "value": "k",
      "format": "{value}k",
      "title": "71,000 ticket holders lived in the Solvik region"
    }
  ],
  "ranking": {
    "data": [
      { "act": "Halden Lights", "crowd": 61000 },
      { "act": "Mirra Sol", "crowd": 58500 },
      { "act": "The Quiet Engines", "crowd": 52000 },
      { "act": "Ada Vance", "crowd": 47500 },
      { "act": "Northfold", "crowd": 41000 },
      { "act": "Juno Marsh", "crowd": 36500 },
      { "act": "Saltwater Choir", "crowd": 31000 },
      { "act": "Okapi Club", "crowd": 26500 },
      { "act": "Tess Arden", "crowd": 22000 },
      { "act": "Low Tide Radio", "crowd": 17500 }
    ],
    "name": "act",
    "value": "crowd",
    "format": "integer",
    "highlight": "Halden Lights",
    "title": "Halden Lights played to 61,000 people on Saturday",
    "subtitle": "Largest crowd at each of the ten most-attended acts"
  },
  "pack": {
    "data": [
      { "item": "Food stalls", "k": 3400 },
      { "item": "Beer", "k": 2900 },
      { "item": "Merchandise", "k": 2300 },
      { "item": "Wine and cocktails", "k": 1600 },
      { "item": "Soft drinks", "k": 1100 },
      { "item": "Camping shop", "k": 900 },
      { "item": "Coffee", "k": 700 },
      { "item": "Lockers and charging", "k": 500 },
      { "item": "Water", "k": 400 },
      { "item": "Ice cream", "k": 400 }
    ],
    "name": "item",
    "value": "k",
    "format": "€{value}k",
    "icon": {
      "Food stalls": "fork-knife",
      "Beer": "cup",
      "Merchandise": "bag",
      "Wine and cocktails": "bottle",
      "Soft drinks": "bottle",
      "Camping shop": "cart",
      "Coffee": "cup"
    },
    "title": "Visitors spent €3.4 million at food stalls",
    "subtitle": "Spending on site by category, thousand euros"
  },
  "circles": {
    "data": [
      { "year": "per visitor in 2019", "kg": 2.6 },
      { "year": "per visitor in 2022", "kg": 1.9 },
      { "year": "per visitor in 2025", "kg": 1.2 }
    ],
    "name": "year",
    "value": "kg",
    "unit": "kg",
    "title": "Each visitor left 1.2 kg of waste in 2025"
  },
  "figure": {
    "value": "€14.2m",
    "label": "Spent on site by visitors in 2025",
    "context": "€77 for each ticket sold"
  },
  "sources": "Solvik Festival annual report 2025",
  "note": "The Solvik Festival and its acts are invented. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `figures` | `({ value, label, context?, icon? } \| { data, name, value, icon, title?, ...shape-fill props } \| Slot)[]` |  | Top row, up to two. A statement `{ value, label }` is set in large light type (the first in the accent colour); a config with `data` draws silhouettes filled to their level (`shape-fill`). |
| `breakdowns` | `({ data, name, value, title?, ...treemap props } \| Slot)[]` |  | Second row, up to two: the subject's total split two ways, as treemaps side by side. |
| `ranking` (required) | `{ data, name, value, highlight?, compare?, compareLabel?, title?, ...pill-rank props } \| Slot` |  | Third row, full width: a ranking as centred pills with the value at the left and the rank at the right (`pill-rank`). `highlight` names the row drawn in the accent. |
| `pack` | `{ data, name, value, icon?, group?, title?, ...circle-pack props } \| Slot` |  | Bottom left: parts as packed circles (`circle-pack`). `icon` is one icon name or a map from circle name to icon. |
| `circles` | `{ data, name, value, unit?, title?, ...stat-circles props } \| Slot` |  | Bottom right: two to four related magnitudes as circles standing on one baseline (`stat-circles`). |
| `figure` | `{ value, label, context?, icon? }` |  | Bottom right, under the circles: one closing figure in large type. |
| `format` | `FormatSpec` |  | How to print values in the regions that set no `format` of their own. |
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

- Composes: [poster](https://insightcharts.dev/llms/poster.md), [shape-fill](https://insightcharts.dev/llms/shape-fill.md), [treemap](https://insightcharts.dev/llms/treemap.md), [pill-rank](https://insightcharts.dev/llms/pill-rank.md), [circle-pack](https://insightcharts.dev/llms/circle-pack.md), [stat-circles](https://insightcharts.dev/llms/stat-circles.md)
- Used by: no molecule or template yet

## More examples

### Paper, a road race, two statements

```tsx
import { RankingPoster } from "insightcharts";

<RankingPoster
  theme="paper"
  kicker="Sport"
  title="The Harrow Valley Half Marathon had 18,400 finishers in 2025"
  subtitle="Finishers, running clubs and money raised at the race on 5 October 2025."
  figures={[
    { value: "18,400", label: "Finishers in 2025", context: "16,900 in 2024", icon: "flag" },
    {
      value: "1:58",
      label: "Median finishing time in hours and minutes",
      context: "2:01 in 2024",
      icon: "clock",
    },
  ]}
  breakdowns={[
    {
      data: [
        { age: "Under 30", runners: 4300 },
        { age: "30 to 39", runners: 5900 },
        { age: "40 to 49", runners: 4600 },
        { age: "50 to 59", runners: 2500 },
        { age: "60 and over", runners: 1100 },
      ],
      name: "age",
      value: "runners",
      format: "integer",
      title: "5,900 finishers were aged 30 to 39",
    },
    {
      data: [
        { home: "Harrow Valley", runners: 7900 },
        { home: "Rest of the county", runners: 5200 },
        { home: "Elsewhere in the country", runners: 4400 },
        { home: "Abroad", runners: 900 },
      ],
      name: "home",
      value: "runners",
      format: "integer",
      title: "7,900 finishers lived in the Harrow Valley",
    },
  ]}
  ranking={{
    data: [
      { club: "Harrow Harriers", runners: 412 },
      { club: "Millbrook AC", runners: 356 },
      { club: "Castle Runners", runners: 298 },
      { club: "Valley Striders", runners: 271 },
      { club: "Eastfield Joggers", runners: 233 },
      { club: "Ridgeway RC", runners: 187 },
      { club: "Canal Path Runners", runners: 164 },
      { club: "Old Mill Milers", runners: 129 },
    ],
    name: "club",
    value: "runners",
    format: "integer",
    highlight: "Harrow Harriers",
    title: "Harrow Harriers had 412 finishers",
    subtitle: "Finishers by running club, the eight largest",
  }}
  pack={{
    data: [
      { cause: "Hospice care", k: 310 },
      { cause: "Children's hospital", k: 260 },
      { cause: "Mountain rescue", k: 150 },
      { cause: "Food bank", k: 140 },
      { cause: "Animal shelter", k: 120 },
      { cause: "School sports", k: 110 },
      { cause: "Tree planting", k: 90 },
      { cause: "Library fund", k: 60 },
      { cause: "Lifeboats", k: 60 },
    ],
    name: "cause",
    value: "k",
    format: "£{value}k",
    icon: {
      "Hospice care": "heart",
      "Children's hospital": "hospital",
      "Mountain rescue": "mountain",
      "Food bank": "bread",
      "School sports": "school",
      "Tree planting": "tree",
    },
    title: "Runners raised £310,000 for hospice care",
    subtitle: "Money raised by cause, thousand pounds",
  }}
  circles={{
    data: [
      { year: "finishers in 2015", runners: 9200 },
      { year: "finishers in 2020", runners: 12600 },
      { year: "finishers in 2025", runners: 18400 },
    ],
    name: "year",
    value: "runners",
    format: "integer",
    title: "The race had 9,200 finishers in 2015",
  }}
  figure={{ value: "£1.3m", label: "Raised for nine causes in 2025", context: "£71 for each finisher" }}
  sources="Harrow Valley Athletics race results and fundraising returns"
  note="The Harrow Valley Half Marathon is an invented race. All figures are illustrative."
  credit="InsightCharts"
/>
```

### Ocean, a marine reserve, linked, with download

```tsx
import { RankingPoster } from "insightcharts";

<RankingPoster
  theme="ocean"
  linked
  download
  kicker="Oceans"
  title="Divers recorded 1,260 species in the Calder Reef reserve in 2025"
  subtitle="Species, sightings and visitors in a marine reserve, annual survey 2025."
  figures={[
    {
      value: "1,260",
      label: "Species recorded in 2025",
      context: "1,140 in the 2020 survey",
      icon: "fish",
    },
    {
      data: [{ zone: "Closed to fishing", share: 38 }],
      name: "zone",
      value: "share",
      icon: "lock",
      title: "38% of the reserve was closed to fishing",
    },
  ]}
  breakdowns={[
    {
      data: [
        { group: "Fish", species: 540 },
        { group: "Molluscs", species: 310 },
        { group: "Corals", species: 190 },
        { group: "Crustaceans", species: 150 },
        { group: "Other", species: 70 },
      ],
      name: "group",
      value: "species",
      format: "integer",
      title: "540 of the species were fish",
    },
    {
      data: [
        { habitat: "Reef crest", species: 430 },
        { habitat: "Lagoon", species: 350 },
        { habitat: "Seagrass beds", species: 260 },
        { habitat: "Deep slope", species: 220 },
      ],
      name: "habitat",
      value: "species",
      format: "integer",
      title: "430 species were first recorded on the reef crest",
    },
  ]}
  ranking={{
    data: [
      { fish: "Blue chromis", seen: 8400 },
      { fish: "Sergeant major", seen: 7100 },
      { fish: "Bluehead wrasse", seen: 6300 },
      { fish: "Yellowtail snapper", seen: 5200 },
      { fish: "Stoplight parrotfish", seen: 4100 },
      { fish: "French grunt", seen: 3600 },
      { fish: "Queen angelfish", seen: 1900 },
      { fish: "Nassau grouper", seen: 640 },
    ],
    name: "fish",
    value: "seen",
    format: "integer",
    highlight: "Nassau grouper",
    title: "Divers recorded 640 Nassau groupers",
    subtitle: "Sightings of eight fish species on survey dives",
  }}
  pack={{
    data: [
      { activity: "Beach visits", k: 120 },
      { activity: "Snorkelling", k: 86 },
      { activity: "Boat tours", k: 64 },
      { activity: "Scuba diving", k: 41 },
      { activity: "Kayaking", k: 28 },
      { activity: "School trips", k: 14 },
      { activity: "Research stays", k: 6 },
    ],
    name: "activity",
    value: "k",
    format: "{value}k",
    icon: {
      "Beach visits": "sun",
      Snorkelling: "wave",
      "Boat tours": "ship",
      "Scuba diving": "fish",
      Kayaking: "drop",
      "School trips": "school",
    },
    title: "120,000 people visited the reserve's beaches",
    subtitle: "Visitors by activity, thousands",
  }}
  circles={{
    data: [
      { year: "km² in 2005", km2: 140 },
      { year: "km² in 2015", km2: 310 },
      { year: "km² in 2025", km2: 520 },
    ],
    name: "year",
    value: "km2",
    format: "integer",
    title: "The reserve covered 520 km² in 2025",
  }}
  figure={{ value: "359,000", label: "Visitors in 2025", context: "312,000 in 2024" }}
  sources="Calder Reef Reserve annual survey 2025"
  note="The Calder Reef reserve is an invented place. Species are real; all figures are illustrative."
  credit="InsightCharts"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/ranking-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/ranking-poster.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
