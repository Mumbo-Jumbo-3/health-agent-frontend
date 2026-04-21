import { NextRequest } from "next/server";
import {
  forwardHeaders,
  proxyUpstream,
  withAuthedProxy,
} from "@/lib/backend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return withAuthedProxy(async (req, ctx) => {
    const upstreamUrl = new URL("/runs/stream", ctx.apiUrl);
    const headers = forwardHeaders(req, ctx);
    headers.set("content-type", "application/json");
    return proxyUpstream(upstreamUrl, "POST", headers, req.body);
  }, req);
}
