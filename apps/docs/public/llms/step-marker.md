# Step marker (`step-marker`)

> A numbered chapter or step heading ("01 — Electricity sources in 2015") for sequencing the sections of a story.

- Component: `StepMarker` (import from `insightcharts`)
- Spec type: `"step-marker"`
- Level: atom. Category: text.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

When a piece has three to seven ordered chapters or steps. Open each one with a marker so the reader can see the position in the sequence.

## Avoid

Unordered sections (use `headline` with `size: "section"`), or numbering a list of items inside a paragraph.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/step-marker
```

The file lands at `components/insightcharts/atoms/step-marker.tsx`. `@insightcharts/step-marker-demo` adds a ready-made example next to it.

## Usage

```tsx
import { StepMarker } from "insightcharts";

<StepMarker
  theme="mono"
  step={1}
  title="Electricity sources in 2015"
  text="Europe's electricity generation by source in 2015."
  size="lg"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "step-marker",
  "theme": "mono",
  "step": 1,
  "title": "Electricity sources in 2015",
  "text": "Europe's electricity generation by source in 2015.",
  "size": "lg"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `step` (required) | `number \| string` |  | Step number, zero-padded to two digits. Strings are shown as written. |
| `title` (required) | `string` |  | The chapter or step title. |
| `total` | `number` |  | Total steps; the marker then reads "02 / 05". |
| `text` | `string` |  | A sentence under the title. |
| `children` | `ReactNode` |  | JSX alternative to `text`. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | Heading level. |
| `size` | `"md" \| "lg"` | `"md"` | `lg` for chapter openers. |
| `layout` | `"inline" \| "stacked"` | `"inline"` | Number beside or above the title. Narrow containers always stack. |
| `rule` | `boolean` | `false` | Hairline above the marker. |
| `frame` | `boolean` |  | Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [annotated-timeline](https://insightcharts.dev/llms/annotated-timeline.md), [section](https://insightcharts.dev/llms/section.md), [explainer](https://insightcharts.dev/llms/explainer.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### With total and rule

```tsx
import { StepMarker } from "insightcharts";

<StepMarker
  step={2}
  total={5}
  title="Solar module costs fell 82% in eight years"
  text="Average module cost per watt in each year."
  rule
/>
```

### Stacked

```tsx
import { StepMarker } from "insightcharts";

<StepMarker
  theme="poster"
  step={3}
  title="Hours in which midday solar generation exceeded demand on the grid, by month and country"
  layout="stacked"
  size="lg"
/>
```

### Rule on a painted ground

```tsx
import { StepMarker } from "insightcharts";

<StepMarker
  theme="sunrise"
  step={4}
  total={5}
  title="Wind supplied 17% of Europe's electricity in 2024"
  text="Share of electricity generation by source, 2024."
  rule
/>
```

### Letter step, title only

```tsx
import { StepMarker } from "insightcharts";

<StepMarker theme="forest" step="B" title="Factors excluded from the forecast" level={3} />
```

## Links

- Registry item: https://insightcharts.dev/r/step-marker.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/step-marker.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
