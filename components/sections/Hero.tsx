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
        className="mt-[clamp(26px,4vw,42px)] flex flex-col gap-px overflow-hidden rounded-[5px] border border-line bg-line"
      >
        <div className="flex flex-wrap items-stretch gap-px overflow-hidden">
          <div className="flex min-w-0 flex-[6_1_300px] flex-col gap-4 bg-paper px-[clamp(22px,3.2vw,34px)] pt-[clamp(22px,3.2vw,34px)] pb-[clamp(24px,3.4vw,36px)]">
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono-tight text-[10.5px] font-medium tracking-[0.15em] text-ink-3 uppercase">
              AI / full-stack engineer
              <span className="text-line">&mdash;</span>
              <span>Now at Nomara USA</span>
            </span>
            <h1 className="m-0 text-[clamp(40px,5.4vw,62px)] leading-[0.94] font-semibold tracking-[-0.042em]">
              {siteConfig.name}
            </h1>
            <p className="m-0 max-w-[26em] text-[clamp(17px,1.9vw,19.5px)] leading-[1.5] tracking-[-0.014em] text-ink text-pretty">
              I take products the whole way:{" "}
              <span className="text-ink-2">
                RAG pipelines, real-time ordering systems, row-level-secure
                backends.
              </span>{" "}
              Sometimes further down than that, a Rust desktop pet that talks
              to Wayland directly.
            </p>
            <span className="flex items-center gap-2.5 pt-2 font-mono-tight text-[10.5px] font-medium tracking-[0.14em] text-ink-2 uppercase">
              <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
                <span className="status-ping absolute inset-0 rounded-full bg-accent-2" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-accent-2" />
              </span>
              Open to full-time &amp; freelance
            </span>
          </div>

          <TiltCard className="relative aspect-[4/5] flex-[1_1_232px] overflow-hidden bg-paper-2">
            <Image
              src="/images/avatar.jpg"
              alt={siteConfig.name}
              fill
              priority
              sizes="(min-width: 768px) 232px, 100vw"
              className="object-cover object-[50%_25%]"
            />
          </TiltCard>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(188px,1fr))] gap-px">
          <span className="flex min-w-0 flex-col justify-center gap-1.5 bg-paper-2 px-[clamp(22px,3.2vw,34px)] py-4">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Focus
            </span>
            <span className="text-[13.5px] leading-[1.45] tracking-[-0.01em] text-ink-2 text-pretty">
              Retrieval systems, real-time backends
            </span>
          </span>
          <span className="flex min-w-0 flex-col justify-center gap-1.5 bg-paper-2 px-[clamp(22px,3.2vw,34px)] py-4">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Started
            </span>
            <span className="text-[13.5px] leading-[1.45] tracking-[-0.01em] text-ink-2 text-pretty">
              Android ROMs and device trees, 2019
            </span>
          </span>
          <span className="flex min-w-0 flex-col justify-center gap-1.5 bg-paper-2 px-[clamp(22px,3.2vw,34px)] py-4">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Mail
            </span>
            <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-[13.5px] leading-[1.45] tracking-[-0.01em] text-ink-2 break-all transition-colors duration-[var(--dur)] hover:text-accent-2"
              >
                {siteConfig.email}
              </a>
              <CopyButton value={siteConfig.email} />
            </span>
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-0 border-t border-b border-line">
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
