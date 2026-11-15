# Headline (`headline`)

> The opening block of a piece or section: kicker, title, one-sentence deck and a byline/date line.

- Component: `Headline` (import from `insightcharts`)
- Spec type: `"headline"`
- Level: atom. Category: text.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

At the top of a data story (`page`), at the start of each chapter (`section`), or as the heading of a tile (`card`). Write the title as one plain fact with its number. Write the deck as a second plain sentence.

## Avoid

Titling a single chart: charts carry their own `title` and `subtitle`. For numbered chapters use `step-marker`.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/headline
```

The file lands at `components/insightcharts/atoms/headline.tsx`. `@insightcharts/headline-demo` adds a ready-made example next to it.

## Usage

```tsx
import { Headline } from "insightcharts";

<Headline
  theme="ledger"
  size="page"
  kicker="Energy transition"
  title="Solar generated more electricity than coal in Europe in 2024"
  deck="Solar was the continent's second-largest source of electricity that year."
  byline="By Ana Ruiz and Tom Okafor"
  date="2025-03-14"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "headline",
  "theme": "ledger",
  "size": "page",
  "kicker": "Energy transition",
  "title": "Solar generated more electricity than coal in Europe in 2024",
  "deck": "Solar was the continent's second-largest source of electricity that year.",
  "byline": "By Ana Ruiz and Tom Okafor",
  "date": "2025-03-14"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | One fact with its number, as a plain sentence. Wraps balanced. |
| `kicker` | `string` |  | Small label above the title: section, series or topic. Sentence case. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line, shown as written, e.g. "By Ana Ruiz". |
| `date` | `string` |  | ISO dates are formatted for the locale and wrapped in `<time>`; other strings are shown as written. |
| `size` | `"page" \| "section" \| "card"` | `"section"` | Type scale. Titles step down automatically in narrow containers. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` |  | Heading level. Defaults to 1 (page), 2 (section), 3 (card). |
| `align` | `"left" \| "center"` | `"left"` | Text alignment. |
| `children` | `ReactNode` |  | Extra content under the byline. |
| `frame` | `boolean` |  | Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [hero-figure](https://insightcharts.dev/llms/hero-figure.md), [section](https://insightcharts.dev/llms/section.md), [comparison-brief](https://insightcharts.dev/llms/comparison-brief.md), [data-explorer](https://insightcharts.dev/llms/data-explorer.md), [executive-brief](https://insightcharts.dev/llms/executive-brief.md), [explainer](https://insightcharts.dev/llms/explainer.md), [report-page](https://insightcharts.dev/llms/report-page.md), [scorecard](https://insightcharts.dev/llms/scorecard.md), [timeline-story](https://insightcharts.dev/llms/timeline-story.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Section

```tsx
import { Headline } from "insightcharts";

<Headline
  size="section"
  kicker="Chapter 2"
  title="Germany and the Netherlands have more solar installations per person than Spain"
  deck="Solar installations per person, by country."
/>
```

### Card

```tsx
import { Headline } from "insightcharts";

<Headline
  theme="paper"
  size="card"
  title="Wholesale electricity prices by hour, summer 2024"
  deck="Median day-ahead price for each hour of the day."
  date="Updated June 2024"
/>
```

### Centered page, long title

```tsx
import { Headline } from "insightcharts";

<Headline
  theme="dusk"
  size="page"
  align="center"
  title="Household energy bills in January 2025 were one third higher than before the price shock three years earlier"
  deck="Bills have fallen more slowly than forecast."
  byline="By the data desk"
  date="2025-01-09"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/headline.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/headline.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
