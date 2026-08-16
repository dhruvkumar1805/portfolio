import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

const title = `Bunny's Cafe, case study - ${siteConfig.name}`;
const description =
  "A real-time ordering system for the cafe behind my college, pitched and built solo. QR-code table entry, phone OTP auth, live order status, Razorpay checkout, and an admin dashboard the owner actually uses.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "article",
    title,
    description,
    url: `${siteConfig.url}/projects/bunnys-cafe`,
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
    title: "Order",
    body: "A QR code on the table opens the menu in the browser, no app install. Items, variants, and add-ons are configured in an admin panel, with per-order price snapshots so a later menu change never rewrites a past receipt.",
  },
  {
    step: "02",
    title: "Verify",
    body: "Firebase phone OTP, rate-limited to 3 requests per phone-and-IP pair in a 5-minute window. A successful login sets a 7-day httpOnly JWT cookie so a regular does not re-verify every visit.",
  },
  {
    step: "03",
    title: "Pay",
    body: "Razorpay checkout or cash at the counter. Online payments are verified server-side by recomputing the HMAC-SHA256 signature before an order is ever written, so a forged client payload cannot mark itself paid.",
  },
  {
    step: "04",
    title: "Track",
    body: "The order screen holds open a Server-Sent Events stream that polls the database every 1.5 seconds and only pushes a diff when the order actually changes state, with Web Push as a fallback so a closed tab still gets notified when the order is ready.",
  },
];

const results = [
  { value: "+35%", label: "Checkout completion after launch" },
  { value: "1.5s", label: "Order status refresh, diffed not polled blind" },
  { value: "195", label: "Commits shipped solo, requirements to handoff" },
];

export default function BunnysCafeCaseStudy() {
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
          Bunny&rsquo;s Cafe
        </h1>
        <p className="mt-4 max-w-[36em] text-[clamp(17px,2vw,20px)] leading-[1.5] text-ink-2 text-pretty">
          A real-time ordering system for the cafe behind my college, pitched
          and built solo. QR-code table entry, phone OTP auth, live order
          status, Razorpay checkout, and an admin dashboard the owner
          actually uses.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-6 border-t border-b border-line py-5">
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Role
            </span>
            <span className="text-[14px] text-ink-2">
              Pitched, designed &amp; built solo
            </span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Stack
            </span>
            <span className="text-[14px] text-ink-2">
              Next.js, Prisma, PostgreSQL, Razorpay
            </span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.14em] text-ink-3 uppercase">
              Live
            </span>
            <a
              href="https://bunnyscafe.in"
              target="_blank"
              rel="noreferrer"
              className="text-[14px] text-ink-2 transition-colors duration-[var(--dur)] hover:text-accent-2"
            >
              bunnyscafe.in &#8599;
            </a>
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.14} className="mt-14">
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          The problem
        </h2>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          The cafe behind my college was jammed every lunch break: one
          counter, one queue, and forty minutes of class between orders. The
          bottleneck was not the kitchen, it was students standing in line to
          say what they wanted.
        </p>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          I pitched the owner on replacing the line with a phone in every
          student&rsquo;s hand, then built and shipped the whole system
          myself: menu to kitchen to payment to handoff, with nothing
          bolted on from a third-party ordering platform.
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
          Behind the counter
        </h2>
        <p className="mt-4 max-w-[36em] text-[16px] leading-[1.65] text-ink-2 text-pretty">
          The kitchen side got the same amount of attention as the ordering
          flow: a kanban board for incoming orders, a walk-in POS for the
          counter when a customer skips the QR code entirely, coupon codes
          with per-order minimums and usage caps, and a sales dashboard the
          owner can filter by day, week, or month to see cash versus online
          split.
        </p>
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
          Order status updates by polling the database every 1.5 seconds and
          diffing the result before pushing. It works, and it is honest
          about what SSE on a serverless platform can do without a
          persistent backend, but a proper LISTEN/NOTIFY channel or a queue
          would replace the poll with an actual push and cut the delay
          further.
        </p>
      </Reveal>

      <Reveal delay={0.06} className="mt-16 flex flex-wrap gap-3">
        <a
          href="https://bunnyscafe.in"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono-tight text-[13px] font-medium text-paper transition-transform duration-[var(--dur)] hover:-translate-y-0.5"
        >
          Visit Bunny&rsquo;s Cafe &#8599;
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
