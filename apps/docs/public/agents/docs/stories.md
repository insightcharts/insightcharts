# Build a step-by-step data story with Scrolly

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: One chart stays in place and changes state as the reader scrolls, swipes or steps through a list of short text steps.

Build a story with `Scrolly` in the user's project. If the user has not given you the data and the sequence of facts the story should show, ask for both. Each step needs one fact with its number.

## Before you start

1. Find the package manager from the lockfile: `pnpm-lock.yaml` means pnpm, `yarn.lock` means yarn, `bun.lock` or `bun.lockb` means bun, `package-lock.json` or no lockfile means npm. Use it for every install command.
2. Find the framework in `package.json`: `next` (the App Router if there is an `app/` directory), `vite`, `react-router`, `@remix-run/react` or `astro` with its React integration. The project must use React 18 or later. The package is ESM only.
3. Check whether `insightcharts` is in `dependencies`. If it is missing, install it with ECharts: `npm install insightcharts echarts` (or `pnpm add`, `yarn add`, `bun add` with the same two names). There is no stylesheet to import.
4. Look for a `components/insightcharts/` folder (it may be under `src/`). If it exists, the project copied component source from the shadcn registry. Import those components from that folder, because the user may have edited them. Import everything else from `insightcharts`.
5. In Next.js, a file that passes a function prop (`onSelect`, `onEvents`, `onReady`, or a function as `format`, `transform`, `data` or `option`) or that uses `Scrolly` must start with `"use client"`. A chart with plain props can be imported into a server component.

## Steps

1. Choose one chart component that can show every step. The story works by sending new props to the same chart, so the chart animates between states.
2. Write the steps as an array. Each step is an object with `content` (the text) and any other keys you choose. Those keys hold the chart props that change at that step.
3. Change one thing per step: the data, the `highlight`, the `annotations`, the sort or the encoding.
4. Create a file that starts with `"use client"`. `Scrolly` takes a function as its child, and a function cannot be passed from a server component.
5. Render `<Scrolly steps={steps}>{({ step }) => <TheChart ... />}</Scrolly>`. Return the same component at every step. A different component remounts the chart and nothing animates.
6. Pick the `mode`. Use `"scroll"` or `"auto"` in an article. Use `"steps"` inside a card, a dashboard or a slide, where there is no scrolling room.
7. In scroll mode, set `stickyTop` to the height of any sticky header, and check that no ancestor of the story sets `overflow: hidden`, `auto` or `scroll`. The pinned graphic uses `position: sticky`.

## API

Import `Scrolly` from `insightcharts` or `insightcharts/story`. Types: `ScrollyProps`, `StoryStep`, `StoryState`.

| Prop | Default | Purpose |
|---|---|---|
| `steps` | required | Array of `{ content, id?, ...your keys }`. `content` is a string or a React node. `id` becomes the step's element id, so `#id` links to it. |
| `children` | required | `({ step, index, count, progress }) => ReactNode`. `progress` runs from 0 to 1 through the active step in scroll mode and is 0 in the other modes. |
| `mode` | `"auto"` | `"scroll"` pins the graphic while the steps scroll past. `"swipe"` shows the steps as cards that swipe sideways under the graphic. `"steps"` shows one card with previous and next buttons. `"auto"` is swipe on a touch device in a container under 640px wide, and scroll otherwise. |
| `side` | `"left"` | Side of the text column in scroll mode. Under 768px the text cards pass over the graphic. |
| `stickyTop` | `0` | Distance from the top of the viewport at which the graphic pins. A number of pixels or a CSS length. |
| `stepHeight` | `"80vh"` | Scroll distance per step, as a CSS length. |
| `index` | uncontrolled | Controlled active step. |
| `onStepChange` | none | Called with `(index, step)`. |
| `theme` | surrounding theme | Same as `theme` on a chart. |
| `colorMode` | `"auto"` | Same as `mode` on a chart: `"auto"`, `"system"`, `"light"` or `"dark"`. |
| `className`, `style` | none | Applied to the story's root element. |

In swipe and steps modes the left and right arrow keys move between steps when focus is inside the story.

To write a story as JSON, use the `scrolly-chart` molecule: `{ type: "scrolly-chart", chart: { ...spec }, steps: [{ content, ...chart props }] }`. Its instructions are at https://insightcharts.dev/agents/molecules/scrolly-chart.md.

## Minimal example

```tsx
"use client";

import { BarChart, Scrolly } from "insightcharts";

const visits = [
  { museum: "Natural history", Adult: 520, Child: 610 },
  { museum: "Science", Adult: 390, Child: 540 },
  { museum: "Modern art", Adult: 640, Child: 90 },
  { museum: "Design", Adult: 420, Child: 60 },
].map((m) => ({ ...m, Total: m.Adult + m.Child }));

type Step = { id: string; content: string; y: string[]; stack?: boolean; highlight?: string };

const steps: Step[] = [
  { id: "total", y: ["Total"], content: "Natural history had 1.13 million visits in 2024." },
  { id: "split", y: ["Adult", "Child"], stack: true, content: "Children made 610,000 of the visits to Natural history." },
  { id: "child", y: ["Adult", "Child"], stack: true, highlight: "Child", content: "Children made 60,000 of the 480,000 visits to Design." },
];

export function MuseumStory() {
  return (
    <Scrolly steps={steps} stickyTop={56}>
      {({ step }) => (
        <BarChart
          data={visits}
          x="museum"
          y={step.y}
          stack={step.stack ?? false}
          highlight={step.highlight}
          orientation="horizontal"
          sort="none"
          height={320}
          title="Visits to four museums in 2024"
          subtitle="Thousands of visits by ticket type"
          source="Museum ticket records"
        />
      )}
    </Scrolly>
  );
}
```

## Writing the steps

- `content` is one or two plain sentences that state what the chart shows at that step, with the number from the data.
- Take every number from the rows. Do not state a cause the data does not show.
- No metaphors, no dramatic verbs, no questions, no teasing the next step.
- Keep the chart `title` a plain label that is true at every step, or change it with the step.

## Verify

1. Typecheck. `step` is typed from your steps array.
2. Open the page and move through every step. Each step must animate. A step that redraws without animation changed too much: for example a treemap that gains or loses its `group`. Choose a different change for that step.
3. In scroll mode, confirm the graphic pins. If it scrolls away, an ancestor clips overflow.
4. Check at about 380px wide and in dark mode. Text cards must not cover the part of the chart the step is about.
5. Check `mode="steps"` with the keyboard: Tab into the story, then use the arrow keys.

## Common mistakes

- No `"use client"` at the top of the file that renders `Scrolly` in Next.js.
- Rendering a different chart component per step.
- Changing several props in one step.
- An ancestor with `overflow: hidden` in scroll mode.
- Passing `mode="dark"` to `Scrolly` to set the colour mode. `mode` is the story mode. The colour mode prop is `colorMode`.
- Leaving `stickyTop` at 0 under a sticky site header.

## Reference

- The long guide on this topic: https://insightcharts.dev/llms/guides/stories.md
- This page: https://insightcharts.dev/docs/stories
- These instructions as plain text: https://insightcharts.dev/agents/docs/stories.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
