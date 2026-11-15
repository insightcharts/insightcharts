# Poster (`poster`)

> The sheet an infographic is composed on. It paints a full-bleed ground from a poster theme, forces one theme and colour mode on everything inside, and lays out a masthead, a grid of panels and a footer. It can save the whole sheet as one PNG.

- Component: `Poster` (import from `insightcharts`)
- Spec type: `"poster"`
- Level: molecule. Category: poster.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it as the outer frame of any infographic: one dominant graphic with a few supporting panels, on a painted ground. Give it a poster theme (`noir`, `magenta`, `dusk`, `paper`, `ocean`, `forest`, `blueprint`, `sunrise`) and put a chart or figure spec in each panel. Put the one fact in `title` and keep panel headings short. It reflows to one column under 600px.

## Avoid

Long reading text or more than about six panels (use `report-page` or `visual-essay`). A single fact at a fixed social size (use `social-card`). Charts that need axes, gridlines and dense labels to be read, because a poster ground suits large flat marks with their values printed on them.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/poster
```

The file lands at `components/insightcharts/molecules/poster.tsx`. `@insightcharts/poster-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, BigNumber, DonutChart, PictogramChart, Poster } from "insightcharts";

<Poster
  theme="noir"
  kicker="Transport"
  title="Riverton's bike-share scheme carried 4.2 million trips in 2025"
  subtitle="Trips, bikes and reasons for riding in the city's public bike-share scheme, January to December 2025."
  panels={[
    {
      span: 4,
      valign: "center",
      content: <BigNumber
        size="hero"
        value="4.2 million"
        label="Trips in 2025"
        context="3.4 million in 2024"
      />,
    },
    {
      span: 8,
      title: "Old Town had 1,150 of the scheme's 3,000 bikes",
      content: <PictogramChart
        data={[
          { district: "Old Town", bikes: 1150 },
          { district: "Harbour", bikes: 820 },
          { district: "University", bikes: 640 },
          { district: "Northside", bikes: 390 },
        ]}
        name="district"
        value="bikes"
        unit={50}
        unitLabel="50 bikes"
        icon="bike"
        highlight="Old Town"
      />,
      source: "Riverton Transport Office",
    },
    {
      span: 7,
      title: "670,000 trips were made on Wednesdays in 2025",
      subtitle: "Trips by day of the week, thousands, 2025",
      content: <BarChart
        data={[
          { day: "Mon", trips: 610 },
          { day: "Tue", trips: 655 },
          { day: "Wed", trips: 670 },
          { day: "Thu", trips: 662 },
          { day: "Fri", trips: 640 },
          { day: "Sat", trips: 520 },
          { day: "Sun", trips: 443 },
        ]}
        x="day"
        y="trips"
        orientation="vertical"
        sort="none"
        highlight="Wed"
        format="{value}k"
        height={260}
      />,
    },
    {
      span: 5,
      title: "46% of trips were commutes",
      subtitle: "Share of trips by stated purpose, rider survey, 2025",
      content: <DonutChart
        data={[
          { purpose: "Commuting", share: 46 },
          { purpose: "Leisure", share: 27 },
          { purpose: "Errands", share: 18 },
          { purpose: "Other", share: 9 },
        ]}
        name="purpose"
        value="share"
        format="{value}%"
        centerValue="46%"
        centerLabel="Commuting"
        height={260}
      />,
    },
  ]}
  sources={["Riverton Transport Office", "Riverton rider survey 2025"]}
  note="Riverton is an invented city. All figures are illustrative."
  credit="InsightCharts"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "poster",
  "theme": "noir",
  "kicker": "Transport",
  "title": "Riverton's bike-share scheme carried 4.2 million trips in 2025",
  "subtitle": "Trips, bikes and reasons for riding in the city's public bike-share scheme, January to December 2025.",
  "panels": [
    {
      "span": 4,
      "valign": "center",
      "content": {
        "type": "big-number",
        "size": "hero",
        "value": "4.2 million",
        "label": "Trips in 2025",
        "context": "3.4 million in 2024"
      }
    },
    {
      "span": 8,
      "title": "Old Town had 1,150 of the scheme's 3,000 bikes",
      "content": {
        "type": "pictogram-chart",
        "data": [
          { "district": "Old Town", "bikes": 1150 },
          { "district": "Harbour", "bikes": 820 },
          { "district": "University", "bikes": 640 },
          { "district": "Northside", "bikes": 390 }
        ],
        "name": "district",
        "value": "bikes",
        "unit": 50,
        "unitLabel": "50 bikes",
        "icon": "bike",
        "highlight": "Old Town"
      },
      "source": "Riverton Transport Office"
    },
    {
      "span": 7,
      "title": "670,000 trips were made on Wednesdays in 2025",
      "subtitle": "Trips by day of the week, thousands, 2025",
      "content": {
        "type": "bar-chart",
        "data": [
          { "day": "Mon", "trips": 610 },
          { "day": "Tue", "trips": 655 },
          { "day": "Wed", "trips": 670 },
          { "day": "Thu", "trips": 662 },
          { "day": "Fri", "trips": 640 },
          { "day": "Sat", "trips": 520 },
          { "day": "Sun", "trips": 443 }
        ],
        "x": "day",
        "y": "trips",
        "orientation": "vertical",
        "sort": "none",
        "highlight": "Wed",
        "format": "{value}k",
        "height": 260
      }
    },
    {
      "span": 5,
      "title": "46% of trips were commutes",
      "subtitle": "Share of trips by stated purpose, rider survey, 2025",
      "content": {
        "type": "donut-chart",
        "data": [
          { "purpose": "Commuting", "share": 46 },
          { "purpose": "Leisure", "share": 27 },
          { "purpose": "Errands", "share": 18 },
          { "purpose": "Other", "share": 9 }
        ],
        "name": "purpose",
        "value": "share",
        "format": "{value}%",
        "centerValue": "46%",
        "centerLabel": "Commuting",
        "height": 260
      }
    }
  ],
  "sources": ["Riverton Transport Office", "Riverton rider survey 2025"],
  "note": "Riverton is an invented city. All figures are illustrative.",
  "credit": "InsightCharts"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` |  | The poster's one fact, as a plain sentence with its number. Set large and light in the theme's display face. |
| `kicker` | `string` |  | Small label above the title: the topic or series. |
| `subtitle` | `string` |  | One or two lines under the title: the measure, population and period. |
| `panels` (required) | `PosterPanel[]` |  | The blocks, in reading order. Each is `{ content, title?, subtitle?, span?, rowSpan?, source?, note?, align?, valign?, bleed?, id? }`. `content` is a component spec or rendered content. `span` is in units of `columns` (default: full width). `bleed` runs the content to the poster's left and right edges. |
| `columns` | `number` | `12` | Columns of the layout grid: a 12-unit grid, or a simple count such as 2 or 3. Under 600px every panel is full width; from 600 to 760px the grid has two columns. |
| `gap` | `number` |  | Space between panels in px. Default 40 (28 under 600px). |
| `padding` | `number` |  | Space between the poster's edge and its content in px. Default 56 (36 under 900px, 20 under 600px). |
| `maxWidth` | `number \| string` | `1200` | Widest the poster is drawn. It is centred in wider containers. |
| `aspect` | `number \| string` |  | Fixed shape as width / height: `0.75`, `"3:4"`, `"16:9"`. The poster still grows when its content needs more height, and the ratio is dropped under 600px. |
| `theme` | `PosterThemeName \| string \| ThemeInput` | `"noir"` | A poster theme name, any other theme name, or a theme object. It is passed on to everything inside. |
| `mode` | `"light" \| "dark" \| "auto" \| "system"` | `"light"` | Colour mode of the poster and everything in it. A poster does not follow the page unless you set `auto`. Only `paper` has a different dark variant. |
| `background` | `string` |  | CSS background of the sheet, a colour or a gradient. Default: the poster theme's ground. Keep it close to the theme's `surface`, which charts use for the gaps between marks. |
| `rules` | `"none" \| "solid" \| "dotted"` | `"dotted"` | Lines under the masthead, between rows of panels and above the footer. |
| `sources` | `string \| string[]` |  | Where the data comes from, shown in the footer. |
| `note` | `string` |  | Caveat shown in the footer, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the poster, shown at the right of the footer. |
| `titleAlign` | `"left" \| "center"` | `"left"` | Alignment of the masthead. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Heading level of the title. Panel headings are one level down. |
| `download` | `boolean` | `false` | Show a "Download PNG" control under the poster. The image is the whole sheet, drawn from the DOM onto a canvas, without the control. |
| `exportWidth` | `number` | `2400` | Width of the downloaded PNG in pixels. |
| `filename` | `string` |  | File name without extension. Defaults to a slug of the title. |
| `downloadLabel` | `string` | `"Download PNG"` | Label of the download control. |
| `onExport` | `(blob: Blob) => void` |  | Called with the PNG after a download. |

## Composition

- Composes: [big-number](https://insightcharts.dev/llms/big-number.md), [pictogram-chart](https://insightcharts.dev/llms/pictogram-chart.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [donut-chart](https://insightcharts.dev/llms/donut-chart.md), [treemap](https://insightcharts.dev/llms/treemap.md), [waffle-chart](https://insightcharts.dev/llms/waffle-chart.md), [segmented-bar](https://insightcharts.dev/llms/segmented-bar.md), [icon-stat](https://insightcharts.dev/llms/icon-stat.md)
- Used by: [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md), [count-poster](https://insightcharts.dev/llms/count-poster.md), [flow-poster](https://insightcharts.dev/llms/flow-poster.md), [matrix-poster](https://insightcharts.dev/llms/matrix-poster.md), [network-poster](https://insightcharts.dev/llms/network-poster.md), [profile-poster](https://insightcharts.dev/llms/profile-poster.md), [radial-poster](https://insightcharts.dev/llms/radial-poster.md), [ranking-poster](https://insightcharts.dev/llms/ranking-poster.md), [scale-poster](https://insightcharts.dev/llms/scale-poster.md), [timeline-poster](https://insightcharts.dev/llms/timeline-poster.md)

## More examples

### Magenta, one dominant graphic, with download

```tsx
import { BigNumber, Poster, Treemap, WaffleChart } from "insightcharts";

