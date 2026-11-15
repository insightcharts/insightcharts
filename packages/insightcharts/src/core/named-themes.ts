import { posterBackgrounds, themeSurfaces, themes } from "../themes";
import type { ColorMode } from "./mode";
import { createTheme, type InsightTheme, type ThemeInput } from "./theme";

/** A built-in theme by name: `"editorial"`, `"ledger"`, `"noir"`, `"magenta"`... Undefined when unknown. */
export function namedTheme(name: string): InsightTheme | undefined {
  return themes[name];
}

/** Names of every built-in theme. */
export const themeNames = (): string[] => Object.keys(themes);

/** Turn a `theme` prop (a name, a partial theme or a full one) into a complete theme. */
export function resolveTheme(input: ThemeInput | undefined, base: InsightTheme): InsightTheme {
  if (input === undefined) return base;
  if (typeof input === "string") return themes[input] ?? base;
  return createTheme(input, base);
}

/**
 * The CSS background a named theme is designed to sit on (a colour, or a gradient for some
 * poster themes), or null for themes that follow the host page (`insight`, `shadcn`) and
 * for theme objects.
 */
export function themeGround(theme: ThemeInput | undefined, mode: ColorMode): string | null {
  if (typeof theme !== "string") return null;
  const poster = (posterBackgrounds as Record<string, { light: string; dark: string }>)[theme];
  if (poster) return poster[mode];
  const surface = (themeSurfaces as Record<string, { light: string; dark: string }>)[theme];
  return surface ? surface[mode] : null;
}
