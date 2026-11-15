---
title: Build a scroll story like the ones in the gallery
goal: A scroll story in the user's project that pins one chart and changes one prop at every step, modelled on a story from the gallery.
llms: stories
---
Build a scroll story with `Scrolly` in the user's project, using one of the gallery's stories as the model. If the user has not said which story to follow, which data to use and which facts the steps should state, ask.

## Before you start

{{DETECT}}

## The stories in the gallery

Each one pins a single chart and changes one prop per step. Pick the one whose chart form fits the user's data.

{{STORIES}}

## Steps

1. Pick the chart form. Per-component instructions are at `{{SITE_URL}}/agents/atoms/<name>.md`, for example {{SITE_URL}}/agents/atoms/bar-chart.md.
2. Write down the sequence of facts, one per step, each with its number from the data.
3. For each step, decide the one chart prop that changes: `y`, `sort`, `stack`, `highlight`, `annotations`, `group` or the `data` itself.
4. Write the steps array: `{ id, content, ...the props that change }`.
5. Create a `"use client"` file and render `Scrolly` with a function child that returns the same chart at every step.
6. Give the chart a `theme` name if the story should have its own look. Preset themes: {{PRESET_THEMES}}. Poster themes: {{POSTER_THEMES}}. A named theme paints its own background behind the chart.
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
