import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 pt-24 text-center">
      <span className="font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-3 uppercase">
        404
      </span>
      <h1 className="m-0 text-[clamp(32px,5vw,48px)] font-medium tracking-[-0.03em] text-ink">
        Nothing built here yet
      </h1>
      <p className="m-0 max-w-[26em] text-[15px] leading-[1.6] text-ink-2">
        This page does not exist. The rest of the site does.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono-tight text-[13px] font-medium text-paper transition-transform duration-[var(--dur)] hover:-translate-y-0.5"
      >
        Back home
      </Link>
    </div>
  );
}
