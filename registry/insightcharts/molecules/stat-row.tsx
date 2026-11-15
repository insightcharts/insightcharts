"use client";

import type { CSSProperties } from "react";
import { type FormatSpec, withMeta, frameStyle, type Slot } from "insightcharts/core";
import { BigNumber } from "@/components/insightcharts/atoms/big-number";
import { StatTile, type StatTileProps, type StatTileSurface, type StatTileTone, type StatTileVariant } from "@/components/insightcharts/atoms/stat-tile";
import { MoleculeFooter, MoleculeHeader, Provide, useMolecule, type MoleculeProps } from "@/components/insightcharts/molecules/_shared";

export interface StatRowItem extends Partial<Pick<StatTileProps, "series" | "target" | "targetLabel" | "max" | "comparison" | "comparisonLabel" | "valueLabel" | "parts" | "icon" | "unitValue" | "rank" | "rankOf" | "orientation" | "edge" | "size" | "align">> {
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
  /** Tiles only: this tile's display, overriding the row's. Any `stat-tile` variant. */
  variant?: StatTileVariant;
  /** Tiles only: this tile's ground, overriding the row's. */
  surface?: StatTileSurface;
  /** This figure's tone, overriding the row's. */
  tone?: StatTileTone;
}

export interface StatRowProps extends MoleculeProps {
  /** Two to five figures, most important first. */
  items: StatRowItem[];
  /**
   * `"plain"`: open figures separated by hairlines. `"tiles"`: bordered tiles that can carry a trend.
   * Any other `stat-tile` variant (`"sparkline"`, `"progress"`, `"filled"`...) draws every item as a tile of that kind.
   */
  variant?: "plain" | "tiles" | StatTileVariant;
  /** Tiles only: the ground of every tile. */
  surface?: StatTileSurface;
  /** Tone of every tile's graphic or ground. `"series"` gives each tile the next categorical colour. */
  tone?: StatTileTone | "series";
  /** Tiles only: `"cards"` (default) separates tiles with a gap, `"dividers"` sets them open with hairlines between. */
  layout?: "cards" | "dividers";
  /** Preferred number of columns. Default: all in one row when each has room. */
  columns?: number;
  /** The first figure spans two columns and is set one size larger. */
  featured?: boolean;
  /** Spacing and type scale: `"dense"` for sidebars and tables, `"roomy"` for a page opener. */
  density?: "dense" | "default" | "roomy";
  /** Text alignment of every figure. */
  align?: "left" | "center";
  /** Number format shared by every figure that does not set its own. */
  format?: FormatSpec;
  /** The main fact with its number, or a plain label. */
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
  /** Paint a named theme's own background behind the row. Default true when `theme` is a theme name. */
  frame?: boolean;
}

/** Places items on a grid of `cols` columns where the first may span two; returns each item's column, row and span. */
function place(n: number, cols: number, featured: boolean) {
  const cells: { col: number; row: number; span: number }[] = [];
  let col = 0;
  let row = 0;
  for (let i = 0; i < n; i++) {
    const span = featured && i === 0 ? Math.min(2, cols) : 1;
    if (col + span > cols) {
      col = 0;
      row += 1;
    }
    cells.push({ col, row, span });
    col += span;
  }
  // A lone figure in the last row spans it, so nothing is orphaned beside empty cells.
  const last = cells[n - 1];
  if (last && cols > 1 && last.col === 0 && n > 1) last.span = cols;
  return { cells, rows: row + 1 };
}

const SIZE_UP = { sm: "md", md: "lg", lg: "lg" } as const;

/**
 * A row of key figures. The columns follow the container: all in one row when each has
 * room, then two columns, then a single stack, with hairlines between cells.
 */
