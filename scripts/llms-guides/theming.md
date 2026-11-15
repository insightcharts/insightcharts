---
title: Theming and dark mode
description: Theme tokens, the --ic-* CSS variables, shadcn integration, colour modes and restyling the chrome.
order: 4
---
## The default theme

With no configuration, charts inherit the page font and read shadcn/ui's `--background`, `--foreground` and `--muted-foreground` variables when they exist, with neutral fallbacks when they do not. The series colours are InsightCharts' own palette, whose order is chosen so neighbouring colours stay distinguishable under colour-vision deficiency. Keep the order if you re-skin.

## Three ways to theme

### 1. CSS variables

Every colour token of the default theme reads an `--ic-*` variable first. Set them in your stylesheet, globally or on any ancestor:

```css
:root {
  --ic-accent: #7c3aed;
  --ic-series-1: #7c3aed;
  --ic-font-display: "Fraunces", serif;
}
.dark {
  --ic-accent: #a78bfa;
  --ic-series-1: #a78bfa;
}
```

`npx shadcn@latest add @insightcharts/theme` writes the full set with their default values into your global CSS so you can edit them in place.

{{THEME_VARS}}

The `sequential` and `diverging` ramps, `fontSize`, `radius` and `lineWidth` have no CSS variable; set them with the `theme` prop.

### 2. The `theme` prop

On any chart, on `InsightProvider`, or on HTML components that declare it. It accepts:

- flat tokens, applied to both modes: `theme={{ accent: "#7c3aed", radius: 2 }}`
- per-mode tokens: `theme={{ light: { accent: "#7c3aed" }, dark: { accent: "#a78bfa" } }}`
- a full theme object from `createTheme(input, base?)`

A chart's `theme` is merged over the surrounding provider's. Token values may be literals or CSS variable references (`"var(--brand, #2a78d6)"`); they are resolved against the chart's own DOM node, so scoped overrides work.

Tokens: `surface`, `ink`, `inkSecondary`, `muted`, `grid`, `axis`, `accent`, `context`, `positive`, `negative`, `categorical[]`, `sequential[]`, `diverging[]`, `fontFamily`, `displayFamily`, `fontSize`, `radius`, `lineWidth`.

### 3. The shadcn preset

```tsx
import { InsightProvider } from "insightcharts";
import { shadcnTheme } from "insightcharts/themes";

<InsightProvider theme={shadcnTheme}>{children}</InsightProvider>
```

`shadcnTheme` takes series colours from `--chart-1` to `--chart-5`, the accent from `--chart-1` (falling back to `--primary`) and gridlines from `--border`. shadcn's stock chart colours are not ordered for colour-vision-deficiency separation, so keep direct labels or legends on. `insightcharts/themes` also exports `defaultTheme`, `createTheme`, six presets and the `themes` record that holds all of them by name.

## Presets

`editorialTheme`, `ledgerTheme`, `monoTheme`, `earthTheme`, `scienceTheme` and `posterTheme` each define a light and a dark token set, with categorical palettes checked for colour-vision-deficiency separation in both modes. Unlike `insight` and `shadcn`, which follow the host page, a preset paints for its own surface: put it in a container with the matching background, which `themeSurfaces[name]` gives you as `{ light, dark }`.

```tsx
import { InsightProvider } from "insightcharts";
import { editorialTheme, themeSurfaces } from "insightcharts/themes";

<div style={{ background: themeSurfaces.editorial.light, padding: 24 }}>
  <InsightProvider theme={editorialTheme} mode="light">{children}</InsightProvider>
</div>
```

## Dark mode

`mode` is a prop on every chart and on `InsightProvider`:

- `"auto"` (default): match what the page looks like. In order: the nearest ancestor with a `.dark` / `.light` class or a `data-theme`, `data-mode`, `data-color-mode` or `data-color-scheme` attribute; otherwise the luminance of the nearest painted background; otherwise the page's `color-scheme` and the OS preference.
- `"system"`: follow the OS preference.
- `"light"` / `"dark"`: force it.

Charts re-resolve their colours when the root's class or theme attributes change, so toggles such as next-themes work without a remount. Each component root carries `data-ic-mode="light|dark"`.

## Restyling the chrome

The title, subtitle, legend and source line are HTML elements, each with a `data-slot` attribute: `ic-figure`, `ic-header`, `ic-title`, `ic-subtitle`, `ic-legend`, `ic-plot`, `ic-source`, `ic-table`, `ic-actions`, `ic-menu`, `ic-skeleton`, `ic-state`. HTML components add their own (for example `ic-big-number-value`). Target them from CSS:

```css
[data-slot="ic-title"] { font-size: 1.5rem; }
```

`className` and `style` on a chart apply to its `figure` element.
