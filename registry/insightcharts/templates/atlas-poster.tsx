"use client";

import { makeFormatter, type FormatSpec, withMeta, isSpec, renderSlot, type InsightSpec, useContainerWidth } from "insightcharts/core";
import { toNumber, type Row } from "insightcharts/data";
import { Poster, type PosterPanel } from "@/components/insightcharts/molecules/poster";
import { _InfographicStat, frameDocs, linkPanels, regionPanel, useInfographicLink, type InfographicFigure, type InfographicFrameProps, type Region } from "@/components/insightcharts/templates/_infographic-layout";

/** One "3 in 10" statement of the closing row (`icon-stat`). */
export interface AtlasPosterStat {
  /** How many glyphs are filled. */
  count: number;
  /** How many glyphs are drawn. Default 10. */
  total?: number;
  /** The rest of the sentence, read straight after the figure. */
  text: string;
  /** Glyph: a built-in icon name. Default `"circle"`. */
  icon?: string;
  /** The figure as words, when "{count} in {total}" is not right. */
  value?: string;
}

export interface AtlasPosterProps extends InfographicFrameProps {
  /** Panel 1: the subject's main number in large type. */
  statement?: InfographicFigure;
  /** Panel 2: 4 to 12 attributes of the subject as spokes round an icon (`radial-spokes`). `{ data, name, value, icon?, title? }`. */
  spokes?: Region<{ name?: string; value?: string; icon?: string }>;
  /** Panel 3: named places or things as circles joined by lines (`bubble-network`). `{ data, name, value, links, title? }`. */
  network?: Region<{ name?: string; value?: string; links?: { from: string; to: string; value?: number }[] }>;
  /** Panel 4, wide: one measure over time as a smooth filled curve with its peak labelled (`area-chart`). `{ data, x, y, title? }`. */
  trend?: Region<{ x?: string; y?: string; peak?: boolean | string }>;
  /** Panel 5: two or three quantities as squares nested inside one another (`proportional-area`). `{ data, name, value, title? }`. */
  area?: Region<{ name?: string; value?: string }>;
  /** Panel 6: each entity at two dates, joined by a line (`slope-chart`). `{ data, series, y: [from, to], names?, highlight?, title? }`. */
  slope?: Region<{ series?: string; y?: string | string[] }>;
  /** Panel 7: a short ranking as centred pills (`pill-rank`). `{ data, name, value, highlight?, title? }`. A `bar-chart` spec also fits here. */
  rank?: Region<{ name?: string; value?: string }>;
  /** Panel 8: parts of one whole as tiles (`treemap`). `{ data, name, value, title? }`. */
  parts?: Region<{ name?: string; value?: string }>;
  /** Panel 9: a tile map (`choropleth-map`). `{ data, region, value, title? }` where each row also has `col` and `row`, the tile's place in the grid; or pass `geo` yourself. */
  map?: Region<{ region?: string; value?: string; code?: string }>;
  /** Panel 10: two to four magnitudes as sized circles (`stat-circles`). `{ data, name, value, unit?, title? }`. */
  circles?: Region<{ name?: string; value?: string; unit?: string }>;
  /** Closing row: up to three "3 in 10" statements with rows of icons (`icon-stat`). */
  stats?: AtlasPosterStat[];
}

/**
 * Square tiles as GeoJSON, from rows that carry a column and a row number. A tile map gives
 * every region the same area, which is what a small panel can show; real outlines would leave
 * the small regions invisible.
 */
function tileGeo(rows: Row[], region: string, code: string | undefined) {
  return {
    type: "FeatureCollection",
    features: rows
      .filter((r) => !Number.isNaN(toNumber(r.col)) && !Number.isNaN(toNumber(r.row)))
      .map((r) => {
        const x = toNumber(r.col);
        const y = -toNumber(r.row);
        return { type: "Feature", properties: { name: String(r[region] ?? ""), code: String((code && r[code]) ?? r[region] ?? "") }, geometry: { type: "Polygon", coordinates: [[[x, y - 0.94], [x + 0.94, y - 0.94], [x + 0.94, y], [x, y], [x, y - 0.94]]] } };
      }),
  };
}

