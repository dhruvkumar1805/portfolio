import {
  axisOf,
  insertLeaf,
  leafIds,
  neighbor,
  removeLeaf,
  resizeLeaf,
  splitDirFor,
  swapLeaves,
} from "./layout";
import type { AppId, Direction, Rect, WindowId, WmState } from "./types";
import { WORKSPACES } from "./types";

export const APP_META: Record<AppId, { title: string; label: string; hint: string }> = {
  about: { title: "about.md", label: "about", hint: "Who I am, in one window" },
  projects: { title: "projects/", label: "projects", hint: "Four things I shipped" },
  work: { title: "work.log", label: "work", hint: "Where I have been paid to build" },
  stack: { title: "stack.toml", label: "stack", hint: "Tools I actually reach for" },
  contact: { title: "contact", label: "contact", hint: "Email, socials, résumé" },
  resume: { title: "resume.pdf", label: "resume", hint: "The PDF, inline" },
  terminal: { title: "dhruv@arch:~", label: "terminal", hint: "A shell that answers back" },
};

/** Apps that toggle to the existing window instead of opening a second copy. */
const SINGLETON: AppId[] = ["about", "projects", "work", "stack", "contact", "resume"];

export type WmAction =
  | { type: "open"; app: AppId; rects?: Map<WindowId, Rect> }
  | { type: "close"; id?: WindowId }
  | { type: "focus"; id: WindowId }
  | { type: "focus-dir"; dir: Direction; rects: Map<WindowId, Rect> }
  | { type: "swap-dir"; dir: Direction; rects: Map<WindowId, Rect> }
  | { type: "resize"; dir: Direction }
  | { type: "workspace"; index: number }
  | { type: "move-to-workspace"; index: number }
  | { type: "toggle-fullscreen" }
  | { type: "toggle-float"; rect?: Rect; bounds?: { w: number; h: number } }
  | { type: "move-float"; id: WindowId; x: number; y: number }
  | { type: "resize-float"; id: WindowId; w: number; h: number }
  | { type: "raise"; id: WindowId };

export function initialState(apps: AppId[] = ["about", "terminal"]): WmState {
  let state: WmState = {
    windows: {},
    trees: Array.from({ length: WORKSPACES }, () => null),
    workspace: 0,
    focus: Array.from({ length: WORKSPACES }, () => null),
    fullscreen: Array.from({ length: WORKSPACES }, () => null),
    zorder: [],
    seq: 1,
  };
  for (const app of apps) state = wmReducer(state, { type: "open", app });
  return state;
}

const replaceAt = <T,>(arr: T[], index: number, value: T): T[] =>
  arr.map((v, i) => (i === index ? value : v));

function tiledIds(state: WmState, ws: number): WindowId[] {
  return leafIds(state.trees[ws]);
}

function windowsOn(state: WmState, ws: number): WindowId[] {
  return Object.values(state.windows)
    .filter((w) => w.workspace === ws)
    .map((w) => w.id);
}

