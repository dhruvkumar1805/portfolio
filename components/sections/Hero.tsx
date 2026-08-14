"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { HiOutlineArrowDown } from "react-icons/hi2";
import { siteConfig } from "@/lib/site-config";
import CopyButton from "@/components/ui/CopyButton";
import TiltCard from "@/components/ui/TiltCard";
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

      <Reveal
        y={16}
        className="mt-[clamp(28px,4vw,44px)] flex flex-wrap items-start justify-between gap-x-6 gap-y-3"
      >
        <div className="min-w-0">
          <h1 className="m-0 text-[clamp(32px,4.4vw,42px)] leading-[1.05] font-semibold tracking-[-0.032em] text-ink">
            {siteConfig.name}
          </h1>
          <span className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono-tight text-[10.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
            AI / full-stack engineer
            <span className="text-line">/</span>
            Now at Nomara USA
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-2 pt-1.5 font-mono-tight text-[10.5px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
            <span className="status-ping absolute inset-0 rounded-full bg-accent-2" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent-2" />
          </span>
          Open to full-time &amp; freelance
        </span>
      </Reveal>

      <Reveal
        y={16}
        delay={0.06}
        className="mt-[clamp(18px,2.6vw,28px)] text-[clamp(26px,3.6vw,38px)] leading-[1.18] font-medium tracking-[-0.024em] text-balance"
      >
        <span className="block text-ink">
          I build retrieval systems and real-time backends,
        </span>
        <span className="block text-ink-2">and the layer underneath them.</span>
      </Reveal>

      <div className="relative mt-[clamp(22px,3.2vw,34px)]">
        <Reveal
          y={16}
          delay={0.12}
          className="rounded-lg border border-line bg-paper-2 py-[clamp(20px,3vw,28px)] pr-[200px] pl-[clamp(20px,3vw,32px)] sm:pr-[296px]"
        >
          <p className="m-0 max-w-[38em] text-[15px] leading-[1.6] tracking-[-0.01em] text-pretty">
            <span className="text-ink">
              I take products the whole way: RAG pipelines, real-time
              ordering systems, row-level-secure backends. Sometimes further
              down than that, a Rust desktop pet that talks to Wayland
              directly.
            </span>{" "}
            <span className="text-ink-2">
              Started with Android ROMs and device trees, which is still why
              I like knowing what&rsquo;s underneath.
            </span>
          </p>
        </Reveal>
        <Reveal
          y={10}
          delay={0.24}
          className="absolute top-1/2 right-4 w-[168px] -translate-y-1/2 rotate-2 sm:right-6 sm:w-[240px]"
        >
          <TiltCard className="relative aspect-square overflow-hidden rounded-lg shadow-[0_20px_40px_-18px_rgba(0,0,0,0.4),inset_0_0_0_1.5px_color-mix(in_oklch,var(--accent-2)_32%,transparent)]">
            <Image
              src="/images/avatar.jpg"
              alt={siteConfig.name}
              fill
              priority
              sizes="(min-width: 640px) 240px, 168px"
              className="object-cover object-[50%_25%]"
            />
          </TiltCard>
        </Reveal>
      </div>

      <Reveal
        delay={0.18}
        className="mt-[clamp(24px,3.4vw,36px)] grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-8 gap-y-5 sm:mt-20"
      >
        <div className="border-t border-line pt-3">
          <span className="block font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
            Focus
          </span>
          <span className="mt-1.5 block text-[13.5px] leading-[1.45] tracking-[-0.01em] text-ink-2 text-pretty">
            Retrieval systems, real-time backends
          </span>
        </div>
        <div className="border-t border-line pt-3">
          <span className="block font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
            Started
          </span>
          <span className="mt-1.5 block text-[13.5px] leading-[1.45] tracking-[-0.01em] text-ink-2 text-pretty">
            Android ROMs and device trees, 2019
          </span>
        </div>
        <div className="border-t border-line pt-3">
          <span className="block font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
            Mail
          </span>
          <span className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-[13.5px] leading-[1.45] tracking-[-0.01em] text-ink-2 break-all transition-colors duration-[var(--dur)] hover:text-accent-2"
            >
              {siteConfig.email}
            </a>
            <CopyButton value={siteConfig.email} />
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.24} className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-0 border-t border-b border-line">
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
