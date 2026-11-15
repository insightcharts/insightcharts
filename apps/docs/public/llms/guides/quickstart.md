# Quickstart

## Install

```bash
npm install insightcharts echarts
```

`react` (18 or later), `react-dom` and `echarts` (6 or later) are peer dependencies. There is no stylesheet to import: the small amount of CSS the figure chrome needs is injected once at runtime.

To copy component source into your project instead (so you can edit it), use the shadcn registry. The engine still comes from the npm package.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json
npx shadcn@latest add @insightcharts/bar-chart
```

## A first chart

```tsx
import { BarChart } from "insightcharts";

const data = [
  { country: "Norway", share: 98 },
  { country: "Brazil", share: 89 },
  { country: "Canada", share: 68 },
];

export function Renewables() {
  return (
    <BarChart
      data={data}
      x="country"
      y="share"
      format="{value}%"
      highlight="Norway"
      title="Renewables supplied 98% of Norway's electricity in 2023"
      subtitle="Share of electricity generation from renewables, 2023"
      source="Ember"
    />
  );
}
```

Every chart follows the same shape:

1. `data`: rows (or CSV text, a URL, a function; see the data guide).
2. Field names as strings: `x`, `y`, `series`. No accessors, no functions.
3. Text: `title` (one plain statement of what the data shows, with its number and period, or a plain label), `subtitle` (measure, unit, population, period), `source`, `note`. The rules for writing them are in "Choosing a form".
4. Emphasis: `highlight` names the entity the title is about, and the other series are drawn in grey. `annotations` mark a date, a threshold or a single value.

The chart draws its own title, legend, source line, loading skeleton, error message and empty state ("No data to show."). It sizes to its container; `height` defaults to 360, or pass `aspect` (width divided by height).

## The same chart as JSON

```tsx
import { Insight } from "insightcharts";

<Insight spec={{ type: "bar-chart", data, x: "country", y: "share", title: "Renewables supplied 98% of Norway's electricity in 2023" }} />
```

Use JSX when you are writing a page. Use a spec when the chart is chosen at runtime (by an agent, a CMS, an API). See the JSON spec guide.

## Server and client components

- `insightcharts`, `insightcharts/core`, `insightcharts/story` and `insightcharts/themes` are client modules (the built files start with `"use client"`). In Next.js you can import a chart into a server component and pass it serialisable props.
- `insightcharts/data` is server-safe. Load on the server and pass rows down:

```tsx
import { loadData, transformRows } from "insightcharts/data";
import { LineChart } from "insightcharts";

export default async function Page() {
  const rows = await loadData("https://example.com/energy.csv");
  return <LineChart data={rows} x="year" y="solar" title="Solar generation by year" />;
}
```

- Function props (`onSelect`, `onEvents`, `onReady`, a function `option`, a function `format`, a function `transform`, a function `data`) cannot cross the server/client boundary. Put the chart in a file that starts with `"use client"` when you need them.

## Optional provider

Charts work with no provider. `InsightProvider` sets defaults for everything beneath it, and providers nest.

```tsx
import { InsightProvider } from "insightcharts";

<InsightProvider theme={{ accent: "#7c3aed" }} mode="auto" locale="en-GB" exportable>
  {children}
