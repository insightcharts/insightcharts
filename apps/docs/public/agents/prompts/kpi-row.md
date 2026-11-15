# Build a row of key numbers

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Fill in these lines, then follow the steps.

```text
Figures: <the numbers and their labels, or the path to a table with one row per period and one column per metric>
Comparison: <what each number is compared with, for example "the previous month" or "the same month last year">
Period: <the period the figures cover>
Source of the data: <name of the source>
Where to put it: <the page or component file, or leave blank and ask>
```

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Steps

1. Check the project and install the package as described under "Before you start".
2. Choose the component.
   - Two to five figures with no history behind them: `stat-row`.
   - Three to eight metrics from one table with a row per period: `kpi-grid`. It computes each value, change and trend from the rows.
   - One lead number: `big-number` with `size="hero"`.
3. Fetch the instructions: `https://insightcharts.dev/agents/molecules/stat-row.md` or `https://insightcharts.dev/agents/molecules/kpi-grid.md`.
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

## Reference

- These instructions as plain text: https://insightcharts.dev/agents/prompts/kpi-row.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
