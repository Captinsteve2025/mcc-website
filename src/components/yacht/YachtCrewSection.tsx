"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck, Ship, UtensilsCrossed, Users } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { CrewProfile } from "@/lib/yacht-content";
import type { CrewGeneral } from "@/lib/yacht-detail";

// "Meet Your Crew" renders only genuine profiles supplied by MCC's admin
// records or CYA's yacht detail. Nothing is invented: roles, names and
// biographies come from the sources verbatim, never inferred from position.
// Cards are compact: portrait, name, verified role and a short preview, with
// the full biography behind "Read Full Biography".

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

// Preview: first paragraph only, so a long biography never bloats the card.
function previewOf(bio: string | null): string | null {
  if (!bio) return null;
  const first = bio.split(/\n{2,}/)[0].trim();
  if (first.length <= 220) return first;
  const cut = first.slice(0, 220);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 140 ? lastSpace : 220)}\u2026`;
}

function CrewMemberCard({ member, yachtId }: { member: CrewProfile; yachtId: string }) {
  const [expanded, setExpanded] = useState(false);
  const isCaptain = /captain|skipper/i.test(member.role);
  const isChef = /chef|culinary/i.test(member.role);
  const Icon = isChef ? UtensilsCrossed : isCaptain ? Ship : Users;
  const preview = previewOf(member.bio);
  const hasMore = member.bio !== null && member.bio.length > (preview?.length ?? 0);
  const showFullBio = expanded || !hasMore;

  const detailRows: Array<[string, string | null]> = [
    ["Nationality", member.nationality],
    ["Languages", member.languages],
    ["Qualifications", member.qualifications],
    ["Interests", member.interests],
  ];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#061625]/5">
      {/* Portrait: consistent 4:3 ratio across every card */}
      <div className="relative aspect-[4/3] bg-[#061625]">
        {member.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt={`${member.name}, ${member.role}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
              <Icon className="h-10 w-10 text-[#EE9739]" aria-hidden="true" />
            </span>
            <span className="font-display text-3xl italic text-white/60">{initials(member.name)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-display text-xl font-normal italic text-[#061625] md:text-2xl">{member.name}</h3>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#EE9739]">{member.role}</p>

        {member.bio && (
          <div className="mt-3 text-[15px] leading-relaxed text-[#061625]/80">
            {showFullBio ? (
              <div className="space-y-3">
                {member.bio.split(/\n{2,}/).map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <p className="whitespace-pre-line">{preview}</p>
            )}
            {hasMore && (
              <button
                type="button"
                onClick={() => {
                  setExpanded((v) => !v);
                  if (!expanded) trackEvent("yacht_crew_bio_expand", { yacht_id: yachtId, crew: member.name });
                }}
                aria-expanded={expanded}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#061625] underline underline-offset-4 transition-colors hover:text-[#EE9739]"
              >
                {expanded ? "Show less" : "Read Full Biography"}
                <ChevronDown
                  className={`h-4 w-4 text-[#EE9739] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        )}

        {member.culinaryBackground && (
          <div className="mt-4 rounded-lg bg-[#EE9739]/10 p-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#061625]">
              <UtensilsCrossed className="h-4 w-4 text-[#EE9739]" aria-hidden="true" /> Culinary background
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#061625]/80">{member.culinaryBackground}</p>
          </div>
        )}

        {detailRows.some(([, value]) => value !== null) && (
          <dl className="mt-4 space-y-1.5 border-t border-[#061625]/10 pt-3 text-sm">
            {detailRows.map(([label, value]) =>
              value ? (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="shrink-0 text-xs uppercase tracking-wide text-[#061625]/50">{label}</dt>
                  <dd className="text-right text-[#061625]">{value}</dd>
                </div>
              ) : null
            )}
          </dl>
        )}

        {member.source === "cya" && (
          <p className="mt-auto flex items-start gap-1.5 pt-3 text-xs text-[#061625]/50">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#337891]" aria-hidden="true" />
            Provided by the yacht&apos;s official listing via Central Yacht Agent.
          </p>
        )}
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

  // Captain first, then chef, then the rest — stable for identical ranks, and
  // driven purely by each profile's verified role, never by array position.
  const rank = (m: CrewProfile) => (/captain|skipper/i.test(m.role) ? 0 : /chef|culinary/i.test(m.role) ? 1 : 2);
  const ordered = [...crew].sort((a, b) => rank(a) - rank(b));
  // Two crew: the classic captain-and-chef pairing side by side. Larger crews:
  // two columns on small-desktop, three on wide screens.
  const gridCols = crew.length <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="mt-14">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#EE9739]">The People Behind Your Experience</p>
      <h2 id="crew" className="mb-2 scroll-mt-32 font-display text-3xl font-normal italic text-[#061625] md:text-4xl">
        Meet Your Crew
      </h2>
      <p className="mb-6 max-w-2xl leading-relaxed text-[#061625]/70">
        The professionals who turn a charter into a personal experience — introduced with the details they have
        confirmed for this yacht.
      </p>
      {crew.length > 0 && (
        <div className={`grid gap-6 ${gridCols}`}>
          {ordered.map((member, index) => (
            <CrewMemberCard key={`${member.id}-${index}`} member={member} yachtId={yachtId} />
          ))}
        </div>
      )}
      {crewGeneral && (
        <details className="mt-6 rounded-xl border border-[#061625]/15 bg-white p-4 sm:p-6">
          <summary className="cursor-pointer font-semibold text-[#061625]">More about the crew</summary>
          <div className={`mt-4 grid items-start gap-6 ${crewGeneral.photoUrl ? "md:grid-cols-[minmax(0,220px)_1fr]" : ""}`}>
            {crewGeneral.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={crewGeneral.photoUrl}
                alt="The crew of your charter yacht"
                loading="lazy"
                decoding="async"
                className="h-56 w-full rounded-xl object-cover object-top md:h-64"
              />
            ) : null}
            {crewGeneral.descriptionHtml ? (
              <div
                className="space-y-3 text-sm leading-relaxed text-[#061625]/85 [&_b]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-3 [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: crewGeneral.descriptionHtml }}
              />
            ) : (
              crewGeneral.descriptionText && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#061625]/85">{crewGeneral.descriptionText}</p>
              )
            )}
          </div>
        </details>
      )}
      <p className="mt-6 text-sm text-[#061625]/70">
        Questions about the crew, provisioning or your preferences on board?{" "}
        <a href="#enquire" className="font-medium text-[#061625] underline underline-offset-4">
          Request a charter proposal
        </a>{" "}
        and our charter team will help. <span className="sr-only">Yacht reference: {yachtId}</span>
      </p>
    </section>
  );
}
