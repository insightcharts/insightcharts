import { createTheme, defaultTheme, type InsightTheme } from "../core/theme";
import { posterThemes } from "./posters";
import { earthTheme, editorialTheme, ledgerTheme, monoTheme, posterTheme, scienceTheme } from "./presets";

export { createTheme, defaultTheme };
export type { InsightTheme, ThemeInput, ThemeTokens } from "../core/theme";
export { earthTheme, editorialTheme, ledgerTheme, monoTheme, posterTheme, presetThemes, scienceTheme, themeSurfaces } from "./presets";

export { blueprintTheme, duskTheme, forestTheme, magentaTheme, noirTheme, oceanTheme, paperTheme, posterBackgrounds, posterThemes, sunriseTheme } from "./posters";
export type { PosterThemeName } from "./posters";

/**
 * Follows a shadcn/ui theme completely: series colours come from `--chart-1` to `--chart-5`
 * and the accent from `--primary`. Use when charts must match an existing shadcn palette.
 * shadcn's stock chart colours are not ordered for colour-vision-deficiency separation, so
 * keep direct labels or legends on.
 */
export const shadcnTheme: InsightTheme = createTheme({
  name: "shadcn",
  accent: "var(--chart-1, var(--primary, #2a78d6))",
  categorical: [1, 2, 3, 4, 5].map((n) => `var(--chart-${n})`),
  grid: "var(--border, #e1e0d9)",
  axis: "var(--border, #c3c2b7)",
  inkSecondary: "var(--muted-foreground, #52514e)",
});

/**
 * Every preset by name. `insight` and `shadcn` follow the host page's surface; the others
 * paint for their own (see `themeSurfaces`). The poster themes (`noir`, `magenta`, `dusk`,
 * `paper`, `ocean`, `forest`, `blueprint`, `sunrise`) paint a full-bleed ground: see
 * `posterBackgrounds` and the `poster` frame.
 */
export const themes: Record<string, InsightTheme> = { insight: defaultTheme, shadcn: shadcnTheme, editorial: editorialTheme, ledger: ledgerTheme, mono: monoTheme, earth: earthTheme, science: scienceTheme, poster: posterTheme, ...posterThemes };
