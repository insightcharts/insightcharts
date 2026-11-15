import { cssFallback, rgbaString, toRgba } from "./color";

/**
 * Design tokens for one colour mode. Any colour may be a literal (`#2a78d6`, `oklch(...)`)
 * or a CSS variable reference (`var(--brand, #2a78d6)`); they are resolved against the
 * chart's own DOM node, so scoped overrides and shadcn tokens just work.
 */
export interface ThemeTokens {
  /** What sits behind the marks. Used for the 2px gaps and rings that separate them. */
  surface: string;
  /** Titles and primary values. */
  ink: string;
  /** Subtitles, legends, direct labels. */
  inkSecondary: string;
  /** Axis labels, source lines. */
  muted: string;
  /** Hairline gridlines. */
  grid: string;
  /** Baselines and axis lines. */
  axis: string;
  /** The colour of the highlighted series, and of a single series. */
  accent: string;
  /** The grey used for every series that is not highlighted. */
  context: string;
  positive: string;
  negative: string;
  /** Identity colours, assigned to entities in fixed order and never cycled. */
  categorical: string[];
  /** One hue, light to dark, for magnitude. */
  sequential: string[];
  /** Negative pole, neutral midpoint, positive pole. */
  diverging: string[];
  fontFamily: string;
  /** Font for titles and big numbers. Defaults to `fontFamily`. */
  displayFamily: string;
  /** Base chart text size in px. Never below 12. */
  fontSize: number;
  /** Corner radius of bar data-ends in px. */
  radius: number;
  lineWidth: number;
}

export interface InsightTheme {
  name: string;
  light: ThemeTokens;
  dark: ThemeTokens;
}

export type ThemeInput = InsightTheme | { name?: string; light?: Partial<ThemeTokens>; dark?: Partial<ThemeTokens> } | Partial<ThemeTokens>;

const v = (name: string, fallback: string) => `var(--ic-${name}, ${fallback})`;
const series = (hexes: string[]) => hexes.map((hex, i) => v(`series-${i + 1}`, hex));
const FONT = `var(--ic-font, inherit)`;

/**
 * The default theme. Chrome follows the host page: ink, borders and font come from shadcn's
 * `--foreground`, `--muted-foreground`, `--border` and `--background` when present, with
 * neutral fallbacks otherwise. Every token can be overridden with an `--ic-*` CSS variable.
 * The categorical order is validated for colour-vision-deficiency separation between
 * neighbours in both modes; keep the order when re-skinning.
 */
export const defaultTheme: InsightTheme = {
  name: "insight",
  light: {
    surface: v("surface", "var(--background, #fcfcfb)"),
    ink: v("ink", "var(--foreground, #0b0b0b)"),
    inkSecondary: v("ink-secondary", "#52514e"),
    muted: v("muted", "var(--muted-foreground, #898781)"),
    grid: v("grid", "#e1e0d9"),
    axis: v("axis", "#c3c2b7"),
    accent: v("accent", "#2a78d6"),
    context: v("context", "#c3c2b7"),
    positive: v("positive", "#0ca30c"),
    negative: v("negative", "#d03b3b"),
    categorical: series(["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"]),
    sequential: ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"],
    diverging: ["#d03b3b", "#eb9d9c", "#f0efec", "#86b6ef", "#256abf"],
    fontFamily: FONT,
    displayFamily: `var(--ic-font-display, ${FONT})`,
    fontSize: 12,
    radius: 4,
    lineWidth: 2,
  },
  dark: {
    surface: v("surface", "var(--background, #1a1a19)"),
    ink: v("ink", "var(--foreground, #f0efec)"),
    inkSecondary: v("ink-secondary", "#c3c2b7"),
    muted: v("muted", "var(--muted-foreground, #898781)"),
    grid: v("grid", "#2c2c2a"),
    axis: v("axis", "#383835"),
    accent: v("accent", "#3987e5"),
    context: v("context", "#52514e"),
    positive: v("positive", "#0ca30c"),
    negative: v("negative", "#e66767"),
    categorical: series(["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#0ca30c", "#9085e9", "#e66767"]),
    sequential: ["#0d366b", "#184f95", "#256abf", "#3987e5", "#6da7ec", "#9ec5f4", "#cde2fb"],
    diverging: ["#e66767", "#8f4a4a", "#383835", "#2f5f9e", "#5598e7"],
    fontFamily: FONT,
    displayFamily: `var(--ic-font-display, ${FONT})`,
    fontSize: 12,
    radius: 4,
    lineWidth: 2,
  },
};

