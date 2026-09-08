"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { IconType } from "react-icons";
import { LuCat, LuGithub, LuKeyboard, LuMail, LuPower, LuSunMoon } from "react-icons/lu";
import { siteConfig } from "@/lib/site-config";
import { APP_META } from "@/lib/wm/store";
import type { AppId } from "@/lib/wm/types";
import { useWm } from "./wm-context";
import { APP_ICON } from "./app-icons";

type Item = {
  key: string;
  label: string;
  hint: string;
  icon: IconType;
  run: () => void;
};

export default function Launcher({ onClose }: { onClose: () => void }) {
  const { openApp, exit, toggleTheme, togglePet, showKeys } = useWm();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const items = useMemo<Item[]>(() => {
    const apps = (Object.keys(APP_META) as AppId[]).map((app) => ({
      key: app,
      label: APP_META[app].label,
      hint: APP_META[app].hint,
      icon: APP_ICON[app],
      run: () => openApp(app),
    }));

    return [
      ...apps,
      {
        key: "github",
        label: "github",
        hint: "The repos, including this one",
        icon: LuGithub,
        run: () => window.open(siteConfig.github, "_blank", "noopener,noreferrer"),
      },
      {
        key: "email",
        label: "email",
        hint: siteConfig.email,
        icon: LuMail,
        run: () => window.open(`mailto:${siteConfig.email}`, "_self"),
      },
      {
        key: "keybinds",
        label: "keybinds",
        hint: "Every shortcut this session knows",
        icon: LuKeyboard,
        run: showKeys,
      },
      {
        key: "theme",
        label: "theme",
        hint: "Flip light and dark",
        icon: LuSunMoon,
        run: toggleTheme,
      },
      {
        key: "nekopet",
        label: "nekopet",
        hint: "Toggle the cat on the desktop",
        icon: LuCat,
        run: togglePet,
      },
      {
        key: "exit",
        label: "exit session",
        hint: "Back to the normal portfolio",
        icon: LuPower,
        run: exit,
      },
    ];
  }, [openApp, exit, toggleTheme, togglePet, showKeys]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) => i.label.includes(q) || i.hint.toLowerCase().includes(q),
    );
  }, [items, query]);

  const active = filtered[Math.min(index, filtered.length - 1)];

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      active?.run();
      onClose();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.14 }}
      onPointerDown={onClose}
      className="absolute inset-0 z-50 flex items-start justify-center bg-ink/12 pt-[14vh] backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ y: reduce ? 0 : -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: reduce ? 0 : -6, opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.18, ease: [0.2, 0.7, 0.2, 1] }}
        onPointerDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Run"
        className="w-[min(440px,calc(100%-32px))] overflow-hidden rounded-xl border border-line bg-paper shadow-[0_24px_60px_-28px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
          <span className="font-mono-tight text-[12px] text-accent-text">❯</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="run…"
            spellCheck={false}
            aria-label="Run a command"
            className="w-full bg-transparent font-mono-tight text-[12.5px] text-ink outline-none placeholder:text-ink-3/70"
          />
        </div>

        <ul className="wm-scroll m-0 max-h-[268px] list-none overflow-y-auto p-1.5">
          {filtered.map((item, i) => {
            const isActive = item.key === active?.key;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onPointerEnter={() => setIndex(i)}
                  onClick={() => {
                    item.run();
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 ${
                    isActive ? "bg-paper-2" : ""
                  }`}
                >
                  <item.icon
                    size={14}
                    className={`shrink-0 ${isActive ? "text-accent-2" : "text-ink-3"}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`w-[92px] shrink-0 font-mono-tight text-[12px] ${
                      isActive ? "text-accent-text" : "text-ink-2"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[11.5px] text-ink-3">
                    {item.hint}
                  </span>
                </button>
              </li>
            );
          })}
          {!filtered.length && (
            <li className="px-2.5 py-3 font-mono-tight text-[11.5px] text-ink-3">
              nothing matches “{query}”
            </li>
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}
