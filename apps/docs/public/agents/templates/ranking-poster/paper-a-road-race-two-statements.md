# Reproduce the "Paper, a road race, two statements" example of the InsightCharts Ranking poster

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Paper, a road race, two statements" example of `ranking-poster` (an infographic template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A poster of one subject by the numbers, in four rows: two figures in large type or as filled silhouettes, two treemaps side by side, a full-width ranking of centred pills with one row highlighted, and packed circles with icons beside a column of sized circles and a closing figure.

Use it when: Use it for a profile of one event, place or organisation that has a headline total, two ways to split it, a ranking of 6 to 12 named things and a few supporting magnitudes: a festival, a race, a nature reserve, a library service. Put the total in the title and repeat it as the first figure. Highlight the ranking row the heading is about.

Pick something else when: A subject whose point is a count of people or things (use `count-poster`). Several entities compared on the same measures (use `matrix-poster`). Eight or more small graphics on one subject (use `atlas-poster`). A ranking alone (use `pill-rank` in a `poster`).

Instructions for the alternatives: `matrix-poster` https://insightcharts.dev/agents/templates/matrix-poster.md, `atlas-poster` https://insightcharts.dev/agents/templates/atlas-poster.md, `count-poster` https://insightcharts.dev/agents/templates/count-poster.md, `pill-rank` https://insightcharts.dev/agents/atoms/pill-rank.md, `poster` https://insightcharts.dev/agents/molecules/poster.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/ranking-poster
```

The file lands at `components/insightcharts/templates/ranking-poster.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { RankingPoster } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Regions" below. Each region holds its own `data` rows and the field names that read them. It also has a shared `data` prop: Rows shared by every region whose config leaves out its own `data`. With `linked`, a click filters those regions.

## 5. The "Paper, a road race, two statements" example

This example sets `theme="paper"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

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

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "paper",
  "kicker": "Sport",
  "title": "The Harrow Valley Half Marathon had 18,400 finishers in 2025",
  "subtitle": "Finishers, running clubs and money raised at the race on 5 October 2025.",
  "figures": [
    { "value": "18,400", "label": "Finishers in 2025", "context": "16,900 in 2024", "icon": "flag" },
    {
      "value": "1:58",
      "label": "Median finishing time in hours and minutes",
      "context": "2:01 in 2024",
      "icon": "clock"
    }
  ],
  "breakdowns": [
    {
      "data": [
        { "age": "Under 30", "runners": 4300 },
        { "age": "30 to 39", "runners": 5900 },
        { "age": "40 to 49", "runners": 4600 },
        { "age": "50 to 59", "runners": 2500 },
        { "age": "60 and over", "runners": 1100 }
      ],
      "name": "age",
      "value": "runners",
      "format": "integer",
      "title": "5,900 finishers were aged 30 to 39"
    },
    {
      "data": [
        { "home": "Harrow Valley", "runners": 7900 },
        { "home": "Rest of the county", "runners": 5200 },
        { "home": "Elsewhere in the country", "runners": 4400 },
        { "home": "Abroad", "runners": 900 }
      ],
      "name": "home",
      "value": "runners",
      "format": "integer",
      "title": "7,900 finishers lived in the Harrow Valley"
    }
  ],
  "ranking": {
    "data": [
      { "club": "Harrow Harriers", "runners": 412 },
      { "club": "Millbrook AC", "runners": 356 },
      { "club": "Castle Runners", "runners": 298 },
      { "club": "Valley Striders", "runners": 271 },
      { "club": "Eastfield Joggers", "runners": 233 },
      { "club": "Ridgeway RC", "runners": 187 },
      { "club": "Canal Path Runners", "runners": 164 },
      { "club": "Old Mill Milers", "runners": 129 }
    ],
    "name": "club",
    "value": "runners",
    "format": "integer",
    "highlight": "Harrow Harriers",
    "title": "Harrow Harriers had 412 finishers",
    "subtitle": "Finishers by running club, the eight largest"
  },
  "pack": {
    "data": [
      { "cause": "Hospice care", "k": 310 },
      { "cause": "Children's hospital", "k": 260 },
      { "cause": "Mountain rescue", "k": 150 },
      { "cause": "Food bank", "k": 140 },
      { "cause": "Animal shelter", "k": 120 },
      { "cause": "School sports", "k": 110 },
      { "cause": "Tree planting", "k": 90 },
      { "cause": "Library fund", "k": 60 },
      { "cause": "Lifeboats", "k": 60 }
    ],
    "name": "cause",
    "value": "k",
    "format": "£{value}k",
    "icon": {
      "Hospice care": "heart",
      "Children's hospital": "hospital",
      "Mountain rescue": "mountain",
      "Food bank": "bread",
      "School sports": "school",
      "Tree planting": "tree"
    },
    "title": "Runners raised £310,000 for hospice care",
    "subtitle": "Money raised by cause, thousand pounds"
  },
  "circles": {
    "data": [
      { "year": "finishers in 2015", "runners": 9200 },
      { "year": "finishers in 2020", "runners": 12600 },
      { "year": "finishers in 2025", "runners": 18400 }
    ],
    "name": "year",
    "value": "runners",
    "format": "integer",
    "title": "The race had 9,200 finishers in 2015"
  },
  "figure": {
    "value": "£1.3m",
    "label": "Raised for nine causes in 2025",
    "context": "£71 for each finisher"
  },
  "sources": "Harrow Valley Athletics race results and fundraising returns",
  "note": "The Harrow Valley Half Marathon is an invented race. All figures are illustrative.",
  "credit": "InsightCharts",
  "type": "ranking-poster"
}
```

