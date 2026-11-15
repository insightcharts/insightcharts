# Reproduce the "Home energy, default theme, five chart forms" example of the InsightCharts Explainer

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Home energy, default theme, five chart forms" example of `explainer` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A vertical infographic in one narrow column. It opens with a big number or a proportion statement (`hook`), then the hero exhibit, then numbered sections with one exhibit each, a conclusion with an optional link, and sources.

Use it when: Use it to explain one subject to a general audience in a single narrow column. The column also works as a tall image or on a phone screen. State the main finding with its number in the headline and repeat the main number in `hook`. Make the hero exhibit the largest thing on the page. Give each numbered section one heading, one exhibit and one sentence with its main number. Write each section so it can be read without the others. Keep one accent colour on the subject (`highlight`) throughout.

Pick something else when: Findings that need caveats and separate interpretation (use `report-page`). A chart that has to change step by step (use `visual-essay` with a scrolly block). More than five sections, because readers stop before the end.

Instructions for the alternatives: `visual-essay` https://insightcharts.dev/agents/templates/visual-essay.md, `report-page` https://insightcharts.dev/agents/templates/report-page.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/explainer
```

The file lands at `components/insightcharts/templates/explainer.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { Explainer } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Home energy, default theme, five chart forms" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { BarChart, Explainer, LineChart, LollipopChart, Treemap } from "insightcharts";

