import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Client, Message } from "@langchain/langgraph-sdk";
import { ReadOnlyMessages } from "@/components/thread/messages/read-only";
import { RootCauseHealthLogo } from "@/components/icons/root-cause-health";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ShareRow {
  share_id: string;
  thread_id: string;
  title: string;
  first_message: string;
  created_at: string;
}

async function fetchShare(id: string): Promise<ShareRow | null> {
  const apiUrl = process.env.LANGGRAPH_API_URL;
  if (!apiUrl) return null;

  try {
    const res = await fetch(new URL(`/share/${id}`, apiUrl), {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as ShareRow;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const row = await fetchShare(id);
  if (!row) return { title: "Not Found | Root Cause Health" };

  const title = row.title || "Health conversation";
  const description =
    row.first_message.slice(0, 200) || "A shared conversation from Root Cause Health.";
  const imagePath = `/share/${id}/opengraph-image`;

  return {
    title: `${title} | Root Cause Health`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/share/${id}`,
      siteName: "Root Cause Health",
      images: [{ url: imagePath, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imagePath],
    },
  };
}

async function fetchMessages(threadId: string): Promise<Message[] | null> {
  const apiUrl = process.env.LANGGRAPH_API_URL;
  const apiKey = process.env.LANGSMITH_API_KEY ?? "";
  if (!apiUrl) return null;

  try {
    const client = new Client({ apiUrl, apiKey });
    const state = await client.threads.getState(threadId);
    const values = state.values as { messages?: Message[] } | undefined;
    return values?.messages ?? [];
  } catch {
    return null;
  }
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;
  const row = await fetchShare(id);
  if (!row) notFound();

  const messages = await fetchMessages(row.thread_id);
  if (!messages) notFound();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RootCauseHealthLogo width={24} height={24} />
          <span className="font-semibold">Root Cause Health</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          New chat
        </Link>
      </header>

      <ReadOnlyMessages messages={messages} />
    </div>
  );
}
