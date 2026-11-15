import type { ReactNode } from "react";
import { withMeta } from "../core/meta";
import { renderSlot, type Slot } from "../core/spec";
import { Headline } from "../atoms/headline";
import { SourceNote, type SourceRef } from "../atoms/source-note";
import { Provide, useMolecule, type MoleculeProps } from "./_shared";

export interface HeroFigureProps extends MoleculeProps {
  /** The main fact of the piece, as one plain sentence with its number. */
  title: string;
  /** Small label above the title: the series or topic. */
  kicker?: string;
  /** One plain sentence under the title that adds a second fact. */
  deck?: string;
  byline?: string;
  /** Publication date. ISO dates are formatted for the locale. */
  date?: string;
  /** The opening exhibit: a chart spec or a React element. Do not give it its own title. */
  chart: Slot;
  /** Where the data comes from. Entries with a `url` are linked. */
  source?: string | SourceRef | (string | SourceRef)[];
  /** The period the data covers. */
  period?: string;
  /** Caveats the reader should know. */
  note?: string;
  align?: "left" | "center";
  /** Heading level of the title. Default 1. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** JSX alternative to `chart`. */
  children?: ReactNode;
}

/**
 * The opening exhibit of a piece: a headline that states the main fact, one chart that
 * shows it and a source line underneath.
 */
