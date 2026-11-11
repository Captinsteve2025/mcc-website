import { CalendarDays, Phone } from "lucide-react";
import { YachtEnquiryForm } from "@/components/yacht/YachtEnquiryForm";
import { TrackedLink } from "@/components/yacht/TrackedCta";
import { atlas, MCC_PHONE_DISPLAY, MCC_PHONE_HREF } from "@/lib/managed-yachts";

export function YachtEnquirySection() {
  return (
    <section id="enquire" className="scroll-mt-20 bg-[#102A43] py-20 text-white lg:py-28">
      <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A46D]">Enquire About ATLAS</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.2] sm:text-5xl">Check ATLAS Availability</h2>
          <p className="mt-6 text-base leading-[1.5] text-white/90 sm:text-lg">
            Tell us your preferred dates and a little about your group. Our Caribbean charter specialists will prepare a personalized proposal.
          </p>
          <ul className="mt-8 space-y-4 text-[15px] leading-[1.5] text-white/90">
            <li className="flex gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#00A7B5]" aria-hidden="true" />
              Minimum charter duration of {atlas.minimumNights} nights, subject to approved terms.
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#00A7B5]" aria-hidden="true" />
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
