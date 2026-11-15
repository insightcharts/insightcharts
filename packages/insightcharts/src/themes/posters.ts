import { createTheme, type InsightTheme, type ThemeTokens } from "../core/theme";

/*
 * Poster themes: the grounds the Infographics templates and the `poster` frame paint on.
 *
 * A poster is one designed sheet with a full-bleed painted background and two to four strong
 * flat colours. Each theme here is a SINGLE LOOK: `light` and `dark` hold the same painted
 * design (as two separate token objects), so a poster looks identical whatever colour mode
 * the host page is in. The one exception is stated on the theme: `paper` has an intentional
 * night variant. The `poster` frame forces a mode for everything inside it, so charts never
 * pick the wrong half by detecting the page.
 *
 * `posterBackgrounds[name][mode]` is the CSS background to paint (it may be a gradient);
 * `theme[mode].surface` is the solid colour closest to it, which charts use for the gaps
 * between touching marks and for marker rings. On a gradient ground those gaps are a near
 * match, not an exact one; that is the accepted cost of a painted ground.
 *
 * Legibility is measured, not judged by eye, and re-checked by test/posters.test.ts against
 * EVERY colour stop of the ground, not just `surface`:
 * - `ink`, `inkSecondary` and `muted` are at least 4.5:1 (WCAG AA for text).
 * - Every categorical colour and the accent are at least 3:1.
 * - Neighbours in the categorical order are at least OKLab dE 15 apart, and at least dE 8
 *   under Machado protan and deutan simulation. Because a poster palette is so small, every
 *   other pair is checked too: at least dE 10, and dE 6 under simulation.
 * - Both ends of the sequential ramp are visible against the ground (at least 1.15:1).
 *
 * Deliberately relaxed, compared with the presets in presets.ts (which pass the dataviz
 * palette validator with no warnings):
 * - The OKLCH lightness band and the chroma floor are not applied. A poster palette is small
 *   and bold and uses white, cream and near-black as identity colours next to one or two
 *   saturated ones; those are outside the band and under the chroma floor by design. With
 *   four or five colours, separated mainly by lightness, they stay distinct (the dE checks
 *   above still hold, with and without colour-vision simulation).
 * - Palettes have 4 or 5 colours, not 6 to 8. A poster that needs more identities should
 *   fold the rest into "Other" or use a sequential ramp.
 * - Diverging poles are the theme's own two strongest colours, not always warm against blue.
 *   Each pair is checked for dE 14 under protan and deutan simulation.
 *
 * Display faces are system font stacks chosen for large, light-weight headings; nothing is
 * downloaded. Set `--ic-font-display` on any ancestor to use your own face.
 */

const SANS = "var(--ic-font, inherit)";
const display = (stack: string) => `var(--ic-font-display, ${stack})`;

type Look = Omit<ThemeTokens, "fontFamily" | "displayFamily" | "fontSize" | "radius" | "lineWidth">;

function poster(name: string, face: string, light: Look, dark: Look = light): InsightTheme {
  return createTheme({
    name,
    fontFamily: SANS,
    displayFamily: display(face),
    fontSize: 13,
    radius: 6,
    lineWidth: 2.5,
    light: { ...light, categorical: [...light.categorical], sequential: [...light.sequential], diverging: [...light.diverging] },
    dark: { ...dark, categorical: [...dark.categorical], sequential: [...dark.sequential], diverging: [...dark.diverging] },
  });
}

/**
 * Noir: a near-black sheet with warm yellow and sky blue, white type. Single look.
 * Ground #0d0d0f.
 */
export const noirTheme = poster("noir", `"Helvetica Neue", Helvetica, "Segoe UI", Arial, sans-serif`, {
  surface: "#0d0d0f",
  ink: "#ffffff",
  inkSecondary: "#d0cfca",
  muted: "#a3a29c",
  grid: "#26262a",
  axis: "#48484d",
  accent: "#ffd23f",
  context: "#5c5c61",
  positive: "#5fd4a0",
  negative: "#ff6b5a",
  categorical: ["#ffd23f", "#4db8ff", "#ff6b5a", "#f4f1ea", "#5fd4a0"],
  sequential: ["#4a3d0a", "#7a6410", "#a88a17", "#d4ae22", "#ffd23f", "#ffe17a", "#fff0b8"],
  diverging: ["#ffd23f", "#8a742c", "#34343a", "#346f96", "#4db8ff"],
});

/**
 * Magenta: a saturated magenta sheet with pale pink blocks and a cyan accent. Single look.
 * Ground #c2006b.
 */
