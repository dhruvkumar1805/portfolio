"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { HiOutlineArrowDown } from "react-icons/hi2";
import { siteConfig } from "@/lib/site-config";
import CopyButton from "@/components/ui/CopyButton";
import VisitorCounter from "@/components/ui/VisitorCounter";
import Reveal from "@/components/ui/Reveal";

const socials = [
  { label: "GitHub", href: siteConfig.github, icon: FaGithub },
  { label: "LinkedIn", href: siteConfig.linkedin, icon: FaLinkedin },
  { label: "X", href: siteConfig.twitter, icon: FaXTwitter },
];

export default function Hero() {
  return (
    <header id="top" className="relative pt-[clamp(92px,12vw,116px)] pb-(--sp)">
      <div className="flex flex-wrap items-center justify-between gap-x-7 gap-y-2 border-b border-line pb-3.5 font-mono-tight text-[10.5px] font-medium tracking-[0.13em] text-ink-3 uppercase">
        <span className="flex items-center gap-2.5">
          <span className="text-ink-2">{siteConfig.location}</span>
          <span className="text-line">/</span>
          <span>{siteConfig.timezone}</span>
        </span>
        <span className="flex items-center gap-4.5 normal-case">
          <VisitorCounter />
        </span>
      </div>

      <div className="mt-[clamp(28px,4vw,48px)] flex flex-col gap-8 sm:flex-row sm:items-stretch sm:gap-[clamp(28px,4vw,48px)]">
        <Reveal
          y={16}
          className="relative mx-auto aspect-[4/5] w-full max-w-[300px] shrink-0 overflow-hidden rounded-xl bg-paper-2 sm:mx-0 sm:aspect-auto sm:w-[36%] sm:max-w-[320px]"
        >
          <Image
            src="/images/avatar.jpg"
            alt={siteConfig.name}
            fill
            priority
            sizes="(min-width: 640px) 36vw, 300px"
            className="object-cover object-[50%_20%]"
          />
        </Reveal>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[clamp(20px,2.8vw,28px)]">
          <Reveal y={16} delay={0.06}>
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
              <h1 className="m-0 text-[clamp(30px,3.8vw,44px)] leading-[1.02] font-semibold tracking-[-0.032em] text-ink">
                {siteConfig.name}
              </h1>
              <span className="flex shrink-0 items-center gap-2 pt-2 font-mono-tight text-[10px] font-medium tracking-[0.14em] text-ink-2 uppercase">
                <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
                  <span className="status-ping absolute inset-0 rounded-full bg-accent-2" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-accent-2" />
                </span>
                Open to full-time &amp; freelance
              </span>
            </div>
            <span className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono-tight text-[10px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              AI / full-stack engineer
              <span className="text-line">/</span>
              Now at Nomara USA
            </span>
          </Reveal>

          <Reveal
            y={16}
            delay={0.12}
            className="text-[clamp(19px,2.1vw,23px)] leading-[1.5] tracking-[-0.012em] text-pretty"
          >
            <span className="text-ink">
              I build retrieval systems and real-time backends.
            </span>{" "}
            <span className="text-ink-2">
              Sometimes further down than that: RAG pipelines,
              row-level-secure Postgres, a Rust desktop pet that talks to
              Wayland directly.
            </span>
          </Reveal>

          <Reveal
            y={16}
            delay={0.18}
            className="flex flex-col gap-1.5 font-mono-tight text-[12px] tracking-[-0.01em] text-ink-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2"
          >
            <span>
              <span className="text-[10px] tracking-[0.14em] uppercase">
                Focus{" "}
              </span>
              <span className="text-ink-2">
                Retrieval systems, real-time backends
              </span>
            </span>
            <span className="sm:before:mr-2 sm:before:text-line sm:before:content-['·']">
              <span className="text-[10px] tracking-[0.14em] uppercase">
                Started{" "}
              </span>
              <span className="text-ink-2">2019</span>
            </span>
            <span className="flex items-baseline gap-2 sm:before:mr-1 sm:before:text-line sm:before:content-['·']">
              <span className="text-[10px] tracking-[0.14em] uppercase">
                Mail{" "}
              </span>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-ink-2 transition-colors duration-[var(--dur)] hover:text-accent-2"
              >
                {siteConfig.email}
              </a>
              <CopyButton value={siteConfig.email} />
            </span>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.24} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-0 border-t border-b border-line">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 border-b border-transparent py-3.5 font-mono-tight text-[11.5px] font-medium tracking-[0.12em] text-ink-2 uppercase transition-colors duration-[var(--dur)] hover:border-accent-2 hover:text-ink"
          >
            <s.icon size={13} />
            {s.label}
            <span className="text-[10px] text-ink-3">&#8599;</span>
          </a>
        ))}
        <a
          href={siteConfig.resume}
          download
          className="group flex items-center gap-2 border-b border-transparent py-3.5 font-mono-tight text-[11.5px] font-medium tracking-[0.12em] text-ink-2 uppercase transition-colors duration-[var(--dur)] hover:border-accent-2 hover:text-ink"
        >
          Résumé
          <HiOutlineArrowDown size={12} className="text-ink-3" />
        </a>
      </Reveal>
    </header>
  );
}
