# Build a Poster with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Poster (`poster`, a molecule) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

## 1. Check that this is the right component

The sheet an infographic is composed on. It paints a full-bleed ground from a poster theme, forces one theme and colour mode on everything inside, and lays out a masthead, a grid of panels and a footer. It can save the whole sheet as one PNG.

Use it when: Use it as the outer frame of any infographic: one dominant graphic with a few supporting panels, on a painted ground. Give it a poster theme (`noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`) and put a chart or figure spec in each panel. Put the one fact in `title` and keep panel headings short. It reflows to one column under 600px.

Pick something else when: Long reading text or more than about six panels (use `report-page` or `visual-essay`). A single fact at a fixed social size (use `social-card`). Charts that need axes, gridlines and dense labels to be read, because a poster ground suits large flat marks with their values printed on them.

Instructions for the alternatives: `visual-essay` https://insightcharts.dev/agents/templates/visual-essay.md, `report-page` https://insightcharts.dev/agents/templates/report-page.md, `social-card` https://insightcharts.dev/agents/templates/social-card.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/poster
```

The file lands at `components/insightcharts/molecules/poster.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { Poster } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. Working example

```tsx
import { BarChart, BigNumber, DonutChart, PictogramChart, Poster } from "insightcharts";

<Poster
  theme="noir"
  kicker="Transport"
  title="Riverton's bike-share scheme carried 4.2 million trips in 2025"
  subtitle="Trips, bikes and reasons for riding in the city's public bike-share scheme, January to December 2025."
  panels={[
    {
      span: 4,
      valign: "center",
      content: <BigNumber
        size="hero"
        value="4.2 million"
        label="Trips in 2025"
        context="3.4 million in 2024"
      />,
    },
    {
      span: 8,
      title: "Old Town had 1,150 of the scheme's 3,000 bikes",
      content: <PictogramChart
        data={[
          { district: "Old Town", bikes: 1150 },
          { district: "Harbour", bikes: 820 },
          { district: "University", bikes: 640 },
          { district: "Northside", bikes: 390 },
        ]}
        name="district"
        value="bikes"
        unit={50}
        unitLabel="50 bikes"
        icon="bike"
        highlight="Old Town"
      />,
      source: "Riverton Transport Office",
    },
    {
      span: 7,
      title: "670,000 trips were made on Wednesdays in 2025",
      subtitle: "Trips by day of the week, thousands, 2025",
      content: <BarChart
        data={[
          { day: "Mon", trips: 610 },
          { day: "Tue", trips: 655 },
          { day: "Wed", trips: 670 },
          { day: "Thu", trips: 662 },
          { day: "Fri", trips: 640 },
          { day: "Sat", trips: 520 },
          { day: "Sun", trips: 443 },
        ]}
        x="day"
        y="trips"
        orientation="vertical"
        sort="none"
        highlight="Wed"
        format="{value}k"
        height={260}
      />,
    },
    {
      span: 5,
      title: "46% of trips were commutes",
      subtitle: "Share of trips by stated purpose, rider survey, 2025",
      content: <DonutChart
        data={[
          { purpose: "Commuting", share: 46 },
          { purpose: "Leisure", share: 27 },
          { purpose: "Errands", share: 18 },
          { purpose: "Other", share: 9 },
        ]}
        name="purpose"
        value="share"
        format="{value}%"
        centerValue="46%"
        centerLabel="Commuting"
        height={260}
      />,
    },
  ]}
  sources={["Riverton Transport Office", "Riverton rider survey 2025"]}
  note="Riverton is an invented city. All figures are illustrative."
  credit="InsightCharts"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "poster",
  "theme": "noir",
  "kicker": "Transport",
  "title": "Riverton's bike-share scheme carried 4.2 million trips in 2025",
  "subtitle": "Trips, bikes and reasons for riding in the city's public bike-share scheme, January to December 2025.",
  "panels": [
    {
      "span": 4,
      "valign": "center",
      "content": {
        "type": "big-number",
        "size": "hero",
        "value": "4.2 million",
        "label": "Trips in 2025",
        "context": "3.4 million in 2024"
      }
    },
    {
      "span": 8,
      "title": "Old Town had 1,150 of the scheme's 3,000 bikes",
      "content": {
        "type": "pictogram-chart",
        "data": [
          { "district": "Old Town", "bikes": 1150 },
          { "district": "Harbour", "bikes": 820 },
          { "district": "University", "bikes": 640 },
          { "district": "Northside", "bikes": 390 }
        ],
        "name": "district",
        "value": "bikes",
        "unit": 50,
        "unitLabel": "50 bikes",
        "icon": "bike",
        "highlight": "Old Town"
      },
      "source": "Riverton Transport Office"
    },
    {
      "span": 7,
      "title": "670,000 trips were made on Wednesdays in 2025",
      "subtitle": "Trips by day of the week, thousands, 2025",
      "content": {
        "type": "bar-chart",
        "data": [
          { "day": "Mon", "trips": 610 },
          { "day": "Tue", "trips": 655 },
          { "day": "Wed", "trips": 670 },
          { "day": "Thu", "trips": 662 },
          { "day": "Fri", "trips": 640 },
          { "day": "Sat", "trips": 520 },
          { "day": "Sun", "trips": 443 }
        ],
        "x": "day",
        "y": "trips",
        "orientation": "vertical",
        "sort": "none",
        "highlight": "Wed",
        "format": "{value}k",
        "height": 260
      }
    },
    {
      "span": 5,
      "title": "46% of trips were commutes",
      "subtitle": "Share of trips by stated purpose, rider survey, 2025",
      "content": {
        "type": "donut-chart",
        "data": [
          { "purpose": "Commuting", "share": 46 },
          { "purpose": "Leisure", "share": 27 },
          { "purpose": "Errands", "share": 18 },
          { "purpose": "Other", "share": 9 }
        ],
        "name": "purpose",
        "value": "share",
        "format": "{value}%",
        "centerValue": "46%",
        "centerLabel": "Commuting",
        "height": 260
      }
    }
  ],
  "sources": ["Riverton Transport Office", "Riverton rider survey 2025"],
  "note": "Riverton is an invented city. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

This example sets `theme="noir"`. Keep it to reproduce the look, or pick another poster theme: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. The poster paints its own background and keeps its colours on a dark page.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `panels` (required), `PosterPanel[]`: The blocks, in reading order. Each is `{ content, title?, subtitle?, span?, rowSpan?, source?, note?, align?, valign?, bleed?, id? }`. `content` is a component spec or rendered content. `span` is in units of `columns` (default: full width). `bleed` runs the content to the poster's left and right edges. In the example: 4 items: an object with `span`, `valign`, `content`; an object with `span`, `title`, `content`, `source`; an object with `span`, `title`, `subtitle`, `content`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` |  | The poster's one fact, as a plain sentence with its number. Set large and light in the theme's display face. |
| `kicker` | `string` |  | Small label above the title: the topic or series. |
| `subtitle` | `string` |  | One or two lines under the title: the measure, population and period. |
| `panels` (required) | `PosterPanel[]` |  | The blocks, in reading order. Each is `{ content, title?, subtitle?, span?, rowSpan?, source?, note?, align?, valign?, bleed?, id? }`. `content` is a component spec or rendered content. `span` is in units of `columns` (default: full width). `bleed` runs the content to the poster's left and right edges. |
| `columns` | `number` | `12` | Columns of the layout grid: a 12-unit grid, or a simple count such as 2 or 3. Under 600px every panel is full width; from 600 to 760px the grid has two columns. |
| `gap` | `number` |  | Space between panels in px. Default 40 (28 under 600px). |
| `padding` | `number` |  | Space between the poster's edge and its content in px. Default 56 (36 under 900px, 20 under 600px). |
| `maxWidth` | `number \| string` | `1200` | Widest the poster is drawn. It is centred in wider containers. |
| `aspect` | `number \| string` |  | Fixed shape as width / height: `0.75`, `"3:4"`, `"16:9"`. The poster still grows when its content needs more height, and the ratio is dropped under 600px. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"noir"` | A poster theme name, any other theme name, or a theme object. It is passed on to everything inside. |
| `mode` | `"light" \| "dark" \| "auto" \| "system"` | `"light"` | Colour mode of the poster and everything in it. A poster does not follow the page unless you set `auto`. Only `paper` has a different dark variant. |
| `background` | `string` |  | CSS background of the sheet, a colour or a gradient. Default: the poster theme's ground. Keep it close to the theme's `surface`, which charts use for the gaps between marks. |
| `rules` | `"none" \| "solid" \| "dotted"` | `"dotted"` | Lines under the masthead, between rows of panels and above the footer. |
| `sources` | `string \| string[]` |  | Where the data comes from, shown in the footer. |
| `note` | `string` |  | Caveat shown in the footer, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the poster, shown at the right of the footer. |
| `titleAlign` | `"left" \| "center"` | `"left"` | Alignment of the masthead. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Heading level of the title. Panel headings are one level down. |
| `download` | `boolean` | `false` | Show a "Download PNG" control under the poster. The image is the whole sheet, drawn from the DOM onto a canvas, without the control. |
| `exportWidth` | `number` | `2400` | Width of the downloaded PNG in pixels. |
| `filename` | `string` |  | File name without extension. Defaults to a slug of the title. |
| `downloadLabel` | `string` | `"Download PNG"` | Label of the download control. |
| `onExport` | `(blob: Blob) => void` |  | Called with the PNG after a download. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `big-number` (atom), `pictogram-chart` (atom), `bar-chart` (atom), `donut-chart` (atom), `treemap` (atom), `waffle-chart` (atom), `segmented-bar` (atom), `icon-stat` (atom)
- Used by: `atlas-poster` (template), `count-poster` (template), `flow-poster` (template), `matrix-poster` (template), `network-poster` (template), `profile-poster` (template), `radial-poster` (template), `ranking-poster` (template), `scale-poster` (template), `timeline-poster` (template)

## Rules for this form

- The value is printed on or beside each mark. There are no axes or gridlines by default, so do not remove the labels.
- Area and count encodings are allowed here because the value is always printed.
- The component sets its own height from its content. Do not force a `height` unless the layout needs one.
- Set `download` when the user wants the whole piece as one PNG. It adds a "Download PNG" control under the piece.
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

- Component reference with every example: https://insightcharts.dev/llms/poster.md
- Registry item: https://insightcharts.dev/r/poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/poster.tsx
- How to choose a different molecule: https://insightcharts.dev/agents/molecules.md
- This page: https://insightcharts.dev/molecules/poster
- These instructions as plain text: https://insightcharts.dev/agents/molecules/poster.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
