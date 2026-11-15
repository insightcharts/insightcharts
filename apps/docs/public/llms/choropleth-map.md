# Choropleth map (`choropleth-map`)

> Colours the regions of a map by a normalised value, from GeoJSON you supply.

- Component: `ChoroplethMap` (import from `insightcharts`)
- Spec type: `"choropleth-map"`
- Level: atom. Category: geo.
- An ECharts chart built with `defineChart`: accepts every common chart prop (data, transform, title, highlight, annotations, ...).

## When to use

A rate, share or per-capita figure that varies by place, where the geographic pattern (a north-south divide, a cluster) is what the reader needs to see. Use a diverging scale for change or for values either side of a meaningful midpoint.

## Avoid

Raw counts, which mostly map population (normalise first, or use bar-chart); ranking regions precisely (use bar-chart); a handful of regions with no spatial pattern (use bar-chart); regions so different in size that small ones vanish (use a tile-grid GeoJSON).

## Install

From npm (the component ships in the package):

```bash
npm install insightcharts echarts
```

Or copy the source into your project with the shadcn CLI, so you can edit it (the engine still comes from the `insightcharts` package):

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/choropleth-map
```

The file lands at `components/insightcharts/atoms/choropleth-map.tsx`. `@insightcharts/choropleth-map-demo` adds a ready-made example next to it.

## Usage

```tsx
import { ChoroplethMap } from "insightcharts";

const data = [
  { state: "Queensland", share: 45 },
  { state: "South Australia", share: 47 },
  { state: "Western Australia", share: 39 },
  { state: "New South Wales", share: 31 },
  { state: "Australian Capital Territory", share: 29 },
  { state: "Victoria", share: 26 },
  { state: "Northern Territory", share: 22 },
  { state: "Tasmania", share: 19 },
];

<ChoroplethMap
  geo={{
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Western Australia", code: "WA" },
        geometry: { type: "Polygon", coordinates: [[[0, 1], [4, 1], [4, 6], [0, 6], [0, 1]]] },
      },
      {
        type: "Feature",
        properties: { name: "Northern Territory", code: "NT" },
        geometry: { type: "Polygon", coordinates: [[[4, 3.5], [6.5, 3.5], [6.5, 6.5], [4, 6.5], [4, 3.5]]] },
      },
      {
        type: "Feature",
        properties: { name: "South Australia", code: "SA" },
        geometry: { type: "Polygon", coordinates: [[[4, 1], [6.5, 1], [6.5, 3.5], [4, 3.5], [4, 1]]] },
      },
      {
        type: "Feature",
        properties: { name: "Queensland", code: "Qld" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [6.5, 3],
              [10, 3],
              [10, 5.2],
              [8.6, 5.2],
              [8.6, 7.2],
              [7.6, 7.2],
              [7.6, 6.2],
              [6.5, 6.2],
              [6.5, 3],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { name: "New South Wales", code: "NSW" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [[6.5, 1.4], [10, 1.4], [10, 3], [6.5, 3], [6.5, 1.4]],
            [[8.7, 1.8], [8.7, 2.4], [9.4, 2.4], [9.4, 1.8], [8.7, 1.8]],
          ],
        },
      },
      {
        type: "Feature",
        properties: { name: "Australian Capital Territory", code: "ACT" },
        geometry: {
          type: "Polygon",
          coordinates: [[[8.7, 1.8], [9.4, 1.8], [9.4, 2.4], [8.7, 2.4], [8.7, 1.8]]],
        },
      },
      {
        type: "Feature",
        properties: { name: "Victoria", code: "Vic" },
        geometry: {
          type: "Polygon",
          coordinates: [[[6.5, 0.3], [9.2, 0.3], [9.2, 1.4], [6.5, 1.4], [6.5, 0.3]]],
        },
      },
      {
        type: "Feature",
        properties: { name: "Tasmania", code: "Tas" },
        geometry: {
          type: "Polygon",
          coordinates: [[[7.6, -1.1], [8.7, -1.1], [8.7, -0.3], [7.6, -0.3], [7.6, -1.1]]],
        },
      },
    ],
  }}
  data={data}
  region="state"
  value="share"
  format="{value}%"
  aspectScale={1}
  labels
  labelProperty="code"
  height={380}
  title="47% of homes in South Australia had rooftop solar in 2023"
  subtitle="Share of dwellings with a solar installation, by state and territory, 2023"
  source="Australian PV Institute"
  note="Approximate figures on a simplified block map"
