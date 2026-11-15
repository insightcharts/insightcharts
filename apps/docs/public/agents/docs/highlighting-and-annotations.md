# Add a title, a highlight and annotations to a chart

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: The chart has a title that states one fact with its number, the entity in the title is highlighted, and at most three annotations mark what the reader needs.

Give an existing or new chart its emphasis: the title, the highlight and the annotations. If you do not know which fact the user wants the chart to show, ask. Take every number from the data.

## Steps

1. Read the rows and work out the fact: the value, the entity and the period. Write it as `title`.
2. Write `subtitle` (measure, unit, population, period) and `source`.
3. Set `highlight` to the entity the title is about.
4. Add an annotation only for a date, a threshold or one value that the title or the reader needs. Use one or two. Three is the limit.
5. Render and check that annotation values match values on the axes.

## Writing the title and all other text

These rules apply to `title`, `subtitle`, callouts, annotation labels and story steps.

These apply to chart titles, subtitles, decks, callouts, story steps, prose, docs headings and descriptions. They are hard requirements.

Write one plain statement of fact, the way a person would say it out loud, with the real numbers and the period in it.

| Write this | Not this |
|---|---|
| Monthly churn fell from 4.2% to 2.1% in 2024 | Churn halved after the March onboarding revamp, and the gain has held for six months |
| Renewables supplied 98% of Norway's electricity in 2023 | Norway runs almost entirely on renewable electricity |
| Acme had 266 active teams in December 2024, 2.4 times Globex | Acme pulled away from the pack in late 2023 |
| Solar's share rose from 2.7% to 5.5% between 2019 and 2023 | Solar is closing the gap with wind |
| Households wasted 631 million tonnes of food in 2022 | It is not a rich-country habit |

- One clause. No second half joined with a comma, "and", "but", "while", "yet", a semicolon, a colon or a dash that adds a twist, a consequence or a follow-up. If there are two facts, write two sentences or put the second in the subtitle.
- Put the number in. "Fell from 4.2% to 2.1%", not "halved"; "98%", not "almost entirely"; "3 of 12", not "a handful".
- No metaphor, idiom or figure of speech: no "pulled away from the pack", "closing the gap", "sea of grey", "tells the story", "the long tail", "did the work".
- No teasing or alluding to something the reader has to work out: no "one hospital explains most of it", "the next gain is elsewhere", "here is where it goes".
- No dramatic verbs (soared, plunged, surged, skyrocketed, slashed) and no staged contrast ("not X, but Y"; "it's not just X").
- No rhetorical questions, no groups of three for rhythm, no sign-off lines.
- A plain label is always acceptable when there is no single fact to state: "Monthly churn, 2024".
- Subtitles name the measure, unit, population and period. Sources name the source.

## Highlight

- `highlight` takes a string or an array of strings.
- On a multi-series chart it names a series: a field name in wide data (`y={["Acme", "Globex"]}`), or a value of the `series` field in long data.
- On a single-series bar chart it names a category: a value of the `x` field.
- The first highlighted entity takes the theme's `accent`. Further ones take the next categorical colours, in the order listed. Every other series is drawn in the `context` grey.
- Without `highlight`, a single series draws in the accent and several series take the categorical colours in a stable order.
- Do not set colours per series. Highlight one or two entities.

## Annotations

`annotations` is an array of plain objects in data coordinates. They stay in place when the chart is resized.

| `type` | Fields | Use it for |
|---|---|---|
| `"line"` | `axis` (`"x"` or `"y"`), `value`, `label?`, `dashed?`, `emphasis?` | A target, an average, the date of an event. Dashed by default. `dashed: false` draws it solid. `emphasis: true` draws it in ink. |
| `"band"` | `axis`, `from`, `to`, `label?` | A shaded range: an outage, a target zone. |
| `"point"` | `x`, `y`, `label`, `position?`, `dot?` | A callout on one data point. `position` is `"top"` (default), `"bottom"`, `"left"` or `"right"`. `dot: false` hides the marker. `\n` in `label` breaks the line. |

- A value on a category axis is a category name exactly as it appears in the data. A value on a time axis is an ISO date.
- Annotations attach to the chart's first cartesian series. They apply to charts with x and y axes.
- Labels are plain: name the event or give the value.

## Minimal example

```tsx
import { LineChart } from "insightcharts";

const data = [
  { date: "2024-04-01", signups: 298 },
  { date: "2024-05-01", signups: 285 },
  { date: "2024-06-01", signups: 352 },
  { date: "2024-07-01", signups: 418 },
  { date: "2024-08-01", signups: 467 },
  { date: "2024-09-01", signups: 512 },
];

export function Signups() {
  return (
    <LineChart
      data={data}
      x="date"
      y="signups"
      title="Monthly signups rose from 285 in May to 512 in September 2024"
      subtitle="New accounts per month, 2024"
      source="Product analytics"
      annotations={[
        { type: "line", axis: "x", value: "2024-06-01", label: "New pricing page" },
        { type: "line", axis: "y", value: 400, label: "Target" },
        { type: "point", x: "2024-09-01", y: 512, label: "512 in\nSeptember", position: "left" },
      ]}
    />
  );
}
```

A highlight on a multi-series chart: `<LineChart data={rows} x="month" y={["Acme", "Globex", "Initech"]} highlight="Acme" ... />`.

## Verify

1. The title is one clause with a number and a period, or a plain label.
2. Every number in the title, subtitle and labels can be found in or computed from the data.
3. One or two series are in colour. The rest are grey.
4. Each annotation is drawn where its value is on the axis, and no label overlaps a line end or another label at about 380px wide.
5. The chart reads without hovering.

## Common mistakes

- A `highlight` value that does not match a series key or category exactly. Every series is then drawn in grey.
- An annotation `value` that is not on the axis: "June" when the data has "2024-06-01".
- More than three annotations.
- A title that names a cause the data does not show.
- "Halved", "almost all", "soared" in place of the numbers.
- A legend kept on when the lines are already labelled at their ends.

## Reference

- The long guide on this topic: https://insightcharts.dev/llms/guides/choosing-a-form.md
- This page: https://insightcharts.dev/docs/highlighting-and-annotations
- These instructions as plain text: https://insightcharts.dev/agents/docs/highlighting-and-annotations.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
