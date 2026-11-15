import Link from "next/link";
import { getNav, topNav } from "@/lib/nav";
import { site } from "@/lib/site";
import { Wordmark } from "./logo";
import { MobileNav } from "./mobile-nav";
import { Search } from "./search";
import { ThemeToggle } from "./theme-toggle";
import { TopNav } from "./top-nav";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function SiteHeader() {
  const nav = getNav();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-14 items-center gap-3">
        <MobileNav nav={nav} />
        <Link href="/" className="rounded-md text-[15px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" aria-label="InsightCharts home">
          <Wordmark />
        </Link>
        <TopNav items={topNav} />
        <div className="ml-auto flex items-center gap-1">
          <Search />
          <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub repository" className="ml-1 inline-flex size-8 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            <GitHubIcon />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
