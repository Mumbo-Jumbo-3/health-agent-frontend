import fs from "fs";
import path from "path";

export interface FeaturedQueryMeta {
  slug: string;
  query: string;
  description: string;
  shareLinks: {
    chatgpt?: string;
    claude?: string;
    grok?: string;
  };
}

export interface FeaturedQuery extends FeaturedQueryMeta {
  responseMarkdown: string;
}

const CONTENT_DIR = path.join(process.cwd(), "src/content/featured");

export function getAllFeaturedSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => {
      const full = path.join(CONTENT_DIR, name);
      return fs.statSync(full).isDirectory();
    });
}

export function getFeaturedQuery(slug: string): FeaturedQuery | null {
  const dir = path.join(CONTENT_DIR, slug);
  if (!fs.existsSync(dir)) return null;

  const meta: FeaturedQueryMeta = JSON.parse(
    fs.readFileSync(path.join(dir, "meta.json"), "utf-8"),
  );
  const responseMarkdown = fs.readFileSync(
    path.join(dir, "response.md"),
    "utf-8",
  );

  return { ...meta, responseMarkdown };
}
