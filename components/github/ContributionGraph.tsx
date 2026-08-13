import { FaGithub } from "react-icons/fa6";
import {
  getContributions,
  getLatestActivity,
  type ContributionDay,
  type LatestActivity,
} from "@/lib/github";
import { siteConfig } from "@/lib/site-config";
import ContributionGraphGrid from "./ContributionGraphGrid";
import ShippedBadge from "./ShippedBadge";
import Reveal from "@/components/ui/Reveal";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type Cell = ContributionDay | null;

function buildWeeks(days: ContributionDay[], year: number) {
  const firstDow = new Date(year, 0, 1).getDay();
  const cells: Cell[] = [...Array.from({ length: firstDow }, () => null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);

  const weekCount = cells.length / 7;
  const weeks: Cell[][] = [];
  for (let w = 0; w < weekCount; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7));
  }
  return weeks;
}

function buildMonthLabels(weeks: Cell[][]) {
  let lastMonth = -1;
  return weeks.map((week) => {
    const firstCell = week.find((c) => c !== null);
    if (!firstCell) return "";
    const month = new Date(firstCell.date + "T00:00:00").getMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      return MONTH_NAMES[month];
    }
    return "";
  });
}

function computeStreaks(days: ContributionDay[], today: string) {
  const sorted = [...days]
    .filter((d) => d.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  let longest = 0;
  let run = 0;
  for (const day of sorted) {
    if (day.count > 0) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }

  let i = sorted.length - 1;
  if (i >= 0 && sorted[i].count === 0) i--;
  let current = 0;
  while (i >= 0 && sorted[i].count > 0) {
    current++;
    i--;
  }

  return { current, longest };
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function ContributionGraph() {
  const year = new Date().getFullYear();
  const today = new Date().toISOString().split("T")[0];

  let total: number;
  let allDays: ContributionDay[];
  let streakDays: ContributionDay[];
  let latestActivity: LatestActivity | null;
  try {
    const [data, prevData, activity] = await Promise.all([
      getContributions(siteConfig.githubHandle, year),
      getContributions(siteConfig.githubHandle, year - 1).catch(() => ({ total: 0, days: [] })),
      getLatestActivity(siteConfig.githubHandle).catch(() => null),
    ]);
    total = data.total;
    allDays = data.days;
    streakDays = [...prevData.days, ...data.days];
    latestActivity = activity;
  } catch {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-b border-line py-6 font-mono-tight text-[12.5px] text-ink">
        <span className="inline-flex items-center gap-2.5">
          <FaGithub size={16} className="text-accent-2" />
          contribution data unavailable right now
        </span>
        <a
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-2 underline"
        >
          view on GitHub &#8594;
        </a>
      </div>
    );
  }

  const weeks = buildWeeks(allDays, year);
  const monthLabels = buildMonthLabels(weeks);
  const todayCount = allDays.find((d) => d.date === today)?.count ?? 0;
  const shippedToday =
    !!latestActivity && new Date(latestActivity.date).toISOString().split("T")[0] === today;
  const codedToday = todayCount > 0 || shippedToday;
  const { current: currentStreak, longest: longestStreak } = computeStreaks(streakDays, today);

  return (
    <Reveal className="border-t border-b border-line py-6">
      <div className="flex items-center justify-between gap-2.5">
        <span className="inline-flex items-center gap-2.5 font-mono-tight text-[9.5px] font-medium tracking-[0.13em] text-ink-3 uppercase">
          <FaGithub size={14} className="text-ink-3" />
          shipping log
        </span>
        <ShippedBadge shipped={codedToday} count={todayCount} />
      </div>

      <ContributionGraphGrid
        weeks={weeks}
        monthLabels={monthLabels}
        today={today}
        total={total}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        lastShipped={
          latestActivity && {
            message: latestActivity.message,
            repo: latestActivity.repo,
            timeAgo: timeAgo(latestActivity.date),
            url: latestActivity.url,
          }
        }
      />
    </Reveal>
  );
}
