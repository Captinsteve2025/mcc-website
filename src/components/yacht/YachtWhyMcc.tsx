import { Compass, Headset, Map, Ship } from "lucide-react";

const trustCards = [
  {
    icon: Compass,
    title: "Caribbean-Based Expertise",
    body: "Local knowledge of the cruising region and charter operations.",
  },
  {
    icon: Ship,
    title: "Direct Yacht Knowledge",
    body: "Experience working with the yachts and their operating arrangements.",
  },
  {
    icon: Map,
    title: "Personalized Charter Planning",
    body: "Recommendations tailored to your dates, group and preferences.",
  },
  {
    icon: Headset,
    title: "Professional Booking Support",
    body: "Clear communication and assistance throughout the booking process.",
  },
];

export function YachtWhyMcc({ yachtName }: { yachtName: string }) {
  return (
    <section className="bg-[#f8f7f4] py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#061625]">Why Book With MCC</p>
          <h2 className="mb-6 font-display text-4xl font-normal italic leading-[1.2] text-[#061625] md:text-5xl lg:text-6xl">
            Local Knowledge. Personal Service. Exceptional Caribbean Charters.
          </h2>
          <div className="space-y-4 text-lg text-[#061625]/80">
            <p>At My Caribbean Charters, we believe that a luxury yacht charter should be a personalized experience from the first enquiry to the final day aboard.</p>
            <p>Our Caribbean-based team combines yacht brokerage experience, local destination knowledge and direct involvement with the yachts we represent.</p>
            <p>When you enquire about {yachtName}, you will receive knowledgeable guidance and personal attention from a team that understands the Caribbean charter market.</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map((card) => (
            <li key={card.title} className="rounded-lg bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <card.icon className="h-8 w-8 text-[#e89d79]" aria-hidden="true" />
              <h3 className="mt-5 font-display text-2xl font-normal italic text-[#061625]">{card.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.5] text-[#061625]/80">{card.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
