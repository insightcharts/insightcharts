# Build a Report page with InsightCharts

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: add a Report page (`report-page`, a template) to the user's project, drawing the user's data. If the user has not given you the data and the one fact to show, ask for both before you write code.

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

## 5. Working example

```tsx
import { BarChart, ProgressMeter, ReportPage } from "insightcharts";

<ReportPage
  theme="paper"
  kicker="Small-group tutoring programme · Year 1 evaluation"
  title="Tutored pupils gained 2.9 more scaled-score points in maths than matched pupils"
  deck="The difference in reading was 0.5 points. 31% of tutored pupils were eligible for free school meals against a funding target of 50%."
  byline="Evaluation team"
  date="2025-02-20"
  summary="Pupils offered tutoring gained **2.9 more scaled-score points in maths** over the year than matched pupils who were not. That is about three months of additional learning. The difference in reading was 0.5 points and could be chance. Pupils who attended fewer than 12 sessions gained less than 1 point over their matches. 58% of pupils attended 12 or more. We recommend continuing the maths strand. Attendance should be the main delivery target. The way pupils are selected should change."
  figures={{
    variant: "tiles",
    items: [
      {
        variant: "comparison",
        value: 8.1,
        comparison: 5.2,
        valueLabel: "Tutored",
        comparisonLabel: "Comparison",
        delta: "+2.9 points",
        format: "decimal:1",
        label: "Mean gain in maths, scaled-score points",
      },
      {
        variant: "ring",
        value: 0.58,
        max: 1,
        format: "percent",
        label: "Tutored pupils attending 12 or more sessions",
        context: "20 sessions were offered",
      },
      {
        variant: "progress",
        value: 0.31,
        max: 1,
        target: 0.5,
        targetLabel: "Funding target",
        format: "percent",
        label: "Tutored pupils eligible for free school meals",
      },
    ],
  }}
  findings={[
    {
      title: "Tutored pupils gained 8.1 points in maths against 5.2 for comparison pupils",
      exhibit: <BarChart
        data={[
          { subject: "Maths", Tutored: 8.1, Comparison: 5.2 },
          { subject: "Reading", Tutored: 5.9, Comparison: 5.4 },
        ]}
        x="subject"
        y={["Tutored", "Comparison"]}
        orientation="horizontal"
        sort="none"
        format="decimal:1"
        subtitle="Mean gain in scaled score, autumn 2023 to summer 2024"
        source="Standardised assessments, 42 schools"
      />,
      observation: "The difference in maths was 2.9 points (95% interval 1.6 to 4.2). In reading tutored pupils gained 5.9 points and comparison pupils 5.4. That difference was 0.5 points (−0.7 to 1.7).",
      interpretation: "The maths difference is unlikely to be chance. Trials of similar programmes found effects of about the same size. We do not conclude that reading tutoring failed, because half the reading tutors were recruited after January.",
      confidence: "medium",
      caveat: "Pupils were matched on prior attainment and background. They were not randomised. Unmeasured differences, such as parental engagement, could account for part of the difference.",
    },
    {
      title: "Pupils who attended 18 or more sessions gained 4.4 points over their matches",
      exhibit: <BarChart
        data={[
          { sessions: "Under 6", effect: 0.2 },
          { sessions: "6–11", effect: 0.9 },
          { sessions: "12–17", effect: 3.1 },
          { sessions: "18+", effect: 4.4 },
        ]}
        x="sessions"
        y="effect"
        orientation="vertical"
        sort="none"
        format={{ signDisplay: "exceptZero", maximumFractionDigits: 1 }}
        height={260}
        subtitle="Maths gain over comparison pupils, scaled-score points, by sessions attended (of 20 offered)"
      />,
      observation: "Pupils who attended fewer than 6 sessions gained 0.2 points more than their matches. Those who attended 6 to 11 gained 0.9 points more. 42% of tutored pupils attended fewer than 12 sessions.",
      interpretation: "A gain that rises with attendance is consistent with a real effect. Pupils who attend more may also differ in ways that raise attainment. The effect of extra sessions is therefore probably smaller than the bars show.",
      confidence: "low",
    },
    {
      title: "31% of tutored pupils were eligible for free school meals against a target of 50%",
      exhibit: <ProgressMeter
        label="Tutored pupils eligible for free school meals"
        value={0.31}
        max={1}
        showMax={false}
        target={0.5}
        targetLabel="Funding target"
        format="percent"
        context="984 of 3,180 pupils. In the same schools, 38% of all pupils are eligible."
      />,
      observation: "984 of the 3,180 tutored pupils were eligible for free school meals. The funding agreement specifies 50%. 38% of all pupils in the participating schools are eligible.",
      interpretation: "Schools selected pupils by teacher nomination. Nomination appears to favour pupils just below the expected standard over the most disadvantaged. The schools have enough eligible pupils to meet the target, so we think the selection rules cause the shortfall.",
      confidence: "high",
    },
  ]}
  method="We compared 3,180 tutored pupils in 42 schools with 3,180 pupils in the same schools and year groups, matched one to one on prior attainment, free-school-meal eligibility, special educational needs and attendance in the previous year. Outcomes are scaled scores on the standardised assessments schools already use. Intervals are 95% and account for clustering by school."
  limitations={[
    "Matching cannot rule out differences we did not measure. A randomised design is planned for year two.",
    "Attendance was recorded by tutors and may be overstated.",
    "One year of outcomes does not show whether the gain lasts.",
  ]}
  sources={["School assessment returns", "Tutor session logs", "National pupil database extract"]}
  period="September 2023 to July 2024"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "type": "report-page",
  "theme": "paper",
  "kicker": "Small-group tutoring programme · Year 1 evaluation",
  "title": "Tutored pupils gained 2.9 more scaled-score points in maths than matched pupils",
  "deck": "The difference in reading was 0.5 points. 31% of tutored pupils were eligible for free school meals against a funding target of 50%.",
  "byline": "Evaluation team",
  "date": "2025-02-20",
  "summary": "Pupils offered tutoring gained **2.9 more scaled-score points in maths** over the year than matched pupils who were not. That is about three months of additional learning. The difference in reading was 0.5 points and could be chance. Pupils who attended fewer than 12 sessions gained less than 1 point over their matches. 58% of pupils attended 12 or more. We recommend continuing the maths strand. Attendance should be the main delivery target. The way pupils are selected should change.",
  "figures": {
    "variant": "tiles",
    "items": [
      {
        "variant": "comparison",
        "value": 8.1,
        "comparison": 5.2,
        "valueLabel": "Tutored",
        "comparisonLabel": "Comparison",
        "delta": "+2.9 points",
        "format": "decimal:1",
        "label": "Mean gain in maths, scaled-score points"
      },
      {
        "variant": "ring",
        "value": 0.58,
        "max": 1,
        "format": "percent",
        "label": "Tutored pupils attending 12 or more sessions",
        "context": "20 sessions were offered"
      },
      {
        "variant": "progress",
        "value": 0.31,
        "max": 1,
        "target": 0.5,
        "targetLabel": "Funding target",
        "format": "percent",
        "label": "Tutored pupils eligible for free school meals"
      }
    ]
  },
  "findings": [
    {
      "title": "Tutored pupils gained 8.1 points in maths against 5.2 for comparison pupils",
      "exhibit": {
        "type": "bar-chart",
        "data": [
          { "subject": "Maths", "Tutored": 8.1, "Comparison": 5.2 },
          { "subject": "Reading", "Tutored": 5.9, "Comparison": 5.4 }
        ],
        "x": "subject",
        "y": ["Tutored", "Comparison"],
        "orientation": "horizontal",
        "sort": "none",
        "format": "decimal:1",
        "subtitle": "Mean gain in scaled score, autumn 2023 to summer 2024",
        "source": "Standardised assessments, 42 schools"
      },
      "observation": "The difference in maths was 2.9 points (95% interval 1.6 to 4.2). In reading tutored pupils gained 5.9 points and comparison pupils 5.4. That difference was 0.5 points (−0.7 to 1.7).",
      "interpretation": "The maths difference is unlikely to be chance. Trials of similar programmes found effects of about the same size. We do not conclude that reading tutoring failed, because half the reading tutors were recruited after January.",
      "confidence": "medium",
      "caveat": "Pupils were matched on prior attainment and background. They were not randomised. Unmeasured differences, such as parental engagement, could account for part of the difference."
    },
    {
      "title": "Pupils who attended 18 or more sessions gained 4.4 points over their matches",
      "exhibit": {
        "type": "bar-chart",
        "data": [
          { "sessions": "Under 6", "effect": 0.2 },
          { "sessions": "6–11", "effect": 0.9 },
          { "sessions": "12–17", "effect": 3.1 },
          { "sessions": "18+", "effect": 4.4 }
        ],
        "x": "sessions",
        "y": "effect",
        "orientation": "vertical",
        "sort": "none",
        "format": { "signDisplay": "exceptZero", "maximumFractionDigits": 1 },
        "height": 260,
        "subtitle": "Maths gain over comparison pupils, scaled-score points, by sessions attended (of 20 offered)"
      },
      "observation": "Pupils who attended fewer than 6 sessions gained 0.2 points more than their matches. Those who attended 6 to 11 gained 0.9 points more. 42% of tutored pupils attended fewer than 12 sessions.",
      "interpretation": "A gain that rises with attendance is consistent with a real effect. Pupils who attend more may also differ in ways that raise attainment. The effect of extra sessions is therefore probably smaller than the bars show.",
      "confidence": "low"
    },
    {
      "title": "31% of tutored pupils were eligible for free school meals against a target of 50%",
      "exhibit": {
        "type": "progress-meter",
        "label": "Tutored pupils eligible for free school meals",
        "value": 0.31,
        "max": 1,
        "showMax": false,
        "target": 0.5,
        "targetLabel": "Funding target",
        "format": "percent",
        "context": "984 of 3,180 pupils. In the same schools, 38% of all pupils are eligible."
      },
      "observation": "984 of the 3,180 tutored pupils were eligible for free school meals. The funding agreement specifies 50%. 38% of all pupils in the participating schools are eligible.",
      "interpretation": "Schools selected pupils by teacher nomination. Nomination appears to favour pupils just below the expected standard over the most disadvantaged. The schools have enough eligible pupils to meet the target, so we think the selection rules cause the shortfall.",
      "confidence": "high"
    }
  ],
  "method": "We compared 3,180 tutored pupils in 42 schools with 3,180 pupils in the same schools and year groups, matched one to one on prior attainment, free-school-meal eligibility, special educational needs and attendance in the previous year. Outcomes are scaled scores on the standardised assessments schools already use. Intervals are 95% and account for clustering by school.",
  "limitations": [
    "Matching cannot rule out differences we did not measure. A randomised design is planned for year two.",
    "Attendance was recorded by tutors and may be overstated.",
    "One year of outcomes does not show whether the gain lasts."
  ],
  "sources": ["School assessment returns", "Tutor session logs", "National pupil database extract"],
  "period": "September 2023 to July 2024",
  "note": "Illustrative data"
}
```