export function wmReducer(state: WmState, action: WmAction): WmState {
  const ws = state.workspace;
  const focused = state.focus[ws];

  switch (action.type) {
    case "open": {
      if (SINGLETON.includes(action.app)) {
        const existing = Object.values(state.windows).find(
          (w) => w.app === action.app && w.workspace === ws,
        );
        if (existing) {
          return { ...state, focus: replaceAt(state.focus, ws, existing.id) };
        }
      }

      const id = `w${state.seq}`;
      const dir = splitDirFor(focused ? action.rects?.get(focused) : undefined);

      return {
        ...state,
        seq: state.seq + 1,
        windows: {
          ...state.windows,
          [id]: {
            id,
            app: action.app,
            title: APP_META[action.app].title,
            workspace: ws,
            floating: false,
          },
        },
        trees: replaceAt(state.trees, ws, insertLeaf(state.trees[ws], focused, id, dir)),
        focus: replaceAt(state.focus, ws, id),
        fullscreen: replaceAt(state.fullscreen, ws, null),
        zorder: [...state.zorder, id],
      };
    }

    case "close": {
      const id = action.id ?? focused;
      if (!id) return state;
      const win = state.windows[id];
      if (!win) return state;

      const target = win.workspace;
      const rest = { ...state.windows };
      delete rest[id];

      const tree = win.floating
        ? state.trees[target]
        : removeLeaf(state.trees[target], id);

      const survivors = win.floating
        ? windowsOn({ ...state, windows: rest }, target)
        : leafIds(tree);

      return {
        ...state,
        windows: rest,
        trees: replaceAt(state.trees, target, tree),
        focus: replaceAt(
          state.focus,
          target,
          state.focus[target] === id ? (survivors[survivors.length - 1] ?? null) : state.focus[target],
        ),
        fullscreen: replaceAt(
          state.fullscreen,
          target,
          state.fullscreen[target] === id ? null : state.fullscreen[target],
        ),
        zorder: state.zorder.filter((z) => z !== id),
      };
    }

    case "focus": {
      const win = state.windows[action.id];
      if (!win) return state;
      return {
        ...state,
        focus: replaceAt(state.focus, win.workspace, action.id),
        zorder: [...state.zorder.filter((z) => z !== action.id), action.id],
      };
    }

    case "focus-dir": {
      if (!focused) return state;
      const next = neighbor(action.rects, focused, action.dir);
      if (!next) return state;
      return {
        ...state,
        focus: replaceAt(state.focus, ws, next),
        zorder: [...state.zorder.filter((z) => z !== next), next],
      };
    }

    case "swap-dir": {
      if (!focused || state.windows[focused]?.floating) return state;
      const other = neighbor(action.rects, focused, action.dir);
      if (!other || state.windows[other]?.floating) return state;
      return {
        ...state,
        trees: replaceAt(state.trees, ws, swapLeaves(state.trees[ws], focused, other)),
      };
    }

    case "resize": {
      if (!focused || state.windows[focused]?.floating) return state;
      const axis = axisOf(action.dir);
      const grow = action.dir === "right" || action.dir === "down";
      const amount = grow ? 0.04 : -0.04;
      return {
        ...state,
        trees: replaceAt(state.trees, ws, resizeLeaf(state.trees[ws], focused, axis, amount)),
      };
    }

    case "workspace": {
      if (action.index === ws || action.index < 0 || action.index >= WORKSPACES) return state;
      return { ...state, workspace: action.index };
    }

    case "move-to-workspace": {
      if (!focused || action.index === ws || action.index < 0 || action.index >= WORKSPACES) {
        return state;
      }
      const win = state.windows[focused];
      const from = win.floating ? state.trees[ws] : removeLeaf(state.trees[ws], focused);
      const survivors = win.floating ? windowsOn(state, ws).filter((i) => i !== focused) : leafIds(from);
      const targetFocus = state.focus[action.index];

      let trees = replaceAt(state.trees, ws, from);
      if (!win.floating) {
        trees = replaceAt(
          trees,
          action.index,
          insertLeaf(
            trees[action.index],
            targetFocus,
            focused,
            splitDirFor(undefined),
          ),
        );
      }

      return {
        ...state,
        windows: {
          ...state.windows,
          [focused]: { ...win, workspace: action.index },
        },
        trees,
        focus: replaceAt(
          replaceAt(state.focus, ws, survivors[survivors.length - 1] ?? null),
          action.index,
          focused,
        ),
        fullscreen: replaceAt(state.fullscreen, ws, null),
      };
    }

    case "toggle-fullscreen": {
      if (!focused) return state;
      return {
        ...state,
        fullscreen: replaceAt(
          state.fullscreen,
          ws,
          state.fullscreen[ws] === focused ? null : focused,
        ),
      };
    }

    case "toggle-float": {
      if (!focused) return state;
      const win = state.windows[focused];

      if (win.floating) {
        return {
          ...state,
          windows: { ...state.windows, [focused]: { ...win, floating: false, float: undefined } },
          trees: replaceAt(
            state.trees,
            ws,
            insertLeaf(state.trees[ws], tiledIds(state, ws)[0] ?? null, focused, "h"),
          ),
        };
      }

      const seed = action.rect ?? { x: 120, y: 120, w: 520, h: 360 };
      const bounds = action.bounds;
      const w = Math.max(300, Math.min(seed.w, 640));
      const h = Math.max(220, Math.min(seed.h, 460));
      const float: Rect = {
        x: bounds ? Math.max(10, Math.min(seed.x + 18, bounds.w - w - 10)) : seed.x + 18,
        y: bounds ? Math.max(10, Math.min(seed.y + 18, bounds.h - h - 10)) : seed.y + 18,
        w,
        h,
      };

      return {
        ...state,
        windows: {
          ...state.windows,
          [focused]: { ...win, floating: true, float },
        },
        trees: replaceAt(state.trees, ws, removeLeaf(state.trees[ws], focused)),
        fullscreen: replaceAt(state.fullscreen, ws, null),
        zorder: [...state.zorder.filter((z) => z !== focused), focused],
      };
    }

    case "move-float": {
      const win = state.windows[action.id];
      if (!win?.float) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...win, float: { ...win.float, x: action.x, y: action.y } },
        },
      };
    }

    case "resize-float": {
      const win = state.windows[action.id];
      if (!win?.float) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            float: {
              ...win.float,
              w: Math.max(260, action.w),
              h: Math.max(180, action.h),
            },
          },
        },
      };
    }

    case "raise": {
      return { ...state, zorder: [...state.zorder.filter((z) => z !== action.id), action.id] };
    }

    default:
      return state;
  }
}
