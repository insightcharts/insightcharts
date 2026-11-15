# Build a scroll story like the ones in the gallery

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: A scroll story in the user's project that pins one chart and changes one prop at every step, modelled on a story from the gallery.

Build a scroll story with `Scrolly` in the user's project, using one of the gallery's stories as the model. If the user has not said which story to follow, which data to use and which facts the steps should state, ask.

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## The stories in the gallery

Each one pins a single chart and changes one prop per step. Pick the one whose chart form fits the user's data.

- Regroup and recolour dots. Form: Beeswarm chart (https://insightcharts.dev/agents/atoms/beeswarm-chart.md). Theme: `dusk`. Steps: A median line, then three rows, then a colour per row, then one row highlighted.
- Build up a line chart. Form: Line chart (https://insightcharts.dev/agents/atoms/line-chart.md). Theme: `ledger`. Steps: Three more series, then a highlight, then two annotations, then a shorter time axis.
- Re-sort and restack bars. Form: Bar chart (https://insightcharts.dev/agents/atoms/bar-chart.md). Theme: `editorial`. Steps: A sort, then a split into stacked series, then shares of 100%, then one series highlighted.
- Resize and refocus a treemap. Form: Treemap (https://insightcharts.dev/agents/atoms/treemap.md). Theme: `forest`. Steps: A later year's values, then one group highlighted, then one block highlighted.
- Grow a ribbon chart by period. Form: Ribbon chart (https://insightcharts.dev/agents/atoms/ribbon-chart.md). Theme: `magenta`. Steps: One more period at each step.

## Steps

1. Pick the chart form. Per-component instructions are at `https://insightcharts.dev/agents/atoms/<name>.md`, for example https://insightcharts.dev/agents/atoms/bar-chart.md.
2. Write down the sequence of facts, one per step, each with its number from the data.
3. For each step, decide the one chart prop that changes: `y`, `sort`, `stack`, `highlight`, `annotations`, `group` or the `data` itself.
4. Write the steps array: `{ id, content, ...the props that change }`.
5. Create a `"use client"` file and render `Scrolly` with a function child that returns the same chart at every step.
6. Give the chart a `theme` name if the story should have its own look. Preset themes: `insight`, `shadcn`, `editorial`, `ledger`, `mono`, `earth`, `science`, `poster`. Poster themes: `noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`. A named theme paints its own background behind the chart.
7. Set `stickyTop` to the height of the page's sticky header. Set `stepHeight` to about `"75vh"`.
8. Confirm no ancestor of the story sets `overflow: hidden`, `auto` or `scroll`.

## Minimal example

This follows the gallery's bar chart story: a sort, then a split into stacked series, then shares of 100%, then one series highlighted.

```tsx
"use client";

import { BarChart, Scrolly } from "insightcharts";

const visits = [
  { museum: "Design", Adult: 420, Child: 60, Member: 150 },
  { museum: "Modern art", Adult: 640, Child: 90, Member: 230 },
  { museum: "Natural history", Adult: 520, Child: 610, Member: 120 },
  { museum: "Science", Adult: 390, Child: 540, Member: 90 },
].map((m) => ({ ...m, Total: m.Adult + m.Child + m.Member }));

const TICKETS = ["Adult", "Child", "Member"];

type Step = { id: string; content: string; y: string[]; sort?: "desc"; stack?: boolean | "percent"; highlight?: string };

const steps: Step[] = [
  { id: "names", y: ["Total"], content: "Four museums in alphabetical order. Together they had 3.86 million visits in 2024." },
  { id: "sorted", y: ["Total"], sort: "desc", content: "The same bars from largest to smallest. Natural history had 1.25 million visits." },
  { id: "split", y: TICKETS, sort: "desc", stack: true, content: "Each bar split by ticket. Adults made 1.97 million of the visits." },
  { id: "share", y: TICKETS, sort: "desc", stack: "percent", content: "Every bar stretched to 100%. Children made 49% of the visits to Natural history." },
  { id: "child", y: TICKETS, sort: "desc", stack: "percent", highlight: "Child", content: "Child tickets in colour. They were 10% of visits to Design and 53% of visits to Science." },
];

export function MuseumStory() {
  return (
    <Scrolly steps={steps} stickyTop={56} stepHeight="75vh">
      {({ step }) => (
        <BarChart
          data={visits}
          x="museum"
          y={step.y}
          sort={step.sort ?? "none"}
          stack={step.stack ?? false}
          highlight={step.highlight}
          orientation="horizontal"
          theme="editorial"
          height={380}
          title="Visits to four museums in 2024"
          subtitle="Thousands of visits by ticket type"
          note="Illustrative data"
        />
      )}
    </Scrolly>
  );
}
```

## Scrolly props you will use

- `steps`: the array. `content` is required on each step.
- `children`: `({ step, index, count, progress }) => ReactNode`.
- `mode`: `"auto"` (default), `"scroll"`, `"swipe"` or `"steps"`. Use `"steps"` where there is no room to scroll.
- `side`: `"left"` (default) or `"right"`, the side of the text in scroll mode.
- `stickyTop`, `stepHeight`: where the chart pins and how far each step scrolls. Defaults `0` and `"80vh"`.
- `index`, `onStepChange`: control or observe the active step.
- `theme`, `colorMode`: the theme and the colour mode of the step cards.

## Writing the steps

- One or two plain sentences per step that state what the chart shows at that step, with the number.
- Every number comes from the rows. Recompute them when you replace the data.
- No metaphors, no dramatic verbs, no questions.

## Verify

1. Typecheck.
2. Scroll through every step in a browser. Each step must animate from the one before. Replace any step that redraws without animation.
3. Confirm the chart pins under the header and releases after the last step.
4. Check at about 380px wide. The text cards pass over the chart at that width and must not hide the marks the step is about.
5. Check dark mode. A chart with a named theme keeps that theme's own background.
6. Check every number in the step text against the data.

## Common mistakes

- Copying the gallery's step text with the user's data. The numbers must be recomputed.
- Returning a different component at some step.
- Changing two props in one step.
- A missing `"use client"` directive in Next.js.
- An ancestor that clips overflow, which stops the chart from pinning.

## Reference

- The long guide on this topic: https://insightcharts.dev/llms/guides/stories.md
- This page: https://insightcharts.dev/stories
- These instructions as plain text: https://insightcharts.dev/agents/stories.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
