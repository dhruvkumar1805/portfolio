import { Github, Twitter, Linkedin, Mail, FileText } from "lucide-react";

export function LetsConnect() {
  return (
    <section className="mt-20">
      <p className="text-xl text-center text-neutral-500 dark:text-neutral-400">
        Let's connect
      </p>
      <p className="mt-1 mb-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Find me on these platforms
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ConnectCard
          href="https://github.com/dhruvkumar1805"
          icon={<Github className="h-5 w-5" />}
          label="GitHub"
        />

        <ConnectCard
          href="https://x.com/dhruvkumar1805"
          icon={<Twitter className="h-5 w-5" />}
          label="Twitter"
        />

        <ConnectCard
          href="https://linkedin.com/in/dhruvkumar1805"
          icon={<Linkedin className="h-5 w-5" />}
          label="LinkedIn"
        />

        <ConnectCard
          href="mailto:you@email.com"
          icon={<Mail className="h-5 w-5" />}
          label="Mail"
        />
      </div>
    </section>
  );
}

function ConnectCard({
  href,
  icon,
  label,
  full = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  full?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`
        flex items-center gap-3
        rounded-xl border
        px-4 py-3
        text-sm font-medium
        transition-all
        bg-neutral-50 text-neutral-700 border-neutral-200
        hover:bg-neutral-100 hover:text-black
        dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-800
        dark:hover:bg-neutral-800 dark:hover:text-white hover:-translate-y-0.5 hover:border-neutral-500 transition-all

        ${full ? "sm:col-span-2" : ""}
      `}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
