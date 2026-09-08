"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * The way into /desktop. Backtick boots it, the way a drop-down terminal
 * would, and the strip itself is the click target for everyone else.
 */
export default function BootDesktop() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/desktop");

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "`" && e.key !== "~") return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      router.push("/desktop");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <button
      type="button"
      onClick={() => router.push("/desktop")}
      className="group flex w-full items-center gap-3 rounded-xl border border-line bg-paper-2 px-4 py-3 text-left transition-colors duration-[var(--dur)] hover:border-accent-2/60"
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="status-ping absolute inline-flex h-full w-full rounded-full bg-accent-2" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-2" />
      </span>

      <span className="min-w-0 flex-1 text-[13px] leading-[1.5] text-ink-2 text-pretty">
        <span className="text-ink">This site also runs as a tiling window manager.</span>{" "}
        <span className="text-ink-3">
          Splits, workspaces, a shell, and a cat that walks over the windows.
        </span>
      </span>

      <span className="hidden shrink-0 items-center gap-2 font-mono-tight text-[10.5px] font-medium tracking-[0.12em] text-ink-3 uppercase sm:flex">
        press
        <kbd className="rounded border border-line bg-paper px-1.5 py-0.5 text-[11px] text-ink-2 normal-case">
          `
        </kbd>
      </span>

      <span className="shrink-0 font-mono-tight text-[11px] font-medium tracking-[0.12em] text-ink-2 uppercase transition-colors duration-[var(--dur)] group-hover:text-accent-2">
        boot ↗
      </span>
    </button>
  );
}
