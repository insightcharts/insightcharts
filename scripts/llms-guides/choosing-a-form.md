---
title: Choosing a form
description: A decision table from what the data has to show to the component, the rules for writing titles and text, and the design rules every InsightCharts figure follows.
order: 2
skill: story-design.md
---
First write down the one fact the chart should show, with its number. Then pick the form that shows that fact most directly.

## Decision table

Generated from each component's metadata. Use only names in this table.

{{DECISION_TABLE}}

When two forms fit, use the simpler one. When nothing fits, use a sentence with a `big-number`.

## Poster primitives

The rows above with the job "Draw a poster graphic" are the poster primitives. They are for panels of a `poster` and for the regions of the infographic templates. Each prints names and values on or beside large flat marks and has no axes by default. Use the ordinary chart for a report page and the primitive for a poster.

| The data's job | Primitive | Ordinary chart for a report page |
|---|---|---|
| Count people or things in 2 to 12 groups, in the thousands | `unit-blocks` | `pictogram-chart` |
| Compare counts of up to about 150 in 4 to 24 categories | `icon-array-grid` | `pictogram-chart` |
| Compare 2 to 8 quantities that differ by 2 to 100 times | `proportional-area` | `bar-chart` |
| State 2 to 6 related magnitudes with the number set large | `stat-circles` | `stat-row` |
| Show 5 to about 60 parts of very different sizes | `circle-pack` | `treemap` |
| Show one share at 2 to 8 dates, or 2 to 8 shares of one whole | `nested-shares` | `waffle-chart` |
| Show 1 to 6 percentages as a filled silhouette | `shape-fill` | `icon-stat` |
| Compare a short series or ranking of 3 to 12 values | `block-bar` | `bar-chart` |
| Rank 4 to about 20 named things | `pill-rank` | `bar-chart`, `ranked-list` |
| Relate two measures of the same 4 to about 15 entities | `curve-rank` | `slope-chart`, `scatter-chart` |
| Show size and changing rank of 4 to 8 entities over 4 to 10 periods | `ribbon-chart` | `bump-chart`, `area-chart` |
| Place 4 to about 20 things on one scale (depth, height, age) | `scale-ladder` | `strip-plot` |
| Place 5 to about 40 things on one scale with a magnitude as area | `bubble-scale` | `beeswarm-chart` |
| Show 4 to 12 attributes of one subject | `radial-spokes` | `bar-chart` |
| Group 6 to about 40 named things by level or period round a centre | `orbit-chart` | `comparison-table` |
| Split one total among 4 to about 14 destinations | `fan-flow` | `sankey-chart` |
| Show connections among up to about 20 ordered entities | `arc-diagram` | `sankey-chart` |
| Show which of up to about 12 things are connected, with sizes | `bubble-network` | `sankey-chart` |
| Compare 3 to about 12 entities on 2 to 5 measures with different units | `glyph-table` | `comparison-table` |

A whole poster is an infographic template (the job "Lay out a whole poster") or the `poster` molecule. See the infographics guide.

## Writing titles and text

These rules apply to every `title`, `subtitle`, deck, callout, annotation label and story step. They are hard requirements.

Write one plain statement of fact, the way a person would say it out loud, with the real numbers and the period in it.

| Write this | Not this |
|---|---|
| Monthly churn fell from 4.2% to 2.1% in 2024 | Churn halved after the March onboarding revamp, and the gain has held for six months |
| Renewables supplied 98% of Norway's electricity in 2023 | Norway runs almost entirely on renewable electricity |
| Acme had 266 active teams in December 2024, 2.4 times Globex | Acme pulled away from the pack in late 2023 |
| Solar's share rose from 2.7% to 5.5% between 2019 and 2023 | Solar is closing the gap with wind |
| Households wasted 631 million tonnes of food in 2022 | It is not a rich-country habit |

- One clause. Do not add a second half joined with a comma, "and", "but", "while", "yet", a semicolon, a colon or a dash that adds a twist, a consequence or a follow-up. If there are two facts, write two sentences or put the second in the subtitle.
- Put the number in. Write "fell from 4.2% to 2.1%", not "halved". Write "98%", not "almost entirely". Write "3 of 12", not "a handful".
- Take every number from the data. Never invent a figure, a cause or an event that the data does not show.
- No metaphor, idiom or figure of speech. Do not write "pulled away from the pack", "closing the gap", "tells the story", "the long tail" or "did the work".
- No teasing. Do not point at something the reader has to work out, such as "one hospital explains most of it" or "here is where it goes".
- No dramatic verbs (soared, plunged, surged, skyrocketed, slashed). No staged contrast ("not X, but Y").
- No rhetorical questions, no groups of three for rhythm, no sign-off lines.
- A plain label is always acceptable when there is no single fact to state: "Monthly churn, 2024".
- Subtitles name the measure, unit, population and period. Sources name the source.

## Design rules

The components enforce some of these. You are responsible for the others.

1. **State one fact in the title.** `title` is one plain statement with its number and period, or a plain label. Put the measure, unit, population and period in `subtitle`.
2. **Highlight one series.** Set `highlight` to the one or two entities the title is about. The other series are drawn in grey. Do not colour every series when the title is about one of them.
3. **Label marks directly.** Charts label line ends and bar tips where they can and show a legend only for two or more series. Do not add a legend for something that is already labelled.
4. **Use few annotations.** `annotations` mark a date, a threshold or a single value: a `line` at a target or a date, a `band` over a period, a `point` label on one value. Use two or three per chart at most.
5. **Start bars and areas at zero.** Bars and filled areas start at zero, and the components do this for you. Lines and dots may use a value axis that does not start at zero. If you rebase or use a log scale, say so in the subtitle.
6. **No dual axes, no gauges, no pie with more than 5 slices.** Two measures get two charts (or an index). A single figure is a `big-number`. Many parts become a ranked bar chart with the smallest folded into "Other" (the `top` transform does this).
7. **Change one thing per scroll step.** In a `Scrolly` story each step changes one thing: the data, the highlight or the encoding.
8. **Do not rely on tooltips.** The chart must be readable without hovering. Touch screens and exported images have no hover.
9. **Always give a source.** Pass `source`. Use `note` for method caveats, and say when data is illustrative.
10. **Give a big number context.** Add a comparison, a denominator or a period with `context`, `delta` and `deltaLabel` on `big-number`. Write "31.7%, up from 19% in 2010", not "31.7%" alone.

## How colour is assigned

You do not pick colours per series. The theme assigns them:

- Identity (which entity): the categorical palette, in stable entity order. More than 8 entities should be folded or split into small multiples.
- Emphasis: `highlight`. The first highlighted entity takes the accent colour, others take the next categorical colours, and the remaining series take the context grey.
- Magnitude and polarity: sequential and diverging ramps from the theme.
- Good or bad: `positive` and `negative`, always with a second cue such as an arrow or sign.

To change colours, change the theme (see the theming guide), not individual charts.

## Checklist

- Is the title one clause that states one fact with its number and period, or a plain label?
- Can every number in the text be found in or computed from the data?
- Is exactly one thing highlighted?
- Can it be read with no hover, at 380px wide, and in dark mode?
- Is there a `subtitle` naming the measure and a `source`?
- Would a sentence or a `big-number` show the same fact?
