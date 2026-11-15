# Build an Explainer with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add an Explainer (`explainer`, a template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

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

## 5. Working example

```tsx
import { BarChart, DonutChart, Explainer, IconStat, PictogramChart } from "insightcharts";

<Explainer
  theme="sunrise"
  kicker="Food and climate"
  title="Households threw away 631 million tonnes of food in 2022"
  deck="That is 60% of the 1.05 billion tonnes of food wasted worldwide. Food service wasted 290 million tonnes and retail 131 million."
  hook={{
    value: 19,
    total: 100,
    text: "tonnes of food that reach shops, restaurants and homes are thrown away.",
    detail: "That was 1.05 billion tonnes in 2022.",
  }}
  hero={<DonutChart
    data={[
      { sector: "Households", mt: 631 },
      { sector: "Food service", mt: 290 },
      { sector: "Retail", mt: 131 },
    ]}
    name="sector"
    value="mt"
    format="{value} Mt"
    centerLabel="Million tonnes wasted"
    centerValue="1,052"
    height={340}
    title="Households produced 60% of the world's food waste in 2022"
    subtitle="Food waste by sector, million tonnes (Mt), 2022"
    source="UNEP Food Waste Index Report 2024"
    note="Figures are approximate, for illustration"
  />}
  heroText="Food service produced 290 million tonnes, or 28%. Retail produced 131 million tonnes, or 12%."
  sections={[
    {
      title: "Household food waste by income group",
      text: "Households in high-income countries waste 81 kg of food per person a year. In upper-middle-income countries the figure is 88 kg. In lower-middle-income countries it is 86 kg.",
      exhibit: <PictogramChart
        data={[
          { group: "High income", kg: 81 },
          { group: "Upper-middle", kg: 88 },
          { group: "Lower-middle", kg: 86 },
        ]}
        name="group"
        value="kg"
        unit={10}
        unitLabel="10 kg of food"
        icon="apple"
        format="{value} kg"
        subtitle="Household food waste per person per year, by country income group"
      />,
      takeaway: "The three income groups are within 7 kg per person of each other.",
    },
    {
      title: "Lost and wasted food causes 4.4 billion tonnes of emissions a year",
      text: "Growing, transporting and chilling food uses land, fertiliser and fuel. Food releases methane when it rots. Lost and wasted food causes 8 to 10% of global greenhouse gas emissions.",
      exhibit: <BarChart
        data={[
          { emitter: "China", gt: 13 },
          { emitter: "United States", gt: 6 },
          { emitter: "Wasted food", gt: 4.4 },
          { emitter: "India", gt: 3.9 },
          { emitter: "European Union", gt: 3.4 },
        ]}
        x="emitter"
        y="gt"
        sort="desc"
        orientation="horizontal"
        highlight="Wasted food"
        format="{value} Gt"
        subtitle="Annual greenhouse gas emissions, billion tonnes of CO2 equivalent. Wasted food includes losses before retail"
      />,
      takeaway: "Only China and the United States emit more than lost and wasted food.",
    },
    {
      title: "733 million people faced hunger in 2023",
      exhibit: <IconStat
        icon="person"
        tone="negative"
        count={1}
        total={11}
        columns={11}
        text="people in the world faced hunger in 2023."
      />,
    },
  ]}
  conclusion={{
    title: "The UN target is to halve food waste by 2030",
    text: "Britain and Japan publish household food waste figures. Britain has cut household waste by 18% and Japan by 31%.",
    points: [
      "Measure household food waste and publish the figure every year.",
      "State on packaging that “best before” refers to quality and “use by” refers to safety.",
      "Plan meals before shopping and freeze food that will not be eaten in time.",
    ],
    action: {
      label: "Read the UNEP report",
      href: "https://www.unep.org/resources/publication/food-waste-index-report-2024",
    },
  }}
  sources={[
    {
      name: "UNEP Food Waste Index Report 2024",
      url: "https://www.unep.org/resources/publication/food-waste-index-report-2024",
    },
    "FAO, State of Food Security and Nutrition in the World 2024",
    "Emissions figures rounded from national inventories",
  ]}
  note="Figures are approximate, for illustration"
  period="2022 (waste), 2023 (hunger and emissions)"
  method="Food waste is measured at retail, food service and household level and includes inedible parts. Losses on farms and in transport are counted separately."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "explainer",
  "theme": "sunrise",
  "kicker": "Food and climate",
  "title": "Households threw away 631 million tonnes of food in 2022",
  "deck": "That is 60% of the 1.05 billion tonnes of food wasted worldwide. Food service wasted 290 million tonnes and retail 131 million.",
  "hook": {
    "value": 19,
    "total": 100,
    "text": "tonnes of food that reach shops, restaurants and homes are thrown away.",
    "detail": "That was 1.05 billion tonnes in 2022."
  },
  "hero": {
    "type": "donut-chart",
    "data": [
      { "sector": "Households", "mt": 631 },
      { "sector": "Food service", "mt": 290 },
      { "sector": "Retail", "mt": 131 }
    ],
    "name": "sector",
    "value": "mt",
    "format": "{value} Mt",
    "centerLabel": "Million tonnes wasted",
    "centerValue": "1,052",
    "height": 340,
    "title": "Households produced 60% of the world's food waste in 2022",
    "subtitle": "Food waste by sector, million tonnes (Mt), 2022",
    "source": "UNEP Food Waste Index Report 2024",
    "note": "Figures are approximate, for illustration"
  },
  "heroText": "Food service produced 290 million tonnes, or 28%. Retail produced 131 million tonnes, or 12%.",
  "sections": [
    {
      "title": "Household food waste by income group",
      "text": "Households in high-income countries waste 81 kg of food per person a year. In upper-middle-income countries the figure is 88 kg. In lower-middle-income countries it is 86 kg.",
      "exhibit": {
        "type": "pictogram-chart",
        "data": [
          { "group": "High income", "kg": 81 },
          { "group": "Upper-middle", "kg": 88 },
          { "group": "Lower-middle", "kg": 86 }
        ],
        "name": "group",
        "value": "kg",
        "unit": 10,
        "unitLabel": "10 kg of food",
        "icon": "apple",
        "format": "{value} kg",
        "subtitle": "Household food waste per person per year, by country income group"
      },
      "takeaway": "The three income groups are within 7 kg per person of each other."
    },
    {
      "title": "Lost and wasted food causes 4.4 billion tonnes of emissions a year",
      "text": "Growing, transporting and chilling food uses land, fertiliser and fuel. Food releases methane when it rots. Lost and wasted food causes 8 to 10% of global greenhouse gas emissions.",
      "exhibit": {
        "type": "bar-chart",
        "data": [
          { "emitter": "China", "gt": 13 },
          { "emitter": "United States", "gt": 6 },
          { "emitter": "Wasted food", "gt": 4.4 },
          { "emitter": "India", "gt": 3.9 },
          { "emitter": "European Union", "gt": 3.4 }
        ],
        "x": "emitter",
        "y": "gt",
        "sort": "desc",
        "orientation": "horizontal",
        "highlight": "Wasted food",
        "format": "{value} Gt",
        "subtitle": "Annual greenhouse gas emissions, billion tonnes of CO2 equivalent. Wasted food includes losses before retail"
      },
      "takeaway": "Only China and the United States emit more than lost and wasted food."
    },
    {
      "title": "733 million people faced hunger in 2023",
      "exhibit": {
        "type": "icon-stat",
        "icon": "person",
        "tone": "negative",
        "count": 1,
        "total": 11,
        "columns": 11,
        "text": "people in the world faced hunger in 2023."
      }
    }
  ],
  "conclusion": {
    "title": "The UN target is to halve food waste by 2030",
    "text": "Britain and Japan publish household food waste figures. Britain has cut household waste by 18% and Japan by 31%.",
    "points": [
      "Measure household food waste and publish the figure every year.",
      "State on packaging that “best before” refers to quality and “use by” refers to safety.",
      "Plan meals before shopping and freeze food that will not be eaten in time."
    ],
    "action": {
      "label": "Read the UNEP report",
      "href": "https://www.unep.org/resources/publication/food-waste-index-report-2024"
    }
  },
  "sources": [
    {
      "name": "UNEP Food Waste Index Report 2024",
      "url": "https://www.unep.org/resources/publication/food-waste-index-report-2024"
    },
    "FAO, State of Food Security and Nutrition in the World 2024",
    "Emissions figures rounded from national inventories"
  ],
  "note": "Figures are approximate, for illustration",
  "period": "2022 (waste), 2023 (hunger and emissions)",
  "method": "Food waste is measured at retail, food service and household level and includes inedible parts. Losses on farms and in transport are counted separately."
}
```

