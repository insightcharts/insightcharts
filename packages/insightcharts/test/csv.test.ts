import { describe, expect, it } from "vitest";
import { inferValue, parseCsv, toCsv } from "../src/data/csv";

describe("parseCsv: structure", () => {
  it("parses a plain file with a header", () => {
    expect(parseCsv("name,value\nA,1\nB,2")).toEqual([
      { name: "A", value: 1 },
      { name: "B", value: 2 },
    ]);
  });

  it("keeps delimiters and line breaks that sit inside quoted fields", () => {
    const rows = parseCsv('city,note\n"Portland, OR","line one\nline two"\nBoise,plain');
    expect(rows).toEqual([
      { city: "Portland, OR", note: "line one\nline two" },
      { city: "Boise", note: "plain" },
    ]);
  });

  it('unescapes doubled quotes ("") inside quoted fields', () => {
    expect(parseCsv('quote\n"She said ""hi"""')).toEqual([{ quote: 'She said "hi"' }]);
  });

  it("leaves a quote in the middle of an unquoted field alone", () => {
    expect(parseCsv('size,n\n5" pipe,3')).toEqual([{ size: '5" pipe', n: 3 }]);
  });

  it("handles CRLF, lone CR and a trailing newline without inventing rows", () => {
    expect(parseCsv("a,b\r\n1,2\r\n3,4\r\n")).toEqual([
      { a: 1, b: 2 },
      { a: 3, b: 4 },
    ]);
    expect(parseCsv("a,b\r1,2\r3,4")).toEqual([
      { a: 1, b: 2 },
      { a: 3, b: 4 },
    ]);
  });

  it("strips a UTF-8 byte order mark so the first column name is clean", () => {
    const rows = parseCsv("﻿year,value\n2020,1");
    expect(Object.keys(rows[0])).toEqual(["year", "value"]);
  });

  it("skips blank lines", () => {
    expect(parseCsv("a,b\n\n1,2\n\n\n3,4\n")).toHaveLength(2);
  });

  it("fills short rows with null and ignores cells beyond the header", () => {
    expect(parseCsv("a,b,c\n1\n1,2,3,4")).toEqual([
      { a: 1, b: null, c: null },
      { a: 1, b: 2, c: 3 },
    ]);
  });

  it("keeps a trailing empty cell on the last line", () => {
    expect(parseCsv("a,b\n1,")).toEqual([{ a: 1, b: null }]);
  });

  it("names blank header cells by position and trims header whitespace", () => {
    expect(parseCsv(" a ,,c\n1,2,3")).toEqual([{ a: 1, column_2: 2, c: 3 }]);
  });

  it("returns no rows for empty text or a header with no body", () => {
    expect(parseCsv("")).toEqual([]);
    expect(parseCsv("a,b")).toEqual([]);
    expect(parseCsv("a,b\n")).toEqual([]);
  });
});

describe("parseCsv: delimiter sniffing", () => {
  it("detects tabs", () => {
    expect(parseCsv("name\tvalue\nA, Inc\t1")).toEqual([{ name: "A, Inc", value: 1 }]);
  });

  it("detects semicolons", () => {
    expect(parseCsv("name;value\nA;1\nB;2")).toEqual([
      { name: "A", value: 1 },
      { name: "B", value: 2 },
    ]);
  });

  it("detects pipes", () => {
    expect(parseCsv("name|value\nA|1")).toEqual([{ name: "A", value: 1 }]);
  });

  it("falls back to comma for a single column", () => {
    expect(parseCsv("value\n1\n2")).toEqual([{ value: 1 }, { value: 2 }]);
  });

  it("an explicit delimiter overrides sniffing", () => {
    expect(parseCsv("a,b;c\n1,2;3", { delimiter: ";" })).toEqual([{ "a,b": "1,2", c: 3 }]);
  });

  it("sniffs after the BOM, with CRLF line endings", () => {
    expect(parseCsv("﻿a;b\r\n1;2\r\n")).toEqual([{ a: 1, b: 2 }]);
  });

  // European exports pair `;` with decimal commas ("1,5"). They currently stay strings, so a
  // chart of such a file plots nothing. Supporting it needs a locale/decimal option on
  // ParseCsvOptions, which is an API decision.
  it.todo("reads decimal commas in semicolon-delimited files as numbers");
});

