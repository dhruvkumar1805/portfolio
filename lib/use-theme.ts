"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "themechange";
type Theme = "light" | "dark";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function playToggleBlip(turningDark: boolean) {
  type WebkitWindow = typeof window & { webkitAudioContext?: typeof AudioContext };
  const win = window as WebkitWindow;
  const Ctx = window.AudioContext ?? win.webkitAudioContext;
  if (!Ctx) return;

  const ctx = new Ctx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  const [from, to] = turningDark ? [494, 330] : [494, 740];
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(to, now + 0.12);
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

  osc.start(now);
  osc.stop(now + 0.17);
  osc.onended = () => ctx.close();
}

let transitionInFlight = false;

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("theme", next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const toggle = useCallback(() => {
    if (transitionInFlight) return;

    const next = getSnapshot() === "dark" ? "light" : "dark";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    playToggleBlip(next === "dark");

    if (!reducedMotion && !document.hidden && document.startViewTransition) {
      transitionInFlight = true;
      try {
        const transition = document.startViewTransition(() => setTheme(next));
        transition.finished.catch(() => {}).finally(() => {
          transitionInFlight = false;
        });
      } catch {
        transitionInFlight = false;
        setTheme(next);
      }
    } else {
      setTheme(next);
    }
  }, [setTheme]);

  return { theme, toggle };
}
