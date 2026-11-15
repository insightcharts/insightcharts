"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SidebarNav({ nav, onNavigate, className }: { nav: NavGroup[]; onNavigate?: () => void; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Documentation" className={cn("flex flex-col gap-7 text-sm", className)}>
      {nav.map((group) => {
        // The section you are in stays marked, whether you are on its index or one of its pages.
        const within = pathname === group.href || group.blocks.some((b) => b.items.some((i) => i.href === pathname));
        return (
        <div key={group.title} data-active-section={within || undefined}>
          {group.href ? (
            <Link href={group.href} onClick={onNavigate} aria-current={pathname === group.href ? "page" : undefined} className={cn("mb-1.5 flex items-center justify-between rounded-md px-2 py-1 font-medium text-foreground hover:bg-accent", pathname === group.href && "bg-accent")}>
              <span className="flex items-center gap-2">
                {group.title}
                {within ? <span aria-hidden className="size-1.5 rounded-full bg-foreground" /> : null}
              </span>
              <span className="text-xs font-normal tabular-nums text-muted-foreground">{group.blocks.reduce((n, b) => n + b.items.length, 0) || ""}</span>
            </Link>
          ) : (
            <h4 className="mb-1.5 flex items-center gap-2 px-2 py-1 font-medium text-foreground">
              {group.title}
              {within ? <span aria-hidden className="size-1.5 rounded-full bg-foreground" /> : null}
            </h4>
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
                        className={cn(
                          "relative block rounded-md px-2 py-1 text-[13.5px] leading-6 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                          active && "bg-accent pl-3.5 font-medium text-foreground before:absolute before:inset-y-1.5 before:left-1.5 before:w-0.5 before:rounded-full before:bg-foreground",
                        )}
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
        );
      })}
    </nav>
  );
}
