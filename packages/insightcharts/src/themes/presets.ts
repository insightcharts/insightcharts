import { createTheme, type InsightTheme } from "../core/theme";

/*
 * Theme presets.
 *
 * Unlike the default theme, which borrows its surface and ink from the host page, every
 * preset here paints with literal colours chosen for ONE specific surface per mode. The
 * light and dark token sets are designed separately for that surface (they are not an
 * automatic flip), but entity N keeps the same hue family in both modes.
 *
 * Because charts draw on a transparent canvas, a preset only looks right when its container
 * has the matching background. Use `themeSurfaces[name][mode]` (or `theme.light.surface` /
 * `theme.dark.surface`) as the background of the section, card or page the charts sit in:
 *
 *   <section style={{ background: themeSurfaces.ledger.light }}>
 *     <InsightProvider theme={ledgerTheme} mode="light">...</InsightProvider>
 *   </section>
 *
 * On a different background the 2px mark separators, marker rings and sticky table headers
 * (all drawn in `surface`) show as off-colour seams, and the contrast figures below no
 * longer hold.
 *
 * Every categorical palette was checked with the dataviz palette validator
 * (validate_palette.js: OKLCH lightness band, chroma floor, adjacent-pair OKLab dE under
 * Machado protan/deutan simulation with target 8, normal-vision adjacent dE floor 15, WCAG
 * 3:1 against the surface). The result is recorded above each theme and is re-checked by
 * test/themes.test.ts. The ORDER is part of the result: re-ordering or re-stepping a
 * palette needs a new validator run. No palette needed the contrast or CVD WARN relief.
 *
 * Diverging ramps run warm pole, neutral midpoint, blue pole. The poles are warm/blue in
 * every preset, whatever its accent, because that axis survives red-green colour-vision
 * deficiency; magenta against teal, for example, collapses to dE 4 under deuteranopia.
 */

const SANS = "var(--ic-font, inherit)";
const tokens = { fontFamily: SANS, displayFamily: `var(--ic-font-display, ${SANS})`, fontSize: 12 };

/**
 * Editorial: a broadsheet graphics desk. Cool newsprint white, blue-black ink, a serif
 * display face for headlines and big numbers, carmine as the signature colour.
 * To change the headline face set `--ic-font-display`.
 *
 * Validator: light on #f8f7f4 ALL PASS (CVD worst adjacent 13.9 protan, normal 20.0, all 7 >= 3:1).
 *            dark on #15171a  ALL PASS (CVD worst adjacent 9.6 deutan, normal 18.9, all 7 >= 3:1).
 */
export const editorialTheme: InsightTheme = createTheme({
  name: "editorial",
  ...tokens,
  displayFamily: `var(--ic-font-display, "Source Serif 4", "Source Serif Pro", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif)`,
  radius: 1,
  lineWidth: 2,
  light: {
    surface: "#f8f7f4",
    ink: "#16181b",
    inkSecondary: "#4a4d52",
    muted: "#7c7f84",
    grid: "#e3e1db",
    axis: "#c2c0b9",
    accent: "#be2038",
    context: "#c5c3bd",
    positive: "#2f7d4f",
    negative: "#be2038",
    categorical: ["#be2038", "#225899", "#ba8015", "#029b94", "#82417d", "#688e3b", "#7470b9"],
    sequential: ["#fee0df", "#feb9b8", "#ff898b", "#e75f66", "#c43e49", "#9b2532", "#71121f"],
    diverging: ["#af2938", "#e49090", "#e9e7e1", "#8aaedc", "#215da5"],
  },
  dark: {
    surface: "#15171a",
    ink: "#eeece7",
    inkSecondary: "#b9b8b3",
    muted: "#85878b",
    grid: "#272a2e",
    axis: "#3a3d42",
    accent: "#dd4d57",
    context: "#4d5055",
    positive: "#4ea672",
    negative: "#dd4d57",
    categorical: ["#dd4d57", "#5188cd", "#b8892d", "#01a49c", "#985792", "#749a48", "#8582cc"],
    sequential: ["#5c0012", "#80001d", "#a51c30", "#c43e49", "#dc696d", "#eb9796", "#f9c5c4"],
    diverging: ["#e75f66", "#883d40", "#34373c", "#395a83", "#5e9ae7"],
  },
});

