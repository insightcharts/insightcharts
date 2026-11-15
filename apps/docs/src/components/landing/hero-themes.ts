// The themes the landing page's hero can be painted in: library themes rebuilt for this
// composition, dark looks first. Every colour comes from the library's theme objects.
import { alpha, cssFallback, luminance, mix, toRgba } from "insightcharts";
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

// Some library tokens are CSS variable references with a literal fallback
// (`var(--ic-ink, var(--foreground, #0b0b0b))`). The hero paints one fixed design per pill,
// so it takes the literal.
const literal = (value: string) => (value.includes("var(") ? cssFallback(value) : value);

type Source = Omit<HeroTokens, "sequential">;

function tokensOf(t: Source): HeroTokens {
  const surface = literal(t.surface);
  const ink = literal(t.ink);
  return {
    surface,
    ink,
    inkSecondary: literal(t.inkSecondary),
    muted: literal(t.muted),
    grid: literal(t.grid),
    axis: literal(t.axis),
    accent: literal(t.accent),
    context: literal(t.context),
    positive: literal(t.positive),
    negative: literal(t.negative),
    categorical: sixColours(t.categorical.map(literal), surface, ink),
    sequential: groundRamp(surface, ink),
  };
}

/** A library theme by name in one of its two looks, with six mode colours and a ground-to-ink ramp. */
function fromLibrary(name: string, look: "light" | "dark", label: string): HeroTheme {
  const t = themes[name][look];
  const ground = (posterBackgrounds as Record<string, { light: string; dark: string }>)[name]?.[look] ?? (themeSurfaces as Record<string, { light: string; dark: string }>)[name]?.[look] ?? literal(t.surface);
  return build(`${name}-${look}`, label, tokensOf(t), ground);
}

// The shadcn theme reads `--chart-1` to `--chart-5` and the page's own tokens at run time, so
// it has no literal colours of its own. These are shadcn/ui's stock dark values.
const shadcnDark = build(
  "shadcn-dark",
  "shadcn",
  tokensOf({
    surface: "#0a0a0a",
    ink: "#fafafa",
    inkSecondary: "#a1a1a1",
    muted: "#8a8a8a",
    grid: "#262626",
    axis: "#3a3a3a",
    accent: "#1447e6",
    context: "#404040",
    positive: "#00bc7d",
    negative: "#ff6467",
    categorical: ["#1447e6", "#00bc7d", "#fe9a00", "#ad46ff", "#ff2056"],
  }),
  "#0a0a0a",
);

/**
 * In rotation order: the dark looks first, then light ones. Each entry has a unique name,
 * because a theme can appear in both looks.
 */
export const HERO_THEMES: HeroTheme[] = [
  fromLibrary("noir", "dark", "Noir"),
  fromLibrary("paper", "dark", "Paper"),
  fromLibrary("earth", "dark", "Earth"),
  fromLibrary("science", "dark", "Science"),
  fromLibrary("ledger", "dark", "Ledger"),
  fromLibrary("editorial", "dark", "Editorial"),
  shadcnDark,
  fromLibrary("dusk", "dark", "Dusk"),
  fromLibrary("insight", "dark", "Insight"),
  fromLibrary("sunrise", "light", "Sunrise"),
  fromLibrary("editorial", "light", "Editorial light"),
  fromLibrary("ledger", "light", "Ledger light"),
  fromLibrary("science", "light", "Science light"),
  fromLibrary("earth", "light", "Earth light"),
];

/** The hero's own chrome (title, labels, pills, Reset) reads these variables. */
export const chromeOf = (t: HeroTheme) => ({ "--h-ink": t.tokens.ink, "--h-ink2": t.tokens.inkSecondary, "--h-muted": t.tokens.muted, "--h-line": alpha(t.tokens.ink, 0.22), "--h-wash": alpha(t.tokens.ink, 0.1), "--h-accent": t.tokens.accent }) as Record<string, string>;
