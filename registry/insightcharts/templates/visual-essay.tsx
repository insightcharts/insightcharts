"use client";

import type { ReactNode } from "react";
import { Headline } from "@/components/insightcharts/atoms/headline";
import { Prose } from "@/components/insightcharts/atoms/prose";
import { PullQuote } from "@/components/insightcharts/atoms/pull-quote";
import { SmallMultiples } from "@/components/insightcharts/atoms/small-multiples";
import { StepMarker } from "@/components/insightcharts/atoms/step-marker";
import { withMeta, renderSlot, type InsightSpec, type Slot } from "insightcharts/core";
import { ChartCallout } from "@/components/insightcharts/molecules/chart-callout";
import { Provide } from "@/components/insightcharts/molecules/_shared";
import { ScrollyChart, type ScrollyChartStep } from "@/components/insightcharts/molecules/scrolly-chart";
import { SmallMultipleGrid } from "@/components/insightcharts/molecules/small-multiple-grid";
import { StatRow, type StatRowItem } from "@/components/insightcharts/molecules/stat-row";
import { below, frame, FRAME_DOCS, Sourcing, SOURCING_DOCS, useTemplate, withHeight, type HeadingLevel, type TemplateProps, type TemplateSourcing } from "@/components/insightcharts/templates/_shared";

/** How far a block may break out of the reading column. */
export type VisualEssayWidth = "text" | "wide" | "full";

interface BlockBase {
  /** `"text"` keeps the reading measure, `"wide"` breaks out to about 920px, `"full"` takes the whole piece. */
  width?: VisualEssayWidth;
  /** Anchor id for deep links. */
  id?: string;
}

export type VisualEssayBlock =
  /** Narration. Blank lines separate paragraphs; `**bold**`, `*italic*` and links are supported. */
  | (BlockBase & { kind: "prose"; text: string | string[]; lead?: boolean })
  /** One exhibit with an optional caption underneath. */
  | (BlockBase & { kind: "figure"; chart: Slot; caption?: string })
  /** A chart with its takeaway beside it. */
  | (BlockBase & { kind: "callout"; chart: Slot; lead?: string; body?: string; label?: string; tone?: "neutral" | "positive" | "negative" | "accent"; side?: "left" | "right" })
  /** A pinned chart that changes one thing per scroll step. */
  | (BlockBase & { kind: "scrolly"; chart: InsightSpec; steps: ScrollyChartStep[]; cumulative?: boolean; scrollMode?: "auto" | "scroll" | "swipe" | "steps"; side?: "left" | "right"; stepHeight?: string; stickyTop?: number | string; source?: string; note?: string })
  | (BlockBase & { kind: "quote"; quote: string; attribution?: string; role?: string; cite?: string })
  | (BlockBase & { kind: "stats"; items: StatRowItem[]; title?: string; subtitle?: string; source?: string; note?: string })
  /** Small multiples. With `chart` it repeats that spec per facet (`small-multiple-grid`); without, it is the `small-multiples` atom. */
  | (BlockBase & { kind: "multiples"; facet: string; chart?: InsightSpec; [prop: string]: unknown })
  /** A chapter break: numbered when `step` is given. */
  | (BlockBase & { kind: "break"; title: string; step?: number | string; total?: number; text?: string });

export interface VisualEssayProps extends TemplateProps, TemplateSourcing {
  /** The essay's main finding, as one plain sentence with the number and the period in it. */
  title: string;
  kicker?: string;
  /** One-sentence standfirst. */
  deck?: string;
  byline?: string;
  date?: string;
  /** The story, in reading order. A bare chart spec (`{ type: ... }`) or element is treated as a wide figure. */
  blocks: (VisualEssayBlock | Slot)[];
  /** Width of the reading column in px. Default 680. */
  measure?: number;
  /** Body text size. Default `"lg"` (18px) in wide containers, 16px on phones. */
  textSize?: "md" | "lg";
  children?: ReactNode;
}

const isBlock = (value: unknown): value is VisualEssayBlock => typeof value === "object" && value !== null && typeof (value as { kind?: unknown }).kind === "string";
const WIDE = 920;
const DEFAULT_WIDTH: Record<VisualEssayBlock["kind"], VisualEssayWidth> = { prose: "text", figure: "wide", callout: "wide", scrolly: "full", quote: "text", stats: "wide", multiples: "full", break: "text" };

/**
 * A long article read by scrolling. Text runs in a reading column. Exhibits can be wider
 * than the column. A scrolly sequence pins one chart and changes one thing per step.
 */
