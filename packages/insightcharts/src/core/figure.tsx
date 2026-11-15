import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { Row } from "../data/types";
import { makeFormatter } from "./format";
import { useColorMode, type ModeInput } from "./mode";
import { useInsightConfig, useTheme, type ExportFormat } from "./provider";
import { chromeVars, type ThemeInput } from "./theme";

const STYLE_ID = "insightcharts-styles";
const CSS = `
@keyframes ic-pulse{0%,100%{opacity:.55}50%{opacity:1}}
[data-slot=ic-figure]{font-family:var(--_ic-font);color:var(--_ic-ink);margin:0;min-width:0;position:relative}
[data-slot=ic-title]{font-family:var(--_ic-font-display);font-size:1.125rem;line-height:1.3;font-weight:650;letter-spacing:-.01em;margin:0;text-wrap:balance;color:var(--_ic-ink)}
[data-slot=ic-subtitle]{font-size:.875rem;line-height:1.45;margin:.25rem 0 0;color:var(--_ic-ink-2);text-wrap:pretty}
[data-slot=ic-legend]{display:flex;flex-wrap:wrap;gap:.25rem 1rem;margin:.625rem 0 0;padding:0;list-style:none;font-size:.8125rem;color:var(--_ic-ink-2)}
[data-slot=ic-legend] li{display:inline-flex;align-items:center;gap:.4rem}
[data-slot=ic-source]{font-size:.75rem;line-height:1.5;margin:.5rem 0 0;color:var(--_ic-muted)}
[data-slot=ic-skeleton]{border-radius:8px;background:color-mix(in srgb,var(--_ic-muted) 14%,transparent);animation:ic-pulse 1.6s ease-in-out infinite}
[data-slot=ic-state]{display:grid;place-items:center;text-align:center;font-size:.875rem;color:var(--_ic-muted);border:1px dashed var(--_ic-grid);border-radius:8px;padding:1rem}
[data-slot=ic-actions]{position:absolute;top:0;right:0;font-size:.75rem;opacity:0;transition:opacity .15s}
[data-slot=ic-figure]:hover [data-slot=ic-actions],[data-slot=ic-actions]:focus-within,[data-slot=ic-actions][open]{opacity:1}
[data-slot=ic-actions] summary{list-style:none;cursor:pointer;padding:.2rem .5rem;border-radius:6px;border:1px solid var(--_ic-grid);background:var(--_ic-surface);color:var(--_ic-ink-2)}
[data-slot=ic-actions] summary::-webkit-details-marker{display:none}
[data-slot=ic-menu]{position:absolute;right:0;top:calc(100% + 4px);z-index:20;display:grid;min-width:7rem;padding:.25rem;border-radius:8px;border:1px solid var(--_ic-grid);background:var(--_ic-surface);box-shadow:0 6px 24px rgba(0,0,0,.12)}
[data-slot=ic-menu] button{all:unset;cursor:pointer;padding:.3rem .5rem;border-radius:5px;color:var(--_ic-ink)}
[data-slot=ic-menu] button:hover,[data-slot=ic-menu] button:focus-visible{background:color-mix(in srgb,var(--_ic-muted) 16%,transparent)}
[data-slot=ic-table]{margin-top:.5rem;font-size:.75rem;color:var(--_ic-ink-2)}
[data-slot=ic-table] summary{cursor:pointer;color:var(--_ic-muted)}
[data-slot=ic-table] div{max-height:16rem;overflow:auto;margin-top:.375rem}
[data-slot=ic-table] table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}
[data-slot=ic-table] th,[data-slot=ic-table] td{text-align:left;padding:.25rem .75rem .25rem 0;border-bottom:1px solid var(--_ic-grid);white-space:nowrap}
[data-slot=ic-table] th{font-weight:600;color:var(--_ic-ink);position:sticky;top:0;background:var(--_ic-surface)}
[data-slot=ic-table] td[data-num],[data-slot=ic-table] th[data-num]{text-align:right}
@media (prefers-reduced-motion:reduce){[data-slot=ic-skeleton]{animation:none}}
`;

/** Inject the small chrome stylesheet once. Everything is keyed on `data-slot`, so it is easy to restyle. */
export function useInsightStyles() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);
}

export interface LegendItem {
  name: string;
  color: string;
  /** Swatch shape: match the mark. Default `"square"`. */
  shape?: "square" | "line" | "dot";
  /** Render as a context (de-emphasised) entry. */
  muted?: boolean;
}

