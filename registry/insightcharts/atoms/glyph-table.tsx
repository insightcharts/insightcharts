"use client";

import { type CSSProperties, type ReactNode, useMemo, useState } from "react";
import { measureText, cssFallback, useInsightStyles, makeFormatter, type FormatSpec, resolveIcon, type IconInput, withMeta, useColorMode, type ModeInput, frameStyle, useInsightConfig, useTheme, chromeVars, type ThemeInput, useContainerWidth } from "insightcharts/core";
import { niceStep, toNumber, type Row } from "insightcharts/data";
import { _posterPalette } from "@/components/insightcharts/atoms/_poster-colors";

export type GlyphTableGlyph = "dots" | "blocks" | "ring" | "circle" | "bar" | "icons" | "text";

export interface GlyphTableColumn {
  /** Field name in the rows. */
  field: string;
  /** Column heading. Defaults to the field name. */
  label?: string;
  /** The form that encodes the number. Default `"text"`. */
  glyph?: GlyphTableGlyph;
  /** For `dots`, `blocks` and `icons`: what one glyph stands for. Default 1, raised to a round number when the largest value would not fit; the heading states it. */
  unit?: number;
  /** How to print the value beside the glyph. */
  format?: FormatSpec;
  /** For `ring`, `circle` and `bar`: the value that fills the glyph. Default: 100 for rings (1 when every value is at most 1), the column's largest value otherwise. */
  max?: number;
  /** For `icons`: a built-in icon name or a `path://` string. Default `"person"`. */
  icon?: IconInput;
}

