import { Children, type ReactNode } from "react";
import { withMeta } from "../core/meta";
import { renderSlot, type Slot } from "../core/spec";
import { Headline } from "../atoms/headline";
import { Prose } from "../atoms/prose";
import { StepMarker } from "../atoms/step-marker";
import { Provide, useMolecule, type MoleculeProps } from "./_shared";

export interface SectionProps extends MoleculeProps {
  /** The section's main fact, as one plain sentence with its number. */
  title?: string;
  /** Step number: turns the heading into a numbered chapter marker ("02 — …"). */
  step?: number | string;
  /** Total steps, shown as "02 / 05". */
  total?: number;
  /** Small label above an unnumbered heading. */
  kicker?: string;
  /** One-sentence standfirst under the heading. */
  deck?: string;
  /** Introductory narration: a string (blank lines separate paragraphs) or an array of paragraphs. */
  intro?: string | string[];
  /** The section's content: one slot or several, each a spec or a React element. */
  body?: Slot | Slot[];
  /** Columns for the body at full width: 1, 2 or 3. Reduced automatically as the container narrows. */
  columns?: 1 | 2 | 3;
  /** Closing narration under the body. */
  outro?: string | string[];
  /** Hairline above the section. */
  rule?: boolean;
  /** Heading level. Default 2. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Anchor id for deep links. */
  id?: string;
  /** Vertical rhythm between heading, intro and body. */
  spacing?: "compact" | "comfortable";
  /** JSX alternative to `body`. */
  children?: ReactNode;
}

/**
 * One section of a story: a heading that states the main fact, a short introduction, then the
 * exhibits in a one- to three-column grid. Templates are stacks of these.
 */
function SectionImpl({ title, step, total, kicker, deck, intro, body, columns = 1, outro, rule = false, level = 2, id, spacing = "comfortable", children, className, style, ...rest }: SectionProps) {
  const { ref, width, mode, root } = useMolecule<HTMLElement>(rest);
  const items: ReactNode[] = children != null ? Children.toArray(children) : (Array.isArray(body) ? body : body != null ? [body] : []).map((slot, i) => renderSlot(slot, i));
  // Two columns need about 250px each, three about 225px.
  const cols = Math.max(1, Math.min(columns, items.length || 1, width >= 720 ? 3 : width >= 520 ? 2 : 1));
  const gap = spacing === "compact" ? 16 : 24;
  const wide = width >= 640;
  const hasHead = title != null || step != null;
  return (
    <section ref={ref} id={id} aria-label={title} data-slot="ic-section" data-ic-mode={mode} data-columns={cols} className={className} style={{ ...root, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap, ...(rule ? { borderTop: "1px solid var(--_ic-grid)", paddingTop: wide ? 32 : 24 } : null), ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        {hasHead || intro ? (
          <div data-slot="ic-section-head" style={{ minWidth: 0, display: "grid", gap: 12 }}>
            {step != null ? <StepMarker step={step} total={total} title={title ?? ""} text={deck} size="lg" level={level} /> : title != null ? <Headline size="section" title={title} kicker={kicker} deck={deck} level={level} /> : null}
            {intro ? <Prose text={intro} size="md" /> : null}
          </div>
        ) : null}
        {items.length ? (
          <div data-slot="ic-section-body" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: wide ? `32px ${cols > 2 ? 24 : 32}px` : "24px 16px", alignItems: "start", marginTop: hasHead || intro ? 4 : 0 }}>
            {items.map((item, i) => (
              // A lone item in the last row spans it.
              <div key={i} data-slot="ic-section-item" style={{ minWidth: 0, gridColumn: cols > 1 && i === items.length - 1 && i % cols === 0 ? "1 / -1" : undefined }}>
                {item}
              </div>
            ))}
          </div>
        ) : null}
        {outro ? <Prose text={outro} size="md" /> : null}
      </Provide>
    </section>
  );
}

const churn = [4.2, 4.3, 4.1, 3.6, 3.1, 2.9, 2.6, 2.4, 2.3, 2.2, 2.1, 2.1].map((rate, i) => ({ month: new Date(Date.UTC(2024, i, 1)).toISOString().slice(0, 10), rate }));
const cohorts = [
  { cohort: "Before March", churn: 4.1 },
  { cohort: "After March", churn: 2.0 },
];