describe("inferValue", () => {
  it.each([
    ["42", 42],
    [" 42 ", 42],
    ["-3.5", -3.5],
    ["+7", 7],
    ["0", 0],
    ["0.5", 0.5],
    ["-0.5", -0.5],
    [".5", 0.5],
    ["1e3", 1000],
    ["2.5E-2", 0.025],
    ["2024", 2024],
  ])("reads %j as the number %j", (raw, expected) => {
    expect(inferValue(raw)).toBe(expected);
  });

  it.each([["007"], ["00"], ["01234"], ["-01"], ["0123.5"]])("keeps the leading-zero identifier %j as a string", (raw) => {
    expect(inferValue(raw)).toBe(raw);
  });

  it("removes thousands separators", () => {
    expect(inferValue("1,234")).toBe(1234);
    expect(inferValue("1,234,567.89")).toBe(1234567.89);
    expect(inferValue("-12,000")).toBe(-12000);
  });

  it("does not mistake comma-separated lists or malformed groups for numbers", () => {
    expect(inferValue("1,2")).toBe("1,2");
    expect(inferValue("12,34")).toBe("12,34");
    expect(inferValue("1,2345")).toBe("1,2345");
  });

  it("reads percentages as fractions", () => {
    expect(inferValue("42%")).toBe(0.42);
    expect(inferValue("12.5%")).toBe(0.125);
    expect(inferValue("-4%")).toBe(-0.04);
    expect(inferValue("−4%")).toBe(-0.04);
    expect(inferValue("100%")).toBe(1);
  });

  it("accepts the Unicode minus sign (U+2212) that spreadsheets and typeset tables emit", () => {
    expect(inferValue("−5")).toBe(-5);
    expect(inferValue("−1,234.5")).toBe(-1234.5);
  });

  it("turns empty cells and the usual missing markers into null", () => {
    for (const raw of ["", "   ", "NA", "N/A", "null", "NaN"]) expect(inferValue(raw)).toBeNull();
  });

  it("reads booleans", () => {
    expect(inferValue("true")).toBe(true);
    expect(inferValue("TRUE")).toBe(true);
    expect(inferValue("false")).toBe(false);
    expect(inferValue("FALSE")).toBe(false);
  });

  it("leaves dates, signs, punctuation and words as strings", () => {
    for (const raw of ["2024-01-05", "2024-01", "-", "+", ".", "1.2.3", "12 apples", "$5", "1e", "Infinity", "0x10", "yes"]) expect(inferValue(raw)).toBe(raw);
  });

  it("can be switched off, keeping every cell as written", () => {
    expect(parseCsv("id,n,empty\n007,1,", { infer: false })).toEqual([{ id: "007", n: "1", empty: "" }]);
  });

  it("applies to quoted cells as well", () => {
    expect(parseCsv('zip,pop\n"02134","1,234"')).toEqual([{ zip: "02134", pop: 1234 }]);
  });
});

describe("toCsv", () => {
  it("quotes cells containing commas, quotes or line breaks", () => {
    expect(toCsv([{ a: "x,y", b: 'say "hi"', c: "l1\nl2" }])).toBe('a,b,c\n"x,y","say ""hi""","l1\nl2"');
  });

  it("writes null and undefined as empty cells and dates as ISO strings", () => {
    expect(toCsv([{ a: null, b: undefined, c: new Date("2024-01-05T00:00:00Z") }])).toBe("a,b,c\n,,2024-01-05T00:00:00.000Z");
  });

  it("uses the union of keys across ragged rows, in first-seen order", () => {
    expect(toCsv([{ a: 1 }, { b: 2, a: 3 }])).toBe("a,b\n1,\n3,2");
  });

  it("honours an explicit column list and order", () => {
    expect(toCsv([{ a: 1, b: 2, c: 3 }], ["c", "a"])).toBe("c,a\n3,1");
  });

  it("quotes header names that need it", () => {
    expect(toCsv([{ "GDP, nominal": 1 }])).toBe('"GDP, nominal"\n1');
  });

  it("round-trips through parseCsv without changing values or types", () => {
    const rows = [
      { id: "007", name: "Portland, OR", note: 'She said "hi"', value: 1234.5, share: -0.25, ok: true, missing: null },
      { id: "010", name: "multi\nline", note: "plain", value: 0, share: 1e-7, ok: false, missing: null },
      { id: "A-1", name: "Zürich 東京", note: "", value: -3, share: 12, ok: true, missing: null },
    ];
    const expected = rows.map((r) => ({ ...r, note: r.note === "" ? null : r.note }));
    expect(parseCsv(toCsv(rows))).toEqual(expected);
  });

  it("round-trips CSV text that was parsed, exported and parsed again", () => {
    const text = 'region;sales;growth\n"North; East";1.234;12%\nSouth;-5;−3%\n';
    const once = parseCsv(text);
    expect(parseCsv(toCsv(once))).toEqual(once);
  });
});
