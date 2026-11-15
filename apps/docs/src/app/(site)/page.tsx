import { ArrowRight, Braces, FileText, Package, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ComponentCard } from "@/components/catalog/component-card";
import { PosterThumb } from "@/components/catalog/poster-thumb";
import { Render } from "@/components/catalog/render";
import { AgentLevels, type AgentLevel } from "@/components/landing/agent-levels";
import { HeroStory } from "@/components/landing/hero-story";
import { Section } from "@/components/landing/section";
import { BareDemo, Demo } from "@/components/mdx/demo";
import { AgentActions } from "@/components/site/agent-actions";
import { CopyButton } from "@/components/site/copy-button";
import { agentPrompt, agentPromptText } from "@/lib/agent";
import { byLevel, components, getComponent, hrefOf, infographics, INFOGRAPHICS, LEVELS, pageTemplates, type CatalogEntry } from "@/lib/catalog";
import { homeCard, social } from "@/lib/og";
import { groundOfTheme, posterGround, posterWidth } from "@/lib/posters";
import { site } from "@/lib/site";
import { STORIES } from "@/lib/stories";

const title = `${site.name}: ${site.tagline}`;

export const metadata: Metadata = {
  title: { absolute: title },
  description: site.description,
  ...social({ path: "/", title, description: site.description, type: "website", card: homeCard(), alt: `${site.name}: the graphic at the top of the landing page.` }),
};

const INSTALL = "npm i insightcharts echarts";

// Preferred examples for the tour. Anything missing is filled from the catalogue.
const FEATURED: Record<string, string[]> = {
  atom: ["line-chart", "waffle-chart", "big-number"],
  molecule: ["chart-callout", "stat-row", "proportion-statement"],
  template: ["visual-essay", "executive-brief"],
};

// Posters preferred for the landing section, and the order themes are tried in so that the
// posters on show differ: a dark, a saturated and a light ground first.
const FEATURED_POSTERS = ["count-poster", "flow-poster", "timeline-poster"];
const CONTRAST = ["noir", "magenta", "sunrise", "blueprint", "forest", "paper", "ocean", "dusk"];

/** Up to `count` infographics, each with a theme no other one on show uses. */
function featuredPosters(count: number): { entry: CatalogEntry; theme: string; own: boolean }[] {
  const all = infographics().filter((c) => c.live && c.example);
  const picked = FEATURED_POSTERS.map((n) => all.find((c) => c.name === n)).filter((c): c is CatalogEntry => !!c);
  for (const c of all) if (picked.length < count && !picked.includes(c)) picked.push(c);
  const used = new Set<string>();
  return picked.slice(0, count).map((entry) => {
    const designed = typeof entry.example?.theme === "string" ? entry.example.theme : undefined;
    const theme = designed && !used.has(designed) ? designed : (CONTRAST.find((t) => !used.has(t)) ?? CONTRAST[0]);
    used.add(theme);
    return { entry, theme, own: theme === designed };
  });
}

function featured(level: CatalogEntry["level"], count: number): CatalogEntry[] {
  const all = byLevel(level);
  const picked = FEATURED[level].map((n) => all.find((c) => c.name === n)).filter((c): c is CatalogEntry => !!c);
  for (const c of all) if (picked.length < count && !picked.includes(c)) picked.push(c);
  return picked.slice(0, count);
}

const chip = "inline-flex h-5 items-center rounded-full border px-1.5 text-[11px] leading-none text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground";

/** "Uses Line chart, Callout": the links between the cards the tour shows, read from `composes`. */
function Links({ label, items }: { label: string; items: CatalogEntry[] }) {
  if (!items.length) return null;
  return (
    <span className="flex flex-wrap items-center gap-1">
      <span className="mr-0.5">{label}</span>
      {items.map((x) => (
        <Link key={x.name} href={hrefOf(x)} className={chip}>
          {x.title}
        </Link>
      ))}
    </span>
  );
}

const button = "inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