## Regions

Each region of the poster is one prop. A region takes a compact config (its `data` rows, the field names and a `title`), and most also take a full spec with its own `type`.

- `figures`, `({ value, label, context?, icon? } | { data, name, value, icon, title?, ...shape-fill props } | Slot)[]`: Top row, up to two. A statement `{ value, label }` is set in large light type (the first in the accent colour); a config with `data` draws silhouettes filled to their level (`shape-fill`). In the example: 2 items: an object with `value`, `label`, `context`, `icon`.
- `breakdowns`, `({ data, name, value, title?, ...treemap props } | Slot)[]`: Second row, up to two: the subject's total split two ways, as treemaps side by side. In the example: 2 items: a config with 5 rows of `data` and the fields `name: "age"`, `value: "runners"`; a config with 4 rows of `data` and the fields `name: "home"`, `value: "runners"`.
- `ranking` (required), `{ data, name, value, highlight?, compare?, compareLabel?, title?, ...pill-rank props } | Slot`: Third row, full width: a ranking as centred pills with the value at the left and the rank at the right (`pill-rank`). `highlight` names the row drawn in the accent. In the example: a config with 8 rows of `data` and the fields `name: "club"`, `value: "runners"`.
- `pack`, `{ data, name, value, icon?, group?, title?, ...circle-pack props } | Slot`: Bottom left: parts as packed circles (`circle-pack`). `icon` is one icon name or a map from circle name to icon. In the example: a config with 9 rows of `data` and the fields `name: "cause"`, `value: "k"`.
- `circles`, `{ data, name, value, unit?, title?, ...stat-circles props } | Slot`: Bottom right: two to four related magnitudes as circles standing on one baseline (`stat-circles`). In the example: a config with 3 rows of `data` and the fields `name: "year"`, `value: "runners"`.
- `figure`, `{ value, label, context?, icon? }`: Bottom right, under the circles: one closing figure in large type. In the example: an object with `value`, `label`, `context`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

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

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `poster` (molecule), `shape-fill` (atom), `treemap` (atom), `pill-rank` (atom), `circle-pack` (atom), `stat-circles` (atom)
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

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/ranking-poster.md
- Component reference with every example: https://insightcharts.dev/llms/ranking-poster.md
- Registry item: https://insightcharts.dev/r/ranking-poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/ranking-poster.tsx
- How to choose a different infographic: https://insightcharts.dev/agents/infographics.md
- This page: https://insightcharts.dev/templates/ranking-poster#example-paper-a-road-race-two-statements
- These instructions as plain text: https://insightcharts.dev/agents/templates/ranking-poster/paper-a-road-race-two-statements.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
