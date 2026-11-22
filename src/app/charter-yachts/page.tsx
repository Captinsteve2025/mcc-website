import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, BedDouble, Ruler } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YachtPhoto } from "@/components/yacht/YachtPhoto";
import { searchYachts } from "@/lib/cya";

export const metadata: Metadata = {
  title: "Charter Yachts | Live Listings from My Caribbean Charters",
  description:
    "Browse live crewed and bareboat charter yacht listings from Central Yacht Agent, with cruising areas, layouts and indicative starting rates.",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

type Yacht = {
  id?: unknown;
  yachtName?: unknown;
  yachtType?: unknown;
  length?: unknown;
  units?: unknown;
  year_build?: unknown;
  cabins?: unknown;
  pax?: unknown;
  seasonAreas?: unknown;
  image?: unknown;
  min_price?: unknown;
  currency?: unknown;
  min_price_usd?: unknown;
};

function yachtArea(yacht: Yacht): string | null {
  const areas = yacht.seasonAreas;
  if (Array.isArray(areas) && areas.length > 0) {
    const first = areas[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      const obj = first as Record<string, unknown>;
      const name = obj.name ?? obj.label ?? obj.area;
      if (typeof name === "string") return name;
    }
  }
  return null;
}

function yachtPrice(yacht: Yacht): string | null {
  if (typeof yacht.min_price_usd === "number") {
    return `$${Math.round(yacht.min_price_usd).toLocaleString("en-US")}+ indicative`;
  }
  if (typeof yacht.min_price === "number") {
    const currency = typeof yacht.currency === "string" ? yacht.currency : "";
    return `${currency}${Math.round(yacht.min_price).toLocaleString("en-US")}+ indicative`;
  }
  return null;
}

function yachtImage(yacht: Yacht): string | null {
  return typeof yacht.image === "string" && yacht.image.startsWith("https://") ? yacht.image : null;
}

function YachtCard({ yacht }: { yacht: Yacht }) {
  const image = yachtImage(yacht);
  const area = yachtArea(yacht);
  const price = yachtPrice(yacht);
  return (
    <li className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#061625]/10">
        {image ? (
          <YachtPhoto
            src={image}
            alt={typeof yacht.yachtName === "string" ? yacht.yachtName : "Charter yacht"}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#061625]/50">
            Photo not available
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-display text-2xl font-normal italic text-[#061625]">
          {typeof yacht.yachtName === "string" ? yacht.yachtName : "Unnamed yacht"}
        </h2>
        <p className="mt-1 text-sm text-[#061625]/70">
          {typeof yacht.yachtType === "string" ? yacht.yachtType : null}
          {typeof yacht.year_build === "number" ? ` · ${yacht.year_build}` : null}
        </p>
        <ul className="mt-4 space-y-1.5 text-sm text-[#061625]/80">
          {typeof yacht.length === "number" && (
            <li className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-[#e89d79]" aria-hidden="true" />
              {yacht.length} {typeof yacht.units === "string" ? yacht.units : "ft"}
            </li>
          )}
          {typeof yacht.cabins === "number" && (
            <li className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-[#e89d79]" aria-hidden="true" />
              {yacht.cabins} cabins
            </li>
          )}
          {typeof yacht.pax === "number" && (
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#e89d79]" aria-hidden="true" />
              Up to {yacht.pax} guests
            </li>
          )}
          {area && <li>{area}</li>}
        </ul>
        {price && <p className="mt-4 font-display text-xl italic text-[#061625]">{price}</p>}
        <div className="mt-auto pt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e89d79] px-5 py-2.5 text-sm font-medium text-[#061625] transition-colors group-hover:bg-[#d88a66]">
            View Yacht <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </li>
  );
}

export default async function CharterYachtsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  let yachts: Yacht[] = [];
  let totalYachts: number | null = null;
  let loadError: string | null = null;

  try {
    const search = await searchYachts({ page, limit: PAGE_SIZE, searchTerm: "", filters: {} });
    yachts = (search.yachts as Yacht[] | undefined) ?? [];
    totalYachts = typeof search.totalYachts === "number" ? search.totalYachts : null;
  } catch {
    loadError =
      "Yacht listings are temporarily unavailable. Please try again shortly — our team has been notified.";
  }

  const totalPages = totalYachts ? Math.ceil(totalYachts / PAGE_SIZE) : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4]">
      <Header />

      <section className="bg-[#061625] px-4 pb-16 pt-36 text-center text-white md:pb-24 md:pt-44">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-white/80 md:text-base">Charter Yachts</p>
        <h1 className="mx-auto mb-6 max-w-3xl font-display text-5xl font-normal italic leading-tight md:text-6xl">
          Browse Live Charter Yachts
        </h1>
        <div className="mx-auto h-px w-16 bg-[#e89d79]" aria-hidden="true" />
        {totalYachts !== null && (
          <p className="mt-6 text-white/80">{totalYachts} yachts currently listed</p>
        )}
      </section>

      <main className="container mx-auto flex-1 px-4 py-16 md:py-20">
        {loadError ? (
          <p className="rounded-lg bg-white p-8 text-center text-[#061625]/75">{loadError}</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {yachts.map((yacht, index) => (
                <YachtCard key={typeof yacht.id === "string" ? yacht.id : index} yacht={yacht} />
              ))}
            </ul>

            {totalPages !== null && totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
                {page > 1 && (
                  <Link
                    href={`/charter-yachts?page=${page - 1}`}
                    className="rounded-full border border-[#061625]/20 px-5 py-2.5 text-sm font-medium text-[#061625] transition-colors hover:bg-[#061625]/5"
                  >
                    Previous
                  </Link>
                )}
                <span className="text-sm text-[#061625]/70">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/charter-yachts?page=${page + 1}`}
                    className="rounded-full border border-[#061625]/20 px-5 py-2.5 text-sm font-medium text-[#061625] transition-colors hover:bg-[#061625]/5"
                  >
                    Next
                  </Link>
                )}
              </nav>
            )}

            <p className="mt-10 text-center text-xs text-[#061625]/50">
              Yacht data and images provided by Central Yacht Agent. Starting rates shown are
              indicative only and subject to confirmation.
            </p>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
