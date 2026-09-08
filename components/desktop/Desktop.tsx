"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { computeRects } from "@/lib/wm/layout";
import { initialState, wmReducer } from "@/lib/wm/store";
import type { AppId, Direction, Rect, WindowId } from "@/lib/wm/types";
import { useTheme } from "@/lib/use-theme";
import { TOUCH_QUERY, useMediaQuery } from "@/lib/wm/use-media";
import { WmProvider } from "./wm-context";
import Bar from "./Bar";
import WindowFrame from "./WindowFrame";
import Launcher from "./Launcher";
import Cheatsheet from "./Cheatsheet";
import Nekopet from "./Nekopet";
import Dock from "./Dock";

const GAP = 10;

const DIR_KEYS: Record<string, Direction> = {
  h: "left",
  j: "down",
  k: "up",
  l: "right",
  arrowleft: "left",
  arrowdown: "down",
  arrowup: "up",
  arrowright: "right",
};

export default function Desktop({
  onExit,
  initialApps,
}: {
  onExit: () => void;
  initialApps: AppId[];
}) {
  const [initial] = useState(() => initialState(initialApps));
  const [state, dispatch] = useReducer(wmReducer, initial);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [launcher, setLauncher] = useState(false);
  const [keys, setKeys] = useState(false);
  const [petOn, setPetOn] = useState(true);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [bootedAt] = useState(() => Date.now());
  const { toggle: toggleTheme } = useTheme();
  const touch = useMediaQuery(TOUCH_QUERY);

  // The terminal that opens with the session types its first command by
  // itself, so the page is doing something the moment it loads.
  const autoTerminal = useMemo(
    () => Object.values(initial.windows).find((w) => w.app === "terminal")?.id ?? null,
    [initial],
  );

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ws = state.workspace;
  const tree = state.trees[ws];
  const focused = state.focus[ws];
  const fullscreen = state.fullscreen[ws];

  const rects = useMemo(() => {
    if (!size.w || !size.h) return new Map<WindowId, Rect>();

    // No keyboard means no split management, so a touch session shows one
    // window at a time and the dock does the switching.
    if (touch) {
      const only = new Map<WindowId, Rect>();
      if (focused) {
        only.set(focused, { x: GAP, y: GAP, w: size.w - GAP * 2, h: size.h - GAP * 2 });
      }
      return only;
    }

    return computeRects(tree, { x: GAP, y: GAP, w: size.w - GAP * 2, h: size.h - GAP * 2 }, GAP);
  }, [tree, size.w, size.h, touch, focused]);

  const openApp = useCallback(
    (app: AppId) => dispatch({ type: "open", app, rects }),
    [rects],
  );

  const close = useCallback((id?: WindowId) => dispatch({ type: "close", id }), []);
  const togglePet = useCallback(() => setPetOn((on) => !on), []);
  const showKeys = useCallback(() => setKeys(true), []);
  const showLauncher = useCallback(() => setLauncher(true), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();

      if (key === "escape") {
        if (launcher || keys) {
          e.preventDefault();
          setLauncher(false);
          setKeys(false);
        }
        return;
      }

      const mod = e.altKey || e.metaKey;
      if (!mod) return;

      // Workspaces: SUPER+1..5, with shift to carry the window along.
      if (/^[1-5]$/.test(e.key)) {
        e.preventDefault();
        const index = Number(e.key) - 1;
        dispatch(e.shiftKey ? { type: "move-to-workspace", index } : { type: "workspace", index });
        return;
      }

      const dir = DIR_KEYS[key];
      if (dir) {
        e.preventDefault();
        if (e.shiftKey) dispatch({ type: "swap-dir", dir, rects });
        else if (e.ctrlKey) dispatch({ type: "resize", dir });
        else dispatch({ type: "focus-dir", dir, rects });
        return;
      }

      switch (key) {
        case "enter":
          e.preventDefault();
          dispatch({ type: "open", app: "terminal", rects });
          break;
        case "q":
          e.preventDefault();
          dispatch({ type: "close" });
          break;
        case "f":
          e.preventDefault();
          dispatch({ type: "toggle-fullscreen" });
          break;
        case "v":
          e.preventDefault();
          dispatch({
            type: "toggle-float",
            rect: focused ? rects.get(focused) : undefined,
            bounds: size,
          });
          break;
        case "d":
          e.preventDefault();
          setLauncher((open) => !open);
          break;
        case "t":
          e.preventDefault();
          toggleTheme();
          break;
        case "p":
          e.preventDefault();
          setPetOn((on) => !on);
          break;
        case "/":
          e.preventDefault();
          setKeys((open) => !open);
          break;
        case "e":
          if (e.shiftKey) {
            e.preventDefault();
            onExit();
          }
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rects, focused, launcher, keys, size, toggleTheme, onExit]);

  const visible = Object.values(state.windows).filter((w) => w.workspace === ws);
  const ordered = [...visible].sort(
    (a, b) => state.zorder.indexOf(a.id) - state.zorder.indexOf(b.id),
  );

  const api = useMemo(
    () => ({
      state,
      dispatch,
      openApp,
      close,
      exit: onExit,
      toggleTheme,
      togglePet,
      showKeys,
      showLauncher,
      petOn,
      bootedAt,
    }),
    [
      state,
      openApp,
      close,
      onExit,
      toggleTheme,
      togglePet,
      showKeys,
      showLauncher,
      petOn,
      bootedAt,
    ],
  );

  return (
    <WmProvider value={api}>
      <div className="flex h-full w-full flex-col overflow-hidden">
        <Bar />
        <div ref={surfaceRef} className="relative min-h-0 flex-1">
          {petOn && <Nekopet size={size} />}

          {!visible.length && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="font-mono-tight text-[11px] tracking-[0.14em] text-ink-3 uppercase">
                Workspace {ws + 1} · empty
              </p>
              <p className="font-mono-tight text-[12.5px] text-ink-3">
                {touch ? (
                  "tap + below to open something"
                ) : (
                  <>
                    <Key>SUPER</Key> + <Key>D</Key> to open something
                  </>
                )}
              </p>
            </div>
          )}

          <AnimatePresence>
            {ordered.map((win) => {
              const isFullscreen = fullscreen === win.id;
              const rect = isFullscreen
                ? { x: 0, y: 0, w: size.w, h: size.h }
                : win.floating
                  ? (win.float ?? { x: 80, y: 80, w: 480, h: 320 })
                  : rects.get(win.id);
              if (!rect) return null;

              return (
                <WindowFrame
                  key={win.id}
                  win={win}
                  rect={rect}
                  focused={focused === win.id}
                  fullscreen={isFullscreen}
                  bounds={size}
                  autoRun={win.id === autoTerminal ? "neofetch" : undefined}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {touch && <Dock windows={visible} />}

        <AnimatePresence>
          {launcher && <Launcher key="launcher" onClose={() => setLauncher(false)} />}
          {keys && <Cheatsheet key="keys" onClose={() => setKeys(false)} />}
        </AnimatePresence>
      </div>
    </WmProvider>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-paper-2 px-1.5 py-0.5 font-mono-tight text-[10.5px] text-ink-2">
      {children}
    </kbd>
  );
}
