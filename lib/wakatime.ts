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

export type CodingStatus = {
  language: string | null;
  isActive: boolean;
  lastActiveAt: number;
  totalToday: string | null;
};

const ACTIVE_WINDOW_SECONDS = 5 * 60;
const CACHE_TTL_MS = 20000;

let cached: { value: CodingStatus | null; expiresAt: number } | null = null;

function authHeader(apiKey: string): string {
  return `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
}

async function fetchCodingStatus(): Promise<CodingStatus | null> {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) return null;

  const auth = authHeader(apiKey);
  const date = new Date().toISOString().slice(0, 10);

  const [heartbeatsRes, statusBarRes] = await Promise.all([
    fetch(
      `https://wakatime.com/api/v1/users/current/heartbeats?date=${date}`,
      { headers: { Authorization: auth }, cache: "no-store" }
    ),
    fetch("https://wakatime.com/api/v1/users/current/status_bar/today", {
      headers: { Authorization: auth },
      cache: "no-store",
    }),
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

  const nowSeconds = Date.now() / 1000;
  return {
    language: last.language,
    isActive: nowSeconds - last.time <= ACTIVE_WINDOW_SECONDS,
    lastActiveAt: last.time,
    totalToday,
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
