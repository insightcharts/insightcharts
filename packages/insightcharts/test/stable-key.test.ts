import { describe, expect, it } from "vitest";
import { stableKey } from "../src/core/store";

describe("stableKey", () => {
  it("keys small inline literals by content, so `data={[...]}` in JSX is not new on every render", () => {
    expect(stableKey([{ a: 1 }, { a: 2 }])).toBe(stableKey([{ a: 1 }, { a: 2 }]));
    expect(stableKey({ type: "sort", by: "x" })).toBe(stableKey({ type: "sort", by: "x" }));
    expect(stableKey({ url: "/a.csv", path: "data" })).toBe(stableKey({ url: "/a.csv", path: "data" }));
  });

  it("changes when the content changes", () => {
    expect(stableKey([{ a: 1 }])).not.toBe(stableKey([{ a: 2 }]));
    expect(stableKey([{ a: 1 }])).not.toBe(stableKey([{ b: 1 }]));
    expect(stableKey("/a.csv")).not.toBe(stableKey("/b.csv"));
    expect(stableKey({ type: "limit", n: 1 })).not.toBe(stableKey({ type: "limit", n: 2 }));
  });

  it("is empty for null and undefined", () => {
    expect(stableKey(null)).toBe("");
    expect(stableKey(undefined)).toBe("");
  });

  it("keys functions by identity", () => {
    const f = () => [];
    const g = () => [];
    expect(stableKey(f)).toBe(stableKey(f));
    expect(stableKey(f)).not.toBe(stableKey(g));
  });

  it("keys functions nested in a transform pipeline by identity", () => {
    const f = (rows: unknown[]) => rows;
    const g = (rows: unknown[]) => rows;
    expect(stableKey([{ type: "limit", n: 1 }, f])).toBe(stableKey([{ type: "limit", n: 1 }, f]));
    expect(stableKey([f])).not.toBe(stableKey([g]));
  });

  it("keys large arrays by identity and length, without serialising them", () => {
    const big = Array.from({ length: 501 }, (_, i) => ({ i }));
    const copy = big.map((r) => ({ ...r }));
    expect(stableKey(big)).toBe(stableKey(big));
    expect(stableKey(big)).not.toBe(stableKey(copy));
    const before = stableKey(big);
    big.push({ i: 501 });
    expect(stableKey(big)).not.toBe(before);
    expect(stableKey(big).length).toBeLessThan(40);
  });

  it("keys promises and Arrow-like tables by identity", () => {
    const p = Promise.resolve([]);
    const table = { toArray: () => [] };
    expect(stableKey(p)).toBe(stableKey(p));
    expect(stableKey(p)).not.toBe(stableKey(Promise.resolve([])));
    expect(stableKey(table)).toBe(stableKey(table));
    expect(stableKey(table)).not.toBe(stableKey({ toArray: () => [] }));
  });

  it("falls back to identity for values JSON cannot serialise", () => {
    const circular: Record<string, unknown> = { a: 1 };
    circular.self = circular;
    expect(() => stableKey(circular)).not.toThrow();
    expect(stableKey(circular)).toBe(stableKey(circular));
  });

  it("distinguishes a URL string from CSV text and from an object source", () => {
    expect(new Set([stableKey("/a.csv"), stableKey({ url: "/a.csv" }), stableKey({ csv: "/a.csv" })]).size).toBe(3);
  });
});
