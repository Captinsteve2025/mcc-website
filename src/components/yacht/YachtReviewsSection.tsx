import type { YachtReview } from "@/lib/yacht-detail";

function ReviewCards({ reviews }: { reviews: YachtReview[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {reviews.map(({ title, comment }, index) => (
        <li key={index} className="min-w-0 rounded-xl bg-white p-5 shadow-sm [overflow-wrap:anywhere] sm:p-6">
          {title && <h3 className="mb-2 font-display text-xl italic text-[#061625]">{title}</h3>}
          <blockquote className="whitespace-pre-line text-sm leading-relaxed text-[#061625]/80">
            {comment}
          </blockquote>
        </li>
      ))}
    </ul>
  );
}

export function YachtReviewsSection({ reviews }: { reviews: YachtReview[] }) {
  if (!reviews.length) return null;

  const featured = reviews.slice(0, 4);
  const remaining = reviews.slice(featured.length);
  return (
    <section className="mt-14" aria-labelledby="reviews">
      <h2 id="reviews" className="mb-6 scroll-mt-32 font-display text-3xl font-normal italic text-[#061625] md:text-4xl">
        Guest reviews
      </h2>
      <ReviewCards reviews={featured} />
      {remaining.length > 0 && (
        <details className="mt-4 rounded-lg border border-[#061625]/15">
          <summary className="cursor-pointer p-4 text-sm font-semibold text-[#061625]">
            Read {remaining.length} more {remaining.length === 1 ? "review" : "reviews"}
          </summary>
          <div className="px-4 pb-4">
            <ReviewCards reviews={remaining} />
          </div>
        </details>
      )}
    </section>
  );
}
