"use client";

import { makeFormatter, type FormatSpec, withMeta, frameStyle, type IconInput } from "insightcharts/core";
import { toNumber, type DataInput, type Transform } from "insightcharts/data";
import { BigNumber, type BigNumberVariant } from "@/components/insightcharts/atoms/big-number";
import { ProgressMeter } from "@/components/insightcharts/atoms/progress-meter";
import { StatTile, type StatTileSurface, type StatTileVariant } from "@/components/insightcharts/atoms/stat-tile";
import { SegmentedBar } from "@/components/insightcharts/atoms/segmented-bar";
import { dataState, MoleculeFooter, Provide, useMolecule, useRows, type MoleculeProps } from "@/components/insightcharts/molecules/_shared";

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
  /** How the headline number is dressed: any `big-number` variant. Default `"plain"`. */
  variant?: BigNumberVariant;
  /** Icon for the headline when `variant` is `"with-icon"`. */
  icon?: IconInput;
  /** Tone of a filled or tinted headline. */
  tone?: "neutral" | "accent" | "positive" | "negative" | number;
  /**
   * How the parts are shown under the bar: `"key"` (a list with values and shares), `"inline"` (one wrapped
   * line of names and shares), `"meters"` (a progress meter per part) or `"tiles"` (a stat tile per part).
   */
  display?: "key" | "inline" | "meters" | "tiles";
  /** The tile display when `display` is `"tiles"`. Default `"progress"`. */
  tileVariant?: StatTileVariant;
  /** The ground of each tile when `display` is `"tiles"`. */
  tileSurface?: StatTileSurface;
  /** `"side"` puts the headline left and the parts right when there is room. Default `"stacked"`. */
  layout?: "stacked" | "side";
  /** Columns for the key, meters or tiles. Default: by width. */
  columns?: number;
  /** Set false to leave out the segmented bar, e.g. when `display` is `"meters"`. Default true. */
  bar?: boolean;
  /** Set false to remove the hairlines between key rows. Default true. */
  dividers?: boolean;
  /** Spacing: `"dense"` or `"roomy"`. */
  density?: "dense" | "default" | "roomy";
  /** Paint a named theme's own background. Default true when `theme` is a theme name. */
  frame?: boolean;
}

// Same cap as segmented-bar: past this it folds the tail into "Other", and so does the key.
const MAX_PARTS = 8;

/**
 * One number and what it is made of: the total set large, a single segmented bar for the
 * composition, and a key that gives every part its value and share.
 */
