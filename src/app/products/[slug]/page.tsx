import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { MarkdownText } from "@/components/thread/markdown-text";
import { fetchProduct } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return { title: "Not Found | Root Cause Health" };

  return {
    title: `${product.name} Products | Root Cause Health`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
        <Link
          href="/products"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          Products
        </Link>

        <section className="border-border flex flex-col gap-4 border-b pb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {product.name}
            </h1>
            <p className="text-muted-foreground text-lg">
              {product.description}
            </p>
          </div>

          <div className="border-border bg-muted/40 rounded-lg border px-4 py-3">
            <p className="text-foreground text-sm font-medium">Prompt</p>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              {product.prompt}
            </p>
          </div>
        </section>

        <article className="prose-sm">
          <MarkdownText>{product.response_markdown}</MarkdownText>
        </article>
      </main>
    </div>
  );
}
