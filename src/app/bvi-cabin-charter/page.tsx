import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Mail, Phone } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { YachtEnquiryForm } from "@/components/yacht/YachtEnquiryForm";
import { MCC_PHONE_DISPLAY, MCC_PHONE_HREF } from "@/lib/managed-yachts";

const title = "BVI Cabin Charters | My Caribbean Charters";
const description =
  "Book a private cabin on a shared, crewed catamaran in the British Virgin Islands. Compare cabin charter options and ask about scheduled departures.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "My Caribbean Charters" },
};

const inclusions = [
  "Air-conditioned double cabin with a private bathroom",
  "Professional captain and cook or chef",
  "Breakfast, lunch and dinner on board",
  "Selected drinks with meals and local aperitifs",
  "Linens, bath towels and beach towels",
  "Snorkeling gear, kayaks or paddleboards, depending on the yacht",
];

const yachts = [
  {
    name: "Lagoon 620",
    image: "/images/cabin-charter/lagoon-620.webp",
    description: "A crewed sailing catamaran with space to relax on deck between island stops.",
    href: "https://www.mycaribbeancharters.com/lagoon-620-cabin-charter/",
  },
  {
    name: "Ipanema 58",
    image: "/images/cabin-charter/ipanema-58.webp",
    description: "A crewed sailing catamaran with private cabins and shared spaces for dining and unwinding.",
    href: "https://www.mycaribbeancharters.com/ipanema-58-cabin-charter/",
  },
];

const sectionHeading = "font-display text-3xl font-normal italic md:text-4xl";

export default function BVICabinCharterPage() {
  return (
    <>
      <Header />

      <section className="relative flex min-h-[500px] items-end bg-[#061625] text-white md:min-h-[70vh]">
        <Image
          src="/images/cabin-charter/ipanema-58.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061625] via-[#061625]/45 to-[#061625]/60" />
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
            Reserve a private cabin on a crewed catamaran and sail the British Virgin Islands with a small group of fellow travelers.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-full px-6 text-[#061625] focus-visible:ring-offset-[#061625]">
              <a href="#enquire">Check Availability</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border border-white/30 bg-white/10 px-6 text-white shadow-none backdrop-blur-sm hover:bg-white/20 focus-visible:ring-offset-[#061625]"
            >
              <a href="#charter-options">Explore the Yachts</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F7F4] py-16 text-[#061625] md:py-24">
        <div className="container mx-auto grid items-center gap-8 px-4 md:grid-cols-2 lg:gap-12 xl:max-w-6xl">
          <div>
            <h2 className={sectionHeading}>How a Cabin Charter Works</h2>
            <p className="mt-5 text-lg leading-relaxed text-[#061625]/75">
              Couples, solo travelers and small groups can book individual cabins on scheduled departures. You’ll have your own cabin and share the catamaran’s deck and dining areas. The crew handles the sailing.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#061625]/75">
              Short passages leave time to explore ashore or swim and snorkel. Depending on your route, you might walk among the granite boulders at The Baths on Virgin Gorda, visit White Bay on Jost Van Dyke or snorkel the caves at Norman Island.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/images/bvi-the-baths.webp"
              alt="Granite boulders and turquoise water at The Baths on Virgin Gorda"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-[#061625] md:py-24">
        <div className="container mx-auto px-4 xl:max-w-5xl">
          <h2 className={sectionHeading}>Typical Charter Inclusions</h2>
          <p className="mt-4 max-w-2xl text-lg text-[#061625]/75">
            Your package depends on the yacht and departure. We’ll confirm what’s included, the itinerary and the booking terms before you reserve.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {inclusions.map((inclusion) => (
              <li key={inclusion} className="flex items-start gap-3 rounded-xl bg-[#F8F7F4] p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#061625]">
                  <Check className="h-4 w-4 text-[#EE9739]" aria-hidden="true" />
                </span>
                <span>{inclusion}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="charter-options" className="scroll-mt-20 bg-[#F8F7F4] py-16 text-[#061625] md:py-24">
        <div className="container mx-auto px-4 xl:max-w-6xl">
          <div className="mb-10 text-center md:mb-12">
            <h2 className={sectionHeading}>Cabin Charter Yachts</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#061625]/75">
              Explore two catamarans featured in the cabin charter program. Ask us which yacht is scheduled for your dates.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {yachts.map((yacht) => (
              <Card key={yacht.name} className="flex flex-col overflow-hidden rounded-xl border-0 bg-white text-[#061625]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={yacht.image}
                    alt={yacht.name + " catamaran"}
                    fill
                    sizes="(min-width: 1152px) 548px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
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

      <section id="enquire" className="scroll-mt-20 bg-[#061625] py-16 text-white md:py-24">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1fr_1.1fr] lg:gap-16 xl:max-w-6xl">
          <div>
            <h2 id="enquiry-form-title" className={sectionHeading}>
              Request BVI Cabin Charter Availability
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/90">
              Tell us when you’d like to sail and how many people are traveling. Our team can check available cabins, confirm the yacht and send you a quote.
            </p>
            <div className="mt-7 space-y-3">
              <a href="mailto:bookings@mycaribbeancharters.com?subject=BVI%20Cabin%20Charter" className="flex w-fit max-w-full items-center gap-3 break-all underline underline-offset-4 hover:decoration-[#EE9739]">
                <Mail className="h-5 w-5 shrink-0 text-[#EE9739]" aria-hidden="true" />
                bookings@mycaribbeancharters.com
              </a>
              <a href={MCC_PHONE_HREF} className="flex w-fit items-center gap-3 underline underline-offset-4 hover:decoration-[#EE9739]">
                <Phone className="h-5 w-5 shrink-0 text-[#EE9739]" aria-hidden="true" />
                {MCC_PHONE_DISPLAY}
              </a>
            </div>
          </div>
          <YachtEnquiryForm yachtSlug="bvi-cabin-charter" yachtName="BVI Cabin Charter" />
        </div>
      </section>

      <Footer />
    </>
  );
}