<Explainer
  kicker="Home energy"
  title="Heating rooms used 62% of the energy in an average home in 2023"
  deck="The average home used 14,200 kWh of gas and electricity. Room heating used 8,804 kWh of it."
  hook={{
    value: 62,
    total: 100,
    figure: "62 in every 100",
    text: "units of energy used at home heat the rooms.",
    detail: "Hot water uses another 17.",
  }}
  hero={<Treemap
    data={[
      { use: "Room heating", kwh: 8804 },
      { use: "Hot water", kwh: 2414 },
      { use: "Appliances", kwh: 1846 },
      { use: "Lighting", kwh: 710 },
      { use: "Cooking", kwh: 426 },
    ]}
    name="use"
    value="kwh"
    format="{value} kWh"
    highlight="Room heating"
    height={320}
    title="Room heating used 8,804 of the 14,200 kWh"
    subtitle="Energy used by an average home in 2023, by purpose, kWh"
    note="Illustrative data"
  />}
  heroText="Hot water used 2,414 kWh. Appliances, lighting and cooking together used 2,982 kWh."
  sections={[
    {
      title: "Homes built before 1945 used 17,900 kWh",
      text: "Homes built after 2010 used 9,600 kWh. Building rules have required wall and loft insulation since 1990.",
      exhibit: <LollipopChart
        data={[
          { built: "Before 1945", kwh: 17900 },
          { built: "1945 to 1964", kwh: 15800 },
          { built: "1965 to 1990", kwh: 14100 },
          { built: "1991 to 2010", kwh: 11700 },
          { built: "After 2010", kwh: 9600 },
        ]}
        x="built"
        y="kwh"
        sort="none"
        format="integer"
        highlight="Before 1945"
        subtitle="Energy used per home in 2023, by year built, kWh"
      />,
      takeaway: "A home built before 1945 used 8,300 kWh more than one built after 2010.",
    },
    {
      title: "Daily gas use was 78 kWh in January and 9 kWh in July",
      text: "Gas heats the rooms and the water in most homes. Daily electricity use stayed between 8.1 and 10.6 kWh all year.",
      exhibit: <LineChart
        data={[
          { month: "Jan", Gas: 78, Electricity: 10.5 },
          { month: "Feb", Gas: 70, Electricity: 10.1 },
          { month: "Mar", Gas: 55, Electricity: 9.6 },
          { month: "Apr", Gas: 36, Electricity: 9 },
          { month: "May", Gas: 18, Electricity: 8.6 },
          { month: "Jun", Gas: 10, Electricity: 8.2 },
          { month: "Jul", Gas: 9, Electricity: 8.1 },
          { month: "Aug", Gas: 9, Electricity: 8.2 },
          { month: "Sep", Gas: 16, Electricity: 8.7 },
          { month: "Oct", Gas: 34, Electricity: 9.4 },
          { month: "Nov", Gas: 56, Electricity: 10 },
          { month: "Dec", Gas: 74, Electricity: 10.6 },
        ]}
        x="month"
        y={["Gas", "Electricity"]}
        zero
        format="{value} kWh"
        subtitle="Average daily energy use per home by month, 2023, kWh"
      />,
      takeaway: "January gas use was 8.7 times July gas use.",
    },
    {
      title: "Cavity wall insulation saves 2,100 kWh a year",
      text: "Loft insulation saves 1,400 kWh. Turning the thermostat down by 1°C saves 1,100 kWh.",
      exhibit: <BarChart
        data={[
          { measure: "Cavity wall insulation", kwh: 2100 },
          { measure: "Loft insulation", kwh: 1400 },
          { measure: "Thermostat 1°C lower", kwh: 1100 },
          { measure: "Draught-proofing", kwh: 500 },
        ]}
        x="measure"
        y="kwh"
        sort="none"
        orientation="horizontal"
        format="{value} kWh"
        highlight="Cavity wall insulation"
        subtitle="Energy saved per year by measure, average home, kWh"
      />,
    },
  ]}
  conclusion={{
    title: "The four measures together save 5,100 kWh a year",
    text: "That is 36% of the 14,200 kWh an average home used in 2023.",
    points: [
      "Check whether the walls and loft are insulated.",
      "Set the thermostat 1°C lower.",
      "Fit draught strips to doors and windows.",
    ],
  }}
  sources="National household energy survey"
  period="2023"
  method="Energy is delivered gas and electricity, in kWh. Savings are modelled for a three-bedroom semi-detached house and overlap when measures are combined."
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "kicker": "Home energy",
  "title": "Heating rooms used 62% of the energy in an average home in 2023",
  "deck": "The average home used 14,200 kWh of gas and electricity. Room heating used 8,804 kWh of it.",
  "hook": {
    "value": 62,
    "total": 100,
    "figure": "62 in every 100",
    "text": "units of energy used at home heat the rooms.",
    "detail": "Hot water uses another 17."
  },
  "hero": {
    "type": "treemap",
    "data": [
      { "use": "Room heating", "kwh": 8804 },
      { "use": "Hot water", "kwh": 2414 },
      { "use": "Appliances", "kwh": 1846 },
      { "use": "Lighting", "kwh": 710 },
      { "use": "Cooking", "kwh": 426 }
    ],
    "name": "use",
    "value": "kwh",
    "format": "{value} kWh",
    "highlight": "Room heating",
    "height": 320,
    "title": "Room heating used 8,804 of the 14,200 kWh",
    "subtitle": "Energy used by an average home in 2023, by purpose, kWh",
    "note": "Illustrative data"
  },
  "heroText": "Hot water used 2,414 kWh. Appliances, lighting and cooking together used 2,982 kWh.",
  "sections": [
    {
      "title": "Homes built before 1945 used 17,900 kWh",
      "text": "Homes built after 2010 used 9,600 kWh. Building rules have required wall and loft insulation since 1990.",
      "exhibit": {
        "type": "lollipop-chart",
        "data": [
          { "built": "Before 1945", "kwh": 17900 },
          { "built": "1945 to 1964", "kwh": 15800 },
          { "built": "1965 to 1990", "kwh": 14100 },
          { "built": "1991 to 2010", "kwh": 11700 },
          { "built": "After 2010", "kwh": 9600 }
        ],
        "x": "built",
        "y": "kwh",
        "sort": "none",
        "format": "integer",
        "highlight": "Before 1945",
        "subtitle": "Energy used per home in 2023, by year built, kWh"
      },
      "takeaway": "A home built before 1945 used 8,300 kWh more than one built after 2010."
    },
    {
      "title": "Daily gas use was 78 kWh in January and 9 kWh in July",
      "text": "Gas heats the rooms and the water in most homes. Daily electricity use stayed between 8.1 and 10.6 kWh all year.",
      "exhibit": {
        "type": "line-chart",
        "data": [
          { "month": "Jan", "Gas": 78, "Electricity": 10.5 },
          { "month": "Feb", "Gas": 70, "Electricity": 10.1 },
          { "month": "Mar", "Gas": 55, "Electricity": 9.6 },
          { "month": "Apr", "Gas": 36, "Electricity": 9 },
          { "month": "May", "Gas": 18, "Electricity": 8.6 },
          { "month": "Jun", "Gas": 10, "Electricity": 8.2 },
          { "month": "Jul", "Gas": 9, "Electricity": 8.1 },
          { "month": "Aug", "Gas": 9, "Electricity": 8.2 },
          { "month": "Sep", "Gas": 16, "Electricity": 8.7 },
          { "month": "Oct", "Gas": 34, "Electricity": 9.4 },
          { "month": "Nov", "Gas": 56, "Electricity": 10 },
          { "month": "Dec", "Gas": 74, "Electricity": 10.6 }
        ],
        "x": "month",
        "y": ["Gas", "Electricity"],
        "zero": true,
        "format": "{value} kWh",
        "subtitle": "Average daily energy use per home by month, 2023, kWh"
      },
      "takeaway": "January gas use was 8.7 times July gas use."
    },
    {
      "title": "Cavity wall insulation saves 2,100 kWh a year",
      "text": "Loft insulation saves 1,400 kWh. Turning the thermostat down by 1°C saves 1,100 kWh.",
      "exhibit": {
        "type": "bar-chart",
        "data": [
          { "measure": "Cavity wall insulation", "kwh": 2100 },
          { "measure": "Loft insulation", "kwh": 1400 },
          { "measure": "Thermostat 1°C lower", "kwh": 1100 },
          { "measure": "Draught-proofing", "kwh": 500 }
        ],
        "x": "measure",
        "y": "kwh",
        "sort": "none",
        "orientation": "horizontal",
        "format": "{value} kWh",
        "highlight": "Cavity wall insulation",
        "subtitle": "Energy saved per year by measure, average home, kWh"
      }
    }
  ],
  "conclusion": {
    "title": "The four measures together save 5,100 kWh a year",
    "text": "That is 36% of the 14,200 kWh an average home used in 2023.",
    "points": [
      "Check whether the walls and loft are insulated.",
      "Set the thermostat 1°C lower.",
      "Fit draught strips to doors and windows."
    ]
  },
  "sources": "National household energy survey",
  "period": "2023",
  "method": "Energy is delivered gas and electricity, in kWh. Savings are modelled for a three-bedroom semi-detached house and overlap when measures are combined.",
  "note": "Illustrative data",
  "type": "explainer"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `hook`, `{ value, total?, text?, figure?, visual?, icon?, detail?, label?, context?, format?, variant?, tone?, series?, target?, max? } | Slot`: The opening number. With `text` it renders a `proportion-statement` ("19 in every 100 ..."); with `label` a hero `big-number`, which also takes that atom's `variant` (`filled`, `tinted`, `with-icon`, `with-ring`, `with-trend`), `tone`, `icon`, `series`, `target` and `max`. A spec or element is rendered as given. In the example: an object with `value`, `total`, `figure`, `text`, `detail`.
