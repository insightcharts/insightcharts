"use client";

import { Headline } from "@/components/insightcharts/atoms/headline";
import { Prose } from "@/components/insightcharts/atoms/prose";
import { withMeta, renderSlot, type Slot } from "insightcharts/core";
import { Provide } from "@/components/insightcharts/molecules/_shared";
import { StatRow, type StatRowItem, type StatRowProps } from "@/components/insightcharts/molecules/stat-row";
import { asList, below, frame, FRAME_DOCS, Heading, Label, RULE, Sourcing, SOURCING_DOCS, useTemplate, withHeight, type TemplateProps, type TemplateSourcing } from "@/components/insightcharts/templates/_shared";

export interface ReportFinding {
  /** The finding, as one plain sentence with the number in it. */
  title: string;
  /** The exhibit that shows it. */
  exhibit?: Slot;
  /** What the data shows: numbers a second analyst would agree on. */
  observation?: string | string[];
  /** What the authors infer from the observation. It is shown under its own label. */
  interpretation?: string | string[];
  /** How sure the authors are of the interpretation. */
  confidence?: "high" | "medium" | "low";
  /** A caveat specific to this finding. */
  caveat?: string;
  id?: string;
}

export interface ReportPageProps extends TemplateProps, Omit<TemplateSourcing, "method"> {
  /** The report's main finding, as one plain sentence with the number in it. */
  title: string;
  /** The report series or section, e.g. "Evaluation report · Section 3". */
  kicker?: string;
  deck?: string;
  byline?: string;
  date?: string;
  /** One paragraph with the main findings, their numbers and the recommendation. */
  summary?: string | string[];
  /** Heading of the summary. */
  summaryTitle?: string;
  /** Two to four key figures under the summary: a list of figures, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn. */
  figures?: StatRowItem[] | StatRowProps;
  /** Numbered findings, each with one exhibit. */
  findings?: ReportFinding[];
  /** Label over each observation. */
  observationLabel?: string;
  /** Label over each interpretation. */
  interpretationLabel?: string;
  /** How the analysis was done. */
  method?: string | string[];
  /** What the analysis cannot show. */
  limitations?: string[];
}

const CONFIDENCE = { high: 3, medium: 2, low: 1 } as const;

/** Three pips: confidence shown by count, not colour. */
function Confidence({ value }: { value: "high" | "medium" | "low" }) {
  return (
    <span data-slot="ic-report-page-confidence" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.75rem", lineHeight: 1.4, color: "var(--_ic-ink-2)", whiteSpace: "nowrap" }}>
      <span aria-hidden style={{ display: "inline-flex", gap: 2 }}>
        {[1, 2, 3].map((n) => (
          <span key={n} style={{ width: 6, height: 6, borderRadius: 999, boxSizing: "border-box", border: "1px solid var(--_ic-ink-2)", background: n <= CONFIDENCE[value] ? "var(--_ic-ink-2)" : "transparent" }} />
        ))}
      </span>
      {value[0].toUpperCase() + value.slice(1)} confidence
    </span>
  );
}

/**
 * A section of an analytical report. The summary comes first. Each numbered finding has
 * one exhibit, an observation and a separately labelled interpretation. Method and
 * limitations come last.
 */