export default function Home() {
  const counts = LEVELS.map((l) => byLevel(l.level).length);
  const picks = Object.fromEntries(LEVELS.map((l) => [l.level, featured(l.level, l.level === "template" ? 2 : 3)])) as Record<CatalogEntry["level"], CatalogEntry[]>;
  const templates = pageTemplates();
  const posters = featuredPosters(3);
  const posterCount = infographics().length;
  const agent = agentPrompt("/");
  // The same three prompts the buttons copy, shown in full: the home page, a guide and a component.
  const tactical = getComponent("bar-chart") ?? byLevel("atom")[0];
  const agentLevels: AgentLevel[] = [
    { key: "strategic", label: "Strategic", page: "Home page", pageHref: "/", path: "/", summary: "What the library is, how to choose between an atom, a molecule, a template and a poster, how to install it and the order to work in." },
    { key: "operational", label: "Operational", page: "Quickstart guide", pageHref: "/docs/quickstart", path: "/docs/quickstart", summary: "The steps and commands for one task, the props and functions it uses, a working example and how to check the result." },
    { key: "tactical", label: "Tactical", page: tactical.title, pageHref: hrefOf(tactical), path: hrefOf(tactical), summary: "One component: the install command, the import, every prop, the data shape, the example as JSX and as JSON, the rules for the form and a checklist." },
  ].map(({ path, ...level }) => ({ ...level, ...agentPrompt(path), text: agentPromptText(path) ?? "" }));
  const agentLinks = [
    { icon: Braces, title: "JSON spec", body: "Every component can be written as { type, ...props } and rendered by the Insight component. A JSON Schema validates the spec.", href: "/docs/json-spec" },
    { icon: FileText, title: "llms.txt", body: "An index, a full-text file and a Markdown page per component. They are generated from the same metadata as this site.", href: "/llms.txt", external: true },
    { icon: Sparkles, title: "Agent skill", body: "An installable skill with a workflow for building a figure from data, the rules for writing titles and a decision table for choosing a form.", href: "/docs/agents/setup" },
    { icon: Package, title: "shadcn registry", body: "Add any component by name with the shadcn CLI or through the shadcn MCP server.", href: "/docs/installation#shadcn-registry" },
  ];
  return (
    <main id="content">
      {/* Hero: the title and install line, then one live piece that shows the library at work. */}
      <section className="container-page pb-14 pt-10 sm:pb-20 sm:pt-14">
        <div className="grid items-end gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <p className="mb-4 font-mono text-xs tracking-wide text-muted-foreground">Open source · React 19 · Apache ECharts 6</p>
            <h1 className="max-w-[26ch] text-[30px] font-semibold leading-[1.1] tracking-[-0.022em] text-balance sm:text-[40px] sm:leading-[1.06] xl:text-[46px]">An Infographics, Data Stories, and Data Journalism Chart Framework</h1>
          </div>
          <div>
            <p className="max-w-[52ch] text-base leading-7 text-muted-foreground text-pretty">An open source react library built on Apache Echarts with flexible components to build any data graphic, following data journalism visualization best practices.</p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <div className="flex h-9 min-w-0 max-w-full items-center gap-2 rounded-md border bg-muted/40 pl-3 pr-1 font-mono text-[13px]">
                <span className="select-none text-muted-foreground/70">$</span>
                <code className="min-w-0 flex-1 truncate">{INSTALL}</code>
                <CopyButton value={INSTALL} label="Copy install command" />
              </div>
              <AgentActions size="hero" href={agent.href} prefill={agent.prefill} markdownHref="/llms.txt" />
              <Link href="/docs/quickstart" className={`${button} border hover:bg-accent`}>
                Get started <ArrowRight className="size-3.5" />
              </Link>
              <Link href="/atoms" className={`${button} border hover:bg-accent`}>
                Browse {components.length} components
              </Link>
            </div>
            <p className="mt-3 max-w-[52ch] text-[13px] leading-5 text-muted-foreground">
              The button copies a prompt that tells Claude Code, Cursor, Codex or another coding agent how to choose a component, install the library and build a chart. <Link href="/docs/agents" className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">Getting started for agents</Link>.
            </p>
          </div>
        </div>
        <div className="mt-9 sm:mt-11">
          <HeroStory />
        </div>
      </section>

      <Section
        id="agent-instructions"
        label="For agents"
        title="Copy agent instructions from any page"
        intro={
          <>
            <p>
              Every page has a <strong className="font-medium text-foreground">Copy agent instructions</strong> button. It copies a prompt written to a coding agent for that page. Paste it into Claude Code, Cursor, Codex or another agent.
            </p>
            <p>
              The prompt for the home page covers how to choose a form and the order to work in. A guide&apos;s prompt has the steps and the API for one task. A component&apos;s prompt has the props, a working example and a checklist. Each example on a component page has a button for that exact example. <Link href="/docs/agents/setup">Set up your agent</Link>, or open the <Link href="/docs/agents/prompts">prompt library</Link>.
            </p>
          </>
        }
      >
        <AgentLevels levels={agentLevels} />
      </Section>

      {posters.length ? (
        <Section
          id="infographics"
          label="Infographics"
          title="Build interactive infographic posters"
          intro={
            <p>
              {posterCount} of the templates are infographics. Each one is a designed sheet with a painted background, little text and large graphics, and every mark has a tooltip and can be clicked. <Link href={`/${INFOGRAPHICS.slug}`}>See all {posterCount} infographics</Link>, or <Link href="/docs/infographics">read the guide</Link>.
            </p>
          }
        >
          <ul className="grid items-start gap-5 md:grid-cols-3" aria-label="Infographics">
            {posters.map(({ entry, theme, own }) => (
              <li key={entry.name} className="group relative min-w-0 overflow-hidden rounded-xl border transition-colors focus-within:ring-2 focus-within:ring-ring hover:border-foreground/25">
                <PosterThumb name={entry.name} ground={own ? posterGround(entry.example, entry) : groundOfTheme(theme)} virtualWidth={Math.min(1100, posterWidth(entry))} overrides={own ? undefined : { theme, background: undefined, mode: undefined }} />
                <div className="flex items-center justify-between gap-2 border-t bg-background px-4 py-3 text-sm">
                  <Link href={hrefOf(entry)} className="truncate font-medium outline-none after:absolute after:inset-0 after:content-['']">
                    {entry.title}
                  </Link>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">{theme}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Tour: the three levels, each with whatever the catalogue currently holds. */}
      <Section
        id="levels"
        label="Atoms, molecules, templates"
        title="Chart components follow Atomic Design"
        intro={
          <p>
            The {components.length} components are {counts[0]} atoms, {counts[1]} molecules and {counts[2]} templates. Atoms are single charts and figure primitives. Molecules combine a few atoms to make one point. Templates arrange molecules and atoms into a complete page. Each card below names the components it uses. <Link href="/docs#atomic-design">Read what the Atomic Design terms mean</Link>.
          </p>
        }
      >
        <div className="grid gap-12">
          {LEVELS.map((l, i) => {
            const list = picks[l.level];
            // Links between the cards on show: down to the level below, or up from atoms.
            const below = i > 0 ? picks[LEVELS[i - 1].level] : [];
            const above = i === 0 ? picks[LEVELS[1].level] : [];
            return (
              <div key={l.level} className="grid gap-x-12 gap-y-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)]">
                <div>
                  <p className="font-mono text-xs tabular-nums text-muted-foreground">0{i + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">{l.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{l.short}</p>
                  <Link href={`/${l.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground">
                    {counts[i] ? `All ${counts[i]} ${l.title.toLowerCase()}` : l.title} <ArrowRight className="size-3.5" />
                  </Link>
                </div>
                {list.length ? (
                  <div className={`grid gap-4 ${l.level === "template" ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
                    {list.map((c) => {
                      const uses = below.filter((x) => c.composes?.includes(x.name));
                      const usedBy = above.filter((x) => x.composes?.includes(c.name));
                      return <ComponentCard key={c.name} entry={c} aspect={l.level === "template" ? 16 / 10 : undefined} meta={uses.length ? <Links label="Uses" items={uses} /> : usedBy.length ? <Links label="Used in" items={usedBy} /> : undefined} />;
                    })}
                  </div>
                ) : (
                  <div className="grid min-h-40 place-items-center rounded-xl border border-dashed px-6 py-10 text-center">
                    <p className="max-w-[44ch] text-sm leading-6 text-muted-foreground">
                      <span className="font-medium text-foreground">No {l.title.toLowerCase()} yet.</span> They are built from the {LEVELS[i - 1]?.title.toLowerCase()} above and are listed here when they are added.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {templates.length ? (
        <Section
          id="templates"
          label="Templates"
          title="Data journalism templates inspired by the NY Times, Reuters, FiveThirtyEight, Edward Tufte, Stephen Few, and industry giants."
          titleClassName="max-w-[30ch] text-xl sm:text-2xl sm:leading-8"
          intro={
            <p>
              Each template is one component that takes its whole content as props: a title, figures, chart specs and sources. <Link href="/docs/templates">Read the guide</Link>, or open any of the {templates.length} below.
            </p>
          }
        >
          <ul className="scroll-quiet -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8" aria-label="Templates">
            {templates.map((c) => (
              <li key={c.name} className="w-[300px] shrink-0 snap-start sm:w-[340px]">
                <ComponentCard entry={c} size="sm" aspect={4 / 5} className="h-full" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section
        id="agents"
        label="JSON specs"
        title="Write any component as JSON"
        intro={
          <p>
            Props are field names, format strings and transform objects, with no accessor functions, so a chart can be a plain JSON document. Edit the spec below. <code>{"<Insight spec />"}</code> redraws it each time the JSON is valid.
          </p>
        }
      >
        <Demo name="json-live" toolbar={false} code={false} />
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {agentLinks.map((a) => {
            const inner = (
              <>
                <a.icon className="size-4 text-muted-foreground" aria-hidden />
                <h3 className="mt-3 text-sm font-medium">{a.title}</h3>
                <p className="mt-1 text-[13px] leading-5 text-muted-foreground">{a.body}</p>
              </>
            );
            const cls = "block h-full rounded-xl border p-4 transition-colors hover:border-foreground/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";
            return (
              <li key={a.title}>
                {a.external ? (
                  <a href={a.href} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={a.href} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        id="crossfilter"
        label="Crossfiltering"
        title="Easily add cross-filtering across multiple charts"
        intro={
          <p>
            Wrap charts in <code>InsightData</code>, mark some as <code>select</code>, and they share one dataset and one selection. You do not write any state code. <Link href="/docs/crossfiltering">Read the guide</Link>.
          </p>
        }
      >
        <Demo name="crossfilter" />
      </Section>

      <Section
        id="story"
        label="Scroll stories"
        title="Scrolling animated data stories"
        intro={
          <p>
            <code>Scrolly</code> pins a graphic and gives it a new state at each step. The chart animates from one state to the next. The story below regroups and recolours 96 dots in five steps. <Link href="/stories">See all {STORIES.length} scroll stories</Link>, or <Link href="/docs/stories">read the guide</Link>.
          </p>
        }
      >
        <BareDemo name="story-dots" props={{ stickyTop: 56, stepHeight: "64vh" }} />
        <div className="mt-12 grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Step through with buttons</h3>
            <p className="mt-1.5 max-w-[46ch] text-sm leading-6 text-muted-foreground">
              The same component in <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.86em] text-foreground">mode="steps"</code> needs no scrolling room. This story adds one period to a ribbon chart at each step. The left and right arrow keys also move between steps.
            </p>
            <p className="mt-6 font-mono text-xs tracking-wide text-muted-foreground">In the gallery</p>
            <ul className="mt-2.5 grid gap-2 text-sm">
              {STORIES.map((s) => (
                <li key={s.id}>
                  <Link href={`/stories#${s.id}`} className="group inline-flex items-center gap-1.5 font-medium underline decoration-border underline-offset-4 hover:decoration-foreground">
                    {s.title} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <BareDemo name="story-ribbon" props={{ mode: "steps" }} />
        </div>
      </Section>

      <Section
        id="theming"
        label="Theming"
        title="Themes and dark mode"
        intro={
          <p>
            Charts read shadcn/ui variables when they are present. Every colour token has an <code>--ic-*</code> CSS variable. Presets replace the whole palette. Dark mode is detected from the page. <Link href="/docs/theming">Read the guide</Link>.
          </p>
        }
      >
        <Demo name="theming" toolbar={false} />
      </Section>

      <Section
        id="export"
        label="Export"
        title="Export to PNG, JPEG, SVG, PDF, CSV and JSON"
        intro={
          <p>
            PNG, JPEG, SVG and PDF exports include the title, subtitle and source line. CSV and JSON exports contain the rows the chart drew. <Link href="/docs/export">Read the guide</Link>.
          </p>
        }
      >
        <Demo name="export" />
      </Section>

      <section className="border-t">
        <div className="container-page flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Get started</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">The quickstart renders a first chart. The catalogue lists every component.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/docs/quickstart" className={`${button} bg-primary text-primary-foreground hover:bg-primary/90`}>
              Quickstart <ArrowRight className="size-3.5" />
            </Link>
            <Link href="/docs/agents" className={`${button} border hover:bg-accent`}>
              Getting started for agents
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
