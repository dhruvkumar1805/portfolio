import { Github, Twitter, Linkedin } from "lucide-react";

export function Intro() {
  return (
    <section className="mt-8 flex items-start gap-5">
      <img src="/avatar.png" alt="Avatar" className="h-16 w-16 rounded-full" />

      <div>
        <h1 className="font-serif text-4xl">Dhruv Kumar</h1>

        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Full-Stack Developer
        </p>

        <div className="mt-3 flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
          <Social href="https://github.com/dhruvkumar1805">
            <Github />
          </Social>
          <Social href="https://x.com/dhruvkumar1805">
            <Twitter />
          </Social>
          <Social href="https://linkedin.com/in/dhruvkumar1805">
            <Linkedin />
          </Social>
        </div>

        <p className="mt-8 max-w-xl text-lg text-neutral-700 dark:text-neutral-300">
          I build end-to-end web applications with a strong emphasis on clean
          architecture, performance, and long-term maintainability. I focus on
          writing thoughtful, predictable code that scales well over time and
          stays easy to understand as products grow.
        </p>
      </div>
    </section>
  );
}

function Social({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="hover:text-black dark:hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}
