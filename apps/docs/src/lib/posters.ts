import { posterBackgrounds, themes, themeSurfaces } from "insightcharts/themes";
import { getComponent, isPoster, type CatalogEntry } from "./catalog";

const unquote = (value: string | undefined) => value?.replace(/^["'`]|["'`]$/g, "");
const propDefault = (entry: CatalogEntry | undefined, name: string) => unquote(entry?.props.find((p) => p.name === name)?.default);

/** The CSS background a named theme paints on, when it has one of its own. */
export function groundOfTheme(theme: unknown, mode: "light" | "dark" = "light"): string | undefined {
  if (typeof theme !== "string") return undefined;
  return (posterBackgrounds as Record<string, { light: string; dark: string } | undefined>)[theme]?.[mode] ?? (themeSurfaces as Record<string, { light: string; dark: string } | undefined>)[theme]?.[mode] ?? (themes[theme] && theme !== "insight" && theme !== "shadcn" ? themes[theme][mode].surface : undefined);
}

/**
 * The ground an example paints behind itself in each mode, or undefined when it follows the
 * page: no theme name, `frame: false`, or a theme with no surface of its own. An example that
 * forces a `mode` paints that mode's ground whatever the page is in.
 */
export function authoredGround(spec: Record<string, unknown> | undefined): { light: string; dark: string } | undefined {
  if (!spec || typeof spec.theme !== "string" || spec.frame === false) return undefined;
  const forced = spec.mode === "dark" || spec.mode === "light" ? spec.mode : undefined;
  const light = groundOfTheme(spec.theme, forced ?? "light");
  const dark = groundOfTheme(spec.theme, forced ?? "dark");
  return light && dark ? { light, dark } : undefined;
}

/**
 * The ground a poster spec will paint, worked out before it renders so its frame can reserve
 * the colour: the spec's `background`, else its theme's ground, else the ground of the theme
 * the component's props table gives as the default. The frame re-reads it from the DOM once
 * the poster is mounted, so a wrong guess here only shows for a moment.
 */
export function posterGround(spec: Record<string, unknown> | undefined, entry = getComponent(String(spec?.type ?? ""))): string | undefined {
  if (!entry || !isPoster(entry)) return undefined;
  if (typeof spec?.background === "string") return spec.background;
  const mode = spec?.mode === "dark" ? "dark" : "light";
  return groundOfTheme(spec?.theme ?? propDefault(entry, "theme"), mode);
}

/** The width a poster is designed at: its example's `maxWidth`, else the default in its props table. */
export function posterWidth(entry: CatalogEntry, spec: Record<string, unknown> | undefined = entry.example): number {
  const given = spec?.maxWidth;
  if (typeof given === "number") return given;
  const n = Number(propDefault(entry, "maxWidth"));
  return Number.isFinite(n) && n > 0 ? n : 1100;
}
