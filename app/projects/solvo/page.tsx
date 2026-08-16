import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

const title = `Solvo, case study - ${siteConfig.name}`;
const description =
  "An embeddable AI support widget. One script tag, and a site answers its own visitors from its own docs, with the source attached to every answer.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "article",
    title,
    description,
    url: `${siteConfig.url}/projects/solvo`,
    images: ["/images/avatar.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/avatar.jpg"],
  },
};

const howItWorks = [
  {
    step: "01",
    title: "Ingest",
    body: "Docs are chunked at 400 words with a 50-word overlap, keeping enough context at each boundary that a chunk still makes sense read on its own.",
  },
  {
    step: "02",
    title: "Embed & store",
    body: "Gemini embeddings, stored in Postgres with pgvector. Retrieval lives next to the data it retrieves from instead of a separate vector service.",
  },
  {
    step: "03",
    title: "Retrieve & answer",
    body: "Nearest chunks go to Gemini 2.5 Flash with the retrieved text as the only source. The model answers from what it was given, not from memory.",
  },
  {
    step: "04",
    title: "Embed anywhere",
    body: "A single script tag mounts the widget in an isolated root. No build step and no framework requirement on the customer's site.",
  },
];

const results = [
  { value: "90%", label: "Query relevance accuracy across the evaluation set" },
  { value: "<2s", label: "From question to cited answer" },
  { value: "1", label: "Script tag to install, no backend on the customer's side" },
];

export default function SolvoCaseStudy() {
  return (
    <div className="mx-auto max-w-[760px] px-[clamp(20px,5vw,34px)] pt-[clamp(72px,10vw,96px)] pb-24">
      <Reveal>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono-tight text-[11.5px] font-medium tracking-[0.1em] text-ink-2 uppercase transition-colors duration-[var(--dur)] hover:text-accent-2"
        >
          &#8592; {siteConfig.name}
        </Link>
      </Reveal>

      <Reveal delay={0.06} className="mt-8">
        <h1 className="m-0 text-[clamp(40px,7vw,64px)] leading-[0.95] font-semibold tracking-[-0.03em] text-ink">
          Solvo
        </h1>
        <p className="mt-4 max-w-[36em] text-[clamp(17px,2vw,20px)] leading-[1.5] text-ink-2 text-pretty">
          An embeddable AI support widget. One script tag, and a site answers
          its own visitors from its own docs, with the source attached to
          every answer.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-6 border-t border-b border-line py-5">
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Role
            </span>
            <span className="text-[14px] text-ink-2">Sole designer & engineer</span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Stack
            </span>
            <span className="text-[14px] text-ink-2">Next.js 16, Prisma, pgvector</span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Live
            </span>
            <a
              href="https://solvochat.com"
              target="_blank"
              rel="noreferrer"
              className="text-[14px] text-ink-2 transition-colors duration-[var(--dur)] hover:text-accent-2"
            >
              solvochat.com &#8599;
            </a>
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.12} className="mt-10">
        <div className="overflow-hidden rounded-[5px] border border-line">
          <Image
            src="/images/projects/solvo-dashboard.jpg"
            alt="Solvo admin dashboard: conversation volume, AI resolution rate, and recent chats"
            width={2400}
            height={1350}
            sizes="(min-width: 760px) 760px, 100vw"
            className="w-full"
          />
        </div>
      </Reveal>

      <Reveal delay={0.14} className="mt-14">
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          The problem
        </h2>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          Support chatbots fail in one of two ways. They either know nothing
          about the product they&rsquo;re bolted onto, or they invent answers
          that sound right. Both cost more trust than they save time.
        </p>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          The bar I set: a visitor should be able to check the answer. If the
          widget can&rsquo;t point at the paragraph it came from, it
          shouldn&rsquo;t say it.
        </p>
      </Reveal>

      <Reveal delay={0.06} className="mt-14">
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          How it works
        </h2>
        <div className="mt-4 flex flex-col">
          {howItWorks.map((item, i) => (
            <div
              key={item.step}
              className={`flex gap-5 border-t border-line py-6 ${
                i === howItWorks.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="shrink-0 font-mono-tight text-[13px] text-ink-3 tabular-nums">
                {item.step}
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-[17px] font-medium tracking-[-0.01em] text-ink">
                  {item.title}
                </span>
                <span className="max-w-[32em] text-[15px] leading-[1.6] text-ink-2 text-pretty">
                  {item.body}
                </span>
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.06} className="mt-14">
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          Result
        </h2>
        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
          {results.map((r) => (
            <div key={r.label} className="flex flex-col gap-2 rounded-xl border border-line p-5">
              <span className="font-mono-tight text-[26px] font-semibold tracking-[-0.02em] text-accent-2 tabular-nums">
                {r.value}
              </span>
              <span className="text-[13.5px] leading-[1.45] text-ink-2 text-pretty">
                {r.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.06} className="mt-14">
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          What I would change next
        </h2>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          Chunk size is a blunt instrument. 400 words works for docs, badly
          for changelogs. The next version segments on document structure
          instead of word count, and re-ranks retrieved chunks before they
          reach the model.
        </p>
      </Reveal>

      <Reveal delay={0.06} className="mt-16 flex flex-wrap gap-3">
        <a
          href="https://solvochat.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono-tight text-[13px] font-medium text-paper transition-transform duration-[var(--dur)] hover:-translate-y-0.5"
        >
          Visit Solvo &#8599;
        </a>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-mono-tight text-[13px] font-medium text-ink-2 transition-colors duration-[var(--dur)] hover:text-ink"
        >
          Back to portfolio
        </Link>
      </Reveal>
    </div>
  );
}
