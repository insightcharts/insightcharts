# Explainer (`explainer`)

> A vertical infographic in one narrow column. It opens with a big number or a proportion statement (`hook`), then the hero exhibit, then numbered sections with one exhibit each, a conclusion with an optional link, and sources.

- Component: `Explainer` (import from `insightcharts`)
- Spec type: `"explainer"`
- Level: template. Category: story.
- An HTML component: it takes only the props listed below, plus `theme`, `mode`, `className` and `style` where its source declares them. It does not take the common chart props.

## When to use

Use it to explain one subject to a general audience in a single narrow column. The column also works as a tall image or on a phone screen. State the main finding with its number in the headline and repeat the main number in `hook`. Make the hero exhibit the largest thing on the page. Give each numbered section one heading, one exhibit and one sentence with its main number. Write each section so it can be read without the others. Keep one accent colour on the subject (`highlight`) throughout.

## Avoid

Findings that need caveats and separate interpretation (use `report-page`). A chart that has to change step by step (use `visual-essay` with a scrolly block). More than five sections, because readers stop before the end.

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/explainer
```

The file lands at `components/insightcharts/templates/explainer.tsx`. `@insightcharts/explainer-demo` adds a ready-made example next to it.

## Usage

```tsx
import { BarChart, Explainer, IconStat } from "insightcharts";