</InsightProvider>
```

Its props: `theme`, `mode` (`"auto"`, `"system"`, `"light"`, `"dark"`), `renderer` (`"auto"`, `"svg"`, `"canvas"`), `locale`, `animate`, `exportable`, `lazy`.

Defaults: `lazy` is true, so a chart mounts when it scrolls within 200px of the viewport. `renderer="auto"` uses SVG up to about 1,500 marks and canvas beyond. Animation is skipped when the reader prefers reduced motion.

## Custom ECharts options

- `option`: an ECharts option deep-merged over the generated one, or a function `(option, ctx) => option`.
- `onReady(chart)` and a ref (`getInstance()`, `getOption()`, `export()`) give you the ECharts instance.
- `Chart` and `Figure` from `insightcharts/core` render a raw ECharts option inside the same figure chrome when no component fits. Core registers no series types itself, so register the ones you draw: `echarts.use([ScatterChart])` with `echarts` from `insightcharts/core` and `ScatterChart` from `echarts/charts`.

## Components

**Atoms (61)**

- [arc-diagram](https://insightcharts.dev/llms/arc-diagram.md): Places entities in order on a line and joins each related pair with a semicircular arc whose thickness is the value of the connection; dots are sized by each entity's total.
- [area-chart](https://insightcharts.dev/llms/area-chart.md): Shows a quantity over time as a filled area from zero: one series, stacked series, shares of 100%, or a streamgraph.
- [arrow-chart](https://insightcharts.dev/llms/arrow-chart.md): Draws an arrow per category from a start value to an end value, showing the direction and size of each shift.
- [bar-chart](https://insightcharts.dev/llms/bar-chart.md): Compares a value across categories with bars from a zero baseline.
- [beeswarm-chart](https://insightcharts.dev/llms/beeswarm-chart.md): Shows a distribution as one dot per row along a value axis, with dots stacked sideways where they would collide.
- [big-number](https://insightcharts.dev/llms/big-number.md): A featured statistic with its label, change and the context that gives it meaning.
- [block-bar](https://insightcharts.dev/llms/block-bar.md): Compares 3 to 12 values as thick rounded bars from a zero baseline, with each value printed inside the end of its bar and the category beneath.
- [box-plot](https://insightcharts.dev/llms/box-plot.md): Summarises a numeric field per group as median, quartile box, whiskers and outlier dots, computed from raw rows.
- [bubble-network](https://insightcharts.dev/llms/bubble-network.md): Draws a small set of circles sized by value and joined by thin lines, with one circle highlighted and tagged.
- [bubble-scale](https://insightcharts.dev/llms/bubble-scale.md): Places circles sized by one measure along a single value scale set by another, spread sideways so none overlap, with boxed scale marks instead of an axis.
- [bullet-chart](https://insightcharts.dev/llms/bullet-chart.md): Compares one measure per row with its target, optionally against qualitative bands such as poor / fair / good.
- [bump-chart](https://insightcharts.dev/llms/bump-chart.md): Shows how the ranking of entities changes over time, with rank 1 at the top and each line named at its end.
- [calendar-heatmap](https://insightcharts.dev/llms/calendar-heatmap.md): Colours every day of one or more years by a value, laid out as a grid of weeks.
- [callout](https://insightcharts.dev/llms/callout.md): A boxed statement of fact with a short bold lead and a sentence of explanation. The tone is marked by icon and tint.
- [choropleth-map](https://insightcharts.dev/llms/choropleth-map.md): Colours the regions of a map by a normalised value, from GeoJSON you supply.
- [circle-pack](https://insightcharts.dev/llms/circle-pack.md): Shows parts as tightly packed circles sized by value, optionally clustered into groups, with the value and name printed inside each circle.
- [curve-rank](https://insightcharts.dev/llms/curve-rank.md): Places each entity on two parallel scales, one per measure, and joins its two positions with a smooth S-curve labelled with the name and both values.
- [data-table](https://insightcharts.dev/llms/data-table.md): A restrained editorial table from rows and a column config: aligned tabular numbers, an optional in-cell bar, row highlight and click-to-sort headers.
- [delta](https://insightcharts.dev/llms/delta.md): An inline change indicator: direction arrow, signed value and an optional baseline label.
- [diverging-bar-chart](https://insightcharts.dev/llms/diverging-bar-chart.md): Draws bars either side of a centre line: positive against negative values, or stacked agree / disagree responses around a neutral midpoint.
- [donut-chart](https://insightcharts.dev/llms/donut-chart.md): Shows how 2 to 5 parts make up one whole, with each slice labelled by name and share.
- [dumbbell-chart](https://insightcharts.dev/llms/dumbbell-chart.md): Shows two values per category as dots joined by a line, so the length of the line shows the difference.
- [fan-flow](https://insightcharts.dev/llms/fan-flow.md): One solid block that splits into curved ribbons, each as thick as its value, ending at an aligned column of names, values and shares.
- [funnel-chart](https://insightcharts.dev/llms/funnel-chart.md): Shows how many remain at each step of a sequence, with conversion and drop-off between steps.
- [glyph-table](https://insightcharts.dev/llms/glyph-table.md): A table with one row per entity in which every number is drawn as a small form chosen per column (counted dots, squares or icons, a ring, a sized circle, a bar) with the value printed beside it.
- [headline](https://insightcharts.dev/llms/headline.md): The opening block of a piece or section: kicker, title, one-sentence deck and a byline/date line.
- [heatmap](https://insightcharts.dev/llms/heatmap.md): Colours a category-by-category (or time-by-category) grid by a numeric value, using a sequential or diverging scale.
- [histogram](https://insightcharts.dev/llms/histogram.md): Bins a numeric field and shows how many rows fall in each bin, as touching bars on a continuous axis.
- [icon-array-grid](https://insightcharts.dev/llms/icon-array-grid.md): Compares many counts as a grid of labelled tiles, each holding an array of N icons with its name and number.
- [icon-stat](https://insightcharts.dev/llms/icon-stat.md): A "1 in 4"-style statement: a row or grid of simple glyphs with some filled, and the sentence they illustrate.
- [legend-key](https://insightcharts.dev/llms/legend-key.md): A standalone colour key: categorical swatches, or a sequential/diverging ramp with end labels.
- [line-chart](https://insightcharts.dev/llms/line-chart.md): Shows how one or more values change over time or another ordered dimension.
- [lollipop-chart](https://insightcharts.dev/llms/lollipop-chart.md): Ranks categories with a dot on a thin stem from zero, or as a stemless dot plot on a free scale.
- [nested-shares](https://insightcharts.dev/llms/nested-shares.md): Shows several shares of the same whole, such as one share at five dates, as outlines nested from one corner of a square, each enclosing an area equal to its share.
- [orbit-chart](https://insightcharts.dev/llms/orbit-chart.md): Places items as dots on concentric rings round a centre, one ring per category, level or period, with a key that explains rings, angle and dot area.
- [pictogram-chart](https://insightcharts.dev/llms/pictogram-chart.md): Compares quantities with rows of repeated icons, each icon standing for a fixed number of units.
- [pill-rank](https://insightcharts.dev/llms/pill-rank.md): Shows a ranked list as horizontally centred rounded bars, with each name in capitals on its pill, the value at the left edge and the rank at the right.
- [progress-meter](https://insightcharts.dev/llms/progress-meter.md): A labelled horizontal meter of one value against a maximum or target, with the target marked and the value printed.
- [proportional-area](https://insightcharts.dev/llms/proportional-area.md): Compares two to eight values as squares or circles whose areas are proportional to the values, each printed with its name and number.
- [prose](https://insightcharts.dev/llms/prose.md): A readable block of narration at a 45-75 character measure, for the text between charts.
- [pull-quote](https://insightcharts.dev/llms/pull-quote.md): A large quotation with its attribution.
- [radial-bar-chart](https://insightcharts.dev/llms/radial-bar-chart.md): Draws bars around a circle for data that repeats in a cycle, such as hours of the day or months of the year.
- [radial-spokes](https://insightcharts.dev/llms/radial-spokes.md): Draws one spoke per row radiating from a centre disc, each as long as its value, with the name and value set on an outer ring.
- [ribbon-chart](https://insightcharts.dev/llms/ribbon-chart.md): One filled band per entity across periods: its thickness is its value in each period and its vertical position is its rank, so bands cross as the order changes.
- [sankey-chart](https://insightcharts.dev/llms/sankey-chart.md): Shows how a quantity flows from sources through stages to destinations, with link width proportional to the flow.
- [scale-ladder](https://insightcharts.dev/llms/scale-ladder.md): A tall vertical band graded along one scale (linear or log, running up or down) with each item placed at its true position and labelled with an icon, its name and its value on alternating sides.
- [scatter-chart](https://insightcharts.dev/llms/scatter-chart.md): Plots two numeric measures against each other, one dot per row, with optional bubble size, group colour, selective labels and a trend line.
- [segmented-bar](https://insightcharts.dev/llms/segmented-bar.md): Splits one whole into proportional segments along a single horizontal bar.
- [shape-fill](https://insightcharts.dev/llms/shape-fill.md): Shows one or more percentages as icon silhouettes filled from the bottom to that level, with the number printed large beside each.
- [slope-chart](https://insightcharts.dev/llms/slope-chart.md): Connects each entity's value at two (or a few) points with a straight line, labelled with name and value at both ends.
- [small-multiples](https://insightcharts.dev/llms/small-multiples.md): Repeats one small line, area or bar chart per value of a facet field on a shared scale, each panel titled.
- [source-note](https://insightcharts.dev/llms/source-note.md): A sourcing footer for a whole piece: sources with optional links, the period covered, method, caveats and credit.
- [sparkline](https://insightcharts.dev/llms/sparkline.md): A word-sized line or bar series without axes, with the latest point marked.
- [stat-circles](https://insightcharts.dev/llms/stat-circles.md): Shows a few related magnitudes as plain circles sized by area, each with its number set large and a short label.
- [stat-tile](https://insightcharts.dev/llms/stat-tile.md): A compact KPI tile: label, value, change against a baseline and an optional graphic. Twenty variants display the same data as a card, a trend, progress toward a target, a comparison, a breakdown, a rank or a count of icons.
- [step-marker](https://insightcharts.dev/llms/step-marker.md): A numbered chapter or step heading ("01 — Electricity sources in 2015") for sequencing the sections of a story.
- [strip-plot](https://insightcharts.dev/llms/strip-plot.md): Shows every observation as a tick or dot along a value axis, one row per category.
- [timeline-chart](https://insightcharts.dev/llms/timeline-chart.md): Places events and spans on a time axis in labelled lanes, with each item named directly.
- [treemap](https://insightcharts.dev/llms/treemap.md): Shows parts of a whole as nested rectangles sized by value, optionally grouped into categories.
- [unit-blocks](https://insightcharts.dev/llms/unit-blocks.md): Shows the size of each group as a solid block of small icons, one icon per fixed number of units.
- [waffle-chart](https://insightcharts.dev/llms/waffle-chart.md): Shows shares of a whole as counted cells in a grid, such as 37 in every 100.

**Molecules (19)**

- [annotated-timeline](https://insightcharts.dev/llms/annotated-timeline.md): A vertical sequence of dated events along a rail, each with a short explanation and, optionally, a small chart or figure.
- [before-after](https://insightcharts.dev/llms/before-after.md): Two states of one measure side by side, as figures, stat tiles of any variant or small charts, with the change between them stated in the middle.
- [chart-callout](https://insightcharts.dev/llms/chart-callout.md): A chart with a callout beside it that states the main fact. In narrow containers the callout goes underneath.
- [chart-tabs](https://insightcharts.dev/llms/chart-tabs.md): One chart frame with a segmented control that switches between several views of the same data, morphing between views that share a chart type.
- [comparison-table](https://insightcharts.dev/llms/comparison-table.md): A table whose rows carry inline sparklines, deltas and in-cell bars beside their exact values, from rows and a column config.
- [filter-chips](https://insightcharts.dev/llms/filter-chips.md): The active crossfilter selections of the surrounding `InsightData`, shown as removable chips with a reset control.
- [hero-figure](https://insightcharts.dev/llms/hero-figure.md): The opening exhibit of a piece: kicker, headline and deck above one large chart, with a source line underneath.
- [kpi-grid](https://insightcharts.dev/llms/kpi-grid.md): A responsive grid of trend cards drawn from one dataset: each metric shows its latest value, its change and a graphic, in one `stat-tile` variant or a deliberate mix of them.
- [linked-charts](https://insightcharts.dev/llms/linked-charts.md): Two to four charts over one shared dataset in a responsive grid: clicking a mark in one filters the others, with the active filters shown as removable chips.
- [metric-breakdown](https://insightcharts.dev/llms/metric-breakdown.md): A headline number with its composition underneath: one segmented bar and a key giving each part's value and share.
- [poster](https://insightcharts.dev/llms/poster.md): The sheet an infographic is composed on. It paints a full-bleed ground from a poster theme, forces one theme and colour mode on everything inside, and lays out a masthead, a grid of panels and a footer. It can save the whole sheet as one PNG.
- [proportion-statement](https://insightcharts.dev/llms/proportion-statement.md): A share stated as a countable sentence ("37 in every 100…"): a waffle grid or a row of icons beside the statement in large type, with the number emphasised.
- [quote-figure](https://insightcharts.dev/llms/quote-figure.md): A pull-quote paired with the statistic or small chart that backs it up, side by side and stacking in narrow containers.
- [ranked-list](https://insightcharts.dev/llms/ranked-list.md): A ranking as a list: position, name, value and a thin in-row bar, with an optional change indicator and highlighted rows.
- [scrolly-chart](https://insightcharts.dev/llms/scrolly-chart.md): A scroll-driven story from JSON: one base chart spec and a list of steps, each with narration and a patch of chart props applied while that step is active.
- [section](https://insightcharts.dev/llms/section.md): A story section: a numbered step marker or a headline, introductory prose, then one or more exhibits in a responsive one- to three-column grid.
- [small-multiple-grid](https://insightcharts.dev/llms/small-multiple-grid.md): Repeats any chart spec once per value of a facet field, each panel with its own filtered rows and a title, in a grid that follows the container width.
- [stat-row](https://insightcharts.dev/llms/stat-row.md): Two to five key figures in one row, as open numbers separated by hairlines or as stat tiles of any variant, collapsing to two columns and then one as the container narrows.
- [trend-card](https://insightcharts.dev/llms/trend-card.md): A KPI card computed from a series: the latest value, its change against a baseline in the same data, and a trend graphic, in any `stat-tile` variant.

**Templates (20)**

- [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md): A landscape spread of up to eleven small illustrations of one subject, each a different graphic form, in three bands of unequal panels: a statement in large type, spokes round an icon and a network of circles; a smooth trend with its peak labelled, nested squares and a slope chart; a pill ranking, a treemap, a tile map and sized circles; and a closing row of icon statements.
- [comparison-brief](https://insightcharts.dev/llms/comparison-brief.md): A compared with B on one page. It has a headline that states the result, the headline figures mirrored either side of their labels, one hero exhibit that shows both sides, paired exhibits on a shared scale, a verdict callout and a source note.
- [count-poster](https://insightcharts.dev/llms/count-poster.md): A poster that counts at scale. Blocks of thousands of unit icons fill most of the sheet, a second band counts reference groups with the same icon at the same size in a muted colour, and a bottom row holds three small graphics: squares sized by area with a ratio bracket, thick bars with the numbers inside, and shares as nested outlines or filled silhouettes.
- [data-explorer](https://insightcharts.dev/llms/data-explorer.md): A set of linked charts over one shared dataset that filter each other. It has a headline, a sentence of instructions with filter chips, a row of figures that recompute from the filtered rows, two to four charts and an optional detail table. It opens on selections the author chooses.
- [executive-brief](https://insightcharts.dev/llms/executive-brief.md): A one-page summary. It has a headline that states the main finding with its number, a deck, a row of three or four key figures, one hero chart with a takeaway callout, two smaller supporting exhibits, a short list of actions and a source note.
- [explainer](https://insightcharts.dev/llms/explainer.md): A vertical infographic in one narrow column. It opens with a big number or a proportion statement (`hook`), then the hero exhibit, then numbered sections with one exhibit each, a conclusion with an optional link, and sources.
- [flow-poster](https://insightcharts.dev/llms/flow-poster.md): A portrait poster of where something comes from and where it goes, in three stacked bands painted in one colour: the producers as large labelled tiles, the leading producer's output fanning out as ribbons to an aligned column of destinations, and the destinations as bubbles on a scale of how much each depends on that producer.
- [matrix-poster](https://insightcharts.dev/llms/matrix-poster.md): One wide landscape graphic that compares 4 to 12 entities on five to seven measures: two measures as S-curves between parallel scales on the left, joined to a table on the right in which every other number is drawn as dots, squares, icons, a ring, a circle or a bar. Both halves share one row order and one colour per entity.
- [network-poster](https://insightcharts.dev/llms/network-poster.md): A poster of who is connected to whom: a full-width arc diagram with one arc per connection, as thick as its value (`arc-diagram`), a strip of two to four large figures, and a bottom row where the same entities return as circles joined by lines (`bubble-network`) and as a ranking of centred pills (`pill-rank`).
- [profile-poster](https://insightcharts.dev/llms/profile-poster.md): A poster that describes one subject from four sides: the subject as one large silhouette filled to a share (`shape-fill`), two to four large figures, its place among other things on one scale (`scale-ladder`), and a table that sets it beside its peers with every number drawn as a small form (`glyph-table`).
- [radial-poster](https://insightcharts.dev/llms/radial-poster.md): A poster with one subject in the middle of the sheet: a wheel of spokes round an icon (`radial-spokes`), two to four large figures standing either side of it, and a bottom row with the same subject's surroundings on concentric rings (`orbit-chart`) and a ranking as centred pills (`pill-rank`).
- [ranking-poster](https://insightcharts.dev/llms/ranking-poster.md): A poster of one subject by the numbers, in four rows: two figures in large type or as filled silhouettes, two treemaps side by side, a full-width ranking of centred pills with one row highlighted, and packed circles with icons beside a column of sized circles and a closing figure.
- [report-page](https://insightcharts.dev/llms/report-page.md): A section of an analytical report laid out as a document. It has a title block, a summary, numbered findings, then method, limitations and sources. Each finding has one exhibit, an observation and a separately labelled interpretation with a confidence rating and a caveat.
- [scale-poster](https://insightcharts.dev/llms/scale-poster.md): A tall poster that is one illustrated scale: a full-height `scale-ladder` with icons, leader-labelled items and named zones, and a narrow side column of large figures and one small graphic, each set level with the part of the scale it describes.
- [scorecard](https://insightcharts.dev/llms/scorecard.md): A recurring report. It has a masthead with the report name and period, a headline that states the main change, a KPI grid with changes and sparklines, a ranked list beside one or two trend charts, an optional comparison table, short notes and a source note.
- [social-card](https://insightcharts.dev/llms/social-card.md): A graphic that states one fact, at a fixed aspect ratio (1:1, 4:5, 16:9 or 9:16). It has a kicker, a headline, one exhibit, a source and a credit, painted on the theme surface. A button downloads the whole card as a PNG.
- [story-deck](https://insightcharts.dev/llms/story-deck.md): A sequence of full-frame cards (title, stat, chart, quote, closing) that the reader swipes or steps through. Each card states one fact. It has an optional fixed aspect ratio, a keyboard-accessible pager and a stacked layout for print.
- [timeline-poster](https://insightcharts.dev/llms/timeline-poster.md): A poster of change over a run of periods: a full-width ribbon of bands whose thickness is each entity's value and whose order is its rank (`ribbon-chart`), a strip of two to four dated figures under it, and a bottom row with one measure per period as thick bars (`block-bar`) and one share at several dates as nested outlines (`nested-shares`).
- [timeline-story](https://insightcharts.dev/llms/timeline-story.md): A story told in date order. It has a headline, one overview exhibit of the whole period (a timeline chart or an annotated line), dated chapters along a rail, a closing paragraph and a source note. Each chapter has a short text and an optional small exhibit.
- [visual-essay](https://insightcharts.dev/llms/visual-essay.md): A long article read by scrolling. It has a headline, then an ordered list of blocks in a reading column, then a source note. The blocks are prose, figures, charts with a callout, scrolly sequences, pull quotes, stat rows, small multiples and chapter breaks. Exhibits can be wider than the column.
