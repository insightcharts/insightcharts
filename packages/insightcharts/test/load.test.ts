import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getPath, isUrl, loadData, resolveSync } from "../src/data/load";
import type { DataInput } from "../src/data/types";

const rows = [
  { year: 2020, value: 1 },
  { year: 2021, value: 2 },
];

describe("resolveSync: in-memory shapes", () => {
  it("returns [] for null and undefined", () => {
    expect(resolveSync(null)).toEqual([]);
    expect(resolveSync(undefined)).toEqual([]);
  });

  it("passes row objects through untouched (same array, no copy)", () => {
    expect(resolveSync(rows)).toBe(rows);
  });

  it("returns [] for an empty array", () => {
    expect(resolveSync([])).toEqual([]);
  });

  it("converts columnar data, including typed arrays and ragged columns", () => {
    expect(resolveSync({ year: [2020, 2021], value: [1, 2] })).toEqual(rows);
    expect(resolveSync({ year: new Int32Array([2020, 2021]), value: new Float64Array([1, 2]) })).toEqual(rows);
    expect(resolveSync({ a: [1, 2, 3], b: ["x"] })).toEqual([
      { a: 1, b: "x" },
      { a: 2, b: undefined },
      { a: 3, b: undefined },
    ]);
  });

  it("converts an array of arrays, using the first as the header", () => {
    const input = [
      ["year", "value"],
      [2020, 1],
      [2021, 2],
    ] as unknown as DataInput;
    expect(resolveSync(input)).toEqual(rows);
  });

  it("wraps an array of primitives as { index, value }", () => {
    expect(resolveSync([5, 7] as unknown as DataInput)).toEqual([
      { index: 0, value: 5 },
      { index: 1, value: 7 },
    ]);
  });

  it("parses CSV text, and { csv } with an optional delimiter", () => {
    expect(resolveSync("year,value\n2020,1\n2021,2")).toEqual(rows);
    expect(resolveSync({ csv: "year,value\n2020,1\n2021,2" })).toEqual(rows);
    expect(resolveSync({ csv: "label|n\na,b|1", delimiter: "|" })).toEqual([{ label: "a,b", n: 1 }]);
  });

  it("reads { json } directly and through a dot path", () => {
    expect(resolveSync({ json: rows })).toBe(rows);
    expect(resolveSync({ json: { payload: { items: rows } }, path: "payload.items" })).toBe(rows);
    expect(resolveSync({ json: { pages: [{ rows }] }, path: "pages.0.rows" })).toBe(rows);
  });

  it.each(["data", "rows", "results", "items", "records"])("unwraps the API envelope { %s: [...] }", (key) => {
    expect(resolveSync({ json: { [key]: rows } })).toEqual(rows);
    expect(resolveSync({ [key]: rows } as unknown as DataInput)).toEqual(rows);
  });

  it("unwraps an envelope that carries other array-valued keys", () => {
    expect(resolveSync({ json: { data: rows, errors: [], warnings: [] } })).toEqual(rows);
  });

  it("unwraps an envelope with metadata next to the rows", () => {
    expect(resolveSync({ json: { meta: { total: 2 }, results: rows } })).toEqual(rows);
  });

  it("treats an empty envelope as no rows", () => {
    expect(resolveSync({ json: { data: [] } })).toEqual([]);
  });

  it("reads Arrow-like tables: toArray() of row proxies with toJSON()", () => {
    const table = { numRows: 2, toArray: () => rows.map((r) => ({ toJSON: () => ({ ...r }) })) };
    expect(resolveSync(table)).toEqual(rows);
  });

  it("reads tables whose toArray() already returns plain objects (DuckDB, Arquero)", () => {
    expect(resolveSync({ toArray: () => rows })).toEqual(rows);
  });

  it("throws a message that names the fix when no rows can be found", () => {
    expect(() => resolveSync({ json: { total: 3 } })).toThrow(/could not find an array of rows.*path/i);
    expect(() => resolveSync({ json: { payload: rows }, path: "nope" })).toThrow(/could not find an array of rows/);
    expect(() => resolveSync(42 as unknown as DataInput)).toThrow(/could not find an array of rows/);
  });

  it("returns null for anything that needs async work", () => {
    expect(resolveSync("https://example.com/data.csv")).toBeNull();
    expect(resolveSync({ url: "/data.json" })).toBeNull();
    expect(resolveSync(() => rows)).toBeNull();
    expect(resolveSync(Promise.resolve(rows))).toBeNull();
  });
});

