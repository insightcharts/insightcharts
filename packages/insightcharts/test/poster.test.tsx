import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { BigNumber } from "../src/atoms/big-number";
import { registerComponents } from "../src/core/spec";
import { Poster, examples, type PosterProps } from "../src/molecules/poster";
import { posterBackgrounds, posterThemes } from "../src/themes";
import { stubCanvas } from "./helpers";

beforeAll(() => {
  stubCanvas();
  registerComponents({ BigNumber });
});
afterEach(cleanup);

const number = (value: string) => ({ type: "big-number", value, label: "Label" });
const show = (props: Partial<PosterProps>) => render(<Poster panels={[{ content: number("1") }]} {...props} />).container;
const q = (root: Element, slot: string) => root.querySelector(`[data-slot="ic-poster${slot ? `-${slot}` : ""}"]`) as HTMLElement | null;

describe("Poster", () => {
  it("is an article with a heading, figures and a footer", () => {
    const root = show({ title: "Riverton had 3,000 bikes in 2025", kicker: "Transport", sources: ["A", "B"], credit: "Desk", note: "Illustrative", panels: [{ title: "Panel", content: number("1"), source: "S", note: "N" }] });
    const sheet = q(root, "")!;
    expect(sheet.tagName).toBe("ARTICLE");
    expect(q(root, "title")!.tagName).toBe("H2");
    expect(sheet.getAttribute("aria-labelledby")).toBe(q(root, "title")!.id);
    const panel = q(root, "panel")!;
    expect(panel.tagName).toBe("FIGURE");
    expect(q(root, "panel-title")!.tagName).toBe("H3");
    expect(panel.querySelector("figcaption")!.textContent).toBe("Source: S · N");
    expect(q(root, "footer")!.tagName).toBe("FOOTER");
    expect(q(root, "sources")!.textContent).toBe("Sources: A; B · Illustrative");
    expect(q(root, "credit")!.textContent).toBe("Desk");
    expect(panel.querySelector('[data-slot="ic-big-number"]')).not.toBeNull();
  });

  it.each(Object.keys(posterThemes) as (keyof typeof posterThemes)[])("paints the %s ground and forces light mode by default", (name) => {
    const sheet = q(show({ theme: name }), "")!;
    expect(sheet.dataset.themeName).toBe(name);
    expect(sheet.dataset.icMode).toBe("light");
    expect(sheet.style.getPropertyValue("--_ic-surface")).toBe(posterThemes[name].light.surface);
    const css = posterBackgrounds[name].light;
    if (css.startsWith("#")) expect(sheet.style.background).not.toBe("");
    else expect(sheet.style.background).toContain("linear-gradient");
  });

  it("lets `background` and `mode` override the theme", () => {
    const sheet = q(show({ theme: "paper", mode: "dark", background: "rgb(1, 2, 3)" }), "")!;
    expect(sheet.dataset.icMode).toBe("dark");
    expect(sheet.style.background).toBe("rgb(1, 2, 3)");
    expect(sheet.style.getPropertyValue("--_ic-surface")).toBe(posterThemes.paper.dark.surface);
  });

  it("places panels on the grid in reading order, with rules between rows", () => {
    // jsdom measures every element as 0 wide, which is the phone layout; give the sheet a desktop width.
    const measured = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 1100, height: 0, top: 0, left: 0, right: 1100, bottom: 0, x: 0, y: 0, toJSON: () => ({}) });
    const root = show({ columns: 12, panels: [{ span: 4, rowSpan: 2, content: number("1") }, { span: 8, content: number("2") }, { span: 8, content: number("3") }, { content: number("4") }] });
    const at = [...root.querySelectorAll<HTMLElement>('[data-slot="ic-poster-panel"]')].map((p) => `${p.style.gridColumn} @ ${p.style.gridRow}`);
    expect(at).toEqual(["1 / span 4 @ 1 / span 2", "5 / span 8 @ 1 / span 1", "5 / span 8 @ 2 / span 1", "1 / span 12 @ 3 / span 1"]);
    // Row 2's rule stops at the panel spanning down from row 1; row 3's runs the full width.
    const rules = [...root.querySelectorAll<HTMLElement>('[data-slot="ic-poster-rule"]')].map((r) => `${r.style.gridColumn} @ ${r.style.gridRow}`);
    expect(rules).toEqual(["5 / 13 @ 2", "1 / 13 @ 3"]);
    expect(show({ rules: "none", panels: [{ content: number("1") }, { content: number("2") }] }).querySelector('[data-slot="ic-poster-rule"]')).toBeNull();
    measured.mockRestore();
  });

  it("reflows to one column in reading order when it is narrow", () => {
    const root = show({ columns: 12, panels: [{ span: 4, rowSpan: 2, content: number("1") }, { span: 8, content: number("2") }, { span: 6, content: number("3") }] });
    expect(q(root, "")!.dataset.layout).toBe("phone");
    const at = [...root.querySelectorAll<HTMLElement>('[data-slot="ic-poster-panel"]')].map((p) => `${p.style.gridColumn} @ ${p.style.gridRow}`);
    expect(at).toEqual(["1 / span 1 @ 1 / span 1", "1 / span 1 @ 2 / span 1", "1 / span 1 @ 3 / span 1"]);
  });

  it("shows the download control only when asked, outside the sheet", () => {
    expect(q(show({}), "download")).toBeNull();
    const root = show({ download: true });
    const button = q(root, "download")!;
    expect(button.textContent).toBe("Download PNG");
    expect(q(root, "")!.contains(button)).toBe(false);
    expect(q(root, "controls")!.hasAttribute("data-ic-export-ignore")).toBe(true);
  });

  it("has JSON-serialisable meta and examples in three or more themes", () => {
    const all = [Poster.meta.example!, ...Object.values(examples)];
    expect(JSON.parse(JSON.stringify(all))).toEqual(all);
    expect(new Set(all.map((e) => (e as { theme?: string }).theme)).size).toBeGreaterThanOrEqual(3);
    expect(Poster.meta.level).toBe("molecule");
    expect(Poster.meta.category).toBe("poster");
  });
});
