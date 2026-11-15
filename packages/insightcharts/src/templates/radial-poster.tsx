import { OrbitChart, type OrbitChartProps } from "../atoms/orbit-chart";
import { PillRank, type PillRankProps } from "../atoms/pill-rank";
import { RadialSpokes, type RadialSpokesProps } from "../atoms/radial-spokes";
import { withMeta } from "../core/meta";
import { registerComponents } from "../core/spec";
import { useContainerWidth } from "../core/use-container-width";
import { Poster, type PosterPanel } from "../molecules/poster";
import { frameDocs, linkPanels, regionPanel, useInfographicLink, type InfographicFrameProps, type Region } from "./_infographic-layout";
import { _figureColumns, _PosterFigures, figureDoc, type PosterFigure } from "./_poster-figures";

// Specs in the regions resolve without the host calling registerAll().
registerComponents({ RadialSpokes, OrbitChart, PillRank });

export interface RadialPosterProps extends InfographicFrameProps {
  /** The hero: the parts, effects or scores of one subject as spokes round a centre disc (`radial-spokes`). Config `{ data, name, value, icon?, centerLabel?, ... }`, or a full spec. */
  hero: Region<Partial<RadialSpokesProps>>;
  /** Two to four large figures. On a sheet at least 960px wide they stand in two columns either side of the hero; on a narrower one they run in a row under it. */
  figures?: PosterFigure[];
  /** Bottom left: named things on concentric rings round the same subject (`orbit-chart`). Config `{ data, name, ring, value?, ... }`, or a full spec. */
  rings?: Region<Partial<OrbitChartProps>>;
  /** Bottom right: a ranking as centred pills (`pill-rank`). Config `{ data, name, value, ... }`, or a full spec. */
  rank?: Region<Partial<PillRankProps>>;
}

/**
 * One subject in the middle of the sheet. The hero is a wheel of spokes round an icon, large
 * figures stand either side of it, and two smaller graphics close the poster.
 */
function RadialPosterImpl({ hero, figures, rings, rank, theme = "magenta", mode = "light", download, maxWidth = 1100, linked, data, kicker, title, subtitle, sources, note, credit, level, className, style }: RadialPosterProps) {
  const [ref, measured] = useContainerWidth<HTMLDivElement>(1100);
  const { bind, wrap } = useInfographicLink(linked, data);
  const sheet = Math.min(measured, typeof maxWidth === "number" ? maxWidth : measured);
  const figs = (figures ?? []).slice(0, 4);
  // The wheel needs about 480px to set its labels on the ring, so the figures flank it only on a wide sheet.
  const flank = sheet >= 960 && figs.length >= 2;
  const wide = sheet >= 900;
  const inner = Math.max(240, sheet - 2 * (sheet < 600 ? 20 : sheet < 900 ? 36 : 56));

  const heroPanel = regionPanel(hero, "radial-spokes", { name: "name", value: "value" }, { id: "hero", span: flank ? 6 : 12 });
  const column = (list: PosterFigure[], id: string): PosterPanel => ({ id, span: 3, valign: "center", content: <_PosterFigures figures={list} columns={1} max={72} slot="ic-radial-poster-figures" /> });
  const half = Math.ceil(figs.length / 2);
  const top: (PosterPanel | null)[] = flank
    ? [column(figs.slice(0, half), "figures-left"), heroPanel, column(figs.slice(half), "figures-right")]
    : [heroPanel, figs.length ? { id: "figures", span: 12, content: <_PosterFigures figures={figs} columns={_figureColumns(figs.length, inner)} slot="ic-radial-poster-figures" /> } : null];

  const ringsPanel = regionPanel(rings, "orbit-chart", { name: "name", ring: "ring" }, { id: "rings" });
  const rankPanel = regionPanel(rank, "pill-rank", { name: "name", value: "value" }, { id: "rank" });
  const both = !!ringsPanel && !!rankPanel && wide;
  if (ringsPanel) ringsPanel.span = both ? 7 : 12;
  if (rankPanel) rankPanel.span = both ? 5 : 12;

  const panels = linkPanels([...top, ringsPanel, rankPanel], (id, slot) => (id.startsWith("figures") ? slot : bind(id, slot)));
  return (
    <div ref={ref} data-slot="ic-radial-poster" className={className} style={{ width: "100%", minWidth: 0, ...style }}>
      {wrap(<Poster kicker={kicker} title={title} subtitle={subtitle} panels={panels} columns={12} gap={flank ? 24 : undefined} theme={theme} mode={mode} download={download} maxWidth={maxWidth} sources={sources} note={note} credit={credit} level={level} />)}
    </div>
  );
}

