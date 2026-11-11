import { MapPin } from "lucide-react";
import { TrackedCta } from "@/components/yacht/TrackedCta";
import { atlas, atlasDestinations } from "@/lib/managed-yachts";

export function YachtDestinations() {
  return (
    <section className="bg-[#F8F7F4] py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00A7B5]">Caribbean Itineraries</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.2] text-[#102A43] sm:text-5xl">
            Explore the Beautiful Virgin Islands
          </h2>
          <p className="mt-6 text-base leading-[1.5] text-[#263238] sm:text-lg">
            The Virgin Islands offer some of the world&apos;s most spectacular cruising destinations, from peaceful anchorages and pristine beaches to vibrant island communities.
          </p>
          <p className="mt-4 text-base leading-[1.5] text-[#263238] sm:text-lg">
            A private charter aboard ATLAS gives you the flexibility to explore at your own pace, with an itinerary developed around your interests and preferences.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {atlasDestinations.map((destination) => (
            <li key={destination.name} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg">
              <MapPin className="h-6 w-6 text-[#C5A46D]" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl font-semibold text-[#102A43]">{destination.name}</h3>
              <p className="mt-3 text-[15px] leading-[1.5] text-[#263238]">{destination.description}</p>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-[1.5] text-[#4A5865]">
          Final itineraries depend on charter duration, departure location, weather, vessel operating permissions, customs and immigration requirements, and guest preferences.
        </p>

        <div className="mt-10 flex justify-center">
          <TrackedCta href="#enquire" label="Plan your private charter" yachtSlug={atlas.slug} className="bg-[#102A43] text-white hover:bg-[#0B2540]" />
        </div>
      </div>
    </section>
  );
}
