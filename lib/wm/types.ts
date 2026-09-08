export type AppId =
  | "about"
  | "projects"
  | "work"
  | "stack"
  | "contact"
  | "resume"
  | "terminal";

export type WindowId = string;

export type Rect = { x: number; y: number; w: number; h: number };

export type Axis = "h" | "v";

export type Direction = "left" | "right" | "up" | "down";

/**
 * The tiling tree, the same shape a real dwindle layout keeps: every internal
 * node is a split with a ratio, every leaf is one window.
 */
export type Node =
  | { kind: "leaf"; id: WindowId }
  | { kind: "split"; dir: Axis; ratio: number; a: Node; b: Node };

export type WmWindow = {
  id: WindowId;
  app: AppId;
  title: string;
  workspace: number;
  floating: boolean;
  /** Only set while floating. */
  float?: Rect;
};

export type WmState = {
  windows: Record<WindowId, WmWindow>;
  /** One tiling tree per workspace. */
  trees: (Node | null)[];
  workspace: number;
  /** Focused window per workspace. */
  focus: (WindowId | null)[];
  /** Fullscreened window per workspace. */
  fullscreen: (WindowId | null)[];
  /** Stacking order for floating windows, last is on top. */
  zorder: WindowId[];
  seq: number;
};

export const WORKSPACES = 5;
