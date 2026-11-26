import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { holdRequestsEnabled } from "@/lib/hold-request-server";
import {
  ArrowLeft,
  Users,
  BedDouble,
  Ruler,
  CalendarDays,
  MapPin,
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
import { YachtReviewsSection } from "@/components/yacht/YachtReviewsSection";
import { YachtPricingPanel } from "@/components/yacht/YachtPricingPanel";
import { YachtPersistentBar } from "@/components/yacht/YachtPersistentBar";
import { YachtCrewSection } from "@/components/yacht/YachtCrewSection";
import { YachtDiningSection } from "@/components/yacht/YachtDiningSection";
import { YachtCtaButtons } from "@/components/yacht/YachtCtaButtons";
import { YachtRecommendations } from "@/components/yacht/YachtRecommendations";
import { getYachtDetail, yachtSeasonAreaNames } from "@/lib/cya";
import { loadYachtRecommendations, subjectFromDetail } from "@/lib/similar-yachts";
import { getYachtCrew, getYachtAvailability, mergeCrewProfiles } from "@/lib/yacht-content";
import {
  beamWithUnit,
  cleanText,
  collectGallery,
  draftWithUnit,
  guestAgeRestriction,
  lengthWithUnit,
  num,
  parseAccommodation,
  parseAmenities,
  parseCrew,
  parseCrewGeneral,
  parseMenus,
  parseSeasons,
  parseWatersports,
  parseYachtOverview,
  parseYachtReviews,
  str,
} from "@/lib/yacht-detail";
import { CYA_YACHT_ID, cyaYachtSocialMetadata } from "@/lib/yacht-social";
import { summarizePricing } from "@/lib/yacht-pricing";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  if (!CYA_YACHT_ID.test(id)) return {};
  try {
    return cyaYachtSocialMetadata(id, await getYachtDetail(id));
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
  if (!CYA_YACHT_ID.test(id)) notFound();

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

  const subject = subjectFromDetail(yacht, id);
  const partySize = /^\d{1,3}$/.test(one("guests")) ? Number(one("guests")) : 0;
  if (partySize > 0) subject.guests = partySize;
  const [managedCrew, availability, recommendation] = await Promise.all([
    getYachtCrew(id),
    getYachtAvailability(id),
    loadYachtRecommendations(subject).catch(() => null),
  ]);
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
  const restrictedGuests = guestAgeRestriction(accommodation);
  const guestCapacity = restrictedGuests ? `Up to ${restrictedGuests.adults} adults` : `Up to ${accommodation.pax}`;
  const amenities = parseAmenities(yacht);
  const watersports = parseWatersports(yacht);
  const seasons = parseSeasons(yacht);
  const overview = parseYachtOverview(yacht);
  const seasonalAreas = seasons.flatMap(({ areas }) => areas);
  const bviOnly = seasons.length > 0 && seasons.every(({ details, additionalRateDetails }) =>
    /\bBVI (?:charter and ports only|ports and BVI pick up\/drop off only)\b/i.test(`${details ?? ""} ${additionalRateDetails ?? ""}`),
  );
  const cruisingAreas = [...new Set(bviOnly ? ["British Virgin Islands"] :
    (seasonalAreas.length > 0 ? seasonalAreas : yachtSeasonAreaNames(yacht)).map((area) =>
      area === "Caribbean Virgin Islands (BVI)" ? "British Virgin Islands" : area,
    ),
  )];
  const preferredPickups = [...new Set(seasons.map(({ pickup }) => pickup).filter(Boolean))];
  const reviews = parseYachtReviews(yacht);
  const guestQuote = reviews.find(({ comment }) => comment.length >= 20 && comment.length <= 180);
  const chartersInTheBvi = seasons.some(({ area }) => area?.includes("Caribbean Virgin Islands (BVI)"));
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
  if (accommodation.pax !== null) quickSpecs.push({ icon: Users, label: "Guests", value: guestCapacity });
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
  if (reviews.length > 0) tabs.push({ id: "reviews", label: "Guest reviews" });

  tabs.push({ id: "enquire", label: "Enquire" });

  const slug = `cya-${id.slice(0, 12)}`;

  const recommendationQuery = new URLSearchParams();
  for (const key of ["destination", "start", "end", "guests"]) {
    const value = one(key);
    if (value) recommendationQuery.set(key, value);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4]">
      <Header compact />

      <main className="flex-1">
        {/* --- Yacht identity --- */}
        <section id="yacht-hero" className="bg-[#061625] pb-5 pt-20 text-white md:pb-7">
          <div className="container mx-auto px-4">
            <Link
              href={destination ? `/charter-yachts?destination=${encodeURIComponent(destination)}` : "/charter-yachts"}
              className="mb-1 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to all charter yachts
            </Link>
            <div className="lg:flex lg:items-end lg:justify-between lg:gap-6">
              <div className="min-w-0">
                <h1 className="break-words font-display text-4xl font-normal italic leading-tight md:text-5xl">{name}</h1>
                <p className="mt-1 text-white/80">
                  {[builder, year !== null ? `Built ${year}` : null].filter(Boolean).join(" | ") || (yachtType ?? "Charter yacht")}
                </p>
                {chartersInTheBvi && (
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/90">
                    Explore the British Virgin Islands at your own pace on a private yacht charter.
                  </p>
                )}
                <p className="mt-2 font-display text-2xl italic text-[#EE9739]">{heroPrice}</p>
                <p className="mt-1 text-xs text-white/60">Indicative weekly rate — subject to confirmation</p>
              </div>
              <YachtCtaButtons yachtId={id} hasLiveData={availability.hasLiveData} />
            </div>
          </div>
        </section>

        {/* --- Gallery, yacht overview and quick specifications --- */}
        <section className="container mx-auto px-4 pb-10 pt-6 md:pt-5">
          <div id="gallery" className="scroll-mt-32">
            <YachtHeroGallery yachtId={id} yachtName={name} images={gallery} />
          </div>

          <section aria-labelledby="overview" className="mt-7 [overflow-wrap:anywhere]">
            <div>
              <h2 id="overview" className="mb-3 scroll-mt-32 font-display text-3xl font-normal italic text-[#061625]">Overview</h2>
              <div className="leading-relaxed text-[#061625]/80">
                {overview.introduction ? (
                  <p className="whitespace-pre-line">{overview.introduction}</p>
                ) : (
                  <p>
                    {name} is {yachtType ? `a ${yachtType.toLowerCase().replace(/_/g, " ")}` : "a charter yacht"}
                    {builder ? ` built by ${builder}` : ""}
                    {year !== null ? ` in ${year}` : ""}
                    {length ? `, measuring ${length.value} ${length.unit}` : ""}
                    {accommodation.pax !== null ? ` and welcoming ${guestCapacity.toLowerCase()}${restrictedGuests ? "" : " guests"}` : ""}.
                  </p>
                )}
                {overview.more && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-semibold text-[#061625] underline underline-offset-4">
                      Read the full yacht description
                    </summary>
                    {overview.fromBrochurePhoto && (
                      <p className="mt-3 text-sm">Original CYA brochure text. Confirm current crew and activity details with our charter team.</p>
                    )}
                    <p className="mt-3 whitespace-pre-line">{overview.more}</p>
                  </details>
                )}
              </div>
            </div>
            {(cruisingAreas.length > 0 || preferredPickups.length > 0) && (
              <div className="mt-4 flex items-start gap-3 border-t border-[#061625]/10 pt-3 text-[#061625]">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#a95626]" aria-hidden="true" />
                <div className="flex min-w-0 flex-col gap-y-1 text-sm sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
                  <h3 className="font-semibold">Cruising area</h3>
                  {cruisingAreas.length > 0 && <p>{cruisingAreas.join(" · ")}</p>}
                  {preferredPickups.length > 0 && <p className="text-[#061625]/70">Preferred pickup: {preferredPickups.join(" · ")}</p>}
                </div>
              </div>
            )}
          </section>

          {/* Quick specification strip */}
          {quickSpecs.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
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

        <div className="container mx-auto px-4 [overflow-wrap:anywhere]">
          <YachtPricingPanel
            yachtId={id}
            yachtName={name}
            maxGuests={accommodation.pax}
            pricing={pricing}
            availability={availability}
            canRequestHold={holdRequestsEnabled()}
            yachtDetails={
              <div className="space-y-8">
                {/* --- Accommodation --- */}
                {(accommodation.configLine || accommodation.description || accommodation.otherFields.length > 0) && (
                  <section>
                    <SectionHeading id="accommodation" title="Accommodation" />
                    <dl className="grid gap-3 sm:grid-cols-3">
                      {accommodation.pax !== null && (
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                          <Users className="h-5 w-5 text-[#EE9739]" aria-hidden="true" />
                          <dt className="mt-2 text-xs uppercase tracking-wide text-[#061625]/60">Guests</dt>
                          <dd className="text-[#061625]">{guestCapacity}</dd>
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
                    {restrictedGuests && (
                      <p className="mt-3 text-sm text-[#061625]/80">
                        Guests {restrictedGuests.adults + 1} and {restrictedGuests.maximum} are subject to the under-{restrictedGuests.age} rule. Please confirm approval requirements with our charter team.
                      </p>
                    )}
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
                  <section>
                    <SectionHeading id="specifications" title="Specifications" />
                    <details open className="rounded-xl border border-[#061625]/15 bg-white p-4">
                      <summary className="cursor-pointer font-semibold text-[#061625]">Detailed yacht specifications</summary>
                      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {specGroups.map((group) => (
                          <div key={group.title} className="rounded-xl bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-display text-xl italic text-[#061625]">{group.title}</h3>
                            <dl className="space-y-2.5">
                              {group.rows.map(([label, value]) => (
                                <div key={label} className="grid grid-cols-2 items-baseline gap-3 border-b border-[#061625]/5 pb-2.5 last:border-0 last:pb-0">
                                  <dt className="text-sm text-[#061625]/60">{label}</dt>
                                  <dd className="min-w-0 text-right text-sm font-medium text-[#061625]">{value}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ))}
                      </div>
                    </details>
                  </section>
                )}
              </div>
            }
            proposal={
              <div id="enquire" tabIndex={-1} className="scroll-mt-32">
                <div className="rounded-2xl bg-[#061625] p-6 text-white md:p-8">
                  <h2 className="mb-2 font-display text-3xl font-normal italic">Request a charter proposal</h2>
                  <p className="mb-5 text-sm text-white/80">
                    Share your preferred dates and group size. Our charter team will check availability and prepare a personalized charter proposal.
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
                    maxGuests={accommodation.pax !== null && Number.isSafeInteger(accommodation.pax) && accommodation.pax > 0
                      ? accommodation.pax
                      : undefined}
                  />
                </div>
                {guestQuote && (
                  <figure className="mt-6 border-l-2 border-[#EE9739] pl-4 text-[#061625]">
                    <figcaption className="mb-2 text-sm font-semibold">From a guest aboard {name}</figcaption>
                    <blockquote className="whitespace-pre-line text-sm leading-relaxed">“{guestQuote.comment}”</blockquote>
                    <a href="#reviews" className="mt-2 inline-block text-sm font-medium underline underline-offset-4">Read guest reviews</a>
                  </figure>
                )}
              </div>
            }
          />
        </div>

        <div className="container mx-auto px-4 [overflow-wrap:anywhere]">
          {/* --- Crew, dining and watersports --- */}
          <YachtCrewSection crew={crew} yachtId={id} crewGeneral={crewGeneral} />

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

          <YachtDiningSection
            menus={menus}
            chefName={
              crew.find((member) => /chef/i.test(member.role))?.name ??
              menus.general?.chefName ??
              null
            }
          />
        </div>

        {/* --- Amenities, reviews and footer notes --- */}
        <div className={`container mx-auto px-4${recommendation ? "" : " pb-24"}`}>
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

            <YachtReviewsSection reviews={reviews} />

            <p className="mt-10 text-xs text-[#061625]/50">
              Yacht data and images provided by Central Yacht Agent. Rates shown are indicative only and subject to
              confirmation.
            </p>
        </div>

        <YachtPersistentBar yachtId={id} headline={pricing.headline} hasRate={pricing.hasRate} />

        {/* --- Discover More: deterministic similar-yacht recommendations,
            after the enquiry section, before the footer --- */}
        {recommendation && (
          <YachtRecommendations
            strictMatches={recommendation.strictMatches}
            broaderMatches={recommendation.broaderMatches}
            searchQuery={recommendationQuery.toString()}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
