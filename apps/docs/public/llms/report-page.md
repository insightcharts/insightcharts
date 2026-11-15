# Report page (`report-page`)

> A section of an analytical report laid out as a document. It has a title block, a summary, numbered findings, then method, limitations and sources. Each finding has one exhibit, an observation and a separately labelled interpretation with a confidence rating and a caveat.

- Component: `ReportPage` (import from `insightcharts`)
- Spec type: `"report-page"`
- Level: template. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it for readers who will check the reasoning, as in evaluations, research notes, audits and experiment write-ups. State the main finding with its number in the title. Put all the main findings and the recommendation in the summary. Write each finding title as one fact with its number, and give it an exhibit that shows that fact. Put what the data shows in `observation` and what you infer from it in `interpretation`. End with method, limitations and sources.

## Avoid

A decision-maker who wants only the result (use `executive-brief`). A general audience (use `explainer` or `visual-essay`). Findings without an exhibit. Put those in the summary.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/report-page
```

The file lands at `components/insightcharts/templates/report-page.tsx`. `@insightcharts/report-page-demo` adds a ready-made example next to it.

## Usage

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

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

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

## Composition

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [prose](https://insightcharts.dev/llms/prose.md), [stat-row](https://insightcharts.dev/llms/stat-row.md), [source-note](https://insightcharts.dev/llms/source-note.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [progress-meter](https://insightcharts.dev/llms/progress-meter.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [dumbbell-chart](https://insightcharts.dev/llms/dumbbell-chart.md), [histogram](https://insightcharts.dev/llms/histogram.md), [diverging-bar-chart](https://insightcharts.dev/llms/diverging-bar-chart.md)
- Used by: no molecule or template yet

## More examples

### Product analytics: an experiment write-up

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

### Energy: a field study with a distribution

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

## Links

- Registry item: https://insightcharts.dev/r/report-page.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/report-page.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
