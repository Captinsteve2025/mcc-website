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

export function YachtWhyMcc() {
  return (
    <section className="bg-[#F8F7F4] py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00A7B5]">Why Book With MCC</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.2] text-[#102A43] sm:text-5xl">
            Local Knowledge. Personal Service. Exceptional Caribbean Charters.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-[1.5] text-[#263238] sm:text-lg">
            <p>
              At My Caribbean Charters, we believe that a luxury yacht charter should be a personalized experience from the first enquiry to the final day aboard.
            </p>
            <p>
              Our Caribbean-based team combines yacht brokerage experience, local destination knowledge and direct involvement with the yachts we represent.
            </p>
            <p>
              When you enquire about ATLAS, you will receive knowledgeable guidance and personal attention from a team that understands the Caribbean charter market.
            </p>
          </div>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map((card) => (
            <li key={card.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <card.icon className="h-7 w-7 text-[#C5A46D]" aria-hidden="true" />
              <h3 className="mt-5 font-display text-xl font-semibold text-[#102A43]">{card.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.5] text-[#263238]">{card.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
