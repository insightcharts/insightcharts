"use client";

import { InsightProvider } from "insightcharts";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { PreviewSettingsProvider } from "@/components/catalog/preview-settings";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* A fixed locale keeps server-rendered numbers identical to the client's, so hydration is clean. */}
      <InsightProvider locale="en-US">
        <TooltipProvider delayDuration={200}>
          <PreviewSettingsProvider>{children}</PreviewSettingsProvider>
        </TooltipProvider>
      </InsightProvider>
    </ThemeProvider>
  );
}