export const magentaTheme = poster("magenta", `"Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Arial, sans-serif`, {
  surface: "#c2006b",
  ink: "#ffffff",
  inkSecondary: "#ffeaf3",
  muted: "#ffdbea",
  grid: "#cf2a84",
  axis: "#e262a6",
  accent: "#ffd6e8",
  context: "#8c0a52",
  positive: "#27cdf2",
  negative: "#ffe45c",
  categorical: ["#ffd6e8", "#2b001c", "#27cdf2", "#ffe45c"],
  sequential: ["#dc4a97", "#e56cab", "#ed8cbf", "#f4abd1", "#f9c7e0", "#fde1ee", "#ffffff"],
  diverging: ["#27cdf2", "#7467ae", "#c2006b", "#e1726f", "#ffe45c"],
});

/**
 * Dusk: a deep violet gradient with marks that run orange to yellow. Single look.
 * Ground: 160deg gradient #24104f, #3d1663, #5e2067.
 */
export const duskTheme = poster("dusk", `"Avenir Next", Avenir, "Century Gothic", "Segoe UI", sans-serif`, {
  surface: "#3d1663",
  ink: "#ffffff",
  inkSecondary: "#e8dcf5",
  muted: "#cdbbe3",
  grid: "#5a3683",
  axis: "#6f4b95",
  accent: "#ff8a3d",
  context: "#7f65a0",
  positive: "#6fe0c2",
  negative: "#ff6f9c",
  categorical: ["#ff8a3d", "#ffe08a", "#ff6f9c", "#b9a4ff", "#6fe0c2"],
  sequential: ["#b3472b", "#d45f2e", "#f07a35", "#ff9a45", "#ffb955", "#ffd166", "#ffeaa8"],
  diverging: ["#b9a4ff", "#7b5db1", "#3d1663", "#9e5050", "#ff8a3d"],
});

/**
 * Paper: warm off-white stock printed in ink black and one red. TWO intentional variants:
 * `light` is the daylight sheet; `dark` is the same design printed on charcoal stock with
 * the ink reversed, for a piece that must sit on a dark page. Force `mode="light"` on the
 * frame (the default for posters) to always get the daylight sheet.
 * Grounds #f3ecdf and #1d1b18.
 */
export const paperTheme = poster(
  "paper",
  `"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif`,
  {
    surface: "#f3ecdf",
    ink: "#151412",
    inkSecondary: "#47433c",
    muted: "#68635a",
    grid: "#e2d9c8",
    axis: "#c4b9a4",
    accent: "#d7261e",
    context: "#c9bfad",
    positive: "#1f7a4d",
    negative: "#d7261e",
    categorical: ["#d7261e", "#1a1917", "#8a8172", "#2f6690"],
    sequential: ["#f2c9bf", "#ecaa9d", "#e4857a", "#dc5c50", "#d7261e", "#a81a14", "#74100c"],
    diverging: ["#d7261e", "#e58c7f", "#e6dece", "#7b766c", "#1a1917"],
  },
  {
    surface: "#1d1b18",
    ink: "#f6f0e4",
    inkSecondary: "#cfc7b8",
    muted: "#a39b8c",
    grid: "#302d28",
    axis: "#4d4941",
    accent: "#ff5a4d",
    context: "#5e594f",
    positive: "#5cc48f",
    negative: "#ff5a4d",
    categorical: ["#ff5a4d", "#f6f0e4", "#9a917f", "#f0b92c"],
    sequential: ["#5e1712", "#86201a", "#b02a22", "#d93c31", "#ff5a4d", "#ff9187", "#ffc7c1"],
    diverging: ["#ff5a4d", "#8e3d36", "#35322d", "#958f83", "#f6f0e4"],
  },
);

/**
 * Ocean: deep navy running down to teal, with aqua and coral. Single look.
 * Ground: 180deg gradient #041c3a, #06365a, #084c5c.
 */
export const oceanTheme = poster("ocean", `"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif`, {
  surface: "#06365a",
  ink: "#ffffff",
  inkSecondary: "#d3e8f0",
  muted: "#aecbd8",
  grid: "#1a5578",
  axis: "#3a6f8f",
  accent: "#4fe3d4",
  context: "#5d87a0",
  positive: "#4fe3d4",
  negative: "#ff7a66",
  categorical: ["#4fe3d4", "#ff7a66", "#ffe2a8", "#58a9ff"],
  sequential: ["#128078", "#17968c", "#1fae9f", "#30c7b6", "#4fe3d4", "#93efe4", "#d2f9f3"],
  diverging: ["#ff7a66", "#9a5b62", "#06365a", "#2a8c97", "#4fe3d4"],
});

