import type { Plugin } from "unified";
import type { Parent, Root, Text, Link } from "mdast";
import { visit, SKIP } from "unist-util-visit";

import type { NutrientMeta } from "@/lib/content";

export interface RemarkNutrientLinksOptions {
  nutrients: NutrientMeta[];
  /**
   * When set, mentions resolving to this nutrient slug are left as plain text
   * (suppresses self-links on a nutrient's own page).
   */
  skipSlug?: string;
}

interface CompiledMatcher {
  regex: RegExp;
  termToSlug: Map<string, string>;
}

const SKIP_PARENT_TYPES = new Set([
  "link",
  "linkReference",
  "inlineCode",
  "code",
  "heading",
]);

const ESCAPE_RE = /[.*+?^${}()|[\]\\]/g;

function escapeRegex(s: string): string {
  return s.replace(ESCAPE_RE, "\\$&");
}

function compile(nutrients: NutrientMeta[]): CompiledMatcher | null {
  const termToSlug = new Map<string, string>();
  for (const n of nutrients) {
    const terms = [n.name, ...(n.aliases ?? [])];
    for (const raw of terms) {
      const term = raw?.trim();
      if (!term) continue;
      const key = term.toLowerCase();
      if (!termToSlug.has(key)) termToSlug.set(key, n.slug);
    }
  }
  if (termToSlug.size === 0) return null;

  // Sort longest-first so alternation prefers the most specific match
  // (e.g. "Vitamin K2" before "Vitamin K").
  const alternatives = [...termToSlug.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex)
    .join("|");

  // \b only works at word-character boundaries. Our terms can start/end with
  // letters or digits (e.g. "K2"), so \b is correct here. Hyphenated terms
  // like "beta-carotene" have an internal "-" which is a non-word char — \b
  // still anchors at the outer ends ("beta" start, "carotene" end), which is
  // what we want.
  const regex = new RegExp(`\\b(?:${alternatives})\\b`, "gi");
  return { regex, termToSlug };
}

export const remarkNutrientLinks: Plugin<
  [RemarkNutrientLinksOptions],
  Root
> = ({ nutrients, skipSlug }) => {
  const matcher = compile(nutrients);
  if (!matcher) return () => {};

  return (tree) => {
    visit(
      tree,
      "text",
      (
        node: Text,
        index: number | undefined,
        parent: Parent | null | undefined,
      ) => {
        if (!parent || index === undefined) return;
        if (SKIP_PARENT_TYPES.has(parent.type)) return;

        const value = node.value;
        // Fresh regex copy per node — `lastIndex` is mutable across calls.
        const re = new RegExp(matcher.regex.source, matcher.regex.flags);

        const children: Array<Text | Link> = [];
        let cursor = 0;
        let match: RegExpExecArray | null;
        let replaced = false;

        while ((match = re.exec(value)) !== null) {
          const slug = matcher.termToSlug.get(match[0].toLowerCase());
          if (!slug || slug === skipSlug) continue;

          if (match.index > cursor) {
            children.push({
              type: "text",
              value: value.slice(cursor, match.index),
            });
          }

          const link: Link = {
            type: "link",
            url: `/nutrients/${slug}`,
            children: [{ type: "text", value: match[0] }],
            data: {
              hProperties: {
                className: ["nutrient-link"],
                "data-nutrient-slug": slug,
              },
            },
          };
          children.push(link);

          cursor = match.index + match[0].length;
          replaced = true;
        }

        if (!replaced) return;

        if (cursor < value.length) {
          children.push({ type: "text", value: value.slice(cursor) });
        }

        parent.children.splice(index, 1, ...children);
        // Skip newly-inserted nodes so we don't recurse into the link text.
        return [SKIP, index + children.length];
      },
    );
  };
};

export default remarkNutrientLinks;
