import { withMeta } from "../core/meta";
import { isSpec } from "../core/spec";
import { useContainerWidth } from "../core/use-container-width";
import { toNumber } from "../data/transform";
import type { Row } from "../data/types";
import { Poster } from "../molecules/poster";
import { frameDocs, linkPanels, regionPanel, useInfographicLink, type InfographicFrameProps, type Region } from "./_infographic-layout";

export interface FlowPosterProps extends InfographicFrameProps {
  /** Top band: the producers as large labelled tiles (`treemap`). Config `{ data, name, value, title?, source? }`, or a full spec. */
  producers: Region<{ name?: string; value?: string }>;
  /** The producer the flow starts from, painted in the accent in the top band. Default: the largest. */
  lead?: string;
  /** Middle band: what the leading producer sends to each destination (`fan-flow`). Config `{ data, name, value, trunk?, title? }`. */
  flow: Region<{ name?: string; value?: string; trunk?: string }>;
  /** Bottom band: the destinations placed on a dependency scale and sized by a second measure (`bubble-scale`). Config `{ data, name, value, size, scaleLabel?, title? }`. */
  scale?: Region<{ name?: string; value?: string; size?: string; scaleLabel?: string }>;
  /** How to print the quantities of the top and middle bands. */
  format?: unknown;
}

/** Name of the largest row, when the region is a compact config. */
function largest(region: unknown): string | undefined {
  if (!region || typeof region !== "object" || isSpec(region) || "$$typeof" in region) return undefined;
  const { data, name = "name", value = "value" } = region as { data?: Row[]; name?: string; value?: string };
  if (!Array.isArray(data) || !data.length) return undefined;
  const top = data.reduce((a, b) => ((toNumber(b[value]) || 0) > (toNumber(a[value]) || 0) ? b : a));
  return String(top[name] ?? "");
}

/**
 * Where something comes from and where it goes, as three stacked bands in one colour: the
 * producers as tiles, the leading producer's output fanning out to its destinations, and the
 * destinations placed on a scale of how much they depend on it.
 */
function FlowPosterImpl({ producers, lead, flow, scale, format, theme = "magenta", mode = "light", download, maxWidth = 920, linked, data, kicker, title, subtitle, sources, note, credit, level, className, style }: FlowPosterProps) {
  const [ref, measured] = useContainerWidth<HTMLDivElement>(920);
  const { bind, wrap } = useInfographicLink(linked, data);
  const sheet = Math.min(measured, typeof maxWidth === "number" ? maxWidth : measured);
  const phone = sheet < 600;
  const from = lead ?? largest(producers);

  const panels = linkPanels(
    [
      // The leading tile takes the accent and the rest step back, so the eye starts where the flow does.
      regionPanel(producers, "treemap", { name: "name", value: "value", format, highlight: from, height: phone ? 300 : Math.round(Math.max(300, Math.min(400, sheet * 0.4))) }, { id: "producers", span: 12 }),
      // One colour for every ribbon: the band continues the accent tile above it.
      regionPanel(flow, "fan-flow", { name: "name", value: "value", format, colorBy: "none", trunk: from }, { id: "flow", span: 12 }),
      regionPanel(scale, "bubble-scale", { name: "name", value: "value", size: "size", format: "{value}%", orientation: "horizontal", domain: [0, 100], ticks: [0, 25, 50, 75, 100], height: phone ? 520 : 400 }, { id: "scale", span: 12 }),
    ],
    bind,
  );

  return (
    <div ref={ref} data-slot="ic-flow-poster" className={className} style={{ width: "100%", minWidth: 0, ...style }}>
      {wrap(<Poster kicker={kicker} title={title} subtitle={subtitle} panels={panels} theme={theme} mode={mode} download={download} maxWidth={maxWidth} sources={sources} note={note} credit={credit} level={level} />)}
    </div>
  );
}

