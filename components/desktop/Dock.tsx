"use client";

import { LuPlus, LuX } from "react-icons/lu";
import { APP_META } from "@/lib/wm/store";
import type { WmWindow } from "@/lib/wm/types";
import { useWm } from "./wm-context";
import { APP_ICON } from "./app-icons";

/**
 * Touch sessions get a dock instead of keybinds: every open window is one tap
 * away, and the launcher covers everything that is not open yet.
 */
export default function Dock({ windows }: { windows: WmWindow[] }) {
  const { state, dispatch, showLauncher, close } = useWm();
  const focused = state.focus[state.workspace];

  return (
    <div className="flex h-[54px] shrink-0 items-center gap-2 border-t border-line bg-paper-2/85 px-2.5 backdrop-blur-xl">
      <button
        type="button"
        onClick={showLauncher}
        aria-label="Open an app"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-paper text-ink-2 active:border-accent-2 active:text-accent-2"
      >
        <LuPlus size={15} aria-hidden="true" />
      </button>

      <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
        {windows.map((win) => {
          const active = win.id === focused;
          const Icon = APP_ICON[win.app];
          return (
            <span
              key={win.id}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg border py-1.5 pr-1.5 pl-2.5 transition-colors duration-200 ${
                active
                  ? "border-accent-2 bg-paper text-ink"
                  : "border-line bg-paper/70 text-ink-3"
              }`}
            >
              <button
                type="button"
                onClick={() => dispatch({ type: "focus", id: win.id })}
                className="flex items-center gap-1.5 font-mono-tight text-[11px] tracking-[0.08em] uppercase"
              >
                <Icon size={12} aria-hidden="true" />
                {APP_META[win.app].label}
              </button>
              <button
                type="button"
                onClick={() => close(win.id)}
                aria-label={`Close ${win.title}`}
                className="flex h-4 w-4 items-center justify-center rounded text-ink-3"
              >
                <LuX size={10} aria-hidden="true" />
              </button>
            </span>
          );
        })}

        {!windows.length && (
          <span className="font-mono-tight text-[11px] text-ink-3">
            nothing open · tap +
          </span>
        )}
      </div>
    </div>
  );
}
