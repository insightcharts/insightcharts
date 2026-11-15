import { withMeta } from "../core/meta";
import { isSpec } from "../core/spec";
import { toNumber } from "../data/transform";
import type { Row } from "../data/types";
import { useContainerWidth } from "../core/use-container-width";
import { Poster, type PosterPanel } from "../molecules/poster";
import { _InfographicStat, frameDocs, isFigure, linkPanels, posterTokens, regionPanel, useInfographicLink, type InfographicFigure, type InfographicFrameProps, type Region } from "./_infographic-layout";

export interface RankingPosterProps extends InfographicFrameProps {
  /** Top row: two figures. Each is a statement `{ value, label, context?, icon? }` set in large type, or a config for filled silhouettes (`shape-fill`): `{ data, name, value, icon, title? }`. */
  figures?: (InfographicFigure | Region<{ name?: string; value?: string; icon?: string }>)[];
  /** Second row: the subject split two ways, as two treemaps side by side. Each `{ data, name, value, title? }`. */
  breakdowns?: Region<{ name?: string; value?: string }>[];
  /** Third row, full width: the ranking as centred pills (`pill-rank`). `{ data, name, value, highlight?, compare?, title? }`. */
  ranking: Region<{ name?: string; value?: string; highlight?: string | string[] }>;
  /** Bottom left: parts as packed circles with an icon and number inside (`circle-pack`). `{ data, name, value, icon?, title? }`. */
  pack?: Region<{ name?: string; value?: string; icon?: string | Record<string, string> }>;
  /** Bottom right, top: two to four related magnitudes as circles (`stat-circles`). `{ data, name, value, unit?, title? }`. */
  circles?: Region<{ name?: string; value?: string; unit?: string }>;
  /** Bottom right, under the circles: one closing figure in large type. */
  figure?: InfographicFigure;
  /** How to print values where a region sets no `format` of its own. */
  format?: unknown;
}

const statPanel = (figure: InfographicFigure, panel: Partial<PosterPanel>, max: number, tone: "ink" | "accent" = "ink"): PosterPanel => ({ ...panel, valign: "center", content: <_InfographicStat {...figure} max={max} tone={tone} /> });

/** Name of the largest row of a compact config. */
function largest(region: unknown): string | undefined {
  if (!region || typeof region !== "object" || isSpec(region) || "$$typeof" in region) return undefined;
  const { data, name = "name", value = "value" } = region as { data?: Row[]; name?: string; value?: string };
  if (!Array.isArray(data) || !data.length) return undefined;
  return String(data.reduce((a, b) => ((toNumber(b[value]) || 0) > (toNumber(a[value]) || 0) ? b : a))[name] ?? "");
}

/**
 * One subject by the numbers: two figures, two treemaps, a full-width pill ranking with one
 * highlighted row, then packed circles beside a column of sized circles and a closing figure.
 */
function RankingPosterImpl({ figures, breakdowns, ranking, pack, circles, figure, format, theme = "dusk", mode = "light", download, maxWidth = 1100, linked, data, kicker, title, subtitle, sources, note, credit, level, className, style }: RankingPosterProps) {
  const [ref, measured] = useContainerWidth<HTMLDivElement>(1100);
  const { bind, wrap } = useInfographicLink(linked, data);
  const sheet = Math.min(measured, typeof maxWidth === "number" ? maxWidth : measured);
  const phone = sheet < 600;

  const tokens = posterTokens(theme, mode);
  // The two treemaps are told apart by colour: the largest tile of the first takes the accent,
  // the largest of the second the theme's second colour. The other tiles step back.
  const second = { accent: tokens.categorical[1] ?? tokens.accent };
  const top = (figures ?? []).slice(0, 2);
  const maps = (breakdowns ?? []).slice(0, 2);
  const mapHeight = phone ? 260 : Math.round(Math.max(240, Math.min(320, sheet * 0.27)));
  const side = [circles, figure].filter(Boolean).length;
  // Beside the pack the right column holds two blocks; the pack spans both rows.
  const split = !!pack && side > 0;

  const panels = linkPanels(
    [
      ...top.map((f, i) => (isFigure(f) ? statPanel(f, { id: `figure-${i}`, span: 12 / top.length }, 148, i === 0 ? "accent" : "ink") : regionPanel(f as Region, "shape-fill", { name: "name", value: "value", format: "{value}%" }, { id: `figure-${i}`, span: 12 / top.length, valign: "center" }))),
      ...maps.map((m, i) => regionPanel(m, "treemap", { name: "name", value: "value", format, height: mapHeight, highlight: largest(m), ...(i === 1 ? { theme: second } : null) }, { id: `breakdown-${i}`, span: 12 / maps.length })),
      regionPanel(ranking, "pill-rank", { name: "name", value: "value", format }, { id: "ranking", span: 12 }),
      regionPanel(pack, "circle-pack", { name: "name", value: "value", format, height: phone ? 420 : 520 }, { id: "pack", span: split ? 7 : 12, rowSpan: split ? side : 1, valign: "center" }),
      regionPanel(circles, "stat-circles", { name: "name", value: "value", format, layout: "steps", colorBy: "value" }, { id: "circles", span: pack ? 5 : figure ? 7 : 12, valign: "center" }),
      figure ? statPanel(figure, { id: "closing", span: pack || circles ? 5 : 12 }, 120) : null,
    ],
    bind,
  );

  return (
    <div ref={ref} data-slot="ic-ranking-poster" className={className} style={{ width: "100%", minWidth: 0, ...style }}>
      {wrap(<Poster kicker={kicker} title={title} subtitle={subtitle} panels={panels} theme={theme} mode={mode} download={download} maxWidth={maxWidth} sources={sources} note={note} credit={credit} level={level} />)}
    </div>
  );
}

