"use client";

import Image from "next/image";
import { education, projects, siteConfig, stack, work } from "@/lib/site-config";
import type { WmWindow } from "@/lib/wm/types";
import Terminal from "../Terminal";

export default function AppContent({
  win,
  focused,
  autoRun,
}: {
  win: WmWindow;
  focused: boolean;
  autoRun?: string;
}) {
  if (win.app === "terminal") {
    return <Terminal id={win.id} focused={focused} autoRun={autoRun} />;
  }
  if (win.app === "resume") return <ResumeApp />;

  return (
    <div className="wm-scroll h-full overflow-y-auto px-4 py-3.5">
      {win.app === "about" && <AboutApp />}
      {win.app === "projects" && <ProjectsApp />}
      {win.app === "work" && <WorkApp />}
      {win.app === "stack" && <StackApp />}
      {win.app === "contact" && <ContactApp />}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
      {children}
    </p>
  );
}

function AboutApp() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center gap-3">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line">
          <Image
            src="/images/avatar.jpg"
            alt={siteConfig.name}
            fill
            sizes="44px"
            className="object-cover object-[50%_20%]"
          />
        </span>
        <span className="min-w-0">
          <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-ink">
            {siteConfig.name}
          </p>
          <p className="font-mono-tight text-[10px] tracking-[0.12em] text-ink-3 uppercase">
            AI / full-stack · Nomara USA
          </p>
        </span>
      </div>

      <p className="text-[14.5px] leading-[1.45] font-medium tracking-[-0.01em] text-pretty">
        <span className="text-ink">I build systems, then go a layer deeper</span>{" "}
        <span className="text-ink-2">and break them before someone else does.</span>
      </p>

      <p className="text-[12.5px] leading-[1.6] text-ink-2 text-pretty">
        RAG pipelines that cite their sources, a client platform&apos;s RLS closed hole by
        hole, a Rust desktop pet that talks straight to Wayland. Started in Android device
        trees back in 2021, still the reason I read the layer underneath before trusting it.
      </p>

      <div className="rounded-md border border-line bg-paper-2 p-2.5">
        <Label>You are inside</Label>
        <p className="text-[12px] leading-[1.55] text-ink-2">
          A tiling window manager written for this page: real dwindle splits, five
          workspaces, a shell that answers back. Nothing here is a screenshot.
        </p>
      </div>

      <div className="border-t border-line pt-2.5">
        <Label>{education.period}</Label>
        <p className="text-[12.5px] text-ink-2">
          {education.degree}, {education.school}
        </p>
      </div>
    </div>
  );
}

function ProjectsApp() {
  return (
    <div className="flex flex-col gap-2.5">
      {projects.map((p) => (
        <article key={p.slug} className="rounded-md border border-line bg-paper-2 p-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono-tight text-[10px] text-ink-3">{p.index}</span>
            <h3 className="m-0 flex-1 text-[13.5px] font-semibold tracking-[-0.01em] text-ink">
              {p.title}
            </h3>
            {p.metricValue && (
              <span className="font-mono-tight text-[12px] font-medium text-accent-text">
                {p.metricValue}
              </span>
            )}
          </div>
          <p className="mt-1 font-mono-tight text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">
            {p.tag}
          </p>
          <p className="mt-2 text-[12.5px] leading-[1.55] text-ink-2 text-pretty">
            {p.description}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {p.stack.map((s) => (
              <span key={s} className="font-mono-tight text-[10px] text-ink-3">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-2">
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="font-mono-tight text-[11px] font-medium text-ink-2 transition-colors duration-200 hover:text-accent-2"
            >
              {p.hrefLabel} ↗
            </a>
            {p.caseStudyHref && (
              <a
                href={p.caseStudyHref}
                target="_blank"
                rel="noreferrer"
                className="font-mono-tight text-[11px] text-ink-3 transition-colors duration-200 hover:text-accent-2"
              >
                case study ↗
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function WorkApp() {
  return (
    <div className="flex flex-col gap-4">
      {work.map((entry) => (
        <article key={entry.org} className="border-l border-line pl-3">
          <p className="font-mono-tight text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">
            {entry.period}
          </p>
          <h3 className="mt-1 mb-0 text-[13.5px] font-semibold tracking-[-0.01em] text-ink">
            {entry.role}
          </h3>
          <p className="mt-0.5 font-mono-tight text-[11px] text-accent-text">{entry.org}</p>
          <ul className="mt-2 flex list-none flex-col gap-1.5 p-0">
            {entry.points.map((point) => (
              <li key={point} className="text-[12.5px] leading-[1.55] text-ink-2 text-pretty">
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {entry.stack.map((s) => (
              <span key={s} className="font-mono-tight text-[10px] text-ink-3">
                {s}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function StackApp() {
  return (
    <div className="flex flex-col gap-3.5">
      {stack.map((category) => (
        <section key={category.category}>
          <Label>{category.category}</Label>
          <ul className="flex list-none flex-col gap-1 p-0">
            {category.tools.map((tool) => (
              <li key={tool.name} className="flex items-baseline gap-2">
                <span
                  className={`w-1.5 shrink-0 font-mono-tight text-[11px] ${
                    tool.daily ? "text-accent-2" : "text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  *
                </span>
                <span className="w-[92px] shrink-0 font-mono-tight text-[11.5px] text-ink">
                  {tool.name}
                </span>
                <span className="min-w-0 flex-1 text-[11.5px] leading-[1.45] text-ink-3">
                  {tool.note}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="border-t border-line pt-2 font-mono-tight text-[10px] text-ink-3">
        <span className="text-accent-2">*</span> daily driver
      </p>
    </div>
  );
}

function ContactApp() {
  const links = [
    { label: "email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { label: "github", value: siteConfig.githubHandle, href: siteConfig.github },
    { label: "linkedin", value: "dhruvkumar1805", href: siteConfig.linkedin },
    { label: "x", value: "@dhruvkumar1805", href: siteConfig.twitter },
    { label: "résumé", value: "resume.pdf", href: siteConfig.resume },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] leading-[1.55] text-ink-2 text-pretty">
        Open to interesting problems, contract or full-time. Email lands fastest.
      </p>
      <ul className="flex list-none flex-col gap-0 p-0">
        {links.map((l) => (
          <li key={l.label} className="border-b border-line last:border-b-0">
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-baseline gap-3 py-2 transition-colors duration-200"
            >
              <span className="w-[62px] shrink-0 font-mono-tight text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">
                {l.label}
              </span>
              <span className="min-w-0 flex-1 truncate font-mono-tight text-[12px] text-ink-2 group-hover:text-accent-2">
                {l.value}
              </span>
              <span className="font-mono-tight text-[10px] text-ink-3 group-hover:text-accent-2">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="font-mono-tight text-[10.5px] text-ink-3">
        {siteConfig.location} · {siteConfig.timezone}
      </p>
    </div>
  );
}

function ResumeApp() {
  return (
    <div className="flex h-full flex-col">
      <object
        data={`${siteConfig.resume}#toolbar=0&view=FitH`}
        type="application/pdf"
        className="min-h-0 w-full flex-1 bg-paper-2"
        aria-label="Résumé PDF"
      >
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
          <p className="text-[12.5px] text-ink-2">
            Your browser will not inline a PDF here.
          </p>
          <a
            href={siteConfig.resume}
            target="_blank"
            rel="noreferrer"
            className="font-mono-tight text-[11.5px] text-accent-2 underline underline-offset-4"
          >
            open resume.pdf ↗
          </a>
        </div>
      </object>
    </div>
  );
}
