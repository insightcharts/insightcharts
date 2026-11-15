import { ArcDiagram, type ArcDiagramProps } from "../atoms/arc-diagram";
import { BubbleNetwork, type BubbleNetworkProps } from "../atoms/bubble-network";
import { PillRank, type PillRankProps } from "../atoms/pill-rank";
import { withMeta } from "../core/meta";
import { isSpec, registerComponents, type InsightSpec, type Slot } from "../core/spec";
import { useContainerWidth } from "../core/use-container-width";
import type { Row } from "../data/types";
import { Poster } from "../molecules/poster";
import { frameDocs, linkPanels, regionPanel, useInfographicLink, type InfographicFrameProps, type Region } from "./_infographic-layout";
import { _figureColumns, _PosterFigures, figureDoc, type PosterFigure } from "./_poster-figures";

// Specs in the regions resolve without the host calling registerAll().
registerComponents({ ArcDiagram, BubbleNetwork, PillRank });

export interface NetworkPosterProps extends InfographicFrameProps {
  /** The hero: every connection between up to about 20 ordered entities as an arc as thick as its value (`arc-diagram`). Config `{ data, from, to, value?, order?, ... }`, or a full spec. */
  hero: Region<Partial<ArcDiagramProps>>;
  /** Two to four large figures in a strip under the hero. */
  figures?: PosterFigure[];
  /** Bottom left: the same entities as circles sized by a value and joined by lines, placed by hand with `x` and `y` if wanted (`bubble-network`). Config `{ data, name, value, links?, x?, y?, ... }`, or a full spec. */
  map?: Region<Partial<BubbleNetworkProps>>;
  /** Bottom right: the entities ranked by one measure as centred pills (`pill-rank`). Config `{ data, name, value, ... }`, or a full spec. */
  rank?: Region<Partial<PillRankProps>>;
}

/**
 * Who is connected to whom. The hero is an arc diagram across the sheet, a strip of figures sits
 * under it, and the same entities return below as a small map of circles and as a ranking.
 */
function NetworkPosterImpl({ hero, figures, map, rank, theme = "dusk", mode = "light", download, maxWidth = 1100, linked, data, kicker, title, subtitle, sources, note, credit, level, className, style }: NetworkPosterProps) {
  const [ref, measured] = useContainerWidth<HTMLDivElement>(1100);
  const { bind, wrap, picked } = useInfographicLink(linked, data);
  const sheet = Math.min(measured, typeof maxWidth === "number" ? maxWidth : measured);
  const inner = Math.max(240, sheet - 2 * (sheet < 600 ? 20 : sheet < 900 ? 36 : 56));
  const figs = (figures ?? []).slice(0, 4);

  const mapPanel = regionPanel(map, "bubble-network", { name: "name", value: "value" }, { id: "map" });
  const rankPanel = regionPanel(rank, "pill-rank", { name: "name", value: "value" }, { id: "rank", valign: "center" });
  const both = !!mapPanel && !!rankPanel && sheet >= 900;
  if (mapPanel) mapPanel.span = both ? 7 : 12;
  if (rankPanel) rankPanel.span = both ? 5 : 12;

  // The shared link matches panels by `name`; an arc diagram names its entities in `from` and `to`,
  // so a name picked in another graphic is passed to it here.
  const bindArcs = (id: string, slot: Slot): Slot => {
    const bound = bind(id, slot);
    if (!linked || !picked.length || !isSpec(bound) || bound.type !== "arc-diagram" || bound.highlight !== undefined) return bound;
    const spec = bound as InsightSpec;
    const rows = (Array.isArray(spec.data) ? spec.data : []) as Row[];
    const ends = [spec.from, spec.to].filter((f): f is string => typeof f === "string");
    return rows.some((r) => ends.some((f) => picked.includes(String(r[f] ?? "")))) ? { ...spec, highlight: picked } : bound;
  };

  const panels = linkPanels(
    [
      regionPanel(hero, "arc-diagram", { from: "from", to: "to", value: "value" }, { id: "hero", span: 12 }),
      figs.length ? { id: "figures", span: 12, content: <_PosterFigures figures={figs} columns={_figureColumns(figs.length, inner)} slot="ic-network-poster-figures" /> } : null,
      mapPanel,
      rankPanel,
    ],
    (id, slot) => (id === "figures" ? slot : bindArcs(id, slot)),
  );
  return (
    <div ref={ref} data-slot="ic-network-poster" className={className} style={{ width: "100%", minWidth: 0, ...style }}>
      {wrap(<Poster kicker={kicker} title={title} subtitle={subtitle} panels={panels} columns={12} theme={theme} mode={mode} download={download} maxWidth={maxWidth} sources={sources} note={note} credit={credit} level={level} />)}
    </div>
  );
}

