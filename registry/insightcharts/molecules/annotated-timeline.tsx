"use client";

import { withMeta, renderSlot, type Slot } from "insightcharts/core";
import { Prose } from "@/components/insightcharts/atoms/prose";
import { StepMarker } from "@/components/insightcharts/atoms/step-marker";
import { MoleculeFooter, MoleculeHeader, Provide, useMolecule, type MoleculeProps } from "@/components/insightcharts/molecules/_shared";

export interface AnnotatedTimelineEvent {
  /** When it happened, shown as written: "March 2020", "2015", "Q3 2024". */
  date: string;
  /** What happened, in a few words. */
  title: string;
  /** One or two sentences of explanation. Supports `**bold**`, `*italic*` and links. */
  text?: string;
  /** A small chart or figure that backs the event up: a spec or a React element. */
  figure?: Slot;
  /** Mark this event as one of the most important. It gets a filled marker on the rail. */
  emphasis?: boolean;
}

export interface AnnotatedTimelineProps extends MoleculeProps {
  /** The events, in the order they should be read (usually oldest first). */
  events: AnnotatedTimelineEvent[];
  /** Where an event's figure sits. `"side"` falls back to `"below"` in narrow containers. */
  figurePosition?: "below" | "side";
  /** Heading level of the event titles. */
  level?: 2 | 3 | 4 | 5 | 6;
  title?: string;
  subtitle?: string;
  source?: string;
  note?: string;
}

/**
 * A sequence of dated events read top to bottom along a rail. Each event is a date, a
 * few words and, where it helps, the small chart or number that shows its effect.
 */
