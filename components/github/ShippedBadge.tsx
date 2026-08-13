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
      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono-tight text-[10.5px] font-bold whitespace-nowrap"
      style={{
        borderColor: shipped ? "#34d399" : "var(--line)",
        background: shipped ? "rgba(52,211,153,.08)" : "transparent",
        color: shipped ? "#34d399" : "var(--ink-3)",
        boxShadow: shipped ? "0 0 14px rgba(52,211,153,.18)" : undefined,
      }}
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: shipped ? "#34d399" : "var(--ink-3)" }}
      />
      {shipped ? (
        <>
          shipped
          {count > 0 && (
            <span
              className="rounded-sm px-1 py-px text-[9px] leading-tight"
              style={{ background: "rgba(52,211,153,.2)", color: "#34d399" }}
            >
              +{count}
            </span>
          )}
        </>
      ) : (
        "nothing yet"
      )}
    </motion.span>
  );
}
