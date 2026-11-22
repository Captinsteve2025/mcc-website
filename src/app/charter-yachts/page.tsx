import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, BedDouble, Ruler, SlidersHorizontal, CalendarDays, TriangleAlert } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YachtPhoto } from "@/components/yacht/YachtPhoto";
import { YachtNameSearch } from "@/components/yacht/YachtNameSearch";
import {
  startYachtSearchSession,
  getOperatingAreas,
  resolveDestinationAreas,
  DESTINATION_AREA_MAPPING,
  yachtSeasonAreaNames,
  type Yacht,
} from "@/lib/cya";

export const metadata: Metadata = {
  title: "Charter Yachts | Live Listings from My Caribbean Charters",
  description:
    "Search live crewed and bareboat charter yacht listings from Central Yacht Agent by destination, yacht type and guest count, with indicative starting rates.",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

type Filters = {
  destination: string;
  start: string;
  end: string;
  type: string;
  guests: string;
  name: string;
};

const TYPE_WORDS: Record<string, string[]> = {
  catamaran: ["catamaran"],
  monohull: ["monohull", "sailing yacht", "sail"],
  motor: ["motor", "power"],
  "power-catamaran": ["power cat", "powercat"],
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
    name: one("name").slice(0, 60),
  };
}

function yachtAreaLabel(yacht: Yacht): string | null {
  const names = yachtSeasonAreaNames(yacht);
  return names.length > 0 ? names[0] : null;
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

function RefinementBar({
  filters,
  basePath,
}: {
  filters: Filters;
  basePath: string;
}) {
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
        <YachtNameSearch defaultValue={filters.name} basePath="/charter-yachts" />
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

  let pageYachts: Yacht[] = [];
  let effectiveTotal: number | null = null;
  let unmatchedDestination = false;
  let loadError: string | null = null;
  let resultsIncomplete = false;
  let checkedRecords = 0;
  let anyCriteria = false;
  let localMatches: number | null = null;
  let regionNote: string | null = null;
  let unverifiableArea = false;
  let searchTermUnconfirmed = false;

  try {
    const areas = filters.destination ? await getOperatingAreas() : [];
    const mappingEntry = filters.destination ? DESTINATION_AREA_MAPPING[filters.destination] : undefined;
    if (mappingEntry && mappingEntry.regionNote) regionNote = mappingEntry.regionNote;
    const matched = filters.destination ? resolveDestinationAreas(areas, filters.destination) : [];
    if (filters.destination && matched.length === 0) {
      unmatchedDestination = true;
    } else {
      const typeWords = filters.type ? TYPE_WORDS[filters.type] ?? [filters.type.toLowerCase()] : [];
      anyCriteria = Boolean(filters.destination) || typeWords.length > 0 || Boolean(filters.guests) || Boolean(filters.name);
      const session = await startYachtSearchSession({
        areaIds: matched.map((a) => a.id).filter(Boolean),
        // CYA's own labels for the mapped areas, used to verify yacht
        // seasonAreas locally when the server filter cannot be confirmed.
        areaNames: matched.map((a) => a.name),
        typeWords,
        minGuests: filters.guests ? Number(filters.guests) : null,
        nameQuery: filters.name,
      });
      pageYachts = await session.getPage(page, PAGE_SIZE);
      checkedRecords = session.checkedRecordCount;
      localMatches = session.localMatchCount;
      if (session.unverifiableAreaCount > 0) unverifiableArea = true;
      // An unconfirmed searchTerm means the served page could contain records
      // CYA returned despite the name not matching; the session's local filter
      // already excludes them, but CYA's total may include non-matches.
      searchTermUnconfirmed = Boolean(filters.name) && !session.localWalkUsed && !session.serverFilterApplied;
      if (session.localWalkUsed) {
        // Local walk: its own checked/match counts are the only honest numbers.
        effectiveTotal = session.localTotal;
        resultsIncomplete = session.localResultsIncomplete;
      } else if (session.serverFilterApplied) {
        // CYA confirmed the filters: its reported total is authoritative.
        effectiveTotal = session.serverTotal;
      } else if (!anyCriteria) {
        // Unfiltered catalogue: CYA's own totalYachts drives pagination.
        effectiveTotal = session.probeLog.find((p) => p.label.startsWith("unfiltered_page1") || p.label.startsWith("page1") || p.label.startsWith("filtered_page1"))?.totalYachts ?? null;
        if (effectiveTotal === null) effectiveTotal = session.probeLog[0]?.totalYachts ?? null;
      }
    }
  } catch {
    loadError = "Yacht listings are temporarily unavailable. Please try again shortly — our team has been notified.";
  }

  // Normalized pagination state for both paths (server-filtered or local).
  const totalPages = Math.max(1, Math.ceil((effectiveTotal ?? pageYachts.length) / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (filters.destination) params.set("destination", filters.destination);
    if (filters.start) params.set("start", filters.start);
    if (filters.end) params.set("end", filters.end);
    if (filters.type) params.set("type", filters.type);
    if (filters.guests) params.set("guests", filters.guests);
    if (filters.name) params.set("name", filters.name);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/charter-yachts?${qs}` : "/charter-yachts";
  };
  const detailHref = (id: string) => {
    const q = new URLSearchParams();
    if (filters.destination) q.set("destination", filters.destination);
    if (filters.start) q.set("start", filters.start);
    if (filters.end) q.set("end", filters.end);
    if (filters.guests) q.set("guests", filters.guests);
    const qs = q.toString();
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
          {resultsIncomplete && localMatches !== null
            ? `Checked ${checkedRecords} catalogue records so far — ${localMatches} ${localMatches === 1 ? "yacht" : "yachts"} matched; the full inventory is larger, so more matches may exist.`
            : resultsIncomplete
              ? `Checked ${checkedRecords} catalogue records so far; the full inventory is larger.`
              : effectiveTotal !== null
                ? `${effectiveTotal} ${effectiveTotal === 1 ? "yacht" : "yachts"} matching your search`
                : "Live charter yachts from Central Yacht Agent"}
        </p>
        {regionNote && (
          <p className="mx-auto mt-3 max-w-xl rounded-md bg-white/10 p-3 text-sm text-white/90">{regionNote}</p>
        )}
        {unverifiableArea && (
          <p className="mx-auto mt-3 max-w-xl rounded-md bg-white/10 p-3 text-sm text-white/90">
            Some scanned records do not list their cruising areas, so we could not fully verify this destination's results. Our team can confirm coverage directly — just ask with an enquiry.
          </p>
        )}
        {unmatchedDestination && (
          <p className="mx-auto mt-3 max-w-xl rounded-md bg-white/10 p-3 text-sm text-white/90">
            This destination is not mapped to the live cruising-area list yet — showing all yachts instead. Our team can confirm coverage for it directly.
          </p>
        )}
        {resultsIncomplete && (
          <p className="mx-auto mt-3 flex max-w-xl items-start gap-2 rounded-md bg-[#e89d79]/20 p-3 text-left text-sm text-white">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#e89d79]" aria-hidden="true" />
            <span>
              This search scanned the first {checkedRecords} records of the live catalogue and found {localMatches ?? "some"} {localMatches === 1 ? "match" : "matches"}; more records remain unchecked, so this is not the complete result. Our team can check the full inventory for you — just ask.
            </span>
          </p>
        )}
      </section>

      <main className="container mx-auto flex-1 px-4 py-16 md:py-20">
        <RefinementBar filters={filters} basePath="/charter-yachts" />

        {loadError ? (
          <p className="rounded-lg bg-white p-8 text-center text-[#061625]/75">{loadError}</p>
        ) : unmatchedDestination ? (
          <p className="rounded-lg bg-white p-8 text-center text-[#061625]/75">
            This destination is not mapped to the live cruising-area list yet. Try widening your search, or call us — our team can confirm coverage directly.
          </p>
        ) : pageYachts.length === 0 && anyCriteria && resultsIncomplete ? (
          <p className="rounded-lg bg-white p-8 text-center text-[#061625]/75">
            No matches found in the {checkedRecords} catalogue records checked so far — more records remain unchecked, so matching yachts may still exist. Try widening your search, or enquire and we will check the full inventory.
          </p>
        ) : pageYachts.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="text-[#061625]/75">No yachts found</p>
            {filters.name && (
              <p className="mt-1 text-sm text-[#061625]/60">
                No yacht named &ldquo;{filters.name}&rdquo; matches in the live catalogue.
              </p>
            )}
            <Link
              href="/charter-yachts"
              className="mt-4 inline-block rounded-full border border-[#061625]/20 px-5 py-2.5 text-sm font-medium text-[#061625] transition-colors hover:bg-[#061625]/5"
            >
              Clear the search
            </Link>
          </div>
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
