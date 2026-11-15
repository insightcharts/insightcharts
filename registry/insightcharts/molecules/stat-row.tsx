"use client";

import { type FormatSpec, withMeta, type Slot } from "insightcharts/core";
import { BigNumber } from "@/components/insightcharts/atoms/big-number";
import { StatTile } from "@/components/insightcharts/atoms/stat-tile";
import { MoleculeFooter, MoleculeHeader, Provide, useMolecule, type MoleculeProps } from "@/components/insightcharts/molecules/_shared";

export interface StatRowItem {
  /** The figure. Numbers are formatted with `format`; strings are shown as written. */
  value: number | string;
  /** What the figure measures, sentence case. */
  label: string;
  /** The comparison, denominator or period that gives the number meaning. */
  context?: string;
  /** Change against a baseline. Numbers render as signed percentages (0.12 is +12%). */
  delta?: number | string;
  deltaLabel?: string;
  /** Whether an increase is good news. Default true. */
  upIsGood?: boolean;
  /** Overrides the row's `format` for this figure. */
  format?: FormatSpec;
  /** Tiles only: an array of numbers drawn as a sparkline, or a chart spec. */
  trend?: Slot | number[];
}

export interface StatRowProps extends MoleculeProps {
  /** Two to five figures, most important first. */
  items: StatRowItem[];
  /** `"plain"`: open figures separated by hairlines. `"tiles"`: bordered tiles that can carry a trend. */
  variant?: "plain" | "tiles";
  /** Number format shared by every figure that does not set its own. */
  format?: FormatSpec;
  /** The main fact with its number, or a plain label. */
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
}

/**
 * A row of key figures. The columns follow the container: all in one row when each has
 * room, then two columns, then a single stack, with hairlines between cells.
 */
function StatRowImpl({ items, variant = "plain", format, title, subtitle, source, note, className, style, ...rest }: StatRowProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const list = (items ?? []).slice(0, 5);
  const n = list.length;
  const tiles = variant === "tiles";
  const min = tiles ? 172 : 148;
  const fit = Math.max(1, Math.floor(width / min));
  const cols = fit >= n ? n : n > 4 && fit >= 3 ? 3 : fit >= 2 ? 2 : 1;
  const rows = Math.ceil(n / cols);
  const pad = width < 480 ? 16 : 24;
  return (
    <div ref={ref} data-slot="ic-stat-row" data-ic-mode={mode} data-columns={cols} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle} />
        <div data-slot="ic-stat-row-items" role="list" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: tiles ? 12 : 0 }}>
          {list.map((item, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const { trend, ...figure } = item;
            return tiles ? (
              <div key={i} role="listitem" data-slot="ic-stat-row-item" style={{ minWidth: 0, display: "grid" }}>
                <StatTile {...figure} trend={trend} format={item.format ?? format} />
              </div>
            ) : (
              <div
                key={i}
                role="listitem"
                data-slot="ic-stat-row-item"
                style={{
                  minWidth: 0,
                  // A lone figure in the last row spans it, so the hairline above runs the full width.
                  gridColumn: cols > 1 && i === n - 1 && col === 0 ? "1 / -1" : undefined,
                  paddingLeft: col > 0 ? pad : 0,
                  paddingRight: col < cols - 1 && i < n - 1 ? pad : 0,
                  paddingTop: row > 0 ? 16 : 0,
                  paddingBottom: row < rows - 1 ? 16 : 0,
                  borderLeft: col > 0 ? "1px solid var(--_ic-grid)" : undefined,
                  borderTop: row > 0 ? "1px solid var(--_ic-grid)" : undefined,
                }}
              >
                <BigNumber {...figure} format={item.format ?? format} size="stat" />
              </div>
            );
          })}
        </div>
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

export const StatRow = withMeta(StatRowImpl, {
  name: "stat-row",
  component: "StatRow",
  title: "Stat row",
  level: "molecule",
  category: "layout",
  description: "Two to five key figures in one row separated by hairlines, collapsing to two columns and then one as the container narrows.",
  whenToUse: "The opening summary of a report or dashboard: the two to five most important numbers. Give every figure a delta or a context line, and order them by importance.",
  avoid: "More than five figures (use `kpi-grid`), a single lead number (use `big-number` with `size: \"hero\"`), or figures that need their history shown (use `kpi-grid`, or `variant: \"tiles\"` with a `trend`).",
  composes: ["big-number", "stat-tile"],
  props: [
    { name: "items", type: "{ value, label, context?, delta?, deltaLabel?, upIsGood?, format?, trend? }[]", required: true, description: "Two to five figures, most important first. Each takes the props of `big-number` (or `stat-tile` when `variant` is `tiles`)." },
    { name: "variant", type: '"plain" | "tiles"', default: '"plain"', description: "Open figures divided by hairlines, or bordered tiles that can carry a `trend`." },
    { name: "format", type: "FormatSpec", default: '"auto"', description: "Number format for every figure that does not set its own." },
    { name: "title", type: "string", description: "The main fact with its number, or a plain label." },
    { name: "subtitle", type: "string", description: "Population and period the figures share." },
    { name: "source", type: "string", description: 'Shown under the row as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: "Theme override, passed on to every figure." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode, passed on to every figure." },
  ],
  example: {
    type: "stat-row",
    title: "Renewables supplied 31.7% of the world's electricity in 2024",
    subtitle: "Global electricity generation, 2024",
    items: [
      { value: 0.317, format: "percent", label: "Share from renewables", delta: "+1.9 pts", deltaLabel: "vs 2023" },
      { value: 2131, label: "Solar generation, TWh", delta: 0.29, deltaLabel: "vs 2023" },
      { value: 2494, label: "Wind generation, TWh", delta: 0.079, deltaLabel: "vs 2023" },
      { value: 0.409, format: "percent", label: "Share from all clean sources", context: "Above 40% for the first time since the 1940s" },
    ],
    source: "Ember, Global Electricity Review 2025",
    note: "Figures are approximate, for illustration",
  },
});
