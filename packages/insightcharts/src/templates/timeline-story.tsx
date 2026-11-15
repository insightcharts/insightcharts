import { Headline } from "../atoms/headline";
import { Prose } from "../atoms/prose";
import { withMeta } from "../core/meta";
import { renderSlot, type Slot } from "../core/spec";
import { AnnotatedTimeline } from "../molecules/annotated-timeline";
import { Provide } from "../molecules/_shared";
import { below, frame, FRAME_DOCS, Heading, RULE, Sourcing, SOURCING_DOCS, useTemplate, withHeight, type TemplateProps, type TemplateSourcing } from "./_shared";

export interface TimelineChapter {
  /** When it happened, shown as written: "1882", "April 2017", "30 September 2024". */
  date: string;
  /** What happened, as one plain sentence. */
  title: string;
  /** Two or three short sentences. Each states one fact about the event or its effect. */
  text?: string;
  /** A small chart or figure that shows its effect. */
  exhibit?: Slot;
  /** Marks a major event with a filled marker. */
  emphasis?: boolean;
}

export interface TimelineStoryProps extends TemplateProps, TemplateSourcing {
  /** The change over the whole period, as one plain sentence with the numbers and dates in it. */
  title: string;
  kicker?: string;
  deck?: string;
  byline?: string;
  date?: string;
  /** The overview exhibit: a `timeline-chart`, or a line chart annotated with the events. */
  timeline?: Slot;
  /** A paragraph between the overview and the chapters. */
  intro?: string | string[];
  /** Heading over the chapters. */
  chaptersTitle?: string;
  /** The dated chapters, oldest first. */
  chapters: TimelineChapter[];
  /** Where a chapter's exhibit sits. `"side"` falls back to `"below"` in narrow containers. */
  exhibitPosition?: "below" | "side";
  /** A closing paragraph that states the latest figures. */
  closing?: string | string[];
}

/**
 * A story told in date order. One exhibit shows the whole period. Dated chapters follow,
 * oldest first, each with an optional small figure.
 */
function TimelineStoryImpl({ title, kicker, deck, byline, date, timeline, intro, chaptersTitle, chapters, exhibitPosition = "side", closing, sources, period, method, note, credit, level = 1, maxWidth = 880, className, style, ...rest }: TimelineStoryProps) {
  const { ref, mode, root, phone, gap } = useTemplate(rest);
  const sub = below(level);
  const size = phone ? "md" : "lg";
  return (
    <article ref={ref} data-slot="ic-timeline-story" data-ic-mode={mode} className={className} style={{ ...frame(root, maxWidth, gap), ...style }}>
      <Provide theme={rest.theme} mode={rest.mode}>
        <Headline size="page" title={title} kicker={kicker} deck={deck} byline={byline} date={date} level={level} />
        {timeline != null ? (
          <section data-slot="ic-timeline-story-overview" aria-label="Overview" style={{ minWidth: 0, marginTop: -gap / 4 }}>
            {renderSlot(withHeight(timeline, phone ? 280 : 360))}
          </section>
        ) : null}
        {intro ? <Prose text={intro} size={size} lead /> : null}
        <section data-slot="ic-timeline-story-chapters" aria-label={chaptersTitle ?? "Timeline"} style={{ minWidth: 0, borderTop: RULE, paddingTop: phone ? 24 : 32 }}>
          {chaptersTitle ? (
            <Heading level={sub} size="lg" style={{ marginBottom: phone ? 20 : 28 }}>
              {chaptersTitle}
            </Heading>
          ) : null}
          <AnnotatedTimeline events={(chapters ?? []).map(({ exhibit, ...event }) => ({ ...event, figure: exhibit }))} figurePosition={exhibitPosition} level={Math.max(2, below(sub)) as 2 | 3 | 4 | 5 | 6} />
        </section>
        {closing ? (
          <section data-slot="ic-timeline-story-closing" aria-label="Where things stand" style={{ minWidth: 0, borderTop: RULE, paddingTop: phone ? 24 : 32 }}>
            <Prose text={closing} size={size} />
          </section>
        ) : null}
        <Sourcing sources={sources} period={period} method={method} note={note} credit={credit} />
      </Provide>
    </article>
  );
}

const coal = [
  [1990, 65],
  [1994, 50],
  [1998, 35],
  [2002, 32],
  [2006, 38],
  [2010, 28],
  [2012, 39],
  [2013, 36],
  [2014, 30],
  [2015, 22],
  [2016, 9],
  [2017, 7],
  [2018, 5],
  [2019, 2],
  [2020, 2],
  [2021, 2],
  [2022, 1.5],
  [2023, 1],
  [2024, 0.6],
].map(([year, share]) => ({ year: `${year}-01-01`, share }));
const collapse = [
  { year: "2012", share: 39 },
  { year: "2013", share: 36 },
  { year: "2014", share: 30 },
  { year: "2015", share: 22 },
  { year: "2016", share: 9 },
];
const coalFree = [
  { year: "2017", days: 1 },
  { year: "2018", days: 21 },
  { year: "2019", days: 83 },
  { year: "2020", days: 180 },
];