- `hero`, `Slot`: The main exhibit. Its `title` states one fact with its number. Default height 360px. In the example: a `treemap` spec with 5 rows.
- `sections`, `{ title, text?, exhibit?, takeaway?, id? }[]`: Numbered sections. Each has a heading, one exhibit and a `takeaway` sentence with its main number. In the example: 3 items: an object with `title`, `text`, `exhibit`, `takeaway`; an object with `title`, `text`, `exhibit`.
- `conclusion`, `{ title, text?, points?, action?: { label, href } }`: The closing block: a heading, text, a list of actions and an optional link. In the example: an object with `title`, `text`, `points`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The main finding, as one plain sentence with the number and the period in it. |
| `kicker` | `string` |  | Small label above the title. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. |
| `hook` | `{ value, total?, text?, figure?, visual?, icon?, detail?, label?, context?, format?, variant?, tone?, series?, target?, max? } \| Slot` |  | The opening number. With `text` it renders a `proportion-statement` ("19 in every 100 ..."); with `label` a hero `big-number`, which also takes that atom's `variant` (`filled`, `tinted`, `with-icon`, `with-ring`, `with-trend`), `tone`, `icon`, `series`, `target` and `max`. A spec or element is rendered as given. |
| `hero` | `Slot` |  | The main exhibit. Its `title` states one fact with its number. Default height 360px. |
| `heroText` | `string` |  | One or two sentences under the hero. Each states one more fact. |
| `sections` | `{ title, text?, exhibit?, takeaway?, id? }[]` |  | Numbered sections. Each has a heading, one exhibit and a `takeaway` sentence with its main number. |
| `screenful` | `boolean` | `false` | Give every section at least the height of the viewport and centre its content, so each fills a screen. |
| `conclusion` | `{ title, text?, points?, action?: { label, href } }` |  | The closing block: a heading, text, a list of actions and an optional link. |
| `sources` | `string \| { name, url? } \| (string \| { name, url? })[]` |  | Where the data comes from, shown in the closing source note. Entries with a `url` are linked. |
| `period` | `string` |  | The period the data covers. |
| `method` | `string` |  | How the numbers were produced: definitions, adjustments, exclusions. |
| `note` | `string` |  | Caveats the reader should know, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the piece. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Heading level of the title; section headings follow one level down. |
| `maxWidth` | `number \| string` |  | Widest the piece may get. It is centred in wider containers. |
| `theme` | `ThemeInput` |  | A built-in theme name (`"editorial"`, `"ledger"`, `"noir"`...) or a theme object, passed on to everything inside. A named theme with its own surface paints that surface behind the whole piece. |
| `frame` | `boolean` |  | Paint the theme's surface behind the piece, with page padding. Default: on when `theme` is a named theme with its own surface. Set false when the host already paints it. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to everything inside. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `headline` (atom), `big-number` (atom), `proportion-statement` (molecule), `step-marker` (atom), `prose` (atom), `callout` (atom), `source-note` (atom), `bar-chart` (atom), `donut-chart` (atom), `pictogram-chart` (atom), `icon-stat` (atom), `line-chart` (atom), `segmented-bar` (atom), `treemap` (atom), `lollipop-chart` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each step or section states one fact. Change one thing per step.
- Each chart inside follows the rules of its own component.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Set `level` to the heading level that fits the page outline.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `sources` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/explainer.md
- Component reference with every example: https://insightcharts.dev/llms/explainer.md
- Registry item: https://insightcharts.dev/r/explainer.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/explainer.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/explainer#example-home-energy-default-theme-five-chart-forms
- These instructions as plain text: https://insightcharts.dev/agents/templates/explainer/home-energy-default-theme-five-chart-forms.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
