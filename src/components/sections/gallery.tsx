"use client";

import { motion } from "framer-motion";
import { Images, ArrowRight } from "lucide-react";

import { useSiteConfig } from "@/components/site-config-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCollections } from "@/lib/gallery";

/**
 * Homepage "Gallery" teaser: one card per album, each opening its own
 * /gallery/<slug> page. Covers come from the first photo of each album, so
 * the cards update automatically as photos are added from /admin.
 */
export function Gallery() {
  const siteConfig = useSiteConfig();
  const section = siteConfig.sections.gallery;
  if (section?.visible === false) return null;

  const collections = getCollections(siteConfig);
  if (collections.length === 0) return null;

  return (
    <section
      id="gallery"
      className="bg-muted/40 py-16 sm:py-20 lg:py-24"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 bg-brand/10 text-brand-deep">
            {section?.badge ?? "Gallery"}
          </Badge>
          <h2
            id="gallery-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {section?.heading ?? "Photo Gallery"}
          </h2>
          {section?.subheading && (
            <p className="mt-3 text-pretty text-muted-foreground">{section.subheading}</p>
          )}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, i) => {
            const cover = collection.photos[0]?.src;
            return (
              <motion.a
                key={collection.slug}
                href={`/gallery/${collection.slug}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="block"
              >
                <Card className="group h-full overflow-hidden border-brand/15 p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-deep/10">
                  <div className="relative aspect-[16/10] overflow-hidden bg-brand/10">
                    {cover ? (
                      <img
                        src={cover}
                        alt={collection.title}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <Images className="size-10 text-brand/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/40 via-transparent to-transparent" />
                  </div>
                  <CardContent className="py-4">
                    <div className="inline-flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Images className="size-5" />
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-foreground">{collection.title}</h3>
                    {collection.subtitle && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {collection.subtitle}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {collection.photos.length} photo{collection.photos.length === 1 ? "" : "s"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-all group-hover:gap-3">
                        View album
                        <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
