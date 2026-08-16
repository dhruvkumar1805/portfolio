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
const RECENT_CACHE_TTL_MS = 60000;

let cachedToken: { value: string; expiresAt: number } | null = null;
let cachedPlaying: { value: NowPlaying | null; expiresAt: number } | null = null;
let cachedRecent: { value: NowPlaying | null; expiresAt: number } | null = null;
let lastGoodStatus: NowPlaying | null = null;
let rateLimitedUntil = 0;

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

export async function getNowPlaying(): Promise<NowPlaying | null> {
  if (rateLimitedUntil > Date.now()) {
    return lastGoodStatus;
  }

  const token = await getAccessToken();
  if (!token) return lastGoodStatus;

  let active: NowPlaying | null | "error";
  if (cachedPlaying && cachedPlaying.expiresAt > Date.now()) {
    active = cachedPlaying.value;
  } else {
    active = await fetchActivePlayback(token);
    if (active !== "error") {
      cachedPlaying = { value: active, expiresAt: Date.now() + PLAYING_CACHE_TTL_MS };
    }
  }

  if (active === "error") return lastGoodStatus;
  if (active) {
    lastGoodStatus = active;
    return active;
  }

  if (cachedRecent && cachedRecent.expiresAt > Date.now()) {
    return cachedRecent.value;
  }

  const recent = await fetchLastPlayed(token);
  if (recent === "error") return lastGoodStatus;

  cachedRecent = { value: recent, expiresAt: Date.now() + RECENT_CACHE_TTL_MS };
  lastGoodStatus = recent;
  return recent;
}

function applyRateLimitBackoff(res: Response) {
  const retryAfterSec = Number(res.headers.get("retry-after"));
  rateLimitedUntil = Date.now() + (Number.isFinite(retryAfterSec) ? retryAfterSec * 1000 : 60000);
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

  if (res.status === 429) applyRateLimitBackoff(res);
  return "error";
}

async function fetchLastPlayed(token: string): Promise<NowPlaying | "error"> {
  const res = await fetch(RECENTLY_PLAYED_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 429) applyRateLimitBackoff(res);
    return "error";
  }

  const data: RecentlyPlayedResponse = await res.json();
  const item = data.items?.[0]?.track;
  return { isPlaying: false, track: item ? toTrack(item) : null };
}
