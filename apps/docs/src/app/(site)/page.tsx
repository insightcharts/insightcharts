import { ArrowRight, Braces, FileText, Package, Sparkles } from "lucide-react";
import Link from "next/link";
import { ComponentCard } from "@/components/catalog/component-card";
import { Thumbnail } from "@/components/catalog/component-card";
import { PosterThumb } from "@/components/catalog/poster-thumb";
import { Render } from "@/components/catalog/render";
import { Section } from "@/components/landing/section";
import { BareDemo, Demo } from "@/components/mdx/demo";
import { CopyButton } from "@/components/site/copy-button";
import { byLevel, components, getComponent, hrefOf, infographics, INFOGRAPHICS, levelInfo, LEVELS, pageTemplates, posterPrimitives, type CatalogEntry } from "@/lib/catalog";
import { groundOfTheme, posterGround, posterWidth } from "@/lib/posters";

const INSTALL = "npm i insightcharts echarts";

// The ladder the page walks: an atom, a molecule that lists it in its composes, and a template
// that lists the molecule. Checked against the catalogue below, so it cannot quietly go stale.
const HERO = { atom: "big-number", molecule: "stat-row", template: "executive-brief" };
// Preferred examples for the tour. Anything missing is filled from the catalogue.
const FEATURED: Record<string, string[]> = {
  atom: ["line-chart", "callout", "big-number"],
  molecule: ["chart-callout", "stat-row", "kpi-grid"],
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

/** One rung of the hero ladder: a labelled, linked frame around a live example. */
function Rung({ index, entry, children, className }: { index: number; entry: CatalogEntry; children: React.ReactNode; className?: string }) {
  return (
    <div className={`group relative flex min-w-0 flex-col overflow-hidden rounded-xl border bg-background transition-colors focus-within:ring-2 focus-within:ring-ring hover:border-foreground/25 ${className ?? ""}`}>
      <div className="flex items-center gap-2 border-b px-3.5 py-2 text-xs">
        <span className="font-mono tabular-nums text-muted-foreground">0{index}</span>
        <span className="text-muted-foreground">{levelInfo(entry.level).singular}</span>
        <Link href={hrefOf(entry)} className="truncate font-medium outline-none after:absolute after:inset-0 after:content-['']">
          {entry.title}
        </Link>
        <ArrowRight className="ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
      </div>
      {children}
    </div>
  );
}

const button = "inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

export default function Home() {
  const counts = LEVELS.map((l) => byLevel(l.level).length);
  const atom = getComponent(HERO.atom);
  const molecule = getComponent(HERO.molecule);
  const template = getComponent(HERO.template);
  const ladder = atom && molecule && template && molecule.composes?.includes(atom.name) && template.composes?.includes(molecule.name) ? { atom, molecule, template } : null;
  // The same figures at all three levels: the template's first figure is the atom, its row
  // of figures is the molecule. Falls back to each component's own example.
  const figures = Array.isArray(template?.example?.figures) ? (template.example.figures as Record<string, unknown>[]) : null;
  const picks = Object.fromEntries(LEVELS.map((l) => [l.level, featured(l.level, l.level === "template" ? 2 : 3)])) as Record<CatalogEntry["level"], CatalogEntry[]>;
  const templates = pageTemplates();
  const posters = featuredPosters(3);
  const posterCount = infographics().length;
  const agentLinks = [
    { icon: Braces, title: "JSON spec", body: "Every component can be written as { type, ...props } and rendered by the Insight component. A JSON Schema validates the spec.", href: "/docs/json-spec" },
    { icon: FileText, title: "llms.txt", body: "An index, a full-text file and a Markdown page per component. They are generated from the same metadata as this site.", href: "/llms.txt", external: true },
    { icon: Sparkles, title: "Agent skill", body: "An installable skill with a workflow for building a figure from data, the rules for writing titles and a decision table for choosing a form.", href: "/docs/ai-agents#the-skill" },
    { icon: Package, title: "shadcn registry", body: "Add any component by name with the shadcn CLI or through the shadcn MCP server.", href: "/docs/installation#shadcn-registry" },
  ];
  return (
    <main id="content">
      {/* Hero: description and install on the left, live components on the right. */}
      <section className="container-page grid items-center gap-x-12 gap-y-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-20">
        <div>
          <p className="mb-4 font-mono text-xs tracking-wide text-muted-foreground">Open source · React 19 · Apache ECharts 6</p>
          <h1 className="max-w-[16ch] text-4xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.05]">A React chart library built on Apache ECharts</h1>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-7 text-muted-foreground text-pretty">
            InsightCharts has {counts[0]} atoms, {counts[1]} molecules and {counts[2]} templates.{posterCount ? ` ${posterCount} of the templates are infographics.` : ""} Each one is a chart, a figure, a page layout or a poster that can be written as JSX or as a JSON spec.
          </p>
          <div className="mt-7 flex max-w-sm items-center gap-2 rounded-lg border bg-muted/40 py-1.5 pl-3.5 pr-1.5 font-mono text-[13px]">
            <span className="select-none text-muted-foreground/70">$</span>
            <code className="min-w-0 flex-1 truncate">{INSTALL}</code>
            <CopyButton value={INSTALL} label="Copy install command" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link href="/docs/quickstart" className={`${button} bg-primary text-primary-foreground hover:bg-primary/90`}>
              Get started <ArrowRight className="size-3.5" />
            </Link>
            <Link href="/atoms" className={`${button} border hover:bg-accent`}>
              Browse {components.length} components
            </Link>
          </div>
        </div>
        {ladder ? (
          <figure className="min-w-0">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]">
              <Rung index={1} entry={ladder.atom}>
                <div className="flex flex-1 items-center overflow-hidden px-4 py-4 sm:h-[224px]">
                  <div className="w-full min-w-0">
                    <Render name={ladder.atom.name} props={figures?.[0] ?? ladder.atom.example} />
                  </div>
                </div>
              </Rung>
              <Rung index={2} entry={ladder.molecule}>
                {/* The row is laid out for a wide container on the server and re-flows once it is
                    measured. A fixed height keeps that from moving the rest of the page. */}
                <div className="flex h-[264px] items-center overflow-hidden px-4 py-4 sm:h-[224px]">
                  <div className="w-full min-w-0">
                    <Render name={ladder.molecule.name} props={figures ? { items: figures } : ladder.molecule.example} />
                  </div>
                </div>
              </Rung>
              <Rung index={3} entry={ladder.template} className="sm:col-span-2">
                <Thumbnail entry={ladder.template} aspect={16 / 9} eager />
              </Rung>
            </div>
            <figcaption className="mt-3 text-xs leading-5 text-muted-foreground">These are live components. The first is one figure as an atom. The second is a row of figures as a molecule. The third is a one-page brief that starts with that row, as a template.</figcaption>
          </figure>
        ) : null}
      </section>

      {posters.length ? (
        <Section
          id="infographics"
          label="Infographics"
          title={`${posterCount} templates draw a whole poster`}
          intro={
            <p>
              An infographic is one designed sheet with a painted background, little text and large graphics. <Link href={`/${INFOGRAPHICS.slug}`}>See all {posterCount} infographics</Link>, or <Link href="/docs/infographics">read the guide</Link>.
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
        title="Components come in three levels"
        intro={<p>Atoms are single charts and figure primitives. Molecules combine a few atoms to make one point. Templates arrange molecules and atoms into a complete page. Each card below names the components it uses. Every component page lists what the component is built from and where it is used.</p>}
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
          title="Templates lay out a whole page"
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
        title="Every component can be written as JSON"
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
        title="A click on one chart filters the others"
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
        title="A chart that changes as the reader scrolls"
        intro={
          <p>
            <code>Scrolly</code> pins a graphic and gives it a new state at each step. The chart animates from one state to the next. On phones the steps become cards that swipe, and a steps mode with buttons works in any container. <Link href="/docs/stories">Read the guide</Link>.
          </p>
        }
      >
        <BareDemo name="scroll-story" props={{ stickyTop: 72, stepHeight: "64vh" }} />
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
            <Link href="/docs/ai-agents" className={`${button} border hover:bg-accent`}>
              For AI agents
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