// Example data. The Skerry Isles ferries, the Norland institutes and the Halden rail yards are invented; every figure is illustrative.
const crossings = [
  ["Port Aven", "Brae", 412], ["Port Aven", "Storholm", 268], ["Port Aven", "Little Skerry", 96], ["Brae", "Storholm", 187], ["Brae", "Tarn Head", 74],
  ["Storholm", "Tarn Head", 153], ["Storholm", "Ness", 121], ["Tarn Head", "Ness", 88], ["Ness", "Outer Holm", 43], ["Little Skerry", "Brae", 52],
  ["Port Aven", "Ness", 139], ["Storholm", "Outer Holm", 31],
].map(([a, b, k]) => ({ a, b, k }));
const harbours = [
  { harbour: "Port Aven", k: 915, x: 12, y: 62 },
  { harbour: "Little Skerry", k: 148, x: 22, y: 18 },
  { harbour: "Brae", k: 725, x: 38, y: 40 },
  { harbour: "Storholm", k: 760, x: 56, y: 80 },
  { harbour: "Tarn Head", k: 315, x: 66, y: 22 },
  { harbour: "Ness", k: 391, x: 84, y: 46 },
  { harbour: "Outer Holm", k: 74, x: 93, y: 82 },
];
const harbourLinks = crossings.map((c) => ({ from: String(c.a), to: String(c.b) }));
const sailings = [
  { harbour: "Port Aven", sailings: 46 },
  { harbour: "Storholm", sailings: 38 },
  { harbour: "Brae", sailings: 33 },
  { harbour: "Ness", sailings: 21 },
  { harbour: "Tarn Head", sailings: 16 },
  { harbour: "Little Skerry", sailings: 8 },
  { harbour: "Outer Holm", sailings: 4 },
];

const papers = [
  ["Marlow", "Halden", 84], ["Marlow", "Orrin", 61], ["Marlow", "Carrow", 37], ["Halden", "Orrin", 52], ["Halden", "Kestrel", 29],
  ["Orrin", "Carrow", 44], ["Orrin", "Aldern", 18], ["Carrow", "Kestrel", 23], ["Kestrel", "Aldern", 12], ["Marlow", "Aldern", 9],
].map(([a, b, papers]) => ({ a, b, papers }));
const institutes = [
  { institute: "Marlow", staff: 640 },
  { institute: "Halden", staff: 510 },
  { institute: "Orrin", staff: 470 },
  { institute: "Carrow", staff: 290 },
  { institute: "Kestrel", staff: 180 },
  { institute: "Aldern", staff: 95 },
];

const wagons = [
  ["Northgate", "Mill Lane", 310], ["Northgate", "Quarry Junction", 190], ["Mill Lane", "Quarry Junction", 240], ["Mill Lane", "Harbour East", 420],
  ["Quarry Junction", "Harbour East", 160], ["Harbour East", "Southfield", 280], ["Northgate", "Southfield", 70],
].map(([a, b, wagons]) => ({ a, b, wagons }));

