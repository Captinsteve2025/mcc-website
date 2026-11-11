import { type YachtNote } from "@/lib/managed-yachts";

export function YachtNotes({ notes }: { notes: YachtNote[] }) {
  return (
    <section className="bg-[#f8f7f4] py-20 md:py-32">
      <div className="container mx-auto grid gap-6 px-4 md:grid-cols-2">
        {notes.map((note) => (
          <article key={note.title} className="rounded-lg bg-white p-8 shadow-sm lg:p-10">
            <h2 className="font-display text-3xl font-normal italic text-[#061625]">{note.title}</h2>
            <div className="my-4 h-px w-12 bg-[#e89d79]" aria-hidden="true" />
            <p className="text-[15px] leading-[1.6] text-[#061625]/80">{note.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
