import { act, cleanup, render, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InsightData, useData, useInsightData, type InsightDataStore, type Selection } from "../src/core/store";
import type { DataInput, Row, Transform } from "../src/data/types";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const energy: Row[] = [
  { region: "Asia", source: "Solar", year: 2023, twh: 10 },
  { region: "Asia", source: "Wind", year: 2023, twh: 20 },
  { region: "Europe", source: "Solar", year: 2023, twh: 5 },
  { region: "Europe", source: "Wind", year: 2024, twh: 15 },
  { region: "Africa", source: "Hydro", year: 2024, twh: 8 },
];
const deferred = <T,>() => {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("useData", () => {
  it("resolves in-memory data on the first render: no loading flash", () => {
    const seen: string[] = [];
    const { result } = renderHook(() => {
      const state = useData(energy);
      seen.push(state.status);
      return state;
    });
    expect(seen[0]).toBe("ready");
    expect(seen).not.toContain("loading");
    expect(result.current.rows).toBe(energy);
    expect(result.current.error).toBeNull();
  });

  it("resolves CSV text, columnar data and null synchronously", () => {
    expect(renderHook(() => useData("a,b\n1,2")).result.current).toMatchObject({ status: "ready", rows: [{ a: 1, b: 2 }] });
    expect(renderHook(() => useData({ a: [1], b: [2] })).result.current.rows).toEqual([{ a: 1, b: 2 }]);
    expect(renderHook(() => useData(null)).result.current).toMatchObject({ status: "ready", rows: [] });
  });

  it("applies the transform", () => {
    const { result } = renderHook(() => useData(energy, [{ type: "filter", field: "region", value: "Asia" }, { type: "sort", by: "twh", order: "desc" }]));
    expect(result.current.rows.map((r) => r.twh)).toEqual([20, 10]);
  });

  it("keeps the same rows array across re-renders when inline literals are re-created", () => {
    const { result, rerender } = renderHook(() => useData([{ a: 1 }, { a: 2 }], { type: "sort", by: "a", order: "desc" }));
    const first = result.current.rows;
    rerender();
    rerender();
    expect(result.current.rows).toBe(first);
  });

  it("re-resolves when inline data changes content", () => {
    const { result, rerender } = renderHook(({ n }: { n: number }) => useData([{ a: n }]), { initialProps: { n: 1 } });
    rerender({ n: 2 });
    expect(result.current.rows).toEqual([{ a: 2 }]);
  });

  it("goes loading then ready for an async function", async () => {
    const d = deferred<Row[]>();
    const load = () => d.promise;
    const { result } = renderHook(() => useData(load));
    expect(result.current).toMatchObject({ status: "loading", rows: [], error: null });
    await act(async () => d.resolve(energy));
    expect(result.current.status).toBe("ready");
    expect(result.current.rows).toBe(energy);
  });

  it("goes loading then ready for a promise, applying the transform to the result", async () => {
    const promise = Promise.resolve(energy);
    const { result } = renderHook(() => useData(promise, { type: "limit", n: 2 }));
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.rows).toHaveLength(2);
  });

  it("fetches a URL and reports ready with the parsed rows", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, status: 200, statusText: "OK", headers: { get: () => "text/csv" }, text: async () => "a,b\n1,2" })));
    const { result } = renderHook(() => useData("https://store.test/one.csv"));
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.rows).toEqual([{ a: 1, b: 2 }]);
  });

  it("reports an error state with the original Error when loading rejects", async () => {
    const load = async () => {
      throw new Error("warehouse timeout");
    };
    const { result } = renderHook(() => useData(load));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error!.message).toBe("warehouse timeout");
    expect(result.current.rows).toEqual([]);
  });

  it("wraps a non-Error rejection in an Error", async () => {
    const load = () => Promise.reject("plain string");
    const { result } = renderHook(() => useData(load as unknown as DataInput));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error!.message).toBe("plain string");
  });

  it("reports an HTTP failure as an error state that names the URL", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 500, statusText: "Server Error", headers: { get: () => null }, text: async () => "" })));
    const { result } = renderHook(() => useData("https://store.test/broken.csv"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error!.message).toContain("https://store.test/broken.csv responded 500");
  });

  it("reports unusable in-memory data as an error instead of throwing during render", () => {
    const { result } = renderHook(() => useData({ json: { total: 3 } }));
    expect(result.current.status).toBe("error");
    expect(result.current.error!.message).toMatch(/could not find an array of rows/);
  });

  it("reports a throwing transform as an error instead of crashing the tree", () => {
    const bad: Transform = () => {
      throw new Error("bad transform");
    };
    const { result } = renderHook(() => useData(energy, bad));
    expect(result.current.status).toBe("error");
    expect(result.current.error!.message).toBe("bad transform");
    expect(result.current.rows).toEqual([]);
  });

  it("ignores a slow response that arrives after the input has changed", async () => {
    const slow = deferred<Row[]>();
    const fast = deferred<Row[]>();
    const loadSlow = () => slow.promise;
    const loadFast = () => fast.promise;
    const { result, rerender } = renderHook(({ load }: { load: () => Promise<Row[]> }) => useData(load), { initialProps: { load: loadSlow } });
    rerender({ load: loadFast });
    await act(async () => fast.resolve([{ which: "fast" }]));
    expect(result.current.rows).toEqual([{ which: "fast" }]);
    await act(async () => slow.resolve([{ which: "slow" }]));
    expect(result.current.rows).toEqual([{ which: "fast" }]);
    expect(result.current.status).toBe("ready");
  });

  it("shows loading, not the previous rows, while a new source is in flight", async () => {
    const second = deferred<Row[]>();
    const loadA = async (): Promise<Row[]> => [{ v: "a" }];
    const loadB = () => second.promise;
    const { result, rerender } = renderHook(({ load }: { load: () => Promise<Row[]> }) => useData(load), { initialProps: { load: loadA } });
    await waitFor(() => expect(result.current.status).toBe("ready"));
    rerender({ load: loadB });
    expect(result.current).toMatchObject({ status: "loading", rows: [] });
    await act(async () => second.resolve([{ v: "b" }]));
    expect(result.current.rows).toEqual([{ v: "b" }]);
  });

  it("calls a stable loader once, however often the component re-renders", async () => {
    const load = vi.fn(async () => energy);
    const { result, rerender } = renderHook(() => useData(load));
    await waitFor(() => expect(result.current.status).toBe("ready"));
    rerender();
    rerender();
    await act(async () => {});
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("re-fetches on the `refresh` interval, bypassing the cache, and stops on unmount", async () => {
    vi.useFakeTimers();
    let hit = 0;
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, statusText: "OK", headers: { get: () => null }, text: async () => `n\n${++hit}` }));
    vi.stubGlobal("fetch", fetchMock);
    const source = { url: "https://store.test/live.csv", refresh: 1000 };
    const { result, unmount } = renderHook(() => useData(source));
    await act(async () => void (await vi.advanceTimersByTimeAsync(0)));
    expect(result.current.rows).toEqual([{ n: 1 }]);
    await act(async () => void (await vi.advanceTimersByTimeAsync(1000)));
    expect(result.current.rows).toEqual([{ n: 2 }]);
    expect(result.current.status).toBe("ready");
    unmount();
    await vi.advanceTimersByTimeAsync(5000);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  // CONFIRMED BROKEN, left as todo because the fix is a design decision. Functions are keyed
  // by identity, so `useData(async () => ...)` / `<BarChart data={async () => ...} />` written
  // inline gets a new key on every render: each response triggers a render, which starts a
  // new load, forever. The status never leaves "loading" and the loader (a database or API
  // call) is invoked in an endless loop. Keying on `fn.toString()` would stop the loop but
  // go stale when a closed-over variable changes, so the choice belongs to the API owner.
  it("an inline async function (new identity every render) loads once and settles", async () => {
    let calls = 0;
    const { result, rerender } = renderHook(() =>
      useData(async () => {
        calls++;
        return [{ a: 1 }];
      }),
    );
    await waitFor(() => expect(result.current.status).toBe("ready"));
    rerender();
    rerender();
    await new Promise((r) => setTimeout(r, 20));
    expect(result.current.rows).toEqual([{ a: 1 }]);
    expect(calls).toBe(1);
  });
});

