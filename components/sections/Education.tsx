import { education } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

export default function Education() {
  return (
    <section
      id="education"
      className="flex flex-wrap items-start gap-x-8 gap-y-4.5 py-(--sp) scroll-mt-23"
    >
      <div className="flex w-33 flex-col gap-1.5 pt-0.5 min-[800px]:sticky min-[800px]:top-22">
        <span className="font-mono-tight text-[10.5px] tracking-[0.16em] text-ink-3 tabular-nums">
          05
        </span>
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          Education
        </h2>
      </div>

      <div className="min-w-0 flex-1 basis-135">
        <Reveal>
          <div className="flex flex-wrap items-start justify-between gap-x-4.5 gap-y-1.5 border-t border-b border-line py-6">
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="text-xl font-medium tracking-[-0.02em] text-ink">
                {education.degree}
              </span>
              <span className="font-mono-tight text-[12.5px] text-ink-2">
                {education.school} &middot; {education.location}
              </span>
            </span>
            <span className="shrink-0 font-mono-tight text-[13px] whitespace-nowrap text-ink-3">
              {education.period}
            </span>
          </div>
          <p className="m-0 mt-6 max-w-[36em] text-[15px] leading-[1.6] text-ink-2 text-pretty">
            {education.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