function StatRowImpl({ items, variant = "plain", surface, tone, layout = "cards", columns, featured = false, density = "default", align, format, title, subtitle, source, note, frame, className, style, ...rest }: StatRowProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const list = (items ?? []).slice(0, 5);
  const n = list.length;
  const tiles = variant !== "plain" || list.some((item) => item.variant != null);
  const tileVariant: StatTileVariant | undefined = variant === "plain" || variant === "tiles" ? undefined : variant;
  const dividers = !tiles || layout === "dividers";
  const size = density === "dense" ? "sm" : density === "roomy" ? "lg" : "md";
  const painter = frameStyle(rest.theme, mode, frame);
  const inner = Math.max(0, width - (painter ? 40 : 0));
  const wide = tileVariant === "compact" || tileVariant === "split";
  const min = (wide ? 240 : tiles ? 172 : 148) - (density === "dense" ? 24 : 0);
  const gap = dividers ? 0 : density === "dense" ? 8 : density === "roomy" ? 16 : 12;
  const units = n + (featured && n > 1 ? 1 : 0);
  const fit = Math.max(1, Math.floor((inner + gap) / (min + gap)));
  const auto = fit >= units ? units : units > 4 && fit >= 3 ? 3 : fit >= 2 ? 2 : 1;
  const cols = Math.max(1, Math.min(columns ?? auto, fit, units));
  const { cells, rows } = place(n, cols, featured && n > 1);
  const pad = density === "dense" ? 12 : inner < 480 ? 16 : density === "roomy" ? 32 : 24;
  const padY = density === "dense" ? 12 : density === "roomy" ? 24 : 16;
  return (
    <div ref={ref} data-slot="ic-stat-row" data-ic-mode={mode} data-columns={cols} className={className} style={{ ...root, ...painter, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle} />
        <div data-slot="ic-stat-row-items" role="list" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>
          {list.map((item, i) => {
            const { col, row, span } = cells[i];
            const lead = featured && i === 0 && n > 1;
            const cell: CSSProperties = { minWidth: 0, gridColumn: span > 1 ? `span ${span}` : undefined };
            if (dividers)
              Object.assign(cell, {
                paddingLeft: col > 0 ? pad : 0,
                paddingRight: col + span < cols ? pad : 0,
                paddingTop: row > 0 ? padY : 0,
                paddingBottom: row < rows - 1 ? padY : 0,
                borderLeft: col > 0 ? "1px solid var(--_ic-grid)" : undefined,
                borderTop: row > 0 ? "1px solid var(--_ic-grid)" : undefined,
              });
            const itemTone = item.tone ?? (tone === "series" ? i : tone);
            const itemSize = item.size ?? (lead ? SIZE_UP[size] : size);
            if (!tiles) {
              return (
                <div key={i} role="listitem" data-slot="ic-stat-row-item" data-featured={lead || undefined} style={cell}>
                  <BigNumber value={item.value} label={item.label} context={item.context} delta={item.delta} deltaLabel={item.deltaLabel} upIsGood={item.upIsGood} format={item.format ?? format} size={lead && density === "roomy" ? "hero" : "stat"} align={item.align === "center" || align === "center" ? "center" : "left"} />
                </div>
              );
            }
            return (
              <div key={i} role="listitem" data-slot="ic-stat-row-item" data-featured={lead || undefined} style={{ ...cell, display: "grid" }}>
                <StatTile {...item} variant={item.variant ?? tileVariant} surface={item.surface ?? surface ?? (layout === "dividers" ? "borderless" : undefined)} tone={itemTone} size={itemSize} align={item.align ?? align} format={item.format ?? format} />
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
  description: "Two to five key figures in one row, as open numbers separated by hairlines or as stat tiles of any variant, collapsing to two columns and then one as the container narrows.",
  whenToUse: "The opening summary of a report or dashboard: the two to five most important numbers. Give every figure a delta or a context line, and order them by importance.",
  avoid: "More than five figures (use `kpi-grid`), a single lead number (use `big-number` with `size: \"hero\"`), or figures that need their history shown (use `kpi-grid`, or `variant: \"tiles\"` with a `trend`).",
  composes: ["big-number", "stat-tile"],
  props: [
    { name: "items", type: "{ value, label, context?, delta?, deltaLabel?, upIsGood?, format?, trend?, variant?, surface?, tone?, size?, align?, series?, target?, targetLabel?, max?, comparison?, comparisonLabel?, valueLabel?, parts?, icon?, unitValue?, rank?, rankOf?, orientation?, edge? }[]", required: true, description: "Two to five figures, most important first. In `plain` each takes the props of `big-number`; otherwise each takes the props of `stat-tile`, and an item's own `variant`, `surface`, `tone` and `size` override the row's." },
    { name: "variant", type: '"plain" | "tiles" | StatTileVariant', default: '"plain"', description: "`plain`: open `big-number` figures divided by hairlines. `tiles`: bordered `stat-tile` cards. Any `stat-tile` variant (`sparkline`, `area`, `bars`, `dots`, `progress`, `ring`, `comparison`, `delta-first`, `icon`, `unit`, `breakdown`, `rank`, `split`, `compact`, `hero`, `filled`, `tinted`, `borderless`, `outline-accent`) draws every item as that tile. Setting `variant` on any item also switches the row to tiles." },
    { name: "surface", type: '"plain" | "borderless" | "filled" | "tinted" | "outline-accent"', description: "Tiles only: the ground of every tile." },
    { name: "tone", type: '"neutral" | "accent" | "positive" | "negative" | number | "series"', description: "Tone of every tile. `series` gives each tile the next categorical colour, for figures that name different entities." },
    { name: "layout", type: '"cards" | "dividers"', default: '"cards"', description: "Tiles only: separate cards, or open tiles with hairlines between them." },
    { name: "columns", type: "number", description: "Preferred number of columns. Default: one row when every figure has room." },
    { name: "featured", type: "boolean", default: "false", description: "The first figure spans two columns and is set one size larger." },
    { name: "density", type: '"dense" | "default" | "roomy"', default: '"default"', description: "Spacing and type scale: tiles are `sm`, `md` or `lg`." },
    { name: "align", type: '"left" | "center"', default: '"left"', description: "Text alignment of every figure." },
    { name: "frame", type: "boolean", description: "Set false to stop a named theme painting its ground." },
    { name: "format", type: "FormatSpec", default: '"auto"', description: "Number format for every figure that does not set its own." },
    { name: "title", type: "string", description: "The main fact with its number, or a plain label." },
    { name: "subtitle", type: "string", description: "Population and period the figures share." },
    { name: "source", type: "string", description: 'Shown under the row as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: 'A theme name such as `"ledger"`, or token overrides, passed on to every figure. A named theme paints its own ground.' },
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
