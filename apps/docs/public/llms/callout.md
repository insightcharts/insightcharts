# Callout (`callout`)

> A boxed statement of fact with a short bold lead and a sentence of explanation. The tone is marked by icon and tint.

- Component: `Callout` (import from `insightcharts`)
- Spec type: `"callout"`
- Level: atom. Category: text.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Beside or under a chart, to state its main fact in words, with the number. Also for a caveat the reader must not miss (`negative`).

## Avoid

Long narration (use `prose`), a featured number (use `big-number` or `stat-tile`), or more than one callout per chart.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/callout
```

The file lands at `components/insightcharts/atoms/callout.tsx`. `@insightcharts/callout-demo` adds a ready-made example next to it.

## Usage

```tsx
import { Callout } from "insightcharts";

<Callout
  tone="accent"
  label="Summary"
  lead="Solar supplied more than half of demand on 4 in 10 summer afternoons in 2024"
  text="Wholesale prices were below zero on those afternoons."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "callout",
  "tone": "accent",
  "label": "Summary",
  "lead": "Solar supplied more than half of demand on 4 in 10 summer afternoons in 2024",
  "text": "Wholesale prices were below zero on those afternoons."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `lead` | `string` |  | The fact in a few bold words. State it with its number. |
| `text` | `string` |  | One sentence of explanation or evidence. |
| `children` | `ReactNode` |  | JSX alternative to `text`. |
| `tone` | `"neutral" \| "positive" \| "negative" \| "accent"` | `"neutral"` | Sets the icon shape and the tint together. |
| `label` | `string` |  | Small label above the lead, e.g. "Summary". |
| `variant` | `"soft" \| "outline" \| "plain"` | `"soft"` | Tinted box, bordered box, or no box. |
| `frame` | `boolean` |  | Paint a named theme's background behind the callout, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [chart-callout](https://insightcharts.dev/llms/chart-callout.md), [comparison-brief](https://insightcharts.dev/llms/comparison-brief.md), [data-explorer](https://insightcharts.dev/llms/data-explorer.md), [explainer](https://insightcharts.dev/llms/explainer.md)

## More examples

### Positive

```tsx
import { Callout } from "insightcharts";

<Callout
  theme="editorial"
  tone="positive"
  lead="Monthly churn fell from 4.2% to 2.1% between January and June"
  text="It has stayed at 2.1% for two quarters since."
/>
```

### Negative caveat, outline

```tsx
import { Callout } from "insightcharts";

<Callout
  theme="ledger"
  tone="negative"
  variant="outline"
  label="Caveat"
  lead="2020 figures are not comparable"
  text="The survey moved online during lockdown. Response rates among over-75s fell by a third. Treat 2020 as a break in the series."
/>
```

### Neutral, plain

```tsx
import { Callout } from "insightcharts";

<Callout
  theme="blueprint"
  tone="neutral"
  variant="plain"
  text="Figures are provisional until the statistical office publishes its annual revision in September."
/>
```

### One token overridden

```tsx
import { Callout } from "insightcharts";

<Callout
  theme={{ accent: "#b4237a" }}
  tone="accent"
  label="Key point"
  lead="Night buses carried 18% of all weekend journeys in 2024"
  text="The share was 11% in 2019. Illustrative figures."
/>
```

### Accent on a painted ground

```tsx
import { Callout } from "insightcharts";

<Callout
  theme="forest"
  tone="accent"
  variant="outline"
  lead="Tree cover in the city rose from 14% to 19% between 2010 and 2024"
  text="The target for 2030 is 25%. Illustrative figures."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/callout.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/callout.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
