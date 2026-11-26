import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Check, ChefHat, Compass, Waves } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CabinBooking } from "./CabinBooking";
import { publishedDepartures } from "./departures";
import { cabinYachts } from "./yachts";
import styles from "./CabinBackdrop.module.css";

const title = "BVI Cabin Charters | My Caribbean Charters";
const description =
  "Book a private cabin on a shared, crewed catamaran in the British Virgin Islands. Compare cabin charter options and ask about scheduled departures.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "My Caribbean Charters" },
};

const experience = [
  {
    icon: BedDouble,
    title: "Your Private Sanctuary",
    text: "Unwind in your own spacious, air-conditioned cabin complete with a private en-suite bathroom.",
  },
  {
    icon: ChefHat,
    title: "Dedicated Crew",
    text: "Let your seasoned captain chart the course to hidden coves while your onboard chef prepares fresh, island-inspired meals.",
  },
  {
    icon: Compass,
    title: "Curated Island Hopping",
    text: "Experience a thoughtfully crafted itinerary that perfectly balances sun-drenched relaxation with coastal exploration.",
  },
  {
    icon: Waves,
    title: "Play & Stay Connected",
    text: "Dive straight into crystal-clear waters with onboard water toys, and share every golden-hour sunset with complimentary Wi-Fi.",
  },
];

const inclusions = [
  "Seven nights aboard a luxury catamaran (Lagoon on select sailings)",
  "Private double cabin with an en-suite bathroom. Air conditioning runs from 8 am to 10 pm and can run overnight if everyone on board agrees.",
  "Gourmet meals including seven breakfasts, six lunches, and four dinners",
  "Table wine and water with meals, plus local aperitifs including punch, rum, and fruit juice",
  "Two crew members, including a captain and a steward/cook",
  "Two sets of linens, towels, and beach towels per guest per week",
  "Yacht consumables, including diesel, fuel, and water",
  "Insurance for the yacht and passengers",
  "Snorkeling equipment, a sea scooter, paddleboards, a floating mat, and beach games",
  "Onboard Wi-Fi",
  "Trellis Bay to Scrub Island ferry for departures that board at Scrub Island",
];

const sectionHeading = "font-display text-3xl font-normal italic md:text-4xl";

