import {
  siJavascript,
  siTypescript,
  siNextdotjs,
  siReact,
  siTailwindcss,
  siNodedotjs,
  siPostgresql,
  siGit,
  siMongodb,
  siPrisma,
  siCplusplus,
  siExpress,
  siVercel,
  siJenkins,
  siAndroid,
  siLinux,
} from "simple-icons";
import { SimpleIcon } from "@/components/SimpleIcon";

const StackItem = ({ icon, label }: { icon: any; label: string }) => (
  <div className="flex flex-col items-center gap-2 min-w-[72px]">
    <SimpleIcon icon={icon} size={40} />
    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
      {label}
    </span>
  </div>
);

const Icons = () => (
  <>
    <StackItem icon={siJavascript} label="JavaScript" />
    <StackItem icon={siNextdotjs} label="Next.js" />
    <StackItem icon={siReact} label="React" />
    <StackItem icon={siTailwindcss} label="Tailwind CSS" />
    <StackItem icon={siNodedotjs} label="Node.js" />
    <StackItem icon={siPostgresql} label="PostgreSQL" />
    <StackItem icon={siLinux} label="Linux" />
    <StackItem icon={siMongodb} label="MongoDB" />
    <StackItem icon={siTypescript} label="TypeScript" />
    <StackItem icon={siPrisma} label="Prisma" />
    <StackItem icon={siCplusplus} label="C++" />
    <StackItem icon={siExpress} label="Express" />
    <StackItem icon={siVercel} label="Vercel" />
    <StackItem icon={siJenkins} label="Jenkins" />
    <StackItem icon={siAndroid} label="Android" />
    <StackItem icon={siGit} label="Git" />
  </>
);

export function TechStackMarquee() {
  return (
    <section className="mt-20">
      <h2 className="mb-2 text-xl text-neutral-700 dark:text-neutral-300">
        Stack I use
      </h2>

      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
        Tools I regularly use to build and ship products
      </p>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white dark:from-black to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white dark:from-black to-transparent" />

        <div className="flex my-4">
          <div className="flex min-w-max gap-8 text-neutral-600 dark:text-neutral-400 animate-marquee hover:[animation-play-state:paused]">
            <Icons />
            <Icons />
          </div>
        </div>
      </div>
    </section>
  );
}
