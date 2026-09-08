"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuX } from "react-icons/lu";
import type { Rect, WmWindow } from "@/lib/wm/types";
import { useWm } from "./wm-context";
import { APP_ICON } from "./app-icons";
import AppContent from "./apps/AppContent";

export default function WindowFrame({
  win,
  rect,
  focused,
  fullscreen,
  bounds,
  autoRun,
}: {
  win: WmWindow;
  rect: Rect;
  focused: boolean;
  fullscreen: boolean;
  bounds: { w: number; h: number };
  autoRun?: string;
}) {
  const { dispatch, close } = useWm();
  const reduce = useReducedMotion();
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const resize = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const Icon = APP_ICON[win.app];

  function focus() {
    if (!focused) dispatch({ type: "focus", id: win.id });
  }

  function onTitlePointerDown(e: React.PointerEvent) {
    focus();
    if (!win.floating || fullscreen) return;
    drag.current = { dx: e.clientX - rect.x, dy: e.clientY - rect.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function onTitlePointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    dispatch({
      type: "move-float",
      id: win.id,
      x: Math.max(0, Math.min(bounds.w - 80, e.clientX - drag.current.dx)),
      y: Math.max(0, Math.min(bounds.h - 40, e.clientY - drag.current.dy)),
    });
  }

  function onResizePointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    focus();
    resize.current = { x: e.clientX, y: e.clientY, w: rect.w, h: rect.h };
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function onResizePointerMove(e: React.PointerEvent) {
    if (!resize.current) return;
    dispatch({
      type: "resize-float",
      id: win.id,
      w: resize.current.w + (e.clientX - resize.current.x),
      h: resize.current.h + (e.clientY - resize.current.y),
    });
  }

  const endPointer = () => {
    drag.current = null;
    resize.current = null;
  };

  return (
    <motion.section
      onPointerDown={focus}
      initial={{ opacity: 0, scale: 0.965 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: rect.x,
        y: rect.y,
        width: rect.w,
        height: rect.h,
      }}
      exit={{ opacity: 0, scale: 0.965, transition: { duration: reduce ? 0 : 0.16 } }}
      transition={
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 520, damping: 44, mass: 0.7 }
      }
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: fullscreen ? 30 : win.floating ? 20 : 10,
      }}
      className={`flex flex-col overflow-hidden rounded-lg border bg-paper backdrop-blur-sm transition-[border-color,box-shadow] duration-[var(--dur)] ${
        focused
          ? "border-accent-2 shadow-[0_18px_48px_-28px_rgba(0,0,0,0.55)]"
          : "border-line shadow-none"
      }`}
      aria-label={win.title}
    >
      <header
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        className={`flex h-7 shrink-0 select-none items-center gap-2 border-b px-2.5 ${
          focused ? "border-accent-2/40 bg-paper-2" : "border-line bg-paper-2/60"
        } ${win.floating && !fullscreen ? "cursor-grab active:cursor-grabbing" : ""}`}
      >
        <Icon
          size={11}
          className={`shrink-0 ${focused ? "text-accent-2" : "text-ink-3/70"}`}
          aria-hidden="true"
        />
        <span
          className={`min-w-0 flex-1 truncate font-mono-tight text-[10.5px] font-medium tracking-[0.1em] uppercase ${
            focused ? "text-ink-2" : "text-ink-3"
          }`}
        >
          {win.title}
        </span>
        {win.floating && (
          <span className="font-mono-tight text-[9px] tracking-[0.12em] text-ink-3 uppercase">
            float
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            close(win.id);
          }}
          aria-label={`Close ${win.title}`}
          className="-mr-1 flex h-5 w-5 shrink-0 items-center justify-center rounded text-ink-3 transition-colors duration-[var(--dur)] hover:bg-accent-2/12 hover:text-accent-2"
        >
          <LuX size={11} aria-hidden="true" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden">
        <AppContent win={win} focused={focused} autoRun={autoRun} />
      </div>

      {win.floating && !fullscreen && (
        <span
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          className="absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize"
          aria-hidden="true"
        />
      )}
    </motion.section>
  );
}
