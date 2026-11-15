import type { Metadata } from "next";
import Link from "next/link";
import { BareDemo } from "@/components/mdx/demo";
import { STORIES } from "@/lib/stories";

const description = `${STORIES.length} scroll stories built with Scrolly. Each one pins a chart and changes one prop at every step, in a different theme and chart form.`;

export const metadata: Metadata = {
  title: "Scroll stories",
  description,
  alternates: { canonical: "/stories" },
  openGraph: { title: "Scroll stories - InsightCharts", description, url: "/stories" },
};

const link = "font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground";

export default function Stories() {
  return (
    <main id="content" className="min-w-0 pb-24">
      <header className="py-10 sm:py-14">
        <p className="mb-3 font-mono text-xs tracking-wide text-muted-foreground">{STORIES.length} examples</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Scroll stories</h1>
        <p className="mt-4 max-w-[68ch] text-[17px] leading-7 text-muted-foreground text-pretty">
          Each story pins one chart and changes one prop at every step. Scroll the page, use the arrow buttons under a chart, or focus a story and press the left and right arrow keys. <Link href="/docs/stories" className={link}>Read the guide</Link>.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2 text-sm">
          {STORIES.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="inline-flex h-8 items-center rounded-full border px-3 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </header>
      {STORIES.map((s, i) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-20 border-t py-12 sm:py-16">
          <div className="mb-8 grid gap-x-12 gap-y-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div>
              <p className="mb-2 font-mono text-xs tabular-nums text-muted-foreground">
                0{i + 1} · {s.theme} theme
              </p>
              <h2 id={`${s.id}-title`} className="text-2xl font-semibold tracking-tight">
                {s.title}
              </h2>
            </div>
            <p className="max-w-[62ch] text-[15px] leading-7 text-muted-foreground">
              <Link href={s.href} className={link}>
                {s.form}
              </Link>
              . {s.changes}
            </p>
          </div>
          <BareDemo name={s.demo} props={{ stickyTop: 56, stepHeight: "75vh" }} />
        </section>
      ))}
    </main>
  );
}