<Explainer
  kicker="Food and climate"
  title="Households threw away 631 million tonnes of food in 2022"
  deck="That is 60% of the 1.05 billion tonnes of food wasted worldwide. Food service wasted 290 million tonnes and retail 131 million."
  hook={{
    value: 19,
    total: 100,
    text: "tonnes of food that reach shops, restaurants and homes are thrown away.",
    detail: "That was 1.05 billion tonnes in 2022.",
  }}
  hero={<BarChart
    data={[
      { sector: "Households", mt: 631 },
      { sector: "Food service", mt: 290 },
      { sector: "Retail", mt: 131 },
    ]}
    x="sector"
    y="mt"
    sort="none"
    orientation="horizontal"
    highlight="Households"
    format="{value} Mt"
    title="Households produced 60% of the world's food waste in 2022"
    subtitle="Food waste by sector, million tonnes (Mt), 2022"
    source="UNEP Food Waste Index Report 2024"
    note="Figures are approximate, for illustration"
  />}
  heroText="Food service produced 290 million tonnes, or 28%. Retail produced 131 million tonnes, or 12%."
  sections={[
    {
      title: "Household food waste by income group",
      text: "Households in high-income countries waste 81 kg of food per person a year. In upper-middle-income countries the figure is 88 kg. In lower-middle-income countries it is 86 kg.",
      exhibit: <BarChart
        data={[
          { group: "High income", kg: 81 },
          { group: "Upper-middle", kg: 88 },
          { group: "Lower-middle", kg: 86 },
        ]}
        x="group"
        y="kg"
        sort="none"
        orientation="horizontal"
        format="{value} kg"
        subtitle="Household food waste per person per year, by country income group"
      />,
      takeaway: "The three income groups are within 7 kg per person of each other.",
    },
    {
      title: "Lost and wasted food causes 4.4 billion tonnes of emissions a year",
      text: "Growing, transporting and chilling food uses land, fertiliser and fuel. Food releases methane when it rots. Lost and wasted food causes 8 to 10% of global greenhouse gas emissions.",
      exhibit: <BarChart
        data={[
          { emitter: "China", gt: 13 },
          { emitter: "United States", gt: 6 },
          { emitter: "Wasted food", gt: 4.4 },
          { emitter: "India", gt: 3.9 },
          { emitter: "European Union", gt: 3.4 },
        ]}
        x="emitter"
        y="gt"
        sort="desc"
        orientation="horizontal"
        highlight="Wasted food"
        format="{value} Gt"
        subtitle="Annual greenhouse gas emissions, billion tonnes of CO2 equivalent. Wasted food includes losses before retail"
      />,
      takeaway: "Only China and the United States emit more than lost and wasted food.",
    },
    {
      title: "733 million people faced hunger in 2023",
      exhibit: <IconStat
        icon="person"
        count={1}
        total={11}
        columns={11}
        text="people in the world faced hunger in 2023."
      />,
    },
  ]}
  conclusion={{
    title: "The UN target is to halve food waste by 2030",
    text: "Britain and Japan publish household food waste figures. Britain has cut household waste by 18% and Japan by 31%.",
    points: [
      "Measure household food waste and publish the figure every year.",
      "State on packaging that “best before” refers to quality and “use by” refers to safety.",
      "Plan meals before shopping and freeze food that will not be eaten in time.",
    ],
    action: {
      label: "Read the UNEP report",
      href: "https://www.unep.org/resources/publication/food-waste-index-report-2024",
    },
  }}
  sources={[
    {
      name: "UNEP Food Waste Index Report 2024",
      url: "https://www.unep.org/resources/publication/food-waste-index-report-2024",
    },
    "FAO, State of Food Security and Nutrition in the World 2024",
    "Emissions figures rounded from national inventories",
  ]}
  note="Figures are approximate, for illustration"
  period="2022 (waste), 2023 (hunger and emissions)"
  method="Food waste is measured at retail, food service and household level and includes inedible parts. Losses on farms and in transport are counted separately."
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "explainer",
  "kicker": "Food and climate",
  "title": "Households threw away 631 million tonnes of food in 2022",
  "deck": "That is 60% of the 1.05 billion tonnes of food wasted worldwide. Food service wasted 290 million tonnes and retail 131 million.",
  "hook": {
    "value": 19,
    "total": 100,
    "text": "tonnes of food that reach shops, restaurants and homes are thrown away.",
    "detail": "That was 1.05 billion tonnes in 2022."
  },
  "hero": {
    "type": "bar-chart",
    "data": [
      { "sector": "Households", "mt": 631 },
      { "sector": "Food service", "mt": 290 },
      { "sector": "Retail", "mt": 131 }
    ],
    "x": "sector",
    "y": "mt",
    "sort": "none",
    "orientation": "horizontal",
    "highlight": "Households",
    "format": "{value} Mt",
    "title": "Households produced 60% of the world's food waste in 2022",
    "subtitle": "Food waste by sector, million tonnes (Mt), 2022",
    "source": "UNEP Food Waste Index Report 2024",
    "note": "Figures are approximate, for illustration"
  },
  "heroText": "Food service produced 290 million tonnes, or 28%. Retail produced 131 million tonnes, or 12%.",
  "sections": [
    {
      "title": "Household food waste by income group",
      "text": "Households in high-income countries waste 81 kg of food per person a year. In upper-middle-income countries the figure is 88 kg. In lower-middle-income countries it is 86 kg.",
      "exhibit": {
        "type": "bar-chart",
        "data": [
          { "group": "High income", "kg": 81 },
          { "group": "Upper-middle", "kg": 88 },
          { "group": "Lower-middle", "kg": 86 }
        ],
        "x": "group",
        "y": "kg",
        "sort": "none",
        "orientation": "horizontal",
        "format": "{value} kg",
        "subtitle": "Household food waste per person per year, by country income group"
      },
      "takeaway": "The three income groups are within 7 kg per person of each other."
    },
    {
      "title": "Lost and wasted food causes 4.4 billion tonnes of emissions a year",
      "text": "Growing, transporting and chilling food uses land, fertiliser and fuel. Food releases methane when it rots. Lost and wasted food causes 8 to 10% of global greenhouse gas emissions.",
      "exhibit": {
        "type": "bar-chart",
        "data": [
          { "emitter": "China", "gt": 13 },
          { "emitter": "United States", "gt": 6 },
          { "emitter": "Wasted food", "gt": 4.4 },
          { "emitter": "India", "gt": 3.9 },
          { "emitter": "European Union", "gt": 3.4 }
        ],
        "x": "emitter",
        "y": "gt",
        "sort": "desc",
        "orientation": "horizontal",
        "highlight": "Wasted food",
        "format": "{value} Gt",
        "subtitle": "Annual greenhouse gas emissions, billion tonnes of CO2 equivalent. Wasted food includes losses before retail"
      },
      "takeaway": "Only China and the United States emit more than lost and wasted food."
    },
    {
      "title": "733 million people faced hunger in 2023",
      "exhibit": {
        "type": "icon-stat",
        "icon": "person",
        "count": 1,
        "total": 11,
        "columns": 11,
        "text": "people in the world faced hunger in 2023."
      }
    }
  ],
  "conclusion": {
    "title": "The UN target is to halve food waste by 2030",
    "text": "Britain and Japan publish household food waste figures. Britain has cut household waste by 18% and Japan by 31%.",
    "points": [
      "Measure household food waste and publish the figure every year.",
      "State on packaging that “best before” refers to quality and “use by” refers to safety.",
      "Plan meals before shopping and freeze food that will not be eaten in time."
    ],
    "action": {
      "label": "Read the UNEP report",
      "href": "https://www.unep.org/resources/publication/food-waste-index-report-2024"
    }
  },
  "sources": [
    {
      "name": "UNEP Food Waste Index Report 2024",
      "url": "https://www.unep.org/resources/publication/food-waste-index-report-2024"
    },
    "FAO, State of Food Security and Nutrition in the World 2024",
    "Emissions figures rounded from national inventories"
  ],
  "note": "Figures are approximate, for illustration",
  "period": "2022 (waste), 2023 (hunger and emissions)",
  "method": "Food waste is measured at retail, food service and household level and includes inedible parts. Losses on farms and in transport are counted separately."
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` (required) | `string` |  | The main finding, as one plain sentence with the number and the period in it. |
| `kicker` | `string` |  | Small label above the title. |
| `deck` | `string` |  | One-sentence standfirst. |
| `byline` | `string` |  | Author line. |
| `date` | `string` |  | Publication date. |
| `hook` | `{ value, total?, text?, figure?, visual?, icon?, detail?, label?, context?, format? } \| Slot` |  | The opening number. With `text` it renders a `proportion-statement` ("19 in every 100 ..."); with `label` a hero `big-number`. A spec or element is rendered as given. |
| `hero` | `Slot` |  | The main exhibit. Its `title` states one fact with its number. Default height 360px. |
| `heroText` | `string` |  | One or two sentences under the hero. Each states one more fact. |
| `sections` | `{ title, text?, exhibit?, takeaway?, id? }[]` |  | Numbered sections. Each has a heading, one exhibit and a `takeaway` sentence with its main number. |
| `screenful` | `boolean` | `false` | Give every section at least the height of the viewport and centre its content, so each fills a screen. |
| `conclusion` | `{ title, text?, points?, action?: { label, href } }` |  | The closing block: a heading, text, a list of actions and an optional link. |
| `sources` | `string \| { name, url? } \| (string \| { name, url? })[]` |  | Where the data comes from, shown in the closing source note. Entries with a `url` are linked. |
| `period` | `string` |  | The period the data covers. |
| `method` | `string` |  | How the numbers were produced: definitions, adjustments, exclusions. |
| `note` | `string` |  | Caveats the reader should know, e.g. "Illustrative data". |
| `credit` | `string` |  | Who made the piece. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Heading level of the title; section headings follow one level down. |
| `maxWidth` | `number \| string` |  | Widest the piece may get. It is centred in wider containers. |
| `theme` | `ThemeInput` |  | Theme override, passed on to everything inside. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode, passed on to everything inside. |

## Composition

- Composes: [headline](https://insightcharts.dev/llms/headline.md), [big-number](https://insightcharts.dev/llms/big-number.md), [proportion-statement](https://insightcharts.dev/llms/proportion-statement.md), [step-marker](https://insightcharts.dev/llms/step-marker.md), [prose](https://insightcharts.dev/llms/prose.md), [callout](https://insightcharts.dev/llms/callout.md), [source-note](https://insightcharts.dev/llms/source-note.md), [bar-chart](https://insightcharts.dev/llms/bar-chart.md), [icon-stat](https://insightcharts.dev/llms/icon-stat.md), [line-chart](https://insightcharts.dev/llms/line-chart.md), [segmented-bar](https://insightcharts.dev/llms/segmented-bar.md)
- Used by: no molecule or template yet

## More examples

### Personal finance, opening with a big number

```tsx
import { BarChart, Explainer, LineChart, SegmentedBar } from "insightcharts";

