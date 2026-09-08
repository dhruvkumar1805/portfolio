import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import DesktopRoot from "@/components/desktop/DesktopRoot";

const title = `${siteConfig.name} — desktop session`;
const description =
  "My portfolio as a tiling window manager: real dwindle splits, five workspaces, a shell that answers back, and nekopet walking over the windows. Runs in your browser.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    url: `${siteConfig.url}/desktop`,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function DesktopPage() {
  return (
    <>
      {/* Fallback for crawlers and no-JS: the session mounts over this. */}
      <div className="py-24 text-center">
        <h1 className="m-0 text-[clamp(28px,4vw,40px)] leading-[1.05] font-semibold tracking-[-0.03em] text-ink">
          Desktop session
        </h1>
        <p className="mx-auto mt-4 max-w-[46ch] text-[15px] leading-[1.6] text-ink-2 text-pretty">
          {description} It needs JavaScript, because it is a window manager.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block font-mono-tight text-[12px] tracking-[0.1em] text-accent-2 uppercase"
        >
          ← back to the normal site
        </Link>
      </div>
      <DesktopRoot />
    </>
  );
}
