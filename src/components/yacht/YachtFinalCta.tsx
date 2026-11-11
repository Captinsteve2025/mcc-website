import Image from "next/image";
import { TrackedCta, TrackedLink } from "@/components/yacht/TrackedCta";
import { atlas, MCC_PHONE_DISPLAY, MCC_PHONE_HREF } from "@/lib/managed-yachts";

export function YachtFinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-[#061625] py-24 text-white lg:py-32">
      <Image
        src={atlas.heroImage}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-60"
      />
      <div className="absolute inset-0 -z-10 bg-[#061625]/60" />
      <div className="container mx-auto px-4 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A46D]">Beautiful islands. Turquoise waters. Exceptional comfort.</p>
        <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.2] sm:text-5xl">
          Your Private Caribbean Escape Begins Aboard ATLAS
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.5] text-white/90 sm:text-lg">
          Experience the freedom of a private luxury power catamaran with a professional crew looking after every detail.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-[1.5] text-white/90 sm:text-lg">
          Let My Caribbean Charters help you create an unforgettable holiday.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <TrackedCta href="#enquire" label="Check ATLAS availability" eventName="atlas_availability_click" yachtSlug={atlas.slug} />
          <TrackedCta href={MCC_PHONE_HREF} label="Speak to a charter specialist" eventName="atlas_phone_click" yachtSlug={atlas.slug} variant="secondary" />
        </div>
        <p className="mt-6 text-sm text-white/80">
          Call us on{" "}
          <TrackedLink href={MCC_PHONE_HREF} label={MCC_PHONE_DISPLAY} eventName="atlas_phone_click" yachtSlug={atlas.slug} className="text-white" />
        </p>
      </div>
    </section>
  );
}
