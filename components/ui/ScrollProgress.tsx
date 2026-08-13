"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.span
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 z-50 h-0.5 w-full origin-left bg-accent-2 opacity-85"
    />
  );
}
