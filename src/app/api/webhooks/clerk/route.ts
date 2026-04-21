import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return new NextResponse("Verification failed", { status: 400 });
  }

  const relevant = new Set(["user.created", "user.updated", "user.deleted"]);
  if (!relevant.has(evt.type)) {
    return new NextResponse("OK", { status: 200 });
  }

  const apiUrl = process.env.LANGGRAPH_API_URL;
  const webhookSecret = process.env.BACKEND_WEBHOOK_SECRET;
  if (!apiUrl || !webhookSecret) {
    console.error("BACKEND_WEBHOOK_SECRET or LANGGRAPH_API_URL missing");
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  const relay = await fetch(new URL("/internal/users/sync", apiUrl), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${webhookSecret}`,
    },
    body: JSON.stringify({ type: evt.type, data: evt.data }),
    cache: "no-store",
  });

  if (!relay.ok) {
    const text = await relay.text().catch(() => "");
    console.error("Backend user sync failed:", relay.status, text);
    return new NextResponse("Relay failed", { status: 502 });
  }

  return new NextResponse("OK", { status: 200 });
}
