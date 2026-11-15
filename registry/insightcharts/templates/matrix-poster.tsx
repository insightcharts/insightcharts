"use client";

import { withMeta, useContainerWidth } from "insightcharts/core";
import { toNumber, type Row } from "insightcharts/data";
import { Poster } from "@/components/insightcharts/molecules/poster";
import { frameDocs, linkPanels, regionPanel, useInfographicLink, type InfographicFrameProps, type RegionText } from "@/components/insightcharts/templates/_infographic-layout";

/** The two measures joined by curves on the left of the poster. */
export interface MatrixPosterCurve extends RegionText {
  /** Field of the left-hand measure. The rows of the whole poster are ordered by it. */
  left: string;
  /** Field of the right-hand measure. */
  right: string;
  /** Heading over the left scale: the measure and its unit. */
  leftLabel?: string;
  /** Heading over the right scale. */
  rightLabel?: string;
  leftFormat?: unknown;
  rightFormat?: unknown;
  [prop: string]: unknown;
}

/** One glyph column of the table on the right. */
export interface MatrixPosterColumn {
  field: string;
  label?: string;
  glyph?: "dots" | "blocks" | "ring" | "circle" | "bar" | "icons" | "text";
  unit?: number;
  format?: unknown;
  max?: number;
  icon?: string;
}

export interface MatrixPosterProps extends Omit<InfographicFrameProps, "data"> {
  /** One object per entity, holding every measure. 4 to 12 entities. */
  rows: Row[];
  /** Field holding the entity name. Default: the first key of the first row. */
  name?: string;
  /** Heading of the name column of the table. */
  nameLabel?: string;
  /** Left graphic: two measures on parallel scales, joined by one S-curve per entity (`curve-rank`). */
  curve: MatrixPosterCurve;
  /** Right graphic: three to five more measures, each drawn as a glyph column (`glyph-table`). */
  columns: MatrixPosterColumn[];
  /** Short heading and source line of the table. */
  table?: RegionText;
  /** Entity names in display order. Default: largest first on the curve's left measure. */
  order?: string[];
  /** Entities drawn in colour while the rest turn grey. Without it every entity has its own colour. */
  highlight?: string | string[];
}

// The share of the table's width glyph-table gives each kind of column.
const WEIGHT: Record<string, number> = { dots: 1.6, blocks: 1.6, icons: 1.6, bar: 1.3, ring: 0.85, circle: 0.85, text: 0.7 };
const COUNTED = new Set(["dots", "blocks", "icons"]);

/**
 * One wide graphic that compares a handful of entities on several measures: two measures as
 * S-curves on the left, the rest as a table of glyphs on the right, in one row order and
 * with one colour per entity.
 */
function MatrixPosterImpl({ rows, name, nameLabel, curve, columns, table, order, highlight, theme = "paper", mode = "light", download, maxWidth = 1400, linked, kicker, title, subtitle, sources, note, credit, level, className, style }: MatrixPosterProps) {
  const [ref, measured] = useContainerWidth<HTMLDivElement>(1400);
  const { bind, wrap } = useInfographicLink(linked, undefined);
  const sheet = Math.min(measured, typeof maxWidth === "number" ? maxWidth : measured);
  const data = Array.isArray(rows) ? rows : [];
  const field = name ?? Object.keys(data[0] ?? {})[0] ?? "name";
  // One order for both graphics: the top curve on the left scale is the top row of the table.
  const sorted = order ?? [...data].sort((a, b) => (toNumber(b[curve.left]) || 0) - (toNumber(a[curve.left]) || 0)).map((r) => String(r[field] ?? ""));
  // A poster palette has four or five colours. `colorBy: "series"` asks the primitives for one
  // derived colour per entity, the same in both; with `highlight` the rest are grey instead.
  const colour = highlight == null ? { colorBy: "series" } : { highlight };
  // Side by side only while the table still fits as a table in its two thirds of the sheet. The
  // test mirrors glyph-table's own (counted glyphs need 150px a column, the others 84); when it
  // fails the curves take a full row and the table the next, where it has the whole width.
  const inner = sheet - 2 * (sheet < 600 ? 20 : sheet < 900 ? 36 : 56);
  const tableW = (inner - 40) * (8 / 12) + 40 * (7 / 12);
  const weights = (columns ?? []).map((c) => WEIGHT[c.glyph ?? "text"] ?? 1);
  const free = tableW - Math.min(200, Math.max(108, tableW * 0.2));
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const beside = sheet >= 1000 && weights.every((w, i) => (free * w) / sum >= (COUNTED.has(columns[i].glyph ?? "text") ? 156 : 90));
  const { title: curveTitle, subtitle: curveSubtitle, source: curveSource, note: curveNote, ...curveProps } = curve;

  const panels = linkPanels(
    [
      regionPanel(
        { title: curveTitle, subtitle: curveSubtitle, source: curveSource, note: curveNote, ...curveProps, data },
        "curve-rank",
        { name: field, order: sorted, ...colour, height: Math.max(380, data.length * 44 + (beside ? 70 : 80)) },
        { id: "curve", span: beside ? 4 : 12 },
      ),
      regionPanel({ ...table, rows: data }, "glyph-table", { name: field, nameLabel, columns, order: sorted, ...colour }, { id: "table", span: beside ? 8 : 12, valign: "center" }),
    ],
    bind,
  );

  return (
    <div ref={ref} data-slot="ic-matrix-poster" className={className} style={{ width: "100%", minWidth: 0, ...style }}>
      {wrap(<Poster kicker={kicker} title={title} subtitle={subtitle} panels={panels} theme={theme} mode={mode} download={download} maxWidth={maxWidth} sources={sources} note={note} credit={credit} level={level} />)}
    </div>
  );
}

