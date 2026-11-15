# Reproduce the "Product analytics: an experiment write-up" example of the InsightCharts Report page

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Product analytics: an experiment write-up" example of `report-page` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

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

## 5. The "Product analytics: an experiment write-up" example

This example sets `theme="mono"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BarChart, LineChart, ReportPage } from "insightcharts";

<ReportPage
  theme="mono"
  kicker="Experiment PRC-114 · pricing page"
  title="The annual-first pricing page converted 3.4% of visitors against 3.1% for the control"
  byline="Growth analytics"
  date="2025-05-06"
  summary="Over six weeks the annual-first pricing page converted **3.4% of visitors**. The control converted 3.1%. 52% of new customers on the annual-first page chose annual billing, against 29% in the control. We recommend shipping the annual-first page. Track refund requests for two more months before counting the revenue."
  findings={[
    {
      title: "The annual-first page converted more visitors than the control in weeks 2 to 6",
      exhibit: <LineChart
        data={[
          { week: "Week 1", Control: 3.1, "Annual-first": 3 },
          { week: "Week 2", Control: 3.2, "Annual-first": 3.3 },
          { week: "Week 3", Control: 3, "Annual-first": 3.4 },
          { week: "Week 4", Control: 3.1, "Annual-first": 3.5 },
          { week: "Week 5", Control: 3.2, "Annual-first": 3.5 },
          { week: "Week 6", Control: 3.1, "Annual-first": 3.6 },
        ]}
        x="week"
        y={["Annual-first", "Control"]}
        highlight="Annual-first"
        format="{value}%"
        height={260}
        subtitle="Share of pricing-page visitors starting a paid plan, by week of first visit"
      />,
      observation: "The six-week mean was 3.38% for the annual-first page and 3.12% for the control. That is a relative lift of 8.5%. Each arm had 61,000 visitors.",
      interpretation: "The difference did not shrink after week 2, so we do not think it is a novelty effect. We are confident the annual-first page converts better. We are less sure of the size of the lift.",
      confidence: "high",
    },
    {
      title: "52% of new customers on the annual-first page chose annual billing",
      exhibit: <BarChart
        data={[
          { arm: "Control", Monthly: 71, Annual: 29 },
          { arm: "Annual-first", Monthly: 48, Annual: 52 },
        ]}
        x="arm"
        y={["Monthly", "Annual"]}
        stack="percent"
        orientation="horizontal"
        sort="none"
        highlight="Annual"
        format="{value}%"
        subtitle="Billing period chosen by new paying customers"
      />,
      observation: "52% of new customers in the annual-first arm chose annual billing. In the control 29% did.",
      interpretation: "More cash is collected up front. Annual customers who would have cancelled a monthly plan may ask for a refund instead. The effect on revenue will not be known until the 60-day refund window closes.",
      confidence: "medium",
      caveat: "Refunds within 60 days are not yet observable for weeks four to six.",
    },
  ]}
  method="Visitors were assigned at random by account cookie, 50/50, from 17 March to 27 April 2025. The primary metric, paid conversion within seven days, was registered before launch."
  limitations={[
    "Enterprise leads, who do not use the pricing page, are excluded.",
    "The test ran outside the January budget season, when annual plans usually sell better.",
  ]}
  sources={["Experiment platform", "Billing system"]}
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "mono",
  "kicker": "Experiment PRC-114 · pricing page",
  "title": "The annual-first pricing page converted 3.4% of visitors against 3.1% for the control",
  "byline": "Growth analytics",
  "date": "2025-05-06",
  "summary": "Over six weeks the annual-first pricing page converted **3.4% of visitors**. The control converted 3.1%. 52% of new customers on the annual-first page chose annual billing, against 29% in the control. We recommend shipping the annual-first page. Track refund requests for two more months before counting the revenue.",
  "findings": [
    {
      "title": "The annual-first page converted more visitors than the control in weeks 2 to 6",
      "exhibit": {
        "type": "line-chart",
        "data": [
          { "week": "Week 1", "Control": 3.1, "Annual-first": 3 },
          { "week": "Week 2", "Control": 3.2, "Annual-first": 3.3 },
          { "week": "Week 3", "Control": 3, "Annual-first": 3.4 },
          { "week": "Week 4", "Control": 3.1, "Annual-first": 3.5 },
          { "week": "Week 5", "Control": 3.2, "Annual-first": 3.5 },
          { "week": "Week 6", "Control": 3.1, "Annual-first": 3.6 }
        ],
        "x": "week",
        "y": ["Annual-first", "Control"],
        "highlight": "Annual-first",
        "format": "{value}%",
        "height": 260,
        "subtitle": "Share of pricing-page visitors starting a paid plan, by week of first visit"
      },
      "observation": "The six-week mean was 3.38% for the annual-first page and 3.12% for the control. That is a relative lift of 8.5%. Each arm had 61,000 visitors.",
      "interpretation": "The difference did not shrink after week 2, so we do not think it is a novelty effect. We are confident the annual-first page converts better. We are less sure of the size of the lift.",
      "confidence": "high"
    },
    {
      "title": "52% of new customers on the annual-first page chose annual billing",
      "exhibit": {
        "type": "bar-chart",
        "data": [
          { "arm": "Control", "Monthly": 71, "Annual": 29 },
          { "arm": "Annual-first", "Monthly": 48, "Annual": 52 }
        ],
        "x": "arm",
        "y": ["Monthly", "Annual"],
        "stack": "percent",
        "orientation": "horizontal",
        "sort": "none",
        "highlight": "Annual",
        "format": "{value}%",
        "subtitle": "Billing period chosen by new paying customers"
      },
      "observation": "52% of new customers in the annual-first arm chose annual billing. In the control 29% did.",
      "interpretation": "More cash is collected up front. Annual customers who would have cancelled a monthly plan may ask for a refund instead. The effect on revenue will not be known until the 60-day refund window closes.",
      "confidence": "medium",
      "caveat": "Refunds within 60 days are not yet observable for weeks four to six."
    }
  ],
  "method": "Visitors were assigned at random by account cookie, 50/50, from 17 March to 27 April 2025. The primary metric, paid conversion within seven days, was registered before launch.",
  "limitations": [
    "Enterprise leads, who do not use the pricing page, are excluded.",
    "The test ran outside the January budget season, when annual plans usually sell better."
  ],
  "sources": ["Experiment platform", "Billing system"],
  "note": "Illustrative data",
  "type": "report-page"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `summary`, `string | string[]`: One paragraph with the main findings, their numbers and the recommendation. Supports `**bold**`. In the example: text.
- `figures`, `StatRowItem[] | StatRowProps`: Two to four key figures shown under the summary. A list of `{ value, label, context?, delta?, ... }`, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn. Not used in the example.
- `findings`, `{ title, exhibit?, observation?, interpretation?, confidence?: "high" | "medium" | "low", caveat?, id? }[]`: Numbered findings. `observation` is what the data shows; `interpretation` is what the authors infer, with an optional confidence rating and caveat. In the example: 2 items: an object with `title`, `exhibit`, `observation`, `interpretation`, `confidence`; an object with `title`, `exhibit`, `observation`, `interpretation`, `confidence`, `caveat`.
- `method`, `string | string[]`: How the analysis was done, as its own section. In the example: text.
- `limitations`, `string[]`: What the analysis cannot show. In the example: 2 items: text.

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
- This page: https://insightcharts.dev/templates/report-page#example-product-analytics-an-experiment-write-up
- These instructions as plain text: https://insightcharts.dev/agents/templates/report-page/product-analytics-an-experiment-write-up.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