// Example data. Verne Street, the Halden oak survey and the Carrow house are invented; every figure is illustrative.
const water = [
  { use: "Shower", litres: 44 },
  { use: "Toilet", litres: 31 },
  { use: "Washing machine", litres: 19 },
  { use: "Kitchen tap", litres: 17 },
  { use: "Garden", litres: 12 },
  { use: "Dishwasher", litres: 9 },
  { use: "Bath", litres: 6 },
  { use: "Other", litres: 4 },
];
const fixtures = [
  { fixture: "Bath", room: "Bathroom", litres: 80 },
  { fixture: "Shower, 8 min", room: "Bathroom", litres: 64 },
  { fixture: "Toilet flush", room: "Bathroom", litres: 6 },
  { fixture: "Washing machine", room: "Kitchen", litres: 50 },
  { fixture: "Dishwasher", room: "Kitchen", litres: 12 },
  { fixture: "Washing-up bowl", room: "Kitchen", litres: 8 },
  { fixture: "Hose, 10 min", room: "Garden", litres: 150 },
  { fixture: "Watering can", room: "Garden", litres: 10 },
];
const districts = [
  { district: "Harbour", litres: 168 },
  { district: "Old Town", litres: 155 },
  { district: "Verne Street", litres: 142 },
  { district: "Northgate", litres: 136 },
  { district: "Riverside", litres: 129 },
  { district: "Mill Lane", litres: 117 },
];

const oak = [
  { group: "Insects", species: 126 },
  { group: "Lichens", species: 58 },
  { group: "Fungi", species: 41 },
  { group: "Birds", species: 23 },
  { group: "Mosses", species: 19 },
  { group: "Mammals", species: 11 },
  { group: "Spiders", species: 6 },
];
const treeSpecies = [
  { tree: "Oak", species: 284 },
  { tree: "Willow", species: 251 },
  { tree: "Birch", species: 229 },
  { tree: "Hawthorn", species: 149 },
  { tree: "Beech", species: 98 },
  { tree: "Ash", species: 68 },
];

const houseEnergy = [
  { use: "Heating", kwh: 5900 },
  { use: "Hot water", kwh: 2100 },
  { use: "Car charging", kwh: 1800 },
  { use: "Appliances", kwh: 900 },
  { use: "Cooking", kwh: 450 },
  { use: "Lighting", kwh: 250 },
];
const houseCost = [
  { use: "Heating", eur: 1298 },
  { use: "Hot water", eur: 462 },
  { use: "Car charging", eur: 306 },
  { use: "Appliances", eur: 252 },
  { use: "Cooking", eur: 126 },
  { use: "Lighting", eur: 70 },
];

