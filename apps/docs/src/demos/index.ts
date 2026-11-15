import type { ComponentType } from "react";
import ChartDirect from "./chart-direct";
import ColorModes from "./color-modes";
import CssVars from "./css-vars";
import DataShapes from "./data-shapes";
import OptionEscape from "./option-escape";
import SelectLocal from "./select-local";
import Crossfilter from "./crossfilter";
import Export from "./export";
import JsonLive from "./json-live";
import ScrollStory from "./scroll-story";
import StoryModes from "./story-modes";
import ThemeSurfaces from "./theme-surfaces";
import Theming from "./theming";

/** Hand-written demos used by the landing page and the guides. Keys are file names in this folder. */
export const demos: Record<string, ComponentType<any>> = {
  "chart-direct": ChartDirect,
  "color-modes": ColorModes,
  "css-vars": CssVars,
  "data-shapes": DataShapes,
  "option-escape": OptionEscape,
  "select-local": SelectLocal,
  crossfilter: Crossfilter,
  export: Export,
  "json-live": JsonLive,
  "scroll-story": ScrollStory,
  "story-modes": StoryModes,
  "theme-surfaces": ThemeSurfaces,
  theming: Theming,
};
