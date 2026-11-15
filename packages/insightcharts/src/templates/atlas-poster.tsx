import { makeFormatter, type FormatSpec } from "../core/format";
import { withMeta } from "../core/meta";
import { isSpec, renderSlot, type InsightSpec } from "../core/spec";
import { useContainerWidth } from "../core/use-container-width";
import { toNumber } from "../data/transform";
import type { Row } from "../data/types";
import { Poster, type PosterPanel } from "../molecules/poster";
import { _InfographicStat, frameDocs, linkPanels, regionPanel, useInfographicLink, type InfographicFigure, type InfographicFrameProps, type Region } from "./_infographic-layout";

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

const satellitePurposes = [
  { purpose: "Earth observation", n: 14 },
  { purpose: "Communications", n: 11 },
  { purpose: "Navigation", n: 6 },
  { purpose: "Weather", n: 5 },
  { purpose: "Science", n: 4 },
  { purpose: "Technology tests", n: 2 },
];
const groundStations = [
  { station: "Skarvik", passes: 96 },
  { station: "Holm Pass", passes: 64 },
  { station: "Sundby", passes: 48 },
  { station: "Tarn Head", passes: 31 },
  { station: "Aldern", passes: 22 },
];
const stationLinks = [
  { from: "Skarvik", to: "Holm Pass" },
  { from: "Skarvik", to: "Sundby" },
  { from: "Skarvik", to: "Tarn Head" },
  { from: "Skarvik", to: "Aldern" },
  { from: "Sundby", to: "Aldern" },
];
const launches = [3, 4, 4, 6, 9, 8, 13, 17, 24, 31, 46, 38, 42].map((n, i) => ({ year: String(2013 + i), n }));
const orbitMass = [
  { year: "2025", t: 60 },
  { year: "2015", t: 4 },
];
const launchCost = [
  { rocket: "Small launcher", y2015: 41, y2025: 18 },
  { rocket: "Medium launcher", y2015: 22, y2025: 7 },
  { rocket: "Shared ride", y2015: 15, y2025: 4 },
];
const spaceBudget = [
  { programme: "Launch services", m: 310 },
  { programme: "Earth observation", m: 240 },
  { programme: "Communications", m: 150 },
  { programme: "Science missions", m: 90 },
  { programme: "Ground stations", m: 60 },
];
const builders = [
  { builder: "Agency workshops", n: 18 },
  { builder: "Universities", n: 13 },
  { builder: "Industry", n: 11 },
];
const satelliteMass = [
  { kind: "kg, relay satellite", kg: 4200 },
  { kind: "kg, weather satellite", kg: 1100 },
  { kind: "kg, cubesat", kg: 12 },
];

