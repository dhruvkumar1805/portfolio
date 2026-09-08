"use client";

import { useEffect, useState } from "react";
import { LuKeyboard, LuLayoutGrid, LuMoon, LuPower, LuSun } from "react-icons/lu";
import { WORKSPACES } from "@/lib/wm/types";
import { getIstParts } from "@/lib/ist-clock";
import { useTheme } from "@/lib/use-theme";
import { useWm } from "./wm-context";

type Status = {
  music: { isPlaying: boolean; track: { title: string; artist: string } | null } | null;
  coding: { language: string | null; isActive: boolean } | null;
};

export default function Bar() {
  const { state, dispatch, exit, toggleTheme, showKeys, showLauncher } = useWm();
  const [status, setStatus] = useState<Status | null>(null);
  const [visitors, setVisitors] = useState<number | null>(null);
  const [clock, setClock] = useState(() => getIstParts().time);
  const { theme } = useTheme();

  useEffect(() => {
    const tick = () => setClock(getIstParts().time);
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    function poll() {
      fetch("/api/status")
        .then((r) => (r.ok ? r.json() : undefined))
        .then((d: Status | undefined) => {
          if (!cancelled && d) setStatus(d);
        })
        .catch(() => {});
    }
    poll();
    const id = setInterval(poll, 20_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/visitor")
      .then((r) => (r.ok ? r.json() : undefined))
      .then((d: { count: number | null } | undefined) => {
        if (!cancelled && typeof d?.count === "number") setVisitors(d.count);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const occupied = new Set(Object.values(state.windows).map((w) => w.workspace));
  const focusedWin = state.focus[state.workspace];
  const title = focusedWin ? state.windows[focusedWin]?.title : null;
  const track = status?.music?.track;
  const coding = status?.coding;

  return (
    <header className="relative z-40 flex h-[34px] shrink-0 items-center gap-3 border-b border-line bg-paper-2/80 px-2.5 backdrop-blur-xl">
      <span className="hidden shrink-0 font-mono-tight text-[10.5px] font-medium tracking-[0.12em] text-ink-3 uppercase sm:inline">
        dhruv@arch
      </span>

      <nav className="flex shrink-0 items-center gap-1" aria-label="Workspaces">
        {Array.from({ length: WORKSPACES }, (_, i) => {
          const active = state.workspace === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => dispatch({ type: "workspace", index: i })}
              aria-current={active ? "true" : undefined}
              aria-label={`Workspace ${i + 1}`}
              className={`h-[22px] min-w-[22px] rounded-md px-1.5 font-mono-tight text-[11px] font-medium transition-colors duration-200 ${
                active
                  ? "bg-accent-2 text-paper"
                  : occupied.has(i)
                    ? "bg-paper text-ink-2 hover:text-accent-2"
                    : "text-ink-3/55 hover:text-ink-2"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </nav>

      <span className="min-w-0 flex-1 truncate font-mono-tight text-[10.5px] tracking-[0.1em] text-ink-3 uppercase">
        {title ?? "—"}
      </span>

      {coding?.language && (
        <span className="hidden shrink-0 items-center gap-1.5 font-mono-tight text-[10.5px] text-ink-3 lg:flex">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              coding.isActive ? "bg-accent-2" : "bg-ink-3/60"
            }`}
          />
          {coding.isActive ? coding.language : "idle"}
        </span>
      )}

      {track && (
        <span className="hidden max-w-[210px] shrink-0 truncate font-mono-tight text-[10.5px] text-ink-3 md:inline">
          {status?.music?.isPlaying ? "♪ " : "◦ "}
          {track.title} — {track.artist}
        </span>
      )}

      {visitors !== null && (
        <span
          className="hidden shrink-0 font-mono-tight text-[10.5px] text-ink-3 tabular-nums sm:inline"
          title="visitors"
        >
          session #{visitors.toLocaleString("en-US")}
        </span>
      )}

      <span className="shrink-0 font-mono-tight text-[11px] font-medium text-ink-2 tabular-nums">
        {clock}
        <span className="ml-1 text-[9.5px] text-ink-3">IST</span>
      </span>

      <div className="flex shrink-0 items-center gap-0.5">
        <BarButton onClick={showLauncher} label="Open an app">
          <LuLayoutGrid size={13} />
        </BarButton>
        <BarButton onClick={showKeys} label="Keybinds">
          <LuKeyboard size={14} />
        </BarButton>
        <BarButton onClick={toggleTheme} label="Toggle theme">
          {theme === "dark" ? <LuMoon size={13} /> : <LuSun size={13} />}
        </BarButton>
        <BarButton onClick={exit} label="Exit to the normal site">
          <LuPower size={13} />
        </BarButton>
      </div>
    </header>
  );
}

function BarButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-[24px] w-[24px] items-center justify-center rounded-md text-ink-3 transition-colors duration-200 hover:bg-paper hover:text-accent-2"
    >
      {children}
    </button>
  );
}
