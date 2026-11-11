import { CalendarDays, Phone } from "lucide-react";
import { YachtEnquiryForm } from "@/components/yacht/YachtEnquiryForm";
import { TrackedLink } from "@/components/yacht/TrackedCta";
import { atlas, MCC_PHONE_DISPLAY, MCC_PHONE_HREF } from "@/lib/managed-yachts";

export function YachtEnquirySection() {
  return (
    <section id="enquire" className="scroll-mt-20 bg-[#061625] py-20 text-white md:py-32">
      <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/80">Enquire About ATLAS</p>
          <h2 className="mb-6 font-display text-4xl font-normal italic leading-[1.2] md:text-5xl lg:text-6xl">Check ATLAS Availability</h2>
          <div className="mb-8 h-px w-16 bg-[#e89d79]" aria-hidden="true" />
          <p className="text-lg text-white/90">
            Tell us your preferred dates and a little about your group. Our Caribbean charter specialists will prepare a personalized proposal.
          </p>
          <ul className="mt-8 space-y-4 text-[15px] leading-[1.5] text-white/90">
            <li className="flex gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#e89d79]" aria-hidden="true" />
              Minimum charter duration of {atlas.minimumNights} nights, subject to approved terms.
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#e89d79]" aria-hidden="true" />
              <span>
                Prefer to talk now? Call{" "}
                <TrackedLink
                  href={MCC_PHONE_HREF}
                  label={MCC_PHONE_DISPLAY}
                  eventName="atlas_phone_click"
                  yachtSlug={atlas.slug}
                  className="text-white"
                />
              </span>
            </li>
          </ul>
        </div>

        <div>
          <YachtEnquiryForm yachtSlug={atlas.slug} yachtName={atlas.name} />
        </div>
      </div>
    </section>
  );
}
