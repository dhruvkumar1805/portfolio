"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/site-config";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const logoRef = useRef<HTMLDivElement>(null);
  const themeToggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.4;
      const atBottom =
        scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      let current: string | null = null;
      if (atBottom) {
        current = navLinks[navLinks.length - 1].id;
      } else {
        for (const link of navLinks) {
          const el = document.getElementById(link.id);
          if (!el) continue;
          const top = el.offsetTop;
          if (scrollY + threshold >= top) {
            current = link.id;
          }
        }
      }
      setActive(scrollY < 80 ? null : current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  useEffect(() => {
    const id = hovered ?? active;
    const el = id ? linkRefs.current[id] : null;
    if (el && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = el.getBoundingClientRect();
      const leftGuard = (logoRef.current?.getBoundingClientRect().width ?? 0) + 20;
      const rightGuard = (themeToggleRef.current?.getBoundingClientRect().width ?? 0) + 20;
      const overflow = linkRect.right - navRect.right;
      const underflow = navRect.left - linkRect.left;
      if (overflow > 0) navRef.current.scrollBy({ left: overflow + rightGuard, behavior: "smooth" });
      if (underflow > 0)
        navRef.current.scrollBy({ left: -(underflow + leftGuard), behavior: "smooth" });
    }
  }, [hovered, active]);

  const pillId = hovered ?? active;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      transition={{ duration: 0.76, ease: [0.2, 0.7, 0.2, 1] }}
      className="fixed top-4.5 left-1/2 z-40 max-w-[calc(100vw-24px)] overflow-hidden rounded-full border border-line bg-paper/78 shadow-[0_6px_24px_-14px_rgba(0,0,0,0.24)] backdrop-blur-xl"
    >
      <div
        className="flex items-center gap-0.5 overflow-x-auto p-1.5 no-scrollbar"
        ref={navRef}
        onMouseLeave={() => setHovered(null)}
      >
        <div ref={logoRef} className="sticky left-0 z-[1] flex shrink-0 items-stretch">
          <a
            href={isHome ? "#top" : "/"}
            aria-label="Top"
            className="flex shrink-0 items-center border-r border-line bg-paper py-1.5 pr-2.5 pl-2 font-mono-tight text-[11.5px] tracking-[0.06em] text-ink-2 transition-colors duration-[var(--dur)] hover:text-accent-2"
          >
            DK
          </a>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 left-full w-5 bg-gradient-to-r from-paper to-transparent"
          />
        </div>
        {navLinks.map((link) => (
          <a
            key={link.id}
            ref={(el) => {
              linkRefs.current[link.id] = el;
            }}
            href={isHome ? link.href : `/${link.href}`}
            onMouseEnter={() => setHovered(link.id)}
            aria-current={active === link.id ? "true" : undefined}
            className="relative shrink-0 rounded-full px-2.5 py-1.5 text-[12px] font-medium tracking-[-0.01em] transition-colors duration-300 sm:px-3.5 sm:text-[13px]"
            style={{ color: pillId === link.id ? "var(--paper)" : "var(--ink-2)" }}
          >
            {pillId === link.id && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 -z-[1] rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            {link.label}
          </a>
        ))}
        <ThemeToggle wrapperRef={themeToggleRef} />
      </div>
    </motion.nav>
  );
}
