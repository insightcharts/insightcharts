import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Icon } from "../src/core/icon";
import { iconGroups, iconNames, icons, iconSymbol, resolveIcon } from "../src/core/icons";

afterEach(cleanup);

describe("the icon registry", () => {
  it("keeps the original nine names and has about sixty icons", () => {
    for (const name of ["person", "house", "car", "tree", "coin", "drop", "bolt", "circle", "square"] as const) expect(icons[name], name).toBeDefined();
    expect(iconNames.length).toBeGreaterThanOrEqual(60);
  });

  it.each(iconNames)("%s is one closed path on the 24 x 24 grid with a sane aspect", (name) => {
    const { d, aspect } = icons[name];
    expect(d).toMatch(/^M[\d. -]/);
    expect(d).toMatch(/[zZ]$/);
    // Only move, line, curve, arc and close commands: nothing a path:// symbol cannot draw.
    expect(d.replace(/[MmLlHhVvCcSsQqTtAaZz\d\s.,-]/g, "")).toBe("");
    // Absolute coordinates stay on the grid (relative commands are not checked here; the gallery sheet measures real bounding boxes).
    if (!/[a-z]/.test(d.replace(/z/g, ""))) for (const n of d.match(/-?\d*\.?\d+/g) ?? []) expect(Math.abs(Number(n))).toBeLessThanOrEqual(24);
    expect(aspect).toBeGreaterThan(0.3);
    expect(aspect).toBeLessThan(3);
  });

  it("groups every icon exactly once", () => {
    const grouped = Object.values(iconGroups).flat();
    expect([...grouped].sort()).toEqual([...iconNames].sort());
    expect(new Set(grouped).size).toBe(grouped.length);
  });

  it("resolves names, custom paths and unknown names", () => {
    expect(resolveIcon("bike")).toBe(icons.bike);
    expect(resolveIcon("path://M0 0h4v4z")).toEqual({ d: "M0 0h4v4z", aspect: 1 });
    expect(resolveIcon("no-such-icon")).toBe(icons.circle);
    expect(resolveIcon(undefined, "person")).toBe(icons.person);
    expect(iconSymbol("drop")).toBe(`path://${icons.drop.d}`);
  });
});

describe("Icon", () => {
  it("is decorative unless it has a title", () => {
    const { container } = render(<Icon name="wheat" size={32} color="#123456" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("width")).toBe("32");
    expect(svg.querySelector("path")!.getAttribute("d")).toBe(icons.wheat.d);
    expect(svg.querySelector("path")!.getAttribute("fill")).toBe("#123456");
    cleanup();
    const titled = render(<Icon name="wheat" title="Wheat" />).container.querySelector("svg")!;
    expect(titled.getAttribute("role")).toBe("img");
    expect(titled.getAttribute("aria-label")).toBe("Wheat");
    expect(titled.hasAttribute("aria-hidden")).toBe(false);
  });
});
