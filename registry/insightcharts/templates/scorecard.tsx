"use client";

import { Headline } from "@/components/insightcharts/atoms/headline";
import { Prose } from "@/components/insightcharts/atoms/prose";
import { withMeta, isSpec, renderSlot, type Slot } from "insightcharts/core";
import { ComparisonTable, type ComparisonTableProps } from "@/components/insightcharts/molecules/comparison-table";
import { KpiGrid, type KpiGridProps } from "@/components/insightcharts/molecules/kpi-grid";
import { RankedList, type RankedListProps } from "@/components/insightcharts/molecules/ranked-list";
import { Provide } from "@/components/insightcharts/molecules/_shared";
import { below, frame, FRAME_DOCS, Heading, RULE, Sourcing, SOURCING_DOCS, useTemplate, withHeight, type TemplateProps, type TemplateSourcing } from "@/components/insightcharts/templates/_shared";

export interface ScorecardNote {
  /** One fact, as a short sentence with its number. */
  title: string;
  /** One or two sentences of detail. */
  text?: string;
}

export interface ScorecardProps extends TemplateProps, TemplateSourcing {
  /** The main change this period, as one plain sentence with the number in it. */
  title: string;
  /** The name of the report, e.g. "Store scorecard". */
  kicker?: string;
  /** The period reported, e.g. "October 2024" or "Week 42". Shown opposite the report name. */
  reportPeriod?: string;
  deck?: string;
  byline?: string;
  date?: string;
  /** The headline metrics with their trends: the props of `kpi-grid` (`data`, `x`, `metrics`, `compare`, `change`). */
  kpis?: KpiGridProps;
  /** A ranking: the props of `ranked-list`, or any spec or element. */
  ranking?: RankedListProps | Slot;
  /** One or two trend exhibits. */
  trends?: Slot[];
  /** A comparison table across entities: the props of `comparison-table`, or any spec or element. */
  table?: ComparisonTableProps | Slot;
  /** Short notes on what changed in the period. */
  notes?: (string | ScorecardNote)[];
  /** Heading of the notes. */
  notesTitle?: string;
}

const isProps = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !isSpec(value) && !("$$typeof" in value);

/**
 * A recurring report with the same layout every week or month. The headline states the
 * main change. The grid shows every metric against the previous period.
 */
