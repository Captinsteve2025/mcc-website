"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { MenuCategory, MenuPhoto, MenuSection, MenuSummary } from "@/lib/yacht-detail";

// "The Culinary Experience" — premium dining presentation. Photography leads;
// ALL written menu content lives inside collapsed accordions. Everything shown
// comes from CYA — nothing is invented, no stock photography is used.

const INITIAL_PHOTOS = 6;

function PhotoGallery({
  photos,
  captionFor,
  lightbox,
  setLightbox,
}: {
  photos: MenuPhoto[];
  captionFor: (photo: MenuPhoto) => string;
  lightbox: { url: string; description: string | null } | null;
  setLightbox: (value: { url: string; description: string | null } | null) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const single = photos.length === 1;
  const visible = showAll || photos.length <= INITIAL_PHOTOS ? photos : photos.slice(0, INITIAL_PHOTOS);
  const hidden = photos.length - INITIAL_PHOTOS;

  return (
    <div>
      <div
        className={
          single
            ? "mx-auto max-w-2xl"
            : "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
        }
      >
        {visible.map((photo) => (
          <figure key={photo.url} className="overflow-hidden rounded-xl bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setLightbox({ url: photo.url, description: captionFor(photo) })}
              className="group block w-full cursor-zoom-in overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#EE9739]"
              aria-label={`Enlarge photo: ${captionFor(photo)}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={captionFor(photo)}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>
            <figcaption className="px-4 py-3 font-display text-base italic text-[#061625]/80">
              {captionFor(photo)}
            </figcaption>
          </figure>
        ))}
      </div>
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.description ?? "Enlarged food photograph"}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#061625]/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <figure className="max-h-full max-w-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.url}
              alt={lightbox.description ?? "Food photograph from this yacht's kitchen, enlarged"}
              className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain"
            />
            {lightbox.description && (
              <figcaption className="mt-3 text-center text-sm text-white/85">{lightbox.description}</figcaption>
            )}
          </figure>
        </div>
      )}
      {hidden > 0 && !showAll && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="rounded-full border border-[#061625]/20 px-6 py-2.5 text-sm font-medium text-[#061625] transition-colors hover:border-[#EE9739] hover:bg-[#EE9739]/10"
          >
            View All Food Photos ({photos.length})
          </button>
          <p className="mt-2 text-xs text-[#061625]/50">{hidden} more photograph{hidden === 1 ? "" : "s"} from this yacht&apos;s kitchen</p>
        </div>
      )}
    </div>
  );
}

function MenuAccordion({ categories }: { categories: MenuCategory[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[#061625]/10 overflow-hidden rounded-xl border border-[#061625]/10 bg-white">
      {categories.map((category, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={`${category.path}-${index}`}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`menu-panel-${index}`}
                id={`menu-button-${index}`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#f8f7f4] md:px-6"
              >
                <span className="font-display text-lg italic text-[#061625]">{category.title}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#EE9739] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`menu-panel-${index}`}
              role="region"
              aria-labelledby={`menu-button-${index}`}
              hidden={!isOpen}
              className="px-5 pb-5 md:px-6 md:pb-6"
            >
              {category.bodyHtml ? (
                <div
                  className="space-y-3 text-base leading-[1.6] text-[#061625]/85 [&_b]:font-semibold [&_i]:italic [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3 [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: category.bodyHtml }}
                />
              ) : (
                <p className="whitespace-pre-line text-base leading-[1.6] text-[#061625]/85">{category.bodyText}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function YachtDiningSection({ menus, chefName }: { menus: MenuSummary; chefName?: string | null }) {
  const general = menus.general;
  const writtenSections: MenuCategory[] = [
    ...menus.categories,
    ...(general?.sections ?? []).map((section: MenuSection, index: number) => ({
      title: section.title,
      bodyHtml: null,
      bodyText: section.bodyText,
      photo: null,
      path: `general-section-${index}`,
    })),
  ];
  const hasWritten = writtenSections.length > 0;
  const hasPhotos = menus.photos.length > 0;
  const [lightbox, setLightbox] = useState<{ url: string; description: string | null } | null>(null);

  // CYA menu photographs often ship without descriptions; fall back to the
  // menu category the photograph belongs to so every gallery item is captioned.
  const titleForUrl = new Map<string, string>();
  for (const category of menus.categories) {
    if (category.photo && !titleForUrl.has(category.photo.url)) {
      titleForUrl.set(category.photo.url, category.title);
    }
  }
  const captionFor = (photo: MenuPhoto) =>
    photo.description ?? titleForUrl.get(photo.url) ?? "From this yacht's menu";

  if (!hasWritten && !hasPhotos && !general) return null;

  // Only the genuine introductory lines CYA supplies before the first menu
  // heading — never the full written menu, never fallback marketing copy.
  const introText = general?.introText ?? null;

  return (
    <section className="mt-14">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#EE9739]">The Culinary Experience</p>
      <h2 id="dining" className="mb-2 scroll-mt-32 font-display text-3xl font-normal italic text-[#061625] md:text-4xl">
        Dining &amp; Cuisine
      </h2>
      {chefName && <p className="mb-3 font-display text-xl italic text-[#061625]/80">{chefName}</p>}
      {introText && (
        <p className="mb-6 max-w-2xl whitespace-pre-line text-base leading-[1.6] text-[#061625]/70">{introText}</p>
      )}

      {hasPhotos && (
        <div className="mb-10">
          <PhotoGallery photos={menus.photos} captionFor={captionFor} lightbox={lightbox} setLightbox={setLightbox} />
        </div>
      )}

      {hasWritten && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#061625]/60">Sample Menus</h3>
          <MenuAccordion categories={writtenSections} />
        </div>
      )}

      <p className="mt-8 text-base text-[#061625]/70">
        Preferences, allergies and celebrations are planned personally —{" "}
        <a href="#enquire" className="font-medium text-[#061625] underline underline-offset-4">
          tell us when you enquire
        </a>
        .
      </p>
    </section>
  );
}
