import type { ReactNode } from "react";
import { fetchNutrientList } from "@/lib/content";
import { NutrientLinksClientProvider } from "@/lib/nutrient-links-context";

export async function NutrientLinksProvider({
  children,
}: {
  children: ReactNode;
}) {
  let nutrients: Awaited<ReturnType<typeof fetchNutrientList>> = [];
  try {
    nutrients = await fetchNutrientList();
  } catch {
    // If the backend is unavailable at render time we still want pages to
    // render — links simply won't be injected this round.
    nutrients = [];
  }
  return (
    <NutrientLinksClientProvider nutrients={nutrients}>
      {children}
    </NutrientLinksClientProvider>
  );
}