export default function BVICabinCharterPage() {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Tortola", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  return (
    <>
      <Header />

      <section className="relative flex min-h-[580px] items-end bg-[#061625] text-white md:min-h-[70vh]">
        <Image
          src="/images/cabin-charter/lagoon-51-hero.webp"
          alt="Lagoon 51 catamaran at anchor in a rocky bay"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_54%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061625] via-[#061625]/55 to-[#061625]/45" />
        <div className="container relative mx-auto px-4 pb-12 pt-28 md:pb-16">
          <Link
            href="/destinations/british-virgin-islands"
            className="inline-flex items-center text-sm font-medium uppercase tracking-[0.3em] text-[#EE9739] underline-offset-4 hover:underline"
          >
            British Virgin Islands
          </Link>
          <h1 className="mt-2 font-display text-4xl font-normal italic md:text-5xl lg:text-6xl">
            BVI Cabin Charters
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Trade the resort crowds for the gentle rhythm of the Caribbean Sea.
          </p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
            Have you ever dreamed of waking up in a new turquoise bay every morning, without the commitment of booking an entire private yacht? A cabin charter is your effortless passport to the yachting lifestyle.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-full px-6 text-[#061625] focus-visible:ring-offset-[#061625]">
              <a href="#dates">Choose Dates &amp; Cabins</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border border-white/30 bg-white/10 px-6 text-white shadow-none backdrop-blur-sm hover:bg-white/20 focus-visible:ring-offset-[#061625]"
            >
              <a href="#how-it-works">How a Cabin Charter Works</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="how-it-works-heading" className={styles.overview + " isolate scroll-mt-20 bg-[#061625] py-16 text-white md:py-24"}>
        <div className={styles.backdrop} aria-hidden="true">
          <Image src="/images/cabin-charter/white-bay-backdrop.webp" alt="" fill sizes="100vw" className={styles.beach} />
        </div>
        <div className="container relative mx-auto px-4 xl:max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="how-it-works-heading" className={sectionHeading}>How a Cabin Charter Works</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/95">
              Step aboard for an all-inclusive island escape where every detail is taken care of.
              You book a private cabin and share the boat and itinerary with other guests.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {experience.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="flex items-start gap-4 rounded-xl border-0 bg-white p-5 text-[#061625] sm:p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#061625] text-[#EE9739]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle className="font-display text-xl font-normal italic leading-normal tracking-normal">{title}</CardTitle>
                  <p className="mt-2 leading-relaxed text-[#061625]/75">{text}</p>
                </div>
              </Card>
            ))}
          </div>

          <p className="mt-7 text-center text-lg leading-relaxed text-white">
            Just pack your swimwear and a sense of adventure—the islands are calling.
          </p>

          <div id="charter-inclusions" className={styles.inclusions + " mt-10 scroll-mt-24 rounded-xl bg-[#F8F7F4] text-[#061625] shadow-sm"}>
            <div className={styles.diningBackdrop} aria-hidden="true">
              <div><Image src="/images/cabin-charter/eggs-benedict.webp" alt="" fill sizes="(min-width: 1024px) 360px, 50vw" className={styles.food} /></div>
              <div><Image src="/images/cabin-charter/salmon-platter.webp" alt="" fill sizes="(min-width: 1024px) 360px, 50vw" className={styles.food + " " + styles.salmon} /></div>
            </div>
            <div className={styles.inclusionContent + " p-5 sm:p-8"}>
              <h3 className="font-display text-2xl font-normal italic md:text-3xl">What’s Included in Your Charter</h3>
              <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {inclusions.map((inclusion) => (
                  <li key={inclusion} className="flex items-start gap-3 leading-relaxed">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#061625]" aria-hidden="true" />
                    <span>{inclusion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="charter-options" className="scroll-mt-20 bg-white py-16 text-[#061625] md:py-24">
        <div className="container mx-auto px-4 xl:max-w-6xl">
          <div className="mb-10 text-center md:mb-12">
            <h2 className={sectionHeading}>Cabin Charter Yachts</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#061625]/75">
              Explore two catamarans featured in the cabin charter program. Ask us which yacht is scheduled for your dates.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {cabinYachts.map((yacht) => (
              <Card key={yacht.id} className="flex flex-col overflow-hidden rounded-xl border-0 bg-[#F8F7F4] text-[#061625]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={yacht.image}
                    alt={yacht.name + " catamaran"}
                    fill
                    sizes="(min-width: 1152px) 548px, (min-width: 768px) 50vw, 100vw"
                    className={yacht.id === "lagoon-620" ? "object-contain bg-[#061625]" : "object-cover"}
                  />
                </div>
                <CardContent className="flex flex-1 flex-col items-start p-6">
                  <CardTitle className="font-display text-xl font-normal italic leading-normal tracking-normal md:text-2xl">
                    {yacht.name}
                  </CardTitle>
                  <p className="mb-5 mt-2 text-[#061625]/75">{yacht.description}</p>
                  <Button asChild variant="outline" className="mt-auto">
                    <a href={yacht.href}>View {yacht.name} Details</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <figure className="relative m-0 h-52 overflow-hidden bg-[#F8F7F4] sm:h-64 lg:h-96">
        <Image
          src="/images/bvi-the-baths.webp"
          alt="Sandy beach and turquoise water at The Baths, Virgin Gorda"
          fill
          sizes="100vw"
          className="object-cover object-[center_68%]"
        />
      </figure>

      <CabinBooking today={today} departures={publishedDepartures} />

      <Footer />
    </>
  );
}
