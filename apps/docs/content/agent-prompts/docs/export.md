---
title: Add export to charts and posters
goal: Readers can save a chart as PNG, JPEG, SVG, PDF, CSV or JSON, or a whole poster or social card as one PNG, from a menu or from the user's own button.
llms: export
---
Add export to InsightCharts components that already render in the user's project. If the user has not said which formats they need and whether they want the built-in menu or their own button, ask.

## Steps

1. For the built-in menu, add `exportable` to the chart. `true` offers PNG, SVG, PDF and CSV. An array chooses the formats and their order.
2. To turn the menu on for every figure, set `exportable` on `InsightProvider`.
3. For the user's own button, attach a ref typed `ChartHandle` to the chart and call `export(options)`. The file must be a client component.
4. For a whole poster, set `download` on `poster` or on an infographic template. For a `social-card`, `downloadable` is already `true`.
5. For any other DOM element, use `rasterize`.

## The export menu

```tsx
<LineChart exportable ... />
<LineChart exportable={["png", "csv", "json"]} ... />
```

Formats: `"png"`, `"jpeg"`, `"svg"`, `"pdf"`, `"csv"`, `"json"`. The menu shows when the reader hovers the chart or tabs into it.

## Exporting from code

```tsx
"use client";

import { useRef } from "react";
import { LineChart, type ChartHandle } from "insightcharts";

const signups = [
  { month: "Jul", signups: 418 },
  { month: "Aug", signups: 467 },
  { month: "Sep", signups: 512 },
];

export function Signups() {
  const chart = useRef<ChartHandle>(null);
  return (
    <>
      <LineChart ref={chart} data={signups} x="month" y="signups" title="Monthly signups rose from 418 in July to 512 in September 2024" subtitle="New accounts per month, 2024" source="Product database" />
      <button onClick={() => chart.current?.export({ format: "png", pixelRatio: 3 })}>Save PNG</button>
    </>
  );
}
```

`export(options)` returns a `Promise<Blob>` and triggers a download.

| Option | Default | Purpose |
|---|---|---|
| `format` | `"png"` | One of the six formats. |
| `filename` | a slug of the title | File name without extension. |
| `pixelRatio` | `2` | Raster scale for PNG, JPEG and PDF. |
| `chrome` | `true` | Include the title, subtitle and source line in image exports. |
| `background` | the theme surface | Background colour of the image. |
| `download` | `true` | Set `false` to get the blob without a download, for example to upload it. |

The ref also has `getOption()` and `getInstance()`.

## What each format contains

| Format | Contents |
|---|---|
| PNG, JPEG | The chart at its on-screen size times `pixelRatio`, with the title, subtitle and source, on the theme surface colour. |
| SVG | The same layout as vector, with text as `<text>` elements. |
| PDF | One page sized to the figure, containing the raster image. |
| CSV, JSON | The rows the chart drew, after `transform` and after any crossfilter selection. |

Image exports use the colours the chart has on screen, including dark mode.

## Whole posters and cards

| Component | Prop | Default image width |
|---|---|---|
| `poster` and every infographic template | `download`, default `false` | 2400 px |
| `social-card` | `downloadable`, default `true` | 1080 px, or 1920 px at 16:9 |

```tsx
<Poster download exportWidth={3000} filename="bus-passengers-2025" title="..." panels={panels} />
<Insight spec={{ type: "flow-poster", download: true, ...rest }} />
```

`exportWidth`, `filename`, `downloadLabel` and `onExport` (called with the PNG `Blob`) are props of `poster` and `social-card`. The infographic templates take `download` only. The control is drawn under the piece and is not in the image.

## Any element

```tsx
import { canvasToBlob, downloadBlob, rasterize } from "insightcharts/core";

async function save(element: HTMLElement) {
  const canvas = await rasterize(element, 2400);
  downloadBlob(await canvasToBlob(canvas), "poster.png");
}
```

`rasterize(element, pixelWidth)` paints backgrounds including linear and radial gradients, borders, corner radii, clipping, text, inline SVG and canvases. It does not paint outer or blurred shadows, CSS transforms, conic or repeating gradients, or `url()` background images. It skips any element with the `data-ic-export-ignore` attribute. A poster's sheet element is `[data-slot="ic-poster"]`.

`exportChart`, `toSvgString`, `toCanvas` and `downloadBlob` are exported from `insightcharts/core` for building an export from an ECharts option.

## Verify

1. Typecheck.
2. Open the menu and save each offered format. Open each file.
3. Confirm image files include the title, subtitle and source line and have an opaque background.
4. Confirm a CSV holds the rows the chart drew, after its `transform`.
5. Repeat one image export in dark mode.
6. For a poster, confirm every panel is in the PNG.

## Common mistakes

- Calling `export()` on a chart that has not rendered. It rejects. With lazy mounting that includes a chart that was never scrolled into view. Set `lazy={false}` on a chart that is exported while off screen.
- Using a ref and `onClick` in a server component. Put them in a `"use client"` file.
- Expecting `exportable` to save a whole poster. It exports one chart. Use `download` on the poster.
- Expecting `download: false` to cancel the export. It still builds and returns the blob.
- Relying on CSS transforms or box shadows in an element passed to `rasterize`.
