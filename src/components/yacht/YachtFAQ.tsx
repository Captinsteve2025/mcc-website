import { ChevronDown } from "lucide-react";

export function YachtFAQ({ yachtName, faqs }: { yachtName: string; faqs: { question: string; answer: string }[] }) {
  return (
    <section className="bg-[#f8f7f4] py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#061625]">FAQ</p>
            <h2 className="font-display text-4xl font-normal italic leading-[1.2] text-[#061625] md:text-5xl">
              Questions About Chartering {yachtName}
            </h2>
          </div>
          <div className="divide-y divide-[#061625]/15 border-y border-[#061625]/15">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md font-display text-xl italic text-[#061625] transition-colors hover:text-[#d88a66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e89d79] [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#e89d79] transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-3 pr-8 text-[15px] leading-[1.6] text-[#061625]/80">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
