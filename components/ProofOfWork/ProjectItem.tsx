import { ArrowUpRight } from "lucide-react";

type Props = {
  name: string;
  description: string;
  stack: string[];
  href: string;
};

export function ProjectItem({ name, description, stack, href }: Props) {
  return (
    <div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="
        group block rounded-lg
        transition-colors
        dark:hover:bg-neutral-900/50
        p-6 -m-6 space-y-2"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-2xl tracking-wide font-serif text-neutral-900 dark:text-neutral-300">
            {name}
          </h3>

          <ArrowUpRight
            className="
              h-4 w-4 text-neutral-400
              opacity-0 translate-x-[-4px]
              transition-all duration-200
              group-hover:opacity-100 group-hover:translate-x-0
            "
          />
        </div>

        <p className="max-w-2xl text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </a>
    </div>
  );
}
