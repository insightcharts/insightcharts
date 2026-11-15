import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site/site-chrome";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <SiteChrome>
    <main id="content" className="container-page grid min-h-[60dvh] place-items-center py-24 text-center">
      <div>
        <p className="font-mono text-xs text-muted-foreground">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The component may have been renamed, or the link is out of date.</p>
        <div className="mt-6 flex justify-center gap-2.5">
          <Link href="/atoms" className="inline-flex h-9 items-center rounded-md border px-3.5 text-sm font-medium transition-colors hover:bg-accent">
            Browse components
          </Link>
          <Link href="/docs" className="inline-flex h-9 items-center rounded-md border px-3.5 text-sm font-medium transition-colors hover:bg-accent">
            Read the docs
          </Link>
        </div>
      </div>
    </main>
    </SiteChrome>
  );
}
