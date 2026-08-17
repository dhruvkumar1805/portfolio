"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import { projects } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

export default function Projects() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="projects"
      className="flex flex-wrap items-start gap-x-8 gap-y-4.5 py-(--sp) scroll-mt-23"
    >
      <div className="flex w-33 flex-col gap-1.5 pt-0.5 min-[800px]:sticky min-[800px]:top-22">
        <span className="font-mono-tight text-[10.5px] tracking-[0.16em] text-ink-3 tabular-nums">
          01
        </span>
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          Selected projects
        </h2>
        <span className="font-mono-tight text-[10px] tracking-[0.06em] text-ink-3 text-pretty">
          click a row to open
        </span>
      </div>

      <div className="min-w-0 flex-1 basis-135">
        <div className="flex flex-col border-b border-line">
          {projects.map((project, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={project.slug} delay={i * 0.06}>
                <div className="border-t border-line">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full flex-wrap items-center justify-between gap-x-4.5 gap-y-1.5 py-7 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono-tight text-[11px] tracking-[0.06em] text-ink-3 tabular-nums">
                        {project.index}
                      </span>
                      <span className="text-xl font-medium tracking-[-0.02em] text-ink">
                        {project.title}
                      </span>
                      <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.13em] text-ink-3 uppercase">
                        {project.tag}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      {project.metricValue && (
                        <span className="flex items-baseline gap-1.5 font-mono-tight text-[13px] whitespace-nowrap text-ink-3">
                          <span className="font-medium text-ink tabular-nums">
                            {project.metricValue}
                          </span>
                          {project.metricLabel}
                        </span>
                      )}
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
                        <div
                          className={`flex flex-col gap-6 pb-8 ${project.image ? "sm:flex-row" : ""}`}
                        >
                          {project.image && (
                            <TiltCard className="relative aspect-video shrink-0 overflow-hidden rounded-[5px] border border-line sm:w-[380px]">
                              <Image
                                src={project.image}
                                alt={`${project.title} screenshot`}
                                fill
                                sizes="(min-width: 640px) 380px, 100vw"
                                className="object-cover"
                              />
                            </TiltCard>
                          )}
                          <div className="flex min-w-0 flex-1 flex-col gap-5">
                            <p className="m-0 max-w-[36em] text-[15px] leading-[1.6] text-ink-2 text-pretty">
                              {project.description}
                            </p>
                            {project.stats && (
                              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                                {project.stats.map((s) => (
                                  <span key={s.label} className="flex flex-col gap-1">
                                    <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.13em] text-ink-3 uppercase">
                                      {s.label}
                                    </span>
                                    <span className="text-[13.5px] text-ink-2">{s.value}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                            <span className="flex flex-wrap gap-2">
                              {project.stack.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-md bg-paper-2 px-2.5 py-1 font-mono-tight text-[12px] text-ink-2"
                                >
                                  {tech}
                                </span>
                              ))}
                            </span>
                            <span className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono-tight text-[11px] text-ink-3">
                              {project.caseStudyHref && (
                                <Link
                                  href={project.caseStudyHref}
                                  className="transition-colors duration-[var(--dur)] hover:text-accent-2"
                                >
                                  case study &#8594;
                                </Link>
                              )}
                              <a
                                href={project.href}
                                target="_blank"
                                rel="noreferrer"
                                className="transition-colors duration-[var(--dur)] hover:text-accent-2"
                              >
                                {project.hrefLabel} &#8599;
                              </a>
                            </span>
                          </div>
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
