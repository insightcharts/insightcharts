---
title: Draw one chart from a CSV file
description: Loads a CSV file, chooses a chart form, and renders one chart with a title that states one fact from the data.
order: 1
---

Fill in these lines, then follow the steps.

```text
Data: <path or URL of the CSV file, or paste the CSV text here>
Fact to show: <one sentence, or leave blank and propose one from the data>
Where to put it: <the page or component file, or leave blank and ask>
Source of the data: <name of the source>
```

## Before you start

{{DETECT}}

## Steps

1. Check the project and install the package as described under "Before you start".
2. Read the CSV. List the columns, their units, the period covered and the number of rows. If a column you need is missing, stop and tell the user.
3. Decide the fact. If "Fact to show" is blank, compute two or three candidate facts from the rows, each with its number and period, and ask the user to pick one.
4. Choose the form from the job of the data.
   - A ranking or a comparison of categories: `bar-chart`.
   - A change over time with five or more points: `line-chart`.
   - Two time points for several entities: `slope-chart`.
   - One share of a whole: `waffle-chart`.
   - A relationship between two measures: `scatter-chart`.
   - One number: `big-number`.
   For any other job, read `{{SITE_URL}}/agents/atoms.md` and choose from its decision table.
5. Fetch the instructions for the chosen component at `{{SITE_URL}}/agents/atoms/<name>.md` and use only the props it lists.
6. Load the data. Use one of these.
   - A file the browser can fetch: put it in the project's public folder and pass its URL, `data="/data/file.csv"`.
   - Next.js server component: `const rows = await loadData(url)` with `loadData` from `insightcharts/data`, then `data={rows}`.
   - A small file: paste the CSV text as a string into `data`.
7. Reshape with `transform` when the rows are not ready to draw. Use `filter` to keep a subset, `aggregate` with `groupBy` and `measures` to sum by category, `sort` to order, `top` with `n`, `by`, `other` and `label` to keep the largest and fold the rest into one row, and `parse` to coerce text columns to numbers or dates.
8. Name the fields as strings: `x`, `y`, and `series` for long data. For wide data pass several columns as `y`.
9. Set `format` so values print with their unit: `"compact"`, `"percent"` for ratios, `"percent-raw"` for whole percentages, `"currency:USD"`, or a template such as `"{value} kg"`.
10. Write the text.
    - `title`: the fact, in one clause, with its number and period. No metaphor, no dramatic verb, no second half after a comma or a dash.
    - `subtitle`: the measure, the unit, the population and the period.
    - `source`: the source named above.
11. Set `highlight` to the entity the title names. Do not set a colour per series.
12. Add at most three `annotations` when a date, a threshold or one value needs a mark.
13. Render the chart where the user asked. In Next.js add `"use client"` to the file only when the chart takes a function prop.

## Example of the result

```tsx
import { BarChart } from "insightcharts";

export function GenerationBySource() {
  return (
    <BarChart
      data="/data/energy.csv"
      transform={[
        { type: "filter", field: "year", value: 2024 },
        { type: "aggregate", groupBy: "source", measures: { twh: { op: "sum", field: "twh" } } },
        { type: "sort", by: "twh", order: "desc" },
      ]}
      x="source"
      y="twh"
      format="compact"
      highlight="Hydro"
      title="Hydro generated 3,900 TWh in 2024"
      subtitle="Renewable electricity generation by source, TWh, 2024"
      source="Ember"
    />
  );
}
```

## Verify

- The typecheck passes.
- The chart renders with no console error and no "No data to show." message.
- The number in the title matches the rows.
- No label is clipped or overlapping at desktop width and at about 380 pixels wide.
- The chart is legible in dark mode.
- `source` is set.
