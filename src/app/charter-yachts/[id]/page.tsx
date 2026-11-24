import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Users,
  BedDouble,
  Ruler,
  CalendarDays,
  Anchor,
  Calendar,
  Ship,
  Waves,
  Snowflake,
  Gauge,
  FileText,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YachtEnquiryForm } from "@/components/yacht/YachtEnquiryForm";
import { YachtHeroGallery } from "@/components/yacht/YachtHeroGallery";
import { YachtSectionNav, type SectionTab } from "@/components/yacht/YachtSectionNav";
import { YachtPricingPanel } from "@/components/yacht/YachtPricingPanel";
import { YachtPersistentBar } from "@/components/yacht/YachtPersistentBar";
import { YachtCrewSection } from "@/components/yacht/YachtCrewSection";
import { YachtDiningSection } from "@/components/yacht/YachtDiningSection";
import { YachtCtaButtons } from "@/components/yacht/YachtCtaButtons";
import { YachtRecommendations } from "@/components/yacht/YachtRecommendations";
import { getYachtDetail } from "@/lib/cya";
import {
  candidatesFromCatalogue,
  fetchFullCatalogue,
  recommendSimilarYachts,
  subjectFromDetail,
  type YachtCandidate,
} from "@/lib/similar-yachts";
import { getYachtCrew, getYachtAvailability, mergeCrewProfiles } from "@/lib/yacht-content";
import {
  beamWithUnit,
  cleanText,
  collectGallery,
  draftWithUnit,
  lengthWithUnit,
  num,
  parseAccommodation,
  parseAmenities,
  parseCrew,
  parseCrewGeneral,
  parseMenus,
  parseSeasons,
  parseWatersports,
  str,
} from "@/lib/yacht-detail";
import { summarizePricing } from "@/lib/yacht-pricing";

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

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className="mb-6 scroll-mt-32 font-display text-3xl font-normal italic text-[#061625] md:text-4xl">
      {title}
    </h2>
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

  const [managedCrew, availability] = await Promise.all([getYachtCrew(id), getYachtAvailability(id)]);

  // Recommendations source: the complete live catalogue, walked page by page
  // through the shared Next fetch cache — no extra CYA request is attributable
  // to the recommendations section itself. A failure degrades to no section.
  let candidates: YachtCandidate[] = [];
  try {
    candidates = candidatesFromCatalogue(await fetchFullCatalogue());
  } catch {
    candidates = [];
  }
  // Crew: admin-approved profiles first, then crew CYA supplies in the detail
  // record. When neither source has crew, the section is skipped — and the
  // missing-fields note below distinguishes "no crew published" from a
  // mapping failure (crew data present under unrecognized field names).
  const crew = mergeCrewProfiles(managedCrew, parseCrew(yacht));
  const crewGeneral = parseCrewGeneral(yacht);
  const menus = parseMenus(yacht);
  if (crew.length === 0 && !crewGeneral) {
    const crewLikeFields = Object.keys(yacht).filter((key) => /crew|captain|chef|steward|deckhand/i.test(key));
    console.info("[crew] no crew profiles for yacht", {
      yachtId: id,
      crewLikeFieldsPresent: crewLikeFields,
      note: crewLikeFields.length > 0 ? "Crew-like fields exist but matched no known mapping — check parseCrew keys." : "CYA detail carries no crew fields (normal for yachts without published crew).",
    });
  }

  const name = str(yacht.yachtName) ?? "Unnamed yacht";
  const gallery = collectGallery(yacht);
  const accommodation = parseAccommodation(yacht);
  const amenities = parseAmenities(yacht);
  const watersports = parseWatersports(yacht);
  const seasons = parseSeasons(yacht);
  const length = lengthWithUnit(yacht);
  const beam = beamWithUnit(yacht);
  const draft = draftWithUnit(yacht);
  const builder = str(yacht.builder_name);
  const yachtType = str(yacht.yachtType);
  const year = num(yacht.year_build);
  const refit = num(yacht.refit);
  const flag = str(yacht.flag);
  const cruiseSpeed = num(yacht.cruising_speed);
  const maxSpeed = num(yacht.max_speed);
  const engines = cleanText(yacht.yachtEngines);

  const minUsd = num(yacht.min_price_usd);
  const pricing = summarizePricing(yacht, seasons);
  const heroPrice = pricing.headline;
  void minUsd;

  // Quick spec strip — only fields this yacht actually provides.
  const quickSpecs: Array<{ icon: typeof Ruler; label: string; value: string }> = [];
  if (length) quickSpecs.push({ icon: Ruler, label: "Length", value: `${length.value} ${length.unit}` });
  if (accommodation.pax !== null) quickSpecs.push({ icon: Users, label: "Guests", value: `Up to ${accommodation.pax}` });
  if (accommodation.cabins !== null) quickSpecs.push({ icon: BedDouble, label: "Cabins", value: String(accommodation.cabins) });
  if (cruiseSpeed !== null) quickSpecs.push({ icon: Gauge, label: "Cruising speed", value: `${cruiseSpeed} kn` });
  if (year !== null) quickSpecs.push({ icon: Calendar, label: "Built", value: String(year) });
  if (beam) quickSpecs.push({ icon: Ruler, label: "Beam", value: `${beam.value} ${beam.unit}` });
  if (draft) quickSpecs.push({ icon: Ruler, label: "Draft", value: `${draft.value} ${draft.unit}` });

  // Full specifications, grouped. Empty values are omitted entirely.
  const generalSpecs: Array<[string, string]> = [];
  if (yachtType) generalSpecs.push(["Yacht type", yachtType]);
  if (builder) generalSpecs.push(["Builder", builder]);
  if (flag) generalSpecs.push(["Flag", flag]);
  if (year !== null) generalSpecs.push(["Year built", String(year)]);
  if (refit !== null && refit > 0) generalSpecs.push(["Refit", String(refit)]);
  const dimensionSpecs: Array<[string, string]> = [];
  if (length) dimensionSpecs.push(["Length", `${length.value} ${length.unit}`]);
  if (beam) dimensionSpecs.push(["Beam", `${beam.value} ${beam.unit}`]);
  if (draft) dimensionSpecs.push(["Draft", `${draft.value} ${draft.unit}`]);
  const performanceSpecs: Array<[string, string]> = [];
  if (cruiseSpeed !== null) performanceSpecs.push(["Cruising speed", `${cruiseSpeed} kn`]);
  if (maxSpeed !== null) performanceSpecs.push(["Maximum speed", `${maxSpeed} kn`]);
  if (engines) performanceSpecs.push(["Engines", engines]);
  const comfortSpecs = amenities.filter((a) =>
    ["Air conditioning", "Overnight air conditioning", "Watermaker", "Water capacity", "Fuel consumption"].includes(a.label)
  );

  const specGroups: Array<{ title: string; rows: Array<[string, string]> }> = [
    { title: "General", rows: generalSpecs },
    { title: "Dimensions", rows: dimensionSpecs },
    { title: "Performance", rows: performanceSpecs },
    { title: "Comfort & systems", rows: comfortSpecs.map((a) => [a.label, a.value] as [string, string]) },
  ].filter((g) => g.rows.length > 0);

  // Only render tabs for sections that have real data for this yacht.
  const tabs: SectionTab[] = [{ id: "overview", label: "Overview" }];
  tabs.push({ id: "rates", label: "Rates & Availability" });
  if (accommodation.cabins !== null || accommodation.pax !== null || accommodation.configLine || accommodation.description || accommodation.otherFields.length > 0)
    tabs.push({ id: "accommodation", label: "Accommodation" });
  if (crew.length > 0 || crewGeneral) tabs.push({ id: "crew", label: "Crew" });
  if (menus.categories.length > 0 || menus.photos.length > 0 || menus.general)
    tabs.push({ id: "dining", label: "Dining" });
  if (watersports.items.length > 0 || watersports.tender) tabs.push({ id: "watersports", label: "Experiences" });
  if (specGroups.length > 0) tabs.push({ id: "specifications", label: "Specifications" });
  if (gallery.length > 0) tabs.push({ id: "gallery", label: "Gallery" });
  if (amenities.length > 0) tabs.push({ id: "amenities", label: "Amenities" });
  tabs.push({ id: "enquire", label: "Enquire" });

  const slug = `cya-${id.slice(0, 12)}`;

  // Two-stage similar-yacht engine: Stage-1 eligibility over the full
  // catalogue, then Stage-2 ranking with a controlled fallback tier. When the
  // catalogue is unavailable the section is skipped rather than degraded.
  const recommendation = recommendSimilarYachts(subjectFromDetail(yacht), candidates);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4]">
      <Header />

      <main className="flex-1">
        {/* --- Yacht identity --- */}
        {/* Mobile: compact identity band so photography enters the first
            viewport; desktop keeps the taller composition. */}
        <section id="yacht-hero" className="bg-[#061625] px-4 pb-6 pt-24 text-white md:pb-12 md:pt-40">
          <div className="container mx-auto px-4">
            <Link
              href={destination ? `/charter-yachts?destination=${encodeURIComponent(destination)}` : "/charter-yachts"}
              className="mb-3 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white md:mb-6"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to all charter yachts
            </Link>
            <h1 className="break-words font-display text-4xl font-normal italic leading-tight md:text-6xl">{name}</h1>
            <p className="mt-2 text-white/80">
              {[builder, year !== null ? `Built ${year}` : null].filter(Boolean).join(" | ") || (yachtType ?? "Charter yacht")}
            </p>
            <p className="mt-3 font-display text-2xl italic text-[#EE9739]">{heroPrice}</p>
            <p className="mt-1 text-xs text-white/60">Indicative weekly rate — subject to confirmation</p>
            <YachtCtaButtons yachtId={id} hasLiveData={availability.hasLiveData} />
          </div>
        </section>

        {/* --- Plan Your Charter: rates & availability panel directly under
            the hero gallery, before all brochure content --- */}
        <section className="container mx-auto px-4 pb-10 pt-6 md:py-10">
          <div id="gallery" className="scroll-mt-32">
            <YachtHeroGallery yachtId={id} yachtName={name} images={gallery} />
          </div>

          {/* Quick specification strip */}
          {quickSpecs.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {quickSpecs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-lg bg-white p-4 shadow-sm">
                  <Icon className="h-5 w-5 text-[#EE9739]" aria-hidden="true" />
                  <dt className="mt-2 text-xs uppercase tracking-wide text-[#061625]/60">{label}</dt>
                  <dd className="text-[#061625]">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <YachtSectionNav tabs={tabs} yachtId={id} />

        <div className="container mx-auto px-4">
          <YachtPricingPanel
            yachtId={id}
            name={name}
            pricing={pricing}
            availability={availability}
          />
        </div>

        {/* --- Overview, accommodation and specifications beside the sticky
            enquiry panel; per the brief: overview → rates+availability (above)
            → accommodation → crew → dining → experiences --- */}
        <div className="container mx-auto grid grid-cols-1 gap-12 px-4 pb-24 [overflow-wrap:anywhere] lg:grid-cols-5">
          <div className="lg:col-span-3">
            {/* --- Overview --- */}
            <SectionHeading id="overview" title="Overview" />
            <div className="space-y-4 leading-relaxed text-[#061625]/80">
              <p>
                {name} is {yachtType ? `a ${yachtType.toLowerCase()}` : "a charter yacht"}
                {builder ? ` built by ${builder}` : ""}
                {year !== null ? ` in ${year}` : ""}
                {length ? `, measuring ${length.value} ${length.unit}` : ""}
                {accommodation.pax !== null ? ` and welcoming up to ${accommodation.pax} guests` : ""}.
              </p>
              {accommodation.cabins !== null && accommodation.pax !== null && (
                <p>
                  Guest accommodation spans {accommodation.cabins} cabin{accommodation.cabins === 1 ? "" : "s"},
                  giving every party space to relax aboard.
                </p>
              )}
              {cleanText(yacht.description) && (
                <p className="whitespace-pre-line">{cleanText(yacht.description)}</p>
              )}
            </div>

            {/* --- Accommodation --- */}
            {(accommodation.configLine || accommodation.description || accommodation.otherFields.length > 0) && (
              <section className="mt-14">
                <SectionHeading id="accommodation" title="Accommodation" />
                <dl className="grid gap-3 sm:grid-cols-3">
                  {accommodation.pax !== null && (
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <Users className="h-5 w-5 text-[#EE9739]" aria-hidden="true" />
                      <dt className="mt-2 text-xs uppercase tracking-wide text-[#061625]/60">Guests</dt>
                      <dd className="text-[#061625]">Up to {accommodation.pax}</dd>
                    </div>
                  )}
                  {accommodation.cabins !== null && (
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <BedDouble className="h-5 w-5 text-[#EE9739]" aria-hidden="true" />
                      <dt className="mt-2 text-xs uppercase tracking-wide text-[#061625]/60">Cabins</dt>
                      <dd className="text-[#061625]">{accommodation.cabins}</dd>
                    </div>
                  )}
                  {accommodation.bathrooms && (
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <Snowflake className="h-5 w-5 text-[#EE9739]" aria-hidden="true" />
                      <dt className="mt-2 text-xs uppercase tracking-wide text-[#061625]/60">Bathrooms</dt>
                      <dd className="text-[#061625]">{accommodation.bathrooms}</dd>
                    </div>
                  )}
                </dl>
                {accommodation.configLine && (
                  <p className="mt-4 rounded-lg bg-white p-4 leading-relaxed text-[#061625]/80 shadow-sm">
                    {accommodation.configLine}.
                  </p>
                )}
                {accommodation.description && (
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-[#061625]/80">{accommodation.description}</p>
                )}
                {accommodation.otherFields.length > 0 && (
                  <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                    {accommodation.otherFields.map((f) => (
                      <div key={f.label} className="rounded-lg bg-white p-4 shadow-sm">
                        <dt className="text-xs uppercase tracking-wide text-[#061625]/60">{f.label}</dt>
                        <dd className="whitespace-pre-line text-[#061625]">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>
            )}

            {/* --- Full specifications --- */}
            {specGroups.length > 0 && (
              <section className="mt-14">
                <SectionHeading id="specifications" title="Specifications" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {specGroups.map((group) => (
                    <div key={group.title} className="rounded-xl bg-white p-6 shadow-sm">
                      <h3 className="mb-4 font-display text-xl italic text-[#061625]">{group.title}</h3>
                      <dl className="space-y-2.5">
                        {group.rows.map(([label, value]) => (
                          <div key={label} className="flex items-baseline justify-between gap-4 border-b border-[#061625]/5 pb-2.5 last:border-0 last:pb-0">
                            <dt className="text-sm text-[#061625]/60">{label}</dt>
                            <dd className="min-w-0 text-right text-sm font-medium text-[#061625]">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* --- Crew, dining and watersports: beneath the enquiry panel's
              sticky column on desktop, stacked in the brief's order --- */}
          <div className="lg:col-span-5">
            {/* --- Watersports & Experiences --- */}
            {(watersports.tender || watersports.items.length > 0) && (
              <section className="mt-14">
                <SectionHeading id="watersports" title="Experiences On Board & On The Water" />
                {watersports.tender && (
                  <div className="mb-4 flex flex-col gap-4 rounded-xl bg-[#061625] p-6 text-white sm:flex-row sm:items-center">
                    <Ship className="h-8 w-8 shrink-0 text-[#EE9739]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EE9739]">Tender</p>
                      <p className="mt-1 font-display text-xl italic">{watersports.tender}</p>
                    </div>
                  </div>
                )}
                {watersports.items.length > 0 && (
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {watersports.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 rounded-lg bg-white p-4 text-sm text-[#061625] shadow-sm">
                        <Waves className="h-5 w-5 shrink-0 text-[#EE9739]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            <YachtCrewSection crew={crew} yachtId={id} crewGeneral={crewGeneral} />
            <YachtDiningSection
              menus={menus}
              chefName={
                crew.find((member) => /chef/i.test(member.role))?.name ??
                menus.general?.chefName ??
                null
              }
            />
          </div>

          {/* --- Enquiry panel (sticky beside the introductory content) --- */}
          <div className="lg:col-span-2 -mt-12 lg:row-start-1 lg:col-start-4">
            <div id="enquire" className="scroll-mt-32 lg:sticky lg:top-28">
              <div className="rounded-2xl bg-[#061625] p-6 text-white md:p-8">
                <h2 className="mb-2 font-display text-3xl font-normal italic">Request Your Personal Charter Proposal</h2>
                <p className="mb-5 text-sm text-white/80">
                  Tell us your preferred dates and guest details. Our charter team will confirm availability and
                  prepare your personalized quotation.
                </p>
                {(preferredDates || guests) && (
                  <p className="mb-5 flex items-start gap-2 rounded-lg bg-white/10 p-3 text-xs text-white/90">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#EE9739]" aria-hidden="true" />
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
                  cyaYachtId={id}
                  initialDates={preferredDates || undefined}
                  initialGuests={guests || undefined}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Amenities, booking conditions and footer notes --- */}
        <div className="container mx-auto px-4 pb-24">
            {/* --- Amenities --- */}
            {amenities.length > 0 && (
              <section className="mt-14">
                <SectionHeading id="amenities" title="Amenities & Comfort" />
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {amenities.map((a) => (
                    <li key={a.label} className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 text-sm shadow-sm">
                      <span className="text-[#061625]/70">{a.label}</span>
                      <span className="text-right font-medium text-[#061625]">{a.value}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* --- Booking conditions (rates panel above carries the seasons) --- */}
            <section className="mt-14 rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <CalendarDays className="h-8 w-8 shrink-0 text-[#EE9739]" aria-hidden="true" />
                <div className="flex-1">
                  <h3 className="font-display text-xl italic text-[#061625]">Booking conditions</h3>
                  <p className="text-sm text-[#061625]/70">
                    Charter availability shown above reflects confirmed dates on record and is re-checked with you
                    before any commitment. Select your dates on the calendar or in the form, and our team confirms
                    everything personally with your proposal.
                  </p>
                </div>
                <a
                  href="#enquire"
                  className="shrink-0 rounded-full border border-[#061625]/20 px-5 py-2.5 text-sm font-medium text-[#061625] transition-colors hover:bg-[#061625]/5"
                >
                  Ask about your dates
                </a>
              </div>
            </section>

            <p className="mt-10 text-xs text-[#061625]/50">
              Yacht data and images provided by Central Yacht Agent. Rates shown are indicative only and subject to
              confirmation.
            </p>
        </div>

        <YachtPersistentBar yachtId={id} headline={pricing.headline} hasRate={pricing.hasRate} />

        {/* --- Discover More: deterministic similar-yacht recommendations,
            after the enquiry section, before the footer --- */}
        <div className="container mx-auto px-4 pb-24">
          <YachtRecommendations
            strictMatches={recommendation.strictMatches}
            broaderMatches={recommendation.broaderMatches}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
