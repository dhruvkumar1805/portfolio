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

const STATUS_CACHE_TTL_MS = 20000;

let cachedToken: { value: string; expiresAt: number } | null = null;
let cachedStatus: { value: NowPlaying | null; expiresAt: number } | null = null;
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
  if (cachedStatus && cachedStatus.expiresAt > Date.now()) {
    return cachedStatus.value;
  }

  if (rateLimitedUntil > Date.now()) {
    return lastGoodStatus;
  }

  const fetched = await fetchNowPlaying();
  const value = fetched ?? lastGoodStatus;
  if (fetched) lastGoodStatus = fetched;

  cachedStatus = { value, expiresAt: Date.now() + STATUS_CACHE_TTL_MS };
  return value;
}

async function fetchNowPlaying(): Promise<NowPlaying | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const playingRes = await fetch(CURRENTLY_PLAYING_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (playingRes.status === 200) {
    const data: CurrentlyPlayingResponse = await playingRes.json();
    if (data.is_playing && data.item) {
      return { isPlaying: true, track: toTrack(data.item) };
    }
  }

  const recentRes = await fetch(RECENTLY_PLAYED_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!recentRes.ok) {
    if (recentRes.status === 429) {
      const retryAfterSec = Number(recentRes.headers.get("retry-after"));
      rateLimitedUntil = Date.now() + (Number.isFinite(retryAfterSec) ? retryAfterSec * 1000 : 60000);
    }
    return null;
  }

  const recentData: RecentlyPlayedResponse = await recentRes.json();
  const item = recentData.items?.[0]?.track;
  if (!item) return { isPlaying: false, track: null };

  return { isPlaying: false, track: toTrack(item) };
}
