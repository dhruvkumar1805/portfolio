import { education } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

export default function Education() {
  return (
    <section
      id="education"
      className="flex flex-wrap items-start gap-x-8 gap-y-4.5 py-(--sp) scroll-mt-23"
    >
      <div className="sticky top-22 flex w-33 flex-col gap-1.5 pt-0.5">
        <span className="font-mono-tight text-[10.5px] tracking-[0.16em] text-ink-3 tabular-nums">
          05
        </span>
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          Education
        </h2>
      </div>

      <div className="min-w-0 flex-1 basis-135">
        <Reveal>
          <div className="flex flex-col gap-2.5 border-t border-b border-line py-6">
            <span className="font-mono-tight text-[9.5px] font-medium tracking-[0.13em] text-ink-3 uppercase">
              {education.period}
            </span>
            <span className="text-xl font-medium tracking-[-0.02em] text-ink">
              {education.degree}
            </span>
            <span className="font-mono-tight text-[12.5px] text-ink-2">
              {education.school}, {education.location}
            </span>
            <p className="m-0 mt-1 max-w-[36em] text-[15px] leading-[1.6] text-ink-2 text-pretty">
              {education.note}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