// Example data. The Verran Coast, Norrask and the Port of Hallin are invented; every figure is illustrative.
const ports = [
  { port: "Port Alda", kt: 148 },
  { port: "Skerry", kt: 96 },
  { port: "Marrow Bay", kt: 71 },
  { port: "Tolven", kt: 52 },
  { port: "Hask", kt: 28 },
  { port: "Lund", kt: 17 },
];
const aldaBuyers = [
  { buyer: "Canneries", kt: 46 },
  { buyer: "Fresh markets", kt: 34 },
  { buyer: "Frozen export", kt: 29 },
  { buyer: "Fishmeal plants", kt: 21 },
  { buyer: "Restaurants", kt: 11 },
  { buyer: "Smokehouses", kt: 7 },
];
const buyerDependence = [
  { buyer: "Canneries", fromAlda: 56, kt: 82 },
  { buyer: "Fresh markets", fromAlda: 35, kt: 96 },
  { buyer: "Frozen export", fromAlda: 23, kt: 124 },
  { buyer: "Fishmeal plants", fromAlda: 34, kt: 61 },
  { buyer: "Restaurants", fromAlda: 29, kt: 38 },
  { buyer: "Smokehouses", fromAlda: 64, kt: 11 },
];

const regions = [
  { region: "Fjordland", twh: 64 },
  { region: "Highmoor", twh: 41 },
  { region: "Eastmark", twh: 33 },
  { region: "Sundby", twh: 22 },
  { region: "Lowlands", twh: 15 },
];
const fjordlandUsers = [
  { user: "Fjordland homes", twh: 22 },
  { user: "Capital region", twh: 14 },
  { user: "Aluminium smelters", twh: 11 },
  { user: "Export to Vesterhav", twh: 8 },
  { user: "Export to Kalmar", twh: 5 },
  { user: "Data centres", twh: 4 },
];
const userDependence = [
  { user: "Fjordland homes", share: 81, twh: 27 },
  { user: "Capital region", share: 38, twh: 37 },
  { user: "Aluminium smelters", share: 92, twh: 12 },
  { user: "Export to Vesterhav", share: 12, twh: 67 },
  { user: "Export to Kalmar", share: 7, twh: 71 },
  { user: "Data centres", share: 57, twh: 7 },
];

const terminals = [
  { terminal: "North Quay", teu: 3400 },
  { terminal: "Delta", teu: 2300 },
  { terminal: "Old Dock", teu: 1700 },
  { terminal: "Riverside", teu: 1300 },
  { terminal: "Eastgate", teu: 900 },
];
const quayRoutes = [
  { route: "Mereford by rail", teu: 980 },
  { route: "Castren by rail", teu: 720 },
  { route: "Ulm Lakes by barge", teu: 610 },
  { route: "Hallin city by road", teu: 520 },
  { route: "Dunmore by road", teu: 340 },
  { route: "Skaw by feeder ship", teu: 230 },
];
const cityDependence = [
  { route: "Mereford by rail", share: 70, teu: 1400 },
  { route: "Castren by rail", share: 45, teu: 1600 },
  { route: "Ulm Lakes by barge", share: 80, teu: 760 },
  { route: "Hallin city by road", share: 25, teu: 2080 },
  { route: "Dunmore by road", share: 30, teu: 1130 },
  { route: "Skaw by feeder ship", share: 10, teu: 2300 },
];

