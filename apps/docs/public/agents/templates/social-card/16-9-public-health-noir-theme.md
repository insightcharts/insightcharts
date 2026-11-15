# Reproduce the "16:9, public health, noir theme" example of the InsightCharts Social card

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "16:9, public health, noir theme" example of `social-card` (a template) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

A graphic that states one fact, at a fixed aspect ratio (1:1, 4:5, 16:9 or 9:16). It has a kicker, a headline, one exhibit, a source and a credit, painted on the theme surface. A button downloads the whole card as a PNG.

Use it when: Use it for one finding that will be shared in a feed, a slide or a chat thread with no text around it. State the fact with its number in the headline. Use one simple exhibit, such as one highlighted bar, one line or one number. Put the source and your name on the card, because it will be shared without the page. Use 1:1 or 4:5 for feeds, 16:9 for slides and link previews, 9:16 for stories.

Pick something else when: More than one fact or more than one exhibit (use `story-deck` for a sequence, `executive-brief` for a page). Charts that need a legend, small labels or hovering to read, because a shared image is not interactive. An exhibit with its own `title`, because the card's headline is the title.

Instructions for the alternatives: `executive-brief` https://insightcharts.dev/agents/templates/executive-brief.md, `story-deck` https://insightcharts.dev/agents/templates/story-deck.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/social-card
```

The file lands at `components/insightcharts/templates/social-card.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { SocialCard } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data.

## 4. Data

This component takes its content as props, listed under "Slots and content props" below. A chart nested in a slot holds its own `data` rows and field names.

## 5. The "16:9, public health, noir theme" example

This example sets `theme="noir"`, a built-in poster theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead.

```tsx
import { BarChart, SocialCard } from "insightcharts";

<SocialCard
  theme="noir"
  aspect="16:9"
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

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "noir",
  "aspect": "16:9",
  "kicker": "Public health",
  "title": "Reported measles cases in Europe rose from 61,000 in 2023 to 127,000 in 2024",
  "exhibit": {
    "type": "bar-chart",
    "data": [
      { "year": "2019", "cases": 106 },
      { "year": "2020", "cases": 12 },
      { "year": "2021", "cases": 0.2 },
      { "year": "2022", "cases": 0.9 },
      { "year": "2023", "cases": 61 },
      { "year": "2024", "cases": 127 }
    ],
    "x": "year",
    "y": "cases",
    "orientation": "vertical",
    "sort": "none",
    "highlight": "2024",
    "format": "{value}k",
    "subtitle": "Reported measles cases, WHO European Region, thousands"
  },
  "source": "WHO and UNICEF (rounded)",
  "note": "Figures are approximate, for illustration",
  "credit": "Data desk",
  "type": "social-card"
}
```

## Slots and content props

These props hold the content. A prop typed `Slot` takes a nested spec (`{ type, ...props }`) or a React element. A prop typed `InsightSpec` takes a spec object only.

- `exhibit`, `Slot`: The one exhibit. A chart spec is given the height left in the card (any `height` you set wins); leave out its `title`. In the example: a `bar-chart` spec with 6 rows.

To swap in the user's data:

1. Keep `type` and the layout props. Replace every `data` array with the user's rows.
2. Next to each `data`, change the field-name props (`x`, `y`, `name`, `value` and so on) to the user's column names.
3. Rewrite every `title`, `subtitle`, `label` and source line from the user's data. Work out every number in the text from the rows.
4. Remove an optional region or slot you have no data for. Do not leave example data in place.
5. A slot takes any component. The instructions for the component you nest are at `https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md`.

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
| `theme` | `ThemeInput` |  | A built-in theme name (`"magenta"`, `"noir"`, `"editorial"`...) or a theme object, passed on to the exhibit. A named theme with its own surface paints the card in that surface; the download button stays in the page's theme. |
| `mode` | `"auto" \| "system" \| "light" \| "dark"` | `"auto"` | Colour mode. |

This is an HTML component. It takes only the props above. It does not take the common chart props (`data`, `highlight`, `annotations` and so on) unless they are listed.

## Composition

- Built from: `bar-chart` (atom), `big-number` (atom), `waffle-chart` (atom), `area-chart` (atom), `source-note` (atom)
- Used by: no molecule or template yet.

## Rules for this form

- Each chart inside follows the rules of its own component.
- Every chart inside needs its own `title` that states one fact, or a plain label.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The component renders as HTML text in reading order, so it needs no alt text of its own.
- Set `level` to the heading level that fits the page outline.
- Each chart nested inside is an image with a generated description. Set `alt` and `table` on a nested chart spec as you would on the chart alone.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/templates/social-card.md
- Component reference with every example: https://insightcharts.dev/llms/social-card.md
- Registry item: https://insightcharts.dev/r/social-card.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/templates/social-card.tsx
- How to choose a different template: https://insightcharts.dev/agents/templates.md
- This page: https://insightcharts.dev/templates/social-card#example-16-9-public-health-noir-theme
- These instructions as plain text: https://insightcharts.dev/agents/templates/social-card/16-9-public-health-noir-theme.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
