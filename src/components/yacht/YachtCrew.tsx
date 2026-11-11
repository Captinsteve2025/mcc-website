import Image from "next/image";
import { type YachtCrewMember } from "@/lib/managed-yachts";

export function YachtCrew({ members }: { members: YachtCrewMember[] }) {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#061625]">Meet the Crew</p>
          <h2 className="font-display text-4xl font-normal italic leading-[1.2] text-[#061625] md:text-5xl lg:text-6xl">
            The People Who Look After Your Charter
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {members.map((member) => (
            <li key={member.name} className="grid overflow-hidden rounded-lg bg-[#f8f7f4] shadow-sm sm:grid-cols-[2fr_3fr]">
              <div className="relative aspect-[3/4] sm:aspect-auto">
                <Image src={member.photo} alt={member.photoAlt} fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover object-top" />
              </div>
              <div className="flex flex-col p-6 md:p-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#061625]/70">{member.role}</p>
                <h3 className="mt-2 font-display text-3xl font-normal italic text-[#061625]">{member.name}</h3>
                <div className="my-4 h-px w-12 bg-[#e89d79]" aria-hidden="true" />
                <p className="text-[15px] leading-[1.6] text-[#061625]/80">{member.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
