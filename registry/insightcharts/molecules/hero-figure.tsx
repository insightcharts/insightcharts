"use client";

import type { ReactNode } from "react";
import { withMeta, renderSlot, type Slot } from "insightcharts/core";
import { Headline } from "@/components/insightcharts/atoms/headline";
import { SourceNote, type SourceRef } from "@/components/insightcharts/atoms/source-note";
import { Provide, useMolecule, type MoleculeProps } from "@/components/insightcharts/molecules/_shared";

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
