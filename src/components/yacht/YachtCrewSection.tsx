import { ShieldCheck, Ship, UtensilsCrossed, Users } from "lucide-react";
import type { CrewProfile } from "@/lib/yacht-content";
import type { CrewGeneral } from "@/lib/yacht-detail";

// "Meet Your Crew" renders only genuine profiles supplied by MCC's admin
// records or CYA's yacht detail. When neither supplies crew the section is not
// rendered at all — never filled with stock photos or invented biographies.
// Biographies render in full (no collapsed view): nothing is hidden behind
// extra clicks.

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function CrewMemberCard({ member }: { member: CrewProfile }) {
  const isCaptain = /captain|skipper/i.test(member.role);
  const isChef = /chef|culinary/i.test(member.role);
  const Icon = isChef ? UtensilsCrossed : isCaptain ? Ship : Users;

  const detailRows: Array<[string, string | null]> = [
    ["Nationality", member.nationality],
    ["Languages", member.languages],
    ["Qualifications", member.qualifications],
    ["Interests", member.interests],
  ];

  return (
    <article
      id={isCaptain ? "crew-captain" : isChef ? "crew-chef" : undefined}
      className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#061625]/5"
    >
      <div className="grid md:grid-cols-[minmax(0,320px)_1fr]">
        {/* Portrait column */}
        <div className="relative bg-[#061625]">
          {member.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photoUrl}
              alt={`${member.name}, ${member.role}`}
              loading="lazy"
              decoding="async"
              className="h-72 w-full object-cover object-top md:h-full md:min-h-[320px]"
            />
          ) : (
            <div className="flex h-72 w-full flex-col items-center justify-center gap-3 md:h-full md:min-h-[320px]">
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
                <Icon className="h-12 w-12 text-[#EE9739]" aria-hidden="true" />
              </span>
              <span className="font-display text-4xl italic text-white/60">{initials(member.name)}</span>
            </div>
          )}
        </div>

        {/* Biography column */}
        <div className="flex flex-col p-6 md:p-8">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-2xl font-normal italic text-[#061625] md:text-3xl">{member.name}</h3>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#EE9739]">{member.role}</p>
          </div>

          {member.bio && (
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#061625]/80">
              {member.bio.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          )}

          {member.culinaryBackground && (
            <div className="mt-4 rounded-lg bg-[#EE9739]/10 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#061625]">
                <UtensilsCrossed className="h-4 w-4 text-[#EE9739]" aria-hidden="true" /> Culinary background
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#061625]/80">{member.culinaryBackground}</p>
            </div>
          )}

          {detailRows.some(([, value]) => value !== null) && (
            <dl className="mt-5 grid gap-x-6 gap-y-2 border-t border-[#061625]/10 pt-4 text-sm sm:grid-cols-2">
              {detailRows.map(([label, value]) =>
                value ? (
                  <div key={label} className="flex flex-col gap-0.5">
                    <dt className="text-xs uppercase tracking-wide text-[#061625]/50">{label}</dt>
                    <dd className="text-[#061625]">{value}</dd>
                  </div>
                ) : null
              )}
            </dl>
          )}

          {member.source === "cya" && (
            <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-[#061625]/50">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#337891]" aria-hidden="true" />
              Crew details provided by the yacht's official listing via Central Yacht Agent.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function YachtCrewSection({
  crew,
  yachtId,
  crewGeneral = null,
}: {
  crew: CrewProfile[];
  yachtId: string;
  crewGeneral?: CrewGeneral | null;
}) {
  if (crew.length === 0 && !crewGeneral) return null;

  // Captain first, then chef, then the rest — stable for identical ranks.
  const rank = (m: CrewProfile) => (/captain|skipper/i.test(m.role) ? 0 : /chef|culinary/i.test(m.role) ? 1 : 2);
  const ordered = [...crew].sort((a, b) => rank(a) - rank(b));

  return (
    <section className="mt-14">
      <h2 id="crew" className="mb-2 scroll-mt-32 font-display text-3xl font-normal italic text-[#061625] md:text-4xl">
        Meet Your Crew
      </h2>
      <p className="mb-6 max-w-2xl leading-relaxed text-[#061625]/70">
        The professionals who turn a charter into a personal experience — introduced with the details they have
        confirmed for this yacht.
      </p>
      {crewGeneral && (
        <div className="mb-8 grid items-center gap-6 rounded-2xl bg-[#061625] p-6 text-white md:grid-cols-[minmax(0,220px)_1fr] md:p-8">
          {crewGeneral.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={crewGeneral.photoUrl}
              alt="The crew of your charter yacht"
              loading="lazy"
              decoding="async"
              className="h-56 w-full rounded-xl object-cover object-top md:h-64"
            />
          ) : (
            <div className="flex h-56 items-center justify-center rounded-xl bg-white/10 md:h-64">
              <Users className="h-14 w-14 text-[#EE9739]" aria-hidden="true" />
            </div>
          )}
          {crewGeneral.descriptionHtml ? (
            <div
              className="space-y-3 text-sm leading-relaxed text-white/85 [&_b]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-3 [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: crewGeneral.descriptionHtml }}
            />
          ) : (
            crewGeneral.descriptionText && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-white/85">{crewGeneral.descriptionText}</p>
            )
          )}
        </div>
      )}
      {crew.length > 0 && (
        <div className="space-y-8">
          {ordered.map((member, index) => (
            <CrewMemberCard key={`${member.id}-${index}`} member={member} />
          ))}
        </div>
      )}
      <p className="mt-6 text-sm text-[#061625]/70">
        Questions about the crew, provisioning or your preferences on board?{" "}
        <a href="#enquire" className="font-medium text-[#061625] underline underline-offset-4">
          Enquire about this yacht
        </a>{" "}
        and our charter team will help. <span className="sr-only">Yacht reference: {yachtId}</span>
      </p>
    </section>
  );
}
