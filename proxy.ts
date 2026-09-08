import { NextResponse, type NextRequest } from "next/server";
import { cliResume } from "@/lib/cli-resume";

/**
 * `curl dhruvkumar.dev` from a terminal gets the résumé as text, browsers get
 * the site. Anything that accepts HTML is a browser as far as this is
 * concerned, so scrapers and link previews keep seeing the real page.
 */
const TERMINALS = /\b(curl|wget|httpie|HTTPie|xh|powershell)\b/i;

export default function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  const accept = request.headers.get("accept") ?? "";

  if (TERMINALS.test(ua) && !accept.includes("text/html")) {
    return new NextResponse(cliResume(), {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=0, s-maxage=3600",
      },
    });
  }

  // /resume and /cv exist only for this handshake, so a browser that lands
  // there gets the PDF rather than a 404.
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/resume.pdf", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/resume", "/cv"],
};
