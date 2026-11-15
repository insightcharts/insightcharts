# Connect data to an InsightCharts chart

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Goal: The chart reads the user's data source directly, with any reshaping done by JSON transforms, and shows loading and error states for remote data.

Connect the user's data to a chart and reshape it with `transform`. If the user has not told you where the data is (a file, a URL, an API, a query) and which columns to draw, ask.

Everything passed as `data` is resolved to an array of plain row objects. Field props such as `x` and `y` name keys of those rows.

## Steps

1. Identify the kind of source and pass it as `data` in the matching form below.
2. Look at two or three rows. Note the column names and whether the data is wide (one column per series) or long (one row per observation).
3. Reshape with `transform` objects. Do not write a loop when a transform exists.
4. Set the field props to the column names after the transforms.
5. Render and check the loading, error and empty states for remote data.

## How to connect each kind of source

| Source | Pass as `data` | Notes |
|---|---|---|
| Rows in memory | `[{ team: "Design", headcount: 14 }]` | The standard form. Resolves synchronously. |
| Array of arrays | `[["team", "headcount"], ["Design", 14]]` | The first row is the header. In TypeScript the `DataInput` type does not list this shape, so convert it to rows or pass it inside `{ json: value }`. |
| Columns | `{ team: ["Design"], headcount: [14] }` | Every value is an array or typed array. |
| CSV text | `"team,headcount\nDesign,14"` | The delimiter is detected. Numbers are inferred. |
| CSV with a set delimiter | `{ csv: "a;b\n1;2", delimiter: ";" }` | |
| A JSON value | `{ json: response, path: "data.results" }` | `path` is a dot path to the row array. |
| URL | `"/data/energy.csv"` or `"https://example.com/rows.json"` | Fetched in the browser. |
| URL with options | `{ url: "/api/sales", format: "json", path: "rows", init: { headers }, refresh: 30000 }` | See the options below. |
| Async function or promise | `async () => db.query("...")` | Resolves to any shape above. Needs a `"use client"` file in Next.js, or run it on the server with `loadData`. |
| Arrow table, DuckDB result, Arquero table | the table object | Anything with `toArray()` that returns row objects. |

A string is a URL when it is one line that starts with `http://`, `https://`, `/`, `./`, `../` or `data:`. Any other string is parsed as CSV.

When a JSON value is an object and you give no `path`, the loader looks for a row array under `data`, `rows`, `results`, `items` or `records`. If it finds none it throws an error that says to pass `path`.

Remote source options:

| Option | Purpose |
|---|---|
| `url` | A CSV, TSV, JSON or NDJSON resource. |
| `format` | `"csv"`, `"tsv"`, `"json"` or `"ndjson"`. Inferred from the file extension, then the content type, then the first character of the body. |
| `path` | Dot path to the row array inside a JSON response. |
| `init` | Passed to `fetch`: headers, method, body. |
| `refresh` | Re-fetch interval in milliseconds, in the browser only. |

In-memory data draws at once. URLs, promises and functions load asynchronously. The chart shows a skeleton while loading, a message if the request fails and "No data to show." for zero rows. Two charts that ask for the same `url`, `format` and `path` share one request. Sources with `init` or `refresh` are not cached.

## Load on the server

`insightcharts/data` is server-safe. Use it in a server component, a route handler or a script and pass the rows down.

```tsx
import { readFile } from "node:fs/promises";
import { loadData, parseCsv, transformRows } from "insightcharts/data";

const remote = await loadData("https://example.com/energy.csv"); // absolute URLs only on the server
const local = parseCsv(await readFile("data/energy.csv", "utf8"));
const bySource = transformRows(local, { type: "aggregate", groupBy: "source", measures: { twh: { op: "sum", field: "twh" } } });
```

`loadData(input, { fresh: true })` bypasses the URL cache.

## Transforms

`transform` takes one transform or an array, applied in order before drawing. A function `(rows) => rows` is also accepted in a client file.

