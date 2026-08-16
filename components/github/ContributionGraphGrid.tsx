"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import HorizontalScroll from "./HorizontalScroll";
import type { ContributionDay } from "@/lib/github";

function useCountUp(target: number, skip: boolean, duration = 900) {
  const [value, setValue] = useState(skip ? target : 0);
  const started = useRef(false);

  useEffect(() => {
    if (skip || started.current || target <= 0) {
      setValue(target);
      return;
    }
    started.current = true;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * easeOutCubic(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, skip, duration]);

  return value;
}

type Cell = ContributionDay | null;

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LEVEL_BG = [
  "var(--gh-empty)",
  "color-mix(in oklch, var(--accent-2) 40%, transparent)",
  "color-mix(in oklch, var(--accent-2) 65%, transparent)",
  "color-mix(in oklch, var(--accent-2) 88%, transparent)",
  "var(--accent-2)",
];
const LEVEL_GLOW = [
  "none",
  "none",
  "0 0 3px color-mix(in oklch, var(--accent-2) 25%, transparent)",
  "0 0 5px color-mix(in oklch, var(--accent-2) 45%, transparent)",
  "0 0 8px color-mix(in oklch, var(--accent-2) 65%, transparent)",
];

function formatDay(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

export default function ContributionGraphGrid({
  weeks,
  monthLabels,
  today,
  total,
  currentStreak,
  longestStreak,
  lastShipped,
}: {
  weeks: Cell[][];
  monthLabels: string[];
  today: string;
  total: number;
  currentStreak: number;
  longestStreak: number;
  lastShipped?: { message: string; repo: string; timeAgo: string; url: string } | null;
}) {
  const [hovered, setHovered] = useState<ContributionDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const displayTotal = useCountUp(total, Boolean(prefersReducedMotion));

  return (
    <>
      <div className="flex gap-1.5">
        <div className="flex flex-col gap-1 pt-[18px] font-mono-tight text-[10px] text-ink-3">
          {WEEKDAY_LABELS.map((label, i) => (
            <span key={i} className="h-2.75 leading-[11px]">
              {label}
            </span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          <HorizontalScroll
            scrollToSelector="[data-today]"
            className="overflow-x-auto pt-5 no-scrollbar"
          >
            <div
              className="grid gap-1 pl-6 pr-8"
              style={{
                gridTemplateColumns: `repeat(${weeks.length + 1}, minmax(11px, 1fr))`,
                gridTemplateRows: "14px repeat(7, 11px)",
              }}
              onMouseLeave={() => {
                setHovered(null);
                setTooltipPos(null);
              }}
            >
              {monthLabels.map(
                (label, wi) =>
                  label && (
                    <span
                      key={`m-${wi}`}
                      className="text-left font-mono-tight text-[10px] text-ink-3"
                      style={{ gridColumn: wi + 1, gridRow: 1 }}
                    >
                      {label}
                    </span>
                  )
              )}
              {weeks.map((week, wi) =>
                week.map((cell, di) => {
                  const level = cell?.level ?? 0;
                  const title = cell
                    ? cell.count > 0
                      ? `${cell.count} contribution${cell.count > 1 ? "s" : ""} on ${formatDay(cell.date)}`
                      : `No contributions on ${formatDay(cell.date)}`
                    : "";
                  const style = {
                    gridColumn: wi + 1,
                    gridRow: di + 2,
                    background: cell ? LEVEL_BG[level] : "transparent",
                    boxShadow: cell ? LEVEL_GLOW[level] : "none",
                  } as React.CSSProperties;

                  if (!cell) {
                    return <span key={`${wi}-${di}`} style={style} className="rounded-[2px]" />;
                  }

                  const isToday = cell.date === today;
                  const showTooltipAt = (target: HTMLElement) => {
                    const rect = target.getBoundingClientRect();
                    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                  };
                  return (
                    <motion.button
                      key={`${wi}-${di}`}
                      type="button"
                      aria-label={title}
                      data-today={isToday || undefined}
                      onMouseEnter={(e) => {
                        setHovered(cell);
                        showTooltipAt(e.currentTarget);
                      }}
                      onFocus={(e) => {
                        setHovered(cell);
                        showTooltipAt(e.currentTarget);
                      }}
                      onClick={(e) => {
                        setHovered(cell);
                        showTooltipAt(e.currentTarget);
                      }}
                      style={{
                        ...style,
                        ...(isToday && {
                          outline: "1.5px solid var(--accent-2)",
                          outlineOffset: "1.5px",
                        }),
                      }}
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.6, zIndex: 10 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 1.3 }}
                      transition={{ type: "spring", stiffness: 600, damping: 20 }}
                      className="relative cursor-pointer appearance-none rounded-[2px] border-0 p-0 will-change-transform"
                    />
                  );
                })
              )}
            </div>
          </HorizontalScroll>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-paper to-transparent"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-paper to-transparent"
          />
        </div>
      </div>

      {lastShipped && (
        <div className="flex min-w-0 items-center gap-1 pt-4 font-mono-tight text-[11px] text-ink-3">
          <span className="shrink-0">last shipped:</span>{" "}
          <a
            href={lastShipped.url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-ink-2 transition-colors duration-150 hover:text-accent-2"
          >
            {lastShipped.message}
          </a>{" "}
          <span className="shrink-0 text-accent-2">&#8594; {lastShipped.repo}</span>
          <span className="shrink-0">, {lastShipped.timeAgo}</span>
        </div>
      )}

      {hovered &&
        tooltipPos &&
        createPortal(
          <div
            className="fixed z-50 pointer-events-none rounded-md border px-2.5 py-1.5 font-mono-tight text-[10.5px] whitespace-nowrap"
            style={{
              left: Math.min(Math.max(tooltipPos.x, 70), window.innerWidth - 70),
              top: tooltipPos.y - 44,
              transform: "translateX(-50%)",
              borderColor: "var(--accent-2)",
              background: "var(--paper-2)",
              color: "var(--ink-2)",
            }}
          >
            <span className="font-bold" style={{ color: "var(--accent-text)" }}>
              {hovered.count}
            </span>{" "}
            {hovered.count === 1 ? "contribution" : "contributions"} &middot; {formatDay(hovered.date)}
          </div>,
          document.body
        )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4 font-mono-tight text-[11.5px] text-ink-3">
        <div className="relative flex h-[1.4em] min-w-0 flex-1 items-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {hovered ? (
              <motion.span
                key={hovered.date}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                className="absolute whitespace-nowrap"
              >
                <span className="font-bold text-accent-text">{hovered.count}</span>{" "}
                contribution{hovered.count === 1 ? "" : "s"}{" "}
                <span className="text-ink-2">on {formatDay(hovered.date)}</span>
              </motion.span>
            ) : (
              <motion.span
                key="total"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                className="absolute flex items-center gap-0 whitespace-nowrap"
              >
                <span className="font-bold text-accent-text">{displayTotal}</span>
                <span className="mx-1">this year</span>
                {currentStreak > 0 && (
                  <>
                    <span className="mx-1.5 text-line">&middot;</span>
                    <span className="font-bold text-ink">{currentStreak}d</span>
                    <span className="mx-1">streak</span>
                  </>
                )}
                {longestStreak > 0 && (
                  <>
                    <span className="mx-1.5 text-line">&middot;</span>
                    <span className="text-ink-3">{longestStreak}d best</span>
                  </>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono-tight text-[10.5px] text-ink-3">
          less
          {LEVEL_BG.map((bg, i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: bg }} />
          ))}
          more
        </span>
      </div>
    </>
  );
}
