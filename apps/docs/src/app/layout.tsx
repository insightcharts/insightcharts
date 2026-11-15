import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { ReactNode } from "react";
import { Providers } from "@/components/site/providers";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "InsightCharts, a React chart library built on Apache ECharts", template: "%s - InsightCharts" },
  description: site.description,
  applicationName: site.name,
  keywords: ["charts", "infographics", "data storytelling", "React", "ECharts", "scrollytelling", "shadcn", "AI agents"],
  openGraph: { type: "website", siteName: site.name, url: site.url, title: "InsightCharts, a React chart library built on Apache ECharts", description: site.description },
  twitter: { card: "summary_large_image", title: "InsightCharts, a React chart library built on Apache ECharts", description: site.description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0e" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh">
        <Providers>
          <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:border focus:bg-background focus:px-3 focus:py-1.5 focus:text-sm">
            Skip to content
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
