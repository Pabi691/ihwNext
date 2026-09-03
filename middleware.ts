import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Keep every non-production host out of search indexes.
 *
 * The same codebase is deployed to the live domain AND to auxiliary Vercel
 * deployments (the theme-preview project at ihw-next.vercel.app, per-commit
 * preview URLs, any staging domain). Only the real domain(s) below should be
 * crawlable; everything else gets a blanket `X-Robots-Tag: noindex` and a
 * `Disallow: /` robots.txt, regardless of path.
 *
 * Override the allow-list per deployment with the INDEXABLE_HOSTS env var
 * (comma-separated hostnames) if the production domain ever changes.
 */
const INDEXABLE_HOSTS = (
  process.env.INDEXABLE_HOSTS || "www.indianhairworld.com,indianhairworld.com"
)
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  if (INDEXABLE_HOSTS.includes(host)) return NextResponse.next();

  // Non-canonical host — block indexing site-wide.
  if (req.nextUrl.pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, noimageindex");
  return res;
}

export const config = {
  // Run on everything except Next's build assets and the favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
