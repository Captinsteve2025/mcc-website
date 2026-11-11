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
    <section className="bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00A7B5]">Yacht Features</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.2] text-[#102A43] sm:text-5xl">
            Meet ATLAS: Luxury Without Compromise
          </h2>
          <p className="mt-6 text-base leading-[1.5] text-[#263238] sm:text-lg">
            ATLAS combines the generous space and stability of a modern power catamaran with the freedom of a private Caribbean yacht charter.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title} className="rounded-2xl border border-[#E4E7EB] bg-[#F8F7F4] p-6 transition-colors duration-300 hover:border-[#C5A46D]">
              <feature.icon className="h-7 w-7 text-[#00A7B5]" aria-hidden="true" />
              <h3 className="mt-5 font-display text-xl font-semibold text-[#102A43]">{feature.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.5] text-[#263238]">{feature.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 rounded-2xl bg-[#102A43] p-8 text-white lg:p-12">
          <h3 className="font-display text-2xl font-semibold">Yacht Specifications</h3>
          <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {atlasKnownSpecs.map((spec) => (
              <div key={spec.label} className="border-b border-white/15 pb-3">
                <dt className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D]">{spec.label}</dt>
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
