import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { TrackedCta } from "@/components/yacht/TrackedCta";
import { atlas, formatYachtRate } from "@/lib/managed-yachts";

const quickFacts = ["Aquila 54 Power Catamaran", "2024", "Private Crewed Charter", "USVI & BVI"];

export function YachtHero() {
  return (
    <section className="relative flex min-h-[100svh] min-h-[700px] items-center justify-center overflow-hidden bg-[#061625] pt-20 text-white">
      <Image
        src={atlas.heroImage}
        alt={atlas.heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-[#061625]/70" />

      <div className="container relative mx-auto px-4 py-16 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-white/80 md:text-base">
          Private Luxury Crewed Yacht Charter
        </p>
        <h1 className="mb-6 font-display text-5xl font-normal italic leading-tight md:text-6xl lg:text-7xl">
          {atlas.name}
        </h1>
        <p className="mx-auto mb-4 max-w-2xl font-display text-xl italic text-white/95 md:text-2xl">
          Your Private Luxury Power Catamaran in the Virgin Islands
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
          Discover the Caribbean in exceptional comfort aboard ATLAS, a luxurious Aquila 54 power catamaran. Explore beautiful islands, secluded anchorages and crystal-clear waters while your professional crew takes care of the details.
        </p>

        <div className="mx-auto mb-10 max-w-4xl rounded-lg bg-white/10 p-4 backdrop-blur-md md:p-5">
          <ul className="grid gap-3 text-sm text-white sm:grid-cols-2 lg:grid-cols-5">
            {[...quickFacts, formatYachtRate(atlas)].map((fact) => (
              <li key={fact} className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#e89d79]" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <TrackedCta href="#enquire" label="Check ATLAS availability" eventName="atlas_availability_click" yachtSlug={atlas.slug} />
          <TrackedCta href="#enquire" label="Request a personalized proposal" yachtSlug={atlas.slug} variant="secondary" />
        </div>
      </div>
    </section>
  );
}
