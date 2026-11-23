"use client";

import { useState } from "react";
import { ChefHat, UtensilsCrossed } from "lucide-react";
import type { MenuSummary } from "@/lib/yacht-detail";

// "Dining & Cuisine" renders only genuine CYA menu and food-photography data
// for the selected yacht. Components with no data are hidden individually and
// the whole section disappears when CYA supplies neither menus nor photos —
// nothing is fabricated and no stock photography is used.

function MenuCategoryCard({ title, bodyHtml, bodyText }: { title: string; bodyHtml: string | null; bodyText: string | null }) {
  const long = (bodyText ?? bodyHtml ?? "").length > 320;
  const [expanded, setExpanded] = useState(false);
  const body = bodyHtml ? (
    <div
      className="space-y-2 text-sm leading-relaxed text-[#061625]/85 [&_b]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-2 [&_strong]:font-semibold"
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  ) : (
    bodyText && <p className="whitespace-pre-line text-sm leading-relaxed text-[#061625]/85">{bodyText}</p>
  );

  return (
    <article className="rounded-xl bg-white p-5 shadow-sm">
      <h3 className="mb-2 flex items-center gap-2 font-display text-xl italic text-[#061625]">
        <UtensilsCrossed className="h-4 w-4 shrink-0 text-[#EE9739]" aria-hidden="true" />
        {title}
      </h3>
      {long && !expanded ? (
        <>
          <div className="relative max-h-40 overflow-hidden">
            {body}
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
          {body}
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
    </article>
  );
}

export function YachtDiningSection({ menus }: { menus: MenuSummary }) {
  const hasCategories = menus.categories.length > 0;
  const hasPhotos = menus.photos.length > 0;
  const [lightbox, setLightbox] = useState<{ url: string; description: string | null } | null>(null);

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
            <button
              key={photo.url}
              type="button"
              onClick={() => setLightbox({ url: photo.url, description: photo.description })}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#061625]/5 focus:outline-none focus:ring-2 focus:ring-[#EE9739]"
              aria-label={photo.description ? `Enlarge photo: ${photo.description}` : "Enlarge photo"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.description ?? "Food photograph from this yacht's kitchen"}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {hasCategories && (
        <div className="grid gap-4 md:grid-cols-2">
          {menus.categories.map((category, index) => (
            <MenuCategoryCard
              key={`${category.path}-${index}`}
              title={category.title}
              bodyHtml={category.bodyHtml}
              bodyText={category.bodyText}
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
