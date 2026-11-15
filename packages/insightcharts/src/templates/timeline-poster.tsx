import { BlockBar, type BlockBarProps } from "../atoms/block-bar";
import { NestedShares, type NestedSharesProps } from "../atoms/nested-shares";
import { RibbonChart, type RibbonChartProps } from "../atoms/ribbon-chart";
import { withMeta } from "../core/meta";
import { registerComponents } from "../core/spec";
import { useContainerWidth } from "../core/use-container-width";
import { Poster } from "../molecules/poster";
import { frameDocs, linkPanels, regionPanel, useInfographicLink, type InfographicFigure, type InfographicFrameProps, type Region } from "./_infographic-layout";
import { _figureColumns, _PosterFigures } from "./_poster-figures";

// Specs in the regions resolve without the host calling registerAll().
registerComponents({ RibbonChart, BlockBar, NestedShares });

/** One dated figure in the strip under the hero. */
export interface TimelinePosterMilestone extends InfographicFigure {
  /** The period the figure belongs to, as printed over it: "2019", "Spring 2021". */
  at: string;
}

export interface TimelinePosterProps extends InfographicFrameProps {
  /** The hero: 4 to 8 entities over 4 to 10 periods as bands whose thickness is the value and whose order is the rank (`ribbon-chart`). Config `{ data, x, y, series?, ... }`, or a full spec. */
  hero: Region<Partial<RibbonChartProps>>;
  /** Two to four dated figures in a strip under the hero, in time order. */
  milestones?: TimelinePosterMilestone[];
  /** Bottom left: one measure at each period as thick bars with the numbers inside (`block-bar`). `marker` draws a dotted line after one period to mark an event. */
  bars?: Region<Partial<BlockBarProps>>;
  /** Bottom right: one share at 2 to 8 dates as outlines nested in a square (`nested-shares`). */
  shares?: Region<Partial<NestedSharesProps>>;
}

/**
 * Change over a run of periods. The hero is a ribbon of bands that swap order as their values
 * change, a strip of dated figures sits under it, and two small graphics close the poster.
 */
function TimelinePosterImpl({ hero, milestones, bars, shares, theme = "sunrise", mode = "light", download, maxWidth = 1100, linked, data, kicker, title, subtitle, sources, note, credit, level, className, style }: TimelinePosterProps) {
  const [ref, measured] = useContainerWidth<HTMLDivElement>(1100);
  const { bind, wrap } = useInfographicLink(linked, data);
  const sheet = Math.min(measured, typeof maxWidth === "number" ? maxWidth : measured);
  const inner = Math.max(240, sheet - 2 * (sheet < 600 ? 20 : sheet < 900 ? 36 : 56));
  const dated = (milestones ?? []).slice(0, 4).map(({ at, ...fig }) => ({ ...fig, tag: at }));

  const alone = { height: 300 };
  // A lone graphic across the whole sheet is kept to a band, so it does not outweigh the hero.
  const barsPanel = regionPanel(bars, "block-bar", { name: "name", value: "value", orientation: sheet < 600 ? "auto" : "vertical", ...(shares == null && sheet >= 760 ? alone : null) }, { id: "bars", valign: "end" });
  const sharesPanel = regionPanel(shares, "nested-shares", { name: "name", value: "value", format: "{value}%", ...(bars == null && sheet >= 760 ? alone : null) }, { id: "shares", valign: "end" });
  const both = !!barsPanel && !!sharesPanel && sheet >= 760;
  if (barsPanel) barsPanel.span = both ? 7 : 12;
  if (sharesPanel) sharesPanel.span = both ? 5 : 12;

  const panels = linkPanels(
    [
      regionPanel(hero, "ribbon-chart", { x: "x", y: "y" }, { id: "hero", span: 12 }),
      dated.length ? { id: "milestones", span: 12, content: <_PosterFigures figures={dated} columns={_figureColumns(dated.length, inner)} slot="ic-timeline-poster-milestones" /> } : null,
      barsPanel,
      sharesPanel,
    ],
    (id, slot) => (id === "milestones" ? slot : bind(id, slot)),
  );
  return (
    <div ref={ref} data-slot="ic-timeline-poster" className={className} style={{ width: "100%", minWidth: 0, ...style }}>
      {wrap(<Poster kicker={kicker} title={title} subtitle={subtitle} panels={panels} columns={12} theme={theme} mode={mode} download={download} maxWidth={maxWidth} sources={sources} note={note} credit={credit} level={level} />)}
    </div>
  );
}

