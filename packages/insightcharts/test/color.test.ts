import { beforeAll, describe, expect, it } from "vitest";
import { alpha, cssFallback, inkOn, luminance, mix, ramp, rgbaString, toRgba } from "../src/core/color";
import { stubCanvas } from "./helpers";

beforeAll(stubCanvas);

describe("toRgba", () => {
  it("parses every hex length", () => {
    expect(toRgba("#fff")).toEqual([255, 255, 255, 1]);
    expect(toRgba("#2a78d6")).toEqual([42, 120, 214, 1]);
    expect(toRgba("#2A78D6")).toEqual([42, 120, 214, 1]);
    expect(toRgba("#0008")).toEqual([0, 0, 0, 0x88 / 255]);
    expect(toRgba("#2a78d680")).toEqual([42, 120, 214, 0x80 / 255]);
  });

  it("parses rgb() and rgba() in comma and space syntax, as getComputedStyle returns them", () => {
    expect(toRgba("rgb(42, 120, 214)")).toEqual([42, 120, 214, 1]);
    expect(toRgba("rgba(42, 120, 214, 0.5)")).toEqual([42, 120, 214, 0.5]);
    expect(toRgba("rgb(42 120 214 / 50%)")).toEqual([42, 120, 214, 0.5]);
    expect(toRgba("rgba(0, 0, 0, 0)")).toEqual([0, 0, 0, 0]);
    expect(toRgba("  transparent ")).toEqual([0, 0, 0, 0]);
  });

  it("returns null, without throwing, for what it cannot parse when there is no canvas", () => {
    for (const bad of ["", "not-a-colour", "#12", "#12345", "var(--x)"]) expect(toRgba(bad)).toBeNull();
  });
});

describe("colour helpers", () => {
  it("rgbaString writes opaque colours as hex and translucent ones as rgba()", () => {
    expect(rgbaString([42, 120, 214, 1])).toBe("#2a78d6");
    expect(rgbaString([0, 5, 255, 1])).toBe("#0005ff");
    expect(rgbaString([42, 120, 214, 0.1])).toBe("rgba(42,120,214,0.1)");
  });

  it("alpha multiplies the existing alpha and returns something canvas can draw", () => {
    expect(alpha("#2a78d6", 0.1)).toBe("rgba(42,120,214,0.1)");
    expect(alpha("rgba(42,120,214,0.5)", 0.5)).toBe("rgba(42,120,214,0.25)");
    expect(alpha("#2a78d6", 1)).toBe("#2a78d6");
  });

  it("alpha returns the input unchanged when the colour cannot be parsed", () => {
    expect(alpha("not-a-colour", 0.5)).toBe("not-a-colour");
  });

  it("mix interpolates in sRGB, t = 0 is the first colour", () => {
    expect(mix("#000000", "#ffffff", 0)).toBe("#000000");
    expect(mix("#000000", "#ffffff", 1)).toBe("#ffffff");
    expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(mix("#ff0000", "rgba(255,0,0,0)", 0.5)).toBe("rgba(255,0,0,0.5)");
    expect(mix("#123456", "bogus", 0.5)).toBe("#123456");
  });

  it("luminance follows WCAG", () => {
    expect(luminance("#000")).toBe(0);
    expect(luminance("#fff")).toBeCloseTo(1, 10);
    expect(luminance("#808080")).toBeCloseTo(0.2159, 3);
    expect(luminance("#ff0000")).toBeCloseTo(0.2126, 4);
  });

  it("inkOn picks the readable label colour for a fill", () => {
    expect(inkOn("#0d366b")).toBe("#ffffff");
    expect(inkOn("#2a78d6")).toBe("#ffffff");
    expect(inkOn("#cde2fb")).toBe("#0b0b0b");
    expect(inkOn("#eda100")).toBe("#0b0b0b");
    // Mid-tone green: white would be 2.8:1, near-black is 7:1.
    expect(inkOn("#1baf7a")).toBe("#0b0b0b");
  });

  // 3:1 is the WCAG floor for graphics and large text. inkOn prefers white on mid-tones, so
  // body-text 4.5:1 is not guaranteed (white on the default accent #2a78d6 is 4.4:1).
  it("inkOn keeps at least 3:1 against every default series and ramp colour", async () => {
    const { defaultTheme, resolveTokens } = await import("../src/core/theme");
    const ratio = (a: string, b: string) => {
      const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    for (const mode of ["light", "dark"] as const) {
      const t = resolveTokens(defaultTheme[mode]);
      for (const fill of [...t.categorical, ...t.sequential, ...t.diverging]) expect(ratio(fill, inkOn(fill)), `${mode} ${fill}`).toBeGreaterThanOrEqual(3);
    }
  });

  it("ramp interpolates along the stops and clamps outside 0..1", () => {
    const stops = ["#000000", "#ffffff", "#ff0000"];
    expect(ramp(stops, 0)).toBe("#000000");
    expect(ramp(stops, 0.5)).toBe("#ffffff");
    expect(ramp(stops, 1)).toBe("#ff0000");
    expect(ramp(stops, 0.25)).toBe("#808080");
    expect(ramp(stops, -3)).toBe("#000000");
    expect(ramp(stops, 7)).toBe("#ff0000");
    expect(ramp(["#123456"], 0.7)).toBe("#123456");
  });

  it("cssFallback digs out the literal from nested var() references", () => {
    expect(cssFallback("#fff")).toBe("#fff");
    expect(cssFallback("var(--a, #2a78d6)")).toBe("#2a78d6");
    expect(cssFallback("var(--a, var(--b, #0b0b0b))")).toBe("#0b0b0b");
    expect(cssFallback("var(--a, rgb(1, 2, 3))")).toBe("rgb(1, 2, 3)");
    expect(cssFallback("var(--a)")).toBe("");
    expect(cssFallback('var(--f, "Source Serif 4", Georgia, serif)')).toBe('"Source Serif 4", Georgia, serif');
  });
});
