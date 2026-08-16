import { Redis } from "@upstash/redis";

type SpotifyArtist = {
  name: string;
};

type SpotifyImage = {
  url: string;
};

type SpotifyItem = {
  name: string;
  artists: SpotifyArtist[];
  external_urls?: { spotify?: string };
  album?: { images?: SpotifyImage[] };
};

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
};

type CurrentlyPlayingResponse = {
  is_playing?: boolean;
  item?: SpotifyItem;
};

type RecentlyPlayedResponse = {
  items?: { track: SpotifyItem }[];
};

export type SpotifyTrack = {
  title: string;
  artist: string;
  url: string;
  albumArt: string | null;
};

export type NowPlaying = {
  isPlaying: boolean;
  track: SpotifyTrack | null;
};

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const CURRENTLY_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

const PLAYING_CACHE_TTL_MS = 4000;
const RECENT_CACHE_TTL_SEC = 60;
const LAST_GOOD_TTL_SEC = 86400;

const RECENT_KEY = "spotify:recent";
const LAST_GOOD_KEY = "spotify:lastGood";
const RATE_LIMIT_KEY = "spotify:rateLimitedUntil";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

let cachedToken: { value: string; expiresAt: number } | null = null;
let cachedPlaying: { value: NowPlaying | null; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data: TokenResponse = await res.json();
  if (!data.access_token) return null;

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + ((data.expires_in ?? 3600) - 60) * 1000,
  };
  return cachedToken.value;
}

function toTrack(item: SpotifyItem): SpotifyTrack {
  const images = item.album?.images ?? [];
  return {
    title: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
    url: item.external_urls?.spotify ?? "",
    albumArt: images[images.length - 1]?.url ?? null,
  };
}

async function getLastGoodStatus(): Promise<NowPlaying | null> {
  if (!redis) return null;
  return (await redis.get<NowPlaying>(LAST_GOOD_KEY)) ?? null;
}

async function setLastGoodStatus(status: NowPlaying) {
  if (!redis) return;
  await redis.set(LAST_GOOD_KEY, status, { ex: LAST_GOOD_TTL_SEC });
}

async function isRateLimited(): Promise<boolean> {
  if (!redis) return false;
  const until = await redis.get<number>(RATE_LIMIT_KEY);
  return Boolean(until && until > Date.now());
}

async function applyRateLimitBackoff(res: Response) {
  if (!redis) return;
  const retryAfterSec = Number(res.headers.get("retry-after"));
  const backoffMs = Number.isFinite(retryAfterSec) ? retryAfterSec * 1000 : 60000;
  await redis.set(RATE_LIMIT_KEY, Date.now() + backoffMs, { px: backoffMs });
}

async function getCachedRecent(): Promise<NowPlaying | undefined> {
  if (!redis) return undefined;
  const value = await redis.get<NowPlaying>(RECENT_KEY);
  return value ?? undefined;
}

async function setCachedRecent(value: NowPlaying) {
  if (!redis) return;
  await redis.set(RECENT_KEY, value, { ex: RECENT_CACHE_TTL_SEC });
}

export async function getNowPlaying(): Promise<NowPlaying | null> {
  if (await isRateLimited()) {
    return getLastGoodStatus();
  }

  const token = await getAccessToken();
  if (!token) return getLastGoodStatus();

  let active: NowPlaying | null | "error";
  if (cachedPlaying && cachedPlaying.expiresAt > Date.now()) {
    active = cachedPlaying.value;
  } else {
    active = await fetchActivePlayback(token);
    if (active !== "error") {
      cachedPlaying = { value: active, expiresAt: Date.now() + PLAYING_CACHE_TTL_MS };
    }
  }

  if (active === "error") return getLastGoodStatus();
  if (active) {
    await setLastGoodStatus(active);
    return active;
  }

  const cachedRecent = await getCachedRecent();
  if (cachedRecent !== undefined) {
    return cachedRecent;
  }

  const recent = await fetchLastPlayed(token);
  if (recent === "error") return getLastGoodStatus();

  await setCachedRecent(recent);
  await setLastGoodStatus(recent);
  return recent;
}

async function fetchActivePlayback(token: string): Promise<NowPlaying | null | "error"> {
  const res = await fetch(CURRENTLY_PLAYING_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 200) {
    const data: CurrentlyPlayingResponse = await res.json();
    if (data.is_playing && data.item) {
      return { isPlaying: true, track: toTrack(data.item) };
    }
    return null;
  }

  if (res.status === 204) return null;

  if (res.status === 429) await applyRateLimitBackoff(res);
  return "error";
}

async function fetchLastPlayed(token: string): Promise<NowPlaying | "error"> {
  const res = await fetch(RECENTLY_PLAYED_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 429) await applyRateLimitBackoff(res);
    return "error";
  }

  const data: RecentlyPlayedResponse = await res.json();
  const item = data.items?.[0]?.track;
  return { isPlaying: false, track: item ? toTrack(item) : null };
}
