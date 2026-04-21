import { NextRequest } from "next/server";
import {
  forwardHeaders,
  proxyUpstream,
  withAuthedProxy,
} from "@/lib/backend";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, routeCtx: RouteContext) {
  const { id } = await routeCtx.params;
  return withAuthedProxy(async (req, ctx) => {
    const upstreamUrl = new URL(`/threads/${id}/state`, ctx.apiUrl);
    return proxyUpstream(upstreamUrl, "GET", forwardHeaders(req, ctx), null);
  }, req);
}
