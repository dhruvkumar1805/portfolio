"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaChevronUp, FaMusic, FaSpotify } from "react-icons/fa6";
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
const STATUS_CACHE_KEY = "statusbar:lastStatus";

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

function ExpandChevron({ expanded }: { expanded: boolean }) {
  return (
    <FaChevronUp
      size={8}
      className={`shrink-0 self-center text-ink-3 transition-transform duration-[var(--dur)] ${
        expanded ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    />
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
  const [stackOpen, setStackOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (canHover || !stackOpen) return;

    function handleOutside(e: PointerEvent) {
      if (stackRef.current && !stackRef.current.contains(e.target as Node)) {
        setStackOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [canHover, stackOpen]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(STATUS_CACHE_KEY);
      if (cached) setStatus(JSON.parse(cached));
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    function poll() {
      fetch("/api/status")
        .then((r) => (r.ok ? r.json() : undefined))
        .then((d: Status | undefined) => {
          if (cancelled || d === undefined) return;
          setStatus(d);
          try {
            localStorage.setItem(STATUS_CACHE_KEY, JSON.stringify(d));
          } catch {}
        })
        .catch(() => {});
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

  const shouldStack = hasMusic && hasCoding;
  const musicLive = status?.music?.isPlaying ?? false;
  const codingLive = coding?.isActive ?? false;
  const musicIsFront = musicLive || !codingLive;
  const expanded = (canHover && !shouldStack) || stackOpen;
  const compact = !canHover && !expanded;

  const stackTransition =
    "transition-[transform,opacity,margin-top] duration-[var(--dur)] ease-[cubic-bezier(0.2,0.7,0.2,1)]";

  const musicStackClass = !shouldStack
    ? ""
    : musicIsFront
      ? `relative z-10 ${expanded ? "mt-2" : "-mt-12"} ${stackTransition}`
      : `relative z-0 ${expanded ? "scale-100 opacity-100" : "scale-[0.92] opacity-70"} ${stackTransition}`;

  const codingStackClass = !shouldStack
    ? ""
    : musicIsFront
      ? `relative z-0 ${expanded ? "scale-100 opacity-100" : "scale-[0.92] opacity-70"} ${stackTransition}`
      : `relative z-10 ${expanded ? "mt-2" : "-mt-12"} ${stackTransition}`;

  const musicOrder = shouldStack ? (musicIsFront ? 2 : 1) : undefined;
  const codingOrder = shouldStack ? (musicIsFront ? 1 : 2) : undefined;

  return (
    <motion.div
      ref={stackRef}
      initial={{ opacity: 0, y: 16, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      transition={{ duration: 0.76, ease: [0.2, 0.7, 0.2, 1] }}
      onMouseEnter={() => canHover && setStackOpen(true)}
      onMouseLeave={() => canHover && setStackOpen(false)}
      onFocus={() => setStackOpen(true)}
      onBlur={() => setStackOpen(false)}
      onClick={() => !canHover && setStackOpen((open) => !open)}
      aria-expanded={!canHover ? expanded : undefined}
      className={`fixed bottom-[calc(1.125rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-fit max-w-[calc(100vw-24px)] flex-col ${
        !canHover ? "cursor-pointer" : ""
      }`}
    >
      {hasMusic && track && (
        <motion.span
          layout
          transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ order: musicOrder }}
          className={`group min-w-0 ${pillClass} ${musicStackClass}`}
        >
          <span
            className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-paper-2 transition-colors duration-[var(--dur)] ${
              status?.music?.isPlaying ? "border-accent-2/50" : "border-line/60"
            }`}
          >
            {track.albumArt ? (
              <Image
                src={track.albumArt}
                alt=""
                fill
                sizes="40px"
                className="object-cover grayscale contrast-125"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <FaMusic size={13} className="text-ink-3" aria-hidden="true" />
              </span>
            )}
          </span>
          {!compact && (
            <>
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
                <a href={track.url} target="_blank" rel="noreferrer" className="contents">
                  <Crossfade
                    text={track.title}
                    reduceMotion={reduceMotion}
                    className="truncate font-mono-tight text-[12.5px] font-medium tracking-[-0.01em] text-ink-2 hover:text-accent-2"
                  />
                </a>
                <Crossfade
                  text={track.artist}
                  reduceMotion={reduceMotion}
                  className="truncate font-mono-tight text-[10.5px] tracking-[-0.01em] text-ink-3"
                />
              </span>
              <span className="ml-auto flex shrink-0 items-center gap-2.5">
                {musicIsFront && (shouldStack || !canHover) && (
                  <ExpandChevron expanded={expanded} />
                )}
                <a href={track.url} target="_blank" rel="noreferrer" className="contents">
                  <FaSpotify
                    size={15}
                    className="shrink-0 self-center text-ink-3 transition-colors duration-[var(--dur)] hover:text-accent-2"
                    aria-hidden="true"
                  />
                </a>
              </span>
            </>
          )}
        </motion.span>
      )}
      {hasCoding && coding && (
        <motion.span
          layout
          transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ order: codingOrder }}
          className={`${pillClass} ${codingStackClass}`}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-paper-2 transition-colors duration-[var(--dur)] ${
              coding.isActive ? "border-accent-2/50" : "border-line/60"
            }`}
          >
            <VscVscode size={17} className="text-ink-3" aria-hidden="true" />
          </span>
          {!compact && (
            <>
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
              {!musicIsFront && (shouldStack || !canHover) && (
                <span className="ml-auto shrink-0 self-center">
                  <ExpandChevron expanded={expanded} />
                </span>
              )}
            </>
          )}
        </motion.span>
      )}
    </motion.div>
  );
}
