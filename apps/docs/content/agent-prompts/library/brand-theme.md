---
title: Restyle charts to a brand theme
description: Applies a brand's colours and fonts to every InsightCharts component in a project, in light and dark mode.
order: 7
---

Fill in these lines, then follow the steps.

```text
Accent colour: <the brand's main colour, for the highlighted series>
Series colours: <up to eight colours in order, or leave blank to keep the defaults>
Fonts: <body font and display font, or leave blank to inherit the page's>
Dark mode: <the accent and series colours for dark mode, or leave blank and propose them>
Scope: <the whole app, one section or one chart>
```

## Before you start

{{DETECT}}

## Steps

1. Check the project and install the package as described under "Before you start".
2. Find where the project already imports `insightcharts` and whether it has an `InsightProvider`. Find the global stylesheet.
3. Check whether a preset already fits. Pass a name to `theme` on a chart or on `InsightProvider`. The preset names are {{PRESET_THEMES}}. The `shadcn` preset takes series colours from `--chart-1` to `--chart-5`.
4. For colours and fonts only, set CSS variables. This needs no JavaScript and works in server components. Put them on `:root` for the whole app, or on a wrapper for one section.

```css
:root {
  --ic-accent: #0f766e;
  --ic-series-1: #0f766e;
  --ic-series-2: #b45309;
  --ic-series-3: #1d4ed8;
  --ic-font: "Inter", system-ui, sans-serif;
  --ic-font-display: "Fraunces", Georgia, serif;
}
.dark {
  --ic-accent: #2dd4bf;
  --ic-series-1: #2dd4bf;
}
```

   The variables are `--ic-surface`, `--ic-ink`, `--ic-ink-secondary`, `--ic-muted`, `--ic-grid`, `--ic-axis`, `--ic-accent`, `--ic-context`, `--ic-positive`, `--ic-negative`, `--ic-series-1` to `--ic-series-8`, `--ic-font` and `--ic-font-display`. To add them all to the stylesheet with their defaults, run `npx shadcn@latest add @insightcharts/theme`.

5. For the tokens that have no variable, use a theme object. `sequential`, `diverging`, `fontSize`, `radius` and `lineWidth` are set this way.

```ts
import { createTheme } from "insightcharts/themes";

export const brand = createTheme({
  name: "brand",
  accent: "#0f766e",
  categorical: ["#0f766e", "#b45309", "#1d4ed8", "#be123c"],
  radius: 2,
  dark: { accent: "#2dd4bf" },
});
```

6. Apply the theme at the scope the user named.

```tsx
import type { ReactNode } from "react";
import { InsightProvider } from "insightcharts";
import { brand } from "./brand-theme";

export function Charts({ children }: { children: ReactNode }) {
  return <InsightProvider theme={brand}>{children}</InsightProvider>;
}
```

   For one chart, pass `theme={brand}` or partial tokens such as `theme={{ accent: "#0f766e" }}` on that chart.

7. Keep these rules.
   - Do not set a colour per series in a chart. Colour comes from the theme, and `highlight` picks the accent.
   - Text never takes a series colour. Text uses `ink`, `inkSecondary` and `muted`.
   - Leave `surface` and `ink` alone unless the brand needs them. By default they follow the page's `--background` and `--foreground`.
   - Order the series colours so that neighbours stay distinguishable under colour-vision deficiency.
8. Leave `mode` at `"auto"`. The charts follow the page's dark mode. Give dark mode its own accent when the light accent is too dark on a dark surface.

## Verify

- The typecheck passes.
- A chart with `highlight` draws the highlighted series in the brand accent and the rest in grey.
- A chart with several series uses the brand series colours in order.
- Titles, labels and source lines have a contrast of at least 4.5:1 against the surface, in light and in dark mode.
- No chart file contains a hex colour for a series.
- Charts on every page changed, not only the one you edited, when the scope is the whole app.
