import { withMeta } from "../core/meta";
import { useContainerWidth } from "../core/use-container-width";
import { toNumber } from "../data/transform";
import type { Row } from "../data/types";
import { Poster } from "../molecules/poster";
import { frameDocs, linkPanels, regionPanel, useInfographicLink, type InfographicFrameProps, type RegionText } from "./_infographic-layout";

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

const seabirds = [
  { bird: "Gannet", wingspan: 180, pairs: 5200, eggs: 1, dive: 22, years: 17, mass: 3000 },
  { bird: "Fulmar", wingspan: 107, pairs: 8900, eggs: 1, dive: 3, years: 30, mass: 800 },
  { bird: "Kittiwake", wingspan: 105, pairs: 14600, eggs: 2, dive: 1, years: 12, mass: 400 },
  { bird: "Shag", wingspan: 100, pairs: 1900, eggs: 3, dive: 45, years: 12, mass: 1900 },
  { bird: "Arctic tern", wingspan: 80, pairs: 3100, eggs: 2, dive: 1, years: 13, mass: 110 },
  { bird: "Guillemot", wingspan: 67, pairs: 21400, eggs: 1, dive: 60, years: 23, mass: 950 },
  { bird: "Razorbill", wingspan: 65, pairs: 6700, eggs: 1, dive: 35, years: 13, mass: 620 },
  { bird: "Puffin", wingspan: 55, pairs: 11800, eggs: 1, dive: 40, years: 18, mass: 400 },
];

const stations = [
  { station: "Skarvik", altitude: 12, rain: 2240, wet: 231, july: 13, snow: 18, wind: 31, sun: 1090 },
  { station: "Holm Pass", altitude: 940, rain: 1860, wet: 204, july: 9, snow: 142, wind: 27, sun: 1180 },
  { station: "Tarn Head", altitude: 610, rain: 1610, wet: 196, july: 11, snow: 96, wind: 22, sun: 1240 },
  { station: "Aldern", altitude: 180, rain: 1240, wet: 172, july: 15, snow: 31, wind: 16, sun: 1410 },
  { station: "Norvik", altitude: 35, rain: 1090, wet: 168, july: 14, snow: 24, wind: 24, sun: 1380 },
  { station: "Castren", altitude: 95, rain: 880, wet: 151, july: 17, snow: 19, wind: 14, sun: 1620 },
  { station: "Mereford", altitude: 240, rain: 760, wet: 139, july: 18, snow: 27, wind: 13, sun: 1710 },
  { station: "Sundby", altitude: 8, rain: 690, wet: 128, july: 17, snow: 11, wind: 21, sun: 1840 },
  { station: "Dunmore", altitude: 310, rain: 610, wet: 117, july: 19, snow: 38, wind: 12, sun: 1790 },
  { station: "Eastmark", altitude: 420, rain: 480, wet: 96, july: 20, snow: 44, wind: 15, sun: 1930 },
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

export const examples = {
  "Noir, eight seabirds, linked": {
    theme: "noir",
    linked: true,
    kicker: "Wildlife",
    title: "21,400 pairs of guillemots bred on the Skerry Isles in 2025",
    subtitle: "Eight seabird species compared on wingspan, breeding pairs and four other measures.",
    rows: seabirds,
    name: "bird",
    nameLabel: "Species",
    curve: { left: "wingspan", right: "pairs", leftLabel: "Wingspan, cm", rightLabel: "Breeding pairs", format: "integer", title: "The gannet's wingspan is 180 cm" },
    columns: [
      { field: "eggs", label: "Eggs in a clutch", glyph: "dots" },
      { field: "dive", label: "Deepest dive, m", glyph: "bar", format: "{value} m" },
      { field: "years", label: "Typical lifespan, years", glyph: "blocks" },
      { field: "mass", label: "Body mass, g", glyph: "circle", format: "integer" },
    ],
    table: { title: "Guillemots dive to 60 metres" },
    sources: "Skerry Isles seabird census 2025",
    note: "The Skerry Isles and the colony counts are invented. Species measurements are rounded typical values.",
    credit: "InsightCharts",
  },
  "Blueprint, ten weather stations, one highlighted, with download": {
    theme: "blueprint",
    download: true,
    kicker: "Weather",
    title: "Skarvik recorded 2,240 mm of rain in 2025",
    subtitle: "Ten weather stations in Norland compared on rainfall, altitude and five other measures, 2025.",
    rows: stations,
    name: "station",
    nameLabel: "Station",
    highlight: "Skarvik",
    curve: { left: "rain", right: "altitude", leftLabel: "Rain in 2025, mm", rightLabel: "Altitude, m", format: "integer", title: "Skarvik stands 12 metres above the sea" },
    columns: [
      { field: "wet", label: "Days with rain", glyph: "dots", unit: 10 },
      { field: "july", label: "Mean July temperature", glyph: "bar", format: "{value}°C" },
      { field: "snow", label: "Days with snow", glyph: "bar" },
      { field: "wind", label: "Mean wind, km/h", glyph: "circle" },
      { field: "sun", label: "Hours of sunshine", glyph: "bar", format: "integer" },
    ],
    table: { title: "Rain fell at Skarvik on 231 days" },
    sources: "Norland Meteorological Institute station records 2025",
    note: "Norland and its weather stations are invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
};