/>
```

## JSON spec

The same thing as data, rendered with `<Insight spec={spec} />`:

```json
{
  "type": "choropleth-map",
  "geo": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "Western Australia", "code": "WA" },
        "geometry": { "type": "Polygon", "coordinates": [[[0, 1], [4, 1], [4, 6], [0, 6], [0, 1]]] }
      },
      {
        "type": "Feature",
        "properties": { "name": "Northern Territory", "code": "NT" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[4, 3.5], [6.5, 3.5], [6.5, 6.5], [4, 6.5], [4, 3.5]]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "South Australia", "code": "SA" },
        "geometry": { "type": "Polygon", "coordinates": [[[4, 1], [6.5, 1], [6.5, 3.5], [4, 3.5], [4, 1]]] }
      },
      {
        "type": "Feature",
        "properties": { "name": "Queensland", "code": "Qld" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [6.5, 3],
              [10, 3],
              [10, 5.2],
              [8.6, 5.2],
              [8.6, 7.2],
              [7.6, 7.2],
              [7.6, 6.2],
              [6.5, 6.2],
              [6.5, 3]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "New South Wales", "code": "NSW" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [[6.5, 1.4], [10, 1.4], [10, 3], [6.5, 3], [6.5, 1.4]],
            [[8.7, 1.8], [8.7, 2.4], [9.4, 2.4], [9.4, 1.8], [8.7, 1.8]]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Australian Capital Territory", "code": "ACT" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[8.7, 1.8], [9.4, 1.8], [9.4, 2.4], [8.7, 2.4], [8.7, 1.8]]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Victoria", "code": "Vic" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[6.5, 0.3], [9.2, 0.3], [9.2, 1.4], [6.5, 1.4], [6.5, 0.3]]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Tasmania", "code": "Tas" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[7.6, -1.1], [8.7, -1.1], [8.7, -0.3], [7.6, -0.3], [7.6, -1.1]]]
        }
      }
    ]
  },
  "data": [
    { "state": "Queensland", "share": 45 },
    { "state": "South Australia", "share": 47 },
    { "state": "Western Australia", "share": 39 },
    { "state": "New South Wales", "share": 31 },
    { "state": "Australian Capital Territory", "share": 29 },
    { "state": "Victoria", "share": 26 },
    { "state": "Northern Territory", "share": 22 },
    { "state": "Tasmania", "share": 19 }
  ],
  "region": "state",
  "value": "share",
  "format": "{value}%",
  "aspectScale": 1,
  "labels": true,
  "labelProperty": "code",
  "height": 380,
  "title": "47% of homes in South Australia had rooftop solar in 2023",
  "subtitle": "Share of dwellings with a solar installation, by state and territory, 2023",
  "source": "Australian PV Institute",
  "note": "Approximate figures on a simplified block map"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `geo` (required) | `GeoJSON FeatureCollection \| string` |  | The map: a GeoJSON object, or a URL to fetch one from. Registered with ECharts automatically. |
