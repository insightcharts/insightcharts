import { describe, expect, it } from "vitest";
import { formatDate, isTemporal, makeFormatter, type FormatSpec } from "../src/core/format";

const f = (spec: FormatSpec | undefined, value: unknown) => makeFormatter(spec, "en-US")(value);

describe("makeFormatter: shorthands", () => {
  it("auto prints in full below 10,000 and compact from there up", () => {
    expect(f("auto", 0)).toBe("0");
    expect(f("auto", 1234.567)).toBe("1,234.57");
    expect(f("auto", 9999)).toBe("9,999");
    expect(f("auto", 9999.99)).toBe("9,999.99");
    expect(f("auto", 10000)).toBe("10K");
    expect(f("auto", 12900)).toBe("12.9K");
    expect(f("auto", 3_400_000)).toBe("3.4M");
    expect(f("auto", 2_500_000_000)).toBe("2.5B");
  });

  it("auto is the default and applies the threshold to negative values by magnitude", () => {
    expect(f(undefined, 1234.5)).toBe("1,234.5");
    expect(f("auto", -9999)).toBe("−9,999");
    expect(f("auto", -12900)).toBe("−12.9K");
  });

  it("compact", () => {
    expect(f("compact", 950)).toBe("950");
    expect(f("compact", 12900)).toBe("12.9K");
    expect(f("compact", 1_250_000)).toBe("1.3M");
  });

  it("percent scales a fraction; percent-raw takes a number already in percent", () => {
    expect(f("percent", 0.42)).toBe("42%");
    expect(f("percent", 0.4256)).toBe("42.6%");
    expect(f("percent", 1.5)).toBe("150%");
    expect(f("percent-raw", 42)).toBe("42%");
    expect(f("percent-raw", 12.5)).toBe("12.5%");
    expect(f("percent-raw", 57)).toBe("57%");
  });

  it("integer rounds and groups", () => {
    expect(f("integer", 3.7)).toBe("4");
    expect(f("integer", 1234567.2)).toBe("1,234,567");
  });

  it("signed always shows the direction except on zero", () => {
    expect(f("signed", 5)).toBe("+5");
    expect(f("signed", -5.25)).toBe("−5.3");
    expect(f("signed", 0)).toBe("0");
  });

  it("year never groups digits", () => {
    expect(f("year", 2024)).toBe("2024");
    expect(f("auto", 2024)).toBe("2,024");
  });

  it("currency:CODE is compact with the currency symbol", () => {
    expect(f("currency:USD", 5)).toBe("$5");
    expect(f("currency:USD", 1200)).toBe("$1.2K");
    expect(f("currency:USD", 3_400_000)).toBe("$3.4M");
    expect(f("currency:EUR", 1200)).toBe("€1.2K");
    expect(f("currency:USD", -1200)).toBe("−$1.2K");
  });

  it("decimal:n fixes the number of decimals", () => {
    expect(f("decimal:2", 3.14159)).toBe("3.14");
    expect(f("decimal:2", 3)).toBe("3.00");
    expect(f("decimal:0", 2.5)).toBe("3");
    expect(f("decimal:1", 1234.56)).toBe("1,234.6");
  });

  it("templates wrap the auto-formatted value", () => {
    expect(f("{value} kg", 1234)).toBe("1,234 kg");
    expect(f("{value} kg", 12900)).toBe("12.9K kg");
    expect(f("${value}/mo", 49.5)).toBe("$49.5/mo");
    expect(f("{value}", 7)).toBe("7");
    expect(f("{value} °C", -5)).toBe("−5 °C");
  });

  it("accepts Intl.NumberFormat options", () => {
    expect(f({ style: "unit", unit: "kilometer", maximumFractionDigits: 0 }, 1234.4)).toBe("1,234 km");
    expect(f({ minimumFractionDigits: 3 }, 1)).toBe("1.000");
  });

  it("accepts a function, called only for numbers", () => {
    const fn = (v: number) => `#${v}`;
    expect(f(fn, 3)).toBe("#3");
    expect(f(fn, "x")).toBe("x");
    expect(f(fn, null)).toBe("");
  });
});

describe("makeFormatter: values", () => {
  it("uses the typographic minus (U+2212), which aligns in tabular figures, never a hyphen", () => {
    for (const spec of ["auto", "compact", "percent", "integer", "signed", "decimal:1", "currency:USD", "{value} pts"] as FormatSpec[]) {
      const out = f(spec, -12.5);
      expect(out, String(spec)).toContain("−");
      expect(out, String(spec)).not.toContain("-");
    }
  });

  it("prints nothing for missing and non-finite values rather than 'NaN' or 'null'", () => {
    for (const spec of ["auto", "percent", "{value} kg"] as FormatSpec[]) {
      for (const v of [null, undefined, "", NaN, Infinity, -Infinity]) expect(f(spec, v), `${spec} ${v}`).toBe("");
    }
  });

  it("passes strings through and formats dates in the locale", () => {
    expect(f("percent", "n/a")).toBe("n/a");
    expect(f("auto", new Date(2024, 0, 5))).toBe("1/5/2024");
  });

  it("respects the locale", () => {
    expect(makeFormatter("auto", "de-DE")(1234.5)).toBe("1.234,5");
    expect(makeFormatter("percent", "de-DE")(0.42)).toMatch(/^42\s?%$/);
  });

  // Auto rounds to two decimals, so 0.004 prints as "0" and a chart of small rates shows a
  // column of zeros. Significant-digit rounding below 1 would fix it but changes output.
  it("auto keeps small magnitudes (0.004) visible instead of rounding them to 0", () => {
    const f = makeFormatter("auto", "en-US");
    expect(f(0.004)).toBe("0.004");
    expect(f(0.0123)).toBe("0.012");
    expect(f(0)).toBe("0");
    expect(f(0.25)).toBe("0.25");
  });
});

describe("formatDate and isTemporal", () => {
  it("formats dates, ISO strings and epoch milliseconds", () => {
    expect(formatDate(new Date(2024, 0, 5), "en-US")).toBe("Jan 5, 2024");
    expect(formatDate("2024-06-15T12:00:00", "en-US")).toBe("Jun 15, 2024");
    expect(formatDate(new Date(2024, 0, 5).getTime(), "en-US")).toBe("Jan 5, 2024");
    expect(formatDate(new Date(2024, 0, 5), "en-US", { year: "numeric", month: "long" })).toBe("January 2024");
  });

  it("returns the input as text when it is not a date", () => {
    expect(formatDate("Q3", "en-US")).toBe("Q3");
    expect(formatDate(null, "en-US")).toMatch(/^(|Jan 1, 1970|Dec 31, 1969)$/);
  });

  it("detects Date objects and ISO date strings", () => {
    for (const v of [new Date(), "2024-01-05", "2024-01", "2024-01-05T10:30", "2024-01-05 10:30:00", "2024-01-05T10:30:00.000Z"]) expect(isTemporal(v), String(v)).toBe(true);
  });

  it("does not mistake years, numbers, quarters or free text for dates", () => {
    for (const v of ["2024", 2024, "Q1 2024", "Jan", "12-05", "", null, undefined, 20240105]) expect(isTemporal(v), String(v)).toBe(false);
  });

  // The doc comment promises "epoch milliseconds past 1973" are temporal; the code returns
  // false for every number. Either the comment or the code is wrong.
  it.todo("treats epoch-millisecond numbers as temporal, as its doc comment says");
});
