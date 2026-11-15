# Quote with figure (`quote-figure`)

> A pull-quote paired with the statistic or small chart that backs it up, side by side and stacking in narrow containers.

- Component: `QuoteFigure` (import from `insightcharts`)
- Spec type: `"quote-figure"`
- Level: molecule. Category: story.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

A quotation shown next to the number it refers to: an interview finding with its survey figure, an executive's statement with the metric. One per section.

## Avoid

A quote with no evidence (use `pull-quote`); a figure that needs axes to read (use `chart-callout` and put the quote in prose); unattributed quotations.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/quote-figure
```

The file lands at `components/insightcharts/molecules/quote-figure.tsx`. `@insightcharts/quote-figure-demo` adds a ready-made example next to it.

## Usage

```tsx
import { QuoteFigure, Sparkline } from "insightcharts";

<QuoteFigure
  quote="Solar met more than half of demand on 41% of summer afternoons in 2024. We do not have enough storage for the midday surplus yet."
  attribution="Marta Keller"
  role="Grid planner, quoted in the 2024 system adequacy review"
  stat={{
    value: 0.41,
    format: "percent",
    label: "Summer afternoons when solar met over half of demand",
    context: "It was 6% of afternoons in 2019",
  }}
  figure={<Sparkline
    data={[
      { year: "2019", share: 6 },
      { year: "2020", share: 9 },
      { year: "2021", share: 14 },
      { year: "2022", share: 22 },
      { year: "2023", share: 31 },
      { year: "2024", share: 41 },
    ]}
    x="year"
    y="share"
    format="{value}%"
    area
  />}
  source="National grid operator, hourly generation data"
  note="Illustrative data"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "quote-figure",
  "quote": "Solar met more than half of demand on 41% of summer afternoons in 2024. We do not have enough storage for the midday surplus yet.",
  "attribution": "Marta Keller",
  "role": "Grid planner, quoted in the 2024 system adequacy review",
  "stat": {
    "value": 0.41,
    "format": "percent",
    "label": "Summer afternoons when solar met over half of demand",
    "context": "It was 6% of afternoons in 2019"
  },
  "figure": {
    "type": "sparkline",
    "data": [
      { "year": "2019", "share": 6 },
      { "year": "2020", "share": 9 },
      { "year": "2021", "share": 14 },
      { "year": "2022", "share": 22 },
      { "year": "2023", "share": 31 },
      { "year": "2024", "share": 41 }
    ],
    "x": "year",
    "y": "share",
    "format": "{value}%",
    "area": true
  },
  "source": "National grid operator, hourly generation data",
  "note": "Illustrative data"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `quote` (required) | `string` |  | The words quoted, without quotation marks. |
| `attribution` | `string` |  | Who said it. |
| `role` | `string` |  | Their role, or where it was said. |
| `cite` | `string` |  | Source URL, linked from the attribution. |
| `stat` | `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }` |  | The statistic that backs the quote up; takes the props of `big-number`. |
| `figure` | `Slot` |  | A small chart or figure instead of, or under, the statistic: a spec or a React element. |
| `side` | `"left" \| "right"` | `"right"` | Side the evidence sits on; under 640px it goes underneath. |
| `source` | `string` |  | Shown underneath as "Source: ...". |
| `note` | `string` |  | Method note or caveat. |
| `theme` | `ThemeInput` |  | Theme override, passed on to the quote and the figure. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [pull-quote](https://insightcharts.dev/llms/pull-quote.md), [big-number](https://insightcharts.dev/llms/big-number.md), [sparkline](https://insightcharts.dev/llms/sparkline.md)
- Used by: no molecule or template yet

## More examples

### Evidence on the left, statistic only

```tsx
import { QuoteFigure } from "insightcharts";

<QuoteFigure
  side="left"
  quote="Most of the customers who left told us they stopped at the second screen of setup."
  attribution="Dana Whitfield"
  role="Head of customer research"
  stat={{
    value: 0.58,
    format: "percent",
    label: "Churned accounts that never finished setup",
    delta: "−21 pts",
    deltaLabel: "after the redesign",
    upIsGood: false,
  }}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/quote-figure.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/quote-figure.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
