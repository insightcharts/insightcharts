# Reproduce the "Energy: a field study with a distribution" example of the InsightCharts Report page

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Energy: a field study with a distribution" example of `report-page` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A section of an analytical report laid out as a document. It has a title block, a summary, numbered findings, then method, limitations and sources. Each finding has one exhibit, an observation and a separately labelled interpretation with a confidence rating and a caveat.

Use it when: Use it for readers who will check the reasoning, as in evaluations, research notes, audits and experiment write-ups. State the main finding with its number in the title. Put all the main findings and the recommendation in the summary. Write each finding title as one fact with its number, and give it an exhibit that shows that fact. Put what the data shows in `observation` and what you infer from it in `interpretation`. End with method, limitations and sources.

Pick something else when: A decision-maker who wants only the result (use `executive-brief`). A general audience (use `explainer` or `visual-essay`). Findings without an exhibit. Put those in the summary.

Instructions for the alternatives: `executive-brief` https://insightcharts.dev/agents/templates/executive-brief.md, `visual-essay` https://insightcharts.dev/agents/templates/visual-essay.md, `explainer` https://insightcharts.dev/agents/templates/explainer.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/report-page
```

The file lands at `components/insightcharts/templates/report-page.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { ReportPage } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "Energy: a field study with a distribution" example

This example sets no theme, so it follows the host page and its light or dark mode.

