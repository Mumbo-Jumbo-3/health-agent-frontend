import { NextRequest } from "next/server";
import {
  forwardHeaders,
  proxyUpstream,
  withAuthedProxy,
} from "@/lib/backend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return withAuthedProxy(async (req, ctx) => {
    const upstreamUrl = new URL("/threads", ctx.apiUrl);
    const headers = forwardHeaders(req, ctx);
    return proxyUpstream(upstreamUrl, "POST", headers, req.body);
  }, req);
}
