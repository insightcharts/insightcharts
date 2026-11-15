---
title: Build an infographic poster
description: Draws one designed poster from a JSON spec with an infographic template and a poster theme.
order: 6
---

Fill in these lines, then follow the steps.

```text
Subject: <what the poster is about>
Data: <paths to the data, or paste the tables here>
Main fact: <one sentence with its number, or leave blank and propose one from the data>
Theme: <{{POSTER_THEMES}}; leave blank for noir>
Download as PNG: <yes or no>
Source of the data: <name of the source>
Where to put it: <the route or component file, or leave blank and ask>
```

## Before you start

{{DETECT}}

## Steps

1. Check the project and install the package as described under "Before you start".
2. Check a poster is the right form. A poster is one image with little text that is read in a few seconds. If the reader needs paragraphs, a method note or charts with axes, tell the user and propose a report-style template instead.
3. Choose the infographic template. Read the decision table at `{{SITE_URL}}/agents/infographics.md` and pick the template whose "use it when" matches the subject.

{{INFOGRAPHIC_TABLE}}

4. Fetch the instructions for the template: `{{SITE_URL}}/agents/templates/<name>.md`. It lists the regions and has a complete example. Use only the props it lists.
5. Write `title` as the poster's one fact, in one clause, with its number. Add `kicker` for the topic and `subtitle` for the measure, population and period.
6. Fill each region prop with a compact config: `data` rows, the field names such as `name` and `value`, and a `title` for that panel. Leave out a region you have no data for, unless it is required.
7. Set `theme` to a poster theme name. Do not set colours. A poster keeps its own colours in dark mode.
8. Icon props take a built-in icon name or a `path://` string. Use only names from the [icons](/docs/icons) page.
9. Set `sources`. Set `note` when the data is illustrative.
10. Set `download: true` when the user wants a PNG. Set `linked: true` to make the marks clickable.
11. Render the spec with `Insight`.
12. If no template has the layout, compose the poster on the `poster` molecule: `{ type: "poster", theme, title, panels: [{ span, title, content: { type: "pill-rank", ... } }], sources }`. `span` is out of 12 columns. Use at most about six panels and prefer poster primitives in them. Fetch `{{SITE_URL}}/agents/molecules/poster.md`.

## Example of the result

```tsx
import { Insight } from "insightcharts";

const pupils = [
  { stage: "Primary", pupils: 820000 },
  { stage: "Lower secondary", pupils: 480000 },
  { stage: "Upper secondary", pupils: 390000 },
  { stage: "Special schools", pupils: 150000 },
];

export function SchoolsPoster() {
  return (
    <Insight
      spec={{
        type: "count-poster",
        theme: "noir",
        title: "Norland's schools taught 1.84 million pupils in 2025",
        subtitle: "Pupils enrolled in state schools by stage, autumn term 2025.",
        unit: 1000,
        unitLabel: "1,000 pupils",
        hero: { data: pupils, name: "stage", value: "pupils", title: "820,000 pupils were in primary school" },
        sources: "Norland Ministry of Education, school census 2025",
        note: "Illustrative data",
        download: true,
      }}
    />
  );
}
```

## Verify

- The spec validates against `{{SITE_URL}}/schema/insight-spec.json`.
- The title states one fact with its number, and the number matches the data.
- Every mark has its name and value printed on or beside it. No text overflows or overlaps.
- The poster becomes one column under 600 pixels wide, and the panels read in a sensible order there.
- The theme name is one of the poster themes and is spelt exactly.
- `sources` is set.
- With `download: true`, the "Download PNG" control saves the whole poster.
