import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

const title = `CipherOS & DerpFest, case study - ${siteConfig.name}`;
const description =
  "My stock ROM stopped getting updates in school, so I started flashing custom ones just to keep up. That turned into two years as an official maintainer, building and shipping releases from source for a device the manufacturer had moved on from.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "article",
    title,
    description,
    url: `${siteConfig.url}/projects/cipheros`,
    images: ["/images/avatar.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/avatar.jpg"],
  },
};

const whatMaintainingMeant = [
  {
    step: "01",
    title: "Kernel",
    body: "Compiled from source for every release, tracking upstream security patches and folding in the device-specific drivers the stock kernel never shipped.",
  },
  {
    step: "02",
    title: "Device tree",
    body: "Kept current for msm8953, the chipset class the Redmi S2/Y2 shipped on, so a build correctly described the display, radio, and sensors to everything running above it.",
  },
  {
    step: "03",
    title: "Build & release",
    body: "A Jenkins pipeline built and packaged from source. Each release picked up whatever had changed upstream since the last one, not a fixed feature list.",
  },
  {
    step: "04",
    title: "Community",
    body: "Releases went out to whatever remained of the device's owner base, alongside a distributed maintainer team across two ROM projects, with bug triage happening in the release threads themselves.",
  },
];

const results = [
  { value: "2", label: "Official ROMs maintained at once, CipherOS and DerpFest" },
  { value: "2,500+", label: "Installs per release, on a device its maker had stopped supporting" },
  { value: "2021-22", label: "Active maintenance window" },
];

export default function CipherOSCaseStudy() {
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
          CipherOS &amp; DerpFest
        </h1>
        <p className="mt-4 max-w-[36em] text-[clamp(17px,2vw,20px)] leading-[1.5] text-ink-2 text-pretty">
          My stock ROM stopped getting updates in school, so I started
          flashing custom ones just to keep up. That turned into two years
          as an official maintainer, building and shipping releases from
          source for a device the manufacturer had moved on from.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-6 border-t border-b border-line py-5">
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Role
            </span>
            <span className="text-[14px] text-ink-2">
              Official maintainer, 2 ROMs
            </span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Stack
            </span>
            <span className="text-[14px] text-ink-2">
              AOSP, Linux Kernel, msm8953, Jenkins
            </span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Org
            </span>
            <a
              href="https://cipheros.org.in/"
              target="_blank"
              rel="noreferrer"
              className="text-[14px] text-ink-2 transition-colors duration-[var(--dur)] hover:text-accent-2"
            >
              cipheros.org.in &#8599;
            </a>
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.14} className="mt-14">
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          The problem
        </h2>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          My phone, a Redmi S2/Y2 on the msm8953 chipset, stopped getting
          updates almost as soon as I owned it. That is an ordinary
          complaint. What made it stick was that flashing a custom ROM to
          fix it turned out to be more interesting than the phone itself:
          the whole build, AOSP source down to the kernel, was open, and
          nobody was shipping a build for this specific device that felt
          current.
        </p>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          Flashing led to building, and building led to being asked to
          maintain. I ended up an official maintainer on two ROM projects
          for the same device at once.
        </p>
      </Reveal>

      <Reveal delay={0.06} className="mt-14">
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          What maintaining a ROM meant
        </h2>
        <div className="mt-4 flex flex-col">
          {whatMaintainingMeant.map((item, i) => (
            <div
              key={item.step}
              className={`flex gap-5 border-t border-line py-6 ${
                i === whatMaintainingMeant.length - 1 ? "border-b" : ""
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
          Where it stands now
        </h2>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          Custom ROMs as a hobby are basically dead. Manufacturers ship
          longer support windows now, bootloaders lock down harder, and the
          phones worth flashing stopped being worth flashing. I do not think
          that is a loss to mourn, it is just what happens when the problem
          that pulled me in gets solved a different way.
        </p>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          What it left me with was not the ROM. It was being comfortable
          reading kernel source, debugging a build that fails with no stack
          trace to point at, and shipping something a few thousand strangers
          actually installed, before I had written a line of production web
          code.
        </p>
      </Reveal>

      <Reveal delay={0.06} className="mt-16 flex flex-wrap gap-3">
        <a
          href="https://cipheros.org.in/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono-tight text-[13px] font-medium text-paper transition-transform duration-[var(--dur)] hover:-translate-y-0.5"
        >
          Visit cipheros.org.in &#8599;
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
