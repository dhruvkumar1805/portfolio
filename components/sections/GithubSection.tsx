import ContributionGraph from "@/components/github/ContributionGraph";

export default function GithubSection() {
  return (
    <section
      id="github"
      className="flex flex-wrap items-start gap-x-8 gap-y-4.5 py-(--sp) scroll-mt-23"
    >
      <div className="flex w-33 flex-col gap-1.5 pt-0.5 min-[800px]:sticky min-[800px]:top-22">
        <span className="font-mono-tight text-[10.5px] tracking-[0.16em] text-ink-3 tabular-nums">
          04
        </span>
        <h2 className="m-0 font-mono-tight text-[11px] font-medium tracking-[0.14em] text-ink-2 uppercase">
          GitHub
        </h2>
        <span className="font-mono-tight text-[10px] tracking-[0.06em] text-ink-3 text-pretty">
          hover a day
        </span>
      </div>

      <div className="min-w-0 flex-1 basis-135">
        <ContributionGraph />
      </div>
    </section>
  );
}