/**
 * Forest: a dark green sheet with lime and cream. Single look.
 * Ground #0f3d2a.
 */
export const forestTheme = poster("forest", `Optima, Candara, "Segoe UI", "Helvetica Neue", sans-serif`, {
  surface: "#0f3d2a",
  ink: "#f7f3e3",
  inkSecondary: "#d6ddc6",
  muted: "#aebca2",
  grid: "#1c4f39",
  axis: "#44735c",
  accent: "#c6f432",
  context: "#5e8572",
  positive: "#c6f432",
  negative: "#ff9248",
  categorical: ["#c6f432", "#ff9248", "#f5ecd0", "#7cc4f2"],
  sequential: ["#3f6b1f", "#5a8a1e", "#78a91f", "#99c925", "#c6f432", "#dcf87f", "#f0fcc4"],
  diverging: ["#ff9248", "#8c6739", "#0f3d2a", "#46808e", "#7cc4f2"],
});

/**
 * Blueprint: a cobalt sheet with white linework and yellow. Single look.
 * Ground #1447c8.
 */
export const blueprintTheme = poster("blueprint", `ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, "Liberation Mono", monospace`, {
  surface: "#1447c8",
  ink: "#ffffff",
  inkSecondary: "#e3ebff",
  muted: "#c7d7ff",
  grid: "#2c5bd6",
  axis: "#5a82e6",
  accent: "#ffdd33",
  context: "#8fadf2",
  positive: "#9df5c8",
  negative: "#ff9c85",
  categorical: ["#ffdd33", "#ffffff", "#ff9c85", "#a6c8ff"],
  sequential: ["#3d68da", "#5b82e2", "#7d9eea", "#9fb9f1", "#c1d3f7", "#e1eafb", "#ffffff"],
  diverging: ["#ff9c85", "#8a72a7", "#1447c8", "#8a92a0", "#ffdd33"],
});

/**
 * Sunrise: cream running down to peach, with deep plum and tangerine. Single look (a light
 * sheet in both modes).
 * Ground: 180deg gradient #fff1e0, #ffdfc6.
 */
export const sunriseTheme = poster("sunrise", `ui-rounded, "SF Pro Rounded", "Avenir Next", Avenir, "Segoe UI", sans-serif`, {
  surface: "#ffe8d3",
  ink: "#2d0f2a",
  inkSecondary: "#573049",
  muted: "#755066",
  grid: "#f6d6bb",
  axis: "#ddb294",
  accent: "#4a1942",
  context: "#c9a084",
  positive: "#0f766e",
  negative: "#c2255c",
  categorical: ["#4a1942", "#d94a00", "#0f766e", "#2b59c3"],
  sequential: ["#f0c2d2", "#e3a0bb", "#cf78a0", "#b35286", "#8f336b", "#6a2050", "#4a1942"],
  diverging: ["#d94a00", "#ec9a69", "#f6d9c2", "#a0798e", "#4a1942"],
});

/** The poster themes by name. */
export const posterThemes = { noir: noirTheme, magenta: magentaTheme, dusk: duskTheme, paper: paperTheme, ocean: oceanTheme, forest: forestTheme, blueprint: blueprintTheme, sunrise: sunriseTheme } satisfies Record<string, InsightTheme>;

export type PosterThemeName = keyof typeof posterThemes;

const solid = (t: InsightTheme) => ({ light: t.light.surface, dark: t.dark.surface });
const both = (css: string) => ({ light: css, dark: css });

/**
 * The CSS background each poster theme is painted on, per mode. Solid colours or gradients;
 * every colour stop is a literal hex, and every stop passes the contrast floors above.
 */
export const posterBackgrounds: Record<PosterThemeName, { light: string; dark: string }> = {
  noir: solid(noirTheme),
  magenta: solid(magentaTheme),
  dusk: both("linear-gradient(160deg, #24104f 0%, #3d1663 55%, #5e2067 100%)"),
  paper: solid(paperTheme),
  ocean: both("linear-gradient(180deg, #041c3a 0%, #06365a 55%, #084c5c 100%)"),
  forest: solid(forestTheme),
  blueprint: solid(blueprintTheme),
  sunrise: both("linear-gradient(180deg, #fff1e0 0%, #ffdfc6 100%)"),
};
