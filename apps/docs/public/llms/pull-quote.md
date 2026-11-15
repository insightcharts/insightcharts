# Pull quote (`pull-quote`)

> A large quotation with its attribution.

- Component: `PullQuote` (import from `insightcharts`)
- Spec type: `"pull-quote"`
- Level: atom. Category: text.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

To quote a person on a finding the charts have already shown, or to break up a long run of charts. One per section at most.

## Avoid

Restating a number (use `big-number`) or the main fact of a chart (use `callout`). Never quote without attribution.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/pull-quote
```

The file lands at `components/insightcharts/atoms/pull-quote.tsx`. `@insightcharts/pull-quote-demo` adds a ready-made example next to it.

## Usage

```tsx
import { PullQuote } from "insightcharts";

<PullQuote
  quote="Solar set the midday wholesale price on most days in 2023. Our plans had assumed that would happen in the 2030s."
  attribution="Marit de Vries"
  role="Head of system operations, Dutch grid operator"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "pull-quote",
  "quote": "Solar set the midday wholesale price on most days in 2023. Our plans had assumed that would happen in the 2030s.",
  "attribution": "Marit de Vries",
  "role": "Head of system operations, Dutch grid operator"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `quote` | `string` |  | The words quoted, without quotation marks. |
| `children` | `ReactNode` |  | JSX alternative to `quote`. |
| `attribution` | `string` |  | Who said it. |
| `role` | `string` |  | Their role, or where it was said. |
| `cite` | `string` |  | Source URL: set as the blockquote `cite` and linked from the attribution. |
| `size` | `"md" \| "lg"` | `"lg"` | `lg` anchors a section; `md` sits inside a column. |
| `align` | `"left" \| "center"` | `"left"` | Left-aligned quotes carry a side rule; centred ones do not. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [quote-figure](https://insightcharts.dev/llms/quote-figure.md), [story-deck](https://insightcharts.dev/llms/story-deck.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Centered

```tsx
import { PullQuote } from "insightcharts";

<PullQuote
  align="center"
  quote="Rooftop solar is now the cheapest source of new electricity in our market."
  attribution="Luis Ortega"
  role="Energy economist"
/>
```

### Medium, with source link

```tsx
import { PullQuote } from "insightcharts";

<PullQuote
  size="md"
  quote="Solar underbid coal in the afternoon power auctions for three years. The coal plants that could not reduce their output quickly enough in those hours were closed because they no longer covered their costs."
  attribution="European Electricity Review 2025"
  cite="https://ember-energy.org"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/pull-quote.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/pull-quote.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