This example sets `theme="paper"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `summary`, `string | string[]`: One paragraph with the main findings, their numbers and the recommendation. Supports `**bold**`. In the example: text.
- `figures`, `StatRowItem[] | StatRowProps`: Two to four key figures shown under the summary. A list of `{ value, label, context?, delta?, ... }`, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn. In the example: an object with `variant`, `items`.
- `findings`, `{ title, exhibit?, observation?, interpretation?, confidence?: "high" | "medium" | "low", caveat?, id? }[]`: Numbered findings. `observation` is what the data shows; `interpretation` is what the authors infer, with an optional confidence rating and caveat. In the example: 3 items: an object with `title`, `exhibit`, `observation`, `interpretation`, `confidence`, `caveat`; an object with `title`, `exhibit`, `observation`, `interpretation`, `confidence`.
- `method`, `string | string[]`: How the analysis was done, as its own section. In the example: text.
- `limitations`, `string[]`: What the analysis cannot show. In the example: 3 items: text; `"Attendance was recorded by tutors and may be overstated."`; `"One year of outcomes does not show whether the gain lasts."`.

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

- Component reference with every example: https://insightcharts.dev/llms/report-page.md
- Registry item: https://insightcharts.dev/r/report-page.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/report-page.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/report-page
- These instructions as plain text: https://insightcharts.dev/agents/templates/report-page.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
