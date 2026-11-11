import { MapPin } from "lucide-react";
import { TrackedCta } from "@/components/yacht/TrackedCta";
import { atlas, atlasDestinations } from "@/lib/managed-yachts";

export function YachtDestinations() {
  return (
    <section className="bg-[#f8f7f4] py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#061625]">Caribbean Itineraries</p>
          <h2 className="mb-6 font-display text-4xl font-normal italic leading-[1.2] text-[#061625] md:text-5xl lg:text-6xl">
            Explore the Beautiful Virgin Islands
          </h2>
          <p className="mb-4 text-lg text-[#061625]/80">
            The Virgin Islands offer some of the world&apos;s most spectacular cruising destinations, from peaceful anchorages and pristine beaches to vibrant island communities.
          </p>
          <p className="text-lg text-[#061625]/80">
            A private charter aboard ATLAS gives you the flexibility to explore at your own pace, with an itinerary developed around your interests and preferences.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {atlasDestinations.map((destination) => (
            <li key={destination.name} className="flex flex-col rounded-lg bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <MapPin className="h-6 w-6 text-[#e89d79]" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl font-normal italic text-[#061625]">{destination.name}</h3>
              <p className="mt-3 text-[15px] leading-[1.5] text-[#061625]/80">{destination.description}</p>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-[1.5] text-[#061625]/70">
          Final itineraries depend on charter duration, departure location, weather, vessel operating permissions, customs and immigration requirements, and guest preferences.
        </p>

        <div className="mt-10 flex justify-center">
          <TrackedCta href="#enquire" label="Plan your private charter" yachtSlug={atlas.slug} variant="light" />
        </div>
      </div>
    </section>
  );
}
