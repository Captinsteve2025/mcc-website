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
    <section className="relative overflow-hidden bg-[#f8f7f4] py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#061625]">The ATLAS Experience</p>
          <h2 className="mb-6 font-display text-4xl font-normal italic leading-[1.2] text-[#061625] md:text-5xl lg:text-6xl">
            Discover the Caribbean in a Different Way
          </h2>
          <div className="space-y-4 text-lg text-[#061625]/80">
            <p>Imagine cruising between spectacular Caribbean islands aboard your own private luxury power catamaran.</p>
            <p>Wake up to beautiful ocean views, enjoy freshly prepared meals, swim in turquoise waters and discover some of the most memorable destinations in the Virgin Islands.</p>
            <p className="font-medium text-[#061625]">Aboard ATLAS, your holiday moves at your pace.</p>
            <p>
              The spacious design of the Aquila 54 provides a wonderful combination of comfort, privacy and generous entertaining areas, creating an exceptional setting for families, friends and special celebrations.
            </p>
            <p>With your professional crew managing the yacht and helping plan your experience, you can concentrate on enjoying every moment.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
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
                <h3 className="font-display text-2xl font-normal italic text-[#061625]">{card.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.5] text-[#061625]/80">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
