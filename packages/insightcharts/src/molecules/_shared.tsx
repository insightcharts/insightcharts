import { createElement, useEffect, type CSSProperties, type ReactNode } from "react";
import { useInsightStyles } from "../core/figure";
import { formatDate } from "../core/format";
import { useColorMode, type ModeInput } from "../core/mode";
import { frameStyle, InsightProvider, useInsightConfig, useTheme } from "../core/provider";
import { useData, useInsightData, type DataState } from "../core/store";
import { chromeVars, type ThemeInput } from "../core/theme";
import { useContainerWidth } from "../core/use-container-width";
import type { DataInput, Transform } from "../data/types";

// Shared plumbing for the molecules. The leading underscore keeps this file out of the
// generated index; the registry ships it as a helper with each molecule that imports it.

/** Props every molecule accepts. */
export interface MoleculeProps {
  /** A built-in theme name (`"editorial"`, `"ledger"`, `"noir"`...) or a theme object. A named theme with its own surface paints that surface behind the component. */
  theme?: ThemeInput;
  /** Paint the theme's surface behind the component. Default: on when `theme` is a named theme with its own surface. `true` paints the surrounding theme's surface. */
  frame?: boolean;
  /** `"auto"` (default) follows the page, `"system"` follows the OS, or force `"light"` / `"dark"`. */
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

const STYLE_ID = "insightcharts-molecule-styles";
// Hover and focus states cannot be written inline. Everything is keyed on `data-slot`.
const CSS = `
[data-slot=ic-chip],[data-slot=ic-reset],[data-slot=ic-tab]{transition:background-color .15s,color .15s,border-color .15s}
[data-slot=ic-chip]{background:transparent}
[data-slot=ic-chip]:hover{background:color-mix(in srgb,var(--_ic-ink) 7%,transparent)}
[data-slot=ic-reset]:hover{color:var(--_ic-ink)}
[data-slot=ic-tab]:hover,[data-slot=ic-comparison-table-sort]:hover{color:var(--_ic-ink)}
[data-slot=ic-chip]:focus-visible,[data-slot=ic-reset]:focus-visible,[data-slot=ic-tab]:focus-visible,[data-slot=ic-comparison-table-sort]:focus-visible{outline:2px solid var(--_ic-accent);outline-offset:2px}
[data-slot=ic-comparison-table-sort]:focus-visible{outline-offset:-1px}
[data-slot=ic-tabs-list]{scrollbar-width:none}
[data-slot=ic-tabs-list]::-webkit-scrollbar{display:none}
`;

/**
 * Root plumbing: container width, colour mode and the chrome variables, resolved the way
 * `big-number` does it. Spread `root` into the root element's style and attach `ref`.
 */
export function useMolecule<T extends HTMLElement = HTMLDivElement>(props: MoleculeProps) {
  useInsightStyles();
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);
  const config = useInsightConfig();
  const [ref, width] = useContainerWidth<T>();
  const theme = useTheme(props.theme);
  const { mode } = useColorMode(ref, props.mode ?? config.mode);
  const tokens = theme[mode];
  // Only a component that was given the named theme itself paints the ground. Everything nested
  // receives the theme through the provider, with no `theme` prop of its own, so it draws on
  // that ground instead of painting a second card.
  const painted = frameStyle(props.theme, mode, props.frame) ?? (props.frame === true ? { background: tokens.surface, padding: "1.25rem", borderRadius: 12 } : undefined);
  // A percentage padding is measured against the container, so the frame is thinner on a phone without a width feedback loop.
  const root: CSSProperties = { ...(chromeVars(tokens) as CSSProperties), fontFamily: "var(--_ic-font)", color: "var(--_ic-ink)", minWidth: 0, boxSizing: "border-box", ...painted, ...(painted ? { padding: "min(1.25rem, 4.2%)" } : null) };
  return { ref, width, mode, tokens, root, locale: config.locale, painted: painted !== undefined };
}

/** Hands the molecule's `theme` and `mode` to every atom inside it, so nested charts and figures agree. */
export function Provide({ theme, mode, children }: { theme?: ThemeInput; mode?: ModeInput; children: ReactNode }) {
  return (
    <InsightProvider theme={theme} mode={mode}>
      {children}
    </InsightProvider>
  );
}

/** Title and subtitle in the same type as a chart's own, so a molecule reads as one figure. */
export function MoleculeHeader({ title, subtitle, level = 3, id, children }: { title?: string; subtitle?: string; level?: number; id?: string; children?: ReactNode }) {
  if (!title && !subtitle && !children) return null;
  const text =
    title || subtitle ? (
      <div style={{ minWidth: 0, flex: "1 1 16rem" }}>
        {title ? createElement(`h${level}`, { "data-slot": "ic-title", id }, title) : null}
        {subtitle ? <p data-slot="ic-subtitle">{subtitle}</p> : null}
      </div>
    ) : null;
  return (
    <header data-slot="ic-header" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "12px 24px", marginBottom: 16 }}>
      {text}
      {children}
    </header>
  );
}

/** "Source: ... · note", matching the figure chrome. */
export function MoleculeFooter({ source, note }: { source?: string; note?: string }) {
  if (!source && !note) return null;
  return (
    <p data-slot="ic-source" style={{ marginTop: 12, marginBottom: 0 }}>
      {source ? <>Source: {source}</> : null}
      {source && note ? " · " : null}
      {note}
    </p>
  );
}

/** Rows from the `data` prop, or from the surrounding `<InsightData>` (filtered by its selections) when `data` is omitted. */
export function useRows(data: DataInput | undefined, transform?: Transform | Transform[]): DataState {
  const store = useInsightData();
  const shared = data === undefined && store !== null;
  const own = useData(shared ? null : data, shared ? undefined : transform);
  const fromStore = useData(shared ? store!.rowsFor() : null, shared ? transform : undefined);
  return shared ? { rows: fromStore.rows, status: store!.status === "ready" ? fromStore.status : store!.status, error: store!.error ?? fromStore.error } : own;
}

/** Loading, error and empty placeholders in the figure chrome's style. Returns null when there are rows to draw. */
export function dataState(state: DataState, height: number): ReactNode {
  if (state.status === "loading") return <div data-slot="ic-skeleton" role="status" aria-label="Loading" style={{ height }} />;
  if (state.status === "error")
    return (
      <div data-slot="ic-state" role="alert" style={{ minHeight: height }}>
        {state.error?.message ?? "The data could not be loaded."}
      </div>
    );
  if (!state.rows.length)
    return (
      <div data-slot="ic-state" style={{ minHeight: height }}>
        No data to show.
      </div>
    );
  return null;
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}/;

/** A period label for prose: ISO days become "Mar 2024", everything else is shown as written. */
export function periodLabel(value: unknown, locale?: string): string {
  if (value == null) return "";
  // A bare ISO day parses as UTC midnight, which is the previous day (and month) west of Greenwich.
  if (typeof value === "string" && ISO_DAY.test(value)) return formatDate(value.length === 10 ? `${value}T00:00:00` : value, locale, { year: "numeric", month: "short" });
  if (value instanceof Date) return formatDate(value, locale, { year: "numeric", month: "short" });
  return String(value);
}

/** Columns that fit: at most `preferred`, each at least `min` wide, never leaving a single orphan in the last row. */
export function fitColumns(width: number, count: number, preferred: number, min: number, gap = 24): number {
  const fit = Math.max(1, Math.floor((width + gap) / (min + gap)));
  let cols = Math.max(1, Math.min(preferred, fit, count));
  while (cols > 2 && count % cols === 1) cols -= 1;
  return cols;
}