/**
 * Ledger: financial pages on salmon paper. Oxford blue leads, claret and teal follow; the
 * dark set sits on a warm espresso, not a neutral black, so the paper character survives.
 *
 * Validator: light on #fff1e5 ALL PASS (CVD worst adjacent 13.9 deutan, normal 16.6, all 8 >= 3:1).
 *            dark on #201c1a  ALL PASS (CVD worst adjacent 13.4 protan, normal 16.8, all 8 >= 3:1).
 */
export const ledgerTheme: InsightTheme = createTheme({
  name: "ledger",
  ...tokens,
  radius: 2,
  lineWidth: 2,
  light: {
    surface: "#fff1e5",
    ink: "#33302e",
    inkSecondary: "#5c5753",
    muted: "#857c75",
    grid: "#f0dccb",
    axis: "#d4bfae",
    accent: "#005799",
    context: "#cdbcae",
    positive: "#1f7a4d",
    negative: "#b3263f",
    categorical: ["#005799", "#33854a", "#6f4fa1", "#971c49", "#d06f00", "#009893", "#af8014", "#c35f92"],
    sequential: ["#d8eafe", "#a8d2fe", "#79b6f5", "#4d97de", "#2d78bd", "#165a96", "#053f6e"],
    diverging: ["#ac3031", "#e1938c", "#f0dfd0", "#85afdb", "#1666aa"],
  },
  dark: {
    surface: "#201c1a",
    ink: "#f6e9df",
    inkSecondary: "#c9bcb1",
    muted: "#948980",
    grid: "#332d2a",
    axis: "#4a423d",
    accent: "#418ad1",
    context: "#5c534d",
    positive: "#4ea672",
    negative: "#e0607a",
    categorical: ["#418ad1", "#4a9a5e", "#856bbc", "#c34269", "#d0791b", "#0a9aa2", "#b1880b", "#c66897"],
    sequential: ["#002f56", "#014478", "#065da0", "#2d78bd", "#5b97d3", "#8bb5e1", "#bed7f2"],
    diverging: ["#e76761", "#85403c", "#3d3632", "#345b82", "#519ae2"],
  },
});

/**
 * Mono: high contrast. Pure black-and-white chrome, square marks, a heavy baseline, and one
 * accent (ultramarine) that carries the story against grey `context` series. Use it with
 * `highlight`: one series in the accent, the rest grey. The categorical order still holds
 * six separable hues for the cases where identity needs more than one, because grey steps
 * cannot be told apart reliably.
 *
 * Validator: light on #ffffff ALL PASS (CVD worst adjacent 12.8 deutan, normal 22.9, all 6 >= 3:1).
 *            dark on #0b0b0c  ALL PASS (CVD worst adjacent 12.3 deutan, normal 22.7, all 6 >= 3:1).
 */
export const monoTheme: InsightTheme = createTheme({
  name: "mono",
  ...tokens,
  radius: 0,
  lineWidth: 2.5,
  light: {
    surface: "#ffffff",
    ink: "#000000",
    inkSecondary: "#3d3d3d",
    muted: "#767676",
    grid: "#e6e6e6",
    axis: "#111111",
    accent: "#1d4ce9",
    context: "#bdbdbd",
    positive: "#1b8a43",
    negative: "#e2381c",
    categorical: ["#1d4ce9", "#e2381c", "#0a96af", "#bd8a05", "#bd2099", "#1b9247"],
    sequential: ["#dde8ff", "#b7cefe", "#8baffe", "#5b8bff", "#3265f3", "#1f48c4", "#112f92"],
    diverging: ["#b71d00", "#ec8d7a", "#e8e8e8", "#82a8fe", "#1e4ad7"],
  },
  dark: {
    surface: "#0b0b0c",
    ink: "#ffffff",
    inkSecondary: "#c9c9c9",
    muted: "#8c8c8c",
    grid: "#262627",
    axis: "#f2f2f2",
    accent: "#4475f6",
    context: "#555557",
    positive: "#2e9e52",
    negative: "#ec4d33",
    categorical: ["#4475f6", "#ec4d33", "#079db6", "#bd811c", "#d243ad", "#2e9e52"],
    sequential: ["#051b7e", "#0c2da9", "#1b47d3", "#3265f3", "#5b8bfe", "#8bafff", "#c0d4ff"],
    diverging: ["#f4543a", "#8f392a", "#333335", "#3353a1", "#6592ff"],
  },
});

