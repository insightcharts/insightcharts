import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Scrolly, type StoryState, type StoryStep } from "../src/story/scrolly";
import { stubCanvas } from "./helpers";

beforeAll(stubCanvas);
afterEach(cleanup);

type Step = StoryStep & { highlight?: string };
const steps: Step[] = [
  { id: "all", content: "All sources.", highlight: undefined },
  { id: "solar", content: "Solar is smallest.", highlight: "Solar" },
  { id: "asia", content: "Asia dominates.", highlight: "Asia" },
];

function mount(props: Partial<React.ComponentProps<typeof Scrolly<Step>>> = {}) {
  const states: StoryState<Step>[] = [];
  const view = render(
    <Scrolly<Step> steps={steps} mode="steps" {...props}>
      {(state) => {
        states.push(state);
        return <div data-testid="graphic">{`${state.index}:${state.step.highlight ?? "none"}`}</div>;
      }}
    </Scrolly>,
  );
  return { states, view };
}
const next = () => screen.getByRole("button", { name: "Next" }) as HTMLButtonElement;
const previous = () => screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement;
const narration = () => document.querySelector('[data-slot="ic-scrolly-step"]')!.textContent;
const graphic = () => screen.getByTestId("graphic").textContent;

describe("Scrolly: steps mode", () => {
  it("starts on the first step, with its narration and graphic state", () => {
    const { states } = mount();
    expect(graphic()).toBe("0:none");
    expect(narration()).toBe("All sources.");
    expect(states.at(-1)).toMatchObject({ index: 0, count: 3, progress: 0, step: steps[0] });
    expect(document.querySelector('[data-slot="ic-scrolly"]')!.getAttribute("data-mode")).toBe("steps");
  });

  it("Next and Previous move one step and update graphic and narration together", () => {
    mount();
    fireEvent.click(next());
    expect(graphic()).toBe("1:Solar");
    expect(narration()).toBe("Solar is smallest.");
    fireEvent.click(next());
    expect(graphic()).toBe("2:Asia");
    fireEvent.click(previous());
    expect(graphic()).toBe("1:Solar");
    expect(narration()).toBe("Solar is smallest.");
  });

  it("disables Previous on the first step and Next on the last", () => {
    mount();
    expect(previous().disabled).toBe(true);
    expect(next().disabled).toBe(false);
    fireEvent.click(next());
    expect(previous().disabled).toBe(false);
    expect(next().disabled).toBe(false);
    fireEvent.click(next());
    expect(next().disabled).toBe(true);
    expect(previous().disabled).toBe(false);
  });

  it("calls onStepChange with the new index and step, once per move", () => {
    const onStepChange = vi.fn();
    mount({ onStepChange });
    expect(onStepChange).not.toHaveBeenCalled();
    fireEvent.click(next());
    expect(onStepChange).toHaveBeenCalledTimes(1);
    expect(onStepChange).toHaveBeenLastCalledWith(1, steps[1]);
    fireEvent.click(previous());
    expect(onStepChange).toHaveBeenLastCalledWith(0, steps[0]);
    expect(onStepChange).toHaveBeenCalledTimes(2);
  });

  it("arrow keys move within bounds and never fire onStepChange past either end", () => {
    const onStepChange = vi.fn();
    mount({ onStepChange });
    const root = document.querySelector('[data-slot="ic-scrolly"]')!;
    fireEvent.keyDown(root, { key: "ArrowLeft" });
    expect(graphic()).toBe("0:none");
    expect(onStepChange).not.toHaveBeenCalled();
    fireEvent.keyDown(root, { key: "ArrowRight" });
    fireEvent.keyDown(root, { key: "ArrowRight" });
    expect(graphic()).toBe("2:Asia");
    fireEvent.keyDown(root, { key: "ArrowRight" });
    fireEvent.keyDown(root, { key: "ArrowRight" });
    expect(graphic()).toBe("2:Asia");
    expect(onStepChange).toHaveBeenCalledTimes(2);
  });

  it("announces the position for screen readers", () => {
    mount();
    expect(screen.getByText("Step 1 of 3")).toBeTruthy();
    fireEvent.click(next());
    expect(screen.getByText("Step 2 of 3")).toBeTruthy();
    expect(document.querySelector('[data-slot="ic-scrolly-step"]')!.getAttribute("aria-live")).toBe("polite");
  });

  it("controlled: `index` decides the step; clicks only report through onStepChange", () => {
    const onStepChange = vi.fn();
    const { view } = mount({ index: 1, onStepChange });
    expect(graphic()).toBe("1:Solar");
    fireEvent.click(next());
    expect(onStepChange).toHaveBeenLastCalledWith(2, steps[2]);
    expect(graphic()).toBe("1:Solar");
    view.rerender(
      <Scrolly<Step> steps={steps} mode="steps" index={2} onStepChange={onStepChange}>
        {(state) => <div data-testid="graphic">{`${state.index}:${state.step.highlight ?? "none"}`}</div>}
      </Scrolly>,
    );
    expect(graphic()).toBe("2:Asia");
    expect(next().disabled).toBe(true);
  });

  it("clamps an out-of-range controlled index instead of crashing on a missing step", () => {
    mount({ index: 99 });
    expect(graphic()).toBe("2:Asia");
    cleanup();
    mount({ index: -5 });
    expect(graphic()).toBe("0:none");
  });

  it("stays on a valid step when the list of steps shrinks", () => {
    const { view } = mount();
    fireEvent.click(next());
    fireEvent.click(next());
    view.rerender(
      <Scrolly<Step> steps={steps.slice(0, 1)} mode="steps">
        {(state) => <div data-testid="graphic">{`${state.index}:${state.step.highlight ?? "none"}`}</div>}
      </Scrolly>,
    );
    expect(graphic()).toBe("0:none");
  });

  it("renders nothing for the graphic, without throwing, when there are no steps", () => {
    const children = vi.fn(() => <div data-testid="graphic" />);
    expect(() => render(<Scrolly steps={[]} mode="steps">{children}</Scrolly>)).not.toThrow();
    expect(children).not.toHaveBeenCalled();
    expect(screen.queryByTestId("graphic")).toBeNull();
  });

  it("with no steps, neither button is enabled and the position does not read 'Step 0 of 0'", () => {
    render(<Scrolly steps={[]} mode="steps">{() => null}</Scrolly>);
    expect(previous().disabled).toBe(true);
    expect(next().disabled).toBe(true);
    expect(screen.queryByText("Step 0 of 0")).toBeNull();
  });
});

describe("Scrolly: scroll mode in a non-layout environment", () => {
  it("keeps every step's text in the document, so the story reads without scripting", () => {
    render(
      <Scrolly steps={steps} mode="scroll">
        {(state) => <div data-testid="graphic">{state.index}</div>}
      </Scrolly>,
    );
    const sections = [...document.querySelectorAll('[data-slot="ic-scrolly-step"]')];
    expect(sections.map((s) => s.textContent)).toEqual(steps.map((s) => s.content));
    expect(sections.map((s) => s.id)).toEqual(["all", "solar", "asia"]);
    expect(sections.filter((s) => s.hasAttribute("data-active"))).toHaveLength(1);
  });
});
