import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/site-settings";
import { getCollections } from "@/lib/gallery";
import { CollectionView } from "@/components/gallery/collection-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteConfig = await getSiteSettings();
  const collection = getCollections(siteConfig).find((c) => c.slug === slug);
  if (!collection) return {};
  return {
    title: `${collection.title} — ${siteConfig.doctor.name}`,
    description: collection.subtitle || `${collection.title} photo gallery.`,
  };
}

export default async function GalleryCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const siteConfig = await getSiteSettings();
  const collections = getCollections(siteConfig);
  const index = collections.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();

  const collection = collections[index];
  const next =
    collections.length > 1 ? collections[(index + 1) % collections.length] : undefined;

  return (
    <CollectionView
      collection={collection}
      siblingHref={next ? `/gallery/${next.slug}` : undefined}
      siblingLabel={next ? `See ${next.title}` : undefined}
    />
  );
}
