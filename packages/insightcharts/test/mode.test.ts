import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { detectMode } from "../src/core/mode";
import { stubCanvas } from "./helpers";

beforeAll(stubCanvas);

/** Build a chain of nested divs from outermost to innermost and return the innermost. */
function nest(...layers: { cls?: string; attrs?: Record<string, string>; bg?: string }[]): HTMLElement {
  let parent: HTMLElement = document.body;
  for (const layer of layers) {
    const el = document.createElement("div");
    if (layer.cls) el.className = layer.cls;
    for (const [k, v] of Object.entries(layer.attrs ?? {})) el.setAttribute(k, v);
    if (layer.bg) el.style.backgroundColor = layer.bg;
    parent.appendChild(el);
    parent = el;
  }
  return parent;
}

afterEach(() => {
  document.body.innerHTML = "";
  document.body.removeAttribute("style");
  document.body.className = "";
  document.documentElement.className = "";
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("style");
});

describe("detectMode", () => {
  it("is light with no element and on an unstyled page", () => {
    expect(detectMode(null)).toBe("light");
    expect(detectMode(nest({}))).toBe("light");
  });

  it("reads a dark class on any ancestor, including <html> (Tailwind, shadcn, next-themes)", () => {
    expect(detectMode(nest({ cls: "dark" }, {}, {}))).toBe("dark");
    document.documentElement.className = "dark";
    expect(detectMode(nest({}))).toBe("dark");
  });

  it.each([
    ["data-theme", "dark"],
    ["data-mode", "dark"],
    ["data-color-mode", "dark"],
    ["data-color-scheme", "dark"],
  ])("reads %s=%j", (attr, value) => {
    expect(detectMode(nest({ attrs: { [attr]: value } }, {}))).toBe("dark");
  });

  it("reads a marker on the element itself", () => {
    expect(detectMode(nest({ cls: "dark" }))).toBe("dark");
  });

  it("the nearest marker wins: a light island inside a dark page is light", () => {
    expect(detectMode(nest({ cls: "dark" }, { cls: "light" }, {}))).toBe("light");
    expect(detectMode(nest({ attrs: { "data-theme": "dark" } }, { attrs: { "data-theme": "light" } }, {}))).toBe("light");
  });

  it("the nearest marker wins: a dark island inside a light page is dark", () => {
    expect(detectMode(nest({ cls: "light" }, { cls: "dark" }, {}))).toBe("dark");
    document.documentElement.setAttribute("data-theme", "light");
    expect(detectMode(nest({ cls: "dark" }, {}))).toBe("dark");
  });

  it("mixed marker styles still resolve to the nearest", () => {
    expect(detectMode(nest({ cls: "dark" }, { attrs: { "data-mode": "light" } }, { cls: "dark" }, {}))).toBe("dark");
  });

  it("an explicit marker beats the background colour", () => {
    expect(detectMode(nest({ cls: "light", bg: "rgb(0, 0, 0)" }, {}))).toBe("light");
    expect(detectMode(nest({ cls: "dark", bg: "rgb(255, 255, 255)" }, {}))).toBe("dark");
  });

  it("without markers, falls back to the luminance of the nearest painted background", () => {
    expect(detectMode(nest({ bg: "rgb(18, 18, 20)" }, {}))).toBe("dark");
    expect(detectMode(nest({ bg: "#16112e" }, {}))).toBe("dark");
    expect(detectMode(nest({ bg: "rgb(255, 241, 229)" }, {}))).toBe("light");
    expect(detectMode(nest({ bg: "#ffffff" }, {}))).toBe("light");
  });

  it("uses the nearest painted ancestor, skipping transparent and mostly-transparent ones", () => {
    expect(detectMode(nest({ bg: "rgb(255, 255, 255)" }, { bg: "rgb(10, 10, 10)" }, {}))).toBe("dark");
    expect(detectMode(nest({ bg: "rgb(10, 10, 10)" }, { bg: "rgb(255, 255, 255)" }, {}))).toBe("light");
    expect(detectMode(nest({ bg: "rgb(10, 10, 10)" }, { bg: "transparent" }, {}))).toBe("dark");
    expect(detectMode(nest({ bg: "rgb(10, 10, 10)" }, { bg: "rgba(255, 255, 255, 0.1)" }, {}))).toBe("dark");
  });

  it("reads the body background", () => {
    document.body.style.backgroundColor = "rgb(12, 12, 12)";
    expect(detectMode(nest({}, {}))).toBe("dark");
  });
});
