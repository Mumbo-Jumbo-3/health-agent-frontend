"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { NutrientMeta } from "@/lib/content";

interface NutrientLinksContextValue {
  nutrients: NutrientMeta[];
}

const NutrientLinksContext = createContext<NutrientLinksContextValue>({
  nutrients: [],
});

export function NutrientLinksClientProvider({
  nutrients,
  children,
}: {
  nutrients: NutrientMeta[];
  children: ReactNode;
}) {
  // Stabilise the value object so MarkdownText's memoisation isn't busted on
  // every render of an ancestor.
  const value = useMemo(() => ({ nutrients }), [nutrients]);
  return (
    <NutrientLinksContext.Provider value={value}>
      {children}
    </NutrientLinksContext.Provider>
  );
}

export function useNutrientLinks(): NutrientMeta[] {
  return useContext(NutrientLinksContext).nutrients;
}
