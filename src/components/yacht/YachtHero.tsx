import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { TrackedCta } from "@/components/yacht/TrackedCta";
import { atlas, formatYachtRate } from "@/lib/managed-yachts";

const quickFacts = [
  "Aquila 54 Power Catamaran",
  "2024",
  "Private Crewed Charter",
  "USVI & BVI",
];

export function YachtHero() {
  return (
    <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-[#061625] pt-28 pb-16 text-white lg:items-center lg:pb-24">
      <Image
        src={atlas.heroImage}
        alt={atlas.heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#061625] via-[#061625]/70 to-[#061625]/30" />

      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1fr_380px] lg:gap-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A46D] sm:text-sm">
            Private Luxury Crewed Yacht Charter
          </p>
          <h1 className="mt-4 font-display text-6xl font-semibold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
            ATLAS
          </h1>
          <p className="mt-4 font-display text-2xl italic leading-snug text-white/95 sm:text-3xl">
            Your Private Luxury Power Catamaran in the Virgin Islands
          </p>
          <div className="mt-6 space-y-4 text-base leading-[1.5] text-white/85 sm:text-lg">
            <p>
              Discover the Caribbean in exceptional comfort aboard ATLAS, a luxurious Aquila 54 power catamaran.
            </p>
            <p>
              Explore beautiful islands, secluded anchorages and crystal-clear waters while your professional crew takes care of the details.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <TrackedCta href="#enquire" label="Check ATLAS availability" eventName="atlas_availability_click" yachtSlug={atlas.slug} />
            <TrackedCta href="#enquire" label="Request a personalized proposal" yachtSlug={atlas.slug} variant="secondary" />
          </div>
        </div>

        <aside aria-label="ATLAS charter summary" className="hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A46D]">At a glance</p>
          <ul className="mt-4 space-y-3">
            {quickFacts.map((fact) => (
              <li key={fact} className="flex items-center gap-3 text-base text-white">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00A7B5]" aria-hidden="true" />
                {fact}
              </li>
            ))}
            <li className="flex items-center gap-3 text-base text-white">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#00A7B5]" aria-hidden="true" />
              {formatYachtRate(atlas)}
            </li>
          </ul>
          <a
            href="#enquire"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-[#C5A46D] text-sm font-semibold uppercase tracking-wide text-[#061625] transition-colors hover:bg-[#d4b685] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#061625]"
          >
            Check availability
          </a>
        </aside>
      </div>
    </section>
  );
}
