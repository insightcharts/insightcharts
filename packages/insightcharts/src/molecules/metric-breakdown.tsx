import { makeFormatter, type FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import { toNumber } from "../data/transform";
import type { DataInput, Transform } from "../data/types";
import { BigNumber } from "../atoms/big-number";
import { SegmentedBar } from "../atoms/segmented-bar";
import { dataState, MoleculeFooter, Provide, useMolecule, useRows, type MoleculeProps } from "./_shared";

export interface MetricBreakdownProps extends MoleculeProps {
  /** What the headline number measures. */
  label: string;
  /** One row per part. Omit inside `<InsightData>`. */
  data?: DataInput;
  transform?: Transform | Transform[];
  /** Field naming each part. */
  name: string;
  /** Field with each part's value. */
  value: string;
  /** The headline number. Default: the sum of the parts. */
  total?: number | string;
  /** The line under the headline number. */
  context?: string;
  /** Change in the headline number. Numbers render as signed percentages. */
  delta?: number | string;
  deltaLabel?: string;
  upIsGood?: boolean;
  /** `"hero"` when this opens a piece. */
  size?: "hero" | "stat";
  /** What the list prints beside each part: its value, its share, or both. */
  show?: "both" | "value" | "share";
  /** Order parts by size. Default: data order. */
  sort?: "none" | "desc";
  /** Display names for part keys. */
  names?: Record<string, string>;
  format?: FormatSpec;
  source?: string;
  note?: string;
}

// Same cap as segmented-bar: past this it folds the tail into "Other", and so does the key.
const MAX_PARTS = 8;

/**
 * One number and what it is made of: the total set large, a single segmented bar for the
 * composition, and a key that gives every part its value and share.
 */
function MetricBreakdownImpl({ label, data, transform, name, value, total, context, delta, deltaLabel, upIsGood, size = "stat", show = "both", sort = "none", names, format, source, note, className, style, ...rest }: MetricBreakdownProps) {
  const { ref, width, mode, tokens, root, locale } = useMolecule(rest);
  const state = useRows(data, transform);
  const fmt = makeFormatter(format, locale);
  const pct = makeFormatter({ style: "percent", maximumFractionDigits: 0 }, locale);

  // Mirrors segmented-bar's grouping so the key's swatches match its segments.
  const byKey = new Map<string, number>();
  for (const r of state.rows) {
    const v = toNumber(r[value]);
    if (!Number.isNaN(v) && v > 0) byKey.set(String(r[name] ?? ""), (byKey.get(String(r[name] ?? "")) ?? 0) + v);
  }
  let parts = [...byKey].map(([key, v], index) => ({ key, label: names?.[key] ?? key, value: v, color: tokens.categorical[index % tokens.categorical.length] }));
  if (sort === "desc") parts.sort((a, b) => b.value - a.value);
  if (parts.length > MAX_PARTS) {
    const keep = new Set([...parts].sort((a, b) => b.value - a.value).slice(0, MAX_PARTS - 1).map((p) => p.key));
    const folded = parts.filter((p) => !keep.has(p.key));
    parts = [...parts.filter((p) => keep.has(p.key)), { key: "__other", label: `Other (${folded.length})`, value: folded.reduce((s, p) => s + p.value, 0), color: tokens.context }];
  }
  const sum = parts.reduce((s, p) => s + p.value, 0);
  const cols = width >= 560 && parts.length > 3 ? 2 : 1;
  const perCol = Math.ceil(parts.length / cols);
  const placeholder = dataState(state, 120);

  return (
    <div ref={ref} data-slot="ic-metric-breakdown" data-ic-mode={mode} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <BigNumber label={label} value={total ?? sum} format={format} context={context} delta={delta} deltaLabel={deltaLabel} upIsGood={upIsGood} size={size} />
        {placeholder ?? (
          <>
            <div data-slot="ic-metric-breakdown-bar" style={{ marginTop: 16, minWidth: 0 }}>
              <SegmentedBar data={state.rows} name={name} value={value} names={names} sort={sort} format={format} legend={false} lazy={false} />
            </div>
            {/* Column-major order: the key reads down, in the order of the segments. */}
            <dl data-slot="ic-metric-breakdown-key" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${perCol}, auto)`, gridAutoFlow: "column", columnGap: 32, margin: "12px 0 0", padding: 0 }}>
              {parts.map((p, i) => (
                <div key={p.key} data-slot="ic-metric-breakdown-part" style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0, padding: "8px 0", borderTop: i % perCol ? "1px solid var(--_ic-grid)" : undefined, fontSize: "0.875rem", lineHeight: 1.4 }}>
                  <span aria-hidden style={{ flex: "none", width: 10, height: 10, borderRadius: 2, background: p.color, alignSelf: "center" }} />
                  <dt style={{ flex: "1 1 auto", minWidth: 0, color: "var(--_ic-ink-2)", overflowWrap: "anywhere" }}>{p.label}</dt>
                  <dd style={{ margin: 0, flex: "none", fontVariantNumeric: "tabular-nums", color: "var(--_ic-ink)", fontWeight: 500, whiteSpace: "nowrap" }}>
                    {show !== "share" ? fmt(p.value) : null}
                    {show !== "value" && sum > 0 ? <span style={show === "both" ? { display: "inline-block", minWidth: "4.5ch", textAlign: "right", color: "var(--_ic-muted)", fontWeight: 400 } : undefined}>{p.value / sum < 0.005 ? "<1%" : pct(p.value / sum)}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

export const MetricBreakdown = withMeta(MetricBreakdownImpl, {
  name: "metric-breakdown",
  component: "MetricBreakdown",
  title: "Metric breakdown",
  level: "molecule",
  category: "layout",
  description: "A headline number with its composition underneath: one segmented bar and a key giving each part's value and share.",
  whenToUse: "A total that the reader will immediately want split: a budget by department, revenue by product line, emissions by sector. Two to six parts that add up to the number above them.",
  avoid: "Parts that do not sum to the headline; more than about six parts (use `bar-chart`); composition compared across groups or over time (use `bar-chart` with `stack: \"percent\"` or `area-chart`).",
  composes: ["big-number", "segmented-bar"],
  props: [
    { name: "label", type: "string", required: true, description: "What the headline number measures." },
    { name: "data", type: "DataInput", description: "One row per part. Omit inside `<InsightData>`." },
    { name: "transform", type: "Transform | Transform[]", description: "Applied before the parts are summed." },
    { name: "name", type: "string", required: true, description: "Field naming each part." },
    { name: "value", type: "string", required: true, description: "Field with each part's value." },
    { name: "total", type: "number | string", description: "The headline number. Default: the sum of the parts." },
    { name: "context", type: "string", description: "The line under the headline number." },
    { name: "delta", type: "number | string", description: "Change in the headline number. Numbers render as signed percentages." },
    { name: "deltaLabel", type: "string", description: "What the delta is against." },
    { name: "upIsGood", type: "boolean", default: "true", description: "Whether an increase is good news." },
    { name: "size", type: '"hero" | "stat"', default: '"stat"', description: "`hero` when this opens a piece." },
    { name: "show", type: '"both" | "value" | "share"', default: '"both"', description: "What the key prints beside each part." },
    { name: "sort", type: '"none" | "desc"', default: '"none"', description: "Order parts by size; the bar and the key follow." },
    { name: "names", type: "Record<string, string>", description: "Display names for part keys." },
    { name: "format", type: "FormatSpec", default: '"auto"', description: "Number format for the headline and the parts." },
    { name: "source", type: "string", description: 'Shown underneath as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: "Theme override, passed on to the number and the bar." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "metric-breakdown",
    label: "Greenhouse gas emissions, EU-27, 2022",
    context: "Million tonnes of CO2 equivalent. 31% below the 1990 level.",
    data: [
      { sector: "Energy supply", mt: 862 },
      { sector: "Transport", mt: 804 },
      { sector: "Industry", mt: 701 },
      { sector: "Buildings", mt: 437 },
      { sector: "Agriculture", mt: 378 },
      { sector: "Waste", mt: 109 },
    ],
    name: "sector",
    value: "mt",
    format: "integer",
    source: "European Environment Agency",
    note: "Rounded, approximate figures for illustration",
  },
});

export const examples = {
  "Three parts, shares only": {
    label: "Monthly recurring revenue",
    delta: 0.064,
    deltaLabel: "vs September",
    data: [
      { plan: "Enterprise", mrr: 318000 },
      { plan: "Team", mrr: 201000 },
      { plan: "Starter", mrr: 70000 },
    ],
    name: "plan",
    value: "mrr",
    format: "currency:USD",
    show: "share",
    note: "Illustrative data",
    style: { maxWidth: 420 },
  },
  "Hero, sorted": {
    size: "hero",
    sort: "desc",
    label: "Seats in the House of Commons, 2024",
    data: [
      { party: "Conservative", seats: 121 },
      { party: "Labour", seats: 411 },
      { party: "Liberal Democrat", seats: 72 },
      { party: "SNP", seats: 9 },
      { party: "Others", seats: 37 },
    ],
    name: "party",
    value: "seats",
    source: "House of Commons Library",
    note: "Figures are approximate, for illustration",
  },
};