describe("isUrl: URL or CSV text?", () => {
  it.each(["https://example.com/data.csv", "http://localhost:3000/api/rows", "/data/energy.csv", "./energy.csv", "../shared/energy.json", "  /padded.csv  "])("treats %j as a URL", (s) => {
    expect(isUrl(s)).toBe(true);
  });

  it.each(["year,value\n2020,1", "a,b", "name\nA\nB", "value", "name;value\nA;1", "a\tb\n1\t2", ""])("treats %j as CSV text", (s) => {
    expect(isUrl(s)).toBe(false);
  });

  it("treats a URL with commas in its query string as a URL", () => {
    expect(isUrl("https://api.example.com/v1/series?fields=year,value&ids=1,2,3")).toBe(true);
    expect(isUrl("/api/rows?cols=a,b")).toBe(true);
  });

  it("treats data: URLs as URLs (they always contain a comma)", () => {
    expect(isUrl("data:text/csv;base64,YSxiCjEsMg==")).toBe(true);
    expect(isUrl("data:text/csv,a%2Cb%0A1%2C2")).toBe(true);
  });

  it("treats multi-line text as CSV even when the header looks like a path", () => {
    expect(isUrl("/path,hits\n/home,10\n/about,3")).toBe(false);
    expect(isUrl("https://a.example,5\nhttps://b.example,7")).toBe(false);
  });

  // "energy.csv" (no ./ or /) is parsed as CSV text with one header and no rows, so the
  // chart silently shows "No data". Treating bare `name.ext` strings as URLs is plausible
  // but changes the documented rule ("looks like a path or absolute URL").
  it.todo("treats a bare relative file name such as 'energy.csv' as a URL");
});

describe("getPath", () => {
  it("walks objects and arrays, and returns undefined instead of throwing", () => {
    const v = { a: { b: [{ c: 1 }] } };
    expect(getPath(v, "a.b.0.c")).toBe(1);
    expect(getPath(v, "a.x.y")).toBeUndefined();
    expect(getPath(null, "a")).toBeUndefined();
    expect(getPath(v)).toBe(v);
  });
});

type FakeResponse = { ok: boolean; status: number; statusText: string; headers: { get(name: string): string | null }; text(): Promise<string> };
const respond = (body: string, type: string | null = null, status = 200, statusText = "OK"): FakeResponse => ({
  ok: status >= 200 && status < 300,
  status,
  statusText,
  headers: { get: (name) => (name.toLowerCase() === "content-type" ? type : null) },
  text: async () => body,
});

