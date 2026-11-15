---
title: Build a step-by-step data story with Scrolly
goal: One chart stays in place and changes state as the reader scrolls, swipes or steps through a list of short text steps.
llms: stories
---
Build a story with `Scrolly` in the user's project. If the user has not given you the data and the sequence of facts the story should show, ask for both. Each step needs one fact with its number.

## Before you start

{{DETECT}}

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

To write a story as JSON, use the `scrolly-chart` molecule: `{ type: "scrolly-chart", chart: { ...spec }, steps: [{ content, ...chart props }] }`. Its instructions are at {{SITE_URL}}/agents/molecules/scrolly-chart.md.

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
