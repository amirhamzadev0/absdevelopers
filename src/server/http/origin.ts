import "server-only";
import type { NextRequest } from "next/server";

/** POST requests must come from APP_ORIGIN exactly. */
export function isAllowedOrigin(request: NextRequest): boolean {
  const expected = process.env.APP_ORIGIN;
  const origin = request.headers.get("origin");
  if (!expected || !origin) return false;
  return origin === expected;
}