export interface GlyphTableProps {
  /** One object per entity. */
  rows: Row[];
  /** Field holding the entity name. Defaults to the first key of the first row. */
  name?: string;
  /** Heading of the name column. */
  nameLabel?: string;
  /** The glyph columns, in order. */
  columns: GlyphTableColumn[];
  /** Entity names in display order; it also assigns colours. Entities not listed follow in data order. Give curve-rank the same list to match colours. */
  order?: string[];
  /** Entities to draw in colour; every other row turns grey. */
  highlight?: string | string[];
  /** `"series"`: one colour per entity; past the size of the theme's palette the extra colours are derived from the theme's own (curve-rank derives the same ones). `"none"`: every row in the accent. Default: series while the rows fit the palette (at most 8), none beyond. */
  colorBy?: "series" | "none";
  /** The table's title: a plain label, or one fact with its number. Rendered as a real `<caption>`. */
  caption?: string;
  /** A line under the caption: measures, units, period. */
  subtitle?: string;
  /** Where the data comes from, shown as "Source: ...". */
  source?: string;
  /** Method notes or caveats. */
  note?: string;
  /** Let readers click a row to select it; the other rows fade. */
  select?: boolean;
  /** Called with the selected entity names whenever the selection changes. */
  onSelect?: (values: string[]) => void;
  /** Controlled selection: the entity names currently selected. When given, the table shows exactly this selection and a click only calls `onSelect`; omit it to let the table keep its own. */
  selected?: string[];
  /** A built-in theme name or a theme object. A named theme paints its own background behind the block. */
  theme?: ThemeInput;
  /** Paint the named theme's background behind the block. Default: on for a named theme with its own surface. */
  frame?: boolean;
  mode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

const VALUE_SIZE = 17;
const WEIGHT: Record<GlyphTableGlyph, number> = { dots: 1.6, blocks: 1.6, icons: 1.6, bar: 1.3, ring: 0.85, circle: 0.85, text: 0.7 };
const NOUN: Record<string, string> = { dots: "dot", blocks: "square", icons: "icon" };
const isCount = (g: GlyphTableGlyph) => g === "dots" || g === "blocks" || g === "icons";
const hidden: CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" };

/** Repeated unit marks, wrapping onto further lines. A fractional last mark is drawn as a ghost with the counted part filled. */
function _Units({ count, perLine, cell, gap, color, draw }: { count: number; perLine: number; cell: { w: number; h: number }; gap: number; color: string; draw: (x: number, y: number, key: string, opacity?: number) => ReactNode }) {
  const full = Math.floor(count + 1e-9);
  const frac = count - full;
  const total = full + (frac > 0.02 ? 1 : 0);
  const per = Math.max(1, perLine);
  const lines = Math.max(1, Math.ceil(total / per));
  const px = cell.w + gap;
  const py = cell.h + gap;
  const at = (k: number) => ({ x: (k % per) * px, y: Math.floor(k / per) * py });
  const marks: ReactNode[] = [];
  for (let k = 0; k < full; k++) marks.push(draw(at(k).x, at(k).y, `u${k}`));
  if (frac > 0.02) {
    const p = at(full);
    marks.push(draw(p.x, p.y, "ghost", 0.28));
    marks.push(
      <svg key="part" x={p.x} y={p.y} width={Math.max(1, cell.w * frac)} height={cell.h} style={{ overflow: "hidden" }}>
        {draw(0, 0, "part-mark")}
      </svg>,
    );
  }
  return (
    <svg data-slot="ic-glyph-table-glyph" aria-hidden width={Math.max(1, Math.min(total, per) * px - gap)} height={lines * py - gap} style={{ flex: "none", display: "block", fill: color, overflow: "visible" }}>
      {marks}
    </svg>
  );
}

/**
 * The poster table: one row per entity, each number drawn as a small counted or sized form with
 * the value printed beside it. Assistive technology reads it as an ordinary table of values.
 */
function GlyphTableImpl({ rows, name, nameLabel, columns, order, highlight, colorBy, caption, subtitle, source, note, select, onSelect, selected, className, style, ...rest }: GlyphTableProps) {
  useInsightStyles();
  const config = useInsightConfig();
  const [ref, width] = useContainerWidth<HTMLDivElement>(720);
  const theme = useTheme(rest.theme);
  const { mode } = useColorMode(ref, rest.mode ?? config.mode);
  const tokens = theme[mode];
  const data = Array.isArray(rows) ? rows : [];
  const cols = Array.isArray(columns) ? columns : [];
  const nameField = name ?? Object.keys(data[0] ?? {})[0] ?? "name";

  // Row order and colour both follow `order`, so a chart beside the table can be given the same list.
  const orderKey = JSON.stringify(order ?? null);
  const sorted = useMemo(() => {
    const rank = (r: Row) => {
      const at = order ? order.indexOf(String(r[nameField] ?? "")) : -1;
      return at === -1 ? Infinity : at;
    };
    return data.map((r, i) => ({ r, i })).sort((a, b) => rank(a.r) - rank(b.r) || a.i - b.i).map((d) => d.r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, orderKey, nameField]);
  const keys = sorted.map((r) => String(r[nameField] ?? ""));
  const marked = highlight == null ? [] : Array.isArray(highlight) ? highlight.map(String) : [String(highlight)];
  // Identity colours are never cycled: a small poster palette may hold only 4 or 5.
  const hues = Math.min(8, tokens.categorical.length);
  // An explicit `colorBy: "series"` past the palette size takes further steps derived from the theme's own colours.
  const derived = colorBy === "series" && sorted.length > hues ? _posterPalette(tokens, sorted.length) : null;
  const bySeries = derived != null || (colorBy ?? (sorted.length <= hues ? "series" : "none")) === "series";
  const palette = tokens.categorical;
  const colorOf = (key: string, i: number) => {
    if (marked.length) {
      const at = marked.indexOf(key);
      return at === -1 ? tokens.context : at === 0 ? tokens.accent : palette[at % palette.length];
    }
    return derived ? derived[i] : bySeries ? palette[i % palette.length] : tokens.accent;
  };

  const [hovered, setHovered] = useState<string | null>(null);
  const [own, setPicked] = useState<string[]>([]);
  // Controlled when `selected` is given: the parent owns the list and this component only reports clicks.
  const picked = Array.isArray(selected) ? selected.map(String) : own;
  const toggle = (key: string) => {
    if (!select) return;
    const next = picked.includes(key) ? picked.filter((k) => k !== key) : [...picked, key];
    if (!Array.isArray(selected)) setPicked(next);
    onSelect?.(next);
  };
  const faded = (key: string) => (picked.length ? !picked.includes(key) : hovered != null && hovered !== key);

  // Layout: the name column takes what the longest name needs, the rest is shared by glyph weight.
  const W = Math.max(240, width);
  const nameW = Math.round(Math.min(200, Math.max(108, W * 0.2)));
  const weights = cols.map((c) => WEIGHT[c.glyph ?? "text"] ?? 1);
  const weightSum = weights.reduce((s, w) => s + w, 0) || 1;
  const padL = 14;
  const padR = 10;
  const tableColW = cols.map((_c, i) => ((W - nameW) * weights[i]) / weightSum);
  const stacked = W < 560 || tableColW.some((w, i) => w < (isCount(cols[i].glyph ?? "text") ? 150 : 84));
  const cardLabelW = Math.round(Math.min(150, W * 0.36));

  // The face the values are printed in, for measuring. The token may be a `var(--x, stack)`, which a canvas
  // cannot read: take the computed stack once mounted, and the literal fallback before that.
  const node = ref.current;
  const computed = node && typeof getComputedStyle === "function" ? getComputedStyle(node).getPropertyValue("--_ic-font-display").trim() : "";
  const literal = cssFallback(tokens.displayFamily ?? tokens.fontFamily);
  const valueFont = computed && !computed.includes("var(") ? computed : !literal || literal === "inherit" ? "sans-serif" : literal;

  const specs = cols.map((c, ci) => {
    const glyph: GlyphTableGlyph = c.glyph ?? "text";
    const fmt = makeFormatter(c.format, config.locale);
    const values = sorted.map((r) => {
      const v = r[c.field];
      const n = v == null || v === "" ? NaN : toNumber(v);
      return Number.isNaN(n) ? null : n;
    });
    const present = values.filter((v): v is number => v != null);
    const top = Math.max(0, ...present);
    const texts = values.map((v) => (v == null ? "" : fmt(v)));
    // Measured in the display face at the printed size; tabular figures are at most as wide as the widest digit, so a little slack covers them.
    const valueW = Math.ceil(Math.max(VALUE_SIZE, ...texts.map((s) => measureText(s, VALUE_SIZE, valueFont, 300)))) + 3;
    const colW = stacked ? W - cardLabelW - 12 : tableColW[ci] - padL - padR;
    const glyphW = Math.max(24, colW - valueW - 10);
    const cell = glyph === "icons" ? { w: 15 * resolveIcon(c.icon, "person").aspect, h: 15 } : glyph === "blocks" ? { w: 9, h: 9 } : { w: 8, h: 8 };
    const gap = glyph === "blocks" ? 2 : 3;
    const perLine = Math.max(1, Math.floor((glyphW + gap) / (cell.w + gap)));
    // Counted glyphs keep to three lines: past that one mark stands for a round number, stated in the heading.
    const capacity = perLine * (glyph === "icons" ? 2 : 3);
    let unit = c.unit && c.unit > 0 ? c.unit : 1;
    if (isCount(glyph) && top / unit > capacity) {
      unit = niceStep(top / capacity);
      if (top / unit > capacity) unit = niceStep(unit * 1.01 * (top / unit / capacity));
    }
    const max = c.max ?? (glyph === "ring" ? (top <= 1 ? 1 : 100) : top || 1);
    const key = isCount(glyph) ? `1 ${NOUN[glyph]} = ${fmt(unit)}` : glyph === "ring" ? `ring = ${fmt(max)}` : glyph === "circle" ? "area" : "";
    // A ring or circle has a fixed size: when the value beside it is so long that the pair would spill into the
    // next column (past this cell's padding and the next one's), the glyph drops under the value instead.
    const wrap = (glyph === "ring" || glyph === "circle") && valueW + 10 + 28 > colW + padR + padL - 4;
    return { ...c, glyph, label: c.label ?? c.field, fmt, values, texts, valueW, glyphW, wrap, cell, gap, perLine, unit, max, key };
  });

  const drawGlyph = (spec: (typeof specs)[number], v: number, color: string): ReactNode => {
    const { glyph, cell, gap, perLine, unit, max, glyphW } = spec;
    if (glyph === "dots") return <_Units count={v / unit} perLine={perLine} cell={cell} gap={gap} color={color} draw={(x, y, k, o) => <circle key={k} cx={x + 4} cy={y + 4} r={4} opacity={o} />} />;
    if (glyph === "blocks") return <_Units count={v / unit} perLine={perLine} cell={cell} gap={gap} color={color} draw={(x, y, k, o) => <rect key={k} x={x} y={y} width={9} height={9} rx={1} opacity={o} />} />;
    if (glyph === "icons") {
      const icon = resolveIcon(spec.icon, "person");
      // Each built-in path sits on a 24-unit grid; scale it to the cell height.
      const s = cell.h / 24;
      return <_Units count={v / unit} perLine={perLine} cell={cell} gap={gap} color={color} draw={(x, y, k, o) => <path key={k} d={icon.d} transform={`translate(${x - (24 * s - cell.w) / 2} ${y}) scale(${s})`} opacity={o} />} />;
    }
    if (glyph === "ring") {
      const r = 10.5;
      const c = 2 * Math.PI * r;
      const f = Math.min(1, Math.max(0, v / max));
      return (
        <svg data-slot="ic-glyph-table-glyph" aria-hidden width={28} height={28} viewBox="0 0 28 28" style={{ flex: "none", display: "block", margin: "-3px 0" }}>
          <circle cx={14} cy={14} r={r} fill="none" strokeWidth={6} style={{ stroke: "var(--_ic-grid)" }} />
          <circle cx={14} cy={14} r={r} fill="none" strokeWidth={6} strokeDasharray={`${c * f} ${c}`} transform="rotate(-90 14 14)" style={{ stroke: color }} />
        </svg>
      );
    }
    if (glyph === "circle") {
      // Area, not radius, carries the value.
      const r = Math.max(1, 14 * Math.sqrt(Math.min(1, Math.max(0, v / max))));
      return (
        <svg data-slot="ic-glyph-table-glyph" aria-hidden width={28} height={28} viewBox="0 0 28 28" style={{ flex: "none", display: "block", margin: "-3px 0", fill: color }}>
          <circle cx={14} cy={14} r={r} />
        </svg>
      );
    }
    if (glyph === "bar") {
      const w = Math.max(v > 0 ? 2 : 0, glyphW * Math.min(1, Math.max(0, v / max)));
      const rad = Math.min(tokens.radius, 5, w / 2);
      // Square at the zero baseline, rounded at the data end.
      return (
        <svg data-slot="ic-glyph-table-glyph" aria-hidden width={glyphW} height={12} style={{ flex: "none", display: "block", fill: color }}>
          <path d={`M0 0h${w - rad}a${rad} ${rad} 0 0 1 ${rad} ${rad}v${12 - 2 * rad}a${rad} ${rad} 0 0 1 ${-rad} ${rad}h${-(w - rad)}z`} />
        </svg>
      );
    }
    return null;
  };

  const valueStyle = (spec: (typeof specs)[number]): CSSProperties => ({ flex: "none", width: spec.glyph === "text" ? undefined : spec.valueW, fontFamily: "var(--_ic-font-display)", fontSize: VALUE_SIZE, lineHeight: "22px", fontWeight: 300, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums", color: "var(--_ic-ink)", whiteSpace: "nowrap" });
  const cellBody = (spec: (typeof specs)[number], ri: number, color: string) => {
    const v = spec.values[ri];
    if (v == null) return <span data-slot="ic-glyph-table-missing" style={{ fontSize: 13, lineHeight: "22px", color: "var(--_ic-muted)" }}>no data</span>;
    return (
      <span style={{ display: "flex", flexWrap: spec.wrap ? "wrap" : undefined, alignItems: "flex-start", columnGap: 10, rowGap: 2, minWidth: 0 }}>
        <span data-slot="ic-glyph-table-value" style={valueStyle(spec)}>{spec.texts[ri]}</span>
        <span style={{ display: "flex", alignItems: "center", minHeight: 22, minWidth: 0 }}>{drawGlyph(spec, v, color)}</span>
      </span>
    );
  };

  const dotted = "1.5px dotted var(--_ic-axis)";
  const headText: CSSProperties = { fontSize: "0.75rem", lineHeight: 1.3, fontWeight: 600, color: "var(--_ic-ink)" };
  const keyText: CSSProperties = { display: "block", marginTop: 2, fontSize: "0.6875rem", lineHeight: 1.3, fontWeight: 400, color: "var(--_ic-muted)" };
  const swatch = (color: string) => <span aria-hidden style={{ flex: "none", width: 10, height: 10, borderRadius: 2, background: color, marginTop: 6 }} />;
  const rowProps = (key: string) => ({
    onMouseEnter: () => setHovered(key),
    onMouseLeave: () => setHovered((h) => (h === key ? null : h)),
    ...(select
      ? {
          tabIndex: 0,
          "aria-selected": picked.includes(key),
          onClick: () => toggle(key),
          onKeyDown: (e: { key: string; preventDefault(): void }) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            toggle(key);
          },
        }
      : null),
  });

  const captionNode =
    caption || subtitle ? (
      <caption data-slot="ic-glyph-table-caption" style={{ display: stacked ? "block" : undefined, captionSide: "top", textAlign: "left", paddingBottom: 14 }}>
        {caption ? <span style={{ display: "block", fontFamily: "var(--_ic-font-display)", fontSize: "1.125rem", lineHeight: 1.3, fontWeight: 650, letterSpacing: "-0.01em", color: "var(--_ic-ink)", textWrap: "balance" }}>{caption}</span> : null}
        {subtitle ? (
          <span data-slot="ic-glyph-table-subtitle" style={{ display: "block", marginTop: caption ? 4 : 0, fontSize: "0.875rem", lineHeight: 1.45, color: "var(--_ic-ink-2)" }}>
            {subtitle}
          </span>
        ) : null}
      </caption>
    ) : null;

  // The same table markup in both layouts: on a narrow container every row becomes a card and each
  // cell shows its own column heading, with explicit roles so the table semantics survive `display`.
  const block: CSSProperties | undefined = stacked ? { display: "block" } : undefined;
  return (
    <div ref={ref} data-slot="ic-glyph-table" data-ic-mode={mode} data-layout={stacked ? "cards" : "table"} className={className} style={{ ...(chromeVars(tokens) as CSSProperties), fontFamily: "var(--_ic-font)", color: "var(--_ic-ink)", minWidth: 0, ...frameStyle(rest.theme, mode, rest.frame), ...style }}>
      <table role="table" data-slot="ic-glyph-table-table" style={{ ...block, width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        {captionNode}
        <thead role="rowgroup" data-slot="ic-glyph-table-head" style={stacked ? hidden : undefined}>
          <tr role="row">
            <th role="columnheader" scope="col" style={{ boxSizing: "border-box", width: nameW, textAlign: "left", verticalAlign: "bottom", padding: "0 10px 8px 0", borderBottom: dotted, ...headText }}>
              {nameLabel ?? <span style={hidden}>{nameField}</span>}
            </th>
            {specs.map((s, i) => (
              <th key={s.field} role="columnheader" scope="col" data-slot="ic-glyph-table-header" style={{ boxSizing: "border-box", width: stacked ? undefined : tableColW[i], textAlign: "left", verticalAlign: "bottom", padding: `0 ${padR}px 8px ${padL}px`, borderBottom: dotted, borderLeft: dotted, ...headText }}>
                {s.label}
                {s.key ? <span data-slot="ic-glyph-table-key" style={keyText}>{s.key}</span> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup" data-slot="ic-glyph-table-body" style={block}>
          {sorted.map((row, ri) => {
            const key = keys[ri];
            const color = colorOf(key, ri);
            const grey = marked.length > 0 && !marked.includes(key);
            const rowStyle: CSSProperties = { ...block, opacity: faded(key) ? 0.3 : 1, transition: "opacity .15s", cursor: select ? "pointer" : undefined, ...(stacked ? { padding: "12px 0", borderTop: ri === 0 ? dotted : undefined, borderBottom: dotted } : null) };
            return (
              <tr key={key + ri} role="row" data-slot="ic-glyph-table-row" data-highlight={marked.includes(key) ? "" : undefined} style={rowStyle} {...rowProps(key)}>
                <th role="rowheader" scope="row" data-slot="ic-glyph-table-name" style={{ ...block, textAlign: "left", verticalAlign: "top", padding: stacked ? "0 0 8px" : "12px 10px 12px 0", borderBottom: stacked ? undefined : "1px dotted var(--_ic-grid)", fontSize: stacked ? "0.9375rem" : "0.875rem", lineHeight: "22px", fontWeight: grey ? 500 : 650, color: grey ? "var(--_ic-ink-2)" : "var(--_ic-ink)" }}>
                  <span style={{ display: "flex", gap: 8, minWidth: 0 }}>
                    {swatch(color)}
                    <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{key}</span>
                  </span>
                </th>
                {specs.map((s) => (
                  <td key={s.field} role="cell" data-slot="ic-glyph-table-cell" style={stacked ? { display: "grid", gridTemplateColumns: `${cardLabelW}px minmax(0, 1fr)`, columnGap: 12, alignItems: "start", padding: "5px 0" } : { verticalAlign: "top", padding: `12px ${padR}px 12px ${padL}px`, borderLeft: dotted, borderBottom: "1px dotted var(--_ic-grid)" }}>
                    {stacked ? (
                      // The column header already names this cell for assistive technology.
                      <span aria-hidden style={{ fontSize: "0.75rem", lineHeight: "22px", color: "var(--_ic-ink-2)" }}>
                        <span style={{ display: "block", lineHeight: 1.3, paddingTop: 4 }}>{s.label}</span>
                        {s.key ? <span style={keyText}>{s.key}</span> : null}
                      </span>
                    ) : null}
                    {cellBody(s, ri, color)}
                  </td>
                ))}
              </tr>
            );
          })}
          {sorted.length === 0 ? (
            <tr role="row">
              <td role="cell" colSpan={specs.length + 1} style={{ padding: "20px 0", textAlign: "center", color: "var(--_ic-muted)" }}>
                No rows to show.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
      {source || note ? (
        <div data-slot="ic-glyph-table-source" style={{ marginTop: 10, fontSize: "0.75rem", lineHeight: 1.5, color: "var(--_ic-muted)" }}>
          {[source ? `Source: ${source}` : "", note ?? ""].filter(Boolean).join(" · ")}
        </div>
      ) : null}
    </div>
  );
}

export const GlyphTable = withMeta(GlyphTableImpl, {
  name: "glyph-table",
  component: "GlyphTable",
  title: "Glyph table",
  level: "atom",
  category: "poster",
  description: "A table with one row per entity in which every number is drawn as a small form chosen per column (counted dots, squares or icons, a ring, a sized circle, a bar) with the value printed beside it.",
  whenToUse: "Comparing 3 to about 12 entities across 2 to 5 measures with different units, when the table should read as a graphic: profiles of products, cities, teams or species. Pair it with curve-rank by passing both the same `order`.",
  avoid: "Looking up many exact values, sorting, or more than about 12 rows (use data-table); one measure across entities (use bar-chart or pictogram-chart); a trend over time (use line-chart or small-multiples).",
  props: [
    { name: "rows", type: "Row[]", required: true, description: "One object per entity." },
    { name: "name", type: "string", description: "Field holding the entity name. Defaults to the first key of the first row." },
    { name: "nameLabel", type: "string", description: "Heading of the name column." },
    {
      name: "columns",
      type: '{ field, label?, glyph?: "dots" | "blocks" | "ring" | "circle" | "bar" | "icons" | "text", unit?, format?, max?, icon? }[]',
      required: true,
      description: "Glyph columns in order. `dots`, `blocks` and `icons` draw one mark per `unit` (default 1, raised to a round number when the largest value would not fit, and stated in the heading). `ring` fills to `max` (default 100, or 1 for fractions). `circle` is sized by area and `bar` by length against `max` (default: the column's largest value). `text` prints the value alone.",
    },
    { name: "order", type: "string[]", description: "Entity names in display order; also assigns colours. Pass the same list to curve-rank to match its curve colours." },
    { name: "highlight", type: "string | string[]", description: "Entities drawn in colour; every other row turns grey." },
    { name: "colorBy", type: '"series" | "none"', description: "`series`: one colour per entity; past the size of the theme's palette the extra colours are derived from the theme's own (curve-rank derives the same ones). `none`: every row in the accent. Default: series while the rows fit the palette (at most 8), none beyond." },
    { name: "caption", type: "string", description: "The table's title, as a real `<caption>`." },
    { name: "subtitle", type: "string", description: "Measures, units and period, under the caption." },
    { name: "source", type: "string", description: 'Shown under the table as "Source: ...".' },
    { name: "note", type: "string", description: "Method notes or caveats, shown under the table." },
    { name: "select", type: "boolean", description: "Let readers click a row (or press Enter on it) to select it; the other rows fade." },
    { name: "onSelect", type: "(values: string[]) => void", description: "Called with the selected entity names whenever the selection changes." },
    { name: "selected", type: "string[]", description: "Controlled selection: the entity names currently selected. When given, the table shows exactly this list and a click only calls `onSelect`. Omit it and the table keeps its own selection." },
    { name: "frame", type: "boolean", description: "Paint a named theme's background behind the block, with padding and rounded corners. On by default for a named theme with its own surface; `false` turns it off." },
  ],
  example: {
    type: "glyph-table",
    theme: "noir",
    caption: "Filter coffee sold 310 cups a day at £2.40 a cup",
    subtitle: "Six drinks at one café: price, cups sold per day, share ordered with oat milk, seconds to prepare and caffeine",
    note: "Illustrative figures.",
    name: "drink",
    nameLabel: "Drink",
    columns: [
      { field: "price", label: "Price per cup", glyph: "bar", format: { style: "currency", currency: "GBP" }, max: 5 },
      { field: "cups", label: "Cups sold a day", glyph: "dots", unit: 10 },
      { field: "oat", label: "With oat milk", glyph: "ring", format: "{value}%" },
      { field: "seconds", label: "Seconds to prepare", glyph: "blocks", unit: 10 },
      { field: "caffeine", label: "Caffeine, mg", glyph: "circle" },
    ],
    rows: [
      { drink: "Filter coffee", price: 2.4, cups: 310, oat: 8, seconds: 15, caffeine: 140 },
      { drink: "Espresso", price: 2.6, cups: 145, oat: null, seconds: 30, caffeine: 65 },
      { drink: "Flat white", price: 3.6, cups: 260, oat: 34, seconds: 95, caffeine: 130 },
      { drink: "Iced latte", price: 4.2, cups: 180, oat: 41, seconds: 70, caffeine: 130 },
      { drink: "Matcha latte", price: 4.8, cups: 75, oat: 57, seconds: 110, caffeine: 70 },
      { drink: "Hot chocolate", price: 3.9, cups: 40, oat: 22, seconds: 85, caffeine: 10 },
    ],
  },
});