| `region` (required) | `string` |  | Row field holding the region name that joins to the GeoJSON. |
| `value` (required) | `string` |  | Row field holding the value. Use a rate or share, not a raw count. |
| `nameProperty` | `string` | `"name"` | GeoJSON feature property holding each region's name. |
| `scale` | `"sequential" \| "diverging"` | `"sequential"` | Sequential for magnitude; diverging for values either side of a midpoint. |
| `midpoint` | `number` | `0` | Centre of the diverging scale. |
| `domain` | `[number, number]` |  | Fix the colour scale instead of using the data's range. |
| `labels` | `boolean \| "value"` | `false` | Print region names on the map; `"value"` adds the value on a second line. |
| `labelProperty` | `string` |  | GeoJSON feature property to print instead of the full name, e.g. a postal or ISO code. |
| `missingLabel` | `string` | `"No data"` | Legend text for regions without a value. |
| `aspectScale` | `number` | `0.75` | Horizontal stretch for longitude; 1 for tile maps and projected coordinates. |

## Common props

Every chart also accepts these (shared by all charts; also at https://insightcharts.dev/llms/guides/common-props.md):

| Prop | Type | Description |
|---|---|---|
| `data` | `DataInput` | Rows, CSV text, a URL, `{ url, path }`, an async function, or an Arrow-style table. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` | A pipeline of transforms applied before drawing. |
| `title` | `string` | The title. One plain statement of what the data shows, with the number and the period ("Monthly churn fell from 4.2% to 2.1% in 2024"), or a plain label ("Monthly churn, 2024"). One clause, no figures of speech. |
| `subtitle` | `string` | Measure, unit, population, period. |
| `source` | `string` | Data source, shown as "Source: ...". |
| `note` | `string` | Method notes or caveats. |
| `height` | `number \| string` | CSS height of the plot. Default 360. |
| `aspect` | `number` | Width / height. Overrides `height`. |
| `highlight` | `string \| string[]` | The entity (or entities) the title is about. Every other series is drawn in grey. |
| `annotations` | `Annotation[]` | Reference lines, shaded bands and callouts, in data coordinates. |
| `format` | `FormatSpec` | How to print values: `"compact"`, `"percent"`, `"currency:USD"`, `"{value} kg"`, Intl options, or a function. |
| `legend` | `boolean` | Show the legend. Default: shown when there are two or more series. |
| `select` | `boolean \| string` | Make marks clickable to filter. Inside `<InsightData>` the selection filters every other chart. Pass a field name, or `true` to use the chart's category field. |
| `onSelect` | `(values: string[], field: string) => void` | Called with the selected values whenever the selection changes. |
| `option` | `EChartsOption \| ((option: EChartsOption, ctx: BuildContext) => EChartsOption)` | Deep-merged over the generated ECharts option, or a function that receives and returns it. Use it for ECharts settings no prop covers. |
| `theme` | `ThemeInput` | A full theme, `{ light, dark }` partial tokens, or flat tokens applied to both modes. Merged over the surrounding `InsightProvider` theme. |
| `mode` | `ModeInput` | `"auto"` (default) follows the page, `"system"` follows the OS, or force `"light"` / `"dark"`. |
| `renderer` | `RendererInput` | `"auto"` (default) uses SVG for light charts and canvas for heavy ones. |
| `animate` | `boolean` | Set false to disable animation for this chart. Reduced-motion preferences are always respected. |
| `lazy` | `boolean` | Mount the chart only when it scrolls within 200px of the viewport. Default true (from `InsightProvider`). |
| `group` | `string` | Link tooltips with other charts sharing this group id. |
| `exportable` | `boolean \| ExportFormat[]` | Show an export menu: `true` or a list of formats from png, jpeg, svg, pdf, csv, json. |
| `table` | `boolean` | Show a collapsible "View data" table under the chart. |
| `alt` | `string` | Accessible description: the chart type and measures, then the main pattern and the notable values. |
| `id` | `string` | Stable id for this chart's selection in the shared store. |
| `onEvents` | `Record<string, ChartEventHandler>` | ECharts event handlers: `{ click: (params, chart) => {} }`. |
| `onReady` | `(chart: EChartsInstance) => void` | Called with the ECharts instance once it is initialised. |
| `className` | `string` | Class on the figure element. |
| `style` | `CSSProperties` | Inline style on the figure element. |

## Composition

- Composes: nothing (it is a primitive)
- Used by: [atlas-poster](https://insightcharts.dev/llms/atlas-poster.md)

## More examples

### Diverging, with missing regions

```tsx
import { ChoroplethMap } from "insightcharts";

const data = [
  { state: "Queensland", net: 3.1 },
  { state: "Western Australia", net: 1.9 },
  { state: "South Australia", net: -0.2 },
  { state: "New South Wales", net: -3.4 },
  { state: "Victoria", net: -0.9 },
  { state: "Tasmania", net: -1.6 },
];

<ChoroplethMap
  geo={{
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Western Australia", code: "WA" },
        geometry: { type: "Polygon", coordinates: [[[0, 1], [4, 1], [4, 6], [0, 6], [0, 1]]] },
      },
      {
        type: "Feature",
        properties: { name: "Northern Territory", code: "NT" },
        geometry: { type: "Polygon", coordinates: [[[4, 3.5], [6.5, 3.5], [6.5, 6.5], [4, 6.5], [4, 3.5]]] },
      },
      {
        type: "Feature",
        properties: { name: "South Australia", code: "SA" },
        geometry: { type: "Polygon", coordinates: [[[4, 1], [6.5, 1], [6.5, 3.5], [4, 3.5], [4, 1]]] },
      },
      {
        type: "Feature",
        properties: { name: "Queensland", code: "Qld" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [6.5, 3],
              [10, 3],
              [10, 5.2],
              [8.6, 5.2],
              [8.6, 7.2],
              [7.6, 7.2],
              [7.6, 6.2],
              [6.5, 6.2],
              [6.5, 3],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { name: "New South Wales", code: "NSW" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [[6.5, 1.4], [10, 1.4], [10, 3], [6.5, 3], [6.5, 1.4]],
            [[8.7, 1.8], [8.7, 2.4], [9.4, 2.4], [9.4, 1.8], [8.7, 1.8]],
          ],
        },
      },
      {
        type: "Feature",
        properties: { name: "Australian Capital Territory", code: "ACT" },
        geometry: {
          type: "Polygon",
          coordinates: [[[8.7, 1.8], [9.4, 1.8], [9.4, 2.4], [8.7, 2.4], [8.7, 1.8]]],
        },
      },
      {
        type: "Feature",
        properties: { name: "Victoria", code: "Vic" },
        geometry: {
          type: "Polygon",
          coordinates: [[[6.5, 0.3], [9.2, 0.3], [9.2, 1.4], [6.5, 1.4], [6.5, 0.3]]],
        },
      },
      {
        type: "Feature",
        properties: { name: "Tasmania", code: "Tas" },
        geometry: {
          type: "Polygon",
          coordinates: [[[7.6, -1.1], [8.7, -1.1], [8.7, -0.3], [7.6, -0.3], [7.6, -1.1]]],
        },
      },
    ],
  }}
  data={data}
  region="state"
  value="net"
  scale="diverging"
  format="signed"
  labels
  labelProperty="code"
  aspectScale={1}
  height={380}
  highlight="Queensland"
  title="Queensland gained 3.1 people per 1,000 residents from interstate migration"
  subtitle="Net interstate migration per 1,000 residents, year to June"
  source="Illustrative data"
