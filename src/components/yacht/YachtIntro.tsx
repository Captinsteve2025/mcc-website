import Image from "next/image";

const cards = [
  {
    title: "Exceptional Comfort",
    body: "Relax in spacious indoor and outdoor living areas designed for enjoying life on the water.",
    image: "/images/bvi-the-baths.webp",
  },
  {
    title: "Your Private Caribbean Escape",
    body: "Explore beautiful islands, beaches and anchorages with an itinerary tailored to your group.",
    image: "/images/usvi-snorkeling.webp",
  },
  {
    title: "Professional Crewed Hospitality",
    body: "Enjoy personalized service from an experienced crew dedicated to your charter experience.",
    image: "/images/caribbean-water-bg.webp",
  },
];

export function YachtIntro() {
  return (
    <section className="bg-[#F8F7F4] py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00A7B5]">The ATLAS Experience</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.2] text-[#102A43] sm:text-5xl">
            Discover the Caribbean in a Different Way
          </h2>
          <div className="mt-6 space-y-4 text-base leading-[1.5] text-[#263238] sm:text-lg">
            <p>Imagine cruising between spectacular Caribbean islands aboard your own private luxury power catamaran.</p>
            <p>Wake up to beautiful ocean views, enjoy freshly prepared meals, swim in turquoise waters and discover some of the most memorable destinations in the Virgin Islands.</p>
            <p className="font-medium text-[#102A43]">Aboard ATLAS, your holiday moves at your pace.</p>
            <p>
              The spacious design of the Aquila 54 provides a wonderful combination of comfort, privacy and generous entertaining areas, creating an exceptional setting for families, friends and special celebrations.
            </p>
            <p>With your professional crew managing the yacht and helping plan your experience, you can concentrate on enjoying every moment.</p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-[#102A43]">{card.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.5] text-[#263238]">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