/**
 * Earth: field notes. Warm stone surface, moss as the lead, lake blue, ochre and clay
 * behind it. Muted chroma throughout; suits environment, agriculture and place-based stories.
 *
 * Validator: light on #f4f1ea ALL PASS (CVD worst adjacent 9.6 deutan, normal 17.8, all 7 >= 3:1).
 *            dark on #1b1a17  ALL PASS (CVD worst adjacent 9.7 deutan, normal 16.9, all 7 >= 3:1).
 */
export const earthTheme: InsightTheme = createTheme({
  name: "earth",
  ...tokens,
  radius: 3,
  lineWidth: 2,
  light: {
    surface: "#f4f1ea",
    ink: "#24231f",
    inkSecondary: "#54514a",
    muted: "#7d796f",
    grid: "#e2ddd1",
    axis: "#c4bead",
    accent: "#49782a",
    context: "#c6c0b2",
    positive: "#49782a",
    negative: "#b0432e",
    categorical: ["#49782a", "#0272a0", "#823a64", "#ab8301", "#009588", "#b25634", "#7f6bb2"],
    sequential: ["#d6e8cc", "#bad9aa", "#95c07e", "#71a255", "#548436", "#3c6521", "#274710"],
    diverging: ["#964d09", "#cf9f7f", "#e6e1d6", "#85b1d1", "#0e6a9b"],
  },
  dark: {
    surface: "#1b1a17",
    ink: "#efebe2",
    inkSecondary: "#bdb8ab",
    muted: "#8a8578",
    grid: "#2c2a25",
    axis: "#403d36",
    accent: "#669649",
    context: "#57534a",
    positive: "#669649",
    negative: "#d9694f",
    categorical: ["#669649", "#388fc4", "#a55b84", "#b28c32", "#189e8d", "#c66846", "#9083ca"],
    sequential: ["#183700", "#264e04", "#3b6919", "#548436", "#77a05f", "#9ebc8e", "#c9dbbf"],
    diverging: ["#cd8047", "#774d2f", "#3a3832", "#335d79", "#4e9ed2"],
  },
});

/**
 * Science: journal figures. Cool blue-grey surface, thin lines, tight corners, a teal lead
 * and a wide-gamut categorical order for plots with many conditions.
 *
 * Validator: light on #f6f8fa ALL PASS (CVD worst adjacent 10.3 deutan, normal 20.5, all 8 >= 3:1).
 *            dark on #0e151c  ALL PASS (CVD worst adjacent 10.0 deutan, normal 17.3, all 8 >= 3:1).
 */
