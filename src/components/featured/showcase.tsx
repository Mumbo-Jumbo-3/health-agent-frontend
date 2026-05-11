"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FeaturedQueryMeta } from "@/lib/content";
import { FeaturedCard } from "./card";

export function FeaturedShowcase() {
  const [items, setItems] = useState<FeaturedQueryMeta[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/featured", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: FeaturedQueryMeta[]) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) {
          const idx = Number((best.target as HTMLElement).dataset.idx);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      { root: scroller, threshold: [0.5, 0.75, 1] },
    );
    scroller
      .querySelectorAll<HTMLElement>("[data-idx]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  if (items.length === 0) return null;

  function scrollToIndex(i: number) {
    const scroller = scrollerRef.current;
    const child = scroller?.children[i] as HTMLElement | undefined;
    if (!scroller || !child) return;
    const offset =
      child.offsetLeft - (scroller.clientWidth - child.clientWidth) / 2;
    scroller.scrollTo({ left: offset, behavior: "smooth" });
  }

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < items.length - 1;
  const prev = () => scrollToIndex(activeIndex - 1);
  const next = () => scrollToIndex(activeIndex + 1);

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-3">
      <p className="text-muted-foreground text-lg">Featured Queries</p>
      <div className="flex w-full items-center gap-2">
        <button
          onClick={prev}
          disabled={!canPrev}
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0"
          aria-label="Previous"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div
          ref={scrollerRef}
          className="flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-[10%] py-1 sm:px-[8%] lg:px-[5%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((meta, i) => (
            <div
              key={meta.slug}
              data-idx={i}
              className="snap-center shrink-0 basis-[80%] sm:basis-[42%] lg:basis-[30%]"
            >
              <FeaturedCard meta={meta} />
            </div>
          ))}
        </div>

        <button
          onClick={next}
          disabled={!canNext}
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0"
          aria-label="Next"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