function ReportPageImpl({ title, kicker, deck, byline, date, summary, summaryTitle = "Summary", figures, findings, observationLabel = "What the data shows", interpretationLabel = "What we think it means", method, limitations, sources, period, note, credit, level = 1, maxWidth = 920, className, style, ...rest }: ReportPageProps) {
  const { ref, width, mode, root, phone, gap } = useTemplate(rest);
  const list = findings ?? [];
  const keyFigures: StatRowProps | null = Array.isArray(figures) ? (figures.length ? { items: figures } : null) : figures?.items?.length ? figures : null;
  const sub = below(level);
  const wide = width >= 760;
  const methodText = asList(method);
  const limits = limitations ?? [];
  return (
    <article ref={ref} data-slot="ic-report-page" data-ic-mode={mode} className={className} style={{ ...frame(root, maxWidth, gap), ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <Headline size="page" title={title} kicker={kicker} deck={deck} byline={byline} date={date} level={level} />
        {summary ? (
          <section data-slot="ic-report-page-summary" aria-label={summaryTitle} style={{ minWidth: 0, display: "grid", gridTemplateColumns: wide ? "160px minmax(0, 1fr)" : "minmax(0, 1fr)", gap: wide ? 32 : 12, borderTop: "2px solid var(--_ic-ink)", borderBottom: RULE, padding: phone ? "20px 0" : "24px 0", marginTop: -gap / 4 }}>
            <Heading level={sub} style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}>
              {summaryTitle}
            </Heading>
            <Prose text={summary} size={phone ? "md" : "lg"} measure={70} />
          </section>
        ) : null}
        {keyFigures ? (
          <section data-slot="ic-report-page-figures" aria-label="Key figures" style={{ minWidth: 0, marginTop: summary ? -gap / 2 : 0 }}>
            <StatRow {...keyFigures} />
          </section>
        ) : null}
        {list.map((finding, i) => (
          <section key={i} id={finding.id} data-slot="ic-report-page-finding" aria-label={finding.title} style={{ minWidth: 0, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: phone ? 20 : 24 }}>
            <header style={{ display: "grid", gridTemplateColumns: wide ? "160px minmax(0, 1fr)" : "minmax(0, 1fr)", gap: wide ? 32 : 4, alignItems: "baseline" }}>
              <Label style={{ fontVariantNumeric: "tabular-nums" }}>Finding {i + 1}</Label>
              <Heading level={sub} size="lg" style={{ maxWidth: "30em" }}>
                {finding.title}
              </Heading>
            </header>
            {finding.exhibit != null ? (
              <div data-slot="ic-report-page-exhibit" style={{ minWidth: 0, marginLeft: wide ? 192 : 0 }}>
                {renderSlot(withHeight(finding.exhibit, phone ? 260 : 300))}
              </div>
            ) : null}
            {finding.observation || finding.interpretation ? (
              <div data-slot="ic-report-page-reading" style={{ minWidth: 0, marginLeft: wide ? 192 : 0, display: "grid", gridTemplateColumns: wide && finding.observation && finding.interpretation ? "minmax(0, 1fr) minmax(0, 1fr)" : "minmax(0, 1fr)", gap: wide ? 32 : 20, borderTop: RULE, paddingTop: 16 }}>
                {finding.observation ? (
                  <div data-slot="ic-report-page-observation" style={{ minWidth: 0 }}>
                    <Label style={{ marginBottom: 6 }}>{observationLabel}</Label>
                    <Prose text={finding.observation} size="sm" />
                  </div>
                ) : null}
                {finding.interpretation ? (
                  <div data-slot="ic-report-page-interpretation" style={{ minWidth: 0, ...(wide ? { borderLeft: RULE, paddingLeft: 32 } : { borderTop: RULE, paddingTop: 16 }) }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "2px 12px", marginBottom: 6 }}>
                      <Label>{interpretationLabel}</Label>
                      {finding.confidence ? <Confidence value={finding.confidence} /> : null}
                    </div>
                    <Prose text={finding.interpretation} size="sm" />
                    {finding.caveat ? <Prose text={`*Caveat.* ${finding.caveat}`} size="sm" tone="muted" style={{ marginTop: 8, fontSize: 13 }} /> : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        ))}
        {methodText.length || limits.length ? (
          <section data-slot="ic-report-page-method" aria-label="Method and limitations" style={{ minWidth: 0, borderTop: RULE, paddingTop: phone ? 24 : 32, display: "grid", gridTemplateColumns: wide && methodText.length && limits.length ? "minmax(0, 1fr) minmax(0, 1fr)" : "minmax(0, 1fr)", gap: wide ? 48 : 24, alignItems: "start" }}>
            {methodText.length ? (
              <div style={{ minWidth: 0 }}>
                <Heading level={sub} style={{ marginBottom: 8 }}>
                  Method
                </Heading>
                <Prose text={methodText} size="sm" tone="muted" />
              </div>
            ) : null}
            {limits.length ? (
              <div style={{ minWidth: 0 }}>
                <Heading level={sub} style={{ marginBottom: 8 }}>
                  Limitations
                </Heading>
                <ul data-slot="ic-report-page-limitations" style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                  {limits.map((item, i) => (
                    <li key={i} style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", columnGap: 10, alignItems: "baseline" }}>
                      <span aria-hidden style={{ color: "var(--_ic-muted)", fontSize: 14 }}>
                        –
                      </span>
                      <Prose text={item} size="sm" tone="muted" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}
        <Sourcing sources={sources} period={period} note={note} credit={credit} />
      </Provide>
    </article>
  );
}

const gains = [
  { subject: "Maths", Tutored: 8.1, Comparison: 5.2 },
  { subject: "Reading", Tutored: 5.9, Comparison: 5.4 },
];
const dose = [
  { sessions: "Under 6", effect: 0.2 },
  { sessions: "6–11", effect: 0.9 },
  { sessions: "12–17", effect: 3.1 },
  { sessions: "18+", effect: 4.4 },
];
export const ReportPage = withMeta(ReportPageImpl, {
  name: "report-page",
  component: "ReportPage",
  title: "Report page",
  level: "template",
  category: "layout",
  description: "A section of an analytical report laid out as a document. It has a title block, a summary, numbered findings, then method, limitations and sources. Each finding has one exhibit, an observation and a separately labelled interpretation with a confidence rating and a caveat.",
  whenToUse: "Use it for readers who will check the reasoning, as in evaluations, research notes, audits and experiment write-ups. State the main finding with its number in the title. Put all the main findings and the recommendation in the summary. Write each finding title as one fact with its number, and give it an exhibit that shows that fact. Put what the data shows in `observation` and what you infer from it in `interpretation`. End with method, limitations and sources.",
  avoid: "A decision-maker who wants only the result (use `executive-brief`). A general audience (use `explainer` or `visual-essay`). Findings without an exhibit. Put those in the summary.",
  composes: ["headline", "prose", "stat-row", "source-note", "bar-chart", "progress-meter", "line-chart", "dumbbell-chart", "histogram", "diverging-bar-chart"],
  props: [
    { name: "title", type: "string", required: true, description: "The report's main finding, as one plain sentence with the number in it." },
    { name: "kicker", type: "string", description: 'The report series or section, e.g. "Evaluation report · Section 3".' },
    { name: "deck", type: "string", description: "One-sentence standfirst." },
    { name: "byline", type: "string", description: "Author line." },
    { name: "date", type: "string", description: "Publication date." },
    { name: "summary", type: "string | string[]", description: "One paragraph with the main findings, their numbers and the recommendation. Supports `**bold**`." },
    { name: "summaryTitle", type: "string", default: '"Summary"', description: "Heading of the summary." },
    { name: "figures", type: "StatRowItem[] | StatRowProps", description: "Two to four key figures shown under the summary. A list of `{ value, label, context?, delta?, ... }`, or the props of `stat-row` (`{ items, variant, ... }`) to choose how they are drawn." },
    { name: "findings", type: "{ title, exhibit?, observation?, interpretation?, confidence?: \"high\" | \"medium\" | \"low\", caveat?, id? }[]", description: "Numbered findings. `observation` is what the data shows; `interpretation` is what the authors infer, with an optional confidence rating and caveat." },
    { name: "observationLabel", type: "string", default: '"What the data shows"', description: "Label over each observation." },
    { name: "interpretationLabel", type: "string", default: '"What we think it means"', description: "Label over each interpretation." },
    { name: "method", type: "string | string[]", description: "How the analysis was done, as its own section." },
    { name: "limitations", type: "string[]", description: "What the analysis cannot show." },
    ...SOURCING_DOCS.filter((p) => p.name !== "method"),
    ...FRAME_DOCS,
  ],
  example: {
    type: "report-page",
    theme: "paper",
    kicker: "Small-group tutoring programme · Year 1 evaluation",
    title: "Tutored pupils gained 2.9 more scaled-score points in maths than matched pupils",
    deck: "The difference in reading was 0.5 points. 31% of tutored pupils were eligible for free school meals against a funding target of 50%.",
    byline: "Evaluation team",
    date: "2025-02-20",
    summary:
      "Pupils offered tutoring gained **2.9 more scaled-score points in maths** over the year than matched pupils who were not. That is about three months of additional learning. The difference in reading was 0.5 points and could be chance. Pupils who attended fewer than 12 sessions gained less than 1 point over their matches. 58% of pupils attended 12 or more. We recommend continuing the maths strand. Attendance should be the main delivery target. The way pupils are selected should change.",
    figures: {
      variant: "tiles",
      items: [
        { variant: "comparison", value: 8.1, comparison: 5.2, valueLabel: "Tutored", comparisonLabel: "Comparison", delta: "+2.9 points", format: "decimal:1", label: "Mean gain in maths, scaled-score points" },
        { variant: "ring", value: 0.58, max: 1, format: "percent", label: "Tutored pupils attending 12 or more sessions", context: "20 sessions were offered" },
        { variant: "progress", value: 0.31, max: 1, target: 0.5, targetLabel: "Funding target", format: "percent", label: "Tutored pupils eligible for free school meals" },
      ],
    },
    findings: [
      {
        title: "Tutored pupils gained 8.1 points in maths against 5.2 for comparison pupils",
        exhibit: { type: "bar-chart", data: gains, x: "subject", y: ["Tutored", "Comparison"], orientation: "horizontal", sort: "none", format: "decimal:1", subtitle: "Mean gain in scaled score, autumn 2023 to summer 2024", source: "Standardised assessments, 42 schools" },
        observation: "The difference in maths was 2.9 points (95% interval 1.6 to 4.2). In reading tutored pupils gained 5.9 points and comparison pupils 5.4. That difference was 0.5 points (−0.7 to 1.7).",
        interpretation: "The maths difference is unlikely to be chance. Trials of similar programmes found effects of about the same size. We do not conclude that reading tutoring failed, because half the reading tutors were recruited after January.",
        confidence: "medium",
        caveat: "Pupils were matched on prior attainment and background. They were not randomised. Unmeasured differences, such as parental engagement, could account for part of the difference.",
      },
      {
        title: "Pupils who attended 18 or more sessions gained 4.4 points over their matches",
        exhibit: { type: "bar-chart", data: dose, x: "sessions", y: "effect", orientation: "vertical", sort: "none", format: { signDisplay: "exceptZero", maximumFractionDigits: 1 }, height: 260, subtitle: "Maths gain over comparison pupils, scaled-score points, by sessions attended (of 20 offered)" },
        observation: "Pupils who attended fewer than 6 sessions gained 0.2 points more than their matches. Those who attended 6 to 11 gained 0.9 points more. 42% of tutored pupils attended fewer than 12 sessions.",
        interpretation: "A gain that rises with attendance is consistent with a real effect. Pupils who attend more may also differ in ways that raise attainment. The effect of extra sessions is therefore probably smaller than the bars show.",
        confidence: "low",
      },
      {
        title: "31% of tutored pupils were eligible for free school meals against a target of 50%",
        exhibit: { type: "progress-meter", label: "Tutored pupils eligible for free school meals", value: 0.31, max: 1, showMax: false, target: 0.5, targetLabel: "Funding target", format: "percent", context: "984 of 3,180 pupils. In the same schools, 38% of all pupils are eligible." },
        observation: "984 of the 3,180 tutored pupils were eligible for free school meals. The funding agreement specifies 50%. 38% of all pupils in the participating schools are eligible.",
        interpretation: "Schools selected pupils by teacher nomination. Nomination appears to favour pupils just below the expected standard over the most disadvantaged. The schools have enough eligible pupils to meet the target, so we think the selection rules cause the shortfall.",
        confidence: "high",
      },
    ],
    method: "We compared 3,180 tutored pupils in 42 schools with 3,180 pupils in the same schools and year groups, matched one to one on prior attainment, free-school-meal eligibility, special educational needs and attendance in the previous year. Outcomes are scaled scores on the standardised assessments schools already use. Intervals are 95% and account for clustering by school.",
    limitations: ["Matching cannot rule out differences we did not measure. A randomised design is planned for year two.", "Attendance was recorded by tutors and may be overstated.", "One year of outcomes does not show whether the gain lasts."],
    sources: ["School assessment returns", "Tutor session logs", "National pupil database extract"],
    period: "September 2023 to July 2024",
    note: "Illustrative data",
  },
});
