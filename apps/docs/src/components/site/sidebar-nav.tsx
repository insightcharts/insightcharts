"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SidebarNav({ nav, onNavigate, className }: { nav: NavGroup[]; onNavigate?: () => void; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Documentation" className={cn("flex flex-col gap-7 text-sm", className)}>
      {nav.map((group) => (
        <div key={group.title}>
          {group.href ? (
            <Link href={group.href} onClick={onNavigate} aria-current={pathname === group.href ? "page" : undefined} className={cn("mb-1.5 flex items-center justify-between rounded-md px-2 py-1 font-medium text-foreground hover:bg-accent", pathname === group.href && "bg-accent")}>
              {group.title}
              <span className="text-xs font-normal tabular-nums text-muted-foreground">{group.blocks.reduce((n, b) => n + b.items.length, 0) || ""}</span>
            </Link>
          ) : (
            <h4 className="mb-1.5 px-2 py-1 font-medium text-foreground">{group.title}</h4>
          )}
          {group.empty ? <p className="px-2 py-1 text-[13px] text-muted-foreground/70">{group.empty}</p> : null}
          {group.blocks.map((block, i) => (
            <div key={block.label ?? i} className={cn(block.label && "mt-3 first:mt-0")}>
              {block.label ? <div className="px-2 pb-1 pt-1 text-xs font-medium tracking-wide text-muted-foreground/70">{block.label}</div> : null}
              <ul className="grid gap-px">
                {block.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn("block rounded-md px-2 py-1 text-[13.5px] leading-6 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none", active && "bg-accent font-medium text-foreground")}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
