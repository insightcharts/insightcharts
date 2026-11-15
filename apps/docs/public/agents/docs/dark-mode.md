# Make InsightCharts follow the project's dark mode

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: Every chart matches the colour mode of the page around it, or the mode the user asked for, with no wrong-mode chart after a theme switch.

Make the charts follow the project's light and dark modes. The default needs no code in most projects. Only add `mode` props when the default detection does not fit.

## How it works

Every chart, HTML component and story takes `mode`. Set it per component, or once on `InsightProvider`.

| `mode` | Behaviour |
|---|---|
| `"auto"` (default) | Follows the colour mode of the page around the chart. |
| `"system"` | Follows the operating system preference and ignores the page. |
| `"light"`, `"dark"` | Forced. |

`"auto"` checks, in this order:

1. The nearest ancestor matching `.dark`, `[data-theme="dark"]`, `[data-mode="dark"]`, `[data-color-mode="dark"]` or `[data-color-scheme="dark"]`, or the `light` equivalents. The nearer one wins. This covers shadcn/ui, next-themes and Tailwind's class strategy.
2. The first ancestor with a mostly opaque background. A relative luminance under 0.2 is dark.
3. The root element's `color-scheme`, then the OS preference.

Charts re-check when the `class`, `style` or `data-*` theme attributes on `<html>` or `<body>` change, and when the OS preference changes.

## Steps

1. Find how the project switches mode: a class or data attribute on `<html>` or `<body>` (next-themes, shadcn/ui), an inner wrapper, or the OS only.
2. If the switch is on `<html>` or `<body>`, do nothing. Leave `mode` unset.
3. If the project toggles a class on an inner wrapper at runtime, charts inside do not notice the change. Read the project's own mode state and pass it: `<InsightProvider mode={isDark ? "dark" : "light"}>`.
4. If the user wants one chart or section in a fixed mode, set `mode="dark"` or `mode="light"` on it and paint the container yourself. A forced mode selects the token set. It does not paint a background, because the chrome is transparent.
5. Put brand colours for both modes in `--ic-*` variables or a theme with `light` and `dark` tokens. See `https://insightcharts.dev/agents/docs/theming.md`.

## Forcing a mode

When a forced or `"system"` mode disagrees with the page, the component stops inheriting `--background`, `--foreground`, `--muted-foreground` and `--border` from the host on its own element, so the tokens fall back to their built-in values for that mode. `--ic-*` variables are not reset.

Background to paint behind a forced chart:

- Default theme: `#1a1a19` for dark, `#fcfcfb` for light.
- A preset: `themeSurfaces.<name>.dark` or `.light` from `insightcharts/themes`.
- A theme passed by name on the chart (`theme="ledger"`) paints its own background. You do not need a wrapper.

## Server rendering

Charts draw in the browser after hydration, so the plot is never drawn in the wrong mode. The HTML chrome is server-rendered with the light tokens unless `mode="dark"` is forced, and switches on mount. Tokens that follow host variables (`surface`, `ink`, `muted`) are correct from the first paint.

## Read the mode in code

- `useColorMode(ref, mode)` returns `{ mode }` for an element and keeps it current.
- `detectMode(element)` and `systemMode()` return the mode once.

All three are exported from `insightcharts`.

## Minimal example

```tsx
import { LineChart } from "insightcharts";
import { themeSurfaces } from "insightcharts/themes";

const data = [
  { month: "Jan", churn: 4.2 },
  { month: "Apr", churn: 3.4 },
  { month: "Jul", churn: 2.6 },
  { month: "Oct", churn: 2.1 },
];

// A section that stays dark on a light page.
export function ChurnPanel() {
  return (
    <div style={{ background: themeSurfaces.ledger.dark, padding: 24 }}>
      <LineChart mode="dark" theme="ledger" frame={false} data={data} x="month" y="churn" format="{value}%" title="Monthly churn fell from 4.2% in January to 2.1% in October 2024" subtitle="Monthly customer churn, 2024" source="Billing export" />
    </div>
  );
}
```

## Verify

1. Toggle the site's mode control. Titles, axis labels, gridlines and marks change with the page, with no reload.
2. No chart has dark text on a dark ground or light text on a light ground.
3. A forced chart keeps its mode when the page changes, and its container has the matching background.
4. Reload in dark mode. The chrome does not stay in light colours after hydration.

## Common mistakes

- Setting `mode` everywhere when `"auto"` already works.
- Forcing `mode="dark"` without painting a dark background behind the chart.
- Toggling `.dark` on an inner wrapper at runtime and expecting `"auto"` to notice.
- Using `"system"` in a site that has its own mode switch.
- Defining brand colours for light mode only.

## Reference

- The long guide on this topic: https://insightcharts.dev/llms/guides/theming.md
- This page: https://insightcharts.dev/docs/dark-mode
- These instructions as plain text: https://insightcharts.dev/agents/docs/dark-mode.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
