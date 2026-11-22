import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, BedDouble, Ruler, CalendarDays, ExternalLink } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YachtPhoto } from "@/components/yacht/YachtPhoto";
import { YachtEnquiryForm } from "@/components/yacht/YachtEnquiryForm";
import { getYachtDetail } from "@/lib/cya";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  try {
    const detail = await getYachtDetail(id);
    const name = typeof detail.yachtName === "string" ? detail.yachtName : "Charter yacht";
    return {
      title: `${name} | Charter Yacht from My Caribbean Charters`,
      description: `View specifications, photographs and indicative rates for ${name}, and enquire with My Caribbean Charters.`,
    };
  } catch {
    return { title: "Charter Yacht | My Caribbean Charters" };
  }
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

// CYA returns `lenght` (not `length`). Values may be numeric or numeric strings.
function lengthValue(detail: Record<string, unknown>): number | null {
  const raw = detail.lenght;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function lengthUnit(detail: Record<string, unknown>): string {
  const unit = str(detail.lenght_unit ?? detail.lenghtUnit ?? detail.length_unit);
  return unit ?? "m";
}

// Collect gallery URLs from `main_image` + `Images` (uppercase I). `Images`
// may be an array of URL strings or an array of objects with a url field —
// both are handled defensively without inventing data.
function collectPhotos(detail: Record<string, unknown>): string[] {
  const photos: string[] = [];
  const main = str(detail.main_image);
  if (main) photos.push(main);
  const images = detail.Images;
  if (Array.isArray(images)) {
    for (const item of images) {
      if (typeof item === "string" && item.startsWith("https://")) {
        photos.push(item);
      } else if (item && typeof item === "object") {
        const url = str((item as Record<string, unknown>).url);
        if (url) photos.push(url);
      }
    }
  } else if (typeof images === "string" && images.startsWith("https://")) {
    photos.push(images);
  }
  return [...new Set(photos)];
}

// Accommodations may be a single text block or a list of entries (strings or
// objects). Render whatever shape arrives; never fabricate.
function AccommodationsBlock({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    const items = value
      .map((item) =>
        typeof item === "string"
          ? item.trim()
          : item && typeof item === "object"
            ? str((item as Record<string, unknown>).detail ?? (item as Record<string, unknown>).description ?? (item as Record<string, unknown>).text)
            : null
      )
      .filter((s): s is string => Boolean(s));
    if (items.length === 0) return null;
    return (
      <ul className="list-disc space-y-2 pl-5 leading-relaxed text-[#061625]/80">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  const text = str(value);
  return text ? <p className="whitespace-pre-line leading-relaxed text-[#061625]/80">{text}</p> : null;
}

// Watersports / toys: text, arrays of strings, or objects with named lists.
function ListBlock({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    const items = value
      .map((item) =>
        typeof item === "string"
          ? item.trim()
          : item && typeof item === "object"
            ? str((item as Record<string, unknown>).name ?? (item as Record<string, unknown>).title ?? (item as Record<string, unknown>).label)
            : null
      )
      .filter((s): s is string => Boolean(s));
    if (items.length === 0) return null;
    return (
      <ul className="list-disc space-y-1 pl-5 leading-relaxed text-[#061625]/80">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  const text = str(value);
  return text ? <p className="leading-relaxed text-[#061625]/80">{text}</p> : null;
}

// Seasonal pricing: CYA provides `seasons` plus weekly `low_price`/`high_price`
// and a `min_price_usd`. Only rows that CYA actually provides are rendered.
function SeasonPricing({ detail }: { detail: Record<string, unknown> }) {
  const seasons = detail.seasons;
  type SeasonRow = { label: string; price: string };
  const rows: SeasonRow[] = [];

  if (Array.isArray(seasons)) {
    for (const s of seasons) {
      if (!s || typeof s !== "object") continue;
      const obj = s as Record<string, unknown>;
      const label =
        str(obj.season_name ?? obj.seasonName ?? obj.name ?? obj.label) ??
        [str(obj.start_date ?? obj.startDate), str(obj.end_date ?? obj.endDate)].filter(Boolean).join(" – ") ??
        "Season";
      const low = num(obj.low_price ?? obj.lowPrice) ?? num(obj.price);
      const high = num(obj.high_price ?? obj.highPrice);
      const price =
        low !== null && high !== null
          ? `$${Math.round(low).toLocaleString("en-US")} – $${Math.round(high).toLocaleString("en-US")} / week`
          : low !== null
            ? `From $${Math.round(low).toLocaleString("en-US")} / week`
            : str(obj.price) ?? null;
      if (price) rows.push({ label, price });
    }
  }

  const low = num(detail.low_price);
  const high = num(detail.high_price);
  const overall =
    low !== null && high !== null
      ? `$${Math.round(low).toLocaleString("en-US")} – $${Math.round(high).toLocaleString("en-US")} / week`
      : low !== null
        ? `From $${Math.round(low).toLocaleString("en-US")} / week`
        : null;

  if (rows.length === 0 && overall === null) return null;

  return (
    <>
      <h2 className="mb-4 mt-12 font-display text-3xl font-normal italic text-[#061625]">Seasonal rates</h2>
      {rows.length > 0 && (
        <dl className="divide-y divide-[#061625]/10 rounded-lg bg-white shadow-sm">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-4">
              <dt className="text-[#061625]/80">{row.label}</dt>
              <dd className="text-right font-medium text-[#061625]">{row.price}</dd>
            </div>
          ))}
        </dl>
      )}
      {rows.length === 0 && overall !== null && (
        <p className="rounded-lg bg-white p-4 shadow-sm text-[#061625]">{overall}</p>
      )}
      <p className="mt-3 text-xs text-[#061625]/50">Indicative rates only, subject to confirmation.</p>
    </>
  );
}

export default async function YachtDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  if (!/^[a-f0-9]{8,32}$/i.test(id)) notFound();

  const query = await searchParams;
  const one = (key: string) => {
    const value = query[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };
  const preferredDates = [one("start"), one("end")].filter(Boolean).join(" to ");
  const guests = one("guests").replace(/\D/g, "");
  const destination = one("destination");

  let yacht: Record<string, unknown> | null = null;
  try {
    yacht = await getYachtDetail(id);
  } catch {
    yacht = null;
  }

  if (!yacht) notFound();

  const name = str(yacht.yachtName) ?? "Unnamed yacht";
  const photos = collectPhotos(yacht);
  const minUsd = num(yacht.min_price_usd);
  const heroPrice =
    minUsd !== null
      ? `From $${Math.round(minUsd).toLocaleString("en-US")} per week (indicative, subject to confirmation)`
      : "Charter rates on request";

  const builder = str(yacht.builder_name);
  const length = lengthValue(yacht);
  const lengthUnitStr = lengthUnit(yacht);
  const beam = num(yacht.beam);
  const draft = num(yacht.draft);
  const year = num(yacht.year_build) !== null ? String(yacht.year_build) : str(yacht.year_build);
  const refit = num(yacht.refit) !== null ? String(yacht.refit) : str(yacht.refit);
  const cabins = num(yacht.cabins);
  const pax = num(yacht.pax);
  const ebrochure = str(yacht.ebrochure);

  const slug = `cya-${id.slice(0, 12)}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4]">
      <Header />

      <main className="flex-1">
        <section className="bg-[#061625] px-4 pb-14 pt-32 text-white md:pb-20 md:pt-40">
          <div className="container mx-auto px-4">
            <Link
              href={destination ? `/charter-yachts?destination=${encodeURIComponent(destination)}` : "/charter-yachts"}
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to all charter yachts
            </Link>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/80">
              {str(yacht.yachtType) ?? "Charter yacht"}
            </p>
            <h1 className="font-display text-4xl font-normal italic leading-tight md:text-6xl">{name}</h1>
            {builder && <p className="mt-3 text-white/80">Built by {builder}</p>}
            <p className="mt-4 font-display text-2xl italic text-[#e89d79]">{heroPrice}</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 md:py-20">
          {photos.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.slice(0, 9).map((photo, index) => (
                <div key={photo} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#061625]/10">
                  <YachtPhoto src={photo} alt={index === 0 ? name : `${name} — photo ${index + 1}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-white p-8 text-center text-sm text-[#061625]/60">
              Photographs for this yacht are not available yet.
            </div>
          )}
          {ebrochure && (
            <p className="mt-6">
              <a
                href={ebrochure}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#061625]/20 px-5 py-2.5 text-sm font-medium text-[#061625] transition-colors hover:bg-[#061625]/5"
              >
                View full e-brochure <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </p>
          )}
        </section>

        <section className="container mx-auto grid gap-12 px-4 pb-20 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="mb-6 font-display text-3xl font-normal italic text-[#061625]">Specifications</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Yacht type", value: str(yacht.yachtType) },
                { label: "Builder", value: builder },
                { label: "Length", value: length !== null ? `${length} ${lengthUnitStr}` : null },
                { label: "Beam", value: beam !== null ? `${beam} ${lengthUnitStr}` : null },
                { label: "Draft", value: draft !== null ? `${draft} ${lengthUnitStr}` : null },
                { label: "Year built", value: year },
                { label: "Refit", value: refit },
                { label: "Cabins", value: cabins !== null ? String(cabins) : null },
                { label: "Guests", value: pax !== null ? `Up to ${pax}` : null },
              ]
                .filter((row) => row.value !== null)
                .map((row) => (
                  <div key={row.label} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
                    {row.label === "Length" || row.label === "Beam" || row.label === "Draft" ? (
                      <Ruler className="h-5 w-5 shrink-0 text-[#e89d79]" aria-hidden="true" />
                    ) : row.label === "Cabins" ? (
                      <BedDouble className="h-5 w-5 shrink-0 text-[#e89d79]" aria-hidden="true" />
                    ) : row.label === "Guests" ? (
                      <Users className="h-5 w-5 shrink-0 text-[#e89d79]" aria-hidden="true" />
                    ) : (
                      <span className="h-5 w-5" aria-hidden="true" />
                    )}
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-[#061625]/60">{row.label}</dt>
                      <dd className="text-[#061625]">{row.value}</dd>
                    </div>
                  </div>
                ))}
            </dl>

            {yacht.accommodations !== undefined && yacht.accommodations !== null && (
              <>
                <h2 className="mb-4 mt-12 font-display text-3xl font-normal italic text-[#061625]">Accommodations</h2>
                <AccommodationsBlock value={yacht.accommodations} />
              </>
            )}

            {(yacht.watersports !== undefined && yacht.watersports !== null) ||
            (yacht.other_toys !== undefined && yacht.other_toys !== null) ||
            str(yacht.yachtEngines) ? (
              <>
                <h2 className="mb-4 mt-12 font-display text-3xl font-normal italic text-[#061625]">
                  Watersports &amp; equipment
                </h2>
                <div className="space-y-4">
                  <ListBlock value={yacht.watersports} />
                  {str(yacht.other_toys) !== null && yacht.other_toys !== yacht.watersports && (
                    <ListBlock value={yacht.other_toys} />
                  )}
                  {str(yacht.yachtEngines) && <p className="text-sm text-[#061625]/70">Engines: {str(yacht.yachtEngines)}</p>}
                </div>
              </>
            ) : null}

            <SeasonPricing detail={yacht} />

            <p className="mt-10 text-xs text-[#061625]/50">
              Yacht data and images provided by Central Yacht Agent. Rates shown are indicative only and subject to
              confirmation. Some details (crew, availability) are not provided by this listing and will be included in
              your personalized proposal.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-[#061625] p-6 text-white md:p-8">
              <h2 className="mb-2 font-display text-3xl font-normal italic">Enquire About This Yacht</h2>
              <p className="mb-5 text-sm text-white/80">
                Tell us your plans and our charter team will confirm availability and send a personalized proposal for{" "}
                {name}.
              </p>
              {(preferredDates || guests) && (
                <p className="mb-5 flex items-start gap-2 rounded-lg bg-white/10 p-3 text-xs text-white/90">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#e89d79]" aria-hidden="true" />
                  <span>
                    {preferredDates && <>Dates carried from your search: {preferredDates}. </>}
                    {guests && <>Guests: {guests}. </>}
                    Please confirm the details below.
                  </span>
                </p>
              )}
            </div>
            <div className="mt-6">
              <YachtEnquiryForm
                yachtSlug={slug}
                yachtName={name}
                initialDates={preferredDates || undefined}
                initialGuests={guests || undefined}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
