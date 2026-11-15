import { beforeAll, describe, expect, it } from "vitest";
import { chromeVars, createTheme, defaultTheme, resolveTokens, type ThemeTokens } from "../src/core/theme";
import { stubCanvas } from "./helpers";

beforeAll(stubCanvas);

const TOKEN_KEYS = ["surface", "ink", "inkSecondary", "muted", "grid", "axis", "accent", "context", "positive", "negative", "categorical", "sequential", "diverging", "fontFamily", "displayFamily", "fontSize", "radius", "lineWidth"];

describe("createTheme", () => {
  it("with no input returns a complete copy of the default theme", () => {
    const t = createTheme();
    expect(t).toEqual(defaultTheme);
    expect(t.light).not.toBe(defaultTheme.light);
  });

  it("applies top-level tokens to both modes", () => {
    const t = createTheme({ accent: "#ff0066", radius: 0 });
    expect(t.light.accent).toBe("#ff0066");
    expect(t.dark.accent).toBe("#ff0066");
    expect(t.light.radius).toBe(0);
    expect(t.dark.radius).toBe(0);
  });

  it("mode-specific tokens beat top-level ones, which beat the base", () => {
    const t = createTheme({ accent: "#111111", grid: "#222222", dark: { accent: "#333333" } });
    expect(t.light.accent).toBe("#111111");
    expect(t.dark.accent).toBe("#333333");
    expect(t.dark.grid).toBe("#222222");
    expect(t.light.ink).toBe(defaultTheme.light.ink);
  });

  it("always returns every token for both modes from a partial input", () => {
    const t = createTheme({ light: { surface: "#fff" } });
    for (const mode of ["light", "dark"] as const) expect(Object.keys(t[mode]).sort()).toEqual([...TOKEN_KEYS].sort());
  });

  it("replaces palettes whole rather than merging them by index", () => {
    const t = createTheme({ categorical: ["#111111", "#222222"] });
    expect(t.light.categorical).toEqual(["#111111", "#222222"]);
  });

  it("takes the name from the input, else from the base", () => {
    expect(createTheme({ name: "brand" }).name).toBe("brand");
    expect(createTheme({ accent: "#000" }).name).toBe("insight");
    expect(createTheme({ accent: "#000" }, createTheme({ name: "parent" })).name).toBe("parent");
  });

  it("layers over a custom base, so nested providers inherit", () => {
    const parent = createTheme({ accent: "#aa0000", light: { grid: "#eeeeee" } });
    const child = createTheme({ dark: { ink: "#fafafa" } }, parent);
    expect(child.light.accent).toBe("#aa0000");
    expect(child.light.grid).toBe("#eeeeee");
    expect(child.dark.ink).toBe("#fafafa");
  });

  it("accepts a full theme and returns it intact", () => {
    const full = createTheme({ name: "x", accent: "#123456" });
    expect(createTheme(full)).toEqual(full);
  });

  it("ignores unknown keys instead of leaking them into the tokens", () => {
    const t = createTheme({ accent: "#000", bogus: 1, primary: "#f00" } as never);
    expect(t.light).not.toHaveProperty("bogus");
    expect(t.light).not.toHaveProperty("primary");
  });

  it("never mutates the base or the default theme", () => {
    const before = JSON.stringify(defaultTheme);
    const base = createTheme({ name: "base" });
    const snapshot = JSON.stringify(base);
    createTheme({ accent: "#000", light: { categorical: ["#111"] }, dark: { ink: "#fff" } }, base);
    expect(JSON.stringify(base)).toBe(snapshot);
    expect(JSON.stringify(defaultTheme)).toBe(before);
  });
});

