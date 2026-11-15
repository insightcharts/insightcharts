import { beforeAll, describe, expect, it } from "vitest";
import { defaultTheme, resolveTokens, type InsightTheme, type ThemeTokens } from "../src/core/theme";
import { themes as rootThemes } from "../src/index";
import { createTheme, earthTheme, editorialTheme, ledgerTheme, monoTheme, posterTheme, posterThemes, presetThemes, scienceTheme, shadcnTheme, themeSurfaces, themes } from "../src/themes";
import { stubCanvas } from "./helpers";
import { checkPalette, contrast, CVD_TARGET, NORMAL_FLOOR, oklch, relativeLuminance } from "./palette-checks";

beforeAll(stubCanvas);

// Taken from the default theme rather than listed, so a token added to core is required of
// every preset automatically.
const TOKEN_KEYS = Object.keys(defaultTheme.light) as (keyof ThemeTokens)[];
const COLOR_KEYS = ["surface", "ink", "inkSecondary", "muted", "grid", "axis", "accent", "context", "positive", "negative"] as const;
const RAMP_KEYS = ["categorical", "sequential", "diverging"] as const;
const MODES = ["light", "dark"] as const;
const HEX = /^#[0-9a-f]{6}$/;
const all = Object.entries(themes);
const presets = Object.entries(presetThemes) as [keyof typeof presetThemes, InsightTheme][];

describe("the themes record", () => {
  it("contains the two page-following themes, six presets and the poster themes, each under its own name", () => {
    expect(Object.keys(themes).sort()).toEqual(["earth", "editorial", "insight", "ledger", "mono", "poster", "science", "shadcn", ...Object.keys(posterThemes)].sort());
    for (const [key, theme] of all) expect(theme.name, key).toBe(key);
  });

  it("is the same record the package root exports, and holds the named exports", () => {
    expect(rootThemes).toBe(themes);
    expect(themes.insight).toBe(defaultTheme);
    expect(themes.shadcn).toBe(shadcnTheme);
    expect([themes.editorial, themes.ledger, themes.mono, themes.earth, themes.science, themes.poster]).toEqual([editorialTheme, ledgerTheme, monoTheme, earthTheme, scienceTheme, posterTheme]);
    expect(typeof createTheme).toBe("function");
  });
});

describe.each(all)("theme %s is a complete InsightTheme", (_name, theme) => {
  it.each(MODES)("%s has every token, with the right type", (mode) => {
    const t = theme[mode];
    expect(Object.keys(t).sort()).toEqual([...TOKEN_KEYS].sort());
    for (const key of COLOR_KEYS) {
      expect(typeof t[key], key).toBe("string");
      expect(t[key].length, key).toBeGreaterThan(0);
    }
    for (const key of RAMP_KEYS) {
      expect(Array.isArray(t[key]), key).toBe(true);
      expect(t[key].length, key).toBeGreaterThan(0);
      for (const c of t[key]) expect(typeof c === "string" && c.length > 0, `${key}: ${c}`).toBe(true);
    }
    expect(t.fontFamily).toBeTruthy();
    expect(t.displayFamily).toBeTruthy();
    expect(t.fontSize).toBeGreaterThanOrEqual(12);
    expect(t.radius).toBeGreaterThanOrEqual(0);
    expect(t.lineWidth).toBeGreaterThan(0);
  });

  it("has enough ramp steps to interpolate: 5+ sequential, an odd 3+ diverging, at most 8 categorical", () => {
    for (const mode of MODES) {
      expect(theme[mode].sequential.length).toBeGreaterThanOrEqual(5);
      expect(theme[mode].diverging.length).toBeGreaterThanOrEqual(3);
      expect(theme[mode].diverging.length % 2).toBe(1);
      expect(theme[mode].categorical.length).toBeLessThanOrEqual(8);
      expect(theme[mode].categorical.length).toBe(theme.light.categorical.length);
    }
  });

  it("does not share token objects between modes or with the default theme", () => {
    expect(theme.light).not.toBe(theme.dark);
    if (theme !== defaultTheme) expect(theme.light).not.toBe(defaultTheme.light);
  });
});

