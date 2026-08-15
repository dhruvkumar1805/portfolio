"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaMusic, FaSpotify } from "react-icons/fa6";
import { VscVscode } from "react-icons/vsc";

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

const POLL_INTERVAL = 5000;

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

function Equalizer({ reduceMotion }: { reduceMotion: boolean }) {
  const bars = [
    { height: [3, 9, 5, 8, 3], duration: 0.9 },
    { height: [3, 6, 10, 4, 3], duration: 1.05 },
    { height: [3, 8, 4, 9, 3], duration: 0.8 },
  ];
  return (
    <span className="flex h-2.5 items-end gap-[2px]" aria-hidden="true">
      {bars.map((bar, i) =>
        reduceMotion ? (
          <span
            key={i}
            className="w-[2px] rounded-full bg-accent-2"
            style={{ height: bar.height[1] }}
          />
        ) : (
          <motion.span
            key={i}
            className="w-[2px] rounded-full bg-accent-2"
            animate={{ height: bar.height }}
            transition={{
              duration: bar.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ),
      )}
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
      ? (coding.language ?? "")
      : relativeTime(coding.lastActiveAt)
    : "";

  const codingDetail = coding
    ? [
        coding.totalToday ? `${coding.totalToday} today` : null,
        coding.streak >= 2 ? `${coding.streak} day streak` : null,
      ]
        .filter(Boolean)
        .join(" · ") || undefined
    : undefined;

  const pillClass =
    "flex items-center gap-2.5 rounded-full border border-line bg-paper/78 px-3.5 py-2 backdrop-blur-xl transition-[background-color,transform] duration-[var(--dur)] hover:-translate-y-0.5 hover:bg-paper-2/70";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      transition={{ duration: 0.76, ease: [0.2, 0.7, 0.2, 1] }}
      className="fixed bottom-[calc(1.125rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-fit max-w-[calc(100vw-24px)] flex-col gap-2"
    >
      {hasMusic && track && (
        <a
          href={track.url}
          target="_blank"
          rel="noreferrer"
          className={`group min-w-0 ${pillClass}`}
        >
          <span
            className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-paper-2 transition-colors duration-[var(--dur)] ${
              status?.music?.isPlaying ? "border-accent-2/50" : "border-line/60"
            }`}
          >
            {track.albumArt ? (
              <img
                src={track.albumArt}
                alt=""
                className="h-full w-full object-cover grayscale contrast-125"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <FaMusic size={13} className="text-ink-3" aria-hidden="true" />
              </span>
            )}
          </span>
          <span className="flex min-w-0 max-w-[180px] flex-col justify-center gap-0.5 leading-[1.15]">
            <span
              className={`flex items-center gap-1.5 font-mono-tight text-[9.5px] font-medium tracking-[0.1em] uppercase ${
                status?.music?.isPlaying ? "text-accent-2" : "text-ink-3"
              }`}
            >
              <StatusDot live={status?.music?.isPlaying ?? false} />
              {status?.music?.isPlaying ? "Now playing" : "Last played"}
              {status?.music?.isPlaying && <Equalizer reduceMotion={reduceMotion} />}
            </span>
            <Crossfade
              text={track.title}
              reduceMotion={reduceMotion}
              className="truncate font-mono-tight text-[12.5px] font-medium tracking-[-0.01em] text-ink-2 group-hover:text-accent-2"
            />
            <Crossfade
              text={track.artist}
              reduceMotion={reduceMotion}
              className="truncate font-mono-tight text-[10.5px] tracking-[-0.01em] text-ink-3"
            />
          </span>
          <FaSpotify
            size={15}
            className="ml-auto shrink-0 self-center text-ink-3 transition-colors duration-[var(--dur)] group-hover:text-accent-2"
            aria-hidden="true"
          />
        </a>
      )}
      {hasCoding && coding && (
        <span className={pillClass}>
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-paper-2 transition-colors duration-[var(--dur)] ${
              coding.isActive ? "border-accent-2/50" : "border-line/60"
            }`}
          >
            <VscVscode size={17} className="text-ink-3" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col justify-center gap-0.5 leading-[1.15]">
            <span
              className={`flex items-center gap-1.5 font-mono-tight text-[9.5px] font-medium tracking-[0.1em] uppercase ${
                coding.isActive ? "text-accent-2" : "text-ink-3"
              }`}
            >
              <StatusDot live={coding.isActive} />
              {coding.isActive ? "Coding now" : "Last coded"}
            </span>
            <Crossfade
              text={codingLabel}
              reduceMotion={reduceMotion}
              className={`truncate font-mono-tight text-[12.5px] font-medium tracking-[-0.01em] ${
                coding.isActive ? "text-ink-2" : "text-ink-3"
              }`}
            />
            {codingDetail && (
              <Crossfade
                text={codingDetail}
                reduceMotion={reduceMotion}
                className="truncate font-mono-tight text-[10.5px] tracking-[-0.01em] text-ink-3"
              />
            )}
          </span>
        </span>
      )}
    </motion.div>
  );
}
