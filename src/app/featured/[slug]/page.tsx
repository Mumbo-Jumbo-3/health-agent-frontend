import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { fetchFeaturedQuery } from "@/lib/content";
import { FeaturedTabs } from "@/components/featured/tabs";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await fetchFeaturedQuery(slug);
  if (!query) return { title: "Not Found" };

  return {
    title: `${query.query} | Root Cause`,
    description: query.description,
  };
}

export default async function FeaturedPage({ params }: PageProps) {
  const { slug } = await params;
  const query = await fetchFeaturedQuery(slug);
  if (!query) notFound();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-gray-500 px-4 py-1.5">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/chat" aria-label="Back">
            <ArrowLeft className="size-4" />
            <span>Back</span>
          </Link>
        </Button>
      </div>

      <main className="mx-auto flex max-w-3xl flex-col gap-3 px-4 pb-3">
        <FeaturedTabs
          responseMarkdown={query.response_markdown}
          shareLinks={query.shareLinks}
        />
      </main>
    </div>
  );
}
