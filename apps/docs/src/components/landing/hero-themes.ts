// The themes the landing page's hero can be painted in: its own night design, and library
// themes rebuilt for this composition. Every colour comes from the library's theme objects.
import { alpha, luminance, mix, toRgba } from "insightcharts";
import { posterBackgrounds, themes, themeSurfaces } from "insightcharts/themes";

export interface HeroTokens {
  surface: string;
  ink: string;
  inkSecondary: string;
  muted: string;
  grid: string;
  axis: string;
  accent: string;
  context: string;
  positive: string;
  negative: string;
  categorical: string[];
  sequential: string[];
}

export interface HeroTheme {
  name: string;
  label: string;
  /** The CSS background of the whole hero. May be a gradient. */
  ground: string;
  /** Whether the ground is dark, which is the colour mode the charts are drawn in. */
  mode: "light" | "dark";
  tokens: HeroTokens;
  /** The theme object handed to the charts. The same tokens in both modes: one painted design. */
  theme: { name: string; light: HeroTokens; dark: HeroTokens };
}

const MODES = 6;

const distance = (a: string, b: string) => {
  const x = toRgba(a);
  const y = toRgba(b);
  if (!x || !y) return 0;
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
};

/**
 * Six identity colours from a theme that may have four or five. The theme's own colours come
 * first, in order. Each extra one is the blend of two of them, or of one with the ink, that
 * sits furthest from every colour already chosen and from the ground. The result depends only
 * on the theme, so a mode keeps its colour for as long as the theme is on.
 */
function sixColours(own: string[], surface: string, ink: string): string[] {
  const chosen: string[] = [];
  for (const c of own) if (chosen.length < MODES && chosen.every((x) => distance(x, c) > 40) && distance(c, surface) > 60) chosen.push(c);
  const base = [...chosen];
  while (chosen.length < MODES) {
    const candidates: string[] = [];
    for (let i = 0; i < base.length; i++) {
      for (let j = i + 1; j < base.length; j++) candidates.push(mix(base[i], base[j], 0.5));
      candidates.push(mix(base[i], ink, 0.45));
    }
    let best = candidates[0];
    let bestScore = -1;
    for (const c of candidates) {
      const score = Math.min(distance(c, surface) * 0.8, ...chosen.map((x) => distance(x, c)));
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    chosen.push(best);
  }
  return chosen;
}

// Magnitude runs from the ground towards the ink, so the map never borrows a mode's colour.
const groundRamp = (surface: string, ink: string) => [0.14, 0.32, 0.55, 0.78, 1].map((t) => mix(surface, ink, t));

function build(name: string, label: string, tokens: HeroTokens, ground: string): HeroTheme {
  return { name, label, ground, mode: luminance(tokens.surface) < 0.4 ? "dark" : "light", tokens, theme: { name: `hero-${name}`, light: tokens, dark: tokens } };
}

/** A library theme by name, with six mode colours and a ground-to-ink ramp. */
function fromLibrary(name: string, look: "light" | "dark" = "light"): HeroTheme {
  const t = themes[name][look];
  const ground = (posterBackgrounds as Record<string, { light: string; dark: string }>)[name]?.[look] ?? (themeSurfaces as Record<string, { light: string; dark: string }>)[name]?.[look] ?? t.surface;
  const tokens: HeroTokens = {
    surface: t.surface,
    ink: t.ink,
    inkSecondary: t.inkSecondary,
    muted: t.muted,
    grid: t.grid,
    axis: t.axis,
    accent: t.accent,
    context: t.context,
    positive: t.positive,
    negative: t.negative,
    categorical: sixColours(t.categorical, t.surface, t.ink),
    sequential: groundRamp(t.surface, t.ink),
  };
  return build(name, name.charAt(0).toUpperCase() + name.slice(1), tokens, ground);
}

// The hero's own design: a night ground, six hues, and a ramp from the ground to white.
const night = build(
  "night",
  "Night",
  {
    surface: "#0b1022",
    ink: "#f5f6ff",
    inkSecondary: "#c3c9ea",
    muted: "#8a92bd",
    grid: "#232b52",
    axis: "#39427a",
    accent: "#4cc9f0",
    context: "#39416d",
    positive: "#3ddc97",
    negative: "#ff7a7a",
    categorical: ["#4cc9f0", "#ffd23f", "#3ddc97", "#ff6fa5", "#a594ff", "#ff9547"],
    sequential: ["#1a2146", "#35408a", "#7482d8", "#c3cbff", "#ffffff"],
  },
  "radial-gradient(120% 90% at 12% 0%, #1b2357 0%, rgba(27,35,87,0) 55%), radial-gradient(90% 80% at 100% 100%, #2a1650 0%, rgba(42,22,80,0) 60%), #0b1022",
);

/** In rotation order: dark and light grounds alternate where they can, so each change is a clear one. */
export const HERO_THEMES: HeroTheme[] = [night, fromLibrary("sunrise"), fromLibrary("dusk"), fromLibrary("editorial"), fromLibrary("ocean"), fromLibrary("magenta"), fromLibrary("ledger"), fromLibrary("forest"), fromLibrary("noir")];

/** The hero's own chrome (title, labels, pills, Reset) reads these variables. */
export const chromeOf = (t: HeroTheme) => ({ "--h-ink": t.tokens.ink, "--h-ink2": t.tokens.inkSecondary, "--h-muted": t.tokens.muted, "--h-line": alpha(t.tokens.ink, 0.22), "--h-wash": alpha(t.tokens.ink, 0.1), "--h-accent": t.tokens.accent }) as Record<string, string>;
