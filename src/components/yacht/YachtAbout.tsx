export function YachtAbout({ eyebrow, title, paragraphs }: { eyebrow: string; title: string; paragraphs: string[] }) {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#061625]">{eyebrow}</p>
          <h2 className="mb-6 font-display text-4xl font-normal italic leading-[1.2] text-[#061625] md:text-5xl lg:text-6xl">{title}</h2>
          <div className="space-y-4 text-lg leading-[1.5] text-[#061625]/80">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
