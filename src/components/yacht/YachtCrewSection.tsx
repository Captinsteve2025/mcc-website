import { Users } from "lucide-react";
import type { CrewProfile } from "@/lib/yacht-content";

// "Meet Your Crew" renders only genuine, admin-approved profiles. When no
// approved profiles exist the section is not rendered at all — never filled
// with stock photos or invented biographies. The enquiry action keeps visitors
// inside MCC's pipeline.
export function YachtCrewSection({ crew, yachtId }: { crew: CrewProfile[]; yachtId: string }) {
  if (crew.length === 0) return null;

  const promote = (role: string) => /captain|chef/i.test(role);

  const ordered = [...crew].sort((a, b) => {
    const aPromo = promote(a.role) ? 0 : 1;
    const bPromo = promote(b.role) ? 0 : 1;
    return aPromo - bPromo;
  });

  return (
    <section className="mt-14">
      <h2 id="crew" className="mb-2 scroll-mt-32 font-display text-3xl font-normal italic text-[#061625] md:text-4xl">
        Meet Your Crew
      </h2>
      <p className="mb-6 max-w-2xl leading-relaxed text-[#061625]/70">
        A dedicated professional crew is aboard to make your charter effortless. Here is the team confirmed for this
        yacht.
      </p>
      <ul className="grid gap-6 sm:grid-cols-2">
        {ordered.map((member) => (
          <li key={member.id} className="flex gap-5 rounded-xl bg-white p-5 shadow-sm">
            {member.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photoUrl}
                alt={`${member.name}, ${member.role}`}
                loading="lazy"
                decoding="async"
                className="h-24 w-24 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#061625]/5" aria-hidden="true">
                <Users className="h-10 w-10 text-[#EE9739]" />
              </span>
            )}
            <div className="min-w-0">
              <h3 className="font-display text-xl italic text-[#061625]">{member.name}</h3>
              <p className="text-sm font-medium uppercase tracking-wide text-[#EE9739]">{member.role}</p>
              {member.nationality && <p className="mt-1 text-sm text-[#061625]/70">Nationality: {member.nationality}</p>}
              {member.languages && <p className="text-sm text-[#061625]/70">Languages: {member.languages}</p>}
              {member.bio && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium text-[#061625] underline underline-offset-4">
                    Read biography
                  </summary>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#061625]/80">{member.bio}</p>
                </details>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-[#061625]/70">
        Questions about the crew, provisioning or your preferences on board?{" "}
        <a href="#enquire" className="font-medium text-[#061625] underline underline-offset-4">
          Enquire about this yacht
        </a>{" "}
        and our charter team will help. <span className="sr-only">Yacht reference: {yachtId}</span>
      </p>
    </section>
  );
}
