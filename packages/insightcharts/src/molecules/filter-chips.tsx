import { useState } from "react";
import { makeFormatter } from "../core/format";
import { withMeta } from "../core/meta";
import { useInsightData, type Selection } from "../core/store";
import { periodLabel, useMolecule, type MoleculeProps } from "./_shared";

export interface FilterChipsProps extends MoleculeProps {
  /**
   * Selections to show when there is no surrounding `<InsightData>`, keyed by the chart that
   * made them. With `onSelectionsChange` the chips are controlled; without it they keep their own state.
   */
  selections?: Record<string, Selection>;
  onSelectionsChange?: (selections: Record<string, Selection>) => void;
  /** Display names for field names, e.g. `{ region: "Region" }`. */
  labels?: Record<string, string>;
  /** Shown while nothing is selected, e.g. "Click a bar to filter". Also keeps the line's height stable. */
  hint?: string;
  /** Text of the clear-all control. */
  resetLabel?: string;
  /** Show "1,204 of 5,000 rows" after the chips. */
  count?: boolean;
  /** Noun for the count, e.g. "orders". */
  unit?: string;
}

const button = { appearance: "none", font: "inherit", cursor: "pointer", margin: 0 } as const;

function Cross() {
  return (
    <svg aria-hidden viewBox="0 0 10 10" width={8} height={8} style={{ flex: "none", display: "block" }}>
      <path d="m1.5 1.5 7 7m0-7-7 7" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

/**
 * The active crossfilter selections of the surrounding `<InsightData>`, as removable
 * chips with a reset. It makes the filter state visible, which a highlighted bar alone does not.
 */
function FilterChipsImpl({ selections, onSelectionsChange, labels, hint, resetLabel = "Reset", count = false, unit = "rows", className, style, ...rest }: FilterChipsProps) {
  const { ref, mode, root, locale } = useMolecule(rest);
  const store = useInsightData();
  const [own, setOwn] = useState(selections ?? {});
  const standalone = !store || selections !== undefined;
  const current = standalone ? (onSelectionsChange ? selections ?? {} : own) : store.selections;
  const commit = (next: Record<string, Selection>) => {
    setOwn(next);
    onSelectionsChange?.(next);
  };
  const select = (owner: string, selection: Selection | null) => {
    if (!standalone) return store.select(owner, selection);
    const next = { ...current };
    if (selection) next[owner] = selection;
    else delete next[owner];
    commit(next);
  };
  const clear = () => (standalone ? commit({}) : store.clear());

  const chips = Object.entries(current).flatMap(([owner, sel]) => {
    const field = labels?.[sel.field] ?? sel.field;
    if (sel.range) return [{ owner, key: `${owner}:range`, field, text: `${periodLabel(sel.range[0], locale)} – ${periodLabel(sel.range[1], locale)}`, without: null as Selection | null }];
    return (sel.values ?? []).map((v) => {
      const remaining = (sel.values ?? []).filter((x) => x !== v);
      return { owner, key: `${owner}:${v}`, field, text: v, without: remaining.length ? { ...sel, values: remaining } : null };
    });
  });
  const active = chips.length > 0;
  const int = makeFormatter("integer", locale);
  const shown = store ? store.rowsFor().length : 0;
  const all = store ? store.all.length : 0;
  const counted = count && !!store;
  if (!store && selections === undefined) return null;

  return (
    <div ref={ref} role="group" aria-label="Active filters" data-slot="ic-filter-chips" data-ic-mode={mode} data-active={active || undefined} className={className} style={{ ...root, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, minHeight: 28, fontSize: "0.8125rem", lineHeight: 1.4, ...style }}>
      {active ? (
        <>
          <span data-slot="ic-filter-chips-label" style={{ color: "var(--_ic-muted)" }}>
            Filtered by
          </span>
          {chips.map((c) => (
            <button key={c.key} type="button" data-slot="ic-chip" aria-label={`Remove filter ${c.field}: ${c.text}`} onClick={() => select(c.owner, c.without)} style={{ ...button, display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 8px 0 10px", borderRadius: 999, border: "1px solid var(--_ic-grid)", color: "var(--_ic-ink)", maxWidth: "100%" }}>
              <span style={{ color: "var(--_ic-muted)" }}>{c.field}</span>
              <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.text}</span>
              <span style={{ color: "var(--_ic-muted)", display: "inline-flex" }}>
                <Cross />
              </span>
            </button>
          ))}
          <button type="button" data-slot="ic-reset" onClick={clear} style={{ ...button, padding: "4px 6px", border: 0, borderRadius: 6, background: "none", color: "var(--_ic-ink-2)", textDecoration: "underline", textDecorationColor: "var(--_ic-axis)", textUnderlineOffset: "0.2em" }}>
            {resetLabel}
          </button>
        </>
      ) : hint ? (
        <span data-slot="ic-filter-chips-hint" style={{ color: "var(--_ic-muted)" }}>
          {hint}
        </span>
      ) : null}
      {/* With `count`, a polite live region: a screen-reader user hears that a click filtered something. Without it nothing is rendered or announced. */}
      {counted ? (
        <span data-slot="ic-filter-chips-count" role="status" style={{ marginLeft: "auto", color: "var(--_ic-muted)", fontVariantNumeric: "tabular-nums" }}>
          {active ? `${int(shown)} of ${int(all)} ${unit}` : all ? `${int(all)} ${unit}` : ""}
        </span>
      ) : null}
    </div>
  );
}

export const FilterChips = withMeta(FilterChipsImpl, {
  name: "filter-chips",
  component: "FilterChips",
  title: "Filter chips",
  level: "molecule",
  category: "layout",
  description: "The active crossfilter selections of the surrounding `InsightData`, shown as removable chips with a reset control.",
  whenToUse: "Inside any `<InsightData>` whose charts use `select`: put it above the charts so readers can see what is filtered, drop one value, or clear everything. `linked-charts` already includes it.",
  avoid: "Outside `<InsightData>` it renders nothing unless you pass `selections` yourself. It is not a filter builder: selections are made by clicking marks in the charts.",
  composes: [],
  props: [
    { name: "selections", type: "Record<string, { field, values?, range? }>", description: "Selections to show when there is no surrounding `<InsightData>` (or to override it), keyed by owner. Uncontrolled unless `onSelectionsChange` is given." },
    { name: "onSelectionsChange", type: "(selections) => void", description: "Called when a chip is removed or the reset is pressed; makes `selections` controlled." },
    { name: "labels", type: "Record<string, string>", description: "Display names for field names, e.g. `{ region: \"Region\" }`." },
    { name: "hint", type: "string", description: 'Shown while nothing is selected, e.g. "Click a bar to filter".' },
    { name: "resetLabel", type: "string", default: '"Reset"', description: "Text of the clear-all control." },
    { name: "count", type: "boolean", default: "false", description: 'Show "1,204 of 5,000 rows" at the end of the line.' },
    { name: "unit", type: "string", default: '"rows"', description: 'Noun for the count, e.g. "orders".' },
    { name: "theme", type: "ThemeInput", description: "A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object. A named theme with its own surface paints that surface behind the component." },
    { name: "frame", type: "boolean", description: "Paint the theme's surface behind the component. Default: on for a named theme with its own surface." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "filter-chips",
    labels: { region: "Region", source: "Source", year: "Year" },
    selections: {
      "by-region": { field: "region", values: ["Asia", "Europe"] },
      "by-source": { field: "source", values: ["Solar"] },
      "by-year": { field: "year", range: [2020, 2024] },
    },
  },
});

export const examples = {
  "Nothing selected, with a hint, earth theme": { theme: "earth", selections: {}, hint: "Click a bar to filter" },
  "A date range and two values, blueprint theme": {
    theme: "blueprint",
    labels: { month: "Month", line: "Line" },
    resetLabel: "Clear all",
    selections: {
      "by-month": { field: "month", range: ["2024-03-01", "2024-09-01"] },
      "by-line": { field: "line", values: ["Northern", "Circle"] },
    },
  },
  "One value, ledger theme": { theme: "ledger", labels: { plan: "Plan" }, selections: { "by-plan": { field: "plan", values: ["Enterprise"] } } },
};
