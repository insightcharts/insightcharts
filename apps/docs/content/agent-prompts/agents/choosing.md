---
title: Choosing a component
description: How to choose a level and a component for a dataset, with a decision table of all the components and the poster primitives.
order: 4
---

Choose the component from what the data has to show. Choose the level first, then the component.

## Choose a level

| The piece is | Level | Examples |
|---|---|---|
| One chart or one figure | Atom | `bar-chart`, `line-chart`, `big-number` |
| A few atoms that make one point | Molecule | `stat-row`, `chart-callout`, `linked-charts` |
| A whole page with text and several exhibits | Template | `executive-brief`, `report-page`, `visual-essay` |
| One image with little text, shared as a picture | Infographic template | `count-poster`, `flow-poster`, `timeline-poster` |

Follow these steps.

1. Write down the one fact the piece should show.
2. If one chart or one number shows it, use an atom.
3. If the fact needs a chart and words beside it, a row of numbers, or charts that filter each other, look for a molecule.
4. If the reader needs a headline, paragraphs, several exhibits and a source note, use a report-style template. It takes all of its content as props.
5. If the piece is one designed image, use an infographic template. If no infographic template has the layout, compose one on the `poster` molecule from poster primitives.
6. Use the highest level that fits. Do not lay out atoms by hand when a molecule or a template already does the job.

## Read the metadata

Each component has two lines of guidance in its metadata.

- `whenToUse` says when the component is the right form.
- `avoid` says when to pick something else, and names the component to use instead.

Read both for the candidate before you commit. If `avoid` matches the data, switch to the component it names.

## Decision table

{{DECISION_TABLE}}

Use only the names in this table. Any other name does not render.

## Report-style templates

{{TEMPLATE_TABLE}}

## Infographic templates

{{INFOGRAPHIC_TABLE}}

Choose a poster when the piece is read in a few seconds and shared as a picture. Choose a report-style template when the reader needs paragraphs, a method note, recommendations or charts with axes. Choose `social-card` for one fact at a fixed social media size.

## Poster primitives

The poster primitives are atoms drawn for a poster background. They use large flat marks, print names and values on or beside the marks, and have no axes by default. Use them in the panels of the `poster` molecule.

{{POSTER_PRIMITIVE_TABLE}}

## Defaults that are usually right

| Job | Component | Not this |
|---|---|---|
| One figure | `big-number` | A gauge or a one-slice donut |
| A ranking or a comparison of categories | `bar-chart` | A pie |
| A change over time with five or more points | `line-chart` | A bar per period |
| Two time points for several entities | `slope-chart` | A two-point line chart |
| Two values per category | `dumbbell-chart` | Grouped bars |
| More than six lines of equal weight | `small-multiples` | One crowded line chart |
| One share of a whole | `waffle-chart` | A donut with one slice |
| Two to five key numbers | `stat-row` | A row of separate charts |

## Forms the library does not draw

Do not use dual axes, gauges, 3D charts or pies with more than five slices. Use one of these instead.

| Request | Use |
|---|---|
| Two measures on two axes | Two charts side by side, or `line-chart` with both series indexed to 100 through a `derive` transform |
| A gauge | `big-number` with context, `progress-meter` or `bullet-chart` |
| A pie with many slices | `bar-chart` sorted by value |

## Get the instructions for a component

Once you have a name, fetch its instructions. They hold the install command, the import, every prop, the data shape and a working example.

- One component: `{{SITE_URL}}/agents/<atoms|molecules|templates>/<name>.md`
- One level: `{{SITE_URL}}/agents/atoms.md`, `{{SITE_URL}}/agents/molecules.md`, `{{SITE_URL}}/agents/templates.md`, `{{SITE_URL}}/agents/infographics.md`
- Every component as data: `{{SITE_URL}}/schema/manifest.json`
