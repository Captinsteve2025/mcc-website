"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import { YachtPhoto } from "@/components/yacht/YachtPhoto";
import { trackEvent } from "@/lib/analytics";
import type { GalleryImage } from "@/lib/yacht-detail";

type GalleryProps = {
  yachtId: string;
  yachtName: string;
  images: GalleryImage[];
};

// Full-screen lightbox inside MCC: prev/next, counter, captions, keyboard
// navigation, touch swipe. Visitors never leave the site to view photos.
function Lightbox({
  yachtName,
  images,
  startIndex,
  onClose,
}: {
  yachtName: string;
  images: GalleryImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [go, onClose]);

  const current = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${yachtName} photo gallery`}
      className="fixed inset-0 z-50 flex flex-col bg-[#061625]/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <p className="text-sm tabular-nums text-white/80">
          {index + 1} / {images.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-2 pb-4 sm:px-14"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 48) go(dx > 0 ? -1 : 1);
          touchStartX.current = null;
        }}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="absolute left-2 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:left-4"
        >
          <ChevronLeft className="h-7 w-7" aria-hidden="true" />
        </button>
        <div className="group relative h-full max-h-[70vh] w-full max-w-5xl overflow-hidden rounded-xl">
          <YachtPhoto src={current.src} alt={current.title ?? `${yachtName} photo ${index + 1}`} />
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="absolute right-2 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:right-4"
        >
          <ChevronRight className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>

      <div className="px-6 pb-6 text-center">
        {current.title && <p className="font-display text-lg italic text-white">{current.title}</p>}
        {current.description && <p className="mt-1 text-sm text-white/70">{current.description}</p>}
        {current.category && <p className="mt-1 text-xs uppercase tracking-wide text-white/50">{current.category}</p>}
      </div>
    </div>
  );
}

export function YachtHeroGallery({ yachtId, yachtName, images }: GalleryProps) {
  const [open, setOpen] = useState(false);
  const [openAt, setOpenAt] = useState(0);
  const openTracked = useRef(false);

  const openGallery = (index: number) => {
    if (!openTracked.current) {
      openTracked.current = true;
      trackEvent("yacht_gallery_open", { yacht_id: yachtId });
    }
    setOpenAt(index);
    setOpen(true);
  };

  if (images.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-sm text-[#061625]/60">
        Photographs for this yacht are not available yet.
      </div>
    );
  }

  const primary = images[0];
  const secondary = images.slice(1, 5);

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => openGallery(0)}
          aria-label={`Open photo gallery — ${primary.title ?? yachtName}`}
          className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#061625]/10 md:aspect-auto md:min-h-[26rem]"
        >
          <YachtPhoto src={primary.src} alt={primary.title ?? yachtName} />
        </button>

        <div className="grid grid-cols-2 gap-3">
          {secondary.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => openGallery(i + 1)}
              aria-label={`Open photo gallery — ${img.title ?? `photo ${i + 2}`}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-[#061625]/10"
            >
              <YachtPhoto src={img.src} alt={img.title ?? `${yachtName} photo ${i + 2}`} />
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => openGallery(0)}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#061625]/20 bg-white px-5 py-2.5 text-sm font-medium text-[#061625] shadow-sm transition-colors hover:bg-[#061625]/5"
      >
        <Images className="h-4 w-4 text-[#EE9739]" aria-hidden="true" />
        View All {images.length} Photos
      </button>

      {open && (
        <Lightbox yachtName={yachtName} images={images} startIndex={openAt} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
