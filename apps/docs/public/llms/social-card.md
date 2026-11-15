# Social card (`social-card`)

> A graphic that states one fact, at a fixed aspect ratio (1:1, 4:5, 16:9 or 9:16). It has a kicker, a headline, one exhibit, a source and a credit, painted on the theme surface. A button downloads the whole card as a PNG.

- Component: `SocialCard` (import from `insightcharts`)
- Spec type: `"social-card"`
- Level: template. Category: layout.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it for one finding that will be shared in a feed, a slide or a chat thread with no text around it. State the fact with its number in the headline. Use one simple exhibit, such as one highlighted bar, one line or one number. Put the source and your name on the card, because it will be shared without the page. Use 1:1 or 4:5 for feeds, 16:9 for slides and link previews, 9:16 for stories.

## Avoid

More than one fact or more than one exhibit (use `story-deck` for a sequence, `executive-brief` for a page). Charts that need a legend, small labels or hovering to read, because a shared image is not interactive. An exhibit with its own `title`, because the card's headline is the title.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/social-card
```

The file lands at `components/insightcharts/templates/social-card.tsx`. `@insightcharts/social-card-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, SocialCard } from "insightcharts";

<SocialCard
  aspect="1:1"
  kicker="Climate"
  title="The world was 1.6°C warmer in 2024 than in 1850 to 1900"
  exhibit={<BarChart
    data={[
      { year: "2015", c: 1.17 },
      { year: "2016", c: 1.31 },
      { year: "2017", c: 1.22 },
      { year: "2018", c: 1.14 },
      { year: "2019", c: 1.26 },
      { year: "2020", c: 1.31 },
      { year: "2021", c: 1.14 },
      { year: "2022", c: 1.18 },
      { year: "2023", c: 1.48 },
      { year: "2024", c: 1.6 },
    ]}
    x="year"
    y="c"
    orientation="vertical"
    sort="none"
    highlight="2024"
    format="{value}°C"
    labels={false}
    subtitle="Global average temperature above the 1850 to 1900 level"
    annotations={[{ type: "line", axis: "y", value: 1.5, label: "Paris Agreement limit" }]}
  />}
  source="Copernicus Climate Change Service, ERA5 (rounded)"
  note="Figures are approximate, for illustration"
  credit="InsightCharts"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "social-card",
  "aspect": "1:1",
  "kicker": "Climate",
  "title": "The world was 1.6°C warmer in 2024 than in 1850 to 1900",
  "exhibit": {
    "type": "bar-chart",
    "data": [
      { "year": "2015", "c": 1.17 },
      { "year": "2016", "c": 1.31 },
      { "year": "2017", "c": 1.22 },
      { "year": "2018", "c": 1.14 },
      { "year": "2019", "c": 1.26 },
      { "year": "2020", "c": 1.31 },
      { "year": "2021", "c": 1.14 },
      { "year": "2022", "c": 1.18 },
      { "year": "2023", "c": 1.48 },
      { "year": "2024", "c": 1.6 }
    ],
    "x": "year",
    "y": "c",
    "orientation": "vertical",
    "sort": "none",
    "highlight": "2024",
    "format": "{value}°C",
    "labels": false,
    "subtitle": "Global average temperature above the 1850 to 1900 level",
    "annotations": [{ "type": "line", "axis": "y", "value": 1.5, "label": "Paris Agreement limit" }]
  },
  "source": "Copernicus Climate Change Service, ERA5 (rounded)",
  "note": "Figures are approximate, for illustration",
  "credit": "InsightCharts"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The card's one fact, as a plain sentence with the number in it. |
| `kicker` | `string` |  | Small label above the title. |
| `deck` | `string` |  | One short line under the title: the measure, or the number in words. |
| `exhibit` | `Slot` |  | The one exhibit. A chart spec is given the height left in the card (any `height` you set wins); leave out its `title`. |
| `source` | `string` |  | Where the data comes from, shown as "Source: ...". |
| `note` | `string` |  | Caveat shown after the source, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made it: a name, handle or publication. |
| `aspect` | `"1:1" \| "4:5" \| "16:9" \| "9:16"` | `"1:1"` | Shape of the card. |
| `tone` | `"surface" \| "inverse"` | `"surface"` | `inverse` paints the card in the opposite colour mode. |
| `downloadable` | `boolean` | `true` | Show the download button under the card. The image is the whole card, drawn from the DOM onto a canvas. |
| `exportWidth` | `number` | `1080` | Width of the downloaded PNG in pixels (1920 for 16:9). |
| `filename` | `string` |  | File name without extension. Defaults to a slug of the title. |
| `downloadLabel` | `string` | `"Download PNG"` | Label of the download button. |
| `maxWidth` | `number` |  | Widest the card is drawn on screen, in px. Default 540 (520 for 4:5, 720 for 16:9, 400 for 9:16). In narrower containers the whole card is scaled down, like an image, so its composition never changes. |
| `onExport` | `(blob: Blob) => void` |  | Called with the PNG after a download. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | Heading level of the title. |
| `theme` | `ThemeInput` |  | Theme override, passed on to the exhibit. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

## Composition

- Composes: [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [big-number](https://insightcharts.dev/llms/big-number.md), [waffle-chart](https://insightcharts.dev/llms/waffle-chart.md), [source-note](https://insightcharts.dev/llms/source-note.md)
- Used by: no molecule or template yet

## More examples

### 16:9, public health, inverse tone

```tsx
import { BarChart, SocialCard } from "insightcharts";

<SocialCard
  aspect="16:9"
  tone="inverse"
  kicker="Public health"
  title="Reported measles cases in Europe rose from 61,000 in 2023 to 127,000 in 2024"
  exhibit={<BarChart
    data={[
      { year: "2019", cases: 106 },
      { year: "2020", cases: 12 },
      { year: "2021", cases: 0.2 },
      { year: "2022", cases: 0.9 },
      { year: "2023", cases: 61 },
      { year: "2024", cases: 127 },
    ]}
    x="year"
    y="cases"
    orientation="vertical"
    sort="none"
    highlight="2024"
    format="{value}k"
    subtitle="Reported measles cases, WHO European Region, thousands"
  />}
  source="WHO and UNICEF (rounded)"
  note="Figures are approximate, for illustration"
  credit="Data desk"
/>
```

### 9:16, transport, a proportion instead of a chart

```tsx
import { SocialCard, WaffleChart } from "insightcharts";

<SocialCard
  aspect="9:16"
  kicker="Transport"
  title="58% of car journeys in England are under five miles"
  deck="Each square is 1% of car journeys."
  exhibit={<WaffleChart
    data={[{ group: "Under five miles", share: 58 }]}
    name="group"
    value="share"
    total={100}
    restLabel="Five miles or more"
    legend={false}
    aspect={1}
  />}
  source="National Travel Survey"
  note="Rounded, approximate figures for illustration"
  credit="@datadesk"
/>
```

### 4:5, personal finance, a single number

```tsx
import { BigNumber, SocialCard } from "insightcharts";

<SocialCard
  aspect="4:5"
  kicker="Money"
  title="Starting to save at 35 instead of 25 leaves $296,000 less at 65"
  exhibit={<BigNumber
    size="hero"
    value="$296,000"
    label="Less at 65 if you start at 35 instead of 25"
    context="Saving $300 a month at a 6% real return"
  />}
  source="Author's calculation"
  note="Illustrative"
  credit="InsightCharts"
  downloadable={false}
/>
```

## Links

- Registry item: https://insightcharts.dev/r/social-card.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/social-card.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