describe("InsightData crossfilter", () => {
  let store!: InsightDataStore;
  function Probe() {
    store = useInsightData()!;
    return null;
  }
  const mount = (props: Partial<React.ComponentProps<typeof InsightData>> = {}) =>
    render(
      <InsightData data={energy} {...props}>
        <Probe />
      </InsightData>,
    );
  const select = (owner: string, s: Selection | null) => act(() => store.select(owner, s));
  const ids = (rows: Row[]) => rows.map((r) => `${r.region}/${r.source}`);

  beforeEach(() => {
    store = undefined as unknown as InsightDataStore;
  });

  it("is null outside a provider", () => {
    const { result } = renderHook(() => useInsightData());
    expect(result.current).toBeNull();
  });

  it("shares all rows when nothing is selected", () => {
    mount();
    expect(store.status).toBe("ready");
    expect(store.all).toBe(energy);
    expect(store.rowsFor("any")).toBe(energy);
    expect(store.rowsFor()).toBe(energy);
    expect(store.selections).toEqual({});
  });

  it("applies the shared transform before anything else", () => {
    mount({ transform: { type: "filter", field: "year", value: 2023 } });
    expect(store.all).toHaveLength(3);
    expect(store.rowsFor("x")).toHaveLength(3);
  });

  it("a chart's own selection filters the other charts but not itself", () => {
    mount();
    select("by-region", { field: "region", values: ["Asia"] });
    expect(ids(store.rowsFor("by-source"))).toEqual(["Asia/Solar", "Asia/Wind"]);
    expect(ids(store.rowsFor())).toEqual(["Asia/Solar", "Asia/Wind"]);
    expect(store.rowsFor("by-region")).toHaveLength(5);
    expect(store.all).toHaveLength(5);
  });

  it("several values in one selection are a union", () => {
    mount();
    select("by-region", { field: "region", values: ["Asia", "Africa"] });
    expect(ids(store.rowsFor("other"))).toEqual(["Asia/Solar", "Asia/Wind", "Africa/Hydro"]);
  });

  it("selections from two charts intersect, and each chart sees only the other's filter", () => {
    mount();
    select("by-region", { field: "region", values: ["Asia", "Europe"] });
    select("by-source", { field: "source", values: ["Solar"] });
    expect(ids(store.rowsFor("third"))).toEqual(["Asia/Solar", "Europe/Solar"]);
    expect(ids(store.rowsFor("by-region"))).toEqual(["Asia/Solar", "Europe/Solar"]);
    expect(ids(store.rowsFor("by-source"))).toEqual(["Asia/Solar", "Asia/Wind", "Europe/Solar", "Europe/Wind"]);
  });

  it("an intersection can be empty", () => {
    mount();
    select("a", { field: "region", values: ["Africa"] });
    select("b", { field: "source", values: ["Solar"] });
    expect(store.rowsFor("c")).toEqual([]);
  });

  it("matches selected values against numeric fields as strings", () => {
    mount();
    select("by-year", { field: "year", values: ["2024"] });
    expect(ids(store.rowsFor("other"))).toEqual(["Europe/Wind", "Africa/Hydro"]);
  });

  it("supports inclusive range selections (brushes)", () => {
    mount();
    select("brush", { field: "twh", range: [8, 15] });
    expect(store.rowsFor("other").map((r) => r.twh)).toEqual([10, 15, 8]);
    expect(store.rowsFor("brush")).toHaveLength(5);
  });

  it("selecting again replaces that chart's selection", () => {
    mount();
    select("by-region", { field: "region", values: ["Asia"] });
    select("by-region", { field: "region", values: ["Europe"] });
    expect(store.selections).toEqual({ "by-region": { field: "region", values: ["Europe"] } });
    expect(ids(store.rowsFor("x"))).toEqual(["Europe/Solar", "Europe/Wind"]);
  });

  it("select(owner, null) and an empty value list both remove that chart's selection only", () => {
    mount();
    select("a", { field: "region", values: ["Asia"] });
    select("b", { field: "source", values: ["Wind"] });
    select("a", null);
    expect(Object.keys(store.selections)).toEqual(["b"]);
    select("b", { field: "source", values: [] });
    expect(store.selections).toEqual({});
    expect(store.rowsFor("x")).toBe(energy);
  });

  it("clear removes every selection", () => {
    mount();
    select("a", { field: "region", values: ["Asia"] });
    select("b", { field: "source", values: ["Wind"] });
    act(() => store.clear());
    expect(store.selections).toEqual({});
    expect(store.rowsFor("a")).toHaveLength(5);
    expect(store.rowsFor("x")).toHaveLength(5);
  });

  it("two selections made in the same tick both survive", () => {
    mount();
    act(() => {
      store.select("a", { field: "region", values: ["Asia"] });
      store.select("b", { field: "source", values: ["Wind"] });
    });
    expect(Object.keys(store.selections).sort()).toEqual(["a", "b"]);
  });

  it("rowsFor returns a stable array between renders, so charts do not rebuild needlessly", () => {
    mount();
    select("a", { field: "region", values: ["Asia"] });
    expect(store.rowsFor("b")).toBe(store.rowsFor("b"));
  });

  it("reports selection changes to onSelectionsChange", () => {
    const onChange = vi.fn();
    mount({ onSelectionsChange: onChange });
    select("a", { field: "region", values: ["Asia"] });
    expect(onChange).toHaveBeenLastCalledWith({ a: { field: "region", values: ["Asia"] } });
    act(() => store.clear());
    expect(onChange).toHaveBeenLastCalledWith({});
  });

  it("controlled: the `selections` prop is the source of truth", () => {
    const onChange = vi.fn();
    const controlled = { ext: { field: "region", values: ["Europe"] } };
    const view = mount({ selections: controlled, onSelectionsChange: onChange });
    expect(ids(store.rowsFor("x"))).toEqual(["Europe/Solar", "Europe/Wind"]);
    select("a", { field: "source", values: ["Wind"] });
    expect(onChange).toHaveBeenLastCalledWith({ ...controlled, a: { field: "source", values: ["Wind"] } });
    // The parent has not accepted the change, so nothing moves.
    expect(store.selections).toBe(controlled);
    view.rerender(
      <InsightData data={energy} selections={{}}>
        <Probe />
      </InsightData>,
    );
    expect(store.rowsFor("x")).toHaveLength(5);
  });

  it("exposes loading and error states of the shared data", async () => {
    const d = deferred<Row[]>();
    const load = () => d.promise;
    mount({ data: load });
    expect(store.status).toBe("loading");
    expect(store.rowsFor("x")).toEqual([]);
    await act(async () => d.reject(new Error("offline")));
    expect(store.status).toBe("error");
    expect(store.error!.message).toBe("offline");
  });
});