// Example data. Orrin Island, the Marlow library service and the Kestrel Bay commute survey are invented; every figure is illustrative.
const power = [
  { year: "2015", Coal: 9.2, Gas: 6.1, Hydro: 2.2, Wind: 1.4, Solar: 0.3 },
  { year: "2017", Coal: 8.0, Gas: 6.4, Hydro: 2.3, Wind: 2.6, Solar: 0.6 },
  { year: "2019", Coal: 6.1, Gas: 6.0, Hydro: 2.1, Wind: 4.3, Solar: 1.3 },
  { year: "2021", Coal: 4.0, Gas: 5.4, Hydro: 2.4, Wind: 5.9, Solar: 2.4 },
  { year: "2023", Coal: 2.3, Gas: 4.7, Hydro: 2.2, Wind: 7.4, Solar: 3.7 },
  { year: "2025", Coal: 1.1, Gas: 4.0, Hydro: 2.3, Wind: 8.6, Solar: 4.9 },
];
const carbon = [
  { year: "2015", g: 520 },
  { year: "2017", g: 455 },
  { year: "2019", g: 370 },
  { year: "2021", g: 290 },
  { year: "2023", g: 215 },
  { year: "2025", g: 160 },
];
const windSolar = [
  { year: "2015", share: 9 },
  { year: "2019", share: 28 },
  { year: "2021", share: 41 },
  { year: "2025", share: 65 },
];

const loans = [
  { year: "2013", "Printed books": 412, "E-books": 38, Audiobooks: 21, Films: 96, Magazines: 64 },
  { year: "2016", "Printed books": 371, "E-books": 84, Audiobooks: 47, Films: 71, Magazines: 52 },
  { year: "2019", "Printed books": 338, "E-books": 131, Audiobooks: 92, Films: 44, Magazines: 39 },
  { year: "2022", "Printed books": 296, "E-books": 187, Audiobooks: 158, Films: 23, Magazines: 31 },
  { year: "2025", "Printed books": 281, "E-books": 204, Audiobooks: 226, Films: 12, Magazines: 24 },
];
const members = [
  { year: "2013", k: 58 },
  { year: "2016", k: 61 },
  { year: "2019", k: 67 },
  { year: "2022", k: 74 },
  { year: "2025", k: 83 },
];
const digitalShare = [
  { year: "2013", share: 9 },
  { year: "2019", share: 35 },
  { year: "2025", share: 58 },
];

const commute = [
  ["2010", "Car", 61], ["2010", "Bus", 17], ["2010", "Walking", 11], ["2010", "Train", 7], ["2010", "Bicycle", 4],
  ["2015", "Car", 54], ["2015", "Bus", 16], ["2015", "Walking", 11], ["2015", "Train", 10], ["2015", "Bicycle", 9],
  ["2020", "Car", 45], ["2020", "Bus", 13], ["2020", "Walking", 12], ["2020", "Train", 13], ["2020", "Bicycle", 17],
  ["2025", "Car", 37], ["2025", "Bus", 12], ["2025", "Walking", 12], ["2025", "Train", 15], ["2025", "Bicycle", 24],
].map(([year, mode, share]) => ({ year, mode, share }));
const activeShare = [
  { year: "2010", share: 15 },
  { year: "2015", share: 20 },
  { year: "2020", share: 29 },
  { year: "2025", share: 36 },
];
const commuteMinutes = [
  { mode: "Train", minutes: 41 },
  { mode: "Bus", minutes: 34 },
  { mode: "Car", minutes: 27 },
  { mode: "Bicycle", minutes: 19 },
  { mode: "Walking", minutes: 14 },
];

