import { GithubGraph } from "@/components/github";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <main>
      <header className="flex items-center justify-between py-6">
        <span className="font-semibold">Dhruv</span>
        <nav className="flex items-center gap-4 text-sm text-neutral-400">
          <a href="#proof" className="hover:text-white ">
            Proof of Work
          </a>
          <a href="#blogs" className="hover:text-white">
            Blogs
          </a>
        </nav>
      </header>

      <div className="mt-6 overflow-hidden rounded-xl">
        <img
          src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero"
          className="h-55 w-full object-cover opacity-80"
        />
      </div>
      <div className="mt-8 flex items-start gap-5">
        <img
          src="/avatar.png"
          alt="Avatar"
          className="h-16 w-16 rounded-full"
        />

        <div>
          <h1 className="font-serif text-4xl">Dhruv Kumar</h1>
          <p className="mt-1 text-sm text-neutral-400">
            developer · builder · full stack
          </p>

          <div className="mt-3 flex items-center gap-4 text-neutral-400">
  <a
    href="https://github.com/dhruvkumar1805"
    target="_blank"
    rel="noreferrer"
    className="hover:text-white transition-colors"
    aria-label="GitHub"
  >
    <Github className="h-5 w-5" />
  </a>

  <a
    href="https://x.com/dhruvkumar1805"
    target="_blank"
    rel="noreferrer"
    className="hover:text-white transition-colors"
    aria-label="X"
  >
    <Twitter className="h-5 w-5" />
  </a>

  <a
    href="https://www.linkedin.com/in/dhruvkumar1805"
    target="_blank"
    rel="noreferrer"
    className="hover:text-white transition-colors"
    aria-label="LinkedIn"
  >
    <Linkedin className="h-5 w-5" />
  </a>
</div>

          <p className="mt-8 text-neutral-300 leading-relaxed max-w-xl">
            I build web applications end to end, focusing on clean architecture,
            performance, and shipping usable products rather than chasing
            trends.
          </p>
        </div>
      </div>
      <div className="mt-14">
        <h1 className="text-xl text-neutral-300 mb-6">
          GitHub Contributions · @dhruvkumar1805
        </h1>
        <GithubGraph username="dhruvkumar1805" blockMargin={2} />
      </div>
    </main>
  );
}
