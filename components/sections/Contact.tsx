import { siteConfig } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

export default function Contact() {
  return (
    <section id="contact" className="py-(--sp) text-center scroll-mt-23">
      <Reveal className="mx-auto flex max-w-[34em] flex-col items-center gap-6">
        <h2 className="m-0 text-[clamp(32px,5.4vw,50px)] leading-[1.02] font-medium tracking-[-0.038em] text-ink text-balance">
          Got something that needs building?
        </h2>
        <p className="m-0 max-w-[28em] text-[16px] leading-[1.6] text-ink-2 text-pretty">
          Open to full-time and freelance work. Email is the fastest way to
          reach me, I answer within a day.
        </p>
        <a
          href={`mailto:${siteConfig.email}`}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono-tight text-[13px] font-medium tracking-[0.02em] text-paper shadow-[0_10px_28px_-10px_rgba(0,0,0,0.3)] transition-transform duration-[var(--dur)] hover:-translate-y-0.5"
        >
          {siteConfig.email}
        </a>
      </Reveal>
    </section>
  );
}
