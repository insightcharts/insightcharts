---
title: Add a title, a highlight and annotations to a chart
goal: The chart has a title that states one fact with its number, the entity in the title is highlighted, and at most three annotations mark what the reader needs.
llms: choosing-a-form
---
Give an existing or new chart its emphasis: the title, the highlight and the annotations. If you do not know which fact the user wants the chart to show, ask. Take every number from the data.

## Steps

1. Read the rows and work out the fact: the value, the entity and the period. Write it as `title`.
2. Write `subtitle` (measure, unit, population, period) and `source`.
3. Set `highlight` to the entity the title is about.
4. Add an annotation only for a date, a threshold or one value that the title or the reader needs. Use one or two. Three is the limit.
5. Render and check that annotation values match values on the axes.

## Writing the title and all other text

These rules apply to `title`, `subtitle`, callouts, annotation labels and story steps.

{{WRITING_RULES}}

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