const isConfig = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !isSpec(value) && !("$$typeof" in value) && !Array.isArray(value);

/** Spread the panels of one band over the 12 units in proportion to their weights. */
function band(items: [PosterPanel | null, number][]): PosterPanel[] {
  const live = items.filter((it): it is [PosterPanel, number] => it[0] != null);
  const sum = live.reduce((s, [, w]) => s + w, 0);
  let used = 0;
  return live.map(([panel, w], i) => {
    const span = i === live.length - 1 ? 12 - used : Math.max(2, Math.round((12 * w) / sum));
    used += span;
    return { ...panel, span };
  });
}

/**
 * The landscape spread: up to eleven small illustrations of one subject in bands of unequal
 * panels, each a different graphic form, with one statement in large type.
 */
function AtlasPosterImpl({ statement, spokes, network, trend, area, slope, rank, parts, map, circles, stats, theme = "forest", mode = "light", download, maxWidth = 1440, linked, data, kicker, title, subtitle, sources, note, credit, level, className, style }: AtlasPosterProps) {
  const [ref, measured] = useContainerWidth<HTMLDivElement>(1440);
  const { bind, wrap } = useInfographicLink(linked, data);
  const sheet = Math.min(measured, typeof maxWidth === "number" ? maxWidth : measured);
  const phone = sheet < 600;
  // Four columns need about 280px each. Between a phone and that, the spread is two columns.
  const wide = sheet >= 1180;
  const tall = wide ? 400 : 360;
  const low = wide ? 300 : 280;

  // The peak of the trend is found here and labelled on the chart.
  let trendExtra: Record<string, unknown> = {};
  if (isConfig(trend) && Array.isArray(trend.data) && typeof trend.y === "string" && typeof trend.x === "string" && trend.peak !== false) {
    const rows = trend.data as Row[];
    const top = rows.reduce<Row | null>((a, b) => (a == null || (toNumber(b[trend.y as string]) || 0) > (toNumber(a[trend.y as string]) || 0) ? b : a), null);
    if (top) {
      const y = toNumber(top[trend.y]);
      const text = typeof trend.peak === "string" ? trend.peak : `${makeFormatter(trend.format as FormatSpec)(y)}\n${String(top[trend.x])}`;
      trendExtra = { annotations: [{ type: "point", x: top[trend.x] as string | number, y, label: text, position: "top" }] };
    }
  }
  const { peak: _peak, ...trendConfig } = isConfig(trend) ? trend : ({} as Record<string, unknown>);
  void _peak;

  let mapExtra: Record<string, unknown> = {};
  if (isConfig(map) && map.geo == null && Array.isArray(map.data)) mapExtra = { geo: tileGeo(map.data as Row[], (map.region as string) ?? "region", map.code as string | undefined), labelProperty: "code" };
  const { code: _code, ...mapConfig } = isConfig(map) ? map : ({} as Record<string, unknown>);
  void _code;

  const statList = (stats ?? []).slice(0, 3);
  const statsPanel: PosterPanel | null = statList.length
    ? {
        id: "stats",
        span: 12,
        content: (
          <div data-slot="ic-atlas-poster-stats" style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : `repeat(${statList.length}, minmax(0, 1fr))`, gap: phone ? 28 : 40, minWidth: 0 }}>
            {statList.map((s, i) => (
              <div key={i} style={{ minWidth: 0 }}>
                {renderSlot({ type: "icon-stat", total: 10, ...s } as InsightSpec)}
              </div>
            ))}
          </div>
        ),
      }
    : null;

  const A: [PosterPanel | null, number][] = [
    [statement ? { id: "statement", valign: "center", content: <_InfographicStat {...statement} max={wide ? 124 : 140} tone="accent" /> } : null, wide ? 3 : 6],
    [regionPanel(spokes, "radial-spokes", { name: "name", value: "value", height: tall }, { id: "spokes" }), wide ? 4 : 6],
    [regionPanel(network, "bubble-network", { name: "name", value: "value", height: tall }, { id: "network" }), wide ? 5 : 12],
  ];
  const B: [PosterPanel | null, number][] = [
    [regionPanel((isConfig(trend) ? trendConfig : trend) as Region, "area-chart", { x: "x", y: "y", curve: "smooth", legend: false, height: low, ...trendExtra }, { id: "trend" }), wide ? 6 : 12],
    [regionPanel(area, "proportional-area", { name: "name", value: "value", layout: "nested", ratio: "{ratio}x larger" }, { id: "area", valign: "center" }), wide ? 3 : 6],
    [regionPanel(slope, "slope-chart", { series: "name", labels: "end", height: low }, { id: "slope" }), wide ? 3 : 6],
  ];
  const C: [PosterPanel | null, number][] = [
    [regionPanel(rank, "pill-rank", { name: "name", value: "value" }, { id: "rank", valign: "center" }), 3],
    [regionPanel(parts, "treemap", { name: "name", value: "value", height: low }, { id: "parts" }), 3],
    [regionPanel((isConfig(map) ? mapConfig : map) as Region, "choropleth-map", { region: "region", value: "value", aspectScale: 1, labels: "value", height: low, ...mapExtra }, { id: "map" }), 3],
    [regionPanel(circles, "stat-circles", { name: "name", value: "value", colorBy: "value" }, { id: "circles", valign: "center" }), 3],
  ];
  // Two columns: a band of four becomes two rows of two, and a band's wide panel takes a row.
  const rows = wide ? [A, B, C] : [A.slice(0, 2), A.slice(2), B.slice(0, 1), B.slice(1), C.slice(0, 2), C.slice(2)];
  const panels = linkPanels([...rows.flatMap((r) => band(r)), statsPanel], bind);

  return (
    <div ref={ref} data-slot="ic-atlas-poster" className={className} style={{ width: "100%", minWidth: 0, ...style }}>
      {wrap(<Poster kicker={kicker} title={title} subtitle={subtitle} panels={panels} theme={theme} mode={mode} download={download} maxWidth={maxWidth} sources={sources} note={note} credit={credit} level={level} />)}
    </div>
  );
}

