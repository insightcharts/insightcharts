# Prose (`prose`)

> A readable block of narration at a 45-75 character measure, for the text between charts.

- Component: `Prose` (import from `insightcharts`)
- Spec type: `"prose"`
- Level: atom. Category: text.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

To say what a chart showed and introduce the next one. Use two or three short paragraphs at a time.

## Avoid

A single statement of fact (use `callout`), a quotation (use `pull-quote`), or sourcing and method notes (use `source-note`).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/prose
```

The file lands at `components/insightcharts/atoms/prose.tsx`. `@insightcharts/prose-demo` adds a ready-made example next to it.

## Usage

```tsx
import { Prose } from "insightcharts";

<Prose
  text={"In 2015 solar supplied **3% of Europe's electricity**. Hydro supplied more than three times as much.\n\nPanel prices fell by about 80% in the years that followed. In 2024 solar generated more electricity than coal across the EU, according to [Ember's annual review](https://ember-energy.org).\n\nSolar's share differs by country. The next chart shows it for each EU member state."}
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "prose",
  "text": "In 2015 solar supplied **3% of Europe's electricity**. Hydro supplied more than three times as much.\n\nPanel prices fell by about 80% in the years that followed. In 2024 solar generated more electricity than coal across the EU, according to [Ember's annual review](https://ember-energy.org).\n\nSolar's share differs by country. The next chart shows it for each EU member state."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string \| string[]` |  | Narration. Blank lines separate paragraphs. Supports `**bold**`, `*italic*` and `[link](url)`. |
| `children` | `ReactNode` |  | JSX alternative to `text`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Body size: 14, 16 or 18px. |
| `measure` | `number` | `65` | Line length in characters, clamped to 45-75. |
| `lead` | `boolean` | `false` | Set the first paragraph a step larger. |
| `tone` | `"default" \| "muted"` | `"default"` | `muted` for secondary narration. |
| `align` | `"left" \| "center"` | `"left"` | Centres the block (text stays left-aligned). |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [annotated-timeline](https://insightcharts.dev/llms/annotated-timeline.md), [scrolly-chart](https://insightcharts.dev/llms/scrolly-chart.md), [section](https://insightcharts.dev/llms/section.md), [comparison-brief](https://insightcharts.dev/llms/comparison-brief.md), [executive-brief](https://insightcharts.dev/llms/executive-brief.md), [explainer](https://insightcharts.dev/llms/explainer.md), [report-page](https://insightcharts.dev/llms/report-page.md), [scorecard](https://insightcharts.dev/llms/scorecard.md), [story-deck](https://insightcharts.dev/llms/story-deck.md), [timeline-story](https://insightcharts.dev/llms/timeline-story.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Lead paragraph, large

```tsx
import { Prose } from "insightcharts";

<Prose
  size="lg"
  lead
  text={[
    "The typical household energy bill almost doubled between the winter of 2020 and the winter of 2022.",
    "Wholesale prices have fallen since then. Standing charges and network costs have not fallen. The average bill is still about a third higher than it was in 2020.",
  ]}
/>
```

### Muted aside, narrow measure

```tsx
import { Prose } from "insightcharts";

<Prose
  size="sm"
  tone="muted"
  measure={48}
  text="*How to read this section.* Each dot is one local authority. Dots further right have more installed capacity per person. The vertical position shows median household income."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/prose.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/prose.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
