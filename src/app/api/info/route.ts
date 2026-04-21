import { NextRequest } from "next/server";
import {
  forwardHeaders,
  proxyUpstream,
  withAuthedProxy,
} from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return withAuthedProxy(async (req, ctx) => {
    const upstreamUrl = new URL("/info", ctx.apiUrl);
    return proxyUpstream(upstreamUrl, "GET", forwardHeaders(req, ctx), null);
  }, req);
}
