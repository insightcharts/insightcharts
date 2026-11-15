# Icon stat (`icon-stat`)

> A "1 in 4"-style statement: a row or grid of simple glyphs with some filled, and the sentence they illustrate.

- Component: `IconStat` (import from `insightcharts`)
- Spec type: `"icon-stat"`
- Level: atom. Category: figure.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

A single proportion that is easier to read as people or units than as a percentage: 1 in 4, 3 in 10, 37 of 100. Round to a small denominator first.

## Avoid

Comparing several proportions (use `bar-chart`), precise percentages (use `big-number`), or fractions that need more than 100 units.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/icon-stat
```

The file lands at `components/insightcharts/atoms/icon-stat.tsx`. `@insightcharts/icon-stat-demo` adds a ready-made example next to it.

## Usage

```tsx
import { IconStat } from "insightcharts";

<IconStat
  icon="person"
  count={1}
  total={4}
  text="households could not cover an unexpected bill of €500 without borrowing."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "icon-stat",
  "icon": "person",
  "count": 1,
  "total": 4,
  "text": "households could not cover an unexpected bill of €500 without borrowing."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `count` (required) | `number` |  | How many glyphs are filled. |
| `total` | `number` | `10` | How many glyphs are drawn. Capped at 100. |
| `text` | `string` |  | The sentence completing the figure. |
| `children` | `ReactNode` |  | JSX alternative to `text`. |
| `value` | `string \| false` |  | The figure as words. Defaults to "{count} in {total}"; `false` hides it. |
| `icon` | `"circle" \| "person" \| "square" \| IconName` | `"circle"` | Glyph per unit. Filled units are solid, the rest outlined. Any other icon name from `core/icons.ts` also works; its unfilled units are faded instead of outlined. |
| `columns` | `number` |  | Glyphs per row. Defaults to `total`, at most 10. |
| `size` | `number` |  | Glyph height in px; shrinks to fit narrow containers. |
| `tone` | `"accent" \| "positive" \| "negative" \| "neutral"` | `"accent"` | Fill colour by meaning. |
| `align` | `"left" \| "center"` | `"left"` | Alignment. |
| `frame` | `boolean` |  | Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [poster](https://insightcharts.dev/llms/poster.md), [proportion-statement](https://insightcharts.dev/llms/proportion-statement.md), [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md), [explainer](https://insightcharts.dev/llms/explainer.md)

## More examples

### Circles, 3 in 10

```tsx
import { IconStat } from "insightcharts";

<IconStat theme="forest" count={3} total={10} text="new cars sold in Europe in 2024 had a plug." />
```

### Grid of 100

```tsx
import { IconStat } from "insightcharts";

<IconStat
  theme="poster"
  count={37}
  total={100}
  icon="square"
  value="37%"
  text="of the national grid's transmission lines are more than 40 years old."
  tone="negative"
/>
```

### People, centered, custom value

```tsx
import { IconStat } from "insightcharts";

<IconStat
  theme="paper"
  icon="person"
  count={7}
  total={10}
  align="center"
  value="Seven in ten"
  text="renters say they have delayed switching the heating on."
  tone="neutral"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/icon-stat.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/icon-stat.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
