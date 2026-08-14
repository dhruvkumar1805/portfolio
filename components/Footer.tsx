"use client";

import { useEffect, useState } from "react";
import { getIstParts, moodFor } from "@/lib/ist-clock";

export default function Footer() {
  const [clock, setClock] = useState<{ time: string; mood: string } | null>(
    null
  );

  useEffect(() => {
    function tick() {
      const { hours, time } = getIstParts();
      setClock({ time, mood: moodFor(hours) });
    }
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="border-t border-line py-9">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5 font-mono-tight text-[11px] text-ink-3">
        <span className="flex items-center gap-2">
          {clock && (
            <>
              <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
                <span className="status-ping absolute inset-0 rounded-full bg-accent-2" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-accent-2" />
              </span>
              <span className="tabular-nums">{clock.time} IST</span>
              <span className="text-line">&middot;</span>
              <span>{clock.mood}</span>
            </>
          )}
        </span>
        <span className="flex items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Dhruv Kumar</span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <span className="text-line">&middot;</span>
            press
            <kbd className="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-[3px] border border-line px-1 font-mono-tight text-[9.5px] text-ink-2">
              T
            </kbd>
            for the lights
          </span>
        </span>
      </div>
    </footer>
  );
}
