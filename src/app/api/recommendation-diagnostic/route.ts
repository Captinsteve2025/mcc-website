import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getYachtDetail } from "@/lib/cya";
import {
  RECOMMENDATION_CONFIG,
  customerClassLabel,
  recommendSimilarYachts,
  subjectFromDetail,
  candidatesFromCatalogue,
  getCatalogueSnapshot,
} from "@/lib/similar-yachts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Recommendation-engine diagnostic: reports the reference yacht's derived
// profile (classification, unit-normalised length, guests, cabins, published
// pricing and basis, seasonal regions), how many catalogue records were
// considered, exclusions grouped by rule with reasons, the eligible set, and
// the ranked strict/broader selections with per-factor scores. Reuses the
// shared catalogue snapshot and CYA caches — one catalogue walk per TTL across
// the whole server instance, no extra CYA requests per diagnostic run.

const DEFAULT_YACHT_ID = "69f33df0b5a1600bf785869e"; // ENDLESS HORIZON

function adminTokenMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const adminToken = request.headers.get("x-admin-token");
  if (process.env.NODE_ENV !== "development" && !process.env.ADMIN_API_TOKEN) {
    return NextResponse.json(
      { error: "Not available. Set ADMIN_API_TOKEN in the deployment environment to enable this check." },
      { status: 404 }
    );
  }
  if (process.env.NODE_ENV !== "development" && !adminTokenMatches(adminToken, process.env.ADMIN_API_TOKEN)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requested = (new URL(request.url).searchParams.get("yacht_id") ?? "").trim();
  const yachtId = /^[a-f0-9]{8,32}$/i.test(requested) ? requested : DEFAULT_YACHT_ID;

  try {
    const startedAt = Date.now();
    const [detail, snapshot] = await Promise.all([getYachtDetail(yachtId), getCatalogueSnapshot()]);
    const subject = subjectFromDetail(detail);
    const result = recommendSimilarYachts(subject, candidatesFromCatalogue(snapshot.yachts));
    const elapsedMs = Date.now() - startedAt;

    const byRule: Record<string, number> = {};
    for (const e of result.excluded) byRule[e.rule] = (byRule[e.rule] ?? 0) + 1;

    const describe = (m: (typeof result.strictMatches)[number]) => ({
      id: m.candidate.id,
      name: m.candidate.name,
      class: m.candidate.class,
      classLabel: customerClassLabel(m.candidate.rawType),
      lengthFt: m.candidate.lengthFt !== null ? Math.round(m.candidate.lengthFt * 10) / 10 : null,
      guests: m.candidate.guests,
      cabins: m.candidate.cabins,
      weeklyRate: m.candidate.minPriceUsd ?? m.candidate.minPrice,
      currency: m.candidate.minPriceUsd !== null ? "USD" : m.candidate.currency,
      pricingBasisNote: "CYA catalogue rates are whole-yacht weekly rates; basis/APA terms are not published per record and are never invented.",
      regions: m.candidate.regions,
      regionMatches: m.regionMatches,
      managedFleet: m.candidate.managedFleet,
      scores: {
        pricing: Math.round(m.scores.pricing * 100) / 100,
        regionSeason: Math.round(m.scores.regionSeason * 100) / 100,
        classModel: Math.round(m.scores.classModel * 100) / 100,
        guestsCabins: Math.round(m.scores.guestsCabins * 100) / 100,
        length: Math.round(m.scores.length * 100) / 100,
      },
      totalScore: Math.round(m.total * 100) / 100,
    });

    return NextResponse.json({
      executedServerSide: true,
      reference: {
        id: subject.id,
        name: subject.name,
        rawType: subject.rawType,
        class: subject.class,
        classConfident: subject.class !== null,
        lengthFt: subject.lengthFt !== null ? Math.round(subject.lengthFt * 10) / 10 : null,
        guests: subject.guests,
        cabins: subject.cabins,
        weeklyRateMin: subject.minPrice,
        weeklyRateMax: subject.maxPrice,
        currency: subject.currency,
        usdMinPrice: subject.usdMinPrice,
        pricingBasis: subject.pricingBasis,
        seasonalRegions: subject.regions,
        expectedProfileNote:
          "Expected profile is derived from the reference itself (±25% price and length, same class, region overlap, guests ≥ reference) — not hardcoded.",
      },
      catalogue: {
        pagesFetched: snapshot.pages,
        recordsConsidered: result.considered,
        snapshotAgeSeconds: Math.round((Date.now() - snapshot.fetchedAt) / 1000),
        fromSharedInstanceCache: snapshot.fromCache,
        cachingNote:
          "One shared snapshot per server instance (5-minute TTL); each page request inside the walk is also cached by the CYA client (Next Data Cache + in-memory, revalidate 300). Concurrent visitors share the same in-flight walk.",
      },
      engine: {
        config: RECOMMENDATION_CONFIG,
        calculationMs: elapsedMs,
        eligibleCount: result.eligible.length,
        exclusionsByRule: byRule,
        exclusionSample: result.excluded.slice(0, 40),
        strictMatchCount: result.strictMatches.length,
        broaderMatchCount: result.broaderMatches.length,
        hintsApplied: result.hintsApplied,
        forcedThreeNote:
          "Fewer than 3 results — or none — is an honest outcome; the fallback widens only price and length tolerance, never class, region or guests.",
        availabilityNote: result.availabilityNote,
      },
      strictMatches: result.strictMatches.map(describe),
      broaderMatches: result.broaderMatches.map(describe),
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message.slice(0, 200) : "Unknown error" }, { status: 502 });
  }
}