export const FlowPoster = withMeta(FlowPosterImpl, {
  name: "flow-poster",
  component: "FlowPoster",
  title: "Flow poster",
  level: "template",
  category: "infographic",
  description: "A portrait poster of where something comes from and where it goes, in three stacked bands painted in one colour: the producers as large labelled tiles, the leading producer's output fanning out as ribbons to an aligned column of destinations, and the destinations as bubbles on a scale of how much each depends on that producer.",
  whenToUse: "Use it when one producer leads and the reader should follow its output: ports and the buyers of one port's catch, regions and the users of one region's electricity, terminals and the routes out of the largest. Give `producers` 4 to 10 rows, `flow` 4 to 12 destinations of the leading producer, and `scale` the same destinations with a share (position) and a size. Keep the destination names identical in `flow` and `scale` so `linked` can join them.",
  avoid: "Flows through more than one stage or between many sources and many destinations (use `sankey-chart` in a `poster`). A count of people or things (use `count-poster`). Many measures of the same entities (use `matrix-poster`).",
  composes: ["poster", "treemap", "fan-flow", "bubble-scale"],
  props: [
    { name: "producers", type: "{ data, name, value, title?, subtitle?, source?, ...treemap props } | Slot", required: true, description: "Top band: the producers as tiles sized by output (`treemap`). The leading one is painted in the accent." },
    { name: "lead", type: "string", description: "The producer the flow starts from. Default: the largest row of `producers`. It names the block the ribbons leave." },
    { name: "flow", type: "{ data, name, value, trunk?, tagged?, tagLabel?, title?, ...fan-flow props } | Slot", required: true, description: "Middle band: one ribbon per destination, as thick as its value, ending at a column of names, values and shares (`fan-flow`)." },
    { name: "scale", type: "{ data, name, value, size, scaleLabel?, sizeFormat?, title?, ...bubble-scale props } | Slot", description: "Bottom band: one bubble per destination, placed by `value` on a 0 to 100 scale and sized by `size` (`bubble-scale`). Set `domain` and `ticks` for a scale that is not a percentage." },
    { name: "format", type: "FormatSpec", description: 'How to print the quantities of the top and middle bands, e.g. `"{value} kt"`.' },
    ...frameDocs("magenta", 920),
  ],
  example: {
    type: "flow-poster",
    theme: "magenta",
    kicker: "Fishing",
    title: "Six ports on the Verran Coast landed 412,000 tonnes of fish in 2025",
    subtitle: "Landings by port, the buyers of Port Alda's catch, and how much each buyer relies on Port Alda. Thousand tonnes (kt).",
    format: "{value} kt",
    producers: { data: ports, name: "port", value: "kt", title: "Port Alda landed 148,000 of the 412,000 tonnes" },
    flow: { data: aldaBuyers, name: "buyer", value: "kt", trunk: "Port Alda", title: "Canneries bought 46,000 tonnes of Port Alda's catch" },
    scale: { data: buyerDependence, name: "buyer", value: "fromAlda", size: "kt", sizeFormat: "{value} kt", scaleLabel: "From Port Alda", title: "Smokehouses bought 64% of their fish from Port Alda", subtitle: "Share of each buyer's fish landed at Port Alda (position) and all the fish it bought (area)" },
    sources: "Verran Coast Fisheries Board landing returns",
    note: "The Verran Coast is an invented place. All figures are illustrative.",
    credit: "InsightCharts",
  },
});

export const examples = {
  "Ocean, electricity from one region, linked": {
    theme: "ocean",
    linked: true,
    kicker: "Energy",
    title: "Norrask generated 175 TWh of electricity in 2025",
    subtitle: "Generation by region, the users of Fjordland's output, and Fjordland's share of each user's supply. Terawatt-hours (TWh).",
    format: "{value} TWh",
    producers: { data: regions, name: "region", value: "twh", title: "Fjordland generated 64 of the 175 TWh" },
    flow: { data: fjordlandUsers, name: "user", value: "twh", trunk: "Fjordland", tagged: ["Export to Vesterhav", "Export to Kalmar"], tagLabel: "Leaves the country", title: "Fjordland's own homes used 22 of its 64 TWh" },
    scale: { data: userDependence, name: "user", value: "share", size: "twh", sizeFormat: "{value} TWh", scaleLabel: "From Fjordland", title: "Aluminium smelters took 92% of their electricity from Fjordland", subtitle: "Fjordland's share of each user's electricity (position) and the user's total demand (area)" },
    sources: "Norrask Grid Agency annual balance",
    note: "Norrask is an invented country. All figures are illustrative.",
    credit: "InsightCharts",
  },
  "Sunrise, containers through one port, with download": {
    theme: "sunrise",
    download: true,
    kicker: "Trade",
    title: "The Port of Hallin handled 9.6 million containers in 2025",
    subtitle: "Containers by terminal, the routes out of North Quay, and North Quay's share of each destination's containers. Thousand containers.",
    format: "integer",
    producers: { data: terminals, name: "terminal", value: "teu", title: "North Quay handled 3.4 million of the 9.6 million containers" },
    flow: { data: quayRoutes, name: "route", value: "teu", trunk: "North Quay", title: "980,000 containers left North Quay by rail for Mereford" },
    scale: { data: cityDependence, name: "route", value: "share", size: "teu", sizeFormat: "integer", scaleLabel: "Via North Quay", title: "Ulm Lakes received 80% of its containers through North Quay", subtitle: "North Quay's share of each destination's containers (position) and all the containers it received, thousands (area)" },
    sources: "Hallin Port Authority throughput statistics",
    note: "The Port of Hallin is an invented port. All figures are illustrative.",
    credit: "InsightCharts",
  },
};
