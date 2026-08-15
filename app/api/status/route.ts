import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";
import { getCodingStatus } from "@/lib/wakatime";

export const dynamic = "force-dynamic";

export async function GET() {
  const [music, coding] = await Promise.all([
    getNowPlaying().catch(() => null),
    getCodingStatus().catch(() => null),
  ]);

  return NextResponse.json({ music, coding });
}