export interface FigureProps {
  /** The title. One plain statement of what the data shows, with the number and the period ("Monthly churn fell from 4.2% to 2.1% in 2024"), or a plain label ("Monthly churn, 2024"). One clause, no figures of speech. */
  title?: string;
  /** What is measured: measure, unit, population, geography, period. */
  subtitle?: string;
  /** Where the data comes from. Rendered as "Source: ...". */
  source?: string;
  /** Method notes and caveats, shown after the source. */
  note?: string;
  legend?: LegendItem[];
  /** Rows for the "View data" table, the screen-reader and exact-value path. */
  tableRows?: Row[];
  table?: boolean;
  exportable?: boolean | ExportFormat[];
  onExport?: (format: ExportFormat) => void;
  status?: "loading" | "ready" | "error" | "empty";
  error?: Error | null;
  /** Height of the loading / empty placeholder. */
  height?: number | string;
  theme?: ThemeInput;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const ALL_FORMATS: ExportFormat[] = ["png", "svg", "pdf", "csv"];

function Swatch({ item }: { item: LegendItem }) {
  const base: CSSProperties = { background: item.color, flex: "none", display: "inline-block" };
  if (item.shape === "line") return <span aria-hidden style={{ ...base, width: 14, height: 2, borderRadius: 1 }} />;
  if (item.shape === "dot") return <span aria-hidden style={{ ...base, width: 8, height: 8, borderRadius: 999 }} />;
  return <span aria-hidden style={{ ...base, width: 10, height: 10, borderRadius: 2 }} />;
}

function DataTable({ rows }: { rows: Row[] }) {
  const columns = Object.keys(rows[0] ?? {});
  const fmt = makeFormatter({ maximumFractionDigits: 2 });
  const numeric = columns.map((c) => rows.slice(0, 20).every((r) => r[c] == null || typeof r[c] === "number"));
  const shown = rows.slice(0, 200);
  return (
    <details data-slot="ic-table">
      <summary>View data</summary>
      <div>
        <table>
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={c} scope="col" data-num={numeric[i] || undefined}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr key={i}>
                {columns.map((c, j) => (
                  <td key={c} data-num={numeric[j] || undefined}>
                    {/* Year-like integers read wrong with thousands separators. */}
                    {typeof r[c] === "number" && !(Number.isInteger(r[c]) && /year/i.test(c)) ? fmt(r[c]) : r[c] instanceof Date ? r[c].toISOString().slice(0, 10) : String(r[c] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > shown.length ? <p>Showing the first {shown.length} of {rows.length} rows. Export CSV for all of them.</p> : null}
      </div>
    </details>
  );
}

/**
 * The frame around a chart: title, subtitle, legend, the chart, then source and
 * notes. It is real HTML, so text is selectable, translatable and read by screen readers,
 * and it is included in image exports. Use it around anything, not only InsightCharts charts.
 */
export function Figure(props: FigureProps) {
  const { title, subtitle, source, note, legend, tableRows, table, onExport, status = "ready", error, height = 360, className, style, children } = props;
  useInsightStyles();
  const config = useInsightConfig();
  const ref = useRef<HTMLElement>(null);
  const theme = useTheme(props.theme);
  const { mode } = useColorMode(ref, props.mode ?? config.mode);
  const exportable = props.exportable ?? config.exportable;
  const formats = exportable === true ? ALL_FORMATS : exportable || [];
  const menu = useRef<HTMLDetailsElement>(null);

  return (
    <figure ref={ref} data-slot="ic-figure" data-ic-mode={mode} className={className} style={{ ...(chromeVars(theme[mode]) as CSSProperties), ...style }}>
      {title || subtitle ? (
        <header data-slot="ic-header" style={formats.length ? { paddingRight: "4.5rem" } : undefined}>
          {title ? <h3 data-slot="ic-title">{title}</h3> : null}
          {subtitle ? <p data-slot="ic-subtitle">{subtitle}</p> : null}
        </header>
      ) : null}
      {legend && legend.length > 1 ? (
        <ul data-slot="ic-legend" aria-label="Legend">
          {legend.map((item) => (
            <li key={item.name} style={item.muted ? { color: "var(--_ic-muted)" } : undefined}>
              <Swatch item={item} />
              {item.name}
            </li>
          ))}
        </ul>
      ) : null}
      <div data-slot="ic-plot" style={{ marginTop: title || subtitle || (legend && legend.length > 1) ? "0.75rem" : 0 }}>
        {status === "loading" ? (
          <div data-slot="ic-skeleton" role="status" aria-label="Loading chart" style={{ height }} />
        ) : status === "error" ? (
          <div data-slot="ic-state" role="alert" style={{ height }}>
            {error?.message ?? "This chart could not load its data."}
          </div>
        ) : status === "empty" ? (
          <div data-slot="ic-state" style={{ height }}>
            No data to show.
          </div>
        ) : (
          children
        )}
      </div>
      {source || note ? (
        <figcaption data-slot="ic-source">
          {source ? <>Source: {source}</> : null}
          {source && note ? " · " : null}
          {note}
        </figcaption>
      ) : null}
      {table && tableRows?.length ? <DataTable rows={tableRows} /> : null}
      {formats.length && status === "ready" ? (
        <details data-slot="ic-actions" ref={menu}>
          <summary aria-label="Export chart">Export</summary>
          <div data-slot="ic-menu" role="menu">
            {formats.map((f) => (
              <button
                key={f}
                type="button"
                role="menuitem"
                onClick={() => {
                  menu.current?.removeAttribute("open");
                  onExport?.(f);
                }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </details>
      ) : null}
    </figure>
  );
}