export const Section = withMeta(SectionImpl, {
  name: "section",
  component: "Section",
  title: "Section",
  level: "molecule",
  category: "story",
  description: "A story section: a numbered step marker or a headline, introductory prose, then one or more exhibits in a responsive one- to three-column grid.",
  whenToUse: "The building block of a longer piece. Each section states one fact with its number in the title, explains it in a paragraph and shows it in one to three exhibits. Use `step` when the sections are read in order.",
  avoid: "The opening of a piece (use `hero-figure`); a single chart with one callout (use `chart-callout` directly); more than three exhibits in one section (split it).",
  composes: ["step-marker", "headline", "prose", "line-chart", "bar-chart", "stat-tile"],
  props: [
    { name: "title", type: "string", description: "The section's main fact, as one plain sentence with its number." },
    { name: "step", type: "number | string", description: 'Step number: turns the heading into a numbered chapter marker ("02 — ...").' },
    { name: "total", type: "number", description: 'Total steps, shown as "02 / 05".' },
    { name: "kicker", type: "string", description: "Small label above an unnumbered heading." },
    { name: "deck", type: "string", description: "One plain sentence under the heading that adds a second fact." },
    { name: "intro", type: "string | string[]", description: "Introductory narration. Supports `**bold**`, `*italic*` and links." },
    { name: "body", type: "Slot | Slot[]", description: "The exhibits: one slot or several, each a spec or a React element." },
    { name: "columns", type: "1 | 2 | 3", default: "1", description: "Columns for the body at full width; reduced under 720px and 520px." },
    { name: "outro", type: "string | string[]", description: "Closing narration under the body." },
    { name: "rule", type: "boolean", default: "false", description: "Hairline above the section." },
    { name: "level", type: "1 | 2 | 3 | 4 | 5 | 6", default: "2", description: "Heading level." },
    { name: "id", type: "string", description: "Anchor id for deep links." },
    { name: "spacing", type: '"compact" | "comfortable"', default: '"comfortable"', description: "Vertical rhythm between heading, intro and body." },
    { name: "children", type: "ReactNode", description: "JSX alternative to `body`; each child becomes a grid item." },
    { name: "theme", type: "ThemeInput", description: "Theme override, passed on to everything inside." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "section",
    step: 2,
    total: 4,
    title: "First-quarter churn was 2.0% for customers who joined after March",
    intro: "Monthly churn fell from 4.2% in January to 2.1% in December 2024. The new onboarding launched in March. Customers who joined after March had first-quarter churn of **2.0%**. Customers who joined before March had 4.1%.",
    columns: 2,
    body: [
      { type: "line-chart", data: churn, x: "month", y: "rate", format: "{value}%", zero: true, height: 240, title: "Monthly churn fell from 4.2% to 2.1% in 2024", subtitle: "Monthly customer churn, 2024", annotations: [{ type: "line", axis: "x", value: "2024-03-01", label: "New onboarding" }] },
      { type: "bar-chart", data: cohorts, x: "cohort", y: "churn", format: "{value}%", height: 240, highlight: "After March", title: "First-quarter churn was 4.1% for customers who joined before March", subtitle: "First-quarter churn by sign-up cohort, 2024" },
    ],
    outro: "The next section covers the first 90 days after sign-up.",
  },
});

export const examples = {
  "Unnumbered, one exhibit, with a rule": {
    rule: true,
    kicker: "Retention",
    title: "Monthly churn was between 2.1% and 2.4% from August to December 2024",
    deck: "It was 4.2% in January.",
    body: { type: "line-chart", data: churn, x: "month", y: "rate", format: "{value}%", zero: true, height: 260 },
  },
  "Three columns of figures": {
    title: "Product metrics, December 2024",
    columns: 3,
    spacing: "compact",
    body: [
      { type: "stat-tile", label: "Monthly churn", value: "2.1%", delta: "−2.1 pts", deltaLabel: "vs January", upIsGood: false },
      { type: "stat-tile", label: "Monthly active users", value: 48210, format: "compact", delta: 0.265, deltaLabel: "vs January" },
      { type: "stat-tile", label: "Net revenue retention", value: 1.12, format: "percent", context: "Top quartile is 110%" },
    ],
  },
};
