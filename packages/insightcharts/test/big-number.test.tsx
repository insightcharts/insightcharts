import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { BigNumber, type BigNumberProps } from "../src/atoms/big-number";
import { InsightProvider } from "../src/core/provider";
import { stubCanvas } from "./helpers";

beforeAll(stubCanvas);
afterEach(cleanup);

const slot = (name: string) => document.querySelector(`[data-slot="ic-big-number-${name}"]`) as HTMLElement | null;
function show(props: Partial<BigNumberProps>) {
  cleanup();
  render(
    <InsightProvider locale="en-US">
      <BigNumber value={1} label="Label" {...props} />
    </InsightProvider>,
  );
  const delta = slot("delta");
  const strong = delta?.querySelector("span") ?? null;
  const arrow = strong?.querySelector("[aria-hidden]")?.textContent?.trim() ?? "";
  const style = strong?.getAttribute("style") ?? "";
  const tone = style.includes("--_ic-positive") ? "positive" : style.includes("--_ic-negative") ? "negative" : "neutral";
  return { delta, text: delta?.textContent ?? null, arrow, tone };
}

describe("BigNumber: value", () => {
  it("formats numbers with `format` and shows strings as written", () => {
    show({ value: 0.317, format: "percent" });
    expect(slot("value")!.textContent).toBe("31.7%");
    show({ value: 4460 });
    expect(slot("value")!.textContent).toBe("4,460");
    show({ value: 1_250_000, format: "currency:USD" });
    expect(slot("value")!.textContent).toBe("$1.3M");
    show({ value: "2.9x" });
    expect(slot("value")!.textContent).toBe("2.9x");
  });

  it("renders the label and optional context, and no delta row without a delta", () => {
    const { delta } = show({ label: "Share of renewables", context: "Up from 19% in 2010" });
    expect(slot("label")!.textContent).toBe("Share of renewables");
    expect(slot("context")!.textContent).toBe("Up from 19% in 2010");
    expect(delta).toBeNull();
    show({});
    expect(slot("context")).toBeNull();
  });
});

describe("BigNumber: delta direction", () => {
  it("a positive number points up and is formatted as a signed percentage", () => {
    const r = show({ delta: 0.021, deltaLabel: "vs 2023" });
    expect(r.arrow).toBe("▲");
    expect(r.text).toBe("▲ +2.1% vs 2023");
  });

  it("a negative number points down, with a typographic minus", () => {
    const r = show({ delta: -0.04 });
    expect(r.arrow).toBe("▼");
    expect(r.text).toBe("▼ −4%");
  });

  it("zero has no arrow and a neutral colour", () => {
    const r = show({ delta: 0 });
    expect(r.delta).not.toBeNull();
    expect(r.arrow).toBe("");
    expect(r.text).toBe("0%");
    expect(r.tone).toBe("neutral");
  });

  it("string deltas are read for direction from their sign, with a hyphen set as a true minus", () => {
    expect(show({ delta: "+190%" })).toMatchObject({ arrow: "▲", text: "▲ +190%" });
    expect(show({ delta: "-3 pts" })).toMatchObject({ arrow: "▼", text: "▼ \u22123 pts" });
    expect(show({ delta: "−3 pts" })).toMatchObject({ arrow: "▼" });
    expect(show({ delta: "12 places" })).toMatchObject({ arrow: "▲" });
  });

  it("the arrow is decorative: hidden from assistive tech, the signed text carries the meaning", () => {
    show({ delta: -0.04 });
    const hidden = slot("delta")!.querySelector("[aria-hidden]")!;
    expect(hidden.textContent).toContain("▼");
    expect(slot("delta")!.textContent).toContain("−4%");
  });
});

describe("BigNumber: upIsGood colouring", () => {
  it("by default an increase is good and a decrease is bad", () => {
    expect(show({ delta: 0.1 }).tone).toBe("positive");
    expect(show({ delta: -0.1 }).tone).toBe("negative");
  });

  it("upIsGood={false} flips the colour but never the arrow (churn, cost, emissions)", () => {
    expect(show({ delta: 0.1, upIsGood: false })).toMatchObject({ tone: "negative", arrow: "▲" });
    expect(show({ delta: -0.1, upIsGood: false })).toMatchObject({ tone: "positive", arrow: "▼" });
  });

  it("applies to string deltas as well", () => {
    expect(show({ delta: "+190%" }).tone).toBe("positive");
    expect(show({ delta: "−12%", upIsGood: false }).tone).toBe("positive");
    expect(show({ delta: "-12%" }).tone).toBe("negative");
  });

  it("the delta label stays in neutral ink, outside the coloured span", () => {
    show({ delta: 0.1, deltaLabel: "vs last quarter" });
    const strong = slot("delta")!.querySelector("span")!;
    expect(strong.textContent).not.toContain("vs last quarter");
    expect(slot("delta")!.textContent).toContain("vs last quarter");
  });
});

describe("BigNumber: metadata", () => {
  it("carries complete meta, and its example renders", () => {
    expect(BigNumber.meta).toMatchObject({ name: "big-number", component: "BigNumber", level: "atom" });
    const { type, ...props } = BigNumber.meta.example as unknown as { type: string } & BigNumberProps;
    expect(type).toBe("big-number");
    render(<BigNumber {...props} />);
    expect(slot("value")!.textContent).not.toBe("");
  });
});