describe("resolveTokens without a DOM element (SSR, export, tests)", () => {
  const isConcrete = (c: string) => /^#[0-9a-f]{6}$/.test(c) || /^rgba\(\d+,\d+,\d+,[\d.]+\)$/.test(c);

  it("falls back to the literal inside each var(), including nested ones", () => {
    const t = resolveTokens(defaultTheme.light);
    expect(t.surface).toBe("#fcfcfb");
    expect(t.ink).toBe("#0b0b0b");
    expect(t.accent).toBe("#2a78d6");
    expect(t.categorical[0]).toBe("#2a78d6");
    expect(t.categorical).toHaveLength(8);
    expect(resolveTokens(defaultTheme.dark).surface).toBe("#1a1a19");
  });

  it("leaves every colour concrete, so the canvas renderer can draw it", () => {
    for (const mode of ["light", "dark"] as const) {
      const t = resolveTokens(defaultTheme[mode]);
      for (const key of ["surface", "ink", "inkSecondary", "muted", "grid", "axis", "accent", "context", "positive", "negative"] as const) expect(isConcrete(t[key]), `${mode}.${key}=${t[key]}`).toBe(true);
      for (const c of [...t.categorical, ...t.sequential, ...t.diverging]) expect(isConcrete(c), c).toBe(true);
    }
  });

  it("normalises rgb() literals and keeps translucency", () => {
    const t = resolveTokens({ ...defaultTheme.light, accent: "rgb(255, 0, 0)", grid: "var(--g, rgba(0, 0, 0, 0.1))" });
    expect(t.accent).toBe("#ff0000");
    expect(t.grid).toBe("rgba(0,0,0,0.1)");
  });

  it("uses a neutral grey for a variable with no fallback, never an empty string", () => {
    const t = resolveTokens({ ...defaultTheme.light, accent: "var(--primary)", categorical: ["var(--chart-1)", "#112233"] });
    expect(t.accent).toBe("#888888");
    expect(t.categorical).toEqual(["#888888", "#112233"]);
  });

  it("resolves 'inherit' fonts to a system stack and keeps explicit stacks", () => {
    const t = resolveTokens(defaultTheme.light);
    expect(t.fontFamily).toMatch(/system-ui/);
    expect(t.displayFamily).toMatch(/system-ui/);
    const serif = resolveTokens({ ...defaultTheme.light, displayFamily: 'var(--ic-font-display, "Source Serif 4", Georgia, serif)' });
    expect(serif.displayFamily).toBe('"Source Serif 4", Georgia, serif');
  });

  it("copies the palettes and leaves the input tokens untouched", () => {
    const input: ThemeTokens = createTheme().light;
    const snapshot = JSON.stringify(input);
    const t = resolveTokens(input);
    t.categorical.push("#000000");
    expect(JSON.stringify(input)).toBe(snapshot);
    expect(t.fontSize).toBe(12);
    expect(t.radius).toBe(4);
    expect(t.lineWidth).toBe(2);
  });
});

describe("resolveTokens against an element", () => {
  it("resolves literals through computed style and removes its probe", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const t = resolveTokens({ ...defaultTheme.light, accent: "#ff0000", ink: "rgb(1, 2, 3)" }, el);
    expect(t.accent).toBe("#ff0000");
    expect(t.ink).toBe("#010203");
    expect(el.childElementCount).toBe(0);
    el.remove();
  });
});

describe("chromeVars", () => {
  it("exposes the tokens the HTML chrome is styled with", () => {
    const vars = chromeVars(createTheme({ ink: "#111111", displayFamily: "Georgia" }).light);
    expect(vars["--_ic-ink"]).toBe("#111111");
    expect(vars["--_ic-font-display"]).toBe("Georgia");
    for (const key of ["--_ic-surface", "--_ic-ink", "--_ic-ink-2", "--_ic-muted", "--_ic-grid", "--_ic-accent", "--_ic-positive", "--_ic-negative", "--_ic-font", "--_ic-font-display"]) expect(vars, key).toHaveProperty(key);
    for (const value of Object.values(vars)) expect(typeof value).toBe("string");
  });
});
