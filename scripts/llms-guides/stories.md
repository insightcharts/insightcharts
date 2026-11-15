---
title: Scroll and swipe stories with Scrolly
description: Scrolly keeps one graphic in place and changes its state as the reader moves through a list of text steps.
order: 6
---
`Scrolly` pins a graphic and changes its state as the reader moves through a list of steps. Because the same chart receives new props at each step, ECharts animates between the states.

```tsx
"use client";
import { LineChart, Scrolly } from "insightcharts";

const data = [
  { year: "2019", solar: 2.7, wind: 5.3 },
  { year: "2021", solar: 3.7, wind: 6.5 },
  { year: "2023", solar: 5.5, wind: 7.8 },
];

const steps = [
  { id: "both", content: "Solar and wind share of global electricity generation, 2019 to 2023.", highlight: [] as string[] },
  { id: "wind", content: "Wind's share rose from 5.3% in 2019 to 7.8% in 2023.", highlight: ["wind"] },
  { id: "solar", content: "Solar's share rose from 2.7% in 2019 to 5.5% in 2023.", highlight: ["solar"] },
];

export function EnergyStory() {
  return (
    <Scrolly steps={steps}>
      {({ step }) => (
        <LineChart
          data={data}
          x="year"
          y={["solar", "wind"]}
          format="{value}%"
          highlight={step.highlight}
          title="Solar and wind share of electricity, 2019 to 2023"
          subtitle="Share of global electricity generation"
          source="Ember"
        />
      )}
    </Scrolly>
  );
}
```

## Steps and state

Each step is `{ id?, content, ...yourKeys }`. `content` is the text for the step (a sentence or two). Any other keys are yours: the state the graphic should be in. `id` is also set as the step element's `id`, so it works as a link anchor.

`children` is a function that receives `{ index, step, progress, count }` and returns the graphic. `progress` runs 0 to 1 through the active step in scroll mode and is 0 in the other modes.

`children` is a function, so `Scrolly` must be used from a client component.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `StoryStep[]` | | The steps. |
| `children` | `(state) => ReactNode` | | Renders the graphic for the active step. |
| `mode` | `"auto" \| "scroll" \| "swipe" \| "steps"` | `"auto"` | See below. |
| `side` | `"left" \| "right"` | `"left"` | Which side the text column sits on in scroll mode. |
| `stickyTop` | `number \| string` | `0` | Offset from the top of the viewport at which the graphic pins; set it to the height of a fixed header. |
| `stepHeight` | `string` | `"80vh"` | Scroll distance per step. |
| `index` | `number` | | Controlled active step. |
| `onStepChange` | `(index, step) => void` | | Called when the active step changes. |
| `theme` | `ThemeInput` | | Theme for the step cards. |
| `colorMode` | `"auto" \| "system" \| "light" \| "dark"` | provider's | Colour mode for the step cards. Named `colorMode` because `mode` is the interaction mode. |
| `className`, `style` | | | On the root element. |

## Modes

- `"scroll"`: the graphic is sticky and the steps scroll past; the step crossing the middle of the viewport is active. When the container is narrower than 768px the steps overlay the graphic as cards instead of sitting beside it.
- `"swipe"`: the graphic sits on top and the steps are cards that swipe horizontally, with Previous and Next buttons.
- `"steps"`: one card at a time with Previous and Next buttons. No scroll hijacking; suitable for embeds.
- `"auto"`: swipe when the container is under 640px wide on a coarse-pointer (touch) device, scroll otherwise.

In swipe and steps modes the left and right arrow keys move between steps. In scroll and swipe modes all step text is in the document.

## Writing steps

- Change one thing per step: the data, the highlight or the encoding.
- Keep the same chart component in the same position across steps and change its props. Swapping to a different component, or changing its `key`, remounts it and loses the transition.
- Use three to seven steps. Each step is one or two plain sentences.
- Each step states one fact about what the chart shows at that step, with the number from the data: "Solar's share rose from 2.7% in 2019 to 5.5% in 2023." Do not start a step with "But" or "And" to link it to the previous one.
- The first step shows all of the data with no highlight.
- Give the chart a `title` that is true at every step (a plain label works), or set the title per step from the step's keys.
- Step text follows the same writing rules as titles. See "Choosing a form".
