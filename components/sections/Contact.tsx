"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { getIstParts, greetingFor } from "@/lib/ist-clock";
import Reveal from "@/components/ui/Reveal";

export default function Contact() {
  const [clock, setClock] = useState(() => getIstParts());

  useEffect(() => {
    const tick = () => setClock(getIstParts());
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="contact" className="py-(--sp) scroll-mt-23">
      <Reveal className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-3.5 font-mono-tight text-[10.5px] font-medium tracking-[0.16em] text-ink-3 uppercase">
        <span className="flex items-center gap-2.5">
          <span>06</span>
          <span>Contact</span>
        </span>
        <span className="flex items-center gap-2 text-ink-2">
          <span className="relative -translate-y-px inline-flex h-1.5 w-1.5 shrink-0">
            <span className="status-ping absolute inset-0 rounded-full bg-accent-2" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent-2" />
          </span>
          Open to full-time &amp; freelance
        </span>
      </Reveal>

      <Reveal delay={0.06} className="mt-[clamp(24px,3.6vw,36px)]">
        <h2
          suppressHydrationWarning
          className="m-0 text-[clamp(30px,5vw,48px)] leading-[1.08] font-medium tracking-[-0.032em] text-balance"
        >
          <span className="text-ink">It is {clock.time} where I am,</span>{" "}
          <span className="text-ink-2">{greetingFor(clock.hours)}</span>
        </h2>
        <p className="m-0 mt-5 max-w-[36em] text-[16px] leading-[1.6] text-ink-2 text-pretty">
          You are on my clock, so anything you send lands in my day.
          <br />
          Replies usually come within a day.
        </p>
      </Reveal>

      <Reveal delay={0.12} className="mt-[clamp(24px,3.6vw,36px)]">
        <a
          href={`mailto:${siteConfig.email}`}
          className="group flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg bg-ink px-[clamp(20px,3vw,32px)] py-[clamp(18px,2.6vw,26px)] shadow-[0_16px_36px_-18px_rgba(0,0,0,0.4)] transition-transform duration-[var(--dur)] hover:-translate-y-0.5"
        >
          <span className="font-mono-tight text-[clamp(17px,2.2vw,22px)] font-medium tracking-[-0.01em] text-paper">
            {siteConfig.email}
          </span>
          <span className="flex items-center gap-2 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-paper/70 uppercase transition-colors duration-[var(--dur)] group-hover:text-paper">
            Write to me
            <span aria-hidden="true">&#8594;</span>
          </span>
        </a>
      </Reveal>
    </section>
  );
}
