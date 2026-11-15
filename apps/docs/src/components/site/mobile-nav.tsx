"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavGroup } from "@/lib/nav";
import { Wordmark } from "./logo";
import { SidebarNav } from "./sidebar-nav";
import { SidebarScroll } from "./sidebar-scroll";

export function MobileNav({ nav }: { nav: NavGroup[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="-ml-2 size-8 lg:hidden" aria-label="Open navigation">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] gap-0 p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle asChild>
            <Link href="/" onClick={() => setOpen(false)}>
              <Wordmark className="text-[15px]" />
            </Link>
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        {/* Mounted each time the drawer opens, so it always opens at the current page. */}
        <SidebarScroll persist={false} className="scroll-quiet overflow-y-auto px-3 py-5">
          <SidebarNav nav={nav} onNavigate={() => setOpen(false)} />
        </SidebarScroll>
      </SheetContent>
    </Sheet>
  );
}
