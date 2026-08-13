"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { work } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

export default function Work() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="work"
      className="flex flex-wrap items-start gap-x-8 gap-y-4.5 py-(--sp) scroll-mt-23"
    >
      <div className="sticky top-22 flex w-33 flex-col gap-1.5 pt-0.5">
        <span className="font-mono-tight text-[10.5px] tracking-[0.16em] text-ink-3 tabular-nums">
          02
        </span>
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          Work
        </h2>
        <span className="font-mono-tight text-[10px] tracking-[0.06em] text-ink-3 text-pretty">
          click a row to open
        </span>
      </div>

      <div className="min-w-0 flex-1 basis-135">
        <div className="flex flex-col border-b border-line">
          {work.map((entry, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={entry.role} delay={i * 0.06}>
                <div className="border-t border-line">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full flex-wrap items-baseline justify-between gap-x-4.5 gap-y-2 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex min-w-0 flex-1 basis-70 flex-col gap-1.5">
                      <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.13em] text-ink-3 uppercase">
                        {entry.period}
                      </span>
                      <span className="text-xl font-medium tracking-[-0.02em] text-ink">
                        {entry.role}
                      </span>
                      <span className="font-mono-tight text-[12.5px] text-ink-2">
                        {entry.org}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full border border-line font-mono-tight text-[15px] text-ink-3 transition-transform duration-[var(--dur)]"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-3 pb-6">
                          {entry.points.map((point) => (
                            <p
                              key={point}
                              className="m-0 max-w-[36em] text-[15px] leading-[1.6] text-ink-2 text-pretty"
                            >
                              {point}
                            </p>
                          ))}
                          <span className="flex flex-wrap gap-1.5">
                            {entry.stack.map((tech, ti) => (
                              <span key={tech} className="flex items-center gap-1.5">
                                {ti > 0 && (
                                  <span className="font-mono-tight text-[11px] text-ink-3">·</span>
                                )}
                                <span className="font-mono-tight text-[11px] text-ink-3">
                                  {tech}
                                </span>
                              </span>
                            ))}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