function AnnotatedTimelineImpl({ events, figurePosition = "below", level = 3, title, subtitle, source, note, className, style, ...rest }: AnnotatedTimelineProps) {
  const { ref, width, mode, root } = useMolecule(rest);
  const list = events ?? [];
  const side = figurePosition === "side" && width >= 640;
  const gutter = width < 480 ? 28 : 36;
  return (
    <div ref={ref} data-slot="ic-annotated-timeline" data-ic-mode={mode} className={className} style={{ ...root, ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <MoleculeHeader title={title} subtitle={subtitle} level={Math.max(1, level - 1)} />
        <ol data-slot="ic-annotated-timeline-events" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {list.map((event, i) => {
            const last = i === list.length - 1;
            return (
              <li key={i} data-slot="ic-annotated-timeline-event" data-emphasis={event.emphasis || undefined} style={{ position: "relative", paddingLeft: gutter, paddingBottom: last ? 0 : 32 }}>
                {/* The rail: a hairline that runs from this marker to the next. */}
                {last ? null : <span aria-hidden data-slot="ic-annotated-timeline-rail" style={{ position: "absolute", left: 5, top: 18, bottom: -6, width: 1, background: "var(--_ic-grid)" }} />}
                <span aria-hidden data-slot="ic-annotated-timeline-marker" style={{ position: "absolute", left: 0, top: 6, width: 11, height: 11, boxSizing: "border-box", borderRadius: 999, border: `2px solid ${event.emphasis ? "var(--_ic-accent)" : "var(--_ic-axis)"}`, background: event.emphasis ? "var(--_ic-accent)" : "var(--_ic-surface)" }} />
                <div style={{ display: "grid", gridTemplateColumns: side && event.figure != null ? "minmax(0, 1fr) minmax(0, 1fr)" : "minmax(0, 1fr)", gap: side ? 32 : 12, alignItems: "start" }}>
                  <div style={{ minWidth: 0 }}>
                    <StepMarker step={event.date} title={event.title} layout="stacked" size="md" level={level} />
                    {event.text ? <Prose text={event.text} size="sm" tone="muted" measure={60} style={{ marginTop: 6 }} /> : null}
                  </div>
                  {event.figure != null ? (
                    <div data-slot="ic-annotated-timeline-figure" style={{ minWidth: 0, maxWidth: side ? undefined : 520, marginTop: side ? 0 : 4 }}>
                      {renderSlot(event.figure)}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
        <MoleculeFooter source={source} note={note} />
      </Provide>
    </div>
  );
}

const rate = (values: number[], start: string) => {
  const [y, m] = start.split("-").map(Number);
  return values.map((v, i) => ({ month: new Date(Date.UTC(y, m - 1 + i, 1)).toISOString().slice(0, 7), rate: v }));
};

export const AnnotatedTimeline = withMeta(AnnotatedTimelineImpl, {
  name: "annotated-timeline",
  component: "AnnotatedTimeline",
  title: "Annotated timeline",
  level: "molecule",
  category: "story",
  description: "A vertical sequence of dated events along a rail, each with a short explanation and, optionally, a small chart or figure.",
  whenToUse: "Telling how something unfolded when the events matter more than a continuous measure: a policy history, an incident, a product's milestones. Four to eight events; give a figure only to the ones where a number changed.",
  avoid: "Events that should be read against a time scale, with gaps and overlaps to scale (use `timeline-chart`); a continuous series with a few annotated moments (use `line-chart` with `annotations`); ordered steps that are not dated (use `section` with `step`).",
  composes: ["step-marker", "prose", "sparkline", "big-number"],
  props: [
    { name: "events", type: "{ date, title, text?, figure?, emphasis? }[]", required: true, description: "The events in reading order. `date` is shown as written; `figure` is a chart spec or element; `emphasis` fills the marker to mark the most important events." },
    { name: "figurePosition", type: '"below" | "side"', default: '"below"', description: "Where an event's figure sits; `side` falls back to `below` under 640px." },
    { name: "level", type: "2 | 3 | 4 | 5 | 6", default: "3", description: "Heading level of the event titles." },
    { name: "title", type: "string", description: "The main fact with its number, or a plain label." },
    { name: "subtitle", type: "string", description: "Scope and period." },
    { name: "source", type: "string", description: 'Shown under the timeline as "Source: ...".' },
    { name: "note", type: "string", description: "Method note or caveat." },
    { name: "theme", type: "ThemeInput", description: "Theme override, passed on to every event." },
    { name: "mode", type: '"auto" | "system" | "light" | "dark"', default: '"auto"', description: "Colour mode." },
  ],
  example: {
    type: "annotated-timeline",
    title: "The ECB raised its deposit rate from −0.5% to 4% between July 2022 and September 2023",
    subtitle: "Euro area deposit facility rate and annual inflation, 2021 to 2024",
    events: [
      { date: "July 2021", title: "Inflation reaches 2.2%", text: "The ECB's target is 2%. The bank kept its deposit rate at −0.5%." },
      { date: "July 2022", title: "The deposit rate rises from −0.5% to 0%", emphasis: true, text: "This was the ECB's first rate rise in eleven years. Inflation was 8.9%.", figure: { type: "big-number", value: "8.9%", label: "Annual inflation, July 2022", context: "The target is 2%" } },
      { date: "October 2022", title: "Inflation reaches 10.6%", text: "This was the highest monthly figure of 2022. The ECB raised rates by 0.75 points at each of two consecutive meetings.", figure: { type: "sparkline", data: rate([5.1, 5.9, 7.4, 7.4, 8.1, 8.6, 8.9, 9.1, 9.9, 10.6, 10.1, 9.2], "2022-01"), x: "month", y: "rate", format: "{value}%", extremes: true, showValue: true, style: { maxWidth: 260 } } },
      { date: "September 2023", title: "The deposit rate reaches 4%", text: "This was the tenth rise in a row. Inflation was 4.3%." },
      { date: "June 2024", title: "The deposit rate is cut to 3.75%", emphasis: true, text: "The cut was 0.25 points. Inflation was 2.5%." },
    ],
    source: "European Central Bank; Eurostat",
    note: "Figures are approximate, for illustration",
  },
});