describe.each(presets)("preset %s", (name, theme) => {
  it("uses literal hex colours, so it resolves identically with or without a DOM", () => {
    for (const mode of MODES) {
      const t = theme[mode];
      for (const key of COLOR_KEYS) expect(t[key], `${mode}.${key}`).toMatch(HEX);
      for (const key of RAMP_KEYS) for (const c of t[key]) expect(c, `${mode}.${key}`).toMatch(HEX);
      const resolved = resolveTokens(t);
      for (const key of COLOR_KEYS) expect(resolved[key]).toBe(t[key]);
      expect(resolved.categorical).toEqual(t.categorical);
    }
  });

  it("exposes the surfaces it was designed for", () => {
    expect(themeSurfaces[name]).toEqual({ light: theme.light.surface, dark: theme.dark.surface });
  });

  it("has a light surface that reads as light and a dark one that auto mode detection reads as dark", () => {
    expect(relativeLuminance(theme.light.surface)).toBeGreaterThan(0.8);
    // detectMode's background fallback calls anything under luminance 0.2 dark.
    expect(relativeLuminance(theme.dark.surface)).toBeLessThan(0.05);
  });

  it.each(MODES)("%s chrome is legible on its surface", (mode) => {
    const t = theme[mode];
    // WCAG AAA for headlines and values, AA for subtitles, legends and direct labels.
    expect(contrast(t.ink, t.surface), "ink").toBeGreaterThanOrEqual(7);
    expect(contrast(t.inkSecondary, t.surface), "inkSecondary").toBeGreaterThanOrEqual(4.5);
    // Axis labels and source lines: the default theme's muted sits at 3.5:1 on its own
    // fallback surface, and presets are held to the same level, not to AA.
    expect(contrast(t.muted, t.surface), "muted").toBeGreaterThanOrEqual(3.5);
    expect(contrast(t.accent, t.surface), "accent").toBeGreaterThanOrEqual(3);
    expect(contrast(t.positive, t.surface), "positive").toBeGreaterThanOrEqual(3);
    expect(contrast(t.negative, t.surface), "negative").toBeGreaterThanOrEqual(3);
    // Gridlines are hairlines that must recede: visible, but far quieter than the axis labels.
    expect(contrast(t.grid, t.surface), "grid").toBeGreaterThan(1.05);
    expect(contrast(t.grid, t.surface), "grid").toBeLessThan(1.5);
    // Context series recede behind the accent but stay visible.
    expect(contrast(t.context, t.surface), "context").toBeGreaterThan(1.4);
    expect(contrast(t.context, t.surface), "context").toBeLessThan(contrast(t.accent, t.surface));
    expect(oklch(t.context).C, "context is grey").toBeLessThan(0.06);
  });

  it.each(MODES)("%s categorical palette passes the validator's checks with no warnings", (mode) => {
    const t = theme[mode];
    const report = checkPalette(t.categorical, mode, t.surface);
    expect(t.categorical.length).toBeGreaterThanOrEqual(6);
    expect(new Set(t.categorical).size).toBe(t.categorical.length);
    expect(report.offBand, "lightness band").toEqual([]);
    expect(report.lowChroma, "chroma floor").toEqual([]);
    expect(report.cvd, "adjacent CVD separation").toBeGreaterThanOrEqual(CVD_TARGET);
    expect(report.normal, "adjacent normal-vision separation").toBeGreaterThanOrEqual(NORMAL_FLOOR);
    expect(report.lowContrast, "contrast vs surface").toEqual([]);
  });

  it("leads the categorical order with the accent, in both modes", () => {
    for (const mode of MODES) expect(theme[mode].categorical[0]).toBe(theme[mode].accent);
  });

  it("keeps each entity in the same hue family in light and dark", () => {
    theme.light.categorical.forEach((c, i) => {
      const d = Math.abs(oklch(c).H - oklch(theme.dark.categorical[i]).H);
      expect(Math.min(d, 360 - d), `slot ${i + 1}`).toBeLessThan(30);
    });
  });

  it.each(MODES)("%s sequential ramp is one hue, running monotonically from near the surface to far from it", (mode) => {
    const t = theme[mode];
    const L = t.sequential.map((c) => oklch(c).L);
    const sign = mode === "light" ? -1 : 1;
    for (let i = 1; i < L.length; i++) expect((L[i] - L[i - 1]) * sign, `step ${i}`).toBeGreaterThan(0.04);
    const hues = t.sequential.map((c) => oklch(c).H);
    const spread = Math.max(...hues) - Math.min(...hues);
    expect(Math.min(spread, 360 - spread)).toBeLessThanOrEqual(40);
    // The far end must stand clear of the surface; the near end must still be a visible tint.
    expect(contrast(t.sequential.at(-1)!, t.surface)).toBeGreaterThan(4.5);
    expect(contrast(t.sequential[0], t.surface)).toBeGreaterThan(1.08);
  });

  it.each(MODES)("%s diverging ramp has two distinct poles around a neutral midpoint", (mode) => {
    const d = theme[mode].diverging;
    const mid = d[(d.length - 1) / 2];
    const chroma = d.map((c) => oklch(c).C);
    expect(oklch(mid).C).toBe(Math.min(...chroma));
    expect(oklch(mid).C).toBeLessThan(0.03);
    // The midpoint is the step closest to the surface: "no difference" should nearly vanish.
    const toSurface = d.map((c) => contrast(c, theme[mode].surface));
    expect(contrast(mid, theme[mode].surface)).toBe(Math.min(...toSurface));
    const hueGap = Math.abs(oklch(d[0]).H - oklch(d.at(-1)!).H);
    expect(Math.min(hueGap, 360 - hueGap)).toBeGreaterThan(90);
    // The poles must survive red-green colour-vision deficiency and be of similar weight.
    expect(checkPalette([d[0], d.at(-1)!], mode, theme[mode].surface).cvd).toBeGreaterThan(15);
    expect(Math.abs(oklch(d[0]).L - oklch(d.at(-1)!).L)).toBeLessThan(0.08);
    // Each arm steps monotonically away from the midpoint.
    const dist = d.map((c) => Math.abs(oklch(c).L - oklch(mid).L));
    for (let i = 0; i < (d.length - 1) / 2; i++) {
      expect(dist[i]).toBeGreaterThan(dist[i + 1]);
      expect(dist[d.length - 1 - i]).toBeGreaterThan(dist[d.length - 2 - i]);
    }
  });
});