// Example data. The Solvik Festival, the Harrow Valley race and the Calder Reef reserve are invented; every figure is illustrative.
const ticketTypes = [
  { ticket: "Weekend pass", k: 92 },
  { ticket: "Day ticket", k: 61 },
  { ticket: "Camping pass", k: 23 },
  { ticket: "VIP pass", k: 8 },
];
const ticketHomes = [
  { home: "Solvik region", k: 71 },
  { home: "Rest of the country", k: 64 },
  { home: "Neighbouring countries", k: 37 },
  { home: "Further away", k: 12 },
];
const dayFill = [
  { day: "Friday", share: 84 },
  { day: "Saturday", share: 100 },
  { day: "Sunday", share: 91 },
];
const crowds = [
  { act: "Halden Lights", crowd: 61000 },
  { act: "Mirra Sol", crowd: 58500 },
  { act: "The Quiet Engines", crowd: 52000 },
  { act: "Ada Vance", crowd: 47500 },
  { act: "Northfold", crowd: 41000 },
  { act: "Juno Marsh", crowd: 36500 },
  { act: "Saltwater Choir", crowd: 31000 },
  { act: "Okapi Club", crowd: 26500 },
  { act: "Tess Arden", crowd: 22000 },
  { act: "Low Tide Radio", crowd: 17500 },
];
const spending = [
  { item: "Food stalls", k: 3400 },
  { item: "Beer", k: 2900 },
  { item: "Merchandise", k: 2300 },
  { item: "Wine and cocktails", k: 1600 },
  { item: "Soft drinks", k: 1100 },
  { item: "Camping shop", k: 900 },
  { item: "Coffee", k: 700 },
  { item: "Lockers and charging", k: 500 },
  { item: "Water", k: 400 },
  { item: "Ice cream", k: 400 },
];
const waste = [
  { year: "per visitor in 2019", kg: 2.6 },
  { year: "per visitor in 2022", kg: 1.9 },
  { year: "per visitor in 2025", kg: 1.2 },
];

const ageGroups = [
  { age: "Under 30", runners: 4300 },
  { age: "30 to 39", runners: 5900 },
  { age: "40 to 49", runners: 4600 },
  { age: "50 to 59", runners: 2500 },
  { age: "60 and over", runners: 1100 },
];
const runnerHomes = [
  { home: "Harrow Valley", runners: 7900 },
  { home: "Rest of the county", runners: 5200 },
  { home: "Elsewhere in the country", runners: 4400 },
  { home: "Abroad", runners: 900 },
];
const clubs = [
  { club: "Harrow Harriers", runners: 412 },
  { club: "Millbrook AC", runners: 356 },
  { club: "Castle Runners", runners: 298 },
  { club: "Valley Striders", runners: 271 },
  { club: "Eastfield Joggers", runners: 233 },
  { club: "Ridgeway RC", runners: 187 },
  { club: "Canal Path Runners", runners: 164 },
  { club: "Old Mill Milers", runners: 129 },
];
const causes = [
  { cause: "Hospice care", k: 310 },
  { cause: "Children's hospital", k: 260 },
  { cause: "Mountain rescue", k: 150 },
  { cause: "Food bank", k: 140 },
  { cause: "Animal shelter", k: 120 },
  { cause: "School sports", k: 110 },
  { cause: "Tree planting", k: 90 },
  { cause: "Library fund", k: 60 },
  { cause: "Lifeboats", k: 60 },
];
const finishers = [
  { year: "finishers in 2015", runners: 9200 },
  { year: "finishers in 2020", runners: 12600 },
  { year: "finishers in 2025", runners: 18400 },
];