<Explainer
  kicker="Money basics"
  title="Starting to save at 35 instead of 25 leaves $296,000 less at 65"
  deck="Both savers put in $300 a month at a 6% real return. The saver who starts at 25 has $597,000 at 65. The saver who starts at 35 has $301,000."
  hook={{
    value: 296000,
    format: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
    label: "Difference at 65 between starting at 25 and starting at 35",
    context: "Saving $300 a month until 65 at a 6% real return gives $597k from age 25 and $301k from age 35",
  }}
  hero={<LineChart
    data={[
      { age: "25", saver: "Starts at 25", balance: 0 },
      { age: "30", saver: "Starts at 25", balance: 20931 },
      { age: "35", saver: "Starts at 25", balance: 49164 },
      { age: "35", saver: "Starts at 35", balance: 0 },
      { age: "40", saver: "Starts at 25", balance: 87246 },
      { age: "40", saver: "Starts at 35", balance: 20931 },
      { age: "45", saver: "Starts at 25", balance: 138612 },
      { age: "45", saver: "Starts at 35", balance: 49164 },
      { age: "50", saver: "Starts at 25", balance: 207898 },
      { age: "50", saver: "Starts at 35", balance: 87246 },
      { age: "55", saver: "Starts at 25", balance: 301355 },
      { age: "55", saver: "Starts at 35", balance: 138612 },
      { age: "60", saver: "Starts at 25", balance: 427413 },
      { age: "60", saver: "Starts at 35", balance: 207898 },
      { age: "65", saver: "Starts at 25", balance: 597447 },
      { age: "65", saver: "Starts at 35", balance: 301355 },
    ]}
    x="age"
    y="balance"
    series="saver"
    highlight="Starts at 25"
    format="compact"
    zero
    height={320}
    title="At 50 the saver who started at 25 has $208,000 and the other has $87,000"
    subtitle="Balance by age, $300 a month at a 6% real annual return"
    note="Illustrative calculation"
  />}
  heroText="The saver who starts at 25 deposits $36,000 more. The other $260,000 of the difference is investment growth."
  sections={[
    {
      title: "Deposits are $144,000 of the $597,000",
      text: "The saver who starts at 25 pays in $300 a month for 40 years. The other $453,000 is growth.",
      exhibit: <SegmentedBar
        data={[{ part: "Deposits", usd: 144000 }, { part: "Growth", usd: 453447 }]}
        name="part"
        value="usd"
        format="compact"
        highlight="Growth"
      />,
      takeaway: "Growth is 76% of the final balance.",
    },
    {
      title: "A 1.5% annual fee leaves $402,000 instead of $566,000",
      text: "The index fund charges 0.2% a year. The managed fund charges 1.5%. After 40 years the managed fund's balance is 29% lower.",
      exhibit: <BarChart
        data={[
          { fund: "Index fund, 0.2% a year", balance: 566005 },
          { fund: "Managed fund, 1.5% a year", balance: 402345 },
        ]}
        x="fund"
        y="balance"
        sort="none"
        orientation="horizontal"
        format="compact"
        highlight="Index fund, 0.2% a year"
      />,
    },
  ]}
  conclusion={{
    title: "What to do",
    points: [
      "Set up a monthly standing order this month.",
      "Choose a broad index fund with a fee of about 0.2% a year.",
      "Increase the monthly amount each time your pay rises.",
    ],
  }}
  sources="Author's calculation"
  method="Monthly compounding at a constant real return of 6% a year. Fees are subtracted from the return. Real returns vary from year to year."
  note="Illustrative data. Not financial advice."
/>
```

## Links

- Registry item: https://insightcharts.dev/r/explainer.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/explainer.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
