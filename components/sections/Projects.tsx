"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { projects, type Project } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

const PREVIEW_WIDTH = 240;
const PREVIEW_OFFSET = 28;

function ProjectMeta({ project, tinted }: { project: Project; tinted: boolean }) {
  return (
    <span className="flex min-w-0 flex-1 basis-85 flex-col gap-1.5">
      <span className="flex items-center gap-2.5">
        <span
          className="font-mono-tight text-[11px] tracking-[0.06em] text-ink-3 tabular-nums transition-colors duration-[var(--dur)]"
          style={{ color: tinted ? "var(--accent-2)" : undefined }}
        >
          {project.index}
        </span>
        <span className="h-px w-4 shrink-0 bg-line" />
        <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.13em] text-ink-3 uppercase">
          {project.tag}
        </span>
      </span>
      <span
        className="text-xl font-medium tracking-[-0.02em] transition-colors duration-[var(--dur)]"
        style={{ color: tinted ? "var(--accent-2)" : undefined }}
      >
        {project.title}
      </span>
      <span className="max-w-[32em] text-[15.5px] leading-[1.55] text-ink-2 text-pretty">
        {project.description}
      </span>
      {project.metricValue && (
        <span className="mt-1 flex items-baseline gap-2">
          <span className="font-mono-tight text-[13px] font-medium tracking-[-0.01em] text-ink tabular-nums">
            {project.metricValue}
          </span>
          <span className="font-mono-tight text-[9.5px] tracking-[0.13em] text-ink-3 uppercase">
            {project.metricLabel}
          </span>
        </span>
      )}
      <span className="mt-0.5 flex flex-wrap gap-1.5">
        {project.stack.map((tech, ti) => (
          <span key={tech} className="flex items-center gap-1.5">
            {ti > 0 && <span className="font-mono-tight text-[11px] text-ink-3">·</span>}
            <span className="font-mono-tight text-[11px] text-ink-3">{tech}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Projects() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);
  const hoveredProject = projects.find((p) => p.slug === hovered && p.image);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 320, damping: 32 });
  const springY = useSpring(mouseY, { stiffness: 320, damping: 32 });

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    const overflowsRight =
      e.clientX + PREVIEW_OFFSET + PREVIEW_WIDTH > window.innerWidth - 20;
    mouseX.set(
      overflowsRight ? e.clientX - PREVIEW_OFFSET - PREVIEW_WIDTH : e.clientX + PREVIEW_OFFSET
    );
    mouseY.set(e.clientY - (PREVIEW_WIDTH * 9) / 16 / 2);
  }

  return (
    <section
      id="projects"
      onMouseMove={canHover ? handleMouseMove : undefined}
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
          hover for a look
        </span>
      </div>

      {canHover && (
        <AnimatePresence>
          {hoveredProject && (
            <motion.div
              key={hoveredProject.slug}
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.94, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, scale: 0.94, rotate: -3 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ x: springX, y: springY, width: PREVIEW_WIDTH }}
              className="pointer-events-none fixed top-0 left-0 z-30 aspect-video overflow-hidden rounded-lg border border-line shadow-[0_20px_44px_-16px_rgba(0,0,0,0.4)]"
            >
              <Image
                src={hoveredProject.image!}
                alt=""
                fill
                sizes={`${PREVIEW_WIDTH}px`}
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className="min-w-0 flex-1 basis-135">
        <div className="flex flex-col">
          {projects.map((project, i) => {
            const isLast = i === projects.length - 1;
            const tinted = hovered === project.slug;
            const rowClass = `flex flex-wrap items-baseline justify-between gap-x-4.5 gap-y-2.5 border-t border-line py-6 ${
              isLast ? "border-b" : ""
            }`;

            return (
              <Reveal key={project.slug} delay={i * 0.06}>
                <motion.div
                  onMouseEnter={() => setHovered(project.slug)}
                  onMouseLeave={() => setHovered(null)}
                  animate={{ opacity: hovered && !tinted ? 0.42 : 1 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
                  className={rowClass}
                >
                  {project.caseStudyHref ? (
                    <>
                      <Link href={project.caseStudyHref} className="flex min-w-0 flex-1 basis-85">
                        <ProjectMeta project={project} tinted={tinted} />
                      </Link>
                      <span className="flex shrink-0 flex-col items-start gap-1.5 whitespace-nowrap sm:items-end">
                        <Link
                          href={project.caseStudyHref}
                          className="font-mono-tight text-[11px] text-ink-3 transition-colors duration-[var(--dur)] hover:text-accent-2"
                        >
                          case study &#8594;
                        </Link>
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono-tight text-[11px] text-ink-3 transition-colors duration-[var(--dur)] hover:text-accent-2"
                        >
                          {project.hrefLabel} &#8599;
                        </a>
                      </span>
                    </>
                  ) : (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full flex-wrap items-baseline justify-between gap-x-4.5 gap-y-2.5"
                    >
                      <ProjectMeta project={project} tinted={tinted} />
                      <span className="font-mono-tight text-[11px] whitespace-nowrap text-ink-3">
                        {project.hrefLabel} &#8599;
                      </span>
                    </a>
                  )}
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