export const scienceTheme: InsightTheme = createTheme({
  name: "science",
  ...tokens,
  radius: 2,
  lineWidth: 1.5,
  light: {
    surface: "#f6f8fa",
    ink: "#0f1b26",
    inkSecondary: "#44525f",
    muted: "#6f7c88",
    grid: "#dfe5ea",
    axis: "#b8c2cc",
    accent: "#0597a4",
    context: "#bcc6cf",
    positive: "#0d8a4f",
    negative: "#cf4a3a",
    categorical: ["#0597a4", "#454bc0", "#c47d05", "#b83997", "#0e9254", "#0068a5", "#d95544", "#8b4ec4"],
    sequential: ["#c8f1f5", "#94dce4", "#54c4d0", "#05a5b3", "#09848f", "#02646d", "#00464d"],
    diverging: ["#a63c0c", "#dc9880", "#e3e8ed", "#79b2db", "#006495"],
  },
  dark: {
    surface: "#0e151c",
    ink: "#e6edf3",
    inkSecondary: "#a9b6c2",
    muted: "#74818d",
    grid: "#1c2630",
    axis: "#2d3a47",
    accent: "#099eab",
    context: "#44515e",
    positive: "#2ea864",
    negative: "#e2695a",
    categorical: ["#099eab", "#6572e4", "#c08515", "#c952a8", "#269e5f", "#0486d3", "#dc5f4e", "#9e66d7"],
    sequential: ["#00353a", "#024c52", "#016770", "#09848f", "#2ca4b0", "#78bfc7", "#b5dde1"],
    diverging: ["#dd6d45", "#82452f", "#2a343f", "#245e82", "#2ea2e5"],
  },
});

/**
 * Poster: loud on purpose. Saturated magenta lead, fat lines, round bar ends, on a pale
 * lilac sheet or a deep indigo one. For social cards, hero graphics and short pieces;
 * too insistent for a dense dashboard.
 *
 * Validator: light on #f6f3fb ALL PASS (CVD worst adjacent 15.5 deutan, normal 20.7, all 8 >= 3:1).
 *            dark on #16112e  ALL PASS (CVD worst adjacent 14.3 deutan, normal 19.5, all 8 >= 3:1).
 */
export const posterTheme: InsightTheme = createTheme({
  name: "poster",
  ...tokens,
  radius: 8,
  lineWidth: 3,
  light: {
    surface: "#f6f3fb",
    ink: "#16112e",
    inkSecondary: "#4a4466",
    muted: "#7a7594",
    grid: "#e2dcee",
    axis: "#c2bad6",
    accent: "#da0081",
    context: "#c5bed6",
    positive: "#018a5a",
    negative: "#d40924",
    categorical: ["#da0081", "#d96d03", "#0056ef", "#019f68", "#8b3ae5", "#ab8407", "#0898ab", "#d40924"],
    sequential: ["#ffdee9", "#ffb5d1", "#ff81b6", "#f14499", "#cd167b", "#9f025d", "#720041"],
    diverging: ["#a24102", "#e6936d", "#e7e4ec", "#82a8fe", "#2351de"],
  },
  dark: {
    surface: "#16112e",
    ink: "#f6f3fb",
    inkSecondary: "#beb7d9",
    muted: "#8a83a8",
    grid: "#262046",
    axis: "#3a3360",
    accent: "#e93090",
    context: "#575268",
    positive: "#04a66d",
    negative: "#e23439",
    categorical: ["#e93090", "#e16c10", "#3075fe", "#04a66d", "#9d5bf4", "#ac9008", "#03a1b5", "#e23439"],
    sequential: ["#580031", "#7b0046", "#a40260", "#cd167b", "#e55798", "#f28cb5", "#fec0d7"],
    diverging: ["#ef6505", "#8a3f18", "#3a3844", "#3353a1", "#608fff"],
  },
});

/** The presets that paint their own surface, by name. */
export const presetThemes = { editorial: editorialTheme, ledger: ledgerTheme, mono: monoTheme, earth: earthTheme, science: scienceTheme, poster: posterTheme } satisfies Record<string, InsightTheme>;

/**
 * The background each preset was designed for, per mode. Paint the chart's container with
 * it; see the note at the top of this file.
 */
export const themeSurfaces: Record<keyof typeof presetThemes, { light: string; dark: string }> = Object.fromEntries(Object.entries(presetThemes).map(([name, t]) => [name, { light: t.light.surface, dark: t.dark.surface }])) as Record<keyof typeof presetThemes, { light: string; dark: string }>;
