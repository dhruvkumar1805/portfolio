"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaMusic, FaCode } from "react-icons/fa6";

type Track = {
  title: string;
  artist: string;
  url: string;
};

type Music = {
  isPlaying: boolean;
  track: Track | null;
};

type Coding = {
  language: string | null;
  isActive: boolean;
  lastActiveAt: number;
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

export default function StatusBar() {
  const [status, setStatus] = useState<Status | null>(null);

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

    function startPolling() {
      poll();
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
        startPolling();
      }
    }

    if (!document.hidden) startPolling();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      transition={{ duration: 0.76, ease: [0.2, 0.7, 0.2, 1] }}
      className="fixed bottom-4.5 left-1/2 z-40 flex max-w-[calc(100vw-24px)] items-center gap-0.5 overflow-hidden rounded-full border border-line bg-paper/78 p-1.5 shadow-[0_6px_24px_-14px_rgba(0,0,0,0.24)] backdrop-blur-xl"
    >
      {hasMusic && track && (
        <a
          href={track.url}
          target="_blank"
          rel="noreferrer"
          className={`flex min-w-0 shrink items-center gap-2 rounded-full px-3 py-1 text-[13px] transition-colors duration-[var(--dur)] hover:text-accent-2 ${
            hasCoding ? "border-r border-line pr-3" : ""
          }`}
        >
          <StatusDot live={status?.music?.isPlaying ?? false} />
          <FaMusic size={10} className="shrink-0 text-ink-3" aria-hidden="true" />
          <span className="min-w-0 truncate font-mono-tight text-[12.5px] tracking-[-0.01em] text-ink-2">
            {track.title} · {track.artist}
          </span>
        </a>
      )}
      {hasCoding && coding && (
        <span className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-[13px]">
          <StatusDot live={coding.isActive} />
          <FaCode size={10} className="shrink-0 text-ink-3" aria-hidden="true" />
          <span className="font-mono-tight text-[12.5px] tracking-[-0.01em] text-ink-2">
            {coding.isActive
              ? `Coding · ${coding.language}`
              : `Last coded ${relativeTime(coding.lastActiveAt)}`}
          </span>
        </span>
      )}
    </motion.div>
  );
}