const TOKEN_KEYS = new Set(Object.keys(defaultTheme.light));

/** Build a complete theme from a partial one. Tokens given at the top level apply to both modes. */
export function createTheme(input: ThemeInput = {}, base: InsightTheme = defaultTheme): InsightTheme {
  const anyInput = input as { name?: string; light?: Partial<ThemeTokens>; dark?: Partial<ThemeTokens> } & Partial<ThemeTokens>;
  const shared: Partial<ThemeTokens> = {};
  for (const key of Object.keys(anyInput)) if (TOKEN_KEYS.has(key)) (shared as Record<string, unknown>)[key] = (anyInput as Record<string, unknown>)[key];
  return {
    name: anyInput.name ?? base.name,
    light: { ...base.light, ...shared, ...anyInput.light },
    dark: { ...base.dark, ...shared, ...anyInput.dark },
  };
}

const COLOR_KEYS = ["surface", "ink", "inkSecondary", "muted", "grid", "axis", "accent", "context", "positive", "negative"] as const;
const RAMP_KEYS = ["categorical", "sequential", "diverging"] as const;

/** Tokens with every colour resolved to a concrete hex or rgba string that canvas can draw. */
export type ResolvedTokens = ThemeTokens;

/**
 * Resolve CSS variables and modern colour functions against `el`. Without a DOM (SSR, tests)
 * each token falls back to the literal inside its `var(--x, literal)`.
 */
export function resolveTokens(tokens: ThemeTokens, el?: Element | null): ResolvedTokens {
  const out = { ...tokens, categorical: [...tokens.categorical], sequential: [...tokens.sequential], diverging: [...tokens.diverging] };
  const canCompute = !!el && typeof getComputedStyle === "function" && typeof document !== "undefined";
  let probe: HTMLElement | null = null;
  if (canCompute) {
    probe = document.createElement("span");
    probe.style.display = "none";
    el!.appendChild(probe);
  }
  const color = (value: string): string => {
    if (probe) {
      probe.style.color = "";
      probe.style.color = value;
      if (probe.style.color) {
        const c = toRgba(getComputedStyle(probe).color);
        if (c) return rgbaString(c);
      }
    }
    const fb = cssFallback(value);
    const c = toRgba(fb);
    return c ? rgbaString(c) : fb || "#888888";
  };
  const font = (value: string): string => {
    if (probe) {
      probe.style.fontFamily = value;
      const f = getComputedStyle(probe).fontFamily;
      if (f) return f;
    }
    const fb = cssFallback(value);
    return !fb || fb === "inherit" ? 'system-ui, -apple-system, "Segoe UI", sans-serif' : fb;
  };
  for (const k of COLOR_KEYS) out[k] = color(tokens[k]);
  for (const k of RAMP_KEYS) out[k] = tokens[k].map(color);
  out.fontFamily = font(tokens.fontFamily);
  out.displayFamily = font(tokens.displayFamily);
  probe?.remove();
  return out;
}

/** CSS custom properties the HTML chrome (titles, legends, source lines) is styled with. */
export function chromeVars(tokens: ThemeTokens): Record<string, string> {
  return {
    "--_ic-surface": tokens.surface,
    "--_ic-ink": tokens.ink,
    "--_ic-ink-2": tokens.inkSecondary,
    "--_ic-muted": tokens.muted,
    "--_ic-grid": tokens.grid,
    "--_ic-axis": tokens.axis,
    "--_ic-context": tokens.context,
    "--_ic-accent": tokens.accent,
    "--_ic-positive": tokens.positive,
    "--_ic-negative": tokens.negative,
    "--_ic-font": tokens.fontFamily,
    "--_ic-font-display": tokens.displayFamily,
  };
}
