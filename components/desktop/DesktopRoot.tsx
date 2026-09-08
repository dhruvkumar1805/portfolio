"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { APP_META } from "@/lib/wm/store";
import type { AppId } from "@/lib/wm/types";
import { TOUCH_QUERY, useMediaQuery } from "@/lib/wm/use-media";
import Desktop from "./Desktop";

const BOOT: [string, string][] = [
  ["0.000000", "Linux version 7.1.9-arch1-2 (dhruv@arch)"],
  ["0.114204", "reached target Graphical Interface"],
  ["0.318911", "starting compositor: dwindle, written in TypeScript"],
  ["0.502774", "bound wlr-layer-shell v4 → nekopet"],
  ["0.671203", "workspaces 1-5 online, 0 windows"],
  ["0.804119", "session opened for user dhruv"],
];

const DEFAULT_APPS: AppId[] = ["about", "terminal"];

/**
 * `?open=projects,terminal` boots straight into an arrangement, so a link can
 * point at the part of the session it is talking about.
 */
function appsFromUrl(): AppId[] {
  if (typeof window === "undefined") return DEFAULT_APPS;
  const requested = new URLSearchParams(window.location.search).get("open");
  if (!requested) return DEFAULT_APPS;

  const valid = requested
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter((name): name is AppId => name in APP_META)
    .slice(0, 4);

  return valid.length ? valid : DEFAULT_APPS;
}

export default function DesktopRoot() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"boot" | "up">("boot");
  const [step, setStep] = useState(0);
  const [noticeGone, setNoticeGone] = useState(false);
  const [initialApps] = useState(appsFromUrl);
  const touch = useMediaQuery(TOUCH_QUERY);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    document.body.dataset.wm = "on";
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      delete document.body.dataset.wm;
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    if (phase !== "boot") return;
    if (reduce) {
      const id = setTimeout(() => setPhase("up"), 0);
      return () => clearTimeout(id);
    }
    if (step >= BOOT.length) {
      const id = setTimeout(() => setPhase("up"), 260);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setStep((s) => s + 1), step === 0 ? 90 : 130);
    return () => clearTimeout(id);
  }, [phase, step, reduce]);

  useEffect(() => {
    if (phase !== "boot") return;
    const skip = () => setPhase("up");
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [phase]);

  const exit = useCallback(() => router.push("/"), [router]);

  if (!mounted) return null;

  return createPortal(
    <div
      id="wm-root"
      className="fixed inset-0 z-[100] overflow-hidden bg-paper text-ink"
      style={{
        backgroundImage:
          "repeating-linear-gradient(-45deg, var(--line), var(--line) 1px, transparent 1px, transparent 9px)",
        backgroundSize: "auto",
      }}
    >
      <div className="absolute inset-0 bg-paper/[0.965]" aria-hidden="true" />

      <div className="relative h-full w-full">
        <Desktop onExit={exit} initialApps={initialApps} />
      </div>

      <AnimatePresence>
        {touch && !noticeGone && phase === "up" && (
          <TouchNotice key="notice" onClose={() => setNoticeGone(true)} reduce={reduce} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "boot" && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.34, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute inset-0 z-[60] flex flex-col justify-end bg-paper p-5 font-mono-tight text-[11.5px] leading-[1.6] sm:p-8"
          >
            {BOOT.slice(0, step).map(({ 0: t, 1: text }) => (
              <p key={t} className="m-0 text-ink-3">
                <span className="text-ink-3/60">[{t.padStart(11)}]</span>{" "}
                <span className="text-ink-2">{text}</span>
              </p>
            ))}
            <p className="m-0 mt-2 text-accent-text">
              dhruv@arch login: <span className="animate-pulse">▌</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

/**
 * Phones get the session, not a wall: one window at a time and a dock. This
 * only says what they are missing, and gets out of the way.
 */
function TouchNotice({
  onClose,
  reduce,
}: {
  onClose: () => void;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : 12 }}
      transition={{ duration: reduce ? 0 : 0.3, ease: [0.2, 0.7, 0.2, 1] }}
      className="absolute inset-x-3 bottom-[66px] z-[55] flex items-center gap-3 rounded-xl border border-line bg-paper/95 px-3.5 py-3 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.6)] backdrop-blur-xl"
    >
      <span className="min-w-0 flex-1 text-[12.5px] leading-[1.45] text-ink-2 text-pretty">
        <span className="text-ink">Touch session.</span> The full thing tiles windows
        and takes keybinds — worth opening on a laptop.
      </span>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-lg border border-line px-2.5 py-1.5 font-mono-tight text-[10.5px] tracking-[0.1em] text-ink-2 uppercase"
      >
        ok
      </button>
    </motion.div>
  );
}
