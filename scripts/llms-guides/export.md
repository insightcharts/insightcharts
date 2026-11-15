---
title: Export
description: The export menu, programmatic export through a ref, formats and what each contains.
order: 7
---
## The export menu

```tsx
<BarChart data={data} x="country" y="share" title="Renewable share of electricity by country" exportable />
```

`exportable` adds an "Export" menu at the top right of the figure (visible on hover or keyboard focus). `true` offers PNG, SVG, PDF and CSV. Pass a list to choose from all six formats: `exportable={["png", "jpeg", "svg", "pdf", "csv", "json"]}`. Set it once for every chart with `<InsightProvider exportable>`.

## Formats

| Format | Contents |
|---|---|
| `png`, `jpeg` | The chart re-rendered off-screen at `pixelRatio` (default 2), with the title, subtitle and source line drawn in, on the theme's surface colour. |
| `svg` | A standalone SVG with the same chrome as text elements. |
| `pdf` | A single page containing the image. |
| `csv`, `json` | The rows the chart drew, after loading, crossfilter and `transform`. |

Image exports use the chart's current size, theme and colour mode, and never have a transparent background unless you pass one.

## Programmatic export

Every chart forwards a ref with `export(options)`, `getInstance()` and `getOption()`.

```tsx
"use client";
import { useRef } from "react";
import { LineChart } from "insightcharts";
import type { ChartHandle } from "insightcharts";

export function Downloadable({ data }: { data: Record<string, unknown>[] }) {
  const chart = useRef<ChartHandle>(null);
  return (
    <>
      <LineChart ref={chart} data={data} x="year" y="solar" title="Solar generation by year" />
      <button onClick={() => chart.current?.export({ format: "png", filename: "solar" })}>Download PNG</button>
    </>
  );
}
```

Options:

| Option | Default | Description |
|---|---|---|
| `format` | `"png"` | `png`, `jpeg`, `svg`, `pdf`, `csv` or `json`. |
| `filename` | slug of the title | Without extension. |
| `pixelRatio` | `2` | Raster scale. |
| `chrome` | `true` | Include the title, subtitle and source line in image exports. |
| `background` | theme surface | Background colour. |
| `download` | `true` | Set false to get the `Blob` back without triggering a download. |

`export()` always resolves to the `Blob`. Export runs in the browser; there is no server-side image rendering in the package.

## The data table

`table` adds a collapsible "View data" table under the chart with the same rows. Screen-reader users and readers who need exact values can use it.

Lower-level functions (`exportChart`, `toSvgString`, `toCanvas`, `downloadBlob`) are exported from `insightcharts/core` for custom charts built on `Chart`.