<Poster
  theme="magenta"
  kicker="Food"
  title="Households in Norland threw away 61 kg of food per person in 2025"
  subtitle="Food thrown away at home, kilograms per person, by type of food."
  download
  panels={[
    {
      content: <Treemap
        data={[
          { food: "Vegetables", kg: 14.2 },
          { food: "Bread and bakery", kg: 11.5 },
          { food: "Fruit", kg: 9.8 },
          { food: "Dairy and eggs", kg: 8.1 },
          { food: "Cooked leftovers", kg: 7.6 },
          { food: "Meat and fish", kg: 5.3 },
          { food: "Drinks", kg: 2.7 },
          { food: "Other", kg: 1.8 },
        ]}
        name="food"
        value="kg"
        format="{value} kg"
        height={420}
      />,
      source: "Norland Waste Agency household survey",
    },
    {
      span: 6,
      title: "64% of the food thrown away could have been eaten",
      subtitle: "Each square is 1% of the weight thrown away",
      content: <WaffleChart
        data={[{ group: "Could have been eaten", share: 64 }]}
        name="group"
        value="share"
        total={100}
        restLabel="Peel, bones and shells"
        rows={5}
        height={190}
      />,
    },
    {
      span: 6,
      valign: "center",
      content: <BigNumber
        size="hero"
        value="€412"
        label="Cost of the food one household threw away in 2025"
        context="€388 in 2024"
      />,
    },
  ]}
  sources="Norland Waste Agency"
  note="Norland is an invented country. All figures are illustrative."
  credit="InsightCharts"
