import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { ProductGrid } from "@/components/products/product-grid";
import { fetchProductList } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products | Root Cause Health",
  description: "Search Root Cause Health supplement product guides.",
};

export default async function ProductsPage() {
  const products = await fetchProductList();
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        <section className="flex max-w-3xl flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-lg">
            Search supplement guides with pre-generated product quality and
            purity research.
          </p>
        </section>

        <ProductGrid products={products} />
      </main>
    </div>
  );
}