// Example data. The cities and the weather stations are invented; seabird figures are rounded and the colony counts invented.
const cities = [
  { city: "Avenmouth", rent: 1640, pay: 3900, transit: 38, parks: 14, lanes: 212, cafes: 23, sun: 148 },
  { city: "Brackley Bay", rent: 1480, pay: 3300, transit: 22, parks: 9, lanes: 96, cafes: 17, sun: 201 },
  { city: "Castren", rent: 1310, pay: 3600, transit: 41, parks: 17, lanes: 184, cafes: 19, sun: 132 },
  { city: "Dunmore", rent: 1150, pay: 2900, transit: 27, parks: 11, lanes: 120, cafes: 12, sun: 165 },
  { city: "Eastwick", rent: 980, pay: 3100, transit: 33, parks: 21, lanes: 240, cafes: 15, sun: 121 },
  { city: "Fenhallow", rent: 860, pay: 2500, transit: 18, parks: 8, lanes: 54, cafes: 9, sun: 176 },
  { city: "Greyport", rent: 740, pay: 2700, transit: 24, parks: 12, lanes: 88, cafes: 11, sun: 190 },
  { city: "Hallin", rent: 610, pay: 2200, transit: 12, parks: 6, lanes: 31, cafes: 7, sun: 210 },
];
export const MatrixPoster = withMeta(MatrixPosterImpl, {
  name: "matrix-poster",
  component: "MatrixPoster",
  title: "Matrix poster",
  level: "template",
  category: "infographic",
  description: "One wide landscape graphic that compares 4 to 12 entities on five to seven measures: two measures as S-curves between parallel scales on the left, joined to a table on the right in which every other number is drawn as dots, squares, icons, a ring, a circle or a bar. Both halves share one row order and one colour per entity.",
  whenToUse: "Use it for profiles of a handful of comparable things with measures in different units: cities, species, products, stations, teams. Pass one row per entity with every measure in it. Put the two measures whose relationship matters in `curve` and the rest in `columns`, choosing a counted glyph (`dots`, `blocks`, `icons`) for small whole numbers, `ring` for shares, `bar` or `circle` for magnitudes. Leave `highlight` out to give every entity its own colour, derived from the theme when its palette is smaller than the number of entities; set it to draw one or two entities in colour and the rest in grey.",
  avoid: "One measure across entities (use `pill-rank` or `bar-chart`). More than 12 entities (use `data-table` or `heatmap`). A subject with a total and its parts (use `ranking-poster` or `flow-poster`). A phone-first piece: the table stacks into cards under 600px and the poster becomes long.",
  composes: ["poster", "curve-rank", "glyph-table"],
  props: [
    { name: "rows", type: "Row[]", required: true, description: "One object per entity, holding the name and every measure." },
    { name: "name", type: "string", description: "Field holding the entity name. Default: the first key of the first row." },
    { name: "nameLabel", type: "string", description: "Heading of the table's name column." },
    { name: "curve", type: "{ left, right, leftLabel?, rightLabel?, leftFormat?, rightFormat?, leftTop?, rightTop?, title?, subtitle?, source?, ...curve-rank props }", required: true, description: "Left graphic: the two measures joined by one S-curve per entity (`curve-rank`). The poster's rows are ordered by `left`, largest first." },
    { name: "columns", type: "{ field, label?, glyph?, unit?, format?, max?, icon? }[]", required: true, description: "Right graphic: the glyph columns of the table, in order (`glyph-table`). Three to five read well beside the curves." },
    { name: "table", type: "{ title?, subtitle?, source?, note? }", description: "Short heading and source line over and under the table." },
    { name: "order", type: "string[]", description: "Entity names in display order, for both graphics. Default: largest first on the curve's left measure." },
    { name: "highlight", type: "string | string[]", description: "Entities drawn in colour while every other one turns grey. Without it each entity has its own colour in both graphics." },
    ...frameDocs("paper", 1400).filter((d) => d.name !== "data"),
  ],
  example: {
    type: "matrix-poster",
    theme: "paper",
    kicker: "Cities",
    title: "A one-bedroom flat in Avenmouth rented for €1,640 a month in 2025",
    subtitle: "Eight cities of Norland compared on rent, pay and five measures of daily life, 2025.",
    rows: cities,
    name: "city",
    nameLabel: "City",
    curve: { left: "rent", right: "pay", leftLabel: "Rent, € a month", rightLabel: "Median pay, € a month", format: "integer", title: "Median pay in Avenmouth was €3,900 a month" },
    columns: [
      { field: "transit", label: "Trips by public transport", glyph: "ring", format: "{value}%" },
      { field: "parks", label: "Parks per 100,000 people", glyph: "dots" },
      { field: "lanes", label: "Cycle lanes, km", glyph: "bar" },
      { field: "cafes", label: "Cafés per 10,000 people", glyph: "blocks" },
      { field: "sun", label: "Sunny days a year", glyph: "circle" },
    ],
    table: { title: "Eastwick had 240 km of cycle lanes" },
    sources: "Norland Statistics Office, city indicators 2025",
    note: "Norland and its cities are invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
});
