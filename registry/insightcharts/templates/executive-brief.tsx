"use client";

import { Headline } from "@/components/insightcharts/atoms/headline";
import { Prose } from "@/components/insightcharts/atoms/prose";
import { withMeta, renderSlot, type Slot } from "insightcharts/core";
import { ChartCallout } from "@/components/insightcharts/molecules/chart-callout";
import { Provide } from "@/components/insightcharts/molecules/_shared";
import { StatRow, type StatRowItem } from "@/components/insightcharts/molecules/stat-row";
import { below, frame, FRAME_DOCS, Heading, Label, RULE, Sourcing, SOURCING_DOCS, useTemplate, withHeight, type TemplateProps, type TemplateSourcing } from "@/components/insightcharts/templates/_shared";

export interface ExecutiveBriefTakeaway {
  /** The main fact the hero shows, in one short sentence. Shown in bold. */
  lead?: string;
  /** One or two sentences with the supporting numbers. */
  body?: string;
  /** Small label above the lead. Default "Takeaway". */
  label?: string;
  tone?: "neutral" | "positive" | "negative" | "accent";
}

export interface ExecutiveBriefAction {
  /** The action, as an imperative. */
  title: string;
  /** Why, or what it involves. */
  text?: string;
  /** Who owns it and by when, e.g. "Growth · by 31 March". */
  owner?: string;
}

export interface ExecutiveBriefProps extends TemplateProps, TemplateSourcing {
  /** The main finding, as one plain sentence with the number and the period in it. */
  title: string;
  /** Small label above the title: the report series or team. */
  kicker?: string;
  /** One to three short sentences. Each states one more fact. */
  deck?: string;
  byline?: string;
  /** Publication date. ISO dates are formatted for the locale. */
  date?: string;
  /** Three or four key figures, most important first. */
  figures?: StatRowItem[];
  /** The hero exhibit: the one chart that shows the main finding. Its `title` states one fact with its number. */
  hero: Slot;
  /** The callout beside the hero. */
  takeaway?: ExecutiveBriefTakeaway;
  /** Two smaller supporting exhibits, shown side by side. */
  supporting?: Slot[];
  /** "What to do": two to four recommended actions. */
  actions?: (string | ExecutiveBriefAction)[];
  /** Heading of the actions list. */
  actionsTitle?: string;
}

/**
 * A one-page summary for a decision-maker. The headline states the main finding. Below it
 * are the key figures, one hero chart, two smaller supporting charts, a list of
 * recommended actions and the source note.
 */
