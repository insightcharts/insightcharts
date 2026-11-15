---
title: Build a row of key numbers
description: Renders two to eight key figures with their changes as a stat row or a KPI grid.
order: 2
---

Fill in these lines, then follow the steps.

```text
Figures: <the numbers and their labels, or the path to a table with one row per period and one column per metric>
Comparison: <what each number is compared with, for example "the previous month" or "the same month last year">
Period: <the period the figures cover>
Source of the data: <name of the source>
Where to put it: <the page or component file, or leave blank and ask>
```

## Before you start

{{DETECT}}

## Steps

1. Check the project and install the package as described under "Before you start".
2. Choose the component.
   - Two to five figures with no history behind them: `stat-row`.
   - Three to eight metrics from one table with a row per period: `kpi-grid`. It computes each value, change and trend from the rows.
   - One lead number: `big-number` with `size="hero"`.
3. Fetch the instructions: `{{SITE_URL}}/agents/molecules/stat-row.md` or `{{SITE_URL}}/agents/molecules/kpi-grid.md`.
4. For `stat-row`, write `items`, most important first. Each item takes `value`, `label`, and `context` or `delta` with `deltaLabel`.
   - A numeric `delta` is a fraction shown as a signed percentage: `0.12` prints as +12%. Pass a string such as `"+1.9 pts"` to print it as written.
   - Set `upIsGood: false` on a figure where a fall is the good direction.
   - Set `format` per item, or once on the row.
   - Give every figure a `delta` or a `context` line.
5. For `kpi-grid`, pass the table as `data`, the period column as `x`, and one entry per metric in `metrics`: `{ y, label, format, upIsGood }`.
   - `compare` sets the baseline of every change: `"first"`, `"previous"` or a row index.
   - `change` is `"percent"` or `"absolute"`. Use `"absolute"` for a metric that is already a percentage.
6. Write `title` as the main fact with its number and period, in one clause. Write `subtitle` as the population and period the figures share. Set `source`.
7. Leave `variant` at its default unless the user asks for cards. `variant="tiles"` draws bordered cards.
8. Render it at the top of the page the user named.

## Example of the result

```tsx
import { StatRow } from "insightcharts";

export function EnergyFigures() {
  return (
    <StatRow
      title="Renewables supplied 31.7% of the world's electricity in 2024"
      subtitle="Global electricity generation, 2024"
      items={[
        { value: 0.317, format: "percent", label: "Share from renewables", delta: "+1.9 pts", deltaLabel: "vs 2023" },
        { value: 2131, label: "Solar generation, TWh", delta: 0.29, deltaLabel: "vs 2023" },
        { value: 2494, label: "Wind generation, TWh", delta: 0.079, deltaLabel: "vs 2023" },
      ]}
      source="Ember"
    />
  );
}
```

## Verify

- The typecheck passes.
- Every figure has a label with its unit and a comparison, a denominator or a period.
- Every number and every change matches the data.
- A fall that is good news is not drawn as bad: `upIsGood` is set.
- The row wraps without clipped text at about 380 pixels wide.
- `source` is set.
