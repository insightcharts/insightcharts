"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function TopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="ml-4 hidden items-center gap-0.5 lg:flex">
      {items.map((item) => {
        // A page may belong to a destination its URL does not start with: infographics live at /templates/<name>.
        const claimed = items.some((other) => other.paths?.includes(pathname));
        const active = claimed ? !!item.paths?.includes(pathname) : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none", active && "text-foreground")}>
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
