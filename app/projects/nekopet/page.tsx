import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

const title = `nekopet, case study - ${siteConfig.name}`;
const description =
  "A desktop pet for Wayland, in Rust. Speaks wlr-layer-shell directly, reads raw key events from /dev/input, renders through shared-memory buffers. Its eyes follow the cursor.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "article",
    title,
    description,
    url: `${siteConfig.url}/projects/nekopet`,
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
    title: "Sit on top, take nothing",
    body: "A wlr-layer-shell surface on the top layer, with keyboard interactivity explicitly set to none. It draws over every window but never steals a keystroke or blocks a click on what is behind it.",
  },
  {
    step: "02",
    title: "One sprite sheet, seven states",
    body: "Idle, typing, drag, stretch, bounce, lean, and a cursor-swipe pounce all read from a single 32x32-per-frame sheet, one row per animation, frames stopping at the first fully transparent cell. Nearest-neighbor upscaling keeps the pixel art sharp at any size.",
  },
  {
    step: "03",
    title: "Detect typing without a keyboard",
    body: "A layer surface with no keyboard interactivity never receives wl_keyboard events, so there is no protocol-level way to know the user is typing. Nekopet opens every /dev/input/eventN device directly and parses the raw 24-byte input_event struct itself, watching for key-press codes on its own thread per device.",
  },
  {
    step: "04",
    title: "Eyes that follow the cursor",
    body: "Wayland gives a client no way to query the pointer position outside its own surface, so tracking only works while the cursor is over the cat. Pupil offsets are computed from pointer-motion events against hardcoded source-pixel coordinates on the sprite.",
  },
];

const results = [
  { value: "1,000", label: "Lines of Rust for input, rendering, and the Wayland client" },
  { value: "7", label: "States driven from one event loop, no animation library" },
  { value: "0", label: "External processes, no Python, no Electron, one native binary" },
];

export default function NekopetCaseStudy() {
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
          nekopet
        </h1>
        <p className="mt-4 max-w-[36em] text-[clamp(17px,2vw,20px)] leading-[1.5] text-ink-2 text-pretty">
          A desktop pet for Wayland, in Rust. Speaks wlr-layer-shell
          directly, reads raw key events from /dev/input, renders through
          shared-memory buffers. Its eyes follow the cursor.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-6 border-t border-b border-line py-5">
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Role
            </span>
            <span className="text-[14px] text-ink-2">Open source, solo build</span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Stack
            </span>
            <span className="text-[14px] text-ink-2">
              Rust, wayland-client, smithay-client-toolkit
            </span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Source
            </span>
            <a
              href="https://github.com/dhruvkumar1805/nekopet"
              target="_blank"
              rel="noreferrer"
              className="text-[14px] text-ink-2 transition-colors duration-[var(--dur)] hover:text-accent-2"
            >
              github &#8599;
            </a>
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.14} className="mt-14">
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          The problem
        </h2>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          I wanted a desktop pet on Hyprland, the kind that used to live on
          Windows desktops years ago. Wayland has no equivalent of an
          always-on-top, click-through, input-transparent window that a
          compositor just hands you. Getting that overlay right meant
          talking to the compositor&rsquo;s own protocols, not a toolkit
          abstraction built for normal application windows.
        </p>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          The harder problem showed up once the overlay worked: a surface
          that correctly asks for no keyboard interactivity also never gets
          told when a key is pressed. There was no protocol-legal way to
          know the user was typing.
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
          The keyboard watcher opens every /dev/input/eventN node it can and
          spawns a thread per device instead of filtering to actual
          keyboards first. It works because a typical machine only has a
          handful of event nodes, but it is the kind of shortcut that stops
          being fine on a machine with more input devices attached.
        </p>
      </Reveal>

      <Reveal delay={0.06} className="mt-16 flex flex-wrap gap-3">
        <a
          href="https://github.com/dhruvkumar1805/nekopet"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono-tight text-[13px] font-medium text-paper transition-transform duration-[var(--dur)] hover:-translate-y-0.5"
        >
          View on GitHub &#8599;
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
