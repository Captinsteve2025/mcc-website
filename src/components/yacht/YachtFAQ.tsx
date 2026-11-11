import { ChevronDown } from "lucide-react";
import { atlasFaqs } from "@/lib/managed-yachts";

export function YachtFAQ() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#00A7B5]">FAQ</p>
          <h2 className="mt-4 text-center font-display text-4xl font-semibold leading-[1.2] text-[#102A43] sm:text-5xl">
            Questions About Chartering ATLAS
          </h2>
          <div className="mt-12 divide-y divide-[#E4E7EB] border-y border-[#E4E7EB]">
            {atlasFaqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-left font-display text-lg font-semibold text-[#102A43] transition-colors hover:text-[#00A7B5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D] [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#C5A46D] transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-3 pr-8 text-[15px] leading-[1.5] text-[#263238]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
