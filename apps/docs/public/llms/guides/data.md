# Data

Charts work on an array of plain row objects. The `data` prop accepts many shapes and normalises them to rows; `transform` then reshapes those rows. Both are JSON-serialisable, so a whole pipeline can live in a spec.

## Accepted `data` shapes

| Shape | Example | Notes |
|---|---|---|
| Row objects | `[{ year: 2020, value: 1 }]` | The native form. |
| Array of arrays | `[["year", "value"], [2020, 1]]` | The first array is the header. |
| Array of primitives | `[3, 5, 8]` | Becomes `{ index, value }` rows. |
| Columnar object | `{ year: [2020, 2021], value: [1, 2] }` | Every value must be an array or typed array. |
| Table object | Apache Arrow table, DuckDB result, Arquero table | Anything with `toArray()`. Rows with `toJSON()` are converted. |
| API envelope | `{ data: [...] }` | An array under `data`, `rows`, `results`, `items` or `records` is found automatically. |
| CSV text | `"year,value\n2020,1"` | Any string that is not a URL. Delimiter is detected from `,` tab `;` and the pipe character. |
| URL string | `"/data/energy.csv"` | A single-line string with no comma that starts with `http://`, `https://`, `/`, `./`, `../` or `data:`. |
| Remote source | `{ url, format, path, init, refresh }` | `format`: `csv`, `tsv`, `json`, `ndjson` (otherwise inferred from the extension, then the content type, then the content). `path`: dot path to the rows inside a JSON response, e.g. `"data.results"`. `init`: passed to `fetch`. `refresh`: re-fetch interval in ms. |
| Inline CSV | `{ csv: "...", delimiter: ";" }` | |
| Inline JSON | `{ json: anything, path: "a.b" }` | |
| Function or promise | `() => fetchRows()` or a `Promise` | Resolves to any shape above. Not JSON; client components only. |

Omit `data` on a chart inside `<InsightData>` and it reads the shared rows.

If no row array can be found, the chart shows an error telling you to pass `path`.

### CSV type inference

CSV cells are converted: numbers (including `1,234` thousands separators), `true`/`false`, and `42%` (becomes `0.42`). Empty cells, `NA`, `N/A`, `null` and `NaN` become `null`. Values with a leading zero (`007`, zip codes) stay strings. Dates stay strings; ISO date strings (`2024-03-01`, `2024-03`) are recognised by charts as temporal. Use the `parse` transform to force a type.

### Loading behaviour

- In-memory data resolves synchronously: no loading flash.
- URLs, functions and promises load asynchronously; the chart shows a skeleton, then the chart, or an error message with the HTTP status.
- URL loads are de-duplicated and cached for the page's lifetime, unless the source has `init` or `refresh`.
- Inline literals written in JSX are compared by content, so `data={[...]}` does not reload on every render. Arrays over 500 rows are compared by identity: keep a stable reference (a module constant or `useMemo`).

On the server, or anywhere outside React:

```ts
import { loadData, transformRows, parseCsv } from "insightcharts/data";

const rows = transformRows(await loadData({ url: "https://example.com/api", path: "data.results" }), [
  { type: "filter", field: "year", op: ">=", value: 2015 },
]);
```

## Wide and long data

Charts with `x`, `y` and `series` accept both layouts:

```tsx
// Wide: one column per series
<LineChart data={[{ year: "2022", solar: 4.6, wind: 7.3 }]} x="year" y={["solar", "wind"]} />

// Long: one row per series per x
<LineChart data={[{ year: "2022", source: "solar", share: 4.6 }, { year: "2022", source: "wind", share: 7.3 }]} x="year" y="share" series="source" />
```

In wide data the series keys are the field names (`"solar"`); in long data they are the values of the `series` field. Those keys are what `highlight` and `names` refer to.

## Transforms

`transform` takes one transform or an array applied in order. Each is a JSON object with a `type`; a function `(rows) => rows` is also accepted in JSX.

| Transform | Fields | What it does |
|---|---|---|
| `"filter"` | `field`, `op` (default `==`), `value` | Keep rows that match. |
| `"aggregate"` | `groupBy` (field or fields, optional), `measures: { name: { op, field } }` | One row per group. Omit `field` for `count`. |
| `"sort"` | `by`, `order` (`"asc"` default, or `"desc"`) | |
| `"limit"` | `n`, `offset` | Slice. |
| `"top"` | `n`, `by`, `other`, `label` | Keep the top `n` rows by `by`. To fold the rest into one row, pass both `other` (the text, e.g. `"Other"`) and `label` (the field that text goes in); the folded row's `by` value is the sum. |
| `"fold"` | `fields`, `key` (default `"key"`), `value` (default `"value"`) | Wide to long. |
| `"pivot"` | `index`, `key`, `value`, `op` (default `sum`) | Long to wide: one row per `index`, one column per distinct `key`. |
| `"bin"` | `field`, `step` or `bins`, `as` (default `<field>_bin`) | Adds the bin start as `as` and the bin end as `<as>_end`. |
| `"derive"` | `as`, `op`, `fields`, `groupBy`, `base` | Adds a computed column; see below. |
| `"rename"` | `fields: { old: "new" }` | |
| `"select"` | `fields` | Keep only these columns. |
| `"parse"` | `fields: { name: "number" \| "date" \| "string" \| "boolean" }` | Coerce types. `number` strips `,`, `$`, `%` and spaces. |

Filter ops: `==`, `!=`, `>`, `>=`, `<`, `<=`, `in` (value is an array), `not-in`, `between` (value is `[low, high]`, inclusive), `contains` (case-insensitive substring), `exists` (non-null and non-empty; pass `value: false` to invert).

Aggregate ops: `sum`, `mean`, `median`, `min`, `max`, `count`, `distinct`, `first`, `last`.

Derive ops:

- Arithmetic on two fields: `add`, `subtract`, `multiply`, `divide` (`fields: ["a", "b"]`).
- Running, on one field in row order, restarting per `groupBy` group: `percent-of-total`, `cumulative`, `rank` (1 is the largest), `change` (difference from the previous row), `percent-change`, `index` (rebased so the first row equals `base`, default 100).

### Examples

Top five plus "Other":

```json
[
  { "type": "aggregate", "groupBy": "category", "measures": { "revenue": { "op": "sum", "field": "amount" } } },
  { "type": "top", "n": 5, "by": "revenue", "other": "Other", "label": "category" }
]
```

Index several series to 100 at the start so growth is comparable (say "Indexed, 2019 = 100" in the subtitle):

```json
{ "type": "derive", "as": "indexed", "op": "index", "fields": ["value"], "groupBy": "country" }
```

Wide to long:

```json
{ "type": "fold", "fields": ["solar", "wind"], "key": "source", "value": "share" }
```

## Order of operations

Standalone chart: load `data`, then the chart's `transform`.

Inside `<InsightData>`: load the shared `data`, apply the store's `transform`, filter by the other charts' selections, then apply the chart's own `transform`.
