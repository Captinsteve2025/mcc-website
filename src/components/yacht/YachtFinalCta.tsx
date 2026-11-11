import Image from "next/image";
import { TrackedCta, TrackedLink } from "@/components/yacht/TrackedCta";
import { atlas, MCC_PHONE_DISPLAY, MCC_PHONE_HREF } from "@/lib/managed-yachts";

export function YachtFinalCta() {
  return (
    <section className="relative isolate flex min-h-[70svh] items-center overflow-hidden bg-[#061625] py-24 text-white md:py-32">
      <Image src={atlas.heroImage} alt="" fill sizes="100vw" className="-z-10 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-[#061625]/75" />
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-white/80 md:text-base">
          Beautiful islands. Turquoise waters. Exceptional comfort.
        </p>
        <h2 className="mx-auto mb-6 max-w-3xl font-display text-4xl font-normal italic leading-[1.2] md:text-5xl lg:text-6xl">
          Your Private Caribbean Escape Begins Aboard ATLAS
        </h2>
        <p className="mx-auto mb-4 max-w-2xl text-lg text-white/90">
          Experience the freedom of a private luxury power catamaran with a professional crew looking after every detail.
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90">Let My Caribbean Charters help you create an unforgettable holiday.</p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <TrackedCta href="#enquire" label="Check ATLAS availability" eventName="atlas_availability_click" yachtSlug={atlas.slug} />
          <TrackedCta href={MCC_PHONE_HREF} label="Speak to a charter specialist" eventName="atlas_phone_click" yachtSlug={atlas.slug} variant="secondary" />
        </div>
        <p className="mt-8 text-sm text-white/80">
          Call us on{" "}
          <TrackedLink href={MCC_PHONE_HREF} label={MCC_PHONE_DISPLAY} eventName="atlas_phone_click" yachtSlug={atlas.slug} className="text-white" />
        </p>
      </div>
    </section>
  );
}
