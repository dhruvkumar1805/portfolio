import { GithubGraphClient } from "@/components/GithubGraphClient";
import { Github, Twitter, Linkedin } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TechStackMarquee } from "@/components/TechStackMarquee";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";
import { LetsConnect } from "@/components/LetConnect";

export default function Home() {
  return (
    <main>
      <header className="flex items-center justify-between py-6">
        <span className="font-medium tracking-wider text-xl font-serif transition-transform duration-500 ease-out hover:scale-[1.08] cursor-pointer">
          Dhruv
        </span>

        <nav className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
          <a
            href="#proof"
            className="relative font-serif tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-500 hover:after:scale-x-100"
          >
            proof of work
          </a>
          <a
            href="#blogs"
            className="relative font-serif tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-500 hover:after:scale-x-100"
          >
            blogs
          </a>
        </nav>

        <ThemeToggle />
      </header>

      <div className="relative mt-6 overflow-hidden rounded-xl">
        <img
          src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=876&auto=format&fit=crop"
          alt="Hero"
          className="h-55 w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-serif tracking-wide text-white drop-shadow-sm">
            Build • Ship • Learn • Repeat
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-5">
        <img
          src="/avatar.png"
          alt="Avatar"
          className="h-16 w-16 rounded-full"
        />

        <div>
          <h1 className="font-serif text-4xl">Dhruv Kumar</h1>

          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            20 • Full-Stack Developer
          </p>

          <div className="mt-3 flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
            <a
              href="https://github.com/dhruvkumar1805"
              target="_blank"
              rel="noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>

            <a
              href="https://x.com/dhruvkumar1805"
              target="_blank"
              rel="noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors"
              aria-label="X"
            >
              <Twitter className="h-5 w-5" />
            </a>

            <a
              href="https://www.linkedin.com/in/dhruvkumar1805"
              target="_blank"
              rel="noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>

          <p className="mt-8 max-w-xl text-lg text-neutral-700 dark:text-neutral-300">
            I build end-to-end web applications with a strong emphasis on clean
            architecture, performance, and long-term maintainability. I care
            about writing code that is easy to reason about, scales predictably,
            and doesn’t become a liability six months down the line.
          </p>
          <div className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
        </div>
      </div>
      <TechStackMarquee />
      <div className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <div className="mt-20">
        <h1 className="text-xl text-center text-neutral-700 dark:text-neutral-300">
          GitHub Contributions
        </h1>
        <p className="mb-12 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Daily activity across open-source and personal projects
        </p>

        <GithubGraphClient
          username="dhruvkumar1805"
          blockMargin={2}
          lightColorPalette={[
            "#e5e7eb",
            "#cbd5e1",
            "#94a3b8",
            "#5f9fb0",
            "#3b8298",
          ]}
          darkColorPalette={[
            "#0f172a",
            "#1e293b",
            "#334155",
            "#4f7c8a",
            "#7fb6c8",
          ]}
        />
      </div>

      <div className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      <CallToAction />
      <div className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      <LetsConnect />
      <Footer />
    </main>
  );
}
