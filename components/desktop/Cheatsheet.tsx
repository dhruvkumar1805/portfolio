"use client";

import { motion, useReducedMotion } from "framer-motion";

const GROUPS: { title: string; binds: [string, string][] }[] = [
  {
    title: "Windows",
    binds: [
      ["SUPER + ENTER", "new terminal"],
      ["SUPER + D", "app launcher"],
      ["SUPER + Q", "close focused window"],
      ["SUPER + F", "fullscreen"],
      ["SUPER + V", "toggle floating"],
    ],
  },
  {
    title: "Focus & layout",
    binds: [
      ["SUPER + H J K L", "move focus (or arrows)"],
      ["SUPER + SHIFT + H J K L", "swap windows"],
      ["SUPER + CTRL + H J K L", "resize the split"],
    ],
  },
  {
    title: "Workspaces",
    binds: [
      ["SUPER + 1…5", "switch workspace"],
      ["SUPER + SHIFT + 1…5", "carry window over"],
    ],
  },
  {
    title: "Session",
    binds: [
      ["SUPER + T", "light / dark"],
      ["SUPER + P", "nekopet on / off"],
      ["SUPER + /", "this sheet"],
      ["SUPER + SHIFT + E", "log out to the normal site"],
    ],
  },
];

export default function Cheatsheet({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.14 }}
      onPointerDown={onClose}
      className="absolute inset-0 z-50 flex items-center justify-center bg-ink/12 p-5 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ scale: reduce ? 1 : 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: reduce ? 1 : 0.98, opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.18, ease: [0.2, 0.7, 0.2, 1] }}
        onPointerDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Keybinds"
        className="wm-scroll max-h-full w-[min(620px,100%)] overflow-y-auto rounded-xl border border-line bg-paper p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="m-0 text-[15px] font-semibold tracking-[-0.02em] text-ink">
            Keybinds
          </h2>
          <p className="font-mono-tight text-[10px] tracking-[0.12em] text-ink-3 uppercase">
            SUPER = Alt
          </p>
        </div>

        <div className="mt-4 grid gap-x-7 gap-y-4 sm:grid-cols-2">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <p className="mb-2 font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
                {group.title}
              </p>
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                {group.binds.map(({ 0: bind, 1: what }) => (
                  <li key={bind} className="flex items-baseline gap-3">
                    <span className="shrink-0 font-mono-tight text-[10.5px] tracking-[0.04em] text-ink-2">
                      {bind}
                    </span>
                    <span className="min-w-0 flex-1 text-right text-[11.5px] text-ink-3">
                      {what}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-5 border-t border-line pt-3 text-[11.5px] leading-[1.5] text-ink-3">
          The browser keeps the real Super key, so this session binds Alt instead. Windows
          tile with a dwindle layout: every new window splits the focused one along its
          longer side. <span className="text-ink-2">Escape</span> closes this.
        </p>
      </motion.div>
    </motion.div>
  );
}
