"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "proof of work", href: "/proof-of-work" },
  { label: "blogs", href: "/blogs" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/60 border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-medium tracking-wider text-xl font-serif
            transition-transform duration-500 ease-out hover:scale-[1.08]"
        >
          Dhruv
        </Link>

        <nav className="flex items-center gap-6 text-neutral-600 dark:text-neutral-400">
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className={`
                  relative font-serif tracking-wider transition-colors
                  ${
                    isActive
                      ? "text-black dark:text-white after:scale-x-100"
                      : "hover:text-black dark:hover:text-white after:scale-x-0"
                  }
                  after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:bg-current
                  after:origin-left after:transition-transform after:duration-300
                `}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
