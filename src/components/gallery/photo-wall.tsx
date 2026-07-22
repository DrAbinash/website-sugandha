"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryCollection } from "@/lib/gallery";
import { cn } from "@/lib/utils";

/**
 * Photo wall for a gallery collection page.
 *
 * Both layouts are gap-free by construction:
 *  - "masonry" uses CSS columns, so photos of any shape flow top-to-bottom
 *    and fill every column — no blank holes.
 *  - "grid" crops everything to uniform squares.
 *
 * Tapping any photo opens a full-screen lightbox with keyboard + arrow nav.
 */
export function PhotoWall({ collection }: { collection: GalleryCollection }) {
  const photos = collection.photos;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? i : (i + 1) % photos.length));
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, goNext, goPrev]);

  /* Friendly empty state — the page is never just blank. */
  if (photos.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-brand/25 bg-brand/5 p-10 text-center">
        <ImageIcon className="mx-auto size-8 text-brand" />
        <p className="mt-4 font-semibold text-foreground">Photos coming soon</p>
        <p className="mt-1 text-sm text-muted-foreground">
          This album is being put together right now — please check back shortly.
        </p>
      </div>
    );
  }

  return (
    <>
      {collection.layout === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, i) => (
            <Tile key={`${photo.src}-${i}`} index={i} onOpen={setLightboxIndex}>
              <img
                src={photo.src}
                alt={photo.caption || `Photo ${i + 1}`}
                loading={i < 6 ? "eager" : "lazy"}
                className="aspect-square h-full w-full rounded-xl object-cover"
              />
            </Tile>
          ))}
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
          {photos.map((photo, i) => (
            <Tile key={`${photo.src}-${i}`} index={i} onOpen={setLightboxIndex}>
              <img
                src={photo.src}
                alt={photo.caption || `Photo ${i + 1}`}
                loading={i < 6 ? "eager" : "lazy"}
                className="w-full rounded-xl object-cover"
              />
            </Tile>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Next photo"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}

          <figure
            className="flex max-h-[88vh] max-w-[92vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightboxIndex].src}
              alt={photos[lightboxIndex].caption || "Photo"}
              className="max-h-[80vh] max-w-[92vw] rounded-xl object-contain"
            />
            {photos[lightboxIndex].caption && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {photos[lightboxIndex].caption}
              </figcaption>
            )}
          </figure>

          {photos.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/60">
              {lightboxIndex + 1} / {photos.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function Tile({
  index,
  onOpen,
  children,
}: {
  index: number;
  onOpen: (i: number) => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      onClick={() => onOpen(index)}
      className={cn(
        "group relative block w-full cursor-zoom-in break-inside-avoid",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
      )}
      aria-label={`Open photo ${index + 1}`}
    >
      {children}
      <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
        <ImageIcon className="size-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </span>
    </motion.button>
  );
}