This example sets `theme="sunrise"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `hook`, `{ value, total?, text?, figure?, visual?, icon?, detail?, label?, context?, format?, variant?, tone?, series?, target?, max? } | Slot`: The opening number. With `text` it renders a `proportion-statement` ("19 in every 100 ..."); with `label` a hero `big-number`, which also takes that atom's `variant` (`filled`, `tinted`, `with-icon`, `with-ring`, `with-trend`), `tone`, `icon`, `series`, `target` and `max`. A spec or element is rendered as given. In the example: an object with `value`, `total`, `text`, `detail`.
- `hero`, `Slot`: The main exhibit. Its `title` states one fact with its number. Default height 360px. In the example: a `donut-chart` spec with 3 rows.
- `sections`, `{ title, text?, exhibit?, takeaway?, id? }[]`: Numbered sections. Each has a heading, one exhibit and a `takeaway` sentence with its main number. In the example: 3 items: an object with `title`, `text`, `exhibit`, `takeaway`; an object with `title`, `exhibit`.
- `conclusion`, `{ title, text?, points?, action?: { label, href } }`: The closing block: a heading, text, a list of actions and an optional link. In the example: an object with `title`, `text`, `points`, `action`.

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

- Component reference with every example: https://insightcharts.dev/llms/explainer.md
- Registry item: https://insightcharts.dev/r/explainer.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/explainer.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/explainer
- These instructions as plain text: https://insightcharts.dev/agents/templates/explainer.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
