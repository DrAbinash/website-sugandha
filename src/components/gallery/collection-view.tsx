"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Images } from "lucide-react";
import type { GalleryCollection } from "@/lib/gallery";
import { PhotoWall } from "@/components/gallery/photo-wall";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

/** Full page for a single gallery album (/gallery/<slug>). */
export function CollectionView({
  collection,
  siblingHref,
  siblingLabel,
}: {
  collection: GalleryCollection;
  siblingHref?: string;
  siblingLabel?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-24 pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="/#gallery"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to gallery
            </a>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-brand">
                  <Images className="size-4" />
                  Gallery
                </span>
                <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                  {collection.title}
                </h1>
                {collection.subtitle && (
                  <p className="mt-3 max-w-xl text-muted-foreground">
                    {collection.subtitle}
                  </p>
                )}
              </div>
              {siblingHref && siblingLabel && (
                <a
                  href={siblingHref}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-card px-4 py-2 text-sm font-medium text-foreground/90 transition-colors hover:border-brand/40 hover:text-brand"
                >
                  {siblingLabel}
                  <ArrowRight className="size-4" />
                </a>
              )}
            </div>
          </motion.div>

          <div className="mt-10">
            <PhotoWall collection={collection} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
