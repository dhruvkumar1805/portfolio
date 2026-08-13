"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable, ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy email address"
      className="ml-1 inline-flex min-h-6.5 items-center border-b border-line px-0.5 py-1.5 font-mono-tight text-[9.5px] font-medium tracking-[0.13em] text-ink-3 uppercase transition-colors duration-[var(--dur)] hover:border-accent-2 hover:text-ink"
    >
      <span className="relative inline-block h-3 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "copied" : "copy"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            {copied ? "copied" : "copy"}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
