import type { PropDoc } from "@/lib/catalog";

/** Inline `code` spans in prop descriptions. */
export function InlineMd({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.86em] text-foreground">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function PropsTable({ props }: { props: PropDoc[] }) {
  if (!props.length) return <p className="text-sm text-muted-foreground">No component-specific props.</p>;
  const hasDefault = props.some((p) => p.default);
  return (
    <div className="scroll-quiet overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
            <th scope="col" className="px-4 py-2.5 font-medium">Prop</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Type</th>
            {hasDefault ? <th scope="col" className="px-4 py-2.5 font-medium">Default</th> : null}
            <th scope="col" className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b align-top last:border-0">
              <th scope="row" className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] font-medium text-foreground">
                {p.name}
                {p.required ? (
                  <span className="ml-1.5 align-middle font-sans text-[10.5px] font-normal text-muted-foreground" title="Required">
                    required
                  </span>
                ) : null}
              </th>
              <td className="max-w-[240px] px-4 py-3 font-mono text-[12px] leading-5 text-muted-foreground">{p.type}</td>
              {hasDefault ? <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-muted-foreground">{p.default ?? ""}</td> : null}
              <td className="min-w-[220px] px-4 py-3 leading-5 text-foreground/90">
                <InlineMd text={p.description} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