export const RadialPoster = withMeta(RadialPosterImpl, {
  name: "radial-poster",
  component: "RadialPoster",
  title: "Radial poster",
  level: "template",
  category: "infographic",
  description: "A poster with one subject in the middle of the sheet: a wheel of spokes round an icon (`radial-spokes`), two to four large figures standing either side of it, and a bottom row with the same subject's surroundings on concentric rings (`orbit-chart`) and a ranking as centred pills (`pill-rank`).",
  whenToUse: "Use it when the poster is about the 4 to 12 parts, causes, effects or scores of one thing: what a household's water goes on, the species one tree supports, where one home's energy goes. Give `hero` the spokes and an `icon` for the centre, state the total in the title, and use `figures` for the two to four numbers a reader should take away.",
  avoid: "Parts of a whole that must be compared precisely (use `bar-chart` in a `poster`). Positions on one scale (use `scale-poster`). Change over time (use `timeline-poster`). Connections between many things (use `network-poster`). Large counts shown as crowds (use `count-poster`).",
  composes: ["poster", "radial-spokes", "orbit-chart", "pill-rank"],
  props: [
    { name: "hero", type: "{ data, name, value, icon?, centerLabel?, shape?, sweep?, max?, highlight?, format?, title?, ... } | Slot", required: true, description: "The hero: one spoke per row round a centre disc, drawn by `radial-spokes`. A full spec or element replaces it." },
    { name: "figures", type: figureDoc, description: "Two to four large figures. On a sheet at least 960px wide they stand in two columns either side of the hero; on a narrower one they run in a row under it." },
    { name: "rings", type: "{ data, name, ring, value?, rings?, ringLabel?, sizeLabel?, icon?, centerLabel?, title?, ... } | Slot", description: "Bottom left: named things on concentric rings, one ring per category, level or period (`orbit-chart`)." },
    { name: "rank", type: "{ data, name, value, highlight?, compare?, format?, title?, ... } | Slot", description: "Bottom right: a ranking as centred pills (`pill-rank`). With only one of `rings` and `rank`, that one takes the full width." },
    ...frameDocs("magenta", 1100),
  ],
  example: {
    type: "radial-poster",
    theme: "magenta",
    kicker: "Water",
    title: "A person on Verne Street used 142 litres of water a day in 2025",
    subtitle: "Litres of mains water per person per day by use, 212 metered homes, 2025.",
    hero: { data: water, name: "use", value: "litres", icon: "drop", format: "{value} L", highlight: "Shower" },
    figures: [
      { value: "44 L", label: "went on showers", context: "31% of the daily total" },
      { value: "9 min", label: "was the average length of a shower" },
      { value: "6 L", label: "went on baths" },
      { value: "€1.12", label: "was the cost of one person's water for a day" },
    ],
    rings: { data: fixtures, name: "fixture", ring: "room", value: "litres", format: "{value} L", icon: "house", ringLabel: "One ring per room", sizeLabel: "litres per use", highlight: "Hose, 10 min", title: "Ten minutes with a hose used 150 litres", height: 460 },
    rank: { data: districts, name: "district", value: "litres", format: "{value} L", highlight: "Verne Street", title: "Verne Street ranked third of six districts" },
    sources: "Verne Street metering study 2025",
    note: "Verne Street and its figures are invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
});

export const examples = {
  "Forest, one tree, no rings, with download": {
    theme: "forest",
    download: true,
    kicker: "Woodland",
    title: "One oak in Halden Wood supported 284 species in 2025",
    subtitle: "Species recorded on a single 180-year-old oak by group, April to September 2025.",
    hero: { data: oak, name: "group", value: "species", icon: "tree", shape: "line", highlight: "Insects" },
    figures: [
      { value: "126", label: "of the 284 species were insects" },
      { value: "180", label: "years is the age of the tree" },
      { value: "23", label: "bird species fed or nested on it" },
      { value: "58", label: "lichens grew on its bark" },
    ],
    rank: { data: treeSpecies, name: "tree", value: "species", highlight: "Oak", title: "Willow supported 251 species" },
    sources: "Halden Wood survey 2025",
    note: "Halden Wood is an invented place. All figures are illustrative.",
    credit: "InsightCharts",
  },
  "Noir, a half wheel, linked to the ranking": {
    theme: "noir",
    linked: true,
    kicker: "Home energy",
    title: "Heating took 5,900 of the 11,400 kWh one Carrow house used in 2025",
    subtitle: "Electricity used by one all-electric house by end use, kilowatt-hours, 2025.",
    hero: { data: houseEnergy, name: "use", value: "kwh", icon: "house", sweep: 180, startAngle: -90, format: "{value} kWh" },
    figures: [
      { value: "52%", label: "of the electricity went on heating" },
      { value: "€2,514", label: "was the electricity bill for the year" },
    ],
    rank: { data: houseCost, name: "use", value: "eur", format: "€{value}", title: "Heating cost €1,298 of the €2,514" },
    sources: "Carrow house smart-meter export",
    note: "The Carrow house is invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
};