```tsx
import { DivergingBarChart, DumbbellChart, Histogram, ReportPage } from "insightcharts";

<ReportPage
  kicker="Heat pump field study · Winter 2023/24"
  title="Heating energy use fell 61% in 412 homes after a heat pump replaced a gas boiler"
  deck="Mean use fell from 13,400 to 5,230 kWh a year. Annual bills rose £185 for homes on prepayment meters."
  byline="Buildings research group"
  date="2025-03-11"
  summary="Mean heating energy use in 412 homes fell from **13,400 to 5,230 kWh a year** after a heat pump replaced a gas boiler. The median seasonal performance factor in 64 homes with heat meters was 2.9. Bills fell £310 a year on a heat pump tariff and rose £185 on prepayment meters. We recommend that installers move every household to a heat pump tariff at installation."
  figures={[
    {
      value: "−61%",
      label: "Change in mean heating energy use",
      context: "From 13,400 to 5,230 kWh a year",
    },
    {
      value: "2.9",
      label: "Median seasonal performance factor",
      context: "64 homes with heat meters",
    },
    {
      value: "−£310",
      label: "Change in annual bill on a heat pump tariff",
      context: "+£185 on prepayment meters",
    },
  ]}
  findings={[
    {
      title: "Heating energy use in semi-detached homes fell from 14,200 to 5,500 kWh a year",
      exhibit: <DumbbellChart
        data={[
          { home: "Detached", gas: 18400, pump: 7300 },
          { home: "Semi-detached", gas: 14200, pump: 5500 },
          { home: "Terraced", gas: 11600, pump: 4500 },
          { home: "Flat", gas: 7900, pump: 3200 },
        ]}
        category="home"
        from="gas"
        to="pump"
        names={{ gas: "Gas boiler", pump: "Heat pump" }}
        sort="none"
        zero
        format="integer"
        subtitle="Mean energy used for heating, kWh a year, by type of home, before and after installation"
        source="Smart meter readings, 412 homes"
      />,
      observation: "Use fell in all four types of home. Detached homes fell from 18,400 to 7,300 kWh. Flats fell from 7,900 to 3,200 kWh.",
      interpretation: "The fall is close to 60% in every type of home. We think the heat pump accounts for it, because the homes had no other work done in the period.",
      confidence: "high",
    },
    {
      title: "The median seasonal performance factor was 2.9 in 64 metered homes",
      exhibit: <Histogram
        data={[
          { factor: 2.1 },
          { factor: 2.2 },
          { factor: 2.2 },
          { factor: 2.2 },
          { factor: 2.3 },
          { factor: 2.3 },
          { factor: 2.4 },
          { factor: 2.4 },
          { factor: 2.5 },
          { factor: 2.5 },
          { factor: 2.5 },
          { factor: 2.6 },
          { factor: 2.6 },
          { factor: 2.6 },
          { factor: 2.6 },
          { factor: 2.7 },
          { factor: 2.7 },
          { factor: 2.7 },
          { factor: 2.7 },
          { factor: 2.7 },
          { factor: 2.7 },
          { factor: 2.7 },
          { factor: 2.8 },
          { factor: 2.8 },
          { factor: 2.8 },
          { factor: 2.8 },
          { factor: 2.8 },
          { factor: 2.8 },
          { factor: 2.9 },
          { factor: 2.9 },
          { factor: 2.9 },
          { factor: 2.9 },
          { factor: 2.9 },
          { factor: 3 },
          { factor: 3 },
          { factor: 3 },
          { factor: 3 },
          { factor: 3 },
          { factor: 3 },
          { factor: 3 },
          { factor: 3.1 },
          { factor: 3.1 },
          { factor: 3.1 },
          { factor: 3.1 },
          { factor: 3.1 },
          { factor: 3.1 },
          { factor: 3.1 },
          { factor: 3.1 },
          { factor: 3.1 },
          { factor: 3.1 },
          { factor: 3.2 },
          { factor: 3.2 },
          { factor: 3.2 },
          { factor: 3.2 },
          { factor: 3.3 },
          { factor: 3.3 },
          { factor: 3.3 },
          { factor: 3.4 },
          { factor: 3.4 },
          { factor: 3.4 },
          { factor: 3.4 },
          { factor: 3.5 },
          { factor: 3.5 },
          { factor: 3.6 },
        ]}
        value="factor"
        step={0.2}
        median
        format="decimal:1"
        countLabel="homes"
        height={260}
        subtitle="Homes by seasonal performance factor, units of heat delivered per unit of electricity, 64 homes with heat meters"
      />,
      observation: "The factor ranged from 2.1 to 3.6. 8 of the 64 homes were below 2.5. 3 homes were at 3.5 or above.",
      interpretation: "Manufacturers quote a factor of 3.5 or more. Most homes in the study were below it. Installers set flow temperatures above 50°C in 5 of the 8 homes below 2.5.",
      confidence: "medium",
      caveat: "Homes with heat meters volunteered for them. They may be better run than the other 348 homes.",
    },
    {
      title: "Annual bills rose £185 for homes on prepayment meters",
      exhibit: <DivergingBarChart
        data={[
          { tariff: "Heat pump tariff", change: -310 },
          { tariff: "Standard variable", change: -45 },
          { tariff: "Fixed before 2023", change: 120 },
          { tariff: "Prepayment meter", change: 185 },
        ]}
        x="tariff"
        y="change"
        sort="none"
        format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0, signDisplay: "exceptZero" }}
        subtitle="Mean change in annual energy bill after installation, by electricity tariff, pounds"
      />,
      observation: "Bills fell £310 a year for homes on a heat pump tariff and £45 on a standard variable tariff. They rose £120 on older fixed tariffs and £185 on prepayment meters.",
      interpretation: "Energy use fell by a similar share on every tariff. The bill depends on the price of electricity relative to gas. 71 of the 412 homes were on prepayment meters.",
      confidence: "high",
    },
  ]}
  method="We compared smart meter readings for the 12 months before and the 12 months after installation in 412 homes. Readings are adjusted for outdoor temperature using degree days. 64 homes also had heat meters, which measure the heat delivered."
  limitations={[
    "There is no comparison group of homes that kept a gas boiler.",
    "One winter of data does not show how performance changes as equipment ages.",
    "Bills use the tariffs in force in March 2024.",
  ]}
  sources={["Smart meter readings", "Heat meter readings", "Installer commissioning records"]}
  period="October 2022 to March 2024"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "kicker": "Heat pump field study · Winter 2023/24",
  "title": "Heating energy use fell 61% in 412 homes after a heat pump replaced a gas boiler",
  "deck": "Mean use fell from 13,400 to 5,230 kWh a year. Annual bills rose £185 for homes on prepayment meters.",
  "byline": "Buildings research group",
  "date": "2025-03-11",
  "summary": "Mean heating energy use in 412 homes fell from **13,400 to 5,230 kWh a year** after a heat pump replaced a gas boiler. The median seasonal performance factor in 64 homes with heat meters was 2.9. Bills fell £310 a year on a heat pump tariff and rose £185 on prepayment meters. We recommend that installers move every household to a heat pump tariff at installation.",
  "figures": [
    {
      "value": "−61%",
      "label": "Change in mean heating energy use",
      "context": "From 13,400 to 5,230 kWh a year"
    },
    {
      "value": "2.9",
      "label": "Median seasonal performance factor",
      "context": "64 homes with heat meters"
    },
    {
      "value": "−£310",
      "label": "Change in annual bill on a heat pump tariff",
      "context": "+£185 on prepayment meters"
    }
  ],
  "findings": [
    {
      "title": "Heating energy use in semi-detached homes fell from 14,200 to 5,500 kWh a year",
      "exhibit": {
        "type": "dumbbell-chart",
        "data": [
          { "home": "Detached", "gas": 18400, "pump": 7300 },
          { "home": "Semi-detached", "gas": 14200, "pump": 5500 },
          { "home": "Terraced", "gas": 11600, "pump": 4500 },
          { "home": "Flat", "gas": 7900, "pump": 3200 }
        ],
        "category": "home",
        "from": "gas",
        "to": "pump",
        "names": { "gas": "Gas boiler", "pump": "Heat pump" },
        "sort": "none",
        "zero": true,
        "format": "integer",
        "subtitle": "Mean energy used for heating, kWh a year, by type of home, before and after installation",
        "source": "Smart meter readings, 412 homes"
      },
      "observation": "Use fell in all four types of home. Detached homes fell from 18,400 to 7,300 kWh. Flats fell from 7,900 to 3,200 kWh.",
      "interpretation": "The fall is close to 60% in every type of home. We think the heat pump accounts for it, because the homes had no other work done in the period.",
      "confidence": "high"
    },
    {
      "title": "The median seasonal performance factor was 2.9 in 64 metered homes",
      "exhibit": {
        "type": "histogram",
        "data": [
          { "factor": 2.1 },
          { "factor": 2.2 },
          { "factor": 2.2 },
          { "factor": 2.2 },
          { "factor": 2.3 },
          { "factor": 2.3 },
          { "factor": 2.4 },
          { "factor": 2.4 },
          { "factor": 2.5 },
          { "factor": 2.5 },
          { "factor": 2.5 },
          { "factor": 2.6 },
          { "factor": 2.6 },
          { "factor": 2.6 },
          { "factor": 2.6 },
          { "factor": 2.7 },
          { "factor": 2.7 },
          { "factor": 2.7 },
          { "factor": 2.7 },
          { "factor": 2.7 },
          { "factor": 2.7 },
          { "factor": 2.7 },
          { "factor": 2.8 },
          { "factor": 2.8 },
          { "factor": 2.8 },
          { "factor": 2.8 },
          { "factor": 2.8 },
          { "factor": 2.8 },
          { "factor": 2.9 },
          { "factor": 2.9 },
          { "factor": 2.9 },
          { "factor": 2.9 },
          { "factor": 2.9 },
          { "factor": 3 },
          { "factor": 3 },
          { "factor": 3 },
          { "factor": 3 },
          { "factor": 3 },
          { "factor": 3 },
          { "factor": 3 },
          { "factor": 3.1 },
          { "factor": 3.1 },
          { "factor": 3.1 },
          { "factor": 3.1 },
          { "factor": 3.1 },
          { "factor": 3.1 },
          { "factor": 3.1 },
          { "factor": 3.1 },
          { "factor": 3.1 },
          { "factor": 3.1 },
          { "factor": 3.2 },
          { "factor": 3.2 },
          { "factor": 3.2 },
          { "factor": 3.2 },
          { "factor": 3.3 },
          { "factor": 3.3 },
          { "factor": 3.3 },
          { "factor": 3.4 },
          { "factor": 3.4 },
          { "factor": 3.4 },
          { "factor": 3.4 },
          { "factor": 3.5 },
          { "factor": 3.5 },
          { "factor": 3.6 }
        ],
        "value": "factor",
        "step": 0.2,
        "median": true,
        "format": "decimal:1",
        "countLabel": "homes",
        "height": 260,
        "subtitle": "Homes by seasonal performance factor, units of heat delivered per unit of electricity, 64 homes with heat meters"
      },
      "observation": "The factor ranged from 2.1 to 3.6. 8 of the 64 homes were below 2.5. 3 homes were at 3.5 or above.",
      "interpretation": "Manufacturers quote a factor of 3.5 or more. Most homes in the study were below it. Installers set flow temperatures above 50°C in 5 of the 8 homes below 2.5.",
      "confidence": "medium",
      "caveat": "Homes with heat meters volunteered for them. They may be better run than the other 348 homes."
    },
    {
      "title": "Annual bills rose £185 for homes on prepayment meters",
      "exhibit": {
        "type": "diverging-bar-chart",
        "data": [
          { "tariff": "Heat pump tariff", "change": -310 },
          { "tariff": "Standard variable", "change": -45 },
          { "tariff": "Fixed before 2023", "change": 120 },
          { "tariff": "Prepayment meter", "change": 185 }
        ],
        "x": "tariff",
        "y": "change",
        "sort": "none",
        "format": {
          "style": "currency",
          "currency": "GBP",
          "maximumFractionDigits": 0,
          "signDisplay": "exceptZero"
        },
        "subtitle": "Mean change in annual energy bill after installation, by electricity tariff, pounds"
      },
      "observation": "Bills fell £310 a year for homes on a heat pump tariff and £45 on a standard variable tariff. They rose £120 on older fixed tariffs and £185 on prepayment meters.",
      "interpretation": "Energy use fell by a similar share on every tariff. The bill depends on the price of electricity relative to gas. 71 of the 412 homes were on prepayment meters.",
      "confidence": "high"
    }
  ],
  "method": "We compared smart meter readings for the 12 months before and the 12 months after installation in 412 homes. Readings are adjusted for outdoor temperature using degree days. 64 homes also had heat meters, which measure the heat delivered.",
  "limitations": [
    "There is no comparison group of homes that kept a gas boiler.",
    "One winter of data does not show how performance changes as equipment ages.",
    "Bills use the tariffs in force in March 2024."
  ],
  "sources": ["Smart meter readings", "Heat meter readings", "Installer commissioning records"],
  "period": "October 2022 to March 2024",
  "note": "Illustrative data",
  "type": "report-page"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `summary`, `string | string[]`: One paragraph with the main findings, their numbers and the recommendation. Supports `**bold**`. In the example: text.
- `figures`, `StatRowItem[] | StatRowProps`: Two to four key figures shown under the summary. A list of `{ value, label, context?, delta?, ... }`, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn. In the example: 3 items: an object with `value`, `label`, `context`.
- `findings`, `{ title, exhibit?, observation?, interpretation?, confidence?: "high" | "medium" | "low", caveat?, id? }[]`: Numbered findings. `observation` is what the data shows; `interpretation` is what the authors infer, with an optional confidence rating and caveat. In the example: 3 items: an object with `title`, `exhibit`, `observation`, `interpretation`, `confidence`; an object with `title`, `exhibit`, `observation`, `interpretation`, `confidence`, `caveat`.
- `method`, `string | string[]`: How the analysis was done, as its own section. In the example: text.
- `limitations`, `string[]`: What the analysis cannot show. In the example: 3 items: text; `"Bills use the tariffs in force in March 2024."`.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The report's main finding, as one plain sentence with the number in it. |
| `kicker` | `string` |  | The report series or section, e.g. "Evaluation report · Section 3". |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. |
| `summary` | `string \| string[]` |  | One paragraph with the main findings, their numbers and the recommendation. Supports `**bold**`. |
| `summaryTitle` | `string` | `"Summary"` | Heading of the summary. |
| `figures` | `StatRowItem[] \| StatRowProps` |  | Two to four key figures shown under the summary. A list of `{ value, label, context?, delta?, ... }`, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn. |
| `findings` | `{ title, exhibit?, observation?, interpretation?, confidence?: "high" \| "medium" \| "low", caveat?, id? }[]` |  | Numbered findings. `observation` is what the data shows; `interpretation` is what the authors infer, with an optional confidence rating and caveat. |
| `observationLabel` | `string` | `"What the data shows"` | Label over each observation. |
| `interpretationLabel` | `string` | `"What we think it means"` | Label over each interpretation. |
| `method` | `string \| string[]` |  | How the analysis was done, as its own section. |
| `limitations` | `string[]` |  | What the analysis cannot show. |
| `sources` | `string \| { name, url? } \| (string \| { name, url? })[]` |  | Where the data comes from, shown in the closing source note. Entries with a `url` are linked. |
| `period` | `string` |  | The period the data covers. |
| `note` | `string` |  | Caveats the reader should know, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the piece. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Heading level of the title; section headings follow one level down. |
| `maxWidth` | `number \| string` |  | Widest the piece may get. It is centred in wider containers. |
| `theme` | `ThemeInput` |  | A built-in theme name (`"editorial"`, `"ledger"`, `"noir"`...) or a theme object, passed on to everything inside. A named theme with its own surface paints that surface behind the whole piece. |
| `frame` | `boolean` |  | Paint the theme's surface behind the piece, with page padding. Default: on when `theme` is a named theme with its own surface. Set false when the host already paints it. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to everything inside. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `headline` (atom), `prose` (atom), `stat-row` (molecule), `source-note` (atom), `bar-chart` (atom), `progress-meter` (atom), `line-chart` (atom), `dumbbell-chart` (atom), `histogram` (atom), `diverging-bar-chart` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each chart inside follows the rules of its own component.
- Every chart inside needs its own `title` that states one fact, or a plain label.
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

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/report-page.md
- Component reference with every example: https://insightcharts.dev/llms/report-page.md
- Registry item: https://insightcharts.dev/r/report-page.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/report-page.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/report-page#example-energy-a-field-study-with-a-distribution
- These instructions as plain text: https://insightcharts.dev/agents/templates/report-page/energy-a-field-study-with-a-distribution.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