const onlineUses = [
  { use: "Messaging", share: 81 },
  { use: "Video", share: 64 },
  { use: "News", share: 52 },
  { use: "Shopping", share: 31 },
  { use: "Banking", share: 28 },
  { use: "Learning", share: 12 },
  { use: "Games", share: 24 },
];
const dataCentres = [
  { site: "Norvik", mw: 180 },
  { site: "Castren", mw: 120 },
  { site: "Sundby", mw: 75 },
  { site: "Eastmark", mw: 40 },
  { site: "Aldern", mw: 25 },
  { site: "Skarvik", mw: 15 },
];
const fibreRoutes = [
  { from: "Norvik", to: "Castren" },
  { from: "Norvik", to: "Sundby" },
  { from: "Norvik", to: "Skarvik" },
  { from: "Norvik", to: "Aldern" },
  { from: "Castren", to: "Eastmark" },
  { from: "Sundby", to: "Eastmark" },
];
const hourly = [31, 22, 16, 13, 12, 15, 24, 38, 47, 52, 55, 58, 61, 60, 59, 62, 68, 77, 88, 97, 104, 98, 76, 49].map((gbps, h) => ({ hour: `${String(h).padStart(2, "0")}:00`, gbps }));
const fibreHomes = [
  { homes: "All homes", k: 2600 },
  { homes: "Homes with fibre", k: 1590 },
];
const accessTech = [
  { tech: "Fibre", y2015: 8, y2025: 61 },
  { tech: "Cable", y2015: 34, y2025: 22 },
  { tech: "Copper line", y2015: 51, y2025: 9 },
  { tech: "Mobile only", y2015: 7, y2025: 8 },
];
const speeds = [
  { region: "Norvik", mbps: 412 },
  { region: "Castren", mbps: 368 },
  { region: "Sundby", mbps: 290 },
  { region: "Eastmark", mbps: 214 },
  { region: "Highmoor", mbps: 96 },
];
const trafficTypes = [
  { kind: "Video", share: 58 },
  { kind: "Games and downloads", share: 14 },
  { kind: "Web and apps", share: 12 },
  { kind: "Video calls", share: 9 },
  { kind: "Other", share: 7 },
];
const fibreCover = [
  { region: "Fjordland", code: "Fj", share: 34, col: 0, row: 0 },
  { region: "Highmoor", code: "Hi", share: 28, col: 1, row: 0 },
  { region: "Norvik", code: "No", share: 86, col: 2, row: 0 },
  { region: "Aldern", code: "Al", share: 47, col: 0, row: 1 },
  { region: "Eastmark", code: "Ea", share: 58, col: 1, row: 1 },
  { region: "Castren", code: "Ca", share: 79, col: 2, row: 1 },
  { region: "Lowlands", code: "Lo", share: 52, col: 1, row: 2 },
  { region: "Sundby", code: "Su", share: 71, col: 2, row: 2 },
];
const dataUse = [
  { year: "GB a month in 2015", gb: 38 },
  { year: "GB a month in 2020", gb: 142 },
  { year: "GB a month in 2025", gb: 410 },
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

export const examples = {
  "Dusk, a space programme, ten panels, with download": {
    theme: "dusk",
    download: true,
    kicker: "Space",
    title: "The Norland Space Agency put 42 satellites into orbit in 2025",
    subtitle: "Satellites, launches, ground stations, costs and budget of one national space programme.",
    statement: { value: "42", label: "Satellites launched in 2025", context: "38 in 2024", icon: "satellite" },
    spokes: { data: satellitePurposes, name: "purpose", value: "n", icon: "satellite", highlight: "Earth observation", title: "14 of the satellites observe the Earth" },
    network: { data: groundStations, name: "station", value: "passes", links: stationLinks, highlight: "Skarvik", tag: "Control centre", title: "Skarvik tracked 96 satellite passes a day", subtitle: "Passes tracked per day by ground station. Lines are data links." },
    trend: { data: launches, x: "year", y: "n", format: "integer", title: "The agency launched 46 satellites in 2023", subtitle: "Satellites put into orbit per year, 2013 to 2025" },
    area: { data: orbitMass, name: "year", value: "t", format: "{value} t", ratio: "{ratio}x the mass", title: "60 tonnes reached orbit in 2025", subtitle: "Mass put into orbit per year, tonnes" },
    slope: { data: launchCost, series: "rocket", y: ["y2015", "y2025"], names: { y2015: "2015", y2025: "2025" }, highlight: "Shared ride", format: "€{value}k", title: "A shared ride cost €4,000 a kilogram in 2025", subtitle: "Launch price per kilogram, thousand euros" },
    rank: { data: spaceBudget, name: "programme", value: "m", format: "€{value}m", highlight: "Launch services", title: "Launch services cost €310 million" },
    parts: { data: builders, name: "builder", value: "n", highlight: "Universities", title: "Universities built 13 of the 42 satellites" },
    circles: { data: satelliteMass, name: "kind", value: "kg", format: "integer", title: "A relay satellite weighs 4,200 kg" },
    stats: [
      { icon: "rocket", count: 9, total: 10, text: "launches reached their planned orbit." },
      { icon: "satellite", count: 3, total: 10, text: "satellites were built by universities." },
    ],
    sources: "Norland Space Agency annual report 2025",
    note: "The Norland Space Agency is invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
  "Sunrise, a country's internet, linked": {
    theme: "sunrise",
    linked: true,
    kicker: "The internet",
    title: "94% of Norland's households were online in 2025",
    subtitle: "Use, traffic, networks and speeds of the internet in one country.",
    statement: { value: "94%", label: "Households with an internet connection in 2025", context: "81% in 2015", icon: "laptop" },
    spokes: { data: onlineUses, name: "use", value: "share", format: "{value}%", icon: "phone", highlight: "Messaging", title: "81% of adults sent a message online every day" },
    network: { data: dataCentres, name: "site", value: "mw", links: fibreRoutes, highlight: "Norvik", tag: "Main exchange", format: "{value} MW", title: "Norvik's data centres drew 180 MW", subtitle: "Data-centre power by site, megawatts. Lines are trunk fibre routes." },
    trend: { data: hourly, x: "hour", y: "gbps", format: "{value} Gbps", title: "Traffic reached 104 Gbps at 8pm", subtitle: "Traffic at the Norvik exchange by hour, an average weekday in 2025" },
    area: { data: fibreHomes, name: "homes", value: "k", format: "{value}k", ratio: false, title: "1.59 million of 2.6 million homes had fibre" },
    slope: { data: accessTech, series: "tech", y: ["y2015", "y2025"], names: { y2015: "2015", y2025: "2025" }, highlight: "Fibre", format: "{value}%", title: "Fibre rose from 8% to 61% of connections" },
    rank: { data: speeds, name: "region", value: "mbps", format: "{value} Mbps", highlight: "Norvik", title: "Norvik's median download speed was 412 Mbps" },
    parts: { data: trafficTypes, name: "kind", value: "share", format: "{value}%", highlight: "Video", title: "Video was 58% of traffic" },
    map: { data: fibreCover, region: "region", value: "share", code: "code", format: "{value}%", title: "Fibre reached 86% of homes in Norvik", subtitle: "Homes with fibre available, by region" },
    circles: { data: dataUse, name: "year", value: "gb", format: "integer", title: "A household used 410 GB a month in 2025" },
    stats: [
      { icon: "cart", count: 1, total: 10, text: "adults had never bought anything online." },
      { icon: "phone", count: 7, total: 10, text: "minutes online were spent on a phone." },
      { icon: "lock", count: 4, total: 10, text: "adults used a password manager." },
    ],
    sources: ["Norland Communications Authority", "Norvik Internet Exchange"],
    note: "Norland is an invented country. All figures are illustrative.",
    credit: "InsightCharts",
  },
};