// Example data. Norland, its regions and its space agency are invented; every figure is illustrative.
const appleUses = [
  { use: "Eaten fresh", share: 38 },
  { use: "Juice", share: 24 },
  { use: "Cider", share: 15 },
  { use: "Sauce and purée", share: 9 },
  { use: "Dried", share: 5 },
  { use: "Animal feed", share: 5 },
  { use: "Vinegar", share: 4 },
];
const appleRegions = [
  { region: "Eastmark", kt: 720 },
  { region: "Sundby", kt: 540 },
  { region: "Lowlands", kt: 460 },
  { region: "Highmoor", kt: 310 },
  { region: "Fjordland", kt: 220 },
  { region: "Aldern", kt: 150 },
];
const fruitTrains = [
  { from: "Eastmark", to: "Sundby" },
  { from: "Eastmark", to: "Lowlands" },
  { from: "Eastmark", to: "Highmoor" },
  { from: "Eastmark", to: "Aldern" },
  { from: "Sundby", to: "Fjordland" },
  { from: "Lowlands", to: "Fjordland" },
];
const harvests = [1.5, 1.56, 1.48, 1.65, 1.72, 1.69, 1.81, 1.9, 2.05, 2.2, 2.52, 2.31, 1.98, 2.15, 2.1, 2.4].map((mt, i) => ({ year: String(2010 + i), mt }));
const orchardLand = [
  { land: "All farmland", ha: 2100000 },
  { land: "Orchards", ha: 84000 },
];
const varieties = [
  { variety: "Gala", y2015: 22, y2025: 27 },
  { variety: "Elstar", y2015: 25, y2025: 18 },
  { variety: "Jonagold", y2015: 20, y2025: 14 },
  { variety: "Braeburn", y2015: 12, y2025: 15 },
];
const appleExports = [
  { country: "Vesterhav", kt: 190 },
  { country: "Kalmar", kt: 140 },
  { country: "Ostland", kt: 95 },
  { country: "Meridia", kt: 60 },
  { country: "Tavria", kt: 35 },
];
const kiloPrice = [
  { part: "Shop", cents: 71 },
  { part: "Grower", cents: 62 },
  { part: "Packing and storage", cents: 34 },
  { part: "Transport", cents: 21 },
  { part: "Sales tax", cents: 17 },
];
const yields = [
  { region: "Fjordland", code: "Fj", yield: 22, col: 0, row: 0 },
  { region: "Highmoor", code: "Hi", yield: 27, col: 1, row: 0 },
  { region: "Norvik", code: "No", yield: 19, col: 2, row: 0 },
  { region: "Aldern", code: "Al", yield: 24, col: 0, row: 1 },
  { region: "Eastmark", code: "Ea", yield: 41, col: 1, row: 1 },
  { region: "Castren", code: "Ca", yield: 33, col: 2, row: 1 },
  { region: "Lowlands", code: "Lo", yield: 35, col: 1, row: 2 },
  { region: "Sundby", code: "Su", yield: 38, col: 2, row: 2 },
];
const eaten = [
  { who: "per person in Norland", kg: 24 },
  { who: "per person in Vesterhav", kg: 17 },
  { who: "per person in Kalmar", kg: 9 },
];
export const AtlasPoster = withMeta(AtlasPosterImpl, {
  name: "atlas-poster",
  component: "AtlasPoster",
  title: "Atlas poster",
  level: "template",
  category: "infographic",
  description: "A landscape spread of up to eleven small illustrations of one subject, each a different graphic form, in three bands of unequal panels: a statement in large type, spokes round an icon and a network of circles; a smooth trend with its peak labelled, nested squares and a slope chart; a pill ranking, a treemap, a tile map and sized circles; and a closing row of icon statements.",
  whenToUse: "Use it when one subject has many small facts of different kinds (shares, places, a trend, a change, a ranking, a map) and none of them should dominate: a crop, an industry, a service, a country's internet. Fill at least eight regions. Give every panel a short heading that states its one number. Every region is optional, and each band shares its width among the panels that are present.",
  avoid: "One dominant fact or graphic (use `count-poster`, `flow-poster` or `ranking-poster`). The same measures across several entities (use `matrix-poster`). Fewer than six panels (use `poster` and place them yourself). A phone-first piece: the spread becomes one long column under 600px.",
  composes: ["poster", "radial-spokes", "bubble-network", "area-chart", "proportional-area", "slope-chart", "pill-rank", "treemap", "choropleth-map", "stat-circles", "icon-stat"],
  props: [
    { name: "statement", type: "{ value, label, context?, icon? }", description: "Band 1, left: the subject's main number in large light type, in the accent colour." },
    { name: "spokes", type: "{ data, name, value, icon?, centerLabel?, highlight?, title?, ...radial-spokes props } | Slot", description: "Band 1, middle: 4 to 12 attributes as spokes round a centre icon (`radial-spokes`)." },
    { name: "network", type: "{ data, name, value, links, highlight?, tag?, title?, ...bubble-network props } | Slot", description: "Band 1, right: named places or things as circles sized by value and joined by lines (`bubble-network`)." },
    { name: "trend", type: "{ data, x, y, peak?, format?, title?, ...area-chart props } | Slot", description: "Band 2, wide: one measure over an ordered dimension as a smooth filled curve (`area-chart`). The highest point is labelled with its value and position; `peak` replaces that label, and `peak: false` removes it." },
    { name: "area", type: "{ data, name, value, ratio?, title?, ...proportional-area props } | Slot", description: 'Band 2: two or three quantities as squares nested from one corner, with a bracket stating the ratio (`proportional-area`, `layout: "nested"`).' },
    { name: "slope", type: "{ data, series, y: [from, to], names?, highlight?, title?, ...slope-chart props } | Slot", description: "Band 2: each entity at two dates, joined by a line and labelled at the end (`slope-chart`)." },
    { name: "rank", type: "{ data, name, value, highlight?, title?, ...pill-rank props } | Slot", description: "Band 3: a ranking of 4 to 6 rows as centred pills (`pill-rank`). Pass a `bar-chart` spec for bars instead." },
    { name: "parts", type: "{ data, name, value, title?, ...treemap props } | Slot", description: "Band 3: the parts of one whole as tiles (`treemap`)." },
    { name: "map", type: "{ data, region, value, code?, geo?, title?, ...choropleth-map props } | Slot", description: "Band 3: a tile map shaded by value (`choropleth-map`). Give every row `col` and `row`, the tile's place in the grid, and the template builds the squares; `code` names the field printed on each tile. Pass `geo` to use your own GeoJSON." },
    { name: "circles", type: "{ data, name, value, unit?, title?, ...stat-circles props } | Slot", description: "Band 3: two to four magnitudes as sized circles (`stat-circles`)." },
    { name: "stats", type: "{ count, total?, text, icon?, value? }[]", description: 'Closing row: up to three "3 in 10" statements, each a row of icons with some filled (`icon-stat`).' },
    ...frameDocs("forest", 1440),
  ],
  example: {
    type: "atlas-poster",
    theme: "forest",
    kicker: "Food",
    title: "Norland's orchards picked 2.4 million tonnes of apples in 2025",
    subtitle: "Harvest, regions, varieties, prices and exports of the apple crop.",
    statement: { value: "2.4m", label: "Tonnes of apples picked in 2025", context: "2.1 million tonnes in 2024", icon: "apple" },
    spokes: { data: appleUses, name: "use", value: "share", format: "{value}%", icon: "apple", highlight: "Eaten fresh", title: "38% of the harvest was eaten fresh" },
    network: { data: appleRegions, name: "region", value: "kt", links: fruitTrains, highlight: "Eastmark", tag: "Largest", format: "{value} kt", title: "Eastmark picked 720,000 tonnes", subtitle: "Harvest by region, thousand tonnes. Lines are fruit-train routes." },
    trend: { data: harvests, x: "year", y: "mt", format: "{value}m t", title: "The harvest was 2.52 million tonnes in 2020", subtitle: "Apples picked per year, million tonnes, 2010 to 2025" },
    area: { data: orchardLand, name: "land", value: "ha", format: "compact", ratio: "{ratio}x the area", title: "Orchards covered 84,000 hectares", subtitle: "Hectares, 2025" },
    slope: { data: varieties, series: "variety", y: ["y2015", "y2025"], names: { y2015: "2015", y2025: "2025" }, highlight: "Gala", format: "{value}%", title: "Gala rose from 22% to 27% of the harvest" },
    rank: { data: appleExports, name: "country", value: "kt", format: "{value} kt", highlight: "Vesterhav", title: "Vesterhav bought 190,000 tonnes" },
    parts: { data: kiloPrice, name: "part", value: "cents", format: "{value}c", highlight: "Grower", title: "Growers received 62 cents of a €2.05 kilo" },
    map: { data: yields, region: "region", value: "yield", code: "code", title: "Eastmark picked 41 tonnes a hectare", subtitle: "Yield by region, tonnes per hectare" },
    circles: { data: eaten, name: "who", value: "kg", unit: "kg", title: "Norlanders ate 24 kg of apples each" },
    stats: [
      { icon: "apple", count: 4, total: 10, text: "apples were sold loose." },
      { icon: "book", count: 2, total: 10, text: "pickers were students." },
      { icon: "tree", count: 3, total: 10, text: "orchard trees were under ten years old." },
    ],
    sources: ["Norland Fruit Growers' Association", "Norland Statistics Office"],
    note: "Norland and its neighbours are invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
});
