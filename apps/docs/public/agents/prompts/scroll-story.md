# Build a scroll story

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Fill in these lines, then follow the steps.

```text
Data: <path to the data, or paste it here>
Story: <the three to seven points to make, in order, or leave blank and propose them from the data>
Mode: <scroll, steps or swipe; leave blank for auto>
Source of the data: <name of the source>
Where to put it: <the route or component file, or leave blank and ask>
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
   - From JSX, with full control of the graphic: `Scrolly` from `insightcharts`. Its child is a function, so the file needs `"use client"` in Next.js.
   - From JSON, with one chart: the `scrolly-chart` molecule. Fetch `https://insightcharts.dev/agents/molecules/scrolly-chart.md`.
3. Choose one chart form for the whole story and keep it mounted at every step. Swapping to another component remounts the chart and loses the animation.
4. Plan the steps. Each step changes exactly one thing: the highlight, the data, an annotation or the encoding. Use three to seven steps.
5. Write each step's text as one or two plain sentences that state what the chart shows at that step, with the number from the data.
6. With `Scrolly`: write `steps` as objects with `content`, an `id`, and your own keys for the chart state. Render the chart in the child function from `step`.
7. With `scrolly-chart`: write `chart` as the base spec and `steps` as `{ content, ...chart props }`. Each step's props are merged over `chart`. Set `cumulative: true` to build each step on the previous ones.
8. Set the mode. `Scrolly` takes `mode`. `scrolly-chart` takes `scrollMode`. `"scroll"` pins the chart while steps scroll past. `"steps"` shows previous and next buttons and needs no scrolling room. `"swipe"` makes swipeable cards.
9. Set `stickyTop` to the height of a fixed header, and `stepHeight` for the scroll distance per step.
10. Make sure no ancestor of the story sets `overflow: hidden`, `auto` or `scroll`. The pinned chart uses `position: sticky`.

## Example of the result

```tsx
"use client";

import { BarChart, Scrolly } from "insightcharts";
import type { Row } from "insightcharts";

const steps = [
  { id: "all", content: "Hydro generated 11,520 TWh, 53% of the total.", highlight: undefined },
  { id: "solar", content: "Solar generated 3,870 TWh, 18% of the total.", highlight: "Solar" },
  { id: "wind", content: "Wind generated 6,340 TWh, 29% of the total.", highlight: "Wind" },
];

export function GenerationStory({ rows }: { rows: Row[] }) {
  return (
    <Scrolly steps={steps} stickyTop={56}>
      {({ step }) => (
        <BarChart
          data={rows}
          x="source"
          y="twh"
          format="compact"
          highlight={step.highlight}
          title="Renewable generation by source, 2020 to 2024"
          subtitle="Electricity generation, TWh"
          source="Ember"
        />
      )}
    </Scrolly>
  );
}
```

## Verify

- The typecheck passes.
- Each step changes exactly one thing, and the chart animates between steps instead of redrawing.
- Every number in the step text matches the data.
- In scroll mode the chart stays pinned while the steps pass.
- The left and right arrow keys move between steps in steps mode.
- The story reads at about 380 pixels wide.

## Reference

- These instructions as plain text: https://insightcharts.dev/agents/prompts/scroll-story.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