| Type | Shape | What it does |
|---|---|---|
| `"filter"` | `{ type: "filter", field, op?, value? }` | Keeps matching rows. `op` defaults to `"=="`. |
| `"aggregate"` | `{ type: "aggregate", groupBy?, measures }` | One row per group. `groupBy` is a field or an array of fields. `measures` maps an output name to `{ op, field? }`. |
| `"sort"` | `{ type: "sort", by, order? }` | `"asc"` by default. Strings sort naturally, so "Q10" follows "Q9". |
| `"limit"` | `{ type: "limit", n, offset? }` | A slice of rows. |
| `"top"` | `{ type: "top", n, by, other?, label? }` | The largest `n` by `by`. With `other` and `label`, the rest are summed into one row whose `label` field holds the `other` text. |
| `"fold"` | `{ type: "fold", fields, key?, value? }` | Wide to long. The listed columns become rows with `key` and `value` columns. |
| `"pivot"` | `{ type: "pivot", index, key, value, op? }` | Long to wide. One row per `index`, one column per distinct `key`. `op` defaults to `"sum"`. |
| `"bin"` | `{ type: "bin", field, step?, bins?, as? }` | Adds `<field>_bin` and `<field>_bin_end` columns, or `as` and `<as>_end`. |
| `"derive"` | `{ type: "derive", as, op, fields, groupBy?, base? }` | Adds a computed column. |
| `"rename"` | `{ type: "rename", fields }` | `fields` maps old names to new names. |
| `"select"` | `{ type: "select", fields }` | Keeps only the listed columns. |
| `"parse"` | `{ type: "parse", fields }` | Coerces columns to `"number"`, `"date"`, `"string"` or `"boolean"`. Number parsing strips commas, `$`, `%` and spaces. |

- Filter ops: `==`, `!=`, `>`, `>=`, `<`, `<=`, `in`, `not-in`, `between` (value is `[min, max]`, inclusive), `contains` (case-insensitive substring), `exists` (pass `value: false` for "is missing").
- Aggregate ops: `sum`, `mean`, `median`, `min`, `max`, `count`, `distinct`, `first`, `last`.
- Derive ops: `add`, `subtract`, `multiply`, `divide` take two fields. `percent-of-total`, `cumulative`, `rank` (1 is the largest), `change`, `percent-change` and `index` take one field and run down the rows in order, restarting within each `groupBy` group. `index` rebases the first row to `base`, 100 by default. A missing operand or a division by zero gives `null`.

## Wide and long data

- Wide: one column per series. Pass several fields: `y={["Solar", "Wind"]}`.
- Long: one row per observation. Pass one `y` and the splitting field: `y="twh" series="source"`.
- Convert with `"fold"` (wide to long) and `"pivot"` (long to wide).

When several charts draw from the same rows, load them once with `InsightData` and omit `data` on the charts inside. See `https://insightcharts.dev/agents/docs/crossfiltering.md`.

## Minimal example

```tsx
import { BarChart } from "insightcharts";

export function GenerationBySource() {
  return (
    <BarChart
      data="/data/energy.csv"
      transform={[
        { type: "filter", field: "year", value: 2024 },
        { type: "aggregate", groupBy: "source", measures: { twh: { op: "sum", field: "twh" } } },
        { type: "sort", by: "twh", order: "desc" },
      ]}
      x="source"
      y="twh"
      format="compact"
      title="Renewable generation by source, 2024"
      subtitle="Electricity generation, TWh, 2024"
      source="Name the source here"
    />
  );
}
```

Replace the plain-label title with the fact and its number once you have read the rows.

## Verify

1. The typecheck passes.
2. The chart shows a skeleton and then the marks. The network tab shows one request per distinct URL.
3. Break the URL once. The chart shows an error message in place of the plot.
4. The values on the chart match a hand check of two or three rows after the transforms.
5. Numbers stored as text ("1,200", "45%") are numeric. If not, add a `"parse"` transform.

## Common mistakes

- Passing a relative URL to `loadData` on the server. It throws. Use an absolute URL or read the file.
- Passing an async function as `data` from a Next.js server component. Load with `loadData` and pass rows.
- Leaving field props on the old column names after `"rename"`, `"fold"`, `"pivot"` or `"aggregate"`.
- Reshaping with custom code in a spec that must stay JSON. Use transform objects.
- Formatting a `percent-of-total` or `percent-change` column with `"percent-raw"`. Both are fractions (0.42), so use `"percent"`.
- Fetching the same file in several charts with different `init` objects, which defeats the shared request.

## Reference

- The long guide on this topic: https://insightcharts.dev/llms/guides/data.md
- This page: https://insightcharts.dev/docs/data
- These instructions as plain text: https://insightcharts.dev/agents/docs/data.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
- Source: https://github.com/insightcharts/insightcharts
