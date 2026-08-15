import http from "node:http";
import crypto from "node:crypto";

const clientId = process.env.SPOTIFY_CLIENT_ID || process.argv[2];
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || process.argv[3];
const redirectUri = "http://127.0.0.1:8888/callback";
const scope = "user-read-currently-playing user-read-recently-played";

if (!clientId || !clientSecret) {
  console.error("Usage: node scripts/spotify-auth.mjs <client_id> <client_secret>");
  process.exit(1);
}

const state = crypto.randomBytes(8).toString("hex");
const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("redirect_uri", redirectUri);
authUrl.searchParams.set("scope", scope);
authUrl.searchParams.set("state", state);

console.log("Open this URL and approve access:\n");
console.log(authUrl.toString());
console.log("\nWaiting for redirect on http://127.0.0.1:8888/callback ...");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, redirectUri);
  if (url.pathname !== "/callback") {
    res.writeHead(404);
    res.end();
    return;
  }

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  if (!code || returnedState !== state) {
    res.writeHead(400);
    res.end("State mismatch or missing code.");
    server.close();
    process.exit(1);
    return;
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok) {
    res.writeHead(500);
    res.end("Token exchange failed.");
    console.error(tokenData);
    server.close();
    process.exit(1);
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Done. You can close this tab and check your terminal.");

  console.log("\nSPOTIFY_REFRESH_TOKEN=" + tokenData.refresh_token);

  server.close();
});

server.listen(8888);
