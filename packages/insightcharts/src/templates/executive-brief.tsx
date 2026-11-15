import { Headline } from "../atoms/headline";
import { Prose } from "../atoms/prose";
import { withMeta } from "../core/meta";
import { renderSlot, type Slot } from "../core/spec";
import { ChartCallout } from "../molecules/chart-callout";
import { Provide } from "../molecules/_shared";
import { StatRow, type StatRowItem, type StatRowProps } from "../molecules/stat-row";
import { below, frame, FRAME_DOCS, Heading, Label, RULE, Sourcing, SOURCING_DOCS, useTemplate, withHeight, type TemplateProps, type TemplateSourcing } from "./_shared";

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
  /** Three or four key figures, most important first: a list of figures, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn. */
  figures?: StatRowItem[] | StatRowProps;
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
  const keyFigures: StatRowProps | null = Array.isArray(figures) ? (figures.length ? { items: figures } : null) : figures?.items?.length ? figures : null;
  return (
    <article ref={ref} data-slot="ic-executive-brief" data-ic-mode={mode} className={className} style={{ ...frame(root, maxWidth, gap), ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <Headline size="page" title={title} kicker={kicker} deck={deck} byline={byline} date={date} level={level} />
        {keyFigures ? (
          <section data-slot="ic-executive-brief-figures" aria-label="Key figures" style={{ minWidth: 0, borderTop: RULE, borderBottom: RULE, padding: phone ? "20px 0" : "24px 0", marginTop: -gap / 4 }}>
            <StatRow {...keyFigures} items={keyFigures.items.slice(0, 4)} />
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
const churn2023 = [4.4, 4.3, 4.4, 4.2, 4.3, 4.1, 4.2, 4.3, 4.1, 4.2, 4.3, 4.2];
const churn = months([4.2, 4.3, 4.1, 3.6, 3.1, 2.9, 2.6, 2.4, 2.3, 2.2, 2.1, 2.1]).map(({ month, value }, i) => ({ month, churn: value, prior: churn2023[i] }));
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

const waits = [71.2, 70.4, 69.8, 70.9, 72.3, 73.0, 72.1, 71.6, 73.4, 75.8, 77.9, 78.6].map((within, i) => ({ month: new Date(Date.UTC(2024, i, 1)).toISOString().slice(0, 10), within }));
const sites = [
  { site: "St Anne's", before: 68, after: 81 },
  { site: "Riverside", before: 72, after: 79 },
  { site: "Northgate", before: 74, after: 76 },
  { site: "Queen Mary", before: 70, after: 71 },
];
const stages = [
  { stage: "Arrival to triage", minutes: 14 },
  { stage: "Triage to clinician", minutes: 68 },
  { stage: "Tests and decision", minutes: 87 },
  { stage: "Waiting for a bed", minutes: 121 },
];

const ownFleet = [88.0, 88.4, 88.9, 89.6, 90.8, 91.9, 92.8, 93.6, 94.1, 94.6, 95.0, 95.2];
const partners = [83.1, 83.0, 83.6, 84.2, 85.0, 86.1, 87.3, 88.2, 89.0, 89.8, 90.4, 90.6];
const onTime = ownFleet.map((own, i) => ({ month: new Date(Date.UTC(2024, i, 1)).toISOString().slice(0, 10), own, partner: partners[i] }));
const lateBySlot = [
  { window: "Morning", late: [4.1, 3.8, 3.9, 4.4, 5.2, 4.9] },
  { window: "Afternoon", late: [5.6, 5.1, 5.3, 6.0, 8.1, 6.4] },
  { window: "Evening", late: [7.9, 7.2, 7.4, 8.8, 13.8, 9.1] },
].flatMap(({ window, late }) => late.map((share, i) => ({ window, day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i], share })));
const regionChange = [
  { region: "North", change: 9.8 },
  { region: "East", change: 8.4 },
  { region: "Central", change: 7.9 },
  { region: "South", change: 6.1 },
  { region: "Islands", change: -1.7 },
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
  composes: ["headline", "stat-row", "chart-callout", "prose", "source-note", "line-chart", "dumbbell-chart", "slope-chart", "bar-chart", "heatmap", "diverging-bar-chart"],
  props: [
    { name: "title", type: "string", required: true, description: "The main finding, as one plain sentence with the number and the period in it." },
    { name: "kicker", type: "string", description: "Small label above the title: the report series or team." },
    { name: "deck", type: "string", description: "One to three short sentences. Each states one more fact." },
    { name: "byline", type: "string", description: "Author line, shown as written." },
    { name: "date", type: "string", description: "Publication date. ISO dates are formatted for the locale." },
    { name: "figures", type: "StatRowItem[] | StatRowProps", description: "Three or four key figures, most important first. A list of `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format? }`, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn." },
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
    theme: "ledger",
    kicker: "Retention review · Q4 2024",
    title: "Monthly churn fell from 4.2% to 2.1% in 2024",
    deck: "The new onboarding shipped in March. Accounts that joined before March still churn at 3.8% a month.",
    byline: "Growth analytics",
    date: "2025-01-14",
    figures: {
      variant: "tiles",
      items: [
        { surface: "outline-accent", edge: "top", value: "2.1%", label: "Monthly churn, December", delta: "−2.1 pts", deltaLabel: "vs January", upIsGood: false },
        { surface: "outline-accent", edge: "top", value: 0.61, format: "percent", label: "New accounts finishing setup in week one", delta: "+19 pts", deltaLabel: "vs January" },
        { surface: "outline-accent", edge: "top", value: 1.12, format: "percent", label: "Net revenue retention", context: "Top quartile for the sector is 110%" },
        { surface: "outline-accent", edge: "top", value: "$1.9m", label: "Annual revenue retained", context: "Compared with churn staying at the January rate of 4.2%" },
      ],
    },
    hero: {
      type: "line-chart",
      data: churn,
      x: "month",
      y: ["churn", "prior"],
      names: { churn: "2024", prior: "2023" },
      highlight: "churn",
      contextLabels: true,
      format: "{value}%",
      zero: true,
      title: "Monthly churn fell from 4.1% in March to 2.1% in December",
      subtitle: "Share of paying accounts cancelling each month, 2024 and the same months of 2023",
      annotations: [
        { type: "line", axis: "x", value: "2024-03-01", label: "New onboarding ships" },
        { type: "band", axis: "y", from: 2, to: 2.5, label: "Target range" },
      ],
      source: "Billing system",
    },
    takeaway: {
      lead: "Churn was between 2.1% and 2.4% from August to December",
      body: "The new onboarding shipped in March. Churn was between 4.1% and 4.4% in every month of 2023.",
    },
    supporting: [
      { type: "dumbbell-chart", data: byPlan, category: "plan", from: "jan", to: "dec", names: { jan: "January", dec: "December" }, format: "{value}%", sort: "none", highlight: "Starter", title: "Starter plan churn fell from 6.1% to 2.9%", subtitle: "Monthly churn by plan, January and December 2024" },
      { type: "slope-chart", data: reasons, series: "reason", y: ["before", "after"], names: { before: "Q1", after: "Q4" }, format: "{value}%", highlight: "Setup not finished", height: 260, title: "“Setup not finished” fell from 38% to 14% of cancellations", subtitle: "Share of cancellations by stated reason, Q1 and Q4 2024" },
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

export const examples = {
  "Public health: emergency department waits": {
    theme: "science",
    kicker: "Urgent care board · December 2024",
    title: "78.6% of emergency patients were seen within four hours in December 2024",
    deck: "The share was 71.2% in January. St Anne's opened a same-day assessment unit in September. Its four-hour performance rose from 68% to 81%.",
    date: "2025-01-09",
    figures: {
      variant: "tiles",
      items: [
        { variant: "icon", icon: "hospital", value: "78.6%", label: "Seen within four hours, December", delta: "+7.4 pts", deltaLabel: "vs January" },
        { variant: "icon", icon: "clock", value: "4h 50m", label: "Median time in department for admitted patients", delta: "−38 min", deltaLabel: "vs January", upIsGood: false },
        { variant: "icon", icon: "person", value: 412, label: "Waits over twelve hours", delta: -0.31, deltaLabel: "vs January", upIsGood: false },
      ],
    },
    hero: {
      type: "line-chart",
      data: waits,
      x: "month",
      y: "within",
      format: "{value}%",
      title: "Four-hour performance rose from 73.4% in September to 78.6% in December",
      subtitle: "Share of emergency attendances admitted, transferred or discharged within four hours, all sites, 2024",
      annotations: [
        { type: "line", axis: "x", value: "2024-09-01", label: "Assessment unit opens" },
        { type: "line", axis: "y", value: 78, label: "National standard, 78%" },
      ],
    },
    takeaway: { lead: "The 78% national standard was met in December", body: "Performance was 77.9% in November and 78.6% in December. It was between 69.8% and 73.4% from January to September.", tone: "positive" },
    supporting: [
      { type: "dumbbell-chart", data: sites, category: "site", from: "before", to: "after", names: { before: "Jan to Aug", after: "Sep to Dec" }, format: "{value}%", sort: "gap", highlight: "St Anne's", title: "St Anne's rose from 68% to 81% after its unit opened", subtitle: "Four-hour performance by site, before and after September" },
      { type: "bar-chart", data: stages, x: "stage", y: "minutes", sort: "none", orientation: "horizontal", format: "{value} min", highlight: "Waiting for a bed", title: "Admitted patients waited a median of 121 minutes for a bed", subtitle: "Median minutes per stage, admitted patients, Q4 2024" },
    ],
    actions: ["Open a same-day assessment unit at Riverside", "Fund weekend discharge teams to cut the 121-minute wait for a bed", "Report four-hour performance separately for each of the four sites"],
    sources: "Trust emergency care dataset",
    period: "January to December 2024",
    note: "Illustrative data",
  },
  "Logistics: on-time delivery, two carriers": {
    kicker: "Operations review · 2024",
    title: "On-time deliveries rose from 86.1% to 93.4% in 2024",
    deck: "Route planning software went live in April. Partner carriers delivered 90.6% of parcels on time in December.",
    byline: "Network operations",
    date: "2025-01-21",
    figures: [
      { value: "93.4%", label: "Parcels delivered on the promised day, December", delta: "+7.3 pts", deltaLabel: "vs January" },
      { value: "1.84m", label: "Parcels delivered in 2024", delta: 0.11, deltaLabel: "vs 2023" },
      { value: "€4.10", label: "Delivery cost per parcel", delta: "−€0.35", deltaLabel: "vs 2023", upIsGood: false },
    ],
    hero: {
      type: "line-chart",
      data: onTime,
      x: "month",
      y: ["own", "partner"],
      names: { own: "Own fleet", partner: "Partner carriers" },
      format: "{value}%",
      title: "Own-fleet on-time delivery was 95.2% in December 2024",
      subtitle: "Share of parcels delivered on the promised day, by carrier type, monthly, 2024",
      annotations: [
        { type: "line", axis: "x", value: "2024-04-01", label: "Route planning goes live" },
        { type: "line", axis: "y", value: 95, label: "Target, 95%" },
      ],
    },
    takeaway: { lead: "The own fleet met the 95% target in November and December", body: "Partner carriers were at 90.6% in December. That is 4.6 points below the own fleet.", tone: "positive" },
    supporting: [
      { type: "heatmap", data: lateBySlot, x: "day", y: "window", value: "share", format: "{value}%", labels: true, title: "13.8% of Friday evening deliveries were late in Q4", subtitle: "Share of parcels delivered late, by weekday and delivery window, Q4 2024" },
      { type: "diverging-bar-chart", data: regionChange, x: "region", y: "change", sort: "none", format: "{value} pts", title: "On-time delivery in the Islands region fell 1.7 points in 2024", subtitle: "Change in on-time share, January to December 2024, percentage points" },
    ],
    actions: [
      { title: "Add a second evening shift on Fridays", text: "13.8% of Friday evening deliveries were late in Q4.", owner: "Depot managers · by March" },
      { title: "Give partner carriers access to the route planner", text: "Partner carriers were 4.6 points below the own fleet in December.", owner: "Carrier management · Q2" },
      { title: "Review the ferry schedule for the Islands region", text: "It is the only region where on-time delivery fell in 2024.", owner: "Network planning" },
    ],
    sources: "Delivery management system",
    period: "January to December 2024, monthly",
    method: "A parcel is on time when it is delivered on the day promised at checkout.",
    note: "Illustrative data",
  },
};
