"use client";

import { createElement, useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { BigNumber } from "@/components/insightcharts/atoms/big-number";
import { Prose } from "@/components/insightcharts/atoms/prose";
import { PullQuote } from "@/components/insightcharts/atoms/pull-quote";
import { type FormatSpec, withMeta, useTheme, renderSlot, type Slot, chromeVars } from "insightcharts/core";
import { Provide } from "@/components/insightcharts/molecules/_shared";
import { below, button, FRAME_DOCS, INVERSE_HOST, Sourcing, SOURCING_DOCS, useTemplate, withHeight, type HeadingLevel, type TemplateProps, type TemplateSourcing } from "@/components/insightcharts/templates/_shared";

interface CardBase {
  /** Small label at the top of the card. */
  kicker?: string;
  /** `"inverse"` paints the card in the opposite colour mode; `"accent"` tints it. */
  tone?: "surface" | "inverse" | "accent";
  id?: string;
}

export type StoryDeckCard =
  /** Opens the deck: the title of the whole piece. */
  | (CardBase & { kind: "title"; title: string; deck?: string; byline?: string })
  /** One number, large. */
  | (CardBase & { kind: "stat"; value: number | string; label: string; context?: string; delta?: number | string; deltaLabel?: string; upIsGood?: boolean; format?: FormatSpec; text?: string })
  /** One chart under a headline that states one fact. */
  | (CardBase & { kind: "chart"; title: string; chart: Slot; text?: string })
  | (CardBase & { kind: "quote"; quote: string; attribution?: string; role?: string })
  /** Ends the deck: a closing fact, optional points and a link. */
  | (CardBase & { kind: "closing"; title: string; text?: string; points?: string[]; action?: { label: string; href: string } });

export type StoryDeckAspect = "auto" | "9:16" | "4:5" | "1:1" | "16:9";

export interface StoryDeckProps extends Omit<TemplateProps, "maxWidth">, TemplateSourcing {
  /** The cards, in order. Each states one fact. */
  cards: StoryDeckCard[];
  /** Accessible name of the deck. Defaults to the first card's title. */
  label?: string;
  /** Shape of every card. `"auto"` lets each card take the height its content needs, with a common minimum. */
  aspect?: StoryDeckAspect;
  /** `"pager"`: one card at a time, swiped or stepped with buttons and arrow keys. `"stack"`: every card in a column, for print and static pages. */
  layout?: "pager" | "stack";
  /** Card shown first (zero-based). */
  startAt?: number;
  /** Called when the visible card changes. */
  onCardChange?: (index: number) => void;
  /** Widest a card is drawn, in px. Default 440 (840 for 16:9, 520 for 1:1). */
  maxWidth?: number;
  previousLabel?: string;
  nextLabel?: string;
}

const RATIO: Record<Exclude<StoryDeckAspect, "auto">, number> = { "9:16": 9 / 16, "4:5": 4 / 5, "1:1": 1, "16:9": 16 / 9 };
const WIDTH: Record<StoryDeckAspect, number> = { auto: 480, "9:16": 400, "4:5": 440, "1:1": 520, "16:9": 840 };
const SAFE_HREF = /^(https?:|\/|#|\.|mailto:)/i;

function Arrow({ back }: { back?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" width={14} height={14} style={{ display: "block", transform: back ? "scaleX(-1)" : undefined }}>
      <path d="M3 8h10m0 0L9 4m4 4-4 4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A sequence of full-frame cards with one fact each, as in a mobile "year in review".
 * Cards snap as the reader swipes. Buttons, dots and arrow keys also move between cards.
 * Every card is in the document in reading order.
 */
function StoryDeckImpl({ cards, label, aspect = "4:5", layout = "pager", startAt = 0, onCardChange, maxWidth, previousLabel = "Previous", nextLabel = "Next", sources, period, method, note, credit, level = 1, className, style, ...rest }: StoryDeckProps) {
  const { ref, width, mode, root } = useTemplate(rest);
  const theme = useTheme(rest.theme);
  const uid = useId();
  const strip = useRef<HTMLDivElement>(null);
  const list = cards ?? [];
  const count = list.length;
  const [index, setIndex] = useState(() => Math.min(Math.max(0, startAt), Math.max(0, count - 1)));
  const latest = useRef({ index, onCardChange });
  latest.current = { index, onCardChange };

  // A landscape card on a phone is too small to hold a chart and a sentence; it becomes portrait there.
  const shape: StoryDeckAspect = aspect === "16:9" && width < 520 ? "4:5" : aspect;
  const ratio = shape === "auto" ? null : RATIO[shape] ?? null;
  const w = Math.max(220, Math.min(width, maxWidth ?? WIDTH[shape] ?? 440));
  const h = ratio ? w / ratio : null;
  const u = Math.min(w, h ?? w * 1.2) / 100;
  const pad = Math.round(Math.max(20, u * 7));
  const landscape = !!ratio && ratio > 1.3;
  const sub = below(level);
  const pager = layout === "pager";

  const commit = useCallback((next: number) => {
    if (next === latest.current.index) return;
    setIndex(next);
    latest.current.onCardChange?.(next);
  }, []);
  const go = useCallback(
    (next: number, instant = false) => {
      const el = strip.current;
      const clamped = Math.min(count - 1, Math.max(0, next));
      if (!el) return commit(clamped);
      const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: clamped * el.clientWidth, behavior: instant || reduce ? "auto" : "smooth" });
      // The scroll handler follows the strip; this covers environments where smooth scrolling never fires it.
      commit(clamped);
    },
    [commit, count],
  );
  // Follow swipes: the card snapped into view is the current one.
  const onScroll = () => {
    const el = strip.current;
    if (el && el.clientWidth) commit(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
  };
  // Keep the current card in place when the container is resized, and honour `startAt`.
  useEffect(() => {
    const el = strip.current;
    if (el && pager) el.scrollLeft = latest.current.index * el.clientWidth;
  }, [w, pager]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "PageDown") go(index + 1);
    else if (e.key === "ArrowLeft" || e.key === "PageUp") go(index - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(count - 1);
    else return;
    e.preventDefault();
  };

  const kickerStyle: CSSProperties = { margin: 0, fontSize: Math.max(12, u * 3), lineHeight: 1.3, fontWeight: 600, letterSpacing: "0.01em", color: "var(--_ic-accent)" };
  const heading = (lv: HeadingLevel, text: string, size: number): ReactNode => createElement(`h${lv}`, { "data-slot": "ic-story-deck-title", style: { margin: 0, fontFamily: "var(--_ic-font-display)", fontSize: size, lineHeight: 1.12, fontWeight: 680, letterSpacing: "-0.025em", color: "var(--_ic-ink)", textWrap: "balance", overflowWrap: "break-word" } }, text);
  const bodySize = Math.max(14, Math.min(18, u * 4));
  const body = (text: string, extra?: CSSProperties) => <Prose text={text} size="md" style={{ fontSize: bodySize, lineHeight: 1.5, color: "var(--_ic-ink-2)", ...extra }} />;

  const content = (card: StoryDeckCard, active: boolean): ReactNode => {
    switch (card.kind) {
      case "title":
        return (
          <div style={{ marginTop: "auto", display: "grid", gap: u * 4 }}>
            {heading(level, card.title, Math.max(26, u * (landscape ? 10 : 9.5)))}
            {card.deck ? body(card.deck, { fontSize: bodySize + 1 }) : null}
            {card.byline ? <p style={{ margin: 0, fontSize: Math.max(12, u * 3), color: "var(--_ic-muted)" }}>{card.byline}</p> : null}
          </div>
        );
      case "stat":
        return (
          <div style={{ margin: "auto 0", display: "grid", gap: u * 5 }}>
            <BigNumber size="hero" value={card.value} label={card.label} context={card.context} delta={card.delta} deltaLabel={card.deltaLabel} upIsGood={card.upIsGood} format={card.format} />
            {card.text ? body(card.text) : null}
          </div>
        );
      case "chart": {
        // What is left for the plot once the claim, the text and the card's padding are taken out.
        const room = h ? Math.max(160, Math.round(h - pad * 2 - u * (card.text ? 44 : 30) - 36)) : 260;
        return (
          <>
            {heading(sub, card.title, Math.max(20, u * 6))}
            <div data-slot="ic-story-deck-chart" style={{ flex: "1 1 auto", minHeight: 0, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", margin: `${u * 4}px 0` }}>
              {renderSlot(withHeight(card.chart, room))}
            </div>
            {card.text ? body(card.text) : null}
          </>
        );
      }
      case "quote":
        return (
          <div style={{ margin: "auto 0" }}>
            <PullQuote quote={card.quote} attribution={card.attribution} role={card.role} size={w < 380 ? "md" : "lg"} />
          </div>
        );
      case "closing":
        return (
          <div style={{ marginTop: "auto", display: "grid", gap: u * 4 }}>
            {heading(sub, card.title, Math.max(22, u * 7.5))}
            {card.text ? body(card.text) : null}
            {card.points?.length ? (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {card.points.map((point, i) => (
                  <li key={i} style={{ borderTop: "1px solid var(--_ic-grid)", padding: `${Math.max(8, u * 2.4)}px 0` }}>
                    <Prose text={point} size="sm" style={{ fontSize: Math.max(13, bodySize - 2) }} />
                  </li>
                ))}
              </ul>
            ) : null}
            {card.action && SAFE_HREF.test(card.action.href) ? (
              <div>
                <a data-slot="ic-button" href={card.action.href} tabIndex={active ? undefined : -1} style={{ ...button, minHeight: 36, padding: "0 14px", textDecoration: "none", background: "var(--_ic-ink)", color: "var(--_ic-surface)", borderColor: "var(--_ic-ink)" }}>
                  {card.action.label}
                  <Arrow />
                </a>
              </div>
            ) : null}
          </div>
        );
    }
  };

  const renderCard = (card: StoryDeckCard, i: number) => {
    const inverse = card.tone === "inverse";
    const cardMode = inverse ? (mode === "dark" ? "light" : "dark") : mode;
    const active = !pager || i === index;
    return (
      <section
        key={card.id ?? i}
        id={card.id}
        role="group"
        aria-roledescription="slide"
        aria-label={`${i + 1} of ${count}`}
        aria-hidden={pager && !active ? true : undefined}
        data-slot="ic-story-deck-slide"
        data-active={active || undefined}
        style={{ flex: pager ? "0 0 100%" : undefined, minWidth: 0, scrollSnapAlign: "center", scrollSnapStop: "always", display: "flex", justifyContent: "center", boxSizing: "border-box" }}
      >
        <Provide theme={rest.theme} mode={cardMode}>
          <div
            data-slot="ic-story-deck-card"
            data-kind={card.kind}
            data-tone={card.tone ?? "surface"}
            data-ic-mode={cardMode}
            className={inverse ? cardMode : undefined}
            style={{
              ...(inverse ? INVERSE_HOST : null),
              ...(chromeVars(theme[cardMode]) as CSSProperties),
              boxSizing: "border-box",
              width: w,
              maxWidth: "100%",
              ...(h ? { height: h } : { minHeight: Math.round(w * 0.6) }),
              padding: pad,
              display: "flex",
              flexDirection: "column",
              background: card.tone === "accent" ? "color-mix(in srgb, var(--_ic-accent) 9%, var(--_ic-surface))" : "var(--_ic-surface)",
              color: "var(--_ic-ink)",
              fontFamily: "var(--_ic-font)",
              border: "1px solid var(--_ic-grid)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div data-slot="ic-story-deck-card-head" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: u * 4, minHeight: 16 }}>
              {card.kicker ? <p style={kickerStyle}>{card.kicker}</p> : <span />}
              <span aria-hidden style={{ fontSize: Math.max(11, u * 2.6), lineHeight: 1.3, fontVariantNumeric: "tabular-nums", color: "var(--_ic-muted)" }}>
                {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
            {content(card, active)}
          </div>
        </Provide>
      </section>
    );
  };

  const first = list[0];
  const name = label ?? (first && "title" in first ? first.title : "Story");
  return (
    <article ref={ref} data-slot="ic-story-deck" data-layout={layout} data-ic-mode={mode} aria-label={name} className={className} style={{ ...root, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, width: "100%", ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        {pager ? (
          <>
            <div
              ref={strip as RefObject<HTMLDivElement>}
              data-slot="ic-deck-strip"
              role="region"
              aria-roledescription="carousel"
              aria-label={`${name}. Use the arrow keys to move between cards.`}
              tabIndex={0}
              onScroll={onScroll}
              onKeyDown={onKey}
              style={{ display: "flex", overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory", overscrollBehaviorX: "contain", borderRadius: 16, outlineOffset: 4 }}
            >
              {list.map(renderCard)}
            </div>
            {count > 1 ? (
              <nav data-slot="ic-story-deck-nav" data-ic-print="hide" aria-label="Cards" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", maxWidth: w, marginLeft: "auto", marginRight: "auto" }}>
                <button type="button" data-slot="ic-button" onClick={() => go(index - 1)} disabled={index <= 0} aria-controls={`${uid}-status`} style={{ ...button, padding: w < 340 ? "0 8px" : "0 12px" }}>
                  <Arrow back />
                  <span style={w < 340 ? { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" } : undefined}>{previousLabel}</span>
                </button>
                <div data-slot="ic-story-deck-dots" style={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                  {list.map((_, i) => (
                    <button key={i} type="button" data-slot="ic-deck-dot" aria-label={`Go to card ${i + 1}`} aria-current={i === index ? "step" : undefined} onClick={() => go(i)} style={{ all: "unset", boxSizing: "content-box", cursor: "pointer", padding: "10px 3px", borderRadius: 4, display: count > 14 ? "none" : "block" }}>
                      <span style={{ display: "block", height: 4, width: i === index ? 20 : 6, borderRadius: 999, background: i === index ? "var(--_ic-ink)" : "var(--_ic-axis)", transition: "width .25s, background-color .25s" }} />
                    </button>
                  ))}
                </div>
                <button type="button" data-slot="ic-button" onClick={() => go(index + 1)} disabled={index >= count - 1} aria-controls={`${uid}-status`} style={{ ...button, padding: w < 340 ? "0 8px" : "0 12px" }}>
                  <span style={w < 340 ? { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" } : undefined}>{nextLabel}</span>
                  <Arrow />
                </button>
              </nav>
            ) : null}
            <span id={`${uid}-status`} role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              Card {index + 1} of {count}
            </span>
          </>
        ) : (
          <div data-slot="ic-story-deck-stack" style={{ display: "grid", gap: 24 }}>
            {list.map(renderCard)}
          </div>
        )}
        <div style={{ width: "100%", maxWidth: Math.max(w, 480), marginLeft: "auto", marginRight: "auto", minWidth: 0 }}>
          <Sourcing sources={sources} period={period} method={method} note={note} credit={credit} layout="inline" style={{ marginTop: 8 }} />
        </div>
      </Provide>
    </article>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const km = [96, 104, 131, 148, 162, 171, 120, 158, 196, 224, 181, 151].map((value, i) => ({ month: MONTHS[i], km: value }));
const pace = [5.52, 5.47, 5.41, 5.36, 5.33, 5.28, 5.31, 5.24, 5.16, 5.09, 5.07, 5.04].map((value, i) => ({ month: MONTHS[i], pace: value }));
const hours = [0, 0, 0, 0, 0, 9, 41, 38, 12, 4, 2, 3, 8, 6, 2, 1, 3, 11, 22, 17, 6, 2, 0, 0].map((runs, hour) => ({ hour: String(hour).padStart(2, "0"), runs }));
export const StoryDeck = withMeta(StoryDeckImpl, {
  name: "story-deck",
  component: "StoryDeck",
  title: "Story deck",
  level: "template",
  category: "story",
  description: "A sequence of full-frame cards (title, stat, chart, quote, closing) that the reader swipes or steps through. Each card states one fact. It has an optional fixed aspect ratio, a keyboard-accessible pager and a stacked layout for print.",
  whenToUse: "Use it for a short sequence read on a phone, such as a “year in review”. Each card should be readable in a couple of seconds. State the main fact with its number on the title card. Put one fact on each later card, as a number or as one chart with one highlighted mark under a headline that states the fact. Use five to ten cards. End with a closing card and the sources. Charts in cards should have few data points and direct labels, with no legend.",
  avoid: "Findings that need two exhibits in view at once (use `executive-brief`). A single shareable image (use `social-card`). Dense charts or long paragraphs, because a card has little room. One chart that changes step by step (use `scrolly-chart` in `steps` mode).",
  composes: ["big-number", "prose", "pull-quote", "source-note", "bar-chart", "line-chart", "radial-bar-chart"],
  props: [
    {
      name: "cards",
      type: "Card[]",
      required: true,
      description:
        'The cards in order. Each has a `kind`: `title` `{ title, deck?, byline? }`; `stat` `{ value, label, context?, delta?, deltaLabel?, upIsGood?, format?, text? }`; `chart` `{ title, chart, text? }`; `quote` `{ quote, attribution?, role? }`; `closing` `{ title, text?, points?, action?: { label, href } }`. Any card takes `kicker`, `tone: "surface" | "inverse" | "accent"` and `id`.',
    },
    { name: "label", type: "string", description: "Accessible name of the deck. Defaults to the first card's title." },
    { name: "aspect", type: '"auto" | "9:16" | "4:5" | "1:1" | "16:9"', default: '"4:5"', description: "Shape of every card. `auto` lets cards take the height their content needs. `16:9` falls back to `4:5` in containers under 520px." },
    { name: "layout", type: '"pager" | "stack"', default: '"pager"', description: "`pager` shows one card at a time (swipe, buttons, dots, arrow keys, Home/End). `stack` lists every card in a column." },
    { name: "startAt", type: "number", default: "0", description: "Card shown first (zero-based)." },
    { name: "onCardChange", type: "(index: number) => void", description: "Called when the visible card changes." },
    { name: "maxWidth", type: "number", description: "Widest a card is drawn, in px. Default 440 (400 for 9:16, 520 for 1:1, 840 for 16:9). Type and spacing scale with the card." },
    { name: "previousLabel", type: "string", default: '"Previous"', description: "Label of the previous button." },
    { name: "nextLabel", type: "string", default: '"Next"', description: "Label of the next button." },
    ...SOURCING_DOCS,
    ...FRAME_DOCS.filter((p) => p.name !== "maxWidth"),
  ],
  example: {
    type: "story-deck",
    aspect: "4:5",
    cards: [
      { kind: "title", tone: "inverse", kicker: "Your 2024 on the road", title: "You ran 1,842 km in 2024", deck: "That was 23% more than in 2023. You ran 187 times.", byline: "Riverside Runners · member report" },
      { kind: "stat", kicker: "Distance", value: 1842, format: "integer", label: "Kilometres run in 2024", delta: 0.23, deltaLabel: "vs 2023", context: "An average of 154 km a month", text: "You ran in 46 of the year's 52 weeks." },
      { kind: "chart", kicker: "Month by month", title: "October was your highest month at 224 km", chart: { type: "bar-chart", data: km, x: "month", y: "km", orientation: "vertical", sort: "none", highlight: "Oct", labels: false, format: "{value} km", height: 240 }, text: "You ran 120 km in July while you were injured. You ran 158 km in August." },
      { kind: "chart", kicker: "Pace", title: "Your easy pace fell from 5.52 to 5.04 minutes per kilometre", chart: { type: "line-chart", data: pace, x: "month", y: "pace", format: "{value} min/km", height: 240 }, text: "A lower number is a faster pace. Your pace in August was 5.24." },
      { kind: "chart", kicker: "Habits", tone: "accent", title: "41 of your 187 runs started between 6am and 7am", chart: { type: "radial-bar-chart", data: hours, x: "hour", y: "runs", labelEvery: 3, labels: false, height: 260 }, text: "Another 38 started between 7am and 8am. 22 started between 6pm and 7pm." },
      { kind: "quote", quote: "I started running before work in the spring. I have kept to it since.", attribution: "Club member", role: "Club newsletter, December 2024" },
      { kind: "closing", kicker: "Next year", title: "2,000 km in 2025 needs 167 km a month", text: "You averaged 154 km a month in 2024.", points: ["You ran 167 km or more in 4 months of 2024.", "July was 51 km below June."], action: { label: "Set a 2025 goal", href: "#goal" } },
    ],
    sources: "Club activity tracker",
    period: "1 January to 31 December 2024",
    note: "Illustrative data",
  },
});
