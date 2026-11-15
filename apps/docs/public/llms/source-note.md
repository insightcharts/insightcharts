# Source note (`source-note`)

> A sourcing footer for a whole piece: sources with optional links, the period covered, method, caveats and credit.

- Component: `SourceNote` (import from `insightcharts`)
- Spec type: `"source-note"`
- Level: atom. Category: text.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Once, at the end of a story or dashboard, to say where every number came from and how it was produced.

## Avoid

Sourcing a single chart: use that chart's own `source` and `note` props so the citation travels with its export.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/source-note
```

The file lands at `components/insightcharts/atoms/source-note.tsx`. `@insightcharts/source-note-demo` adds a ready-made example next to it.

## Usage

```tsx
import { SourceNote } from "insightcharts";

<SourceNote
  sources={[
    { name: "Ember, European Electricity Review 2025", url: "https://ember-energy.org" },
    { name: "ENTSO-E Transparency Platform", url: "https://transparency.entsoe.eu" },
  ]}
  note="Figures are approximate, for illustration"
  period="January 2015 to December 2024, monthly"
  method="Generation shares are net of pumped-storage consumption. Figures for 2024 are provisional and exclude Malta and Cyprus."
  credit="Analysis and charts by the data desk"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "source-note",
  "sources": [
    { "name": "Ember, European Electricity Review 2025", "url": "https://ember-energy.org" },
    { "name": "ENTSO-E Transparency Platform", "url": "https://transparency.entsoe.eu" }
  ],
  "note": "Figures are approximate, for illustration",
  "period": "January 2015 to December 2024, monthly",
  "method": "Generation shares are net of pumped-storage consumption. Figures for 2024 are provisional and exclude Malta and Cyprus.",
  "credit": "Analysis and charts by the data desk"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `sources` | `string \| { name, url? } \| (string \| { name, url? })[]` |  | Where the data comes from. Entries with a `url` are linked. |
| `period` | `string` |  | The period the data covers, e.g. "2015 to 2024". Shown as "Data". |
| `method` | `string` |  | How the numbers were produced: definitions, adjustments, exclusions. |
| `note` | `string` |  | Caveats the reader should know. |
| `credit` | `string` |  | Who made the piece. |
| `layout` | `"list" \| "inline"` | `"list"` | Labelled list, or one running paragraph. |
| `rule` | `boolean` | `true` | Hairline above the note. |
| `children` | `ReactNode` |  | Extra content after the rows. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [hero-figure](https://insightcharts.dev/llms/hero-figure.md), [comparison-brief](https://insightcharts.dev/llms/comparison-brief.md), [data-explorer](https://insightcharts.dev/llms/data-explorer.md), [executive-brief](https://insightcharts.dev/llms/executive-brief.md), [explainer](https://insightcharts.dev/llms/explainer.md), [report-page](https://insightcharts.dev/llms/report-page.md), [scorecard](https://insightcharts.dev/llms/scorecard.md), [social-card](https://insightcharts.dev/llms/social-card.md), [story-deck](https://insightcharts.dev/llms/story-deck.md), [timeline-story](https://insightcharts.dev/llms/timeline-story.md), [visual-essay](https://insightcharts.dev/llms/visual-essay.md)

## More examples

### Inline

```tsx
import { SourceNote } from "insightcharts";

<SourceNote
  layout="inline"
  sources={["Office for National Statistics", "Ofgem price cap tables"]}
  note="Figures are approximate, for illustration"
  period="Q1 2019 to Q4 2024"
  method="Bills are for a typical dual-fuel household paying by direct debit, in 2024 prices"
  credit="Chart design: A. Ruiz"
/>
```

### Single source, no rule

```tsx
import { SourceNote } from "insightcharts";

<SourceNote
  rule={false}
  sources="World Bank, World Development Indicators"
  note="Illustrative data for the gallery."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/source-note.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/source-note.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