const speciesGroups = [
  { group: "Fish", species: 540 },
  { group: "Molluscs", species: 310 },
  { group: "Corals", species: 190 },
  { group: "Crustaceans", species: 150 },
  { group: "Other", species: 70 },
];
const habitats = [
  { habitat: "Reef crest", species: 430 },
  { habitat: "Lagoon", species: 350 },
  { habitat: "Seagrass beds", species: 260 },
  { habitat: "Deep slope", species: 220 },
];
const sightings = [
  { fish: "Blue chromis", seen: 8400 },
  { fish: "Sergeant major", seen: 7100 },
  { fish: "Bluehead wrasse", seen: 6300 },
  { fish: "Yellowtail snapper", seen: 5200 },
  { fish: "Stoplight parrotfish", seen: 4100 },
  { fish: "French grunt", seen: 3600 },
  { fish: "Queen angelfish", seen: 1900 },
  { fish: "Nassau grouper", seen: 640 },
];
const visits = [
  { activity: "Beach visits", k: 120 },
  { activity: "Snorkelling", k: 86 },
  { activity: "Boat tours", k: 64 },
  { activity: "Scuba diving", k: 41 },
  { activity: "Kayaking", k: 28 },
  { activity: "School trips", k: 14 },
  { activity: "Research stays", k: 6 },
];
const reserveArea = [
  { year: "km² in 2005", km2: 140 },
  { year: "km² in 2015", km2: 310 },
  { year: "km² in 2025", km2: 520 },
];

