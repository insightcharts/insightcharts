"use client";

import { useState } from "react";
import { CopyButton } from "@/components/site/copy-button";
import { cn } from "@/lib/utils";

const MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
type Manager = (typeof MANAGERS)[number];

const cli: Record<Manager, (item: string) => string> = {
  pnpm: (item) => `pnpm dlx shadcn@latest add ${item}`,
  npm: (item) => `npx shadcn@latest add ${item}`,
  yarn: (item) => `yarn dlx shadcn@latest add ${item}`,
  bun: (item) => `bunx --bun shadcn@latest add ${item}`,
};
const pkg: Record<Manager, string> = {
  pnpm: "pnpm add insightcharts echarts",
  npm: "npm i insightcharts echarts",
  yarn: "yarn add insightcharts echarts",
  bun: "bun add insightcharts echarts",
};

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} className={cn("h-7 rounded-md px-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none", active && "bg-accent text-foreground")}>
      {children}
    </button>
  );
}

/** Install commands: shadcn CLI (registry item) or the npm package, for each package manager. */
export function InstallTabs({ item, only }: { item?: string; only?: "cli" | "package" }) {
  const [method, setMethod] = useState<"cli" | "package">(only ?? (item ? "cli" : "package"));
  const [manager, setManager] = useState<Manager>("pnpm");
  const command = method === "cli" && item ? cli[manager](item) : pkg[manager];
  return (
    <div className="not-prose overflow-hidden rounded-xl border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b px-2 py-1.5">
        {item && !only ? (
          <div role="tablist" aria-label="Install method" className="flex gap-0.5">
            <Pill active={method === "cli"} onClick={() => setMethod("cli")}>
              shadcn CLI
            </Pill>
            <Pill active={method === "package"} onClick={() => setMethod("package")}>
              npm package
            </Pill>
          </div>
        ) : (
          <span className="px-2.5 text-[13px] font-medium text-muted-foreground">{method === "cli" ? "shadcn CLI" : "npm package"}</span>
        )}
        <div role="tablist" aria-label="Package manager" className="flex gap-0.5">
          {MANAGERS.map((m) => (
            <Pill key={m} active={manager === m} onClick={() => setManager(m)}>
              {m}
            </Pill>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 bg-muted/30 py-3 pl-4 pr-2 dark:bg-muted/10">
        <pre className="scroll-quiet min-w-0 flex-1 overflow-x-auto font-mono text-[13px] leading-6">
          <span className="select-none text-muted-foreground/60">$ </span>
          {command}
        </pre>
        <CopyButton value={command} label="Copy command" />
      </div>
    </div>
  );
}
