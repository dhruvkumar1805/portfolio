"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import { work } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

export default function Work() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="work"
      className="flex flex-wrap items-start gap-x-8 gap-y-4.5 py-(--sp) scroll-mt-23"
    >
      <div className="flex w-33 flex-col gap-1.5 pt-0.5 min-[800px]:sticky min-[800px]:top-22">
        <span className="font-mono-tight text-[10.5px] tracking-[0.16em] text-ink-3 tabular-nums">
          02
        </span>
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          Experience
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
                    className="flex w-full flex-wrap items-center justify-between gap-x-4.5 gap-y-1.5 py-7 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-xl font-medium tracking-[-0.02em] text-ink">
                        {entry.role}
                      </span>
                      <span className="text-[15px] text-ink-2">{entry.org}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="font-mono-tight text-[13px] whitespace-nowrap text-ink-3">
                        {entry.period}
                      </span>
                      {isOpen ? (
                        <FiMinus size={14} aria-hidden="true" className="shrink-0 text-ink-3" />
                      ) : (
                        <FiPlus size={14} aria-hidden="true" className="shrink-0 text-ink-3" />
                      )}
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
                          <span className="flex flex-wrap gap-2">
                            {entry.stack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md bg-paper-2 px-2.5 py-1 font-mono-tight text-[12px] text-ink-2"
                              >
                                {tech}
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