const records = [
  { holder: "Paul Tergat, 2:04:55", from: "2003-09", to: "2007-09", lane: "Record" },
  { holder: "Haile Gebrselassie, 2:03:59", from: "2007-09", to: "2011-09", lane: "Record" },
  { holder: "Makau, Kipsang", from: "2011-09", to: "2014-09", lane: "Record" },
  { holder: "Dennis Kimetto, 2:02:57", from: "2014-09", to: "2018-09", lane: "Record" },
  { holder: "Eliud Kipchoge, 2:01:09", from: "2018-09", to: "2023-10", lane: "Record" },
  { holder: "Kelvin Kiptum, 2:00:35", from: "2023-10", to: "2025-06", lane: "Record" },
  { holder: "Carbon-plated shoes", from: "2017-05", to: "2025-06", lane: "Technology" },
  { holder: "Breaking2", from: "2017-05", lane: "Exhibition" },
  { holder: "1:59:40 in Vienna", from: "2019-10", lane: "Exhibition" },
];

export const TimelineStory = withMeta(TimelineStoryImpl, {
  name: "timeline-story",
  component: "TimelineStory",
  title: "Timeline story",
  level: "template",
  category: "story",
  description: "A story told in date order. It has a headline, one overview exhibit of the whole period (a timeline chart or an annotated line), dated chapters along a rail, a closing paragraph and a source note. Each chapter has a short text and an optional small exhibit.",
  whenToUse: "Use it when the reader needs the events in date order to understand a change. State the change over the whole period in the headline, with the numbers and dates. Mark the main events on the overview exhibit as annotations. Give each chapter one event. Add a small figure to a chapter only when it has a number to show. Mark the two or three most important events with `emphasis`.",
  avoid: "Events with no measure that runs through the period (use a plain `annotated-timeline`). A comparison of two states with nothing in between (use `comparison-brief`). More than eight chapters. Merge minor events into the text of the chapter before or after.",
  composes: ["headline", "prose", "annotated-timeline", "source-note", "line-chart", "timeline-chart", "bar-chart", "big-number"],
  props: [
    { name: "title", type: "string", required: true, description: "The change over the whole period, as one plain sentence with the numbers and dates in it." },
    { name: "kicker", type: "string", description: "Small label above the title." },
    { name: "deck", type: "string", description: "One-sentence standfirst." },
    { name: "byline", type: "string", description: "Author line." },
    { name: "date", type: "string", description: "Publication date." },
    { name: "timeline", type: "Slot", description: "The overview exhibit: a `timeline-chart` spec, or a `line-chart` with the events as `annotations`. Default height 360px for line charts." },
    { name: "intro", type: "string | string[]", description: "A paragraph between the overview and the chapters." },
    { name: "chaptersTitle", type: "string", description: "Heading over the chapters." },
    { name: "chapters", type: "{ date, title, text?, exhibit?, emphasis? }[]", required: true, description: "The dated chapters, oldest first. `date` is shown as written; `exhibit` is a small chart or figure; `emphasis` fills the marker for a major event." },
    { name: "exhibitPosition", type: '"below" | "side"', default: '"side"', description: "Where a chapter's exhibit sits; `side` falls back to `below` under 640px." },
    { name: "closing", type: "string | string[]", description: "A closing paragraph that states the latest figures." },
    ...SOURCING_DOCS,
    ...FRAME_DOCS,
  ],
  example: {
    type: "timeline-story",
    kicker: "Energy",
    title: "Coal generated 39% of Britain's electricity in 2012 and 0.6% in 2024",
    deck: "The first public coal power station opened in 1882. The last coal plant closed on 30 September 2024.",
    byline: "By the data desk",
    date: "2024-10-01",
    timeline: {
      type: "line-chart",
      data: coal,
      x: "year",
      y: "share",
      format: "{value}%",
      zero: true,
      area: true,
      title: "Coal's share of generation fell from 65% in 1990 to 0.6% in 2024",
      subtitle: "Share of Great Britain's electricity generated from coal, 1990 to 2024",
      annotations: [
        { type: "band", axis: "x", from: "1990-01-01", to: "1998-01-01", label: "Gas plants built" },
        { type: "line", axis: "x", value: "2013-01-01", label: "Carbon price floor" },
        { type: "point", x: "2012-01-01", y: 39, label: "39% in 2012", position: "top" },
      ],
      source: "Department for Energy Security and Net Zero and National Grid ESO (rounded)",
      note: "Figures are approximate, for illustration",
    },
    intro: "Coal's share fell in two periods. It fell from 65% to 35% between 1990 and 1998, when generators built gas plants. It fell from 39% to 9% between 2012 and 2016, after the carbon price floor was introduced.",
    chapters: [
      { date: "1882", title: "The first public coal power station opens in London", text: "Thomas Edison's company built the plant at Holborn Viaduct. It supplied street lamps and nearby buildings." },
      { date: "1990s", title: "Coal's share falls from 65% to 35% between 1990 and 1998", text: "Privatised generators built gas plants, which were cheaper and quicker to build than coal plants. Coal's share was between 28% and 39% from 1998 to 2013." },
      {
        date: "April 2013",
        title: "The carbon price floor takes effect",
        emphasis: true,
        text: "The floor set a minimum price on power-station emissions. The rate doubled in 2015. Coal's share fell from 22% in 2015 to 9% in 2016.",
        exhibit: { type: "bar-chart", data: collapse, x: "year", y: "share", orientation: "vertical", sort: "none", highlight: "2016", format: "{value}%", height: 170, subtitle: "Coal share of generation, 2012 to 2016" },
      },
      { date: "21 April 2017", title: "The first full day without coal since 1882", text: "Britain had 1 coal-free day in 2017. It had 180 in 2020.", exhibit: { type: "bar-chart", data: coalFree, x: "year", y: "days", orientation: "vertical", sort: "none", highlight: "2020", height: 170, subtitle: "Coal-free days per year" } },
      { date: "30 September 2024", title: "Ratcliffe-on-Soar, the last coal plant, shuts down", emphasis: true, text: "The plant had run since 1968. In 2024 wind generated 30% of the country's electricity and gas generated 26%.", exhibit: { type: "big-number", value: "0%", label: "Coal share of generation since October 2024", context: "Britain was the first G7 country to end coal power" } },
    ],
    closing: "Coal generated 0.6% of Britain's electricity in 2024, all of it before 30 September. Gas generated 26%.",
    sources: ["Digest of UK Energy Statistics", "National Grid ESO"],
    period: "1990 to 2024",
    note: "Annual shares are rounded. Intermediate years before 2012 are interpolated for the chart. Figures are approximate, for illustration.",
  },
});