/>
```

### Dusk, gradient ground, fixed 4:5 shape

```tsx
import { BarChart, BigNumber, PictogramChart, Poster } from "insightcharts";

<Poster
  theme="dusk"
  aspect="4:5"
  maxWidth={820}
  columns={2}
  kicker="Energy"
  title="Solar supplied 31% of Port Alba's electricity in 2025"
  panels={[
    {
      span: 2,
      title: "Solar generated 3.1 TWh of the island's 10 TWh",
      content: <PictogramChart
        data={[
          { source: "Solar", twh: 3.1 },
          { source: "Wind", twh: 2.6 },
          { source: "Gas", twh: 2.9 },
          { source: "Hydro", twh: 1.4 },
        ]}
        name="source"
        value="twh"
        unit={0.2}
        unitLabel="0.2 TWh"
        icons={{ Solar: "solar-panel", Wind: "wind-turbine", Gas: "flame", Hydro: "drop" }}
        icon="bolt"
        highlight="Solar"
        format="{value} TWh"
      />,
    },
    {
      span: 2,
      title: "Solar's share was 51% in July and 8% in December",
      subtitle: "Solar share of electricity generated, by month, 2025",
      content: <BarChart
        data={[
          { month: "Jan", share: 9 },
          { month: "Feb", share: 14 },
          { month: "Mar", share: 24 },
          { month: "Apr", share: 35 },
          { month: "May", share: 44 },
          { month: "Jun", share: 49 },
          { month: "Jul", share: 51 },
          { month: "Aug", share: 46 },
          { month: "Sep", share: 36 },
          { month: "Oct", share: 24 },
          { month: "Nov", share: 13 },
          { month: "Dec", share: 8 },
        ]}
        x="month"
        y="share"
        orientation="vertical"
        sort="none"
        highlight="Jul"
        format="{value}%"
        height={240}
      />,
    },
    {
      span: 1,
      content: <BigNumber size="hero" value="31%" label="Solar share of electricity in 2025" />,
    },
    {
      span: 1,
      content: <BigNumber size="hero" value="12%" label="Solar share of electricity in 2020" />,
    },
  ]}
  sources="Port Alba Grid Operator"
  note="Port Alba is an invented island. All figures are illustrative."
  credit="InsightCharts"
