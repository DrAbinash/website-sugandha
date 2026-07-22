/**
 * Photo gallery ("collections") shared types and helpers.
 *
 * The gallery lives inside the same site-settings JSON blob as everything
 * else (see `siteConfig.gallery` in site.config.ts), so it flows through
 * `getSiteSettings()` → `SiteConfigProvider` and is saved by the normal
 * admin "Save changes" action — no separate storage or endpoint needed.
 *
 * Each collection has a stable `slug` used for its page URL (/gallery/<slug>).
 * The slug is assigned once, when the collection is created, and never
 * changes afterwards — even if the title is later edited — so links never
 * break.
 */

export type GalleryPhoto = {
  src: string;
  caption: string;
};

export type GalleryCollection = {
  slug: string;
  title: string;
  subtitle: string;
  /** "masonry" (auto-flow columns) or "grid" (uniform squares). */
  layout: string;
  photos: GalleryPhoto[];
};

export type GalleryConfig = {
  collections: GalleryCollection[];
};

/** Turn a title into a URL-safe slug. */
export function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "album";
}

/** Append -2, -3, … until `slug` no longer collides with `taken`. */
export function uniqueSlug(slug: string, taken: Set<string>): string {
  if (!taken.has(slug)) return slug;
  let n = 2;
  while (taken.has(`${slug}-${n}`)) n++;
  return `${slug}-${n}`;
}

/** Safely read the collections list from a (possibly partial) config object. */
export function getCollections(config: {
  gallery?: { collections?: GalleryCollection[] } | null;
}): GalleryCollection[] {
  return config.gallery?.collections ?? [];
}
