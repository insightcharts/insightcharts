# Reproduce the "Personal finance, opening with a big number" example of the InsightCharts Explainer

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Personal finance, opening with a big number" example of `explainer` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

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

## 5. The "Personal finance, opening with a big number" example

This example sets `theme="blueprint"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BarChart, Explainer, LineChart, SegmentedBar } from "insightcharts";

<Explainer
  theme="blueprint"
  kicker="Money basics"
  title="Starting to save at 35 instead of 25 leaves $296,000 less at 65"
  deck="Both savers put in $300 a month at a 6% real return. The saver who starts at 25 has $597,000 at 65. The saver who starts at 35 has $301,000."
  hook={{
    variant: "with-icon",
    icon: "coin",
    value: 296000,
    format: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
    label: "Difference at 65 between starting at 25 and starting at 35",
    context: "Saving $300 a month until 65 at a 6% real return gives $597k from age 25 and $301k from age 35",
  }}
  hero={<LineChart
    data={[
      { age: "25", saver: "Starts at 25", balance: 0 },
      { age: "30", saver: "Starts at 25", balance: 20931 },
      { age: "35", saver: "Starts at 25", balance: 49164 },
      { age: "35", saver: "Starts at 35", balance: 0 },
      { age: "40", saver: "Starts at 25", balance: 87246 },
      { age: "40", saver: "Starts at 35", balance: 20931 },
      { age: "45", saver: "Starts at 25", balance: 138612 },
      { age: "45", saver: "Starts at 35", balance: 49164 },
      { age: "50", saver: "Starts at 25", balance: 207898 },
      { age: "50", saver: "Starts at 35", balance: 87246 },
      { age: "55", saver: "Starts at 25", balance: 301355 },
      { age: "55", saver: "Starts at 35", balance: 138612 },
      { age: "60", saver: "Starts at 25", balance: 427413 },
      { age: "60", saver: "Starts at 35", balance: 207898 },
      { age: "65", saver: "Starts at 25", balance: 597447 },
      { age: "65", saver: "Starts at 35", balance: 301355 },
    ]}
    x="age"
    y="balance"
    series="saver"
    format="compact"
    zero
    height={320}
    title="At 50 the saver who started at 25 has $208,000 and the other has $87,000"
    subtitle="Balance by age, $300 a month at a 6% real annual return"
    note="Illustrative calculation"
  />}
  heroText="The saver who starts at 25 deposits $36,000 more. The other $260,000 of the difference is investment growth."
  sections={[
    {
      title: "Deposits are $144,000 of the $597,000",
      text: "The saver who starts at 25 pays in $300 a month for 40 years. The other $453,000 is growth.",
      exhibit: <SegmentedBar
        data={[{ part: "Deposits", usd: 144000 }, { part: "Growth", usd: 453447 }]}
        name="part"
        value="usd"
        format="compact"
        highlight="Growth"
      />,
      takeaway: "Growth is 76% of the final balance.",
    },
    {
      title: "A 1.5% annual fee leaves $402,000 instead of $566,000",
      text: "The index fund charges 0.2% a year. The managed fund charges 1.5%. After 40 years the managed fund's balance is 29% lower.",
      exhibit: <BarChart
        data={[
          { fund: "Index fund, 0.2% a year", balance: 566005 },
          { fund: "Managed fund, 1.5% a year", balance: 402345 },
        ]}
        x="fund"
        y="balance"
        sort="none"
        orientation="horizontal"
        format="currency:USD"
        highlight="Index fund, 0.2% a year"
      />,
      takeaway: "The 1.3-point difference in fees costs $164,000 over 40 years.",
    },
  ]}
  conclusion={{
    title: "What to do",
    points: [
      "Set up a monthly standing order this month.",
      "Choose a broad index fund with a fee of about 0.2% a year.",
      "Increase the monthly amount each time your pay rises.",
    ],
  }}
  sources="Author's calculation"
  method="Monthly compounding at a constant real return of 6% a year. Fees are subtracted from the return. Real returns vary from year to year."
  note="Illustrative data. Not financial advice."
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "blueprint",
  "kicker": "Money basics",
  "title": "Starting to save at 35 instead of 25 leaves $296,000 less at 65",
  "deck": "Both savers put in $300 a month at a 6% real return. The saver who starts at 25 has $597,000 at 65. The saver who starts at 35 has $301,000.",
  "hook": {
    "variant": "with-icon",
    "icon": "coin",
    "value": 296000,
    "format": { "style": "currency", "currency": "USD", "maximumFractionDigits": 0 },
    "label": "Difference at 65 between starting at 25 and starting at 35",
    "context": "Saving $300 a month until 65 at a 6% real return gives $597k from age 25 and $301k from age 35"
  },
  "hero": {
    "type": "line-chart",
    "data": [
      { "age": "25", "saver": "Starts at 25", "balance": 0 },
      { "age": "30", "saver": "Starts at 25", "balance": 20931 },
      { "age": "35", "saver": "Starts at 25", "balance": 49164 },
      { "age": "35", "saver": "Starts at 35", "balance": 0 },
      { "age": "40", "saver": "Starts at 25", "balance": 87246 },
      { "age": "40", "saver": "Starts at 35", "balance": 20931 },
      { "age": "45", "saver": "Starts at 25", "balance": 138612 },
      { "age": "45", "saver": "Starts at 35", "balance": 49164 },
      { "age": "50", "saver": "Starts at 25", "balance": 207898 },
      { "age": "50", "saver": "Starts at 35", "balance": 87246 },
      { "age": "55", "saver": "Starts at 25", "balance": 301355 },
      { "age": "55", "saver": "Starts at 35", "balance": 138612 },
      { "age": "60", "saver": "Starts at 25", "balance": 427413 },
      { "age": "60", "saver": "Starts at 35", "balance": 207898 },
      { "age": "65", "saver": "Starts at 25", "balance": 597447 },
      { "age": "65", "saver": "Starts at 35", "balance": 301355 }
    ],
    "x": "age",
    "y": "balance",
    "series": "saver",
    "format": "compact",
    "zero": true,
    "height": 320,
    "title": "At 50 the saver who started at 25 has $208,000 and the other has $87,000",
    "subtitle": "Balance by age, $300 a month at a 6% real annual return",
    "note": "Illustrative calculation"
  },
  "heroText": "The saver who starts at 25 deposits $36,000 more. The other $260,000 of the difference is investment growth.",
  "sections": [
    {
      "title": "Deposits are $144,000 of the $597,000",
      "text": "The saver who starts at 25 pays in $300 a month for 40 years. The other $453,000 is growth.",
      "exhibit": {
        "type": "segmented-bar",
        "data": [{ "part": "Deposits", "usd": 144000 }, { "part": "Growth", "usd": 453447 }],
        "name": "part",
        "value": "usd",
        "format": "compact",
        "highlight": "Growth"
      },
      "takeaway": "Growth is 76% of the final balance."
    },
    {
      "title": "A 1.5% annual fee leaves $402,000 instead of $566,000",
      "text": "The index fund charges 0.2% a year. The managed fund charges 1.5%. After 40 years the managed fund's balance is 29% lower.",
      "exhibit": {
        "type": "bar-chart",
        "data": [
          { "fund": "Index fund, 0.2% a year", "balance": 566005 },
          { "fund": "Managed fund, 1.5% a year", "balance": 402345 }
        ],
        "x": "fund",
        "y": "balance",
        "sort": "none",
        "orientation": "horizontal",
        "format": "currency:USD",
        "highlight": "Index fund, 0.2% a year"
      },
      "takeaway": "The 1.3-point difference in fees costs $164,000 over 40 years."
    }
  ],
  "conclusion": {
    "title": "What to do",
    "points": [
      "Set up a monthly standing order this month.",
      "Choose a broad index fund with a fee of about 0.2% a year.",
      "Increase the monthly amount each time your pay rises."
    ]
  },
  "sources": "Author's calculation",
  "method": "Monthly compounding at a constant real return of 6% a year. Fees are subtracted from the return. Real returns vary from year to year.",
  "note": "Illustrative data. Not financial advice.",
  "type": "explainer"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `hook`, `{ value, total?, text?, figure?, visual?, icon?, detail?, label?, context?, format?, variant?, tone?, series?, target?, max? } | Slot`: The opening number. With `text` it renders a `proportion-statement` ("19 in every 100 ..."); with `label` a hero `big-number`, which also takes that atom's `variant` (`filled`, `tinted`, `with-icon`, `with-ring`, `with-trend`), `tone`, `icon`, `series`, `target` and `max`. A spec or element is rendered as given. In the example: an object with `variant`, `icon`, `value`, `format`, `label`, `context`.
- `hero`, `Slot`: The main exhibit. Its `title` states one fact with its number. Default height 360px. In the example: a `line-chart` spec with 16 rows.
- `sections`, `{ title, text?, exhibit?, takeaway?, id? }[]`: Numbered sections. Each has a heading, one exhibit and a `takeaway` sentence with its main number. In the example: 2 items: an object with `title`, `text`, `exhibit`, `takeaway`.
- `conclusion`, `{ title, text?, points?, action?: { label, href } }`: The closing block: a heading, text, a list of actions and an optional link. In the example: an object with `title`, `points`.

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
- This page: https://insightcharts.dev/templates/explainer#example-personal-finance-opening-with-a-big-number
- These instructions as plain text: https://insightcharts.dev/agents/templates/explainer/personal-finance-opening-with-a-big-number.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