export const examples = {
  "Sport: a timeline chart as the overview, exhibits below": {
    kicker: "Athletics",
    title: "The men's marathon record fell from 2:04:55 to 2:00:35 between 2003 and 2023",
    deck: "Seven men held the record in that time. Carbon-plated shoes went on sale in 2017. The last two record-holders ran in them.",
    exhibitPosition: "below",
    timeline: { type: "timeline-chart", data: records, name: "holder", start: "from", end: "to", lane: "lane", highlight: ["Carbon-plated shoes", "Eliud Kipchoge, 2:01:09", "Kelvin Kiptum, 2:00:35"], precision: "month", title: "The record fell by 142 seconds between 2014 and 2023", subtitle: "Men's marathon world record holders and related events, 2003 to 2025", source: "World Athletics" },
    chapters: [
      { date: "September 2003", title: "Paul Tergat runs 2:04:55 in Berlin", text: "He was the first man to run a marathon in under 2:05." },
      { date: "September 2008", title: "Haile Gebrselassie runs 2:03:59 in Berlin", text: "It was his second record in 12 months. He was 35." },
      { date: "September 2014", title: "Dennis Kimetto runs 2:02:57 in Berlin", text: "The record stood for four years." },
      { date: "May 2017", title: "Eliud Kipchoge runs 2:00:25 at the Breaking2 exhibition", emphasis: true, text: "The run used rotating pacemakers on a racing circuit, so it did not count as a record. Kipchoge wore prototype carbon-plated shoes. The shoes went on sale that summer." },
      { date: "September 2018", title: "Eliud Kipchoge lowers the record by 78 seconds to 2:01:39", emphasis: true, text: "It was the largest single improvement since 1967. He ran 2:01:09 in 2022.", exhibit: { type: "big-number", value: "−78 s", label: "Improvement on Kimetto's record", context: "The previous four records improved by 29 seconds on average" } },
      { date: "October 2023", title: "Kelvin Kiptum runs 2:00:35 in Chicago", text: "It was his third marathon. He was 23. He died in a road accident four months later." },
    ],
    closing: "No one has run under two hours in a record-eligible race. Kiptum's 2:00:35 is 35 seconds slower than two hours.",
    sources: "World Athletics record progression",
    note: "Figures are approximate, for illustration",
    period: "2003 to 2025",
  },
};
