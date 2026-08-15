type Heartbeat = {
  time: number;
  language: string | null;
};

type HeartbeatsResponse = {
  data?: Heartbeat[];
};

export type CodingStatus = {
  language: string | null;
  isActive: boolean;
  lastActiveAt: number;
};

const ACTIVE_WINDOW_SECONDS = 5 * 60;
const CACHE_TTL_MS = 20000;

let cached: { value: CodingStatus | null; expiresAt: number } | null = null;

async function fetchCodingStatus(): Promise<CodingStatus | null> {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) return null;

  const date = new Date().toISOString().slice(0, 10);
  const auth = Buffer.from(`${apiKey}:`).toString("base64");

  const res = await fetch(
    `https://wakatime.com/api/v1/users/current/heartbeats?date=${date}`,
    {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data: HeartbeatsResponse = await res.json();
  const last = data.data?.[data.data.length - 1];
  if (!last) return null;

  const nowSeconds = Date.now() / 1000;
  return {
    language: last.language,
    isActive: nowSeconds - last.time <= ACTIVE_WINDOW_SECONDS,
    lastActiveAt: last.time,
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
