import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ _path: string[] }>;
};

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

function stampUserId(body: unknown, userId: string): unknown {
  if (body === null || typeof body !== "object") return body;
  const json = body as Record<string, unknown>;
  const existingMetadata =
    json.metadata && typeof json.metadata === "object" && !Array.isArray(json.metadata)
      ? (json.metadata as Record<string, unknown>)
      : {};
  return { ...json, metadata: { ...existingMetadata, user_id: userId } };
}

async function verifyThreadOwnership(
  apiUrl: string,
  apiKey: string,
  threadId: string,
  userId: string,
): Promise<boolean> {
  const res = await fetch(new URL(`/threads/${threadId}`, apiUrl), {
    method: "GET",
    headers: { "x-api-key": apiKey },
    cache: "no-store",
  });
  if (!res.ok) return false;
  const thread = (await res.json()) as { metadata?: { user_id?: string } };
  return thread?.metadata?.user_id === userId;
}

async function proxy(req: NextRequest, context: RouteContext): Promise<Response> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiUrl = process.env.LANGGRAPH_API_URL;
  const apiKey = process.env.LANGSMITH_API_KEY ?? "";
  if (!apiUrl) {
    return NextResponse.json(
      { error: "LANGGRAPH_API_URL not configured" },
      { status: 500 },
    );
  }

  const { _path } = await context.params;
  const pathStr = _path.join("/");
  const method = req.method.toUpperCase();

  const threadMatch = pathStr.match(/^threads\/([^/]+)(?:\/.*)?$/);
  const isThreadScoped = threadMatch && threadMatch[1] !== "search";
  if (isThreadScoped) {
    const threadId = threadMatch[1];
    const owned = await verifyThreadOwnership(apiUrl, apiKey, threadId, userId);
    if (!owned) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  const upstreamUrl = new URL(`/${pathStr}`, apiUrl);
  req.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.append(key, value);
  });

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value);
  });
  headers.set("x-api-key", apiKey);
  headers.set("x-clerk-user-id", userId);

  let body: BodyInit | null = null;
  if (method !== "GET" && method !== "HEAD") {
    const isJson = (req.headers.get("content-type") ?? "").includes("application/json");
    const shouldStampMetadata =
      isJson &&
      (pathStr === "threads" ||
        pathStr === "threads/search" ||
        pathStr === "runs" ||
        pathStr === "runs/stream" ||
        pathStr === "runs/wait" ||
        pathStr === "runs/batch" ||
        pathStr === "runs/crons" ||
        (isThreadScoped && (method === "POST" || method === "PUT" || method === "PATCH")));

    if (shouldStampMetadata) {
      const raw = await req.text();
      let parsed: unknown = {};
      if (raw.length > 0) {
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = {};
        }
      }
      const stamped = stampUserId(parsed, userId);
      body = JSON.stringify(stamped);
      headers.set("content-type", "application/json");
    } else {
      body = req.body;
    }
  }

  const upstream = await fetch(upstreamUrl, {
    method,
    headers,
    body,
    // @ts-expect-error — duplex is required for streaming request bodies in Node fetch
    duplex: body && typeof body !== "string" ? "half" : undefined,
    cache: "no-store",
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) responseHeaders.set(key, value);
  });

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function GET(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}
export async function POST(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}
export async function PUT(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}
export async function PATCH(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}
export async function DELETE(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}
export async function OPTIONS(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}
