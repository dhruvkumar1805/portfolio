import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";

export async function GET() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return NextResponse.json({ count: null });
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const cookieStore = await cookies();
  const visited = cookieStore.get("vst");

  let count: number;

  if (!visited) {
    count = await redis.incr("portfolio:visitors");
  } else {
    count = (await redis.get<number>("portfolio:visitors")) ?? 0;
  }

  const res = NextResponse.json({ count });

  if (!visited) {
    res.cookies.set("vst", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }

  return res;
}
