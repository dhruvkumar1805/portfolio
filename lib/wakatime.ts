type Heartbeat = {
  time: number;
  language: string | null;
};

type HeartbeatsResponse = {
  data?: Heartbeat[];
};

type StatusBarResponse = {
  data?: {
    grand_total?: { text?: string };
  };
};

type SummaryDay = {
  range: { date: string };
  grand_total: { total_seconds: number };
};

type SummariesResponse = {
  data?: SummaryDay[];
};

export type CodingStatus = {
  language: string | null;
  isActive: boolean;
  lastActiveAt: number;
  totalToday: string | null;
  streak: number;
};

const ACTIVE_WINDOW_SECONDS = 5 * 60;
const CACHE_TTL_MS = 20000;
const STREAK_RANGE_DAYS = 30;
const TIMEZONE = "Asia/Kolkata";

let cached: { value: CodingStatus | null; expiresAt: number } | null = null;

function authHeader(apiKey: string): string {
  return `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
}

const dateFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE });

function toDateString(date: Date): string {
  return dateFormatter.format(date);
}

function computeStreak(days: SummaryDay[]): number {
  const sorted = [...days].sort((a, b) =>
    a.range.date < b.range.date ? 1 : -1
  );

  let streak = 0;
  let started = false;
  for (const day of sorted) {
    const active = day.grand_total.total_seconds > 0;
    if (!started) {
      if (!active) continue;
      started = true;
      streak = 1;
      continue;
    }
    if (active) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

async function fetchCodingStatus(): Promise<CodingStatus | null> {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) return null;

  const auth = authHeader(apiKey);
  const today = new Date();
  const rangeStart = new Date(
    today.getTime() - (STREAK_RANGE_DAYS - 1) * 24 * 60 * 60 * 1000
  );
  const date = toDateString(today);

  const [heartbeatsRes, statusBarRes, summariesRes] = await Promise.all([
    fetch(
      `https://wakatime.com/api/v1/users/current/heartbeats?date=${date}`,
      { headers: { Authorization: auth }, cache: "no-store" }
    ),
    fetch("https://wakatime.com/api/v1/users/current/status_bar/today", {
      headers: { Authorization: auth },
      cache: "no-store",
    }),
    fetch(
      `https://wakatime.com/api/v1/users/current/summaries?start=${toDateString(rangeStart)}&end=${date}`,
      { headers: { Authorization: auth }, cache: "no-store" }
    ),
  ]);

  if (!heartbeatsRes.ok) return null;

  const heartbeatsData: HeartbeatsResponse = await heartbeatsRes.json();
  const last = heartbeatsData.data?.[heartbeatsData.data.length - 1];
  if (!last) return null;

  let totalToday: string | null = null;
  if (statusBarRes.ok) {
    const statusBarData: StatusBarResponse = await statusBarRes.json();
    totalToday = statusBarData.data?.grand_total?.text ?? null;
  }

  let streak = 0;
  if (summariesRes.ok) {
    const summariesData: SummariesResponse = await summariesRes.json();
    streak = computeStreak(summariesData.data ?? []);
  }

  const nowSeconds = Date.now() / 1000;
  return {
    language: last.language,
    isActive: nowSeconds - last.time <= ACTIVE_WINDOW_SECONDS,
    lastActiveAt: last.time,
    totalToday,
    streak,
  };
}

export async function getCodingStatus(): Promise<CodingStatus | null> {
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const value = await fetchCodingStatus();
  cached = { value, expiresAt: Date.now() + CACHE_TTL_MS };
  return value;
}
