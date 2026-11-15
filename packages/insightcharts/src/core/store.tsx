import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { loadData, resolveSync } from "../data/load";
import { matches, transformRows } from "../data/transform";
import type { DataInput, RemoteSource, Row, Transform } from "../data/types";

const ids = new WeakMap<object, number>();
let nextId = 1;
const idOf = (o: object) => {
  let id = ids.get(o);
  if (!id) ids.set(o, (id = nextId++));
  return id;
};

/**
 * A cheap structural key. Small values are keyed by content, so inline literals
 * (`data={[...]}` written in JSX) do not look new on every render; large arrays and
 * functions are keyed by identity.
 */
export function stableKey(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "function") return `fn${idOf(value)}`;
  if (typeof value !== "object") return String(value);
  if (Array.isArray(value) && value.length > 500) return `arr${idOf(value)}:${value.length}`;
  if (value instanceof Promise || typeof (value as { toArray?: unknown }).toArray === "function") return `obj${idOf(value)}`;
  try {
    return JSON.stringify(value, (_k, v) => (typeof v === "function" ? `fn${idOf(v)}` : v));
  } catch {
    return `obj${idOf(value)}`;
  }
}

export interface DataState {
  rows: Row[];
  status: "loading" | "ready" | "error";
  error: Error | null;
}

/**
 * Resolve any `DataInput` to rows. In-memory data resolves synchronously (no loading
 * flash); URLs, promises and functions load asynchronously. `transform` runs afterwards.
 */
export function useData(input: DataInput | null | undefined, transform?: Transform | Transform[]): DataState {
  // A loader function is identified by its source text, not its identity: an inline
  // `data={async () => ...}` is a new function on every render and would otherwise reload
  // forever. If a loader closes over changing values, put them in the URL or memoise it.
  const key = typeof input === "function" ? `loader:${input.toString()}` : stableKey(input);
  const tKey = stableKey(transform);
  const held = useRef({ input, transform });
  held.current = { input, transform };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sync = useMemo(() => {
    try {
      return { rows: resolveSync(held.current.input), error: null as Error | null };
    } catch (error) {
      return { rows: [] as Row[], error: error as Error };
    }
  }, [key]);
  const [remote, setRemote] = useState<{ key: string; rows: Row[]; error: Error | null } | null>(null);

  useEffect(() => {
    if (sync.rows) return;
    let cancelled = false;
    const run = (fresh?: boolean) =>
      loadData(held.current.input, { fresh }).then(
        (rows) => !cancelled && setRemote({ key, rows, error: null }),
        (error) => !cancelled && setRemote({ key, rows: [], error: error instanceof Error ? error : new Error(String(error)) }),
      );
    run();
    const refresh = (held.current.input as RemoteSource | undefined)?.refresh;
    const timer = refresh ? setInterval(() => run(true), refresh) : undefined;
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, sync.rows]);

  const raw = sync.rows ?? (remote?.key === key ? remote.rows : null);
  const error = sync.error ?? (remote?.key === key ? remote.error : null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const result = useMemo(() => {
    if (!raw) return { rows: [] as Row[], error: null as Error | null };
    try {
      return { rows: transformRows(raw, held.current.transform), error: null };
    } catch (e) {
      return { rows: [] as Row[], error: e as Error };
    }
  }, [raw, tKey]);
  const finalError = error ?? result.error;
  const status = finalError ? "error" : raw ? "ready" : "loading";
  return useMemo(() => ({ rows: result.rows, status, error: finalError }), [result.rows, status, finalError]);
}

/** One chart's contribution to the shared filter: a set of values or a numeric/date range on a field. */
export interface Selection {
  field: string;
  values?: string[];
  range?: [number | string, number | string];
}

export interface InsightDataStore extends DataState {
  /** All rows, unfiltered. */
  all: Row[];
  /** Active selections keyed by the chart that made them. */
  selections: Record<string, Selection>;
  select(owner: string, selection: Selection | null): void;
  clear(): void;
  /**
   * Rows filtered by every selection except `owner`'s own. A chart keeps showing its full
   * domain while the others filter it, which is what makes crossfiltering readable.
   */
  rowsFor(owner?: string): Row[];
}

const StoreCtx = createContext<InsightDataStore | null>(null);

const passes = (row: Row, s: Selection) => (s.range ? matches(row[s.field], "between", s.range) : !s.values?.length || s.values.includes(String(row[s.field])));

export interface InsightDataProps {
  /** Shared data for every chart inside that does not pass its own `data`. */
  data: DataInput;
  transform?: Transform | Transform[];
  /** Controlled selections. */
  selections?: Record<string, Selection>;
  onSelectionsChange?: (selections: Record<string, Selection>) => void;
  children: ReactNode;
}

/**
 * Load data once and share it. Charts inside read from it automatically, and any chart
 * with `select` filters all the others when the reader clicks a mark.
 */
export function InsightData({ data, transform, selections: controlled, onSelectionsChange, children }: InsightDataProps) {
  const state = useData(data, transform);
  const [own, setOwn] = useState<Record<string, Selection>>({});
  const selections = controlled ?? own;
  const latest = useRef({ selections, onSelectionsChange, uncontrolled: controlled === undefined });
  latest.current = { selections, onSelectionsChange, uncontrolled: controlled === undefined };

  const commit = useCallback((next: Record<string, Selection>) => {
    // Uncontrolled: make the change visible to a second select() in the same tick, before
    // React re-renders; otherwise the later call is built on stale state and drops this one.
    if (latest.current.uncontrolled) latest.current.selections = next;
    setOwn(next);
    latest.current.onSelectionsChange?.(next);
  }, []);
  const select = useCallback(
    (owner: string, selection: Selection | null) => {
      const next = { ...latest.current.selections };
      if (selection && (selection.range || selection.values?.length)) next[owner] = selection;
      else delete next[owner];
      commit(next);
    },
    [commit],
  );
  const clear = useCallback(() => commit({}), [commit]);

  const store = useMemo<InsightDataStore>(() => {
    const cache = new Map<string, Row[]>();
    return {
      ...state,
      all: state.rows,
      selections,
      select,
      clear,
      rowsFor(owner = "") {
        let hit = cache.get(owner);
        if (!hit) {
          const active = Object.entries(selections)
            .filter(([k]) => k !== owner)
            .map(([, s]) => s);
          hit = active.length ? state.rows.filter((r) => active.every((s) => passes(r, s))) : state.rows;
          cache.set(owner, hit);
        }
        return hit;
      },
    };
  }, [state, selections, select, clear]);

  return <StoreCtx.Provider value={store}>{children}</StoreCtx.Provider>;
}

/** The surrounding `<InsightData>` store, or null. */
export function useInsightData(): InsightDataStore | null {
  return useContext(StoreCtx);
}
