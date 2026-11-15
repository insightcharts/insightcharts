---
title: Theme InsightCharts to match a brand
goal: Every chart in the project uses the user's colours and fonts in light and dark mode, set in one place.
llms: theming
---
Apply the user's brand to the charts. If the user has not given you the brand colours (an accent, and a list of series colours if they have one) and the fonts, ask. If the project uses shadcn/ui, read its CSS variables first.

## How themes work

A theme is two sets of tokens, `light` and `dark`. A colour token is a literal (`#2a78d6`, `oklch(...)`) or a CSS variable reference (`var(--brand, #2a78d6)`). With no configuration the default theme reads the page's `--background`, `--foreground` and `--muted-foreground` when they exist. Series colours do not come from the page by default.

## Choose the method

| Situation | Method |
|---|---|
| Change a few colours or the font for the whole site | Set `--ic-*` CSS variables in the global stylesheet. |
| The project has a shadcn/ui palette (`--chart-1` to `--chart-5`) and charts must match it | `theme="shadcn"` on `InsightProvider`. |
| A complete brand theme reused across the app | `createTheme({...})` and pass it to `InsightProvider`. |
| A ready-made look | A preset name: {{PRESET_THEMES}}. |
| A poster or infographic | A poster theme name: {{POSTER_THEMES}}. |
| One chart differs | The `theme` prop on that chart. |

## Steps

1. Pick the method from the table.
2. For CSS variables, add them on `:root` and the dark values on `.dark` (or the selector the project uses for dark mode).
3. For a theme object, create it in one file, export it, and wrap the app or the section in `InsightProvider`.
4. Do not set colours on single charts or series. Remove hard-coded hex values from chart props.
5. Check both modes.

## CSS variables

Set these anywhere above the chart. The `sequential` and `diverging` ramps and the numeric tokens `fontSize`, `radius` and `lineWidth` have no variable. Set them with a theme object.

{{THEME_VARS}}

```css
:root {
  --ic-accent: #0f766e;
  --ic-font-display: "Fraunces", Georgia, serif;
}
.dark {
  --ic-accent: #2dd4bf;
}
```

`npx shadcn@latest add @insightcharts/theme` writes every variable with its default into the project's stylesheet.

## The theme prop and createTheme

`theme` on any component or on `InsightProvider` accepts a theme name, a full theme, `{ light, dark }` partial tokens, or flat partial tokens that apply to both modes. A partial theme is merged over the surrounding theme. An unknown name falls back to the surrounding theme without an error, so spell names exactly.

`createTheme(input, base?)` does the merge ahead of time and returns a complete theme. `base` defaults to the default theme.

| Token | Type | Purpose |
|---|---|---|
| `surface`, `ink`, `inkSecondary`, `muted`, `grid`, `axis` | colour | Chrome, from background to baselines. |
| `accent`, `context` | colour | The highlighted series, and the grey for every other series. |
| `positive`, `negative` | colour | Direction. |
| `categorical` | colour[] | Identity colours, assigned to entities in fixed order. Up to 8. |
| `sequential` | colour[] | One hue, light to dark, for magnitude. |
| `diverging` | colour[] | Negative pole, neutral midpoint, positive pole. |
| `fontFamily`, `displayFamily` | string | Body text, and titles and big numbers. |
| `fontSize`, `radius`, `lineWidth` | number | Defaults 12, 4 and 2 pixels. |

To turn brand colours into a theme: use the main brand colour as `accent`, list the brand's distinct hues as `categorical` in the order they should be assigned, and give `dark` lighter variants of the same hues. Text never takes a series colour, so check `ink`, `inkSecondary` and `muted` against `surface` for contrast.

## Presets and surfaces

`themes` from `insightcharts/themes` holds every theme by name. `insight` and `shadcn` follow the page they are on. The other presets and the poster themes are designed for their own background.

- Passing the name as a string (`theme="ledger"`) on a component paints that background behind the component, with padding and rounded corners. `frame={false}` turns that off.
- Passing the theme through `InsightProvider` does not paint anything. Paint the container with `themeSurfaces.<name>.light` or `.dark` (presets) or `posterBackgrounds.<name>.light` or `.dark` (poster themes), and force `mode` to match.
- `posterBackgrounds` values for `dusk`, `ocean` and `sunrise` are gradients. Use them as CSS `background`, not `background-color`.
- A poster theme has four or five categorical colours. Fold further entities into "Other".
- The `Poster` molecule and every infographic template take the name as `theme` and paint the ground themselves.

## Restyle the chrome

Titles, legends and source lines are HTML with `data-slot` attributes: `ic-figure`, `ic-header`, `ic-title`, `ic-subtitle`, `ic-legend`, `ic-plot`, `ic-source`, `ic-table`, `ic-actions`. Style them from the project's CSS: `[data-slot="ic-title"] { font-size: 1.25rem; }`.

## Minimal example

```tsx
import { BarChart, InsightProvider } from "insightcharts";
import { createTheme } from "insightcharts/themes";

export const brand = createTheme({
  name: "brand",
  accent: "#7c3aed",
  categorical: ["#7c3aed", "#0891b2", "#ca8a04", "#be123c"],
  displayFamily: '"Fraunces", Georgia, serif',
  light: { grid: "#ebe9f5" },
  dark: { accent: "#a78bfa", grid: "#2a2740" },
});

const data = [
  { plan: "Team", seats: 420 },
  { plan: "Business", seats: 310 },
  { plan: "Starter", seats: 180 },
];

export function Seats() {
  return (
    <InsightProvider theme={brand}>
      <BarChart data={data} x="plan" y="seats" highlight="Team" title="The Team plan had 420 seats in March 2025" subtitle="Paid seats by plan, March 2025" source="Billing export" />
    </InsightProvider>
  );
}
```

## Verify

1. The highlighted mark is the brand accent and the other marks are grey.
2. Switch the page to dark mode. The accent, gridlines and text change to the dark values and stay legible.
3. A multi-series chart assigns the `categorical` colours in the listed order.
4. With a preset or poster theme, there is no strip of the page's colour between marks or around the chart.

## Common mistakes

- Hard-coding a hex value on a chart or in `option` in place of a token.
- Passing a preset through `InsightProvider` without painting its surface behind the charts.
- Misspelling a theme name. It falls back silently.
- Replacing `categorical` with more than 8 colours or with near-identical hues.
- Setting `--ic-*` variables only on `:root` and leaving dark mode with light values.
- Using a series colour for text.
