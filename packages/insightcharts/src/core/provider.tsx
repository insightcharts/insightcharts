import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { ModeInput } from "./mode";
import { resolveTheme, themeGround } from "./named-themes";
import { defaultTheme, type InsightTheme, type ThemeInput } from "./theme";

export type RendererInput = "auto" | "svg" | "canvas";
export type ExportFormat = "png" | "jpeg" | "svg" | "pdf" | "csv" | "json";

export interface InsightConfig {
  theme: InsightTheme;
  /** `"auto"` follows the page; `"system"` follows the OS; or force `"light"` / `"dark"`. */
  mode: ModeInput;
  /** `"auto"` picks SVG for crisp, light charts and canvas once mark counts get large. */
  renderer: RendererInput;
  /** BCP 47 locale for number and date formatting. Default `"en-US"`. */
  locale?: string;
  /** Set false to disable all animation. Reduced-motion preferences are always respected. */
  animate: boolean;
  /** Show the export menu on every figure. */
  exportable: boolean | ExportFormat[];
  /** Mount charts only when they scroll near the viewport. */
  lazy: boolean;
}

// The locale defaults to a fixed one so server and client render the same text; set it per app.
const defaults: InsightConfig = { theme: defaultTheme, mode: "auto", renderer: "auto", locale: "en-US", animate: true, exportable: false, lazy: true };

const Ctx = createContext<InsightConfig>(defaults);

export interface InsightProviderProps extends Partial<Omit<InsightConfig, "theme">> {
  theme?: ThemeInput;
  children: ReactNode;
}

/**
 * Optional. Sets defaults for every chart beneath it. Charts work without a provider and
 * providers nest, so a section of a page can carry its own theme or mode.
 */
export function InsightProvider({ children, theme, ...rest }: InsightProviderProps) {
  const parent = useContext(Ctx);
  const themeKey = useStableKey(theme);
  const value = useMemo<InsightConfig>(
    () => {
      const merged: InsightConfig = { ...parent, theme: resolveTheme(theme, parent.theme) };
      for (const [k, val] of Object.entries(rest)) if (val !== undefined) (merged as unknown as Record<string, unknown>)[k] = val;
      return merged;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parent, themeKey, rest.mode, rest.renderer, rest.locale, rest.animate, rest.lazy, JSON.stringify(rest.exportable)],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useInsightConfig(): InsightConfig {
  return useContext(Ctx);
}

/** Resolve a per-chart `theme` prop against the surrounding provider. */
export function useTheme(override?: ThemeInput): InsightTheme {
  const { theme } = useContext(Ctx);
  const key = useStableKey(override);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => resolveTheme(override, theme), [theme, key]);
}

function useStableKey(value: unknown): string {
  return value === undefined ? "" : JSON.stringify(value);
}

/**
 * Style that paints a named theme's own background behind a component, so
 * `theme="ledger"` looks right on any page. Returns undefined when there is nothing to
 * paint: no theme prop, a theme object, or a theme that follows the host page.
 * `frame` forces it on or off.
 */
export function frameStyle(theme: ThemeInput | undefined, mode: "light" | "dark", frame?: boolean): { background: string; padding: string; borderRadius: number } | undefined {
  if (frame === false) return undefined;
  const ground = themeGround(theme, mode);
  return ground ? { background: ground, padding: "1.25rem", borderRadius: 12 } : undefined;
}