export const TimelinePoster = withMeta(TimelinePosterImpl, {
  name: "timeline-poster",
  component: "TimelinePoster",
  title: "Timeline poster",
  level: "template",
  category: "infographic",
  description: "A poster of change over a run of periods: a full-width ribbon of bands whose thickness is each entity's value and whose order is its rank (`ribbon-chart`), a strip of two to four dated figures under it, and a bottom row with one measure per period as thick bars (`block-bar`) and one share at several dates as nested outlines (`nested-shares`).",
  whenToUse: "Use it when the subject is how 4 to 8 named things grew, shrank and changed places over 4 to 10 periods: electricity by source, library loans by format, commuters by mode. Give `hero` the periods and entities, `milestones` the dated numbers a reader should take away, `bars` one measure of the whole at each period and `shares` one share at a few dates. State the latest value in the title.",
  avoid: "A single series over time (use `line-chart` or `area-chart` in a `poster`). Events with start and end dates (use `timeline-chart` or the `timeline-story` template). More than 8 entities or 10 periods, because the bands get too thin to label. Positions on one scale (use `scale-poster`). Parts of one subject at one date (use `radial-poster`).",
  composes: ["poster", "ribbon-chart", "block-bar", "nested-shares"],
  props: [
    { name: "hero", type: "{ data, x, y, series?, values?, labels?, colorBy?, format?, highlight?, title?, ... } | Slot", required: true, description: "The hero: one band per entity across the periods, drawn by `ribbon-chart`. Wide rows take `y` as a list of columns; long rows take `y` and `series`. A full spec or element replaces it." },
    { name: "milestones", type: "{ at: string; value: string; label: string; context?: string; icon?: string }[]", description: "Two to four dated figures in a strip under the hero, in time order. `at` is the period, printed in small capitals over the figure." },
    { name: "bars", type: "{ data, name, value, marker?, detail?, format?, title?, ... } | Slot", description: "Bottom left: one measure at each period as thick bars with the numbers inside (`block-bar`). `marker: { after, label }` draws a dotted line after one period to mark an event." },
    { name: "shares", type: "{ data, name, value, wholeLabel?, highlight?, format?, title?, ... } | Slot", description: 'Bottom right: one share at 2 to 8 dates as outlines nested in one square (`nested-shares`). `format` defaults to `"{value}%"`. With only one of `bars` and `shares`, that one takes the full width.' },
    ...frameDocs("sunrise", 1100),
  ],
  example: {
    type: "timeline-poster",
    theme: "sunrise",
    kicker: "Electricity",
    title: "Wind supplied 8.6 TWh of Orrin Island's electricity in 2025",
    subtitle: "Electricity generated on Orrin Island by source, terawatt-hours, every second year from 2015 to 2025.",
    hero: { data: power, x: "year", y: ["Coal", "Gas", "Hydro", "Wind", "Solar"], colorBy: "series", title: "Coal supplied 9.2 TWh in 2015" },
    milestones: [
      { at: "2017", value: "62", label: "turbines started at the Skerry wind farm" },
      { at: "2021", value: "5.9 TWh", label: "came from wind", context: "Gas supplied 5.4 TWh" },
      { at: "2025", value: "1.1 TWh", label: "came from coal", context: "9.2 TWh in 2015" },
    ],
    bars: { data: carbon, name: "year", value: "g", format: "{value} g", marker: { after: "2017", label: "Skerry wind farm opened" }, title: "A kilowatt-hour emitted 160 g of CO2 in 2025", subtitle: "Grams of CO2 per kilowatt-hour generated." },
    shares: { data: windSolar, name: "year", value: "share", highlight: "2025", wholeLabel: "All electricity generated", title: "Wind and solar supplied 65% of electricity in 2025" },
    sources: "Orrin Island Grid Office, annual generation statistics",
    note: "Orrin Island is an invented place. All figures are illustrative.",
    credit: "InsightCharts",
  },
});

export const examples = {
  "Paper, library loans, with download": {
    theme: "paper",
    download: true,
    kicker: "Libraries",
    title: "Marlow's libraries lent 226,000 audiobooks in 2025",
    subtitle: "Items lent by the Marlow library service by format, thousands, every third year from 2013 to 2025.",
    hero: { data: loans, x: "year", y: ["Printed books", "E-books", "Audiobooks", "Films", "Magazines"], colorBy: "series", format: "{value}k", title: "Printed-book loans fell from 412,000 to 281,000" },
    milestones: [
      { at: "2013", value: "21k", label: "audiobooks were lent" },
      { at: "2022", value: "187k", label: "e-books were lent", context: "38,000 in 2013" },
      { at: "2025", value: "747k", label: "items were lent in all formats", context: "631,000 in 2013" },
    ],
    bars: { data: members, name: "year", value: "k", format: "{value}k", title: "The service had 83,000 members in 2025" },
    shares: { data: digitalShare, name: "year", value: "share", highlight: "2025", wholeLabel: "All loans", title: "E-books and audiobooks were 58% of loans in 2025" },
    sources: "Marlow library service, annual lending returns",
    note: "The Marlow library service is invented. All figures are illustrative.",
    credit: "InsightCharts",
  },
  "Dusk, long-format rows, bars linked to the ribbon": {
    theme: "dusk",
    linked: true,
    kicker: "Commuting",
    title: "24% of Kestrel Bay's commuters cycled to work in 2025",
    subtitle: "Share of commuters by main mode of travel, per cent, 2010 to 2025.",
    hero: { data: commute, x: "year", y: "share", series: "mode", colorBy: "series", format: "{value}%", title: "The car's share fell from 61% to 37%" },
    milestones: [
      { at: "2010", value: "4%", label: "of commuters cycled" },
      { at: "2025", value: "24%", label: "of commuters cycled" },
    ],
    bars: { data: commuteMinutes, name: "mode", value: "minutes", format: "{value} min", title: "The average train commute took 41 minutes in 2025", subtitle: "Average one-way commute by mode, minutes, 2025." },
    shares: { data: activeShare, name: "year", value: "share", highlight: "2025", wholeLabel: "All commuters", title: "36% of commuters walked or cycled in 2025" },
    sources: "Kestrel Bay travel-to-work survey",
    note: "Kestrel Bay is an invented town. All figures are illustrative.",
    credit: "InsightCharts",
  },
};
