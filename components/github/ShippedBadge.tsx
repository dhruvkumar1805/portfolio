"use client";

import { motion } from "framer-motion";

export default function ShippedBadge({
  shipped,
  count,
}: {
  shipped: boolean;
  count: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
      className="inline-flex items-center gap-2 font-mono-tight text-[10.5px] font-medium tracking-[0.08em] whitespace-nowrap uppercase"
      style={{ color: shipped ? "#34d399" : "var(--ink-3)" }}
    >
      <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
        {shipped && (
          <span
            className="status-ping absolute inset-0 rounded-full"
            style={{ background: "#34d399" }}
          />
        )}
        <span
          className="relative h-1.5 w-1.5 rounded-full"
          style={{ background: shipped ? "#34d399" : "var(--ink-3)" }}
        />
      </span>
      {shipped ? <>shipped{count > 0 && <> &middot; +{count}</>}</> : "nothing yet"}
    </motion.span>
  );
}
