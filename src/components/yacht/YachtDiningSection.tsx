"use client";

import { useState } from "react";
import { ChefHat, UtensilsCrossed } from "lucide-react";
import type { MenuSummary } from "@/lib/yacht-detail";

// "Dining & Cuisine" renders only genuine CYA menu and food-photography data
// for the selected yacht. Components with no data are hidden individually and
// the whole section disappears when CYA supplies neither menus nor photos —
// nothing is fabricated and no stock photography is used.

function MenuCategoryCard({ title, bodyHtml, bodyText, photo }: { title: string; bodyHtml: string | null; bodyText: string | null; photo: { url: string; description: string | null } | null }) {
  const [expanded, setExpanded] = useState(false);
  const body = bodyHtml ?? bodyText;
  // CYA entries with a photograph but no description render as photo cards —
  // empty-text cards are never shown.
  if (!body && photo) {
    return (
      <figure className="overflow-hidden rounded-xl bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={photo.description ?? `${title} — food photograph from this yacht's kitchen`}
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full object-cover"
        />
        <figcaption className="flex items-center gap-2 px-4 py-3 font-display text-lg italic text-[#061625]">
          <UtensilsCrossed className="h-4 w-4 shrink-0 text-[#EE9739]" aria-hidden="true" />
          {title}
        </figcaption>
      </figure>
    );
  }
  if (!body) return null;

  const long = body.length > 320;
  const bodyNode = bodyHtml ? (
    <div
      className="space-y-2 text-sm leading-relaxed text-[#061625]/85 [&_b]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-2 [&_strong]:font-semibold"
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  ) : (
    <p className="whitespace-pre-line text-sm leading-relaxed text-[#061625]/85">{bodyText}</p>
  );

  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm">
      {photo && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={photo.url}
          alt={photo.description ?? `${title} — food photograph from this yacht's kitchen`}
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full object-cover"
        />
      )}
      <div className="p-5">
        <h3 className="mb-2 flex items-center gap-2 font-display text-xl italic text-[#061625]">
          <UtensilsCrossed className="h-4 w-4 shrink-0 text-[#EE9739]" aria-hidden="true" />
          {title}
        </h3>
        {long && !expanded ? (
          <>
            <div className="relative max-h-40 overflow-hidden">
              {bodyNode}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
            </div>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-2 text-sm font-medium text-[#061625] underline underline-offset-4 transition-colors hover:text-[#EA6F33]"
            >
              Show full menu
            </button>
          </>
        ) : (
          <>
            {bodyNode}
            {long && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="mt-2 text-sm font-medium text-[#061625] underline underline-offset-4 transition-colors hover:text-[#EA6F33]"
              >
                Show less
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}

export function YachtDiningSection({ menus }: { menus: MenuSummary }) {
  const hasCategories = menus.categories.length > 0;
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
  const captionFor = (photo: { url: string; description: string | null }) =>
    photo.description ?? titleForUrl.get(photo.url) ?? "From this yacht's menu";

  if (!hasCategories && !hasPhotos && !menus.general) return null;

  return (
    <section className="mt-14">
      <h2 id="dining" className="mb-2 scroll-mt-32 font-display text-3xl font-normal italic text-[#061625] md:text-4xl">
        Dining &amp; Cuisine
      </h2>
      <p className="mb-6 max-w-2xl leading-relaxed text-[#061625]/70">
        Menus and food photography provided for this yacht — every meal prepared fresh on board by your charter
        chef.
      </p>

      {menus.general && (menus.general.descriptionHtml || menus.general.descriptionText) && (
        <div className="mb-8 rounded-xl bg-[#061625] p-6 text-white md:p-8">
          {menus.general.descriptionHtml ? (
            <div
              className="space-y-3 text-sm leading-relaxed text-white/85 [&_b]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-3 [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: menus.general.descriptionHtml }}
            />
          ) : (
            <p className="whitespace-pre-line text-sm leading-relaxed text-white/85">{menus.general.descriptionText}</p>
          )}
        </div>
      )}

      {hasPhotos && (
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {menus.photos.map((photo) => (
            <figure
              key={photo.url}
              className="overflow-hidden rounded-xl bg-[#061625]/5 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setLightbox({ url: photo.url, description: captionFor(photo) })}
                className="group relative block aspect-[4/3] w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#EE9739]"
                aria-label={`Enlarge photo: ${captionFor(photo)}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={captionFor(photo)}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
              <figcaption className="px-3 py-2 text-xs leading-relaxed text-[#061625]/75">{captionFor(photo)}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {hasCategories && (
        <div className="grid gap-4 sm:grid-cols-2">
          {menus.categories.map((category, index) => (
            <MenuCategoryCard
              key={`${category.path}-${index}`}
              title={category.title}
              bodyHtml={category.bodyHtml}
              bodyText={category.bodyText}
              photo={category.photo}
            />
          ))}
        </div>
      )}

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

      <p className="mt-6 text-sm text-[#061625]/70">
        <ChefHat className="mr-1.5 inline h-4 w-4 text-[#EE9739]" aria-hidden="true" />
        Preferences, allergies and celebrations are planned personally —{" "}
        <a href="#enquire" className="font-medium text-[#061625] underline underline-offset-4">
          tell us when you enquire
        </a>
        .
      </p>
    </section>
  );
}
