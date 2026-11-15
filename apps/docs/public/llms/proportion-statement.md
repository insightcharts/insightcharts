# Proportion statement (`proportion-statement`)

> A share stated as a countable sentence ("37 in every 100…"): a waffle grid or a row of icons beside the statement in large type, with the number emphasised.

- Component: `ProportionStatement` (import from `insightcharts`)
- Spec type: `"proportion-statement"`
- Level: molecule. Category: story.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

One proportion that is easier to read as a count of people or units than as a percentage. Round to a small whole first: 1 in 4 with icons, 37 in every 100 with a waffle.

## Avoid

Several shares side by side (use `bar-chart`, or `waffle-chart` with categories); a precise percentage where the decimals matter (use `big-number`); totals above 100.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/proportion-statement
```

The file lands at `components/insightcharts/molecules/proportion-statement.tsx`. `@insightcharts/proportion-statement-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ProportionStatement } from "insightcharts";

<ProportionStatement
  value={33}
  total={100}
  text="people in the world have never used the internet."
  detail="That was about 2.6 billion people in 2023."
  source="ITU Facts and Figures 2023"
  note="Figures are approximate, for illustration"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "proportion-statement",
  "value": 33,
  "total": 100,
  "text": "people in the world have never used the internet.",
  "detail": "That was about 2.6 billion people in 2023.",
  "source": "ITU Facts and Figures 2023",
  "note": "Figures are approximate, for illustration"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `number` |  | How many of the whole are counted. |
| `total` | `number` | `100` | The whole. |
| `figure` | `string` |  | The emphasised words. Default: "{value} in every {total}", or "{value} in {total}" up to 20. |
| `text` (required) | `string` |  | The rest of the sentence, read straight after the figure. |
| `visual` | `"waffle" \| "icons"` |  | Grid of cells or row of glyphs. Default: icons up to a total of 20, waffle above. |
| `icon` | `"circle" \| "person" \| "square"` | `"person"` | Glyph for the `icons` visual. |
| `shape` | `"square" \| "circle"` | `"square"` | Cell shape for the `waffle` visual. |
| `side` | `"left" \| "right"` | `"left"` | Side the visual sits on; under 520px it goes on top. |
| `detail` | `string` |  | A second, quieter sentence under the statement. |
| `source` | `string` |  | Shown under the statement as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | Theme override, passed on to the visual. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [waffle-chart](https://insightcharts.dev/llms/waffle-chart.md), [icon-stat](https://insightcharts.dev/llms/icon-stat.md)
- Used by: [explainer](https://insightcharts.dev/llms/explainer.md)

## More examples

### Icons, 1 in 4

```tsx
import { ProportionStatement } from "insightcharts";

<ProportionStatement
  value={1}
  total={4}
  text="households could not cover an unexpected bill of €500 without borrowing."
  source="Eurostat, EU-SILC 2023"
  note="Figures are approximate, for illustration"
/>
```

### Icons on the right, custom figure

```tsx
import { ProportionStatement } from "insightcharts";

<ProportionStatement
  value={9}
  total={10}
  figure="Nine in ten"
  icon="circle"
  side="right"
  text="new cars sold in Norway in 2024 were fully electric."
  detail="Battery-electric models were 89% of registrations in 2024. They were 82% in 2023."
  source="Norwegian Road Federation (OFV)"
  note="Figures are approximate, for illustration"
/>
```

### Waffle with circles

```tsx
import { ProportionStatement } from "insightcharts";

<ProportionStatement
  value={12}
  total={100}
  shape="circle"
  text="adults in the survey had changed jobs in the past year."
  note="Illustrative data"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/proportion-statement.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/proportion-statement.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
