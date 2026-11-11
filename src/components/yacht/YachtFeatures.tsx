import { Anchor, Armchair, BedDouble, Sun, UtensilsCrossed, Waves } from "lucide-react";
import { atlasKnownSpecs } from "@/lib/managed-yachts";

const features = [
  {
    icon: Sun,
    title: "Panoramic Flybridge",
    body: "An elevated space for relaxing, entertaining and enjoying spectacular Caribbean views.",
  },
  {
    icon: UtensilsCrossed,
    title: "Spacious Outdoor Dining",
    body: "Enjoy meals and time together in comfortable outdoor entertaining areas.",
  },
  {
    icon: BedDouble,
    title: "Beautiful Guest Accommodation",
    body: "Private, comfortable cabins provide a relaxing retreat after each day's adventures.",
  },
  {
    icon: Armchair,
    title: "Bright Interior Salon",
    body: "A welcoming interior living space for relaxing and socializing.",
  },
  {
    icon: Waves,
    title: "Easy Access to the Water",
    body: "Enjoy swimming and water activities from the yacht's designated access areas.",
  },
  {
    icon: Anchor,
    title: "Power Catamaran Cruising",
    body: "Experience the convenience and comfort of cruising aboard a luxury motor catamaran.",
  },
];

export function YachtFeatures() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#061625]">Yacht Features</p>
          <h2 className="mb-6 font-display text-4xl font-normal italic leading-[1.2] text-[#061625] md:text-5xl lg:text-6xl">
            Meet ATLAS: Luxury Without Compromise
          </h2>
          <p className="text-lg text-[#061625]/80">
            ATLAS combines the generous space and stability of a modern power catamaran with the freedom of a private Caribbean yacht charter.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title} className="rounded-lg border border-[#061625]/10 bg-[#f8f7f4] p-8 transition-all duration-300 hover:border-[#e89d79] hover:shadow-lg">
              <feature.icon className="h-8 w-8 text-[#061625]" aria-hidden="true" />
              <h3 className="mt-5 font-display text-2xl font-normal italic text-[#061625]">{feature.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.5] text-[#061625]/80">{feature.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 rounded-lg bg-[#061625] p-8 text-white lg:p-12">
          <h3 className="font-display text-3xl font-normal italic">Yacht Specifications</h3>
          <div className="mx-0 my-4 h-px w-16 bg-[#e89d79]" aria-hidden="true" />
          <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {atlasKnownSpecs.map((spec) => (
              <div key={spec.label} className="border-b border-white/15 pb-3">
                <dt className="text-xs font-medium uppercase tracking-wider text-[#e89d79]">{spec.label}</dt>
                <dd className="mt-1 text-base text-white">{spec.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm leading-[1.5] text-white/85">
            Guest capacity, cabin and bathroom configuration, crew accommodation, engines, generator, air conditioning, watermaker, Wi-Fi, tender and water toys are confirmed by your charter specialist for your dates.
          </p>
        </div>
      </div>
    </section>
  );
}