export const NetworkPoster = withMeta(NetworkPosterImpl, {
  name: "network-poster",
  component: "NetworkPoster",
  title: "Network poster",
  level: "template",
  category: "infographic",
  description: "A poster of who is connected to whom: a full-width arc diagram with one arc per connection, as thick as its value (`arc-diagram`), a strip of two to four large figures, and a bottom row where the same entities return as circles joined by lines (`bubble-network`) and as a ranking of centred pills (`pill-rank`).",
  whenToUse: "Use it when the connections between 5 to about 20 named things are the subject: ferry crossings between harbours, joint papers between institutes, freight between rail yards. Give `hero` one row per connection and the `order` the entities sit in, `map` the entities with a size and optional hand-placed `x` and `y`, and `rank` one measure of each entity. With `linked`, a click on an entity in any of the three highlights it in the other two.",
  avoid: "A flow from sources to destinations in one direction (use `flow-poster` or `sankey-chart`). More than about 20 entities or 40 connections, because the arcs cover each other. Entities with no meaningful order and few links (use `bubble-network` in a `poster`). Parts of one subject (use `radial-poster`).",
  composes: ["poster", "arc-diagram", "bubble-network", "pill-rank"],
  props: [
    { name: "hero", type: "{ data, from, to, value?, order?, colorBy?, arcLabels?, orientation?, format?, highlight?, title?, ... } | Slot", required: true, description: "The hero: one arc per pair of connected entities, drawn by `arc-diagram`. Rows joining the same pair are summed. A full spec or element replaces it." },
    { name: "figures", type: figureDoc, description: "Two to four large figures in a strip under the hero." },
    { name: "map", type: "{ data, name, value, links?, x?, y?, layout?, tag?, highlight?, format?, title?, ... } | Slot", description: "Bottom left: the entities as circles sized by `value` and joined by `links: { from, to, value? }[]` (`bubble-network`). `x` and `y` (0 to 100) place the circles by hand." },
    { name: "rank", type: "{ data, name, value, highlight?, compare?, format?, title?, ... } | Slot", description: "Bottom right: the entities ranked by one measure as centred pills (`pill-rank`). With only one of `map` and `rank`, that one takes the full width." },
    ...frameDocs("dusk", 1100),
  ],
  example: {
    type: "network-poster",
    theme: "dusk",
    linked: true,
    kicker: "Ferries",
    title: "Skerry Isles ferries carried 1.66 million passengers on 12 routes in 2025",
    subtitle: "Passengers carried between pairs of harbours, thousands, both directions, 2025.",
    hero: { data: crossings, from: "a", to: "b", value: "k", order: ["Port Aven", "Little Skerry", "Brae", "Storholm", "Tarn Head", "Ness", "Outer Holm"], colorBy: "series", format: "{value}k", title: "412,000 passengers crossed between Port Aven and Brae" },
    figures: [
      { value: "412k", label: "passengers on the busiest route", context: "Port Aven to Brae" },
      { value: "31k", label: "passengers on the quietest route", context: "Storholm to Outer Holm" },
      { value: "4", label: "of the 12 routes call at Port Aven" },
    ],
    map: { data: harbours, name: "harbour", value: "k", x: "x", y: "y", links: harbourLinks, format: "{value}k", highlight: "Port Aven", tag: "Busiest harbour", title: "915,000 passengers used Port Aven", subtitle: "Passengers through each harbour, thousands. Positions are approximate." },
    rank: { data: sailings, name: "harbour", value: "sailings", title: "Port Aven had 46 sailings a day", subtitle: "Scheduled departures per day, summer 2025." },
    sources: "Skerry Isles Ferries, annual traffic return 2025",
    note: "The Skerry Isles are invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
});

export const examples = {
  "Noir, joint papers, a hub layout, with download": {
    theme: "noir",
    download: true,
    kicker: "Research",
    title: "Six Norland institutes published 369 joint papers in 2025",
    subtitle: "Papers with authors at two of the six institutes, by pair, 2025.",
    hero: { data: papers, from: "a", to: "b", value: "papers", order: ["Marlow", "Halden", "Orrin", "Carrow", "Kestrel", "Aldern"], colorBy: "none", highlight: "Marlow", title: "Marlow and Halden shared 84 papers" },
    figures: [
      { value: "191", label: "of the 369 papers had a Marlow author" },
      { value: "84", label: "papers were shared by Marlow and Halden" },
      { value: "39", label: "papers had an Aldern author" },
    ],
    map: { data: institutes, name: "institute", value: "staff", layout: "hub", links: papers.map((p) => ({ from: String(p.a), to: String(p.b), value: Number(p.papers) })), highlight: "Marlow", tag: "640 researchers", linkLabels: false, title: "Marlow employed 640 researchers", subtitle: "Research staff at each institute. Line width is the number of joint papers." },
    rank: { data: institutes, name: "institute", value: "staff", highlight: "Marlow", title: "Aldern employed 95 researchers" },
    sources: "Norland Research Council, publication register 2025",
    note: "The institutes are invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
  "Forest, five rail yards, arcs and figures only": {
    theme: "forest",
    kicker: "Rail freight",
    title: "Halden's five rail yards exchanged 1,670 wagons a week in 2025",
    subtitle: "Wagons moved between pairs of yards per week, both directions, average for 2025.",
    hero: { data: wagons, from: "a", to: "b", value: "wagons", order: ["Northgate", "Mill Lane", "Quarry Junction", "Harbour East", "Southfield"], colorBy: "series", title: "Mill Lane and Harbour East exchanged 420 wagons a week" },
    figures: [
      { value: "420", label: "wagons a week on the busiest pair" },
      { value: "70", label: "wagons a week between Northgate and Southfield" },
    ],
    sources: "Halden Rail Freight, yard movements 2025",
    note: "The Halden yards are invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
};