function ExecutiveBriefImpl({ title, kicker, deck, byline, date, figures, hero, takeaway, supporting, actions, actionsTitle = "What to do", sources, period, method, note, credit, level = 1, maxWidth = 960, className, style, ...rest }: ExecutiveBriefProps) {
  const { ref, width, mode, root, phone, gap } = useTemplate(rest);
  const support = (supporting ?? []).slice(0, 3);
  const supportCols = width >= 640 ? Math.min(support.length, width >= 900 ? 3 : 2) : 1;
  const steps = (actions ?? []).map((a) => (typeof a === "string" ? { title: a } : a));
  const actionCols = width >= 720 ? Math.min(steps.length, 3) : 1;
  const heroChart = withHeight(hero, phone ? 260 : 340);
  return (
    <article ref={ref} data-slot="ic-executive-brief" data-ic-mode={mode} className={className} style={{ ...frame(root, maxWidth, gap), ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <Headline size="page" title={title} kicker={kicker} deck={deck} byline={byline} date={date} level={level} />
        {figures?.length ? (
          <section data-slot="ic-executive-brief-figures" aria-label="Key figures" style={{ minWidth: 0, borderTop: RULE, borderBottom: RULE, padding: phone ? "20px 0" : "24px 0", marginTop: -gap / 4 }}>
            <StatRow items={figures.slice(0, 4)} />
          </section>
        ) : null}
        <section data-slot="ic-executive-brief-hero" aria-label="Main finding" style={{ minWidth: 0 }}>
          {takeaway?.lead || takeaway?.body ? <ChartCallout chart={heroChart} lead={takeaway.lead} body={takeaway.body} label={takeaway.label ?? "Takeaway"} tone={takeaway.tone ?? "accent"} /> : renderSlot(heroChart)}
        </section>
        {support.length ? (
          <section data-slot="ic-executive-brief-supporting" aria-label="Supporting evidence" style={{ minWidth: 0, borderTop: RULE, paddingTop: phone ? 24 : 32, display: "grid", gridTemplateColumns: `repeat(${supportCols}, minmax(0, 1fr))`, gap: phone ? 32 : "32px 40px", alignItems: "start" }}>
            {support.map((slot, i) => (
              <div key={i} data-slot="ic-template-block" style={{ minWidth: 0 }}>
                {renderSlot(withHeight(slot, 220))}
              </div>
            ))}
          </section>
        ) : null}
        {steps.length ? (
          <section data-slot="ic-executive-brief-actions" aria-labelledby={undefined} style={{ minWidth: 0, borderTop: RULE, paddingTop: phone ? 24 : 32 }}>
            <Heading level={below(level)}>{actionsTitle}</Heading>
            <ol style={{ listStyle: "none", margin: "16px 0 0", padding: 0, display: "grid", gridTemplateColumns: `repeat(${actionCols}, minmax(0, 1fr))`, gap: phone ? 16 : "20px 32px" }}>
              {steps.map((step, i) => (
                <li key={i} data-slot="ic-executive-brief-action" style={{ minWidth: 0, display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", columnGap: 12, alignItems: "baseline" }}>
                  <span aria-hidden style={{ fontSize: "0.8125rem", lineHeight: 1.5, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "var(--_ic-muted)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.9375rem", lineHeight: 1.4, fontWeight: 600, color: "var(--_ic-ink)", textWrap: "pretty" }}>{step.title}</div>
                    {step.text ? <Prose text={step.text} size="sm" tone="muted" style={{ marginTop: 4 }} /> : null}
                    {step.owner ? <Label style={{ marginTop: 6, fontWeight: 500 }}>{step.owner}</Label> : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
        <Sourcing sources={sources} period={period} method={method} note={note} credit={credit} />
      </Provide>
    </article>
  );
}

const months = (values: number[], year = 2024) => values.map((v, i) => ({ month: new Date(Date.UTC(year, i, 1)).toISOString().slice(0, 10), value: v }));
const churn = months([4.2, 4.3, 4.1, 3.6, 3.1, 2.9, 2.6, 2.4, 2.3, 2.2, 2.1, 2.1]).map(({ month, value }) => ({ month, churn: value }));
const byPlan = [
  { plan: "Starter", jan: 6.1, dec: 2.9 },
  { plan: "Team", jan: 4.0, dec: 2.0 },
  { plan: "Business", jan: 2.4, dec: 1.6 },
  { plan: "Enterprise", jan: 0.9, dec: 0.8 },
];
const reasons = [
  { reason: "Setup not finished", before: 38, after: 14 },
  { reason: "Too expensive", before: 22, after: 27 },
  { reason: "Missing a feature", before: 17, after: 24 },
  { reason: "Went to a rival", before: 13, after: 19 },
  { reason: "Company closed", before: 10, after: 16 },
];
export const ExecutiveBrief = withMeta(ExecutiveBriefImpl, {
  name: "executive-brief",
  component: "ExecutiveBrief",
  title: "Executive brief",
  level: "template",
  category: "layout",
  description: "A one-page summary. It has a headline that states the main finding with its number, a deck, a row of three or four key figures, one hero chart with a takeaway callout, two smaller supporting exhibits, a short list of actions and a source note.",
  whenToUse: "Use it when a decision-maker will spend about a minute on the page. State the main finding with its number and period in the headline. The headline and the hero chart should be enough for a reader who stops there. The figures, supporting exhibits and actions add detail. Use one accent colour for the subject (`highlight`) and leave everything else grey. Mark the cause on the hero as an annotation. The proportions suit a printed page.",
  avoid: "More than one hero or more than three supporting exhibits (use `report-page`). A recurring set of numbers with no single finding (use `scorecard`). A story told in several steps (use `visual-essay`).",
  composes: ["headline", "stat-row", "chart-callout", "prose", "source-note", "line-chart", "dumbbell-chart", "bar-chart"],
  props: [
    { name: "title", type: "string", required: true, description: "The main finding, as one plain sentence with the number and the period in it." },
    { name: "kicker", type: "string", description: "Small label above the title: the report series or team." },
    { name: "deck", type: "string", description: "One to three short sentences. Each states one more fact." },
    { name: "byline", type: "string", description: "Author line, shown as written." },
    { name: "date", type: "string", description: "Publication date. ISO dates are formatted for the locale." },
    { name: "figures", type: "{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }[]", description: "Three or four key figures, most important first. Rendered with `stat-row`." },
    { name: "hero", type: "Slot", required: true, description: "The hero exhibit: a chart spec or element whose `title` states one fact with its number. Gets a height of 340px (260px on phones) unless it sets one." },
    { name: "takeaway", type: "{ lead?, body?, label?, tone? }", description: "The callout beside the hero. `lead` is one short sentence stating the main fact. `body` gives the supporting numbers." },
    { name: "supporting", type: "Slot[]", description: "Two (at most three) smaller exhibits shown side by side; they stack in narrow containers. Default height 220px." },
    { name: "actions", type: "(string | { title, text?, owner? })[]", description: "Recommended actions, numbered. Two to four." },
    { name: "actionsTitle", type: "string", default: '"What to do"', description: "Heading of the actions list." },
    ...SOURCING_DOCS,
    ...FRAME_DOCS,
  ],
  example: {
    type: "executive-brief",
    kicker: "Retention review · Q4 2024",
    title: "Monthly churn fell from 4.2% to 2.1% in 2024",
    deck: "The new onboarding shipped in March. Accounts that joined before March still churn at 3.8% a month.",
    byline: "Growth analytics",
    date: "2025-01-14",
    figures: [
      { value: "2.1%", label: "Monthly churn, December", delta: "−2.1 pts", deltaLabel: "vs January", upIsGood: false },
      { value: 0.61, format: "percent", label: "New accounts finishing setup in week one", delta: "+19 pts", deltaLabel: "vs January" },
      { value: 1.12, format: "percent", label: "Net revenue retention", context: "Top quartile for the sector is 110%" },
      { value: "$1.9m", label: "Annual revenue retained", context: "Compared with churn staying at the January rate of 4.2%" },
    ],
    hero: {
      type: "line-chart",
      data: churn,
      x: "month",
      y: "churn",
      format: "{value}%",
      zero: true,
      title: "Monthly churn fell from 4.1% in March to 2.1% in December",
      subtitle: "Share of paying accounts cancelling each month, 2024",
      annotations: [
        { type: "line", axis: "x", value: "2024-03-01", label: "New onboarding ships" },
        { type: "band", axis: "y", from: 2, to: 2.5, label: "Target range" },
      ],
      source: "Billing system",
    },
    takeaway: {
      lead: "Churn was between 2.1% and 2.4% from August to December",
      body: "The new onboarding shipped in March. Churn did not fall in the same months of 2023.",
    },
    supporting: [
      { type: "dumbbell-chart", data: byPlan, category: "plan", from: "jan", to: "dec", names: { jan: "January", dec: "December" }, format: "{value}%", sort: "none", highlight: "Starter", title: "Starter plan churn fell from 6.1% to 2.9%", subtitle: "Monthly churn by plan, January and December 2024" },
      { type: "bar-chart", data: reasons, x: "reason", y: "after", sort: "none", orientation: "horizontal", format: "{value}%", highlight: "Setup not finished", title: "“Setup not finished” was the reason for 14% of cancellations in Q4", subtitle: "Share of cancellations by stated reason, Q4 2024. “Setup not finished” was 38% in Q1" },
    ],
    actions: [
      { title: "Offer the guided setup to the 2,400 accounts that joined before March", text: "These accounts churn at 3.8% a month.", owner: "Lifecycle · by end of February" },
      { title: "Make the setup checklist the default on the Team plan", text: "The checklist is opt-in on Team today. Team churn was 2.0% in December.", owner: "Product · Q1" },
      { title: "Measure churn again in March 2025", text: "That will give 12 months of data since the new onboarding shipped.", owner: "Growth analytics" },
    ],
    sources: ["Billing system", "Product analytics warehouse"],
    period: "January to December 2024, monthly",
    method: "Churn is the share of accounts paying at the start of a month that cancel during it. Downgrades are not counted.",
    note: "Illustrative data",
  },
});
