"use client";

import { type FormatSpec, withMeta, renderSlot, type Slot } from "insightcharts/core";
import { BigNumber } from "@/components/insightcharts/atoms/big-number";
import { Delta } from "@/components/insightcharts/atoms/delta";
import { MoleculeFooter, MoleculeHeader, Provide, useMolecule, type MoleculeProps } from "@/components/insightcharts/molecules/_shared";

export interface BeforeAfterState {
  /** Names the state: a year, "Before the change", "Control". */
  heading?: string;
  /** The figure for this state. Omit to show only a chart. */
  value?: number | string;
  /** What the figure measures. */
  label?: string;
  /** A line that qualifies the figure. */
  context?: string;
  format?: FormatSpec;
  /** A small chart or figure for this state: a spec or a React element. */
  chart?: Slot;
}

export interface BeforeAfterProps extends MoleculeProps {
  before: BeforeAfterState;
  after: BeforeAfterState;
  /** The change, stated between the two. Default: the relative change when both values are numbers. */
  delta?: number | string;
  /** Words under the change, e.g. "in five years". */
  deltaLabel?: string;
  /** Number format for a numeric `delta`. Default: signed percent. */
  deltaFormat?: FormatSpec;
  /** Whether an increase is good news. Default true. */
  upIsGood?: boolean;
  /** Number format shared by both values. */
  format?: FormatSpec;
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
}

function Arrow({ down }: { down: boolean }) {
  return (
    <svg data-slot="ic-before-after-arrow" aria-hidden viewBox="0 0 40 12" width={40} height={12} style={{ display: "block", color: "var(--_ic-axis)", transform: down ? "rotate(90deg)" : undefined, margin: down ? "10px 0" : 0 }}>
      <path d="M1 6h37m-5-4.5L38 6l-5 4.5" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Two states of one measure with the change stated between them, so the reader does
 * not have to work it out.
 */
function BeforeAfterImpl({ before, after, delta, deltaLabel, deltaFormat, upIsGood = true, format, title, subtitle, source, note, className, style, ...rest }: BeforeAfterProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const stacked = width < 520;
  const a = before?.value;
  const b = after?.value;
  const change = delta ?? (typeof a === "number" && typeof b === "number" && a !== 0 ? (b - a) / Math.abs(a) : undefined);

  const panel = (state: BeforeAfterState, which: "before" | "after") => (
    <div data-slot="ic-before-after-state" data-state={which} style={{ minWidth: 0 }}>
      {state.heading ? (
        <div data-slot="ic-before-after-heading" style={{ fontSize: "0.8125rem", lineHeight: 1.4, fontWeight: 600, color: "var(--_ic-ink)", paddingBottom: 8, marginBottom: 12, borderBottom: "1px solid var(--_ic-grid)" }}>
          {state.heading}
        </div>
      ) : null}
      {state.value != null ? <BigNumber value={state.value} label={state.label ?? ""} context={state.context} format={state.format ?? format} /> : null}
      {state.chart != null ? (
        <div data-slot="ic-before-after-chart" style={{ minWidth: 0, marginTop: state.value != null ? 12 : 0 }}>
          {renderSlot(state.chart)}
        </div>
      ) : null}
    </div>
  );

  return (
    <div ref={ref} data-slot="ic-before-after" data-ic-mode={mode} data-layout={stacked ? "stacked" : "side"} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle} />
        <div data-slot="ic-before-after-states" style={{ display: "grid", gridTemplateColumns: stacked ? "minmax(0, 1fr)" : "minmax(0, 1fr) auto minmax(0, 1fr)", columnGap: width < 720 ? 20 : 32, rowGap: 8, alignItems: "center" }}>
          {panel(before ?? {}, "before")}
          <div data-slot="ic-before-after-change" style={{ display: "flex", flexDirection: stacked ? "row" : "column", alignItems: "center", justifyContent: stacked ? "flex-start" : "center", gap: stacked ? 12 : 6, textAlign: stacked ? "left" : "center", minWidth: 0, maxWidth: stacked ? undefined : 132, padding: stacked ? "4px 0" : 0 }}>
            {stacked ? <Arrow down /> : null}
            <div style={{ minWidth: 0 }}>
              {change != null ? <Delta value={change} format={deltaFormat} upIsGood={upIsGood} size="lg" variant="pill" /> : null}
              {deltaLabel ? (
                <div data-slot="ic-before-after-change-label" style={{ fontSize: "0.75rem", lineHeight: 1.4, color: "var(--_ic-muted)", marginTop: change != null ? 6 : 0, textWrap: "balance" }}>
                  {deltaLabel}
                </div>
              ) : null}
            </div>
            {stacked ? null : <Arrow down={false} />}
          </div>
          {panel(after ?? {}, "after")}
        </div>
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

export const BeforeAfter = withMeta(BeforeAfterImpl, {
  name: "before-after",
  component: "BeforeAfter",
  title: "Before and after",
  level: "molecule",
  category: "layout",
  description: "Two states of one measure side by side, as figures or small charts, with the change between them stated in the middle.",
  whenToUse: "A single measure at two moments or under two conditions: before and after a policy, control and treatment, last year and this. The change is computed from the two values unless you state it.",
  avoid: "More than two states (use `line-chart` or `slope-chart`); many entities each with a before and after (use `dumbbell-chart` or `arrow-chart`); two unrelated figures (use `stat-row`).",
  composes: ["big-number", "delta", "bar-chart", "sparkline"],
  props: [
    { name: "before", type: "{ heading?, value?, label?, context?, format?, chart? }", required: true, description: "The first state: a figure, a chart slot, or both." },
    { name: "after", type: "{ heading?, value?, label?, context?, format?, chart? }", required: true, description: "The second state." },
    { name: "delta", type: "number | string", description: "The change stated between the two. Default: the relative change when both values are numbers." },
    { name: "deltaLabel", type: "string", description: 'Words under the change, e.g. "in five years".' },
    { name: "deltaFormat", type: "FormatSpec", default: "signed percent", description: "Number format for a numeric `delta`." },
    { name: "upIsGood", type: "boolean", default: "true", description: "Whether an increase is good news; decides the colour of the change." },
    { name: "format", type: "FormatSpec", default: '"auto"', description: "Number format shared by both values." },
    { name: "title", type: "string", description: "The change stated plainly, with both values and the period." },
    { name: "subtitle", type: "string", description: "Measure and population." },
    { name: "source", type: "string", description: 'Shown underneath as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: "Theme override, passed on to both states." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "before-after",
    title: "Solar module prices fell from $0.74 to $0.15 per watt between 2013 and 2023",
    subtitle: "Average price of crystalline silicon modules, US dollars per watt",
    format: { style: "currency", currency: "USD" },
    before: { heading: "2013", value: 0.74, label: "Per watt", context: "2013 average" },
    after: { heading: "2023", value: 0.15, label: "Per watt", context: "2023 average" },
    deltaLabel: "in ten years",
    upIsGood: false,
    source: "IRENA Renewable Power Generation Costs 2023",
    note: "Rounded, approximate figures for illustration",
  },
});
