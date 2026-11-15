import { describe, expect, it } from "vitest";
import { defaultTheme, resolveTokens, type InsightTheme, type ThemeTokens } from "../src/core/theme";
import { posterBackgrounds, posterThemes, themes } from "../src/themes";
import { contrast, deltaE, oklch } from "./palette-checks";

// The floors stated at the top of src/themes/posters.ts. The lightness band and chroma floor
// of the dataviz palette validator are deliberately not applied to poster palettes; the
// reasons are recorded there.
const TEXT_MIN = 4.5;
const MARK_MIN = 3;
const ADJACENT = { normal: 15, cvd: 8 };
const ANY_PAIR = { normal: 10, cvd: 6 };

const TOKEN_KEYS = Object.keys(defaultTheme.light) as (keyof ThemeTokens)[];
const COLOR_KEYS = ["surface", "ink", "inkSecondary", "muted", "grid", "axis", "accent", "context", "positive", "negative"] as const;
const MODES = ["light", "dark"] as const;
const HEX = /^#[0-9a-f]{6}$/;
const posters = Object.entries(posterThemes) as [keyof typeof posterThemes, InsightTheme][];
const cvd = (a: string, b: string) => Math.min(deltaE(a, b, "protan"), deltaE(a, b, "deutan"));

/** Every colour the ground shows: the solid `surface` plus each stop of a gradient background. */
function grounds(name: keyof typeof posterThemes, mode: (typeof MODES)[number]): string[] {
  const stops = posterBackgrounds[name][mode].match(/#[0-9a-f]{6}/gi) ?? [];
  return [...new Set([posterThemes[name][mode].surface, ...stops.map((s) => s.toLowerCase())])];
}

describe("the poster themes as a set", () => {
  it("has eight themes, each under its own name and in the themes record", () => {
    expect(Object.keys(posterThemes).sort()).toEqual(["blueprint", "dusk", "forest", "magenta", "noir", "ocean", "paper", "sunrise"]);
    for (const [name, theme] of posters) {
      expect(theme.name).toBe(name);
      expect(themes[name]).toBe(theme);
    }
  });

  it("has a background for every theme and mode, and distinct grounds and accents", () => {
    expect(Object.keys(posterBackgrounds).sort()).toEqual(Object.keys(posterThemes).sort());
    expect(new Set(posters.map(([, t]) => t.light.surface)).size).toBe(posters.length);
    expect(new Set(posters.map(([name]) => posterBackgrounds[name].light)).size).toBe(posters.length);
  });
});

describe.each(posters)("poster theme %s", (name, theme) => {
  it.each(MODES)("%s is complete, with literal hex colours", (mode) => {
    const t = theme[mode];
    expect(Object.keys(t).sort()).toEqual([...TOKEN_KEYS].sort());
    for (const key of COLOR_KEYS) expect(t[key], key).toMatch(HEX);
    for (const key of ["categorical", "sequential", "diverging"] as const) for (const c of t[key]) expect(c, key).toMatch(HEX);
    expect(resolveTokens(t).surface).toBe(t.surface);
    expect(t.fontSize).toBe(13);
    expect(t.radius).toBe(6);
    expect(t.lineWidth).toBeGreaterThan(0);
    expect(t.categorical.length).toBeGreaterThanOrEqual(4);
    expect(t.categorical.length).toBeLessThanOrEqual(6);
    expect(new Set(t.categorical).size).toBe(t.categorical.length);
    expect(t.sequential.length).toBeGreaterThanOrEqual(5);
    expect(t.diverging.length).toBe(5);
    expect(t.categorical[0]).toBe(t.accent);
  });

  it("does not share token objects between modes", () => {
    expect(theme.light).not.toBe(theme.dark);
    expect(theme.light.categorical).not.toBe(theme.dark.categorical);
  });

  it("sets a display face that --ic-font-display overrides, and downloads nothing", () => {
    expect(theme.light.displayFamily).toMatch(/^var\(--ic-font-display, .+\)$/);
    expect(theme.light.displayFamily).not.toMatch(/url\(|@import/);
    expect(theme.dark.displayFamily).toBe(theme.light.displayFamily);
  });

  it.each(MODES)("%s background is a solid hex or a gradient of hex stops, and the surface is close to it", (mode) => {
    const css = posterBackgrounds[name][mode];
    expect(css === theme[mode].surface || /^(linear|radial)-gradient\(/.test(css)).toBe(true);
    // The surface stands in for the ground in mark gaps, so it must sit near every stop.
    for (const g of grounds(name, mode)) expect(contrast(theme[mode].surface, g), g).toBeLessThan(1.6);
  });

  it.each(MODES)("%s text is at least 4.5:1 against every colour of the ground", (mode) => {
    const t = theme[mode];
    for (const g of grounds(name, mode)) for (const key of ["ink", "inkSecondary", "muted"] as const) expect(contrast(t[key], g), `${key} on ${g}`).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it.each(MODES)("%s marks are at least 3:1 against every colour of the ground", (mode) => {
    const t = theme[mode];
    for (const g of grounds(name, mode)) {
      for (const c of [...t.categorical, t.accent, t.positive, t.negative]) expect(contrast(c, g), `${c} on ${g}`).toBeGreaterThanOrEqual(MARK_MIN);
      // Chrome recedes but stays visible on the solid surface.
      expect(contrast(t.context, g), "context").toBeGreaterThan(1.3);
    }
    expect(contrast(t.grid, t.surface), "grid").toBeGreaterThan(1.05);
    expect(contrast(t.grid, t.surface), "grid").toBeLessThan(1.6);
    expect(contrast(t.axis, t.surface), "axis").toBeGreaterThan(contrast(t.grid, t.surface));
  });

  it.each(MODES)("%s categorical colours are distinguishable, with and without colour-vision simulation", (mode) => {
    const c = theme[mode].categorical;
    for (let i = 0; i < c.length; i++) {
      for (let j = i + 1; j < c.length; j++) {
        const floor = j === i + 1 ? ADJACENT : ANY_PAIR;
        expect(deltaE(c[i], c[j]), `${c[i]} vs ${c[j]}`).toBeGreaterThanOrEqual(floor.normal);
        expect(cvd(c[i], c[j]), `${c[i]} vs ${c[j]} (CVD)`).toBeGreaterThanOrEqual(floor.cvd);
      }
    }
  });

  it.each(MODES)("%s sequential ramp is monotonic and visible against the ground at both ends", (mode) => {
    const t = theme[mode];
    const L = t.sequential.map((c) => oklch(c).L);
    const sign = Math.sign(L.at(-1)! - L[0]);
    for (let i = 1; i < L.length; i++) expect((L[i] - L[i - 1]) * sign, `step ${i}`).toBeGreaterThan(0.02);
    for (const g of grounds(name, mode)) {
      expect(contrast(t.sequential[0], g), `near end on ${g}`).toBeGreaterThanOrEqual(1.15);
      expect(contrast(t.sequential.at(-1)!, g), `far end on ${g}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(MODES)("%s diverging ramp has two visible, distinguishable poles around a receding midpoint", (mode) => {
    const t = theme[mode];
    const d = t.diverging;
    for (const pole of [d[0], d[4]]) expect(contrast(pole, t.surface), pole).toBeGreaterThanOrEqual(MARK_MIN);
    expect(cvd(d[0], d[4])).toBeGreaterThanOrEqual(14);
    const toSurface = d.map((c) => contrast(c, t.surface));
    expect(toSurface[2]).toBe(Math.min(...toSurface));
  });
});
