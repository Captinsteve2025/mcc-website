import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, BedDouble, Ruler, CalendarDays } from "lucide-react";
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

function areaLabel(areas: unknown): string | null {
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
  const photos: string[] = [];
  try {
    const detail = await getYachtDetail(id);
    yacht = detail;
    const image = str(detail.image);
    if (image) photos.push(image);
    if (Array.isArray(detail.images)) {
      for (const item of detail.images) {
        if (typeof item === "string" && item.startsWith("https://")) photos.push(item);
      }
    }
  } catch {
    yacht = null;
  }

  if (!yacht) notFound();

  const name = str(yacht.yachtName) ?? "Unnamed yacht";
  const priceUsd = typeof yacht.min_price_usd === "number" ? yacht.min_price_usd : null;
  const price =
    priceUsd !== null
      ? `From $${Math.round(priceUsd).toLocaleString("en-US")} per week (indicative, subject to confirmation)`
      : typeof yacht.min_price === "number"
        ? `From ${str(yacht.currency) ?? ""}${Math.round(yacht.min_price).toLocaleString("en-US")} (indicative, subject to confirmation)`
        : "Charter rates on request";

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
            {str(yacht.year_build) && (
              <p className="mt-3 text-white/80">Built {str(yacht.year_build)}</p>
            )}
            <p className="mt-4 font-display text-2xl italic text-[#e89d79]">{price}</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 md:py-20">
          {photos.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.slice(0, 6).map((photo, index) => (
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
        </section>

        <section className="container mx-auto grid gap-12 px-4 pb-20 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="mb-6 font-display text-3xl font-normal italic text-[#061625]">Specifications</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Yacht type", value: str(yacht.yachtType) },
                { label: "Length", value: typeof yacht.length === "number" ? `${yacht.length} ${str(yacht.units) ?? "ft"}` : null },
                { label: "Cabins", value: typeof yacht.cabins === "number" ? String(yacht.cabins) : null },
                { label: "Guests", value: typeof yacht.pax === "number" ? `Up to ${yacht.pax}` : null },
                { label: "Cruising area", value: areaLabel(yacht.seasonAreas) },
              ]
                .filter((row) => row.value !== null)
                .map((row) => (
                  <div key={row.label} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
                    {row.label === "Length" ? (
                      <Ruler className="h-5 w-5 text-[#e89d79]" aria-hidden="true" />
                    ) : row.label === "Cabins" ? (
                      <BedDouble className="h-5 w-5 text-[#e89d79]" aria-hidden="true" />
                    ) : row.label === "Guests" ? (
                      <Users className="h-5 w-5 text-[#e89d79]" aria-hidden="true" />
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

            {str(yacht.description) && (
              <>
                <h2 className="mb-4 mt-12 font-display text-3xl font-normal italic text-[#061625]">About this yacht</h2>
                <p className="whitespace-pre-line leading-relaxed text-[#061625]/80">{str(yacht.description)}</p>
              </>
            )}

            <p className="mt-10 text-xs text-[#061625]/50">
              Yacht data and images provided by Central Yacht Agent. Rates shown are indicative only
              and subject to confirmation.{" "}
              {photos.length === 0 || !str(yacht.description)
                ? "Some details (crew, amenities, seasonal rates, availability) are not provided by this listing and will be included in your personalized proposal."
                : ""}
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-[#061625] p-6 text-white md:p-8">
              <h2 className="mb-2 font-display text-3xl font-normal italic">Enquire About This Yacht</h2>
              <p className="mb-5 text-sm text-white/80">
                Tell us your plans and our charter team will confirm availability and send a
                personalized proposal for {name}.
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
