import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { TrackedCta } from "@/components/yacht/TrackedCta";
import { type ManagedYacht } from "@/lib/managed-yachts";

export function YachtHero({ yacht }: { yacht: ManagedYacht }) {
  const facts = [...yacht.quickFacts, yacht.displayRate ?? "Charter rates on request"];
  return (
    <section className="relative flex min-h-[100svh] min-h-[700px] items-center justify-center overflow-hidden bg-[#061625] pt-20 text-white">
      <Image
        src={yacht.heroImage}
        alt={yacht.heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-[#061625]/70" />

      <div className="container relative mx-auto px-4 py-16 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-white/80 md:text-base">
          {yacht.heroEyebrow}
        </p>
        <h1 className="mb-6 font-display text-5xl font-normal italic leading-tight md:text-6xl lg:text-7xl">
          {yacht.name}
        </h1>
        <p className="mx-auto mb-4 max-w-2xl font-display text-xl italic text-white/95 md:text-2xl">{yacht.tagline}</p>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">{yacht.summary}</p>

        <div className="mx-auto mb-10 max-w-4xl rounded-lg bg-white/10 p-4 backdrop-blur-md md:p-5">
          <ul className="grid gap-3 text-sm text-white sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {facts.map((fact) => (
              <li key={fact} className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#e89d79]" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <TrackedCta href="#enquire" label={`Check ${yacht.name} availability`} eventName={`${yacht.slug}_availability_click`} yachtSlug={yacht.slug} />
          <TrackedCta href="#enquire" label="Request a personalized proposal" yachtSlug={yacht.slug} variant="secondary" />
        </div>
      </div>
    </section>
  );
}
