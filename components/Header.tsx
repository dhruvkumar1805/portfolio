import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <span className="font-medium tracking-wider text-xl font-serif transition-transform duration-500 ease-out hover:scale-[1.08] cursor-pointer">
        Dhruv
      </span>

      <nav className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
        {["proof of work", "blogs"].map((item) => (
          <a
            key={item}
            href={`#${item.replaceAll(" ", "")}`}
            className="relative font-serif tracking-wider transition-colors hover:text-black dark:hover:text-white
              after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:bg-current
              after:origin-left after:scale-x-0 after:transition-transform after:duration-500
              hover:after:scale-x-100"
          >
            {item}
          </a>
        ))}
      </nav>

      <ThemeToggle />
    </header>
  );
}
