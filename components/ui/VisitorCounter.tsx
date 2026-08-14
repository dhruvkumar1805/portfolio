"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa6";

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  useEffect(() => {
    fetch("/api/visitor")
      .then((r) => {
        if (!r.ok) throw new Error(`visitor api responded ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setCount(d.count);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading" || (status === "ready" && count === null)) {
    return null;
  }

  if (status === "error") {
    return null;
  }

  const digits = String(count).padStart(3, "0").split("");

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-1.5"
      title="visitors"
    >
      <FaEye size={12} className="text-ink-3" aria-hidden="true" />
      <span className="inline-flex gap-px font-mono-tight text-[10.5px] leading-none tabular-nums text-ink-2">
        {digits.map((d, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
          >
            {d}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}
