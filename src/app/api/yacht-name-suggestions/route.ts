import { NextResponse } from "next/server";
import { searchYachtNameSuggestions } from "@/lib/cya";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public, read-only yacht-name autocomplete for search forms. Returns yacht
// names only — no ids, no personal data — so it is safe to expose.
export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim().slice(0, 60);
  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }
  const suggestions = await searchYachtNameSuggestions(q);
  return NextResponse.json(
    { suggestions },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}
