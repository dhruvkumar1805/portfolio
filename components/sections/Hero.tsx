"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { HiOutlineArrowDown, HiOutlineDocumentText } from "react-icons/hi2";
import { siteConfig } from "@/lib/site-config";
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
          <h1 className="m-0 text-[clamp(26px,3.2vw,36px)] leading-[1.02] font-semibold tracking-[-0.03em] text-ink">
            {siteConfig.name}
          </h1>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono-tight text-[10px] font-medium tracking-[0.14em] text-ink-3 uppercase">
            AI / full-stack engineer
            <span className="text-line">/</span>
            Now at Nomara USA
          </span>
        </Reveal>

        <Reveal
          y={16}
          delay={0.12}
          className="max-w-[740px] text-[clamp(23px,7vw,40px)] leading-[1.18] font-medium tracking-[-0.02em] text-pretty"
        >
          <span className="text-ink">
            I build retrieval systems and real-time backends,
          </span>{" "}
          <span className="text-ink-2">usually a layer deeper than the job asks.</span>
        </Reveal>

        <Reveal
          y={16}
          delay={0.18}
          className="flex flex-col overflow-hidden rounded-xl border border-line bg-paper-2 sm:h-[248px] sm:flex-row"
        >
          <div className="flex min-w-0 flex-1 flex-col justify-between p-[clamp(20px,3vw,28px)]">
            <p className="text-[clamp(15px,1.6vw,17px)] leading-[1.6] text-pretty">
              <span className="text-ink-2">
                RAG pipelines that cite their sources, Postgres locked down
                row by row, a Rust desktop pet that talks straight to
                Wayland.
              </span>{" "}
              <span className="text-ink-3">
                Started in Android device trees back in 2021. Still the
                reason I read the layer underneath before trusting it.
              </span>
            </p>
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-2.5 border-t border-line pt-3.5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 border-b border-transparent font-mono-tight text-[11.5px] font-medium tracking-[0.12em] text-ink-2 uppercase transition-colors duration-[var(--dur)] hover:border-accent-2 hover:text-ink"
                >
                  <s.icon size={13} />
                  {s.label}
                  <span className="text-[10px] text-ink-3">&#8599;</span>
                </a>
              ))}
              <a
                href={siteConfig.resume}
                download
                className="group flex items-center gap-2 border-b border-transparent font-mono-tight text-[11.5px] font-medium tracking-[0.12em] text-ink-2 uppercase transition-colors duration-[var(--dur)] hover:border-accent-2 hover:text-ink"
              >
                <HiOutlineDocumentText size={13} />
                Résumé
                <HiOutlineArrowDown size={12} className="text-ink-3" />
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full shrink-0 border-t border-line sm:aspect-square sm:h-full sm:w-auto sm:border-t-0 sm:border-l">
            <Image
              src="/images/avatar.jpg"
              alt={siteConfig.name}
              fill
              priority
              sizes="(min-width: 640px) 34vw, 100vw"
              className="object-cover object-[50%_20%]"
            />
          </div>
        </Reveal>
      </div>
    </header>
  );
}