export const RankingPoster = withMeta(RankingPosterImpl, {
  name: "ranking-poster",
  component: "RankingPoster",
  title: "Ranking poster",
  level: "template",
  category: "infographic",
  description: "A poster of one subject by the numbers, in four rows: two figures in large type or as filled silhouettes, two treemaps side by side, a full-width ranking of centred pills with one row highlighted, and packed circles with icons beside a column of sized circles and a closing figure.",
  whenToUse: "Use it for a profile of one event, place or organisation that has a headline total, two ways to split it, a ranking of 6 to 12 named things and a few supporting magnitudes: a festival, a race, a nature reserve, a library service. Put the total in the title and repeat it as the first figure. Highlight the ranking row the heading is about.",
  avoid: "A subject whose point is a count of people or things (use `count-poster`). Several entities compared on the same measures (use `matrix-poster`). Eight or more small graphics on one subject (use `atlas-poster`). A ranking alone (use `pill-rank` in a `poster`).",
  composes: ["poster", "shape-fill", "treemap", "pill-rank", "circle-pack", "stat-circles"],
  props: [
    { name: "figures", type: "({ value, label, context?, icon? } | { data, name, value, icon, title?, ...shape-fill props } | Slot)[]", description: "Top row, up to two. A statement `{ value, label }` is set in large light type (the first in the accent colour); a config with `data` draws silhouettes filled to their level (`shape-fill`)." },
    { name: "breakdowns", type: "({ data, name, value, title?, ...treemap props } | Slot)[]", description: "Second row, up to two: the subject's total split two ways, as treemaps side by side." },
    { name: "ranking", type: "{ data, name, value, highlight?, compare?, compareLabel?, title?, ...pill-rank props } | Slot", required: true, description: "Third row, full width: a ranking as centred pills with the value at the left and the rank at the right (`pill-rank`). `highlight` names the row drawn in the accent." },
    { name: "pack", type: "{ data, name, value, icon?, group?, title?, ...circle-pack props } | Slot", description: "Bottom left: parts as packed circles (`circle-pack`). `icon` is one icon name or a map from circle name to icon." },
    { name: "circles", type: "{ data, name, value, unit?, title?, ...stat-circles props } | Slot", description: "Bottom right: two to four related magnitudes as circles standing on one baseline (`stat-circles`)." },
    { name: "figure", type: "{ value, label, context?, icon? }", description: "Bottom right, under the circles: one closing figure in large type." },
    { name: "format", type: "FormatSpec", description: "How to print values in the regions that set no `format` of their own." },
    ...frameDocs("dusk", 1100),
  ],
  example: {
    type: "ranking-poster",
    theme: "dusk",
    kicker: "Music",
    title: "The Solvik Festival sold 184,000 tickets in 2025",
    subtitle: "Tickets, crowds and spending at a three-day music festival, 11 to 13 July 2025.",
    figures: [
      { value: "184,000", label: "Tickets sold in 2025", context: "171,000 in 2024" },
      { data: dayFill, name: "day", value: "share", icon: "group", title: "Saturday sold 100% of its 64,000 places" },
    ],
    breakdowns: [
      { data: ticketTypes, name: "ticket", value: "k", format: "{value}k", title: "92,000 tickets were weekend passes" },
      { data: ticketHomes, name: "home", value: "k", format: "{value}k", title: "71,000 ticket holders lived in the Solvik region" },
    ],
    ranking: { data: crowds, name: "act", value: "crowd", format: "integer", highlight: "Halden Lights", title: "Halden Lights played to 61,000 people on Saturday", subtitle: "Largest crowd at each of the ten most-attended acts" },
    pack: {
      data: spending,
      name: "item",
      value: "k",
      format: "€{value}k",
      icon: { "Food stalls": "fork-knife", Beer: "cup", Merchandise: "bag", "Wine and cocktails": "bottle", "Soft drinks": "bottle", "Camping shop": "cart", Coffee: "cup" },
      title: "Visitors spent €3.4 million at food stalls",
      subtitle: "Spending on site by category, thousand euros",
    },
    circles: { data: waste, name: "year", value: "kg", unit: "kg", title: "Each visitor left 1.2 kg of waste in 2025" },
    figure: { value: "€14.2m", label: "Spent on site by visitors in 2025", context: "€77 for each ticket sold" },
    sources: "Solvik Festival annual report 2025",
    note: "The Solvik Festival and its acts are invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
});

export const examples = {
  "Paper, a road race, two statements": {
    theme: "paper",
    kicker: "Sport",
    title: "The Harrow Valley Half Marathon had 18,400 finishers in 2025",
    subtitle: "Finishers, running clubs and money raised at the race on 5 October 2025.",
    figures: [
      { value: "18,400", label: "Finishers in 2025", context: "16,900 in 2024", icon: "flag" },
      { value: "1:58", label: "Median finishing time in hours and minutes", context: "2:01 in 2024", icon: "clock" },
    ],
    breakdowns: [
      { data: ageGroups, name: "age", value: "runners", format: "integer", title: "5,900 finishers were aged 30 to 39" },
      { data: runnerHomes, name: "home", value: "runners", format: "integer", title: "7,900 finishers lived in the Harrow Valley" },
    ],
    ranking: { data: clubs, name: "club", value: "runners", format: "integer", highlight: "Harrow Harriers", title: "Harrow Harriers had 412 finishers", subtitle: "Finishers by running club, the eight largest" },
    pack: {
      data: causes,
      name: "cause",
      value: "k",
      format: "£{value}k",
      icon: { "Hospice care": "heart", "Children's hospital": "hospital", "Mountain rescue": "mountain", "Food bank": "bread", "School sports": "school", "Tree planting": "tree" },
      title: "Runners raised £310,000 for hospice care",
      subtitle: "Money raised by cause, thousand pounds",
    },
    circles: { data: finishers, name: "year", value: "runners", format: "integer", title: "The race had 9,200 finishers in 2015" },
    figure: { value: "£1.3m", label: "Raised for nine causes in 2025", context: "£71 for each finisher" },
    sources: "Harrow Valley Athletics race results and fundraising returns",
    note: "The Harrow Valley Half Marathon is an invented race. All figures are illustrative.",
    credit: "InsightCharts",
  },
  "Ocean, a marine reserve, linked, with download": {
    theme: "ocean",
    linked: true,
    download: true,
    kicker: "Oceans",
    title: "Divers recorded 1,260 species in the Calder Reef reserve in 2025",
    subtitle: "Species, sightings and visitors in a marine reserve, annual survey 2025.",
    figures: [
      { value: "1,260", label: "Species recorded in 2025", context: "1,140 in the 2020 survey", icon: "fish" },
      { data: [{ zone: "Closed to fishing", share: 38 }], name: "zone", value: "share", icon: "lock", title: "38% of the reserve was closed to fishing" },
    ],
    breakdowns: [
      { data: speciesGroups, name: "group", value: "species", format: "integer", title: "540 of the species were fish" },
      { data: habitats, name: "habitat", value: "species", format: "integer", title: "430 species were first recorded on the reef crest" },
    ],
    ranking: { data: sightings, name: "fish", value: "seen", format: "integer", highlight: "Nassau grouper", title: "Divers recorded 640 Nassau groupers", subtitle: "Sightings of eight fish species on survey dives" },
    pack: {
      data: visits,
      name: "activity",
      value: "k",
      format: "{value}k",
      icon: { "Beach visits": "sun", Snorkelling: "wave", "Boat tours": "ship", "Scuba diving": "fish", Kayaking: "drop", "School trips": "school" },
      title: "120,000 people visited the reserve's beaches",
      subtitle: "Visitors by activity, thousands",
    },
    circles: { data: reserveArea, name: "year", value: "km2", format: "integer", title: "The reserve covered 520 km² in 2025" },
    figure: { value: "359,000", label: "Visitors in 2025", context: "312,000 in 2024" },
    sources: "Calder Reef Reserve annual survey 2025",
    note: "The Calder Reef reserve is an invented place. Species are real; all figures are illustrative.",
    credit: "InsightCharts",
  },
};
