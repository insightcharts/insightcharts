import Link from "next/link";
import { site } from "@/lib/site";
import { LogoMark } from "./logo";

export function SiteFooter() {
  const links = [
    { title: "Docs", href: "/docs" },
    { title: "Atoms", href: "/atoms" },
    { title: "Molecules", href: "/molecules" },
    { title: "Templates", href: "/templates" },
    { title: "Stories", href: "/stories" },
    { title: "llms.txt", href: "/llms.txt", external: true },
    { title: "GitHub", href: site.github, external: true },
  ];
  return (
    <footer className="border-t">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="flex items-center gap-2">
            <LogoMark className="size-4 text-foreground" />
            InsightCharts. Apache 2.0 licensed. Built on Apache ECharts.
          </p>
          <p>
            © {new Date().getFullYear()}{" "}
            <a href="https://x.com/kyleledbetter" target="_blank" rel="noreferrer" className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">
              Kyle Ledbetter
            </a>
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l) =>
            l.external ? (
              <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.title}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.title}
              </Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