function MetricBreakdownImpl({ label, data, transform, name, value, total, context, delta, deltaLabel, upIsGood, size = "stat", show = "both", sort = "none", names, format, source, note, variant, icon, tone, display = "key", tileVariant = "progress", tileSurface, layout = "stacked", columns, bar = true, dividers = true, density = "default", frame, className, style, ...rest }: MetricBreakdownProps) {
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
  let parts = [...byKey].map(([key, v], index) => ({ key, label: names?.[key] ?? key, value: v, index, color: tokens.categorical[index % tokens.categorical.length] }));
  if (sort === "desc") parts.sort((a, b) => b.value - a.value);
  if (parts.length > MAX_PARTS) {
    const keep = new Set([...parts].sort((a, b) => b.value - a.value).slice(0, MAX_PARTS - 1).map((p) => p.key));
    const folded = parts.filter((p) => !keep.has(p.key));
    parts = [...parts.filter((p) => keep.has(p.key)), { key: "__other", label: `Other (${folded.length})`, value: folded.reduce((s, p) => s + p.value, 0), index: -1, color: tokens.context }];
  }
  const sum = parts.reduce((s, p) => s + p.value, 0);
  const share = (v: number) => (v / sum < 0.005 ? "<1%" : pct(v / sum));
  const painter = frameStyle(rest.theme, mode, frame);
  const inner = Math.max(0, width - (painter ? 40 : 0));
  const side = layout === "side" && inner >= 600;
  const body = side ? inner * 0.6 : inner;
  const gap = density === "dense" ? 12 : density === "roomy" ? 24 : 16;
  const rowPad = density === "dense" ? 5 : density === "roomy" ? 12 : 8;
  const keyCols = Math.max(1, Math.min(parts.length, columns ?? (display === "tiles" ? Math.max(1, Math.min(4, Math.floor((body + 12) / 172))) : body >= 560 && parts.length > 3 ? 2 : 1)));
  const perCol = Math.ceil(parts.length / keyCols);
  const placeholder = dataState(state, 120);

  const headline = <BigNumber label={label} value={total ?? sum} format={format} context={context} delta={delta} deltaLabel={deltaLabel} upIsGood={upIsGood} size={size} variant={variant} icon={icon} tone={tone} />;

  let detail = null;
  if (display === "tiles") {
    detail = (
      <div data-slot="ic-metric-breakdown-tiles" role="list" style={{ display: "grid", gridTemplateColumns: `repeat(${keyCols}, minmax(0, 1fr))`, gap: density === "dense" ? 8 : 12, marginTop: gap }}>
        {parts.map((p) => (
          <div key={p.key} role="listitem" data-slot="ic-metric-breakdown-part" style={{ minWidth: 0, display: "grid" }}>
            <StatTile label={p.label} value={p.value} format={format} variant={tileVariant} surface={tileSurface} tone={p.index >= 0 ? p.index : "neutral"} size={density === "roomy" ? "md" : "sm"} max={sum} context={sum > 0 && tileVariant !== "progress" ? `${share(p.value)} of the total` : undefined} />
          </div>
        ))}
      </div>
    );
  } else if (display === "meters") {
    detail = (
      <div data-slot="ic-metric-breakdown-meters" role="list" style={{ display: "grid", gridTemplateColumns: `repeat(${keyCols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${perCol}, auto)`, gridAutoFlow: "column", columnGap: 32, rowGap: density === "dense" ? 10 : density === "roomy" ? 20 : 14, marginTop: gap }}>
        {parts.map((p) => (
          <div key={p.key} role="listitem" data-slot="ic-metric-breakdown-part" style={{ minWidth: 0 }}>
            <ProgressMeter label={p.label} value={p.value} max={sum} showMax={false} format={format ?? "auto"} tone={p.index >= 0 ? p.index : "neutral"} size={density === "roomy" ? "md" : "sm"} detail={show !== "value" && sum > 0 ? share(p.value) : undefined} />
          </div>
        ))}
      </div>
    );
  } else if (display === "inline") {
    detail = (
      <ul data-slot="ic-metric-breakdown-key" style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", listStyle: "none", margin: "10px 0 0", padding: 0, fontSize: "0.8125rem", lineHeight: 1.4, color: "var(--_ic-ink-2)" }}>
        {parts.map((p) => (
          <li key={p.key} data-slot="ic-metric-breakdown-part" style={{ display: "inline-flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
            <span aria-hidden style={{ flex: "none", width: 10, height: 10, borderRadius: 2, background: p.color, alignSelf: "center" }} />
            <span>{p.label}</span>
            <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--_ic-ink)", fontWeight: 600 }}>{show === "value" ? fmt(p.value) : share(p.value)}</span>
          </li>
        ))}
      </ul>
    );
  } else {
    detail = (
      // Column-major order: the key reads down, in the order of the segments.
      <dl data-slot="ic-metric-breakdown-key" style={{ display: "grid", gridTemplateColumns: `repeat(${keyCols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${perCol}, auto)`, gridAutoFlow: "column", columnGap: 32, margin: "12px 0 0", padding: 0 }}>
        {parts.map((p, i) => (
          <div key={p.key} data-slot="ic-metric-breakdown-part" style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0, padding: `${rowPad}px 0`, borderTop: dividers && i % perCol ? "1px solid var(--_ic-grid)" : undefined, fontSize: "0.875rem", lineHeight: 1.4 }}>
            <span aria-hidden style={{ flex: "none", width: 10, height: 10, borderRadius: 2, background: p.color, alignSelf: "center" }} />
            <dt style={{ flex: "1 1 auto", minWidth: 0, color: "var(--_ic-ink-2)", overflowWrap: "anywhere" }}>{p.label}</dt>
            <dd style={{ margin: 0, flex: "none", fontVariantNumeric: "tabular-nums", color: "var(--_ic-ink)", fontWeight: 500, whiteSpace: "nowrap" }}>
              {show !== "share" ? fmt(p.value) : null}
              {show !== "value" && sum > 0 ? <span style={show === "both" ? { display: "inline-block", minWidth: "4.5ch", textAlign: "right", color: "var(--_ic-muted)", fontWeight: 400 } : undefined}>{share(p.value)}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  const composition = placeholder ?? (
    <>
      {bar ? (
        <div data-slot="ic-metric-breakdown-bar" style={{ marginTop: side ? 0 : gap, minWidth: 0 }}>
          <SegmentedBar data={state.rows} name={name} value={value} names={names} sort={sort} format={format} legend={false} lazy={false} />
        </div>
      ) : null}
      {detail}
    </>
  );

  return (
    <div ref={ref} data-slot="ic-metric-breakdown" data-ic-mode={mode} data-layout={side ? "side" : "stacked"} className={className} style={{ ...root, ...painter, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        {side ? (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)", columnGap: 40, alignItems: "center" }}>
            <div style={{ minWidth: 0 }}>{headline}</div>
            <div style={{ minWidth: 0 }}>{composition}</div>
          </div>
        ) : (
          <>
            {headline}
            {composition}
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
  composes: ["big-number", "segmented-bar", "progress-meter", "stat-tile"],
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
    { name: "variant", type: '"plain" | "filled" | "tinted" | "with-icon" | "with-ring" | "with-trend"', default: '"plain"', description: "How the headline number is dressed: passed to `big-number`." },
    { name: "icon", type: "IconInput", description: "Icon for the headline when `variant` is `with-icon`." },
    { name: "tone", type: '"neutral" | "accent" | "positive" | "negative" | number', description: "Tone of a filled or tinted headline." },
    { name: "display", type: '"key" | "inline" | "meters" | "tiles"', default: '"key"', description: "How the parts are shown: a list with values and shares, one wrapped line, a `progress-meter` per part scaled to the total, or a `stat-tile` per part." },
    { name: "tileVariant", type: "StatTileVariant", default: '"progress"', description: "The tile display when `display` is `tiles`: `progress`, `ring`, `filled`, `tinted`, `plain`... Each tile gets the part's value, the total as `max` and the part's categorical colour." },
    { name: "tileSurface", type: '"plain" | "borderless" | "filled" | "tinted" | "outline-accent"', description: "The ground of each tile when `display` is `tiles`." },
    { name: "layout", type: '"stacked" | "side"', default: '"stacked"', description: "`side` puts the headline left and the parts right from 600px." },
    { name: "columns", type: "number", description: "Columns for the key, meters or tiles. Default: by width." },
    { name: "bar", type: "boolean", default: "true", description: "Set false to leave out the segmented bar, e.g. with `meters` or `tiles`." },
    { name: "dividers", type: "boolean", default: "true", description: "Hairlines between key rows." },
    { name: "density", type: '"dense" | "default" | "roomy"', default: '"default"', description: "Spacing between the bar, the key rows and the tiles." },
    { name: "frame", type: "boolean", description: "Set false to stop a named theme painting its ground." },
    { name: "theme", type: "ThemeInput", description: 'A theme name such as `"earth"`, or token overrides, passed on to the number and the bar. A named theme paints its own ground.' },
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
