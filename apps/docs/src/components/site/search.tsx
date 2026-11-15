"use client";

import { Atom, Boxes, FileText, Hash, LayoutTemplate, Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export interface SearchRecord {
  title: string;
  href: string;
  group: string;
  kind: "guide" | "heading" | "atom" | "molecule" | "template";
  /** Parent page title for headings; description otherwise. */
  detail?: string;
  /** Extra text matched but not shown. */
  keywords?: string;
}

const icons = { guide: FileText, heading: Hash, atom: Atom, molecule: Boxes, template: LayoutTemplate };

/**
 * Plain substring matching, ranked by where the hit is: title, then description, then body.
 * cmdk's default fuzzy scorer matches scattered letters, which on long body text matches everything.
 */
function score(_value: string, search: string, keywords?: string[]): number {
  const [title = "", detail = "", body = ""] = (keywords ?? []).map((k) => k.toLowerCase());
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  let total = 1;
  for (const t of terms) {
    const s = title.startsWith(t) ? 1 : title.includes(t) ? 0.8 : detail.includes(t) ? 0.4 : body.includes(t) ? 0.2 : 0;
    if (!s) return 0;
    total = Math.min(total, s);
  }
  return total;
}

export function Search() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<SearchRecord[] | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName) && !(e.target as HTMLElement).isContentEditable)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  // The index is a static JSON file, fetched the first time the dialog opens.
  useEffect(() => {
    if (!open || records) return;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setRecords)
      .catch(() => setRecords([]));
  }, [open, records]);

  const groups = new Map<string, SearchRecord[]>();
  for (const r of records ?? []) groups.set(r.group, [...(groups.get(r.group) ?? []), r]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        className="inline-flex h-8 items-center gap-2 rounded-md border bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:w-44 lg:w-56"
      >
        <SearchIcon className="size-3.5" />
        <span className="hidden flex-1 truncate text-left sm:inline">Search...</span>
        <kbd className="pointer-events-none hidden h-5 items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Search guides and components" className="sm:max-w-xl">
        <Command filter={score}>
        <CommandInput placeholder="Search guides and components..." />
        <CommandList className="max-h-[min(60vh,420px)]">
          <CommandEmpty>{records ? "Nothing matches that." : "Loading..."}</CommandEmpty>
          {[...groups.entries()].map(([group, items]) => (
            <CommandGroup key={group} heading={group}>
              {items.map((r) => {
                const Icon = icons[r.kind];
                return (
                  <CommandItem
                    key={r.href}
                    value={r.href}
                    keywords={[r.title, r.detail ?? "", r.keywords ?? ""]}
                    onSelect={() => {
                      setOpen(false);
                      router.push(r.href);
                    }}
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="truncate">{r.title}</span>
                    {r.detail ? <span className="ml-auto hidden max-w-[55%] truncate pl-4 text-xs text-muted-foreground sm:inline">{r.detail}</span> : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
