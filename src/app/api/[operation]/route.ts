import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import { getOperations, HttpError, postOperations } from "@/server/http/operations";
import { isAllowedOrigin } from "@/server/http/origin";

const MAX_BODY_BYTES = 32 * 1024;

function failure(error: unknown) {
  if (error instanceof ZodError) {
    const fields = Object.fromEntries(
      error.issues.map((issue) => [issue.path.join(".") || "form", issue.message]),
    );
    return NextResponse.json({ error: { message: "Invalid input.", fields } }, { status: 400 });
  }
  if (error instanceof HttpError) {
    return NextResponse.json({ error: { message: error.message } }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ error: { message: "Something went wrong." } }, { status: 500 });
}

export async function GET(request: NextRequest, ctx: RouteContext<"/api/[operation]">) {
  const { operation } = await ctx.params;
  const handler = Object.hasOwn(getOperations, operation) ? getOperations[operation] : undefined;
  if (!handler)
    return NextResponse.json({ error: { message: "Unknown operation." } }, { status: 404 });
  try {
    return NextResponse.json({ data: await handler(request.nextUrl.searchParams) });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: NextRequest, ctx: RouteContext<"/api/[operation]">) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: { message: "Forbidden origin." } }, { status: 403 });
  }
  const { operation } = await ctx.params;
  const handler = Object.hasOwn(postOperations, operation) ? postOperations[operation] : undefined;
  if (!handler)
    return NextResponse.json({ error: { message: "Unknown operation." } }, { status: 404 });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: { message: "Payload too large." } }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: { message: "Invalid JSON body." } }, { status: 400 });
  }
  try {
    return NextResponse.json({ data: await handler(body) }, { status: 201 });
  } catch (error) {
    return failure(error);
  }
}
