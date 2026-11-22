import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, BedDouble, Ruler, SlidersHorizontal, CalendarDays } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YachtPhoto } from "@/components/yacht/YachtPhoto";
import { searchYachts } from "@/lib/cya";

export const metadata: Metadata = {
  title: "Charter Yachts | Live Listings from My Caribbean Charters",
  description:
    "Search live crewed and bareboat charter yacht listings from Central Yacht Agent by destination, yacht type and guest count, with indicative starting rates.",
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

type Filters = {
  destination: string;
  start: string;
  end: string;
  type: string;
  guests: string;
};

function readFilters(searchParams: Record<string, string | string[] | undefined>): Filters {
  const one = (key: string) => {
    const value = searchParams[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };
  return {
    destination: one("destination").slice(0, 60),
    start: one("start").slice(0, 10),
    end: one("end").slice(0, 10),
    type: one("type").slice(0, 30),
    guests: one("guests").slice(0, 3).replace(/\D/g, ""),
  };
}

// Destination names map to cruising-area labels returned by CYA's
// /operating_areas endpoint (e.g. "British Virgin Islands"). Matching is done
// on the verified seasonAreas response field, not invented filter IDs.
function yachtMatchesArea(yacht: Yacht, destination: string): boolean {
  const areas = yacht.seasonAreas;
  if (!Array.isArray(areas)) return false;
  const needle = destination.toLowerCase();
  return areas.some((area) => {
    if (typeof area === "string") return area.toLowerCase().includes(needle);
    if (area && typeof area === "object") {
      const name = (area as Record<string, unknown>).name ?? (area as Record<string, unknown>).label;
      return typeof name === "string" && name.toLowerCase().includes(needle);
    }
    return false;
  });
}

function yachtAreaLabel(yacht: Yacht): string | null {
  const areas = yacht.seasonAreas;
  if (Array.isArray(areas) && areas.length > 0) {
    const first = areas[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      const obj = first as Record<string, unknown>;
      const name = obj.name ?? obj.label;
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

function matchesFilters(yacht: Yacht, filters: Filters): boolean {
  if (filters.destination && !yachtMatchesArea(yacht, filters.destination)) return false;
  if (filters.type) {
    const type = typeof yacht.yachtType === "string" ? yacht.yachtType.toLowerCase() : "";
    if (!type.includes(filters.type.toLowerCase())) return false;
  }
  if (filters.guests) {
    const guests = Number(filters.guests);
    // Yachts are shown when capacity is unknown; a known capacity below the
    // selection is filtered out. CYA may confirm a server-side guest filter later.
    if (typeof yacht.pax === "number" && yacht.pax < guests) return false;
  }
  return true;
}

function YachtCard({ yacht, detailHref }: { yacht: Yacht; detailHref: (id: string) => string }) {
  const image = yachtImage(yacht);
  const area = yachtAreaLabel(yacht);
  const price = yachtPrice(yacht);
  const name = typeof yacht.yachtName === "string" ? yacht.yachtName : "Unnamed yacht";
  const href = detailHref(typeof yacht.id === "string" ? yacht.id : "");
  return (
    <li className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-[#061625]/10" aria-label={`View ${name}`}>
        {image ? (
          <YachtPhoto src={image} alt={name} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#061625]/50">
            Photo not available
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <Link href={href}>
          <h2 className="font-display text-2xl font-normal italic text-[#061625] hover:text-[#e89d79]">{name}</h2>
        </Link>
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
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-[#e89d79] px-5 py-2.5 text-sm font-medium text-[#061625] transition-colors hover:bg-[#d88a66]"
          >
            View Yacht <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </li>
  );
}

function RefinementBar({ filters, basePath }: { filters: Filters; basePath: string }) {
  const destinations = [
    { slug: "", name: "All Destinations" },
    { slug: "british-virgin-islands", name: "British Virgin Islands" },
    { slug: "us-virgin-islands", name: "US Virgin Islands" },
    { slug: "st-martin", name: "St Martin" },
    { slug: "antigua", name: "Antigua" },
    { slug: "bahamas", name: "Bahamas" },
    { slug: "grenadines", name: "Grenadines" },
  ];
  const types = [
    { value: "", label: "All Types" },
    { value: "catamaran", label: "Catamaran" },
    { value: "monohull", label: "Sailing Yacht" },
    { value: "motor", label: "Motor Yacht" },
    { value: "power-catamaran", label: "Power Catamaran" },
  ];
  // Destination matching uses CYA's own area labels; the destination slug is
  // resolved to matching words server-side in readFilters-time matching.

  return (
    <form action={basePath} method="get" className="mb-10 rounded-lg bg-white p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        <select
          name="destination"
          defaultValue={filters.destination}
          aria-label="Destination"
          className="h-11 rounded-md border border-[#061625]/20 bg-white px-3 text-sm text-[#061625]"
        >
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>{d.name}</option>
          ))}
        </select>
        <input
          type="date"
          name="start"
          defaultValue={filters.start}
          aria-label="Charter start date"
          className="h-11 rounded-md border border-[#061625]/20 bg-white px-3 text-sm text-[#061625]"
        />
        <input
          type="date"
          name="end"
          defaultValue={filters.end}
          aria-label="Charter end date"
          className="h-11 rounded-md border border-[#061625]/20 bg-white px-3 text-sm text-[#061625]"
        />
        <select
          name="type"
          defaultValue={filters.type}
          aria-label="Yacht type"
          className="h-11 rounded-md border border-[#061625]/20 bg-white px-3 text-sm text-[#061625]"
        >
          {types.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          type="number"
          name="guests"
          min={1}
          max={12}
          defaultValue={filters.guests}
          aria-label="Guests"
          placeholder="Guests"
          className="h-11 rounded-md border border-[#061625]/20 bg-white px-3 text-sm text-[#061625]"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#e89d79] px-4 text-sm font-medium text-[#061625] transition-colors hover:bg-[#d88a66]"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Refine
        </button>
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-[#061625]/60">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        {filters.start || filters.end
          ? "Selected dates are saved with your search and passed to your enquiry. CYA does not yet confirm a date filter, so results are not filtered by dates."
          : "Dates are optional and are passed to your enquiry. CYA does not yet confirm a date filter."}
      </p>
    </form>
  );
}

export default async function CharterYachtsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = readFilters(params);
  const page = Math.max(1, Number.parseInt(Array.isArray(params.page) ? params.page[0] : params.page ?? "1", 10) || 1);

  let allYachts: Yacht[] = [];
  let totalYachts: number | null = null;
  let loadError: string | null = null;

  try {
    const search = await searchYachts({ page: 1, limit: 100, searchTerm: "", filters: {} });
    allYachts = (search.yachts as Yacht[] | undefined) ?? [];
    totalYachts = typeof search.totalYachts === "number" ? search.totalYachts : null;
  } catch {
    loadError =
      "Yacht listings are temporarily unavailable. Please try again shortly — our team has been notified.";
  }

  const filtered = allYachts.filter((y) => matchesFilters(y, filters));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageYachts = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (filters.destination) params.set("destination", filters.destination);
    if (filters.start) params.set("start", filters.start);
    if (filters.end) params.set("end", filters.end);
    if (filters.type) params.set("type", filters.type);
    if (filters.guests) params.set("guests", filters.guests);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/charter-yachts?${qs}` : "/charter-yachts";
  };
  const detailHref = (id: string) => {
    const params = new URLSearchParams();
    if (filters.destination) params.set("destination", filters.destination);
    if (filters.start) params.set("start", filters.start);
    if (filters.end) params.set("end", filters.end);
    if (filters.guests) params.set("guests", filters.guests);
    const qs = params.toString();
    return qs ? `/charter-yachts/${id}?${qs}` : `/charter-yachts/${id}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4]">
      <Header />

      <section className="bg-[#061625] px-4 pb-16 pt-36 text-center text-white md:pb-24 md:pt-44">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-white/80 md:text-base">Charter Yachts</p>
        <h1 className="mx-auto mb-6 max-w-3xl font-display text-5xl font-normal italic leading-tight md:text-6xl">
          Browse Live Charter Yachts
        </h1>
        <div className="mx-auto h-px w-16 bg-[#e89d79]" aria-hidden="true" />
        <p className="mt-6 text-white/80">
          {totalYachts !== null ? `${totalYachts} yachts listed · ${filtered.length} matching your search` : `${filtered.length} matching your search`}
        </p>
      </section>

      <main className="container mx-auto flex-1 px-4 py-16 md:py-20">
        <RefinementBar filters={filters} basePath="/charter-yachts" />

        {loadError ? (
          <p className="rounded-lg bg-white p-8 text-center text-[#061625]/75">{loadError}</p>
        ) : filtered.length === 0 ? (
          <p className="rounded-lg bg-white p-8 text-center text-[#061625]/75">
            No yachts match your search yet. Try widening your destination or guest count, or call us — new yachts are added regularly.
          </p>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pageYachts.map((yacht, index) => (
                <YachtCard key={typeof yacht.id === "string" ? yacht.id : index} yacht={yacht} detailHref={detailHref} />
              ))}
            </ul>

            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
                {safePage > 1 && (
                  <Link
                    href={buildPageHref(safePage - 1)}
                    className="rounded-full border border-[#061625]/20 px-5 py-2.5 text-sm font-medium text-[#061625] transition-colors hover:bg-[#061625]/5"
                  >
                    Previous
                  </Link>
                )}
                <span className="text-sm text-[#061625]/70">
                  Page {safePage} of {totalPages}
                </span>
                {safePage < totalPages && (
                  <Link
                    href={buildPageHref(safePage + 1)}
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