/>
```

### Paper, three columns, solid rules, centred masthead

```tsx
import { BigNumber, IconStat, Poster, SegmentedBar } from "insightcharts";

<Poster
  theme="paper"
  columns={3}
  rules="solid"
  titleAlign="center"
  kicker="Libraries"
  title="Hollin Valley's libraries lent 318,000 items in 2025"
  subtitle="Loans from the valley's six public libraries, January to December 2025."
  panels={[
    {
      span: 2,
      title: "Printed books were 171,000 of the 318,000 loans",
      subtitle: "Loans by type of item, thousands",
      content: <SegmentedBar
        data={[
          { kind: "Printed books", items: 171 },
          { kind: "E-books", items: 74 },
          { kind: "Audiobooks", items: 48 },
          { kind: "Films and music", items: 25 },
        ]}
        name="kind"
        value="items"
        format="{value}k"
      />,
      source: "Hollin Valley Library Service",
    },
    {
      span: 1,
      valign: "center",
      content: <BigNumber size="hero" value="318,000" label="Items lent in 2025" context="301,000 in 2024" />,
    },
    {
      span: 3,
      content: <IconStat
        icon="book"
        count={3}
        total={10}
        value="3 in 10"
        text="residents borrowed at least one item in 2025."
      />,
    },
  ]}
  sources="Hollin Valley Library Service annual return"
  note="Hollin Valley is an invented place. All figures are illustrative."
  credit="InsightCharts"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/poster.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/molecules/poster.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
