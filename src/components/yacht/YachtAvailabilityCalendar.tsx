"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { AvailabilityRange } from "@/lib/yacht-content";

const STATUS_STYLES: Record<AvailabilityRange["status"], { cell: string; dot: string; label: string }> = {
  available: { cell: "bg-[#1F7A5A]/15 text-[#1F7A5A]", dot: "bg-[#1F7A5A]", label: "Available" },
  booked: { cell: "bg-[#B42318]/15 text-[#B42318]", dot: "bg-[#B42318]", label: "Booked" },
  hold: { cell: "bg-[#B45309]/15 text-[#B45309]", dot: "bg-[#B45309]", label: "On hold" },
  transit: { cell: "bg-[#0E7490]/15 text-[#0E7490]", dot: "bg-[#0E7490]", label: "Transit" },
  unavailable: { cell: "bg-[#061625]/10 text-[#061625]/60", dot: "bg-[#061625]/40", label: "Unavailable" },
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toUtcDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 12));
}

function isoOf(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Builds a day-status map from confirmed ranges. Days outside any range stay
// unknown (neutral) — never shown as available without a real record.
function buildStatusMap(ranges: AvailabilityRange[]): Map<string, { status: AvailabilityRange["status"]; note: string | null }> {
  const map = new Map<string, { status: AvailabilityRange["status"]; note: string | null }>();
  for (const range of ranges) {
    const start = toUtcDate(range.startDate);
    const end = toUtcDate(range.endDate);
    for (let d = new Date(start); d <= end; d = new Date(d.getTime() + 86_400_000)) {
      const key = isoOf(d);
      if (!map.has(key)) map.set(key, { status: range.status, note: range.note });
    }
  }
  return map;
}

type Props = {
  yachtId: string;
  ranges: AvailabilityRange[];
  lastUpdated: string | null;
  /** True when at least one range comes from CYA's live bookings feed. */
  hasLiveData?: boolean;
};

export function YachtAvailabilityCalendar({ yachtId, ranges, lastUpdated, hasLiveData = false }: Props) {
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState(0); // months from the current month
  const [selectStart, setSelectStart] = useState<string | null>(null);
  const [selectEnd, setSelectEnd] = useState<string | null>(null);

  const statusMap = useMemo(() => buildStatusMap(ranges), [ranges]);

  // A calendar render is an availability view, never an enquiry event.
  useEffect(() => {
    trackEvent("yacht_availability_view", { yacht_id: yachtId, has_records: ranges.length > 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleMonths = useMemo(() => {
    const months: Date[] = [];
    const base = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + monthOffset, 1, 12));
    const count = typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 3;
    for (let i = 0; i < count; i++) {
      months.push(new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + i, 1, 12)));
    }
    return months;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthOffset]);

  const choose = (iso: string) => {
    if (!selectStart || (selectStart && selectEnd)) {
      setSelectStart(iso);
      setSelectEnd(null);
      return;
    }
    if (iso < selectStart) {
      setSelectEnd(selectStart);
      setSelectStart(iso);
    } else {
      setSelectEnd(iso);
    }
    trackEvent("yacht_availability_date_select", { yacht_id: yachtId });
    const start = iso < selectStart ? iso : selectStart;
    const end = iso < selectStart ? selectStart : iso;
    window.dispatchEvent(
      new CustomEvent("mcc:yacht-dates", {
        detail: { dates: `${toUtcDate(start).toLocaleDateString("en-US", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" })} to ${toUtcDate(end).toLocaleDateString("en-US", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" })}` },
      })
    );
  };

  const inSelection = (iso: string) =>
    selectStart && selectEnd ? iso >= selectStart && iso <= selectEnd : selectStart === iso;

  const chosenStatus = useMemo(() => {
    if (!selectStart || !selectEnd) return null;
    for (let d = toUtcDate(selectStart); d <= toUtcDate(selectEnd); d = new Date(d.getTime() + 86_400_000)) {
      const entry = statusMap.get(isoOf(d));
      if (entry && entry.status !== "available") return entry.status;
    }
    return null;
  }, [selectStart, selectEnd, statusMap]);

  const canGoBack = monthOffset > 0;
  const canGoForward = monthOffset < 11;

  if (ranges.length === 0) {
    // Honest empty state: no fabricated calendar. Compact by design — no
    // oversized panel — with a clear enquiry action.
    return (
      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <CalendarDays className="h-6 w-6 shrink-0 text-[#EE9739]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg italic text-[#061625]">Availability data currently unavailable</h3>
            <p className="mt-0.5 text-sm text-[#061625]/70">
              Live dates for this yacht are not in our feed yet — ask our team and we will confirm availability for
              your dates personally.
            </p>
          </div>
          <a
            href="#enquire"
            className="shrink-0 rounded-full bg-[#EE9739] px-5 py-2.5 text-center text-sm font-semibold text-[#061625] transition-colors hover:bg-[#EA6F33]"
          >
            Ask about your dates
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl italic text-[#061625]">Charter availability</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => canGoBack && setMonthOffset((m) => m - 1)}
            disabled={!canGoBack}
            aria-label="Previous month"
            className="rounded-full p-1.5 text-[#061625] transition-colors hover:bg-[#061625]/5 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => canGoForward && setMonthOffset((m) => m + 1)}
            disabled={!canGoForward}
            aria-label="Next month"
            className="rounded-full p-1.5 text-[#061625] transition-colors hover:bg-[#061625]/5 disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={`grid gap-4 md:gap-6 ${"md:grid-cols-3"}`}>
        {visibleMonths.map((month) => {
          const year = month.getUTCFullYear();
          const monthIndex = month.getUTCMonth();
          const firstWeekday = new Date(Date.UTC(year, monthIndex, 1, 12)).getUTCDay();
          const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 12)).getUTCDate();
          const cells: (number | null)[] = [
            ...Array.from({ length: firstWeekday }, () => null),
            ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
          ];
          return (
            <div key={isoOf(month)}>
              <p className="mb-2 text-center text-sm font-semibold text-[#061625]">
                {MONTHS[monthIndex]} {year}
              </p>
              <div className="grid grid-cols-7 gap-0.5 text-center text-xs" role="grid" aria-label={`${MONTHS[monthIndex]} ${year}`}>
                {WEEKDAYS.map((d, i) => (
                  <span key={`${d}${i}`} aria-hidden="true" className="py-1 text-[#061625]/40">{d}</span>
                ))}
                {cells.map((day, i) => {
                  if (day === null) return <span key={`empty${i}`} />;
                  const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const entry = statusMap.get(iso);
                  const known = entry !== undefined;
                  const style = known ? STATUS_STYLES[entry.status] : null;
                  const isPast = iso < isoOf(today);
                  const selected = inSelection(iso);
                  const title = known
                    ? `${iso}: ${style ? style.label : ""}${entry && entry.note ? ` — ${entry.note}` : ""}`
                    : `${iso}: contact us to confirm`;
                  return (
                    <button
                      key={iso}
                      type="button"
                      disabled={isPast}
                      onClick={() => choose(iso)}
                      title={title}
                      aria-label={title}
                      aria-pressed={selected}
                      className={`relative aspect-square rounded-md text-xs tabular-nums transition-colors ${
                        selected
                          ? "bg-[#EE9739] font-bold text-[#061625] ring-2 ring-[#061625] ring-offset-1"
                          : ""
                      } ${!selected && style && !isPast ? style.cell : !selected ? "text-[#061625]/70" : ""} ${
                        isPast ? "cursor-default text-[#061625]/25 line-through" : "cursor-pointer hover:ring-1 hover:ring-[#061625]/20"
                      }`}
                    >
                      {day}
                      {known && style && (
                        <span className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${style.dot}`} aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#061625]/70" aria-label="Colour legend">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#EE9739]" aria-hidden="true" />
          Your selected dates
        </li>
        {(Object.keys(STATUS_STYLES) as Array<keyof typeof STATUS_STYLES>).map((key) => (
          <li key={key} className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${STATUS_STYLES[key].dot}`} aria-hidden="true" />
            {STATUS_STYLES[key].label}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#061625]/10" aria-hidden="true" />
          Contact us to confirm
        </li>
      </ul>

      {selectStart && (
        <div className="mt-3 rounded-lg bg-[#EE9739]/15 p-3 text-sm text-[#061625]" role="status">
          {selectEnd ? (
            <>
              <p className="font-medium">
                Proposed charter: {new Date(`${selectStart}T12:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" })}
                {" "}
                to {new Date(`${selectEnd}T12:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" })}
              </p>
              <p className="mt-0.5 text-xs text-[#061625]/70">
                {chosenStatus
                  ? `Heads up: part of this range is marked ${STATUS_STYLES[chosenStatus].label.toLowerCase()} in the live calendar. Our team will confirm what is possible.`
                  : "Our team will confirm these dates with your personalized proposal."}
              </p>
              <a
                href="#enquire"
                className="mt-2 inline-block rounded-full bg-[#EE9739] px-4 py-2 text-sm font-semibold text-[#061625] transition-colors hover:bg-[#EA6F33]"
              >
                Continue to proposal form
              </a>
            </>
          ) : (
            <p>Now select your check-out date.</p>
          )}
        </div>
      )}

      {(lastUpdated || hasLiveData) && (
        <p className="mt-3 text-xs text-[#061625]/50">
          {hasLiveData ? "Live calendar data from Central Yacht Agent" : "Availability records last updated "}
          {lastUpdated ? `, last updated ${new Date(lastUpdated).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}` : ""}
          . Always re-confirmed before booking.
        </p>
      )}
    </div>
  );
}
