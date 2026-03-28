"use client";

import { ExternalLink } from "lucide-react";
import { MarkdownText } from "@/components/thread/markdown-text";
import { cn } from "@/lib/utils";

interface FeaturedTabsProps {
  responseMarkdown: string;
  shareLinks: {
    chatgpt?: string;
    claude?: string;
    grok?: string;
  };
}

const externalTabs = [
  { key: "chatgpt" as const, label: "ChatGPT" },
  { key: "claude" as const, label: "Claude" },
  { key: "grok" as const, label: "Grok" },
];

export function FeaturedTabs({
  responseMarkdown,
  shareLinks,
}: FeaturedTabsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-1 border-b border-border">
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            "border-b-2 border-primary text-foreground",
          )}
        >
          Root Cause
        </button>

        {externalTabs.map(
          ({ key, label }) =>
            shareLinks[key] && (
              <a
                key={key}
                href={shareLinks[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
                <ExternalLink className="size-3" />
              </a>
            ),
        )}
      </div>

      <div className="prose-sm">
        <MarkdownText>{responseMarkdown}</MarkdownText>
      </div>
    </div>
  );
}