describe("presets as a set", () => {
  it("are visibly different from each other: distinct surfaces and accents in both modes", () => {
    for (const mode of MODES) {
      expect(new Set(presets.map(([, t]) => t[mode].surface)).size).toBe(presets.length);
      expect(new Set(presets.map(([, t]) => t[mode].accent)).size).toBe(presets.length);
    }
  });

  it("can be extended with createTheme without losing their palette", () => {
    const brand = createTheme({ name: "brand", accent: "#000000" }, ledgerTheme);
    expect(brand.light.surface).toBe(ledgerTheme.light.surface);
    expect(brand.dark.categorical).toEqual(ledgerTheme.dark.categorical);
    expect(brand.light.accent).toBe("#000000");
    expect(ledgerTheme.light.accent).not.toBe("#000000");
  });

  it("editorial sets a serif display face that can still be overridden by --ic-font-display", () => {
    expect(editorialTheme.light.displayFamily).toMatch(/^var\(--ic-font-display, .*serif\)$/);
    expect(resolveTokens(editorialTheme.light).displayFamily).toMatch(/Georgia, serif$/);
    expect(editorialTheme.dark.displayFamily).toBe(editorialTheme.light.displayFamily);
  });
});

describe("the default theme", () => {
  it.each(MODES)("%s categorical order still passes the validator's hard gates", (mode) => {
    const t = resolveTokens(defaultTheme[mode]);
    const report = checkPalette(t.categorical, mode, t.surface);
    expect(report.offBand).toEqual([]);
    expect(report.lowChroma).toEqual([]);
    expect(report.cvd).toBeGreaterThanOrEqual(6);
    expect(report.normal).toBeGreaterThanOrEqual(NORMAL_FLOOR);
  });
});
