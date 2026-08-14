"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { stack, type StackTool } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

const flatTools = stack.flatMap((cat) =>
  cat.tools.map((tool) => ({ ...tool, category: cat.category }))
);

export default function Stack() {
  const [activeTool, setActiveTool] = useState<StackTool | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section
      id="stack"
      className="flex flex-wrap items-start gap-x-8 gap-y-4.5 py-(--sp) scroll-mt-23"
    >
      <div className="flex w-33 flex-col gap-1.5 pt-0.5 min-[800px]:sticky min-[800px]:top-22">
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
          <div
            className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5 text-pretty"
            style={{ fontSize: "clamp(22px, 3.1vw, 33px)", lineHeight: 1.22 }}
            onMouseLeave={() => {
              setActiveTool(null);
              setActiveCategory(null);
            }}
          >
            {flatTools.map((tool, i) => (
              <Fragment key={tool.name}>
                <button
                  type="button"
                  onMouseEnter={() => {
                    setActiveTool(tool);
                    setActiveCategory(tool.category);
                  }}
                  onFocus={() => {
                    setActiveTool(tool);
                    setActiveCategory(tool.category);
                  }}
                  onClick={() => {
                    const next = activeTool?.name === tool.name ? null : tool;
                    setActiveTool(next);
                    setActiveCategory(next ? tool.category : null);
                  }}
                  className="cursor-pointer border-0 bg-transparent p-0 transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: tool.daily ? "1em" : "0.5em",
                    fontWeight: tool.daily ? 500 : 400,
                    letterSpacing: tool.daily ? "-0.03em" : "-0.012em",
                    alignSelf: tool.daily ? undefined : "center",
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
                {i < flatTools.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="font-mono-tight"
                    style={{
                      fontSize: "0.36em",
                      color: "var(--ink-3)",
                      opacity: 0.7,
                      alignSelf: "center",
                    }}
                  >
                    /
                  </span>
                )}
              </Fragment>
            ))}
          </div>
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
