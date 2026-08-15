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

      <div className="mt-[clamp(28px,4vw,48px)] flex flex-col gap-[clamp(22px,3vw,30px)]">
        <Reveal y={16} delay={0.06}>
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
            <h1 className="m-0 text-[clamp(26px,3.2vw,36px)] leading-[1.02] font-semibold tracking-[-0.03em] text-ink">
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
          className="max-w-[740px] text-[clamp(28px,3.6vw,40px)] leading-[1.15] font-semibold tracking-[-0.024em] text-pretty"
        >
          <span className="text-ink">
            I build retrieval systems and real-time backends,
          </span>{" "}
          <span className="text-ink-2">sometimes further down than that.</span>
        </Reveal>

        <Reveal
          y={16}
          delay={0.18}
          className="flex flex-col overflow-hidden rounded-xl border border-line bg-paper-2 sm:h-[248px] sm:flex-row"
        >
          <div className="flex min-w-0 flex-1 items-center p-[clamp(20px,3vw,28px)]">
            <p className="text-[clamp(15px,1.6vw,17px)] leading-[1.6] text-pretty">
              <span className="text-ink-2">
                RAG pipelines, row-level-secure Postgres, a Rust desktop
                pet that talks to Wayland directly.
              </span>{" "}
              <span className="text-ink-3">
                Started with Android ROMs and device trees in 2021, which
                is still why I like knowing what&rsquo;s underneath.
              </span>
            </p>
          </div>
          <div className="relative aspect-[4/5] w-full shrink-0 border-t border-line sm:h-full sm:w-auto sm:border-t-0 sm:border-l">
            <Image
              src="/images/avatar.jpg"
              alt={siteConfig.name}
              fill
              priority
              sizes="(min-width: 640px) 34vw, 100vw"
              className="object-cover object-[50%_20%]"
            />
            <span className="absolute bottom-2.5 left-2.5 rounded-md border border-line/70 bg-paper/85 px-2 py-1 font-mono-tight text-[9.5px] tracking-[0.04em] text-ink-3 backdrop-blur-sm">
              avatar.jpg
            </span>
          </div>
        </Reveal>

        <Reveal
          y={16}
          delay={0.24}
          className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-3"
        >
          <div className="border-t border-line pt-2.5">
            <div className="font-mono-tight text-[10px] tracking-[0.14em] text-ink-3 uppercase">
              Focus
            </div>
            <div className="mt-1 text-[13px] tracking-[-0.01em] text-ink-2">
              Retrieval systems, real-time backends
            </div>
          </div>
          <div className="border-t border-line pt-2.5">
            <div className="font-mono-tight text-[10px] tracking-[0.14em] text-ink-3 uppercase">
              Started
            </div>
            <div className="mt-1 text-[13px] tracking-[-0.01em] text-ink-2">
              2019
            </div>
          </div>
          <div className="border-t border-line pt-2.5">
            <div className="font-mono-tight text-[10px] tracking-[0.14em] text-ink-3 uppercase">
              Mail
            </div>
            <div className="mt-1 flex items-center gap-2 text-[13px] tracking-[-0.01em]">
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-ink-2 transition-colors duration-[var(--dur)] hover:text-accent-2"
              >
                {siteConfig.email}
              </a>
              <CopyButton value={siteConfig.email} />
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-0 border-t border-b border-line">
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
