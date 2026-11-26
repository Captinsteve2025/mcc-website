import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Mail, Phone } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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

const mainButton =
  "inline-flex items-center justify-center rounded-full bg-[#e89d79] px-7 py-3 font-semibold text-[#061625] transition-colors hover:bg-[#d88a66] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89d79]";

export default function BVICabinCharterPage() {
  return (
    <>
      <Header />

      <section className="relative flex min-h-[34rem] items-end bg-[#061625] text-white md:min-h-[40rem]">
        <Image
          src="/images/cabin-charter/ipanema-58.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#061625]/80 via-[#061625]/35 to-[#061625]/95" />
        <div className="container relative mx-auto px-4 pb-14 pt-32 md:pb-20 lg:px-8">
          <Link
            href="/destinations/british-virgin-islands"
            className="font-medium text-[#ffc3a6] underline-offset-4 hover:underline"
          >
            British Virgin Islands
          </Link>
          <h1 className="mt-3 font-display text-5xl font-normal italic md:text-7xl">
            BVI Cabin Charters
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/95 md:text-xl">
            Reserve a private cabin on a crewed catamaran and sail the British Virgin Islands with a small group of fellow travelers.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#enquire" className={mainButton}>Check Availability</a>
            <a
              href="#charter-options"
              className="inline-flex items-center justify-center rounded-full border border-white/60 bg-[#061625]/40 px-7 py-3 font-medium transition-colors hover:bg-[#061625]/80"
            >
              Explore the Yachts
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f7f4] py-16 text-[#061625] md:py-24">
        <div className="container mx-auto grid items-center gap-10 px-4 md:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <h2 className="font-display text-3xl italic md:text-5xl">How a Cabin Charter Works</h2>
            <p className="mt-5 text-lg leading-relaxed text-[#061625]/80">
              Couples, solo travelers and small groups can book individual cabins on scheduled departures. You’ll have your own cabin and share the catamaran’s deck and dining areas. The crew handles the sailing.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#061625]/80">
              Short passages leave time to explore ashore or swim and snorkel. Depending on your route, you might walk among the granite boulders at The Baths on Virgin Gorda, visit White Bay on Jost Van Dyke or snorkel the caves at Norman Island.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
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
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="font-display text-3xl italic md:text-5xl">Typical Charter Inclusions</h2>
          <p className="mt-4 max-w-2xl text-lg text-[#061625]/80">
            Your package depends on the yacht and departure. We’ll confirm what’s included, the itinerary and the booking terms before you reserve.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {inclusions.map((inclusion) => (
              <li key={inclusion} className="flex items-start gap-3 rounded-lg bg-[#f8f7f4] p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#1f6756]" aria-hidden="true" />
                <span>{inclusion}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="charter-options" className="scroll-mt-20 bg-[#f8f7f4] py-16 text-[#061625] md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-display text-3xl italic md:text-5xl">Cabin Charter Yachts</h2>
          <p className="mt-4 max-w-2xl text-lg text-[#061625]/80">
            Explore two catamarans featured in the cabin charter program. Ask us which yacht is scheduled for your dates.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {yachts.map((yacht) => (
              <article key={yacht.name} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="relative aspect-[16/9]">
                  <Image src={yacht.image} alt={yacht.name + " catamaran"} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="font-display text-3xl italic">{yacht.name}</h3>
                  <p className="mt-2 text-[#061625]/80">{yacht.description}</p>
                  <a href={yacht.href} className="mt-5 inline-block font-semibold underline decoration-[#c47b59] decoration-2 underline-offset-4 hover:decoration-current">
                    View {yacht.name} Details
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" className="scroll-mt-20 bg-[#061625] py-16 text-white md:py-24">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:px-8">
          <div>
            <h2 id="enquiry-form-title" className="font-display text-3xl italic md:text-5xl">
              Request BVI Cabin Charter Availability
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/85">
              Tell us when you’d like to sail and how many people are traveling. Our team can check available cabins, confirm the yacht and send you a quote.
            </p>
            <div className="mt-7 space-y-3">
              <a href="mailto:bookings@mycaribbeancharters.com?subject=BVI%20Cabin%20Charter" className="flex w-fit max-w-full items-center gap-3 break-all underline underline-offset-4">
                <Mail className="h-5 w-5 shrink-0 text-[#e89d79]" aria-hidden="true" />
                bookings@mycaribbeancharters.com
              </a>
              <a href={MCC_PHONE_HREF} className="flex w-fit items-center gap-3 underline underline-offset-4">
                <Phone className="h-5 w-5 shrink-0 text-[#e89d79]" aria-hidden="true" />
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
