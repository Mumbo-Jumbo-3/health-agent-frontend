import { NextRequest, NextResponse } from "next/server";
import {
  forwardHeaders,
  proxyUpstream,
  withAuthedProxy,
} from "@/lib/backend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return withAuthedProxy(async (req, ctx) => {
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "invalid json" }, { status: 400 });
    }

    const upstreamUrl = new URL("/share", ctx.apiUrl);
    const headers = forwardHeaders(req, ctx);
    const payload = JSON.stringify({ ...body, user_id: ctx.userId });
    return proxyUpstream(upstreamUrl, "POST", headers, payload);
  }, req);
}
