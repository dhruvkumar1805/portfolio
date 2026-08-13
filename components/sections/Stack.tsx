"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { stack, type StackTool } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

export default function Stack() {
  const [activeTool, setActiveTool] = useState<StackTool | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section
      id="stack"
      className="flex flex-wrap items-start gap-x-8 gap-y-4.5 py-(--sp) scroll-mt-23"
    >
      <div className="sticky top-22 flex w-33 flex-col gap-1.5 pt-0.5">
        <span className="font-mono-tight text-[10.5px] tracking-[0.16em] text-ink-3 tabular-nums">
          03
        </span>
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          Stack
        </h2>
        <span className="font-mono-tight text-[10px] tracking-[0.06em] text-ink-3 text-pretty">
          large = daily
        </span>
      </div>

      <div className="min-w-0 flex-1 basis-135">
        <Reveal>
          <p
            className="m-0 max-w-[42em] text-pretty"
            onMouseLeave={() => {
              setActiveTool(null);
              setActiveCategory(null);
            }}
          >
            {stack.map((cat, ci) => (
              <span key={cat.category}>
                {cat.tools.map((tool, ti) => (
                  <span key={tool.name}>
                    <button
                      type="button"
                      onMouseEnter={() => {
                        setActiveTool(tool);
                        setActiveCategory(cat.category);
                      }}
                      onFocus={() => {
                        setActiveTool(tool);
                        setActiveCategory(cat.category);
                      }}
                      className="cursor-pointer border-0 bg-transparent p-0 transition-colors duration-200"
                      style={{
                        display: "inline",
                        fontFamily: "var(--font-geist-sans)",
                        fontSize: tool.daily ? "clamp(21px, 3vw, 30px)" : "16px",
                        fontWeight: tool.daily ? 600 : 400,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.5,
                        color:
                          activeTool?.name === tool.name
                            ? "var(--accent-2)"
                            : tool.daily
                              ? "var(--ink)"
                              : "var(--ink-3)",
                      }}
                    >
                      {tool.name}
                    </button>
                    {ti < cat.tools.length - 1 && (
                      <span
                        className="mx-2 text-ink-3"
                        style={{ fontSize: "14px", fontWeight: 300 }}
                      >
                        /
                      </span>
                    )}
                  </span>
                ))}
                {ci < stack.length - 1 && (
                  <span
                    className="mx-2 text-ink-3"
                    style={{ fontSize: "14px", fontWeight: 300 }}
                  >
                    /
                  </span>
                )}
              </span>
            ))}
          </p>
        </Reveal>

        <div className="mt-6 border-t border-line pt-4">
          <div className="relative h-5 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {activeTool ? (
                <motion.p
                  key={activeTool.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute inset-x-0 top-0 m-0 font-mono-tight text-[12.5px] text-ink-2"
                >
                  <span className="font-medium text-accent-2">{activeCategory}</span>
                  <span className="mx-2 text-ink-3">·</span>
                  {activeTool.note}
                </motion.p>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute inset-x-0 top-0 m-0 font-mono-tight text-[12.5px] text-ink-3"
                >
                  hover a tool for the note behind it
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