function VisualEssayImpl({ title, kicker, deck, byline, date, blocks, measure = 680, textSize, sources, period, method, note, credit, level = 1, maxWidth = 1120, children, className, style, ...rest }: VisualEssayProps) {
  const { ref, mode, root, phone } = useTemplate(rest);
  const size = textSize ?? (phone ? "md" : "lg");
  const sub: HeadingLevel = below(level);
  const column = (width: VisualEssayWidth) => ({ minWidth: 0, width: "100%", maxWidth: width === "text" ? measure : width === "wide" ? WIDE : undefined, marginLeft: "auto", marginRight: "auto" });
  const list = blocks ?? [];

  const render = (block: VisualEssayBlock): ReactNode => {
    switch (block.kind) {
      case "prose":
        return <Prose text={block.text} size={size} lead={block.lead} measure={75} style={{ maxWidth: "none" }} />;
      case "figure":
        return (
          <>
            {renderSlot(withHeight(block.chart, phone ? 280 : 380))}
            {block.caption ? <Prose text={block.caption} size="sm" tone="muted" style={{ marginTop: 12 }} /> : null}
          </>
        );
      case "callout":
        return <ChartCallout chart={withHeight(block.chart, phone ? 260 : 340)} lead={block.lead} body={block.body} label={block.label} tone={block.tone} side={block.side} />;
      case "scrolly": {
        const { kind: _k, width: _w, id: _i, ...props } = block;
        return <ScrollyChart {...props} />;
      }
      case "quote":
        return <PullQuote quote={block.quote} attribution={block.attribution} role={block.role} cite={block.cite} size={phone ? "md" : "lg"} />;
      case "stats":
        return <StatRow items={block.items} title={block.title} subtitle={block.subtitle} source={block.source} note={block.note} />;
      case "multiples": {
        const { kind: _k, width: _w, id: _i, ...props } = block;
        return props.chart ? <SmallMultipleGrid {...(props as unknown as Parameters<typeof SmallMultipleGrid>[0])} /> : <SmallMultiples {...(props as unknown as Parameters<typeof SmallMultiples>[0])} />;
      }
      case "break":
        return block.step != null ? <StepMarker step={block.step} total={block.total} title={block.title} text={block.text} size="lg" level={sub} rule /> : <Headline size="section" title={block.title} deck={block.text} level={sub} style={{ borderTop: "1px solid var(--_ic-grid)", paddingTop: 24 }} />;
    }
  };

  return (
    <article ref={ref} data-slot="ic-visual-essay" data-ic-mode={mode} className={className} style={{ ...frame(root, maxWidth, 0), ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <div data-slot="ic-visual-essay-opening" style={{ ...column("text"), paddingBottom: phone ? 28 : 40 }}>
          <Headline size="page" title={title} kicker={kicker} deck={deck} byline={byline} date={date} level={level} />
        </div>
        {list.map((item, i) => {
          const block = isBlock(item) ? item : null;
          const width = block ? block.width ?? DEFAULT_WIDTH[block.kind] : "wide";
          const prev = i > 0 && isBlock(list[i - 1]) ? (list[i - 1] as VisualEssayBlock).kind : null;
          // Text flows; exhibits and chapter breaks get air around them.
          const exhibit = !block || (block.kind !== "prose" && block.kind !== "break");
          const top = i === 0 ? 0 : block?.kind === "break" ? (phone ? 48 : 72) : prev === "break" ? (phone ? 16 : 20) : exhibit || (prev !== "prose" && prev !== null) ? (phone ? 32 : 48) : 20;
          return (
            <div key={i} id={block?.id} data-slot="ic-visual-essay-block" data-kind={block?.kind ?? "figure"} data-width={width} style={{ ...column(width), marginTop: top }}>
              {block ? render(block) : renderSlot(withHeight(item as Slot, phone ? 280 : 380))}
            </div>
          );
        })}
        {children}
        <div style={{ ...column("text"), marginTop: phone ? 40 : 64 }}>
          <Sourcing sources={sources} period={period} method={method} note={note} credit={credit} />
        </div>
      </Provide>
    </article>
  );
}

const mix = [
  [2015, 2.9, 24.6],
  [2016, 3.0, 22.0],
  [2017, 3.4, 20.6],
  [2018, 3.7, 19.2],
  [2019, 4.2, 15.0],
  [2020, 5.0, 13.0],
  [2021, 5.4, 14.7],
  [2022, 7.0, 15.8],
  [2023, 9.1, 12.3],
  [2024, 11.1, 9.8],
].map(([year, Solar, Coal]) => ({ year: String(year), Solar, Coal }));
const modulePrice = [
  [2010, 2.0],
  [2012, 0.9],
  [2014, 0.65],
  [2016, 0.5],
  [2018, 0.3],
  [2020, 0.22],
  [2022, 0.26],
  [2024, 0.11],
].map(([year, usd]) => ({ year: String(year), usd }));
const sourcesMix = [
  { source: "Nuclear", y2015: 26.5, y2024: 23.7 },
  { source: "Coal", y2015: 24.6, y2024: 9.8 },
  { source: "Gas", y2015: 15.8, y2024: 15.7 },
  { source: "Hydro", y2015: 11.5, y2024: 12.5 },
  { source: "Wind", y2015: 9.3, y2024: 17.4 },
  { source: "Solar", y2015: 2.9, y2024: 11.1 },
];
const COUNTRY_SOLAR: Record<string, number[]> = {
  Greece: [7.8, 8.1, 10.9, 22.1],
  Spain: [4.9, 4.7, 9.6, 21.0],
  Netherlands: [1.0, 3.2, 9.3, 17.9],
  Germany: [6.0, 7.1, 8.4, 14.7],
  Poland: [0.0, 0.2, 2.2, 10.8],
  France: [1.3, 1.9, 2.8, 4.6],
};
const countrySolar = Object.entries(COUNTRY_SOLAR).flatMap(([country, values]) => values.map((share, i) => ({ country, year: String(2015 + i * 3), share })));
export const VisualEssay = withMeta(VisualEssayImpl, {
  name: "visual-essay",
  component: "VisualEssay",
  title: "Visual essay",
  level: "template",
  category: "story",
  description: "A long article read by scrolling. It has a headline, then an ordered list of blocks in a reading column, then a source note. The blocks are prose, figures, charts with a callout, scrolly sequences, pull quotes, stat rows, small multiples and chapter breaks. Exhibits can be wider than the column.",
  whenToUse: "Use it for a finding that takes several charts and some text to explain. State the main finding with its number in the headline. Put the main figure within the first screen. Alternate text and charts, with two or three short paragraphs before each exhibit. In a scrolly block change one thing per step, such as the highlight, the year or an annotation. Use one accent colour for the subject in every chart.",
  avoid: "A summary for someone who will not scroll (use `executive-brief`). Reference material read out of order (use `report-page`). More than one or two scrolly blocks. Use one only where the chart changes between steps.",
  composes: ["headline", "prose", "pull-quote", "step-marker", "small-multiples", "chart-callout", "scrolly-chart", "small-multiple-grid", "stat-row", "source-note", "line-chart", "bar-chart"],
  props: [
    { name: "title", type: "string", required: true, description: "The essay's main finding, as one plain sentence with the number and the period in it." },
    { name: "kicker", type: "string", description: "Small label above the title." },
    { name: "deck", type: "string", description: "One-sentence standfirst." },
    { name: "byline", type: "string", description: "Author line." },
    { name: "date", type: "string", description: "Publication date. ISO dates are formatted for the locale." },
    {
      name: "blocks",
      type: "(Block | Slot)[]",
      required: true,
      description:
        'The story in reading order. Each block has a `kind`: `prose` `{ text, lead? }`; `figure` `{ chart, caption? }`; `callout` `{ chart, lead, body, label?, tone?, side? }`; `scrolly` `{ chart, steps, cumulative?, scrollMode?, side?, stepHeight? }` (the props of `scrolly-chart`); `quote` `{ quote, attribution?, role? }`; `stats` `{ items, title? }`; `multiples` `{ facet, ... }` (props of `small-multiples`, or of `small-multiple-grid` when it has a `chart`); `break` `{ title, step?, total?, text? }`. Any block takes `width: "text" | "wide" | "full"` and an `id`. A bare chart spec is treated as a wide figure.',
    },
    { name: "measure", type: "number", default: "680", description: "Width of the reading column in px." },
    { name: "textSize", type: '"md" | "lg"', description: "Body text size. Default 18px, 16px in narrow containers." },
    ...SOURCING_DOCS,
    ...FRAME_DOCS,
  ],
  example: {
    type: "visual-essay",
    kicker: "Energy transition",
    title: "Solar supplied 11.1% of EU electricity in 2024, more than coal's 9.8%",
    deck: "Solar's share was 2.9% in 2015. Coal's share was 24.6% in 2015.",
    byline: "By the data desk",
    date: "2025-03-14",
    blocks: [
      {
        kind: "prose",
        lead: true,
        text: "Solar supplied **2.9% of the EU's electricity** in 2015. Hydro supplied 11.5%.\n\nIn 2024 solar supplied 11.1%. It was the first full year in which solar generated more electricity than coal.",
      },
      {
        kind: "figure",
        chart: {
          type: "line-chart",
          data: mix,
          x: "year",
          y: ["Solar", "Coal"],
          highlight: "Solar",
          format: "{value}%",
          zero: true,
          title: "Solar's share rose from 2.9% to 11.1% between 2015 and 2024",
          subtitle: "Share of EU electricity generation, 2015 to 2024",
          annotations: [
            { type: "band", axis: "x", from: "2021", to: "2022", label: "Gas price crisis" },
            { type: "point", x: "2016", y: 22, label: "Coal", position: "top", dot: false },
          ],
          source: "Ember, European Electricity Review 2025",
        },
      },
      { kind: "prose", text: "Coal's share was 15.8% in 2022. It fell to 12.3% in 2023 and 9.8% in 2024. Solar's share rose from 7.0% to 11.1% in the same two years." },
      { kind: "break", step: 1, total: 3, title: "Solar module prices, 2010 to 2024", text: "A module cost $2.00 a watt in 2010. It cost $0.11 a watt in 2024." },
      {
        kind: "callout",
        chart: { type: "line-chart", data: modulePrice, x: "year", y: "usd", format: { style: "currency", currency: "USD" }, zero: true, area: true, title: "Solar module prices fell from $2.00 to $0.11 a watt between 2010 and 2024", subtitle: "Average price of crystalline silicon solar modules, US dollars per watt", source: "IRENA and BloombergNEF (rounded)" },
        label: "Rooftop system cost",
        lead: "Modules are now the smaller part of the cost of a rooftop system",
        body: "Mounting, wiring, labour and the grid connection make up most of the cost.",
      },
      {
        kind: "stats",
        items: [
          { value: "338 GW", label: "Solar capacity installed in the EU, end of 2024", delta: "+66 GW", deltaLabel: "in 2024" },
          { value: "304 TWh", label: "Solar generation, 2024", delta: 0.22, deltaLabel: "vs 2023" },
          { value: "269 TWh", label: "Coal generation, 2024", delta: -0.16, deltaLabel: "vs 2023", upIsGood: false },
        ],
      },
      { kind: "break", step: 2, total: 3, title: "EU electricity generation by source, 2015 and 2024", text: "Scroll to see the shares in 2015 and then in 2024." },
      {
        kind: "scrolly",
        chart: { type: "bar-chart", data: sourcesMix, x: "source", y: "y2015", sort: "none", orientation: "horizontal", format: "{value}%", height: 320, title: "EU electricity generation by source, 2015", subtitle: "Share of electricity generation", source: "Ember, European Electricity Review 2025", option: { xAxis: { max: 30 } } },
        stepHeight: "70vh",
        stickyTop: 16,
        steps: [
          { id: "baseline", label: "2015", content: "In 2015 **nuclear and coal** together supplied 51% of the EU's electricity." },
          { id: "coal", content: "Coal supplied 24.6% in 2015. It was the second-largest source after nuclear.", highlight: "Coal" },
          { id: "coal-now", label: "2024", content: "Coal supplied 9.8% in 2024. Plants closed in Germany, Spain and Portugal.", highlight: "Coal", y: "y2024", title: "EU electricity generation by source, 2024" },
          { id: "solar", content: "**Solar** supplied 11.1% in 2024. It supplied 2.9% in 2015. Wind supplied 17.4% in 2024 and gas 15.7%.", highlight: "Solar", y: "y2024", title: "Solar supplied 11.1% of EU electricity in 2024" },
        ],
      },
      { kind: "quote", quote: "Solar was 1% of Dutch generation in 2015. It was 18% in 2024. We have had to change how we run the grid at midday.", attribution: "Marit de Vries", role: "Head of system operations at a Dutch grid operator" },
      { kind: "break", step: 3, total: 3, title: "Solar share by country", text: "Greece had the highest share in 2024 at 22.1%. Spain had 21.0%. France had 4.6%." },
      {
        kind: "multiples",
        data: countrySolar,
        facet: "country",
        x: "year",
        y: "share",
        highlight: ["Netherlands", "Poland"],
        format: "{value}%",
        columns: 3,
        title: "Solar's share in the Netherlands rose from 1.0% to 17.9% between 2015 and 2024",
        subtitle: "Solar share of electricity generation, 2015 to 2024, same scale in every panel",
        source: "Ember (country series rounded, illustrative)",
        width: "wide",
      },
      {
        kind: "prose",
        text: "Poland's solar share rose from 0.0% in 2015 to 10.8% in 2024. Retail electricity prices in the Netherlands and Poland rose after 2022. At those prices a rooftop system paid for itself in under seven years without subsidy.\n\nFrance has cheap nuclear power and slow permitting. Its solar share was 4.6% in 2024. Germany's was 14.7%.",
      },
    ],
    sources: [{ name: "Ember, European Electricity Review 2025", url: "https://ember-energy.org" }, "IRENA Renewable Power Generation Costs", "BloombergNEF"],
    period: "2010 to 2024, annual",
    method: "Generation shares are of total net generation in the EU-27. Module prices are annual averages in nominal dollars.",
    note: "EU totals are approximate, rounded for illustration. Country series and the quotation are illustrative.",
    credit: "Analysis and charts by the data desk",
  },
});