describe("loadData", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let n = 0;
  // The URL cache is module-level, so every test uses its own URL.
  const unique = (path: string) => `https://data.test/${++n}/${path}`;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves in-memory inputs without fetching", async () => {
    expect(await loadData(rows)).toBe(rows);
    expect(await loadData("year,value\n2020,1")).toEqual([{ year: 2020, value: 1 }]);
    expect(await loadData(null)).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("calls sync and async functions and resolves whatever they return", async () => {
    expect(await loadData(() => rows)).toBe(rows);
    expect(await loadData(async () => ({ year: [2020, 2021], value: [1, 2] }))).toEqual(rows);
    expect(await loadData(async () => "year,value\n2020,1\n2021,2")).toEqual(rows);
    expect(await loadData(async () => ({ json: { data: rows } }))).toEqual(rows);
  });

  it("awaits promises", async () => {
    expect(await loadData(Promise.resolve(rows))).toBe(rows);
    expect(await loadData(Promise.resolve({ toArray: () => rows }))).toEqual(rows);
  });

  it("propagates rejections from functions and promises", async () => {
    await expect(loadData(async () => Promise.reject(new Error("db down")))).rejects.toThrow("db down");
    await expect(loadData(Promise.reject(new Error("nope")))).rejects.toThrow("nope");
  });

  it("follows a function that returns a URL", async () => {
    const url = unique("from-fn.csv");
    fetchMock.mockResolvedValue(respond("a,b\n1,2"));
    expect(await loadData(() => url)).toEqual([{ a: 1, b: 2 }]);
    expect(fetchMock).toHaveBeenCalledWith(url, undefined);
  });

  it("parses CSV by file extension, ignoring the query string and content type", async () => {
    const url = unique("energy.csv?v=3#top");
    fetchMock.mockResolvedValue(respond("a,b\n1,2", "text/plain"));
    expect(await loadData(url)).toEqual([{ a: 1, b: 2 }]);
  });

  it("parses TSV by extension with a tab delimiter even when cells contain commas", async () => {
    fetchMock.mockResolvedValue(respond("name\tn\nA, Inc\t1"));
    expect(await loadData(unique("x.tsv"))).toEqual([{ name: "A, Inc", n: 1 }]);
  });

  it("parses JSON by content type when the URL has no extension", async () => {
    fetchMock.mockResolvedValue(respond(JSON.stringify({ data: rows }), "application/json; charset=utf-8"));
    expect(await loadData(unique("api/rows"))).toEqual(rows);
  });

  it("parses CSV and TSV by content type", async () => {
    fetchMock.mockResolvedValueOnce(respond("a,b\n1,2", "text/csv"));
    expect(await loadData(unique("api/export"))).toEqual([{ a: 1, b: 2 }]);
    fetchMock.mockResolvedValueOnce(respond("a\tb\n1\t2", "text/tab-separated-values"));
    expect(await loadData(unique("api/export"))).toEqual([{ a: 1, b: 2 }]);
  });

  it("parses NDJSON by extension and by content type, tolerating blank lines and CRLF", async () => {
    const body = '{"a":1}\r\n{"a":2}\n\n{"a":3}\n';
    fetchMock.mockResolvedValueOnce(respond(body));
    expect(await loadData(unique("log.ndjson"))).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
    fetchMock.mockResolvedValueOnce(respond(body, "application/x-ndjson"));
    expect(await loadData(unique("stream"))).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
  });

  it("sniffs the body when neither extension nor content type says what it is", async () => {
    fetchMock.mockResolvedValueOnce(respond(`  \n${JSON.stringify(rows)}`, "application/octet-stream"));
    expect(await loadData(unique("blob"))).toEqual(rows);
    fetchMock.mockResolvedValueOnce(respond(JSON.stringify({ results: rows })));
    expect(await loadData(unique("blob"))).toEqual(rows);
    fetchMock.mockResolvedValueOnce(respond("year,value\n2020,1\n2021,2"));
    expect(await loadData(unique("blob"))).toEqual(rows);
  });

  it("an explicit format wins over extension and content type", async () => {
    fetchMock.mockResolvedValue(respond(JSON.stringify(rows), "text/csv"));
    expect(await loadData({ url: unique("download.csv"), format: "json" })).toEqual(rows);
  });

  it("applies `path` to JSON responses", async () => {
    fetchMock.mockResolvedValue(respond(JSON.stringify({ response: { series: rows } }), "application/json"));
    expect(await loadData({ url: unique("api"), path: "response.series" })).toEqual(rows);
  });

  it("rejects with the URL and status on an HTTP error", async () => {
    const url = unique("missing.csv");
    fetchMock.mockResolvedValue(respond("Not here", "text/html", 404, "Not Found"));
    await expect(loadData(url)).rejects.toThrow(`${url} responded 404 Not Found`);
  });

  it("rejects with a useful message when JSON has no row array", async () => {
    fetchMock.mockResolvedValue(respond(JSON.stringify({ total: 0 }), "application/json"));
    await expect(loadData(unique("api"))).rejects.toThrow(/could not find an array of rows/);
  });

  it("de-duplicates concurrent and repeated loads of the same URL", async () => {
    const url = unique("shared.csv");
    fetchMock.mockImplementation(async () => respond("a\n1"));
    const [a, b] = await Promise.all([loadData(url), loadData(url)]);
    const c = await loadData({ url });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
    expect(c).toBe(a);
  });

  it("keys the cache on url, format and path", async () => {
    const url = unique("api");
    fetchMock.mockImplementation(async () => respond(JSON.stringify({ a: [{ v: 1 }], b: [{ v: 2 }] }), "application/json"));
    expect(await loadData({ url, path: "a" })).toEqual([{ v: 1 }]);
    expect(await loadData({ url, path: "b" })).toEqual([{ v: 2 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("bypasses the cache with { fresh: true }", async () => {
    const url = unique("live.csv");
    let hit = 0;
    fetchMock.mockImplementation(async () => respond(`a\n${++hit}`));
    expect(await loadData(url)).toEqual([{ a: 1 }]);
    expect(await loadData(url, { fresh: true })).toEqual([{ a: 2 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not cache failures, so a retry fetches again", async () => {
    const url = unique("flaky.csv");
    fetchMock.mockResolvedValueOnce(respond("", null, 503, "Service Unavailable"));
    await expect(loadData(url)).rejects.toThrow("503");
    fetchMock.mockResolvedValueOnce(respond("a\n1"));
    expect(await loadData(url)).toEqual([{ a: 1 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not cache requests with `init` (they may carry auth or a body) and passes init to fetch", async () => {
    const url = unique("private.json");
    const init = { headers: { Authorization: "Bearer t" } };
    fetchMock.mockImplementation(async () => respond(JSON.stringify(rows)));
    await loadData({ url, init });
    await loadData({ url, init });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith(url, init);
  });

  it("trims whitespace around a URL string", async () => {
    const url = unique("trim.csv");
    fetchMock.mockResolvedValue(respond("a\n1"));
    await loadData(`  ${url}\n`);
    expect(fetchMock).toHaveBeenCalledWith(url, undefined);
  });

  it("fetches a URL whose query string contains commas instead of parsing it as CSV", async () => {
    const url = unique("api?fields=year,value");
    fetchMock.mockResolvedValue(respond(JSON.stringify(rows), "application/json"));
    expect(await loadData(url)).toEqual(rows);
    expect(fetchMock).toHaveBeenCalledWith(url, undefined);
  });
});
