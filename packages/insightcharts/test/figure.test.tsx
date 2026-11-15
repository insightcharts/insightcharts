import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Figure, type LegendItem } from "../src/core/figure";
import { InsightProvider } from "../src/core/provider";
import { stubCanvas } from "./helpers";

beforeAll(stubCanvas);
afterEach(cleanup);

const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`);
const legend: LegendItem[] = [
  { name: "Solar", color: "#2a78d6" },
  { name: "Wind", color: "#eb6834", shape: "line" },
];

describe("Figure: chrome", () => {
  it("renders the headline, subtitle and children inside a <figure>", () => {
    render(
      <Figure title="Churn halved" subtitle="Monthly churn, %">
        <div data-testid="plot" />
      </Figure>,
    );
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("Churn halved");
    expect(slot("ic-subtitle")!.textContent).toBe("Monthly churn, %");
    expect(slot("ic-figure")!.tagName).toBe("FIGURE");
    expect(screen.getByTestId("plot")).toBeTruthy();
  });

  it("omits the header entirely when there is no title or subtitle", () => {
    render(<Figure>x</Figure>);
    expect(slot("ic-header")).toBeNull();
    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("writes the source and note as a caption: 'Source: X · note'", () => {
    const { rerender } = render(<Figure source="IEA" note="Illustrative data" />);
    expect(slot("ic-source")!.textContent).toBe("Source: IEA · Illustrative data");
    expect(slot("ic-source")!.tagName).toBe("FIGCAPTION");
    rerender(<Figure source="IEA" />);
    expect(slot("ic-source")!.textContent).toBe("Source: IEA");
    rerender(<Figure note="Illustrative data" />);
    expect(slot("ic-source")!.textContent).toBe("Illustrative data");
    rerender(<Figure />);
    expect(slot("ic-source")).toBeNull();
  });

  it("sets the theme's chrome variables on the figure, and lets a theme prop override them", () => {
    render(<Figure theme={{ ink: "#123456", accent: "#ff0066" }} title="t" />);
    const style = slot("ic-figure")!.getAttribute("style")!;
    expect(style).toContain("--_ic-ink: #123456");
    expect(style).toContain("--_ic-accent: #ff0066");
  });

  it("uses the dark token set when mode is dark", async () => {
    render(<Figure mode="dark" theme={{ light: { ink: "#111111" }, dark: { ink: "#eeeeee" } }} />);
    await act(async () => {});
    const fig = slot("ic-figure")!;
    expect(fig.getAttribute("data-ic-mode")).toBe("dark");
    expect(fig.getAttribute("style")).toContain("--_ic-ink: #eeeeee");
  });

  it("follows a dark ancestor automatically", async () => {
    render(
      <div className="dark">
        <Figure />
      </div>,
    );
    await act(async () => {});
    expect(slot("ic-figure")!.getAttribute("data-ic-mode")).toBe("dark");
  });
});

describe("Figure: states", () => {
  it("loading shows a labelled skeleton instead of the children", () => {
    render(
      <Figure status="loading" height={200}>
        <div data-testid="plot" />
      </Figure>,
    );
    const skeleton = screen.getByRole("status");
    expect(skeleton.getAttribute("aria-label")).toBe("Loading chart");
    expect((skeleton as HTMLElement).style.height).toBe("200px");
    expect(screen.queryByTestId("plot")).toBeNull();
  });

  it("error shows the error message as an alert", () => {
    render(
      <Figure status="error" error={new Error("https://x/y.csv responded 404 Not Found")}>
        <div data-testid="plot" />
      </Figure>,
    );
    expect(screen.getByRole("alert").textContent).toBe("https://x/y.csv responded 404 Not Found");
    expect(screen.queryByTestId("plot")).toBeNull();
  });

  it("error without an Error object still says something useful", () => {
    render(<Figure status="error" />);
    expect(screen.getByRole("alert").textContent).toBe("This chart could not load its data.");
  });

  it("empty says there is no data, and is not announced as an error", () => {
    render(
      <Figure status="empty">
        <div data-testid="plot" />
      </Figure>,
    );
    expect(slot("ic-state")!.textContent).toBe("No data to show.");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByTestId("plot")).toBeNull();
  });

  it("keeps the headline and source visible in every state, so the layout does not jump", () => {
    for (const status of ["loading", "error", "empty", "ready"] as const) {
      render(<Figure status={status} title="Title" source="Src" />);
      expect(screen.getByRole("heading").textContent).toBe("Title");
      expect(slot("ic-source")).not.toBeNull();
      cleanup();
    }
  });
});

describe("Figure: legend", () => {
  it("shows a legend for two or more items", () => {
    render(<Figure legend={legend} />);
    const list = screen.getByRole("list", { name: "Legend" });
    expect(within(list).getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Solar", "Wind"]);
  });

  it("shows no legend for a single item: the title already names it", () => {
    render(<Figure legend={[legend[0]]} />);
    expect(slot("ic-legend")).toBeNull();
  });

  it("shows no legend for an empty or missing list", () => {
    render(<Figure legend={[]} />);
    expect(slot("ic-legend")).toBeNull();
  });

  it("swatches carry the series colour and are hidden from assistive tech; text stays in ink", () => {
    render(<Figure legend={legend} />);
    const items = screen.getAllByRole("listitem");
    const swatch = items[0].querySelector("span")!;
    expect(swatch.getAttribute("aria-hidden")).toBe("true");
    expect(swatch.style.background).toMatch(/rgb\(42, 120, 214\)|#2a78d6/);
    expect(items[0].style.color).toBe("");
  });

  it("marks context entries as muted", () => {
    render(<Figure legend={[legend[0], { name: "Others", color: "#c3c2b7", muted: true }]} />);
    expect(screen.getAllByRole("listitem")[1].getAttribute("style")).toContain("--_ic-muted");
  });
});

describe("Figure: data table", () => {
  const rows = [
    { country: "Norway", year: 2024, share: 0.9812, twh: 1234567.891, updated: new Date("2024-03-05T00:00:00Z"), note: null },
    { country: "Sweden", year: 2023, share: 0.6, twh: 12, updated: new Date("2024-03-06T00:00:00Z"), note: "est." },
  ];

  it("renders nothing unless `table` is set and there are rows", () => {
    const { rerender } = render(<Figure tableRows={rows} />);
    expect(slot("ic-table")).toBeNull();
    rerender(<Figure table tableRows={[]} />);
    expect(slot("ic-table")).toBeNull();
    rerender(<Figure table />);
    expect(slot("ic-table")).toBeNull();
  });

  it("renders a collapsed 'View data' table with a header cell per column", () => {
    render(<Figure table tableRows={rows} />);
    const details = slot("ic-table") as HTMLDetailsElement;
    expect(details.tagName).toBe("DETAILS");
    expect(details.open).toBe(false);
    expect(details.querySelector("summary")!.textContent).toBe("View data");
    const headers = [...details.querySelectorAll("th")];
    expect(headers.map((th) => th.textContent)).toEqual(["country", "year", "share", "twh", "updated", "note"]);
    expect(headers.every((th) => th.getAttribute("scope") === "col")).toBe(true);
    expect(details.querySelectorAll("tbody tr")).toHaveLength(2);
  });

  it("formats numbers, leaves years ungrouped, prints dates as ISO days and blanks for nulls", () => {
    render(<Figure table tableRows={rows} />);
    const cells = [...slot("ic-table")!.querySelectorAll("tbody tr")].map((tr) => [...tr.querySelectorAll("td")].map((td) => td.textContent));
    expect(cells[0]).toEqual(["Norway", "2024", "0.98", "1,234,567.89", "2024-03-05", ""]);
    expect(cells[1]).toEqual(["Sweden", "2023", "0.6", "12", "2024-03-06", "est."]);
  });

  it("right-aligns numeric columns only", () => {
    render(<Figure table tableRows={rows} />);
    const flags = [...slot("ic-table")!.querySelectorAll("th")].map((th) => th.hasAttribute("data-num"));
    expect(flags).toEqual([false, true, true, true, false, false]);
  });

  it("caps the table at 200 rows and says so", () => {
    const many = Array.from({ length: 250 }, (_, i) => ({ i }));
    render(<Figure table tableRows={many} />);
    expect(slot("ic-table")!.querySelectorAll("tbody tr")).toHaveLength(200);
    expect(slot("ic-table")!.textContent).toContain("Showing the first 200 of 250 rows");
  });

  it("stays available while the chart is empty or errored, as the exact-value path", () => {
    render(<Figure table tableRows={rows} status="error" />);
    expect(slot("ic-table")).not.toBeNull();
  });
});

describe("Figure: export menu", () => {
  const items = () => screen.queryAllByRole("menuitem").map((b) => b.textContent);

  it("is absent by default", () => {
    render(<Figure />);
    expect(slot("ic-actions")).toBeNull();
  });

  it("exportable={true} offers PNG, SVG, PDF and CSV", () => {
    render(<Figure exportable />);
    expect(items()).toEqual(["PNG", "SVG", "PDF", "CSV"]);
    expect(slot("ic-actions")!.querySelector("summary")!.getAttribute("aria-label")).toBe("Export chart");
  });

  it("a format list offers exactly those formats, in order", () => {
    render(<Figure exportable={["csv", "json", "jpeg"]} />);
    expect(items()).toEqual(["CSV", "JSON", "JPEG"]);
  });

  it("an empty list or false hides the menu", () => {
    const { rerender } = render(<Figure exportable={[]} />);
    expect(slot("ic-actions")).toBeNull();
    rerender(<Figure exportable={false} />);
    expect(slot("ic-actions")).toBeNull();
  });

  it("clicking a format calls onExport with it and closes the menu", () => {
    const onExport = vi.fn();
    render(<Figure exportable onExport={onExport} />);
    const details = slot("ic-actions") as HTMLDetailsElement;
    details.setAttribute("open", "");
    fireEvent.click(screen.getByRole("menuitem", { name: "SVG" }));
    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onExport).toHaveBeenCalledWith("svg");
    expect(details.hasAttribute("open")).toBe(false);
  });

  it("is hidden until the chart is ready: there is nothing to export while loading, empty or errored", () => {
    for (const status of ["loading", "error", "empty"] as const) {
      render(<Figure exportable status={status} />);
      expect(slot("ic-actions"), status).toBeNull();
      cleanup();
    }
  });

  it("inherits the provider default and lets the figure override it", () => {
    render(
      <InsightProvider exportable={["png"]}>
        <Figure />
      </InsightProvider>,
    );
    expect(items()).toEqual(["PNG"]);
    cleanup();
    render(
      <InsightProvider exportable>
        <Figure exportable={false} />
      </InsightProvider>,
    );
    expect(slot("ic-actions")).toBeNull();
  });

  it("reserves room in the header so the button never covers the title", () => {
    render(<Figure exportable title="A long headline" />);
    expect((slot("ic-header") as HTMLElement).style.paddingRight).not.toBe("");
  });
});
