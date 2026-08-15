"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaMusic, FaCode } from "react-icons/fa6";

type Track = {
  title: string;
  artist: string;
  url: string;
  albumArt: string | null;
};

type Music = {
  isPlaying: boolean;
  track: Track | null;
};

type Coding = {
  language: string | null;
  isActive: boolean;
  lastActiveAt: number;
  totalToday: string | null;
  streak: number;
};

type Status = {
  music: Music | null;
  coding: Coding | null;
};

const POLL_INTERVAL = 15000;

function relativeTime(seconds: number): string {
  const diff = Date.now() / 1000 - seconds;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function StatusDot({ live }: { live: boolean }) {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      {live && (
        <span className="status-ping absolute inline-flex h-full w-full rounded-full bg-accent-2" />
      )}
      <span
        className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
          live ? "bg-accent-2" : "bg-ink-3"
        }`}
      />
    </span>
  );
}

function Crossfade({
  text,
  className,
  reduceMotion,
}: {
  text: string;
  className: string;
  reduceMotion: boolean;
}) {
  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
        className={className}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

export default function StatusBar() {
  const [status, setStatus] = useState<Status | null>(null);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    function poll() {
      fetch("/api/status")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!cancelled) setStatus(d);
        })
        .catch(() => {
          if (!cancelled) setStatus(null);
        });
    }

    function startInterval() {
      if (interval) clearInterval(interval);
      interval = setInterval(poll, POLL_INTERVAL);
    }

    function stopPolling() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }

    function onVisibilityChange() {
      if (document.hidden) {
        stopPolling();
      } else {
        poll();
        startInterval();
      }
    }

    poll();
    if (!document.hidden) startInterval();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      stopPolling();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const track = status?.music?.track ?? null;
  const coding = status?.coding ?? null;
  const hasMusic = Boolean(track);
  const hasCoding = Boolean(coding?.language);

  if (!hasMusic && !hasCoding) return null;

  const codingLabel = coding
    ? coding.isActive
      ? `Coding · ${coding.language}`
      : `Last coded ${relativeTime(coding.lastActiveAt)}`
    : "";

  const codingTooltip = coding
    ? [
        coding.totalToday ? `${coding.totalToday} today` : null,
        coding.streak >= 2 ? `${coding.streak} day streak` : null,
      ]
        .filter(Boolean)
        .join(" · ") || undefined
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      transition={{ duration: 0.76, ease: [0.2, 0.7, 0.2, 1] }}
      className="fixed bottom-[calc(1.125rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex max-w-[calc(100vw-24px)] items-center gap-0.5 overflow-hidden rounded-full border border-line bg-paper/78 p-1.5 shadow-[0_6px_24px_-14px_rgba(0,0,0,0.24)] backdrop-blur-xl"
    >
      {hasMusic && track && (
        <a
          href={track.url}
          target="_blank"
          rel="noreferrer"
          className={`group flex min-w-0 shrink items-center gap-2 rounded-full px-3 py-1.5 transition-colors duration-[var(--dur)] hover:bg-paper-2/70 ${
            hasCoding ? "border-r border-line pr-3" : ""
          }`}
        >
          <StatusDot live={status?.music?.isPlaying ?? false} />
          {track.albumArt ? (
            <img
              src={track.albumArt}
              alt=""
              className="h-5 w-5 shrink-0 rounded-[4px] border border-line/60 object-cover grayscale contrast-125"
            />
          ) : (
            <FaMusic size={11} className="shrink-0 text-ink-3" aria-hidden="true" />
          )}
          <span className="flex min-w-0 max-w-[160px] flex-col justify-center leading-[1.15]">
            <Crossfade
              text={track.title}
              reduceMotion={reduceMotion}
              className="truncate font-mono-tight text-[12.5px] tracking-[-0.01em] text-ink-2 group-hover:text-accent-2"
            />
            <Crossfade
              text={track.artist}
              reduceMotion={reduceMotion}
              className="truncate font-mono-tight text-[10.5px] tracking-[-0.01em] text-ink-3"
            />
          </span>
        </a>
      )}
      {hasCoding && coding && (
        <span
          className="flex shrink-0 cursor-help items-center gap-2 rounded-full px-3 py-1.5 transition-colors duration-[var(--dur)] hover:bg-paper-2/70"
          title={codingTooltip}
        >
          <StatusDot live={coding.isActive} />
          <FaCode size={11} className="shrink-0 text-ink-3" aria-hidden="true" />
          <Crossfade
            text={codingLabel}
            reduceMotion={reduceMotion}
            className={`font-mono-tight text-[12.5px] tracking-[-0.01em] ${
              coding.isActive ? "text-ink-2" : "text-ink-3"
            }`}
          />
        </span>
      )}
    </motion.div>
  );
}
