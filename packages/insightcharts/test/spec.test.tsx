// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { withMeta } from "../src/core/meta";
import { getComponent, isSpec, listComponents, registerComponents, renderSlot } from "../src/core/spec";
import type { ComponentMeta } from "../src/core/define";

afterEach(cleanup);

const meta = (name: string): ComponentMeta => ({ name, component: name, title: name, level: "atom", category: "figure", description: "", props: [] });
const Stat = withMeta(({ value, label }: { value: number; label?: string }) => <p data-testid="stat">{`${label ?? "value"}=${value}`}</p>, meta("test-stat"));
const Box = withMeta(({ children }: { children?: React.ReactNode }) => <div data-testid="box">{children}</div>, meta("test-box"));

// The registry is module-level; these tests run in order and the first relies on it being empty.
describe("renderSlot and the registry", () => {
  it("with nothing registered, explains how to register instead of rendering nothing", () => {
    render(<>{renderSlot({ type: "bar-chart", data: [] })}</>);
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain('"bar-chart" is not registered');
    expect(alert.textContent).toContain("registerComponents()");
    expect(alert.textContent).toContain("<Insight>");
  });

  it("registerComponents picks up anything carrying meta.name and ignores the rest", () => {
    registerComponents({ Stat, Box, helper: () => null, constant: 3, nothing: null, examples: { a: {} } });
    expect(getComponent("test-stat")).toBe(Stat);
    expect(getComponent("test-box")).toBe(Box);
    expect(listComponents().map((m) => m.name).sort()).toEqual(["test-box", "test-stat"]);
    expect(getComponent("helper")).toBeUndefined();
  });

  it("renders a spec through the registered component, passing the remaining keys as props", () => {
    render(<>{renderSlot({ type: "test-stat", value: 42, label: "answer" })}</>);
    expect(screen.getByTestId("stat").textContent).toBe("answer=42");
  });

  it("names the unknown type and lists what is available", () => {
    render(<>{renderSlot({ type: "pie-chrat" })}</>);
    const text = screen.getByRole("alert").textContent!;
    expect(text).toContain('Unknown component type "pie-chrat"');
    expect(text).toContain("Available:");
    expect(text).toContain("test-stat");
    expect(text).toContain("test-box");
  });

  it("passes React content, strings, numbers, null and arrays through untouched", () => {
    const el = <b>hi</b>;
    expect(renderSlot(el)).toBe(el);
    expect(renderSlot("text")).toBe("text");
    expect(renderSlot(7)).toBe(7);
    expect(renderSlot(null)).toBeNull();
    expect(renderSlot(undefined)).toBeUndefined();
  });

  it("re-registering a name replaces the component", () => {
    const Stat2 = withMeta(() => <p data-testid="stat">v2</p>, meta("test-stat"));
    registerComponents({ Stat2 });
    render(<>{renderSlot({ type: "test-stat", value: 1 })}</>);
    expect(screen.getByTestId("stat").textContent).toBe("v2");
  });

  it("applies the key to rendered specs so lists of slots do not warn", () => {
    const node = renderSlot({ type: "test-box" }, "k1") as React.ReactElement;
    expect(node.key).toBe("k1");
    const missing = renderSlot({ type: "nope" }, 3) as React.ReactElement;
    expect(missing.key).toBe("3");
  });
});

describe("isSpec", () => {
  it("is true only for plain objects with a string type", () => {
    expect(isSpec({ type: "bar-chart" })).toBe(true);
    expect(isSpec({ type: 3 })).toBe(false);
    expect(isSpec({})).toBe(false);
    expect(isSpec("bar-chart")).toBe(false);
    expect(isSpec(null)).toBe(false);
    expect(isSpec([{ type: "bar-chart" }])).toBe(false);
  });

  it("is false for React elements, whose `type` can also be a string", () => {
    expect(isSpec(<div />)).toBe(false);
    expect(isSpec(<Stat value={1} />)).toBe(false);
  });
});