/>
```

### Tile grid with labels, loaded from a URL

```tsx
import { ChoroplethMap } from "insightcharts";

const data = [
  { region: "North East", pay: 31.2 },
  { region: "North West", pay: 33.1 },
  { region: "Yorkshire", pay: 32.4 },
  { region: "West Midlands", pay: 33 },
  { region: "East Midlands", pay: 32.1 },
  { region: "East", pay: 36.3 },
  { region: "South West", pay: 33.5 },
  { region: "South East", pay: 38.4 },
  // ... 1 more rows
];

<ChoroplethMap
  geo="data:application/json,%7B%22type%22%3A%22FeatureCollection%22%2C%22features%22%3A%5B%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22name%22%3A%22North%20East%22%2C%22code%22%3A%22NE%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B2.03%2C-0.97%5D%2C%5B2.9699999999999998%2C-0.97%5D%2C%5B2.9699999999999998%2C-0.03%5D%2C%5B2.03%2C-0.03%5D%2C%5B2.03%2C-0.97%5D%5D%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22name%22%3A%22North%20West%22%2C%22code%22%3A%22NW%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B1.03%2C-1.97%5D%2C%5B1.97%2C-1.97%5D%2C%5B1.97%2C-1.03%5D%2C%5B1.03%2C-1.03%5D%2C%5B1.03%2C-1.97%5D%5D%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22name%22%3A%22Yorkshire%22%2C%22code%22%3A%22Yorks%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B2.03%2C-1.97%5D%2C%5B2.9699999999999998%2C-1.97%5D%2C%5B2.9699999999999998%2C-1.03%5D%2C%5B2.03%2C-1.03%5D%2C%5B2.03%2C-1.97%5D%5D%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22name%22%3A%22West%20Midlands%22%2C%22code%22%3A%22W%20Mids%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B1.03%2C-2.9699999999999998%5D%2C%5B1.97%2C-2.9699999999999998%5D%2C%5B1.97%2C-2.03%5D%2C%5B1.03%2C-2.03%5D%2C%5B1.03%2C-2.9699999999999998%5D%5D%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22name%22%3A%22East%20Midlands%22%2C%22code%22%3A%22E%20Mids%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B2.03%2C-2.9699999999999998%5D%2C%5B2.9699999999999998%2C-2.9699999999999998%5D%2C%5B2.9699999999999998%2C-2.03%5D%2C%5B2.03%2C-2.03%5D%2C%5B2.03%2C-2.9699999999999998%5D%5D%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22name%22%3A%22East%22%2C%22code%22%3A%22East%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B3.03%2C-2.9699999999999998%5D%2C%5B3.9699999999999998%2C-2.9699999999999998%5D%2C%5B3.9699999999999998%2C-2.03%5D%2C%5B3.03%2C-2.03%5D%2C%5B3.03%2C-2.9699999999999998%5D%5D%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22name%22%3A%22South%20West%22%2C%22code%22%3A%22SW%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B1.03%2C-3.9699999999999998%5D%2C%5B1.97%2C-3.9699999999999998%5D%2C%5B1.97%2C-3.03%5D%2C%5B1.03%2C-3.03%5D%2C%5B1.03%2C-3.9699999999999998%5D%5D%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22name%22%3A%22South%20East%22%2C%22code%22%3A%22SE%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B2.03%2C-3.9699999999999998%5D%2C%5B2.9699999999999998%2C-3.9699999999999998%5D%2C%5B2.9699999999999998%2C-3.03%5D%2C%5B2.03%2C-3.03%5D%2C%5B2.03%2C-3.9699999999999998%5D%5D%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22name%22%3A%22London%22%2C%22code%22%3A%22Lon%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B3.03%2C-3.9699999999999998%5D%2C%5B3.9699999999999998%2C-3.9699999999999998%5D%2C%5B3.9699999999999998%2C-3.03%5D%2C%5B3.03%2C-3.03%5D%2C%5B3.03%2C-3.9699999999999998%5D%5D%5D%7D%7D%5D%7D"
  data={data}
  region="region"
  value="pay"
  labels="value"
  labelProperty="code"
  format="£{value}k"
  aspectScale={1}
  height={340}
  title="Median full-time pay in London was £46,200 in 2023"
  subtitle="Median full-time annual earnings by English region, £ thousand, 2023"
  source="ONS Annual Survey of Hours and Earnings"
  note="Rounded. Each region is drawn as one equal tile"
/>
```

## Links

- Registry item: https://insightcharts.dev/r/choropleth-map.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/choropleth-map.tsx
- Spec schema: https://insightcharts.dev/schema/insight-spec.json
- Choosing a form: https://insightcharts.dev/llms/guides/choosing-a-form.md
- All components: https://insightcharts.dev/llms.txt
