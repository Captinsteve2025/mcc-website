import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { aquanimity, atlas } from "@/lib/managed-yachts";

const managedYachts = [
  {
    slug: aquanimity.slug,
    name: aquanimity.name,
    description:
      "A Dufour 48 for charter in the British Virgin Islands — personally managed, professionally maintained and ready for your week on the water.",
    image: "/images/aquanimity/Aquanimity-Dufour-48-Yacht-Charter-BVI.jpg",
  },
  {
    slug: atlas.slug,
    name: atlas.name,
    description:
      "Managed by My Caribbean Charters with full maintenance, clearing and charter administration on the owner's behalf.",
    image: "/images/luxury-yacht-superyacht.webp",
  },
];

export const metadata = {
  title: "Managed Yachts | My Caribbean Charters",
  description:
    "Yachts under full management with My Caribbean Charters — maintenance, clearing and charter administration handled end to end.",
};

export default function ManagedYachtsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4]">
      <Header />
      <main className="flex-1">
        <section className="bg-[#061625] px-4 pb-10 pt-28 text-white md:pb-14 md:pt-40">
          <div className="container mx-auto px-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#EE9739]">Full Management</p>
            <h1 className="font-display text-4xl font-normal italic leading-tight md:text-6xl">Managed Yachts</h1>
            <p className="mt-4 max-w-2xl text-white/80">
              Yachts whose maintenance, clearing and charter administration we handle end to end — so ownership stays
              effortless and every charter runs smoothly.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14">
          <div className="grid gap-6 md:grid-cols-2">
            {managedYachts.map((yacht) => (
              <Link
                key={yacht.slug}
                href={`/managed-yachts/${yacht.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={yacht.image}
                  alt={`${yacht.name} — managed yacht`}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="p-6">
                  <h2 className="font-display text-2xl italic text-[#061625]">{yacht.name}</h2>
                  <p className="mt-2 leading-relaxed text-[#061625]/75">{yacht.description}</p>
                  <p className="mt-4 text-sm font-medium text-[#061625] underline underline-offset-4">
                    View {yacht.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