function ScorecardImpl({ title, kicker, reportPeriod, deck, byline, date, kpis, ranking, trends, table, notes, notesTitle = "Notes", sources, period, method, note, credit, level = 1, maxWidth = 1080, className, style, ...rest }: ScorecardProps) {
  const { ref, width, mode, root, phone, gap } = useTemplate(rest);
  const exhibits = (trends ?? []).slice(0, 2);
  const split = ranking != null && exhibits.length > 0 && width >= 760;
  const trendCols = !split && ranking == null && exhibits.length > 1 && width >= 640 ? 2 : 1;
  const list = (notes ?? []).map((n) => (typeof n === "string" ? { title: n } : n));
  const noteCols = width >= 720 ? Math.min(list.length, list.some((n) => n.text) ? 3 : 2) : 1;
  const block = { minWidth: 0, borderTop: RULE, paddingTop: phone ? 24 : 32 } as const;
  const rankingNode = ranking == null ? null : isProps(ranking) ? <RankedList {...(ranking as unknown as RankedListProps)} /> : renderSlot(ranking as Slot);
  const trendNodes = exhibits.map((slot, i) => (
    <div key={i} data-slot="ic-template-block" style={{ minWidth: 0 }}>
      {renderSlot(withHeight(slot, split && exhibits.length > 1 ? 200 : 260))}
    </div>
  ));
  return (
    <article ref={ref} data-slot="ic-scorecard" data-ic-mode={mode} className={className} style={{ ...frame(root, maxWidth, gap), ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <header data-slot="ic-scorecard-header" style={{ minWidth: 0, display: "grid", gap: phone ? 16 : 20 }}>
          {kicker || reportPeriod ? (
            <div data-slot="ic-scorecard-masthead" style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "4px 16px", borderBottom: "2px solid var(--_ic-ink)", paddingBottom: 10, fontSize: "0.8125rem", lineHeight: 1.4 }}>
              {kicker ? <span style={{ fontWeight: 650, color: "var(--_ic-ink)", letterSpacing: "0.01em" }}>{kicker}</span> : <span />}
              {reportPeriod ? <span style={{ color: "var(--_ic-ink-2)", fontVariantNumeric: "tabular-nums" }}>{reportPeriod}</span> : null}
            </div>
          ) : null}
          <Headline size="page" title={title} deck={deck} byline={byline} date={date} level={level} />
        </header>
        {kpis ? (
          <section data-slot="ic-scorecard-kpis" aria-label="Key metrics" style={{ minWidth: 0, marginTop: -gap / 4 }}>
            <KpiGrid {...kpis} />
          </section>
        ) : null}
        {rankingNode || trendNodes.length ? (
          <section data-slot="ic-scorecard-body" aria-label="Breakdown and trends" style={{ ...block, display: "grid", gridTemplateColumns: split ? "minmax(0, 1fr) minmax(0, 1.15fr)" : "minmax(0, 1fr)", gap: phone ? 32 : "32px 48px", alignItems: "start" }}>
            {rankingNode ? <div style={{ minWidth: 0 }}>{rankingNode}</div> : null}
            {trendNodes.length ? <div style={{ minWidth: 0, display: "grid", gridTemplateColumns: `repeat(${trendCols}, minmax(0, 1fr))`, gap: phone ? 32 : "32px 40px", alignItems: "start" }}>{trendNodes}</div> : null}
          </section>
        ) : null}
        {table != null ? (
          <section data-slot="ic-scorecard-table" aria-label="Comparison" style={block}>
            {isProps(table) ? <ComparisonTable {...(table as unknown as ComparisonTableProps)} /> : renderSlot(table as Slot)}
          </section>
        ) : null}
        {list.length ? (
          <section data-slot="ic-scorecard-notes" style={block}>
            <Heading level={below(level)}>{notesTitle}</Heading>
            <ul style={{ listStyle: "none", margin: "16px 0 0", padding: 0, display: "grid", gridTemplateColumns: `repeat(${noteCols}, minmax(0, 1fr))`, gap: phone ? 16 : "20px 32px" }}>
              {list.map((item, i) => (
                <li key={i} data-slot="ic-scorecard-note" style={{ minWidth: 0, borderLeft: "2px solid var(--_ic-grid)", paddingLeft: 12 }}>
                  <div style={{ fontSize: "0.9375rem", lineHeight: 1.4, fontWeight: 600, color: "var(--_ic-ink)", textWrap: "pretty" }}>{item.title}</div>
                  {item.text ? <Prose text={item.text} size="sm" tone="muted" style={{ marginTop: 4 }} /> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <Sourcing sources={sources} period={period} method={method} note={note} credit={credit} />
      </Provide>
    </article>
  );
}

const STORE = [
  [18.2, 2.61, 64.1, 8.1],
  [26.9, 3.02, 66.8, 8.4],
  [17.1, 2.55, 63.0, 9.0],
  [16.4, 2.58, 62.4, 8.2],
  [17.9, 2.66, 62.9, 8.0],
  [18.8, 2.71, 62.2, 7.9],
  [19.6, 2.74, 61.8, 8.3],
  [19.9, 2.78, 61.5, 8.1],
  [20.4, 2.83, 61.9, 8.4],
  [21.3, 2.9, 61.2, 9.6],
  [22.2, 2.97, 60.8, 10.5],
  [24.9, 3.1, 61.0, 11.4],
];
const OUTERWEAR_RETURNS = [13.0, 13.2, 13.6, 13.1, 12.9, 13.3, 13.0, 13.4, 13.2, 13.5, 16.1, 17.8, 19.2];
const store = STORE.map(([orders, conversion, aov, returns], i) => ({ month: new Date(Date.UTC(2023, 10 + i, 1)).toISOString().slice(0, 10), orders: orders * 1000, conversion, aov, returns, outerwear: OUTERWEAR_RETURNS[i] }));
const categories = [
  { category: "Outerwear", revenue: 412, change: 0.31, returns: 19.2 },
  { category: "Footwear", revenue: 371, change: 0.08, returns: 14.1 },
  { category: "Knitwear", revenue: 298, change: 0.22, returns: 9.8 },
  { category: "Accessories", revenue: 164, change: -0.04, returns: 4.2 },
  { category: "Denim", revenue: 152, change: -0.11, returns: 12.6 },
  { category: "Home", revenue: 88, change: 0.02, returns: 3.1 },
];
export const Scorecard = withMeta(ScorecardImpl, {
  name: "scorecard",
  component: "Scorecard",
  title: "Scorecard",
  level: "template",
  category: "layout",
  description: "A recurring report. It has a masthead with the report name and period, a headline that states the main change, a KPI grid with changes and sparklines, a ranked list beside one or two trend charts, an optional comparison table, short notes and a source note.",
  whenToUse: "Use it for weekly or monthly numbers. Keep the layout the same in every edition so readers know where each number is. Change the headline each edition to state the main change with its number. The headline and the KPI row should be enough for a reader who stops there. The ranking, trends and notes add detail. Highlight the one row or series the headline is about and leave the rest grey.",
  avoid: "A one-off finding (use `executive-brief`). Readers who need to filter the data themselves (use `data-explorer`). More than six KPIs.",
  composes: ["headline", "kpi-grid", "ranked-list", "comparison-table", "prose", "source-note", "line-chart", "bar-chart", "bullet-chart"],
  props: [
    { name: "title", type: "string", required: true, description: "The main change this period, as one plain sentence with the number in it." },
    { name: "kicker", type: "string", description: 'The name of the report, e.g. "Store scorecard". Shown in the masthead.' },
    { name: "reportPeriod", type: "string", description: 'The period reported, e.g. "October 2024". Shown opposite the report name.' },
    { name: "deck", type: "string", description: "One-sentence standfirst." },
    { name: "byline", type: "string", description: "Author line." },
    { name: "date", type: "string", description: "Publication date." },
    { name: "kpis", type: "{ data, x, metrics, compare?, change?, columns? }", description: "The headline metrics: the props of `kpi-grid`. One time-ordered dataset, one card per metric." },
    { name: "ranking", type: "{ data, name, value, change?, highlight?, title?, ... } | Slot", description: "A ranking: the props of `ranked-list`, or any spec or element." },
    { name: "trends", type: "Slot[]", description: "One or two trend exhibits, shown beside the ranking in wide containers." },
    { name: "table", type: "{ data, columns, highlight?, sort?, title?, ... } | Slot", description: "A comparison across entities: the props of `comparison-table`, or any spec or element." },
    { name: "notes", type: "(string | { title, text? })[]", description: "Short notes on what changed in the period. Each states one fact with its number." },
    { name: "notesTitle", type: "string", default: '"Notes"', description: "Heading of the notes." },
    ...SOURCING_DOCS,
    ...FRAME_DOCS,
  ],
  example: {
    type: "scorecard",
    theme: "noir",
    kicker: "Online store scorecard",
    reportPeriod: "October 2024",
    title: "Orders rose 12% in October to 24,900",
    deck: "The return rate was 11.4%. It was 8.4% in July, the month before free returns launched. Outerwear had the highest return rate at 19.2%.",
    kpis: {
      data: store,
      x: "month",
      compare: "previous",
      metrics: [
        { variant: "area", y: "orders", label: "Orders", format: "compact", deltaLabel: "vs September" },
        { variant: "area", y: "conversion", label: "Conversion rate", format: "{value}%", delta: "+0.13 pts", deltaLabel: "vs September" },
        { variant: "area", y: "aov", label: "Average order value", format: "currency:EUR", deltaLabel: "vs September" },
        { variant: "area", y: "returns", label: "Return rate", format: "{value}%", delta: "+0.9 pts", upIsGood: false, deltaLabel: "vs September" },
      ],
    },
    ranking: { data: categories, name: "category", value: "revenue", change: "change", format: "€{value}k", highlight: "Outerwear", title: "Outerwear revenue rose 31% to €412k in October", subtitle: "Revenue by category, October, with change on September" },
    trends: [
      { type: "line-chart", data: store, x: "month", y: ["outerwear", "returns"], names: { outerwear: "Outerwear", returns: "All orders" }, format: "{value}%", zero: true, title: "The return rate rose from 8.4% in July to 11.4% in October", subtitle: "Share of orders returned by month of order, all orders and outerwear", annotations: [{ type: "line", axis: "x", value: "2024-08-01", label: "Free returns" }] },
      { type: "bar-chart", data: categories, x: "category", y: "returns", sort: "desc", orientation: "horizontal", format: "{value}%", highlight: "Outerwear", title: "19.2% of outerwear orders were returned in October", subtitle: "Return rate by category, October" },
    ],
    notes: [
      { title: "Returns cost about €62k in October", text: "About 2,840 parcels came back. Carriage and handling cost €22 a parcel. At September's return rate of 10.5% the cost would have been about €58k." },
      { title: "62% of outerwear returns give “too small” as the reason", text: "A size guide goes into test on 4 November." },
      { title: "Orders were highest in December 2023 at 26,900", text: "October 2024 was the second-highest month of the 12." },
    ],
    sources: ["Store order database", "Returns portal"],
    period: "November 2023 to October 2024",
    method: "Return rate is by month of order and is revised for 30 days as parcels arrive.",
    note: "Illustrative data",
  },
});