function HeroFigureImpl({ title, kicker, deck, byline, date, chart, source, period, note, align = "left", level, children, className, style, ...rest }: HeroFigureProps) {
  const { ref, width, mode, root } = useMolecule<HTMLElement>(rest);
  const gap = width < 560 ? 20 : 32;
  return (
    <section ref={ref} data-slot="ic-hero-figure" data-ic-mode={mode} className={className} style={{ ...root, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <Headline size="page" title={title} kicker={kicker} deck={deck} byline={byline} date={date} align={align} level={level} />
        <div data-slot="ic-hero-figure-chart" style={{ minWidth: 0 }}>
          {children ?? renderSlot(chart)}
        </div>
        {source || period || note ? <SourceNote sources={source} period={period} note={note} layout="inline" style={{ marginTop: -gap / 2 }} /> : null}
      </Provide>
    </section>
  );
}

const mix = [
  [2015, 2.9, 24.6, 9.2, 15.6],
  [2016, 3.0, 22.0, 9.5, 18.4],
  [2017, 3.4, 20.6, 11.0, 19.7],
  [2018, 3.7, 19.2, 11.4, 18.3],
  [2019, 4.2, 15.0, 13.0, 21.0],
  [2020, 5.0, 13.0, 14.4, 20.1],
  [2021, 5.4, 14.7, 13.3, 18.8],
  [2022, 7.0, 15.8, 15.1, 19.6],
  [2023, 9.1, 12.3, 17.5, 16.8],
  [2024, 11.1, 9.8, 17.4, 15.7],
].map(([year, Solar, Coal, Wind, Gas]) => ({ year: String(year), Solar, Coal, Wind, Gas }));
const seats = [
  { region: "Americas", y2000: 15.3, y2024: 35.1 },
  { region: "Europe", y2000: 16.0, y2024: 31.8 },
  { region: "Sub-Saharan Africa", y2000: 11.3, y2024: 27.3 },
  { region: "Pacific", y2000: 13.0, y2024: 22.9 },
  { region: "Asia", y2000: 14.6, y2024: 22.1 },
  { region: "Middle East and North Africa", y2000: 3.8, y2024: 16.5 },
];
const land = [
  { use: "Forest", share: 31 },
  { use: "Agriculture", share: 37 },
  { use: "Other land", share: 32 },
];

export const HeroFigure = withMeta(HeroFigureImpl, {
  name: "hero-figure",
  component: "HeroFigure",
  title: "Hero figure",
  level: "molecule",
  category: "story",
  description: "The opening exhibit of a piece: kicker, headline and deck above one large chart, with a source line underneath.",
  whenToUse: "At the very top of a data story or a one-page report. The headline states the main fact with its number. The chart shows that fact.",
  avoid: "Giving the chart its own `title` (the headline is the title; use the chart's `subtitle` for the measure). A second hero on the same page: later sections use `section` or `chart-callout`.",
  composes: ["headline", "source-note", "line-chart", "big-number", "dumbbell-chart", "waffle-chart"],
  props: [
    { name: "title", type: "string", required: true, description: "The main fact, as one plain sentence with its number." },
    { name: "kicker", type: "string", description: "Small label above the title: the series or topic." },
    { name: "deck", type: "string", description: "One plain sentence under the title that adds a second fact." },
    { name: "byline", type: "string", description: 'Author line, e.g. "By Ana Ruiz".' },
    { name: "date", type: "string", description: "Publication date. ISO dates are formatted for the locale." },
    { name: "chart", type: "Slot", required: true, description: "The hero chart: a spec or a React element, without its own title." },
    { name: "source", type: "string | { name, url? } | (string | { name, url? })[]", description: "Where the data comes from. Entries with a `url` are linked." },
    { name: "period", type: "string", description: "The period the data covers." },
    { name: "note", type: "string", description: "Caveats the reader should know." },
    { name: "align", type: '"left" | "center"', default: '"left"', description: "Headline alignment." },
    { name: "level", type: "1 | 2 | 3 | 4 | 5 | 6", default: "1", description: "Heading level of the title." },
    { name: "children", type: "ReactNode", description: "JSX alternative to `chart`." },
    { name: "theme", type: "ThemeInput", description: "A built-in theme name (`editorial`, `ledger`, `noir`...) or a theme object, passed on to the headline, chart and source note. A named theme with its own surface paints that surface behind the component." },
    { name: "frame", type: "boolean", description: "Paint the theme's surface behind the component. Default: on for a named theme with its own surface." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "hero-figure",
    theme: "editorial",
    kicker: "Energy transition",
    title: "Solar supplied 11.1% of EU electricity in 2024",
    deck: "Coal's share fell from 24.6% in 2015 to 9.8% in 2024.",
    byline: "By Ana Ruiz",
    date: "2025-01-23",
    chart: {
      type: "line-chart",
      data: mix,
      x: "year",
      y: ["Solar", "Coal", "Wind", "Gas"],
      highlight: ["Solar", "Coal"],
      contextLabels: true,
      format: "{value}%",
      zero: true,
      height: 380,
      subtitle: "Share of EU electricity generation by source, 2015 to 2024",
    },
    source: { name: "Ember, European Electricity Review 2025", url: "https://ember-energy.org" },
    note: "Figures are approximate, for illustration",
    period: "2015 to 2024",
  },
});

export const examples = {
  "Centered, big number as the exhibit, dusk theme": {
    theme: "dusk",
    align: "center",
    title: "33% of the world's population had never used the internet in 2023",
    deck: "The ITU estimates that 2.6 billion people were offline.",
    chart: { type: "big-number", size: "hero", align: "center", value: "2.6 billion", label: "People who have never used the internet", context: "33% of the world's population in 2023" },
    source: "ITU Facts and Figures 2023",
    note: "Figures are approximate, for illustration",
  },
  "Default theme with one accent overridden": {
    theme: { accent: "#b4237a" },
    kicker: "Representation",
    title: "Women held 27.0% of seats in national parliaments in 2024",
    deck: "The share was 13.1% in 2000.",
    chart: {
      type: "dumbbell-chart",
      data: seats,
      category: "region",
      from: "y2000",
      to: "y2024",
      names: { y2000: "2000", y2024: "2024" },
      format: "{value}%",
      sort: "to",
      highlight: "Americas",
      subtitle: "Share of seats in national parliaments held by women, by region, 2000 and 2024",
    },
    source: "Inter-Parliamentary Union",
    note: "Figures are approximate, for illustration",
    period: "2000 and 2024",
  },
  "Part of a whole as the exhibit, earth theme": {
    theme: "earth",
    kicker: "Land use",
    title: "Forest covered 31% of the world's land in 2020",
    deck: "Agriculture used 37% of the world's land.",
    chart: { type: "waffle-chart", data: land, name: "use", value: "share", total: 100, highlight: "Forest", height: 300, subtitle: "Share of the world's land area by use, 2020. One cell is 1%." },
    source: "FAO, Global Forest Resources Assessment 2020",
    note: "Figures are approximate, for illustration",
  },
};
