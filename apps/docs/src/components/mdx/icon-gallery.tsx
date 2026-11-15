"use client";

import { Icon, iconGroups, iconNames } from "insightcharts";
import { Check } from "lucide-react";
import { useState } from "react";

/** Every built-in icon by group, read from `iconGroups` at runtime. A click copies the name. */
export function IconGallery() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (name: string) => {
    navigator.clipboard?.writeText(name).then(
      () => {
        setCopied(name);
        setTimeout(() => setCopied((c) => (c === name ? null : c)), 1400);
      },
      () => undefined,
    );
  };
  const grouped = new Set(Object.values(iconGroups).flat() as string[]);
  // An icon that is in `icons` but in no group still shows.
  const rest = iconNames.filter((n) => !grouped.has(n));
  const groups = [...Object.entries(iconGroups), ...(rest.length ? ([["Other", rest]] as [string, typeof rest][]) : [])];
  return (
    <div className="not-prose my-6 grid gap-8">
      {groups.map(([group, names]) => (
        <section key={group} aria-label={group}>
          <h3 className="mb-3 text-sm font-medium">
            {group} <span className="ml-1 font-normal tabular-nums text-muted-foreground">{names.length}</span>
          </h3>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
            {names.map((name) => (
              <li key={name}>
                <button type="button" onClick={() => copy(name)} aria-label={`Copy the icon name ${name}`} className="flex h-[92px] w-full flex-col items-center justify-center gap-2.5 rounded-lg border px-1.5 transition-colors hover:border-foreground/25 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                  {copied === name ? <Check className="size-7 text-muted-foreground" aria-hidden /> : <Icon name={name} size={28} />}
                  <span className="max-w-full truncate font-mono text-[11px] text-muted-foreground">{copied === name ? "Copied" : name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** The number of built-in icons, for prose. */
export function IconCount() {
  return <>{iconNames.length}</>;
}
