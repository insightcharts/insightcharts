import Link from "next/link";
import type { ReactNode } from "react";
import { compositionTree, hrefOf, isInfographic, isPosterPrimitive, usedInTree, type CatalogEntry, type Linked } from "@/lib/catalog";
import type { TocItem } from "@/components/site/toc";
import { ComponentCard } from "./component-card";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const chip = "inline-flex h-5 items-center rounded-full border px-1.5 text-[11px] leading-none text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

function Chips({ label, items }: { label: string; items: CatalogEntry[] }) {
  return (
    <span className="flex flex-wrap items-center gap-1">
      <span className="mr-0.5">{label}</span>
      {items.map((x) => (
        <Link key={x.name} href={hrefOf(x)} className={chip}>
          {x.title}
        </Link>
      ))}
    </span>
  );
}

function Group({ title, count, note, wide, children }: { title: string; count: number; note?: string; wide?: boolean; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <h4 className="text-sm font-medium">{title}</h4>
        <span className="text-[13px] tabular-nums text-muted-foreground">{count}</span>
        {note ? <span className="text-[13px] text-muted-foreground">· {note}</span> : null}
      </div>
      {/* Molecules and templates are wider than atoms, so their cards are too. */}
      <div className={wide ? "grid gap-3 sm:grid-cols-2" : "grid grid-cols-2 gap-3 md:grid-cols-3"}>{children}</div>
    </div>
  );
}

const linkedCard = (x: Linked) => <ComponentCard key={x.entry.name} entry={x.entry} size="sm" aspect={x.entry.level === "template" ? 4 / 3 : undefined} meta={x.via.length ? <Chips label={x.direct ? "Directly, and through" : "Through"} items={x.via} /> : undefined} />;

function Part({ id, title, summary, children }: { id: string; title: string; summary: string; children: ReactNode }) {
  return (
    <div className="grid gap-5">
      <div>
        <h3 id={id} className="scroll-mt-20 text-base font-semibold tracking-tight">
          {title}
        </h3>
        <p className="mt-1 max-w-[66ch] text-sm leading-6 text-muted-foreground">{summary}</p>
      </div>
      {children}
    </div>
  );
}

export function compositionToc(c: CatalogEntry): TocItem[] {
  const down = compositionTree(c);
  return [...(down.molecules.length + down.atoms.length ? [{ id: "built-from", title: "Built from", depth: 3 }] : []), ...(c.level !== "template" ? [{ id: "used-in", title: "Used in", depth: 3 }] : [])];
}

/**
 * Both directions of `meta.composes`, followed to the ends: a template shows its molecules
 * and every atom under them; an atom shows its molecules and every template above them.
 */
export function Composition({ entry: c }: { entry: CatalogEntry }) {
  const down = compositionTree(c);
  const up = usedInTree(c);
  const hasDown = down.molecules.length + down.atoms.length > 0;
  const hasUp = up.molecules.length + up.templates.length > 0;
  const name = c.title.toLowerCase();
  const indirect = down.atoms.filter((a) => !a.direct).length;
  // Poster primitives and infographics are groups of their own in both directions.
  const primitives = down.atoms.filter((a) => isPosterPrimitive(a.entry));
  const otherAtoms = down.atoms.filter((a) => !isPosterPrimitive(a.entry));
  const posters = up.templates.filter((t) => isInfographic(t.entry));
  const pages = up.templates.filter((t) => !isInfographic(t.entry));
  const users = [up.molecules.length ? plural(up.molecules.length, "molecule") : "", pages.length ? plural(pages.length, "template") : "", posters.length ? plural(posters.length, "infographic") : ""].filter(Boolean);
  const list = (parts: string[]) => (parts.length > 2 ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}` : parts.join(" and "));
  return (
    <div className="grid gap-10">
      {hasDown ? (
        <Part
          id="built-from"
          title="Built from"
          summary={
            c.level === "template"
              ? `The ${name} template is assembled from ${list([down.molecules.length ? plural(down.molecules.length, "molecule") : "", primitives.length ? plural(primitives.length, "poster primitive") : "", otherAtoms.length ? plural(otherAtoms.length, primitives.length ? "other atom" : "atom") : ""].filter(Boolean))}${indirect ? `, ${indirect} of which it reaches only through a molecule` : ""}. Any slot also takes any other component.`
              : `The pieces ${name} renders or expects in its slots.`
          }
        >
          {down.molecules.length ? (
            <Group wide title="Molecules" count={down.molecules.length}>
              {down.molecules.map((m) => (
                <ComponentCard key={m.entry.name} entry={m.entry} size="sm" meta={m.atoms.length ? <Chips label="Uses" items={m.atoms} /> : undefined} />
              ))}
            </Group>
          ) : null}
          {primitives.length ? (
            <Group title="Poster primitives" count={primitives.length}>
              {primitives.map(linkedCard)}
            </Group>
          ) : null}
          {otherAtoms.length ? (
            <Group title={primitives.length ? "Other atoms" : "Atoms"} count={otherAtoms.length}>
              {otherAtoms.map(linkedCard)}
            </Group>
          ) : null}
        </Part>
      ) : c.level !== "atom" ? (
        <Part id="built-from" title="Built from" summary={`${c.title} is built from plain HTML and lists no other component in its composes.`}>
          {null}
        </Part>
      ) : null}

      {c.level !== "template" ? (
        <Part
          id="used-in"
          title="Used in"
          summary={
            hasUp
              ? `${list(users)} ${up.molecules.length + up.templates.length === 1 ? "uses" : "use"} ${name}.`
              : `No ${c.level === "atom" ? "molecule or template" : "template"} lists ${name} in its composes. It still fits any slot that takes a component.`
          }
        >
          {up.molecules.length ? (
            <Group wide title="Molecules" count={up.molecules.length}>
              {up.molecules.map((m) => (
                <ComponentCard key={m.name} entry={m} size="sm" />
              ))}
            </Group>
          ) : null}
          {pages.length ? (
            <Group wide title="Templates" count={pages.length}>
              {pages.map(linkedCard)}
            </Group>
          ) : null}
          {posters.length ? (
            <Group wide title="Infographics" count={posters.length}>
              {posters.map(linkedCard)}
            </Group>
          ) : null}
        </Part>
      ) : null}
    </div>
  );
}
