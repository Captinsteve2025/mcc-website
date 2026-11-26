"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MCC_PHONE_HREF } from "@/lib/managed-yachts";
import { CabinEnquiry } from "./CabinEnquiry";

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthFormat = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const dayFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeZone: "UTC" });

const statuses = {
  unconfirmed: { label: "Enquire for Availability", style: "border border-[#061625]/35 bg-[#F8F7F4] text-[#061625]" },
  available: { label: "Available", style: "bg-[#061625] text-white" },
  limited: { label: "Limited Cabins", style: "bg-[#EE9739] text-[#061625]" },
  hold: { label: "Request Hold", style: "border border-dashed border-[#D85F2D] bg-white text-[#061625]" },
  booked: { label: "Booked", style: "bg-[#061625]/10 text-[#061625] line-through" },
} as const;

type Cabin = {
  id: string;
  name: string;
  remaining: number | null;
  occupancy: number;
  /** Total mandatory cost for this rate unit. */
  rate?: { amount: number; currency: string; unit: "person" | "cabin" };
};

export type CabinDeparture = {
  id: string;
  name: string;
  startsOn: string;
  endsOn: string;
  nights: number;
  status: keyof typeof statuses;
  boarding: string;
  disembarkation: string;
  cabins: Cabin[];
  extras: string[];
  route: string[];
};

const formatDate = (value: string) => dateFormat.format(new Date(value + "T12:00:00Z"));
const whatsappHref = "https://wa.me/" + MCC_PHONE_HREF.replace(/\D/g, "");
const selectClass = "mt-1 block h-11 w-full rounded-md border border-[#061625]/25 bg-white px-3 text-base";

export function CabinBooking({ today, departures }: { today: string; departures: CabinDeparture[] }) {
  const upcoming = departures.find(item => item.startsOn >= today);
  const [month, setMonth] = useState((upcoming?.startsOn ?? today).slice(0, 7) + "-01");
  const [nights, setNights] = useState("");
  const [cabinType, setCabinType] = useState("");
  const [date, setDate] = useState(upcoming?.startsOn ?? "");
  const [departureId, setDepartureId] = useState("");
  const [cabinId, setCabinId] = useState("");
  const [mode, setMode] = useState<"enquiry" | "hold" | "callback">("enquiry");
  const hasDepartures = !!upcoming;
  const currentMonth = new Date(month + "T12:00:00Z");
  const numberOfDays = new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + 1, 0)).getUTCDate();
  const futureDepartures = departures.filter(item => item.startsOn >= today);
  const options = Array.from(new Set(futureDepartures.map(item => item.nights))).sort((a, b) => a - b);
  const cabins = Array.from(new Set(futureDepartures.flatMap(item => item.cabins.map(cabin => cabin.name)))).sort();
  const matching = futureDepartures.filter(item =>
    (!nights || item.nights === Number(nights)) &&
    (!cabinType || item.cabins.some(cabin => cabin.name === cabinType)));
  const selectedDay = matching.filter(item => item.startsOn === date);
  const departure = selectedDay.find(item => item.id === departureId) ?? selectedDay[0];
  const cabinOptions = departure?.cabins.filter(item => !cabinType || item.name === cabinType) ?? [];
  const cabin = cabinOptions.find(item => item.id === cabinId) ?? cabinOptions.find(item => item.remaining !== 0);
  const rate = cabin?.rate;
  const formattedRate = rate ? new Intl.NumberFormat("en-US", { style: "currency", currency: rate.currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(rate.amount) : null;
  const canEnquire = departure?.status !== "booked" && (!departure || !!cabin || departure.status === "hold");
  const selectedDates = departure ? formatDate(departure.startsOn) + " – " + formatDate(departure.endsOn) : date ? formatDate(date) : "";

  function resetSelection() {
    setDate("");
    setDepartureId("");
    setCabinId("");
    setMode("enquiry");
  }

  function changeMonth(offset: number) {
    const next = new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + offset, 1));
    setMonth(next.toISOString().slice(0, 10));
    resetSelection();
  }

  return (
    <>
      <section id="dates" aria-labelledby="dates-heading" className="scroll-mt-20 bg-[#F8F7F4] py-12 text-[#061625] md:py-20">
        <div className="container mx-auto px-4 xl:max-w-6xl">
          <div className="mb-8 max-w-2xl">
            <h2 id="dates-heading" className="font-display text-3xl font-normal italic md:text-4xl">Choose Dates &amp; Cabins</h2>
            <p className="mt-3 text-[#061625]/80">
              {hasDepartures ? "Select a listed sailing to see cabin details and rates, or choose a preferred date for another trip." : "Choose a preferred sailing date and cabin type. Our crewed-charter team will check scheduled departures, cabin availability and the total price for your group."}
            </p>
          </div>
          <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="min-w-0 rounded-xl border border-[#061625]/10 bg-white p-4 shadow-sm sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  {hasDepartures ? "Trip length" : "Preferred trip length"}
                  <select className={selectClass} value={nights} onChange={event => { setNights(event.target.value); resetSelection(); }}>
                    <option value="">Any length</option>
                    {(hasDepartures ? options : [5, 7]).map(option => <option key={option} value={option}>{option} nights</option>)}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  {hasDepartures ? "Cabin type" : "Preferred cabin type"}
                  <select className={selectClass} value={cabinType} onChange={event => { setCabinType(event.target.value); resetSelection(); }}>
                    <option value="">Any cabin</option>
                    {(hasDepartures ? cabins : ["Double", "Twin"]).map(option => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </div>

              <div className="my-5 flex items-center justify-between gap-2 border-t border-[#061625]/10 pt-4">
                <Button type="button" variant="outline" size="icon" aria-label="Previous month" disabled={month <= today.slice(0, 7) + "-01"} onClick={() => changeMonth(-1)}><ChevronLeft aria-hidden="true" /></Button>
                <h3 aria-live="polite" className="font-display text-xl font-normal italic sm:text-2xl">{monthFormat.format(currentMonth)}</h3>
                <Button type="button" variant="outline" size="icon" aria-label="Next month" onClick={() => changeMonth(1)}><ChevronRight aria-hidden="true" /></Button>
              </div>
              <div className="grid grid-cols-7 items-center gap-y-2 text-center">
                {weekdayNames.map(day => <span key={day} className="pb-1 text-xs font-medium">{day}</span>)}
                {Array.from({ length: currentMonth.getUTCDay() }, (_, index) => <span key={"blank-" + index} />)}
                {Array.from({ length: numberOfDays }, (_, index) => {
                  const day = index + 1;
                  const iso = month.slice(0, 8) + String(day).padStart(2, "0");
                  const onDate = matching.filter(item => item.startsOn === iso);
                  const status = onDate.length === 1 ? statuses[onDate[0].status] : undefined;
                  const enabled = iso >= today;
                  const label = dayFormat.format(new Date(iso + "T12:00:00Z"));
                  return enabled ? (
                    <button key={iso} type="button" aria-pressed={date === iso}
                      aria-label={label + (status ? ", " + status.label : onDate.length > 1 ? ", " + onDate.length + " departures" : ", preferred date")}
                      className="mx-auto flex h-11 w-11 min-w-0 max-w-full items-center justify-center rounded-full text-sm font-semibold hover:bg-[#F8F7F4] aria-pressed:ring-2 aria-pressed:ring-[#EE9739]"
                      onClick={() => { setDate(iso); setDepartureId(""); setCabinId(""); setMode("enquiry"); }}>
                      <span className={"flex h-8 w-8 items-center justify-center rounded-full " + (status?.style ?? (onDate.length ? statuses.unconfirmed.style : "hover:bg-[#F8F7F4]"))}>{day}</span>
                    </button>
                  ) : <span key={iso} className="flex h-11 items-center justify-center text-sm text-[#061625]/55">{day}</span>;
                })}
              </div>
              {hasDepartures && <ul aria-label="Departure statuses" className="mt-5 flex flex-wrap gap-2 text-xs">
                {Object.values(statuses).map(status => <li key={status.label} className={"rounded-full px-3 py-1 " + status.style.replace(" line-through", "")}>{status.label}</li>)}
              </ul>}
            </div>

            <div className="min-w-0 rounded-xl border border-[#061625]/10 bg-white p-5 shadow-sm sm:p-6">
              <CalendarDays className="mb-3 h-6 w-6 text-[#D85F2D]" aria-hidden="true" />
              <div aria-live="polite">
                <h3 className="font-display text-2xl font-normal italic">{departure?.name ?? (date ? "Your preferred departure" : "Select a departure date")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#061625]/80">
                  {selectedDates || (hasDepartures ? "Select a marked day to see its departures and cabin options." : "Live cabin availability isn’t posted yet. Select a preferred date to include it in your enquiry.")}
                </p>
              </div>
              {date && !departure && <p className="mt-2 text-sm">No sailing is listed for this date. You can still ask us to check it.</p>}
              {selectedDay.length > 1 && <label className="mt-4 block text-sm font-medium">
                Departure
                <select className={selectClass} value={departure?.id ?? ""} onChange={event => { setDepartureId(event.target.value); setCabinId(""); setMode("enquiry"); }}>
                  {selectedDay.map(item => <option key={item.id} value={item.id}>{item.name} · {statuses[item.status].label}</option>)}
                </select>
              </label>}
              {departure && (
                <div className="mt-4 space-y-3 text-sm">
                  <p><strong>{statuses[departure.status].label}</strong> · {departure.nights} nights</p>
                  <p><strong>Board</strong> {departure.boarding}<br /><strong>Disembark</strong> {departure.disembarkation}<br /><span>Times are local to the BVI.</span></p>
                  {cabinOptions.length > 0 && <label className="block font-medium">
                    Cabin
                    <select className={selectClass} value={cabin?.id ?? ""} onChange={event => setCabinId(event.target.value)}>
                      {!cabin && <option value="" disabled>No cabins open</option>}
                      {cabinOptions.map(item => <option key={item.id} value={item.id} disabled={item.remaining === 0}>{item.name}{item.remaining === null ? "" : " · " + item.remaining + (item.remaining === 1 ? " cabin left" : " cabins left")}</option>)}
                    </select>
                  </label>}
                  {cabin?.remaining === null && <p>Remaining cabins to be confirmed.</p>}
                  {formattedRate && rate && <p className="rounded-lg bg-[#F8F7F4] p-3"><strong className="text-lg">{formattedRate} {rate.currency}</strong> per {rate.unit} for this sailing{rate.unit === "cabin" && cabin ? " · up to " + cabin.occupancy + " guests" : ""}</p>}
                </div>
              )}
              {!departure && (nights || cabinType) && <p className="mt-3 text-sm">{[nights && nights + " nights", cabinType].filter(Boolean).join(" · ")}</p>}
              <div className="mt-5 flex flex-wrap gap-3">
                {canEnquire && <Button asChild className="text-[#061625]"><a href="#enquire" onClick={() => setMode("enquiry")}>Quick Enquiry</a></Button>}
                {(departure?.status === "hold" || departure?.status === "unconfirmed") && (
                  <Button asChild variant="outline"><a href="#enquire" onClick={() => setMode("hold")}>
                    {departure.status === "hold" ? "Request a Hold" : "Ask About a Hold"}
                  </a></Button>
                )}
              </div>
              {departure && (
                <div className="mt-5 space-y-3 text-sm">
                  {departure.extras.length > 0 && (
                    <div className="rounded-lg bg-[#F8F7F4] p-4">
                      <h4 className="mb-1 font-semibold">Budget separately</h4>
                      <p>{departure.extras.join(", ")}.</p>
                    </div>
                  )}
                  <p><a href="#charter-inclusions" className="font-medium underline underline-offset-4">See what’s included</a></p>
                  <p>Ask whether mooring and marine park fees apply to this departure.</p>
                  {departure.route.length > 0 && <details className="rounded-lg border border-[#061625]/15 p-3">
                    <summary className="cursor-pointer font-semibold">Planned BVI itinerary</summary>
                    <ol className="mt-3 list-decimal space-y-1.5 pl-5">
                      {departure.route.map(stop => <li key={stop}>{stop}</li>)}
                    </ol>
                    <p className="mt-2">The route may change with sailing conditions.</p>
                  </details>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="enquire" className="scroll-mt-20 bg-[#061625] py-14 text-white md:py-20">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[1fr_1.1fr] xl:max-w-6xl">
          <div>
            <h2 className="font-display text-3xl font-normal italic md:text-4xl">Request BVI Cabin Charter Availability</h2>
            <p className="mt-4 max-w-md text-white/90">Tell us what you’re looking for and we’ll confirm available cabins, boarding details, and the total cost before you commit.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="outline" className="border-white/40 text-white hover:bg-white/10"><a href={MCC_PHONE_HREF}><Phone aria-hidden="true" /> Call MCC</a></Button>
              <Button asChild variant="outline" className="border-white/40 text-white hover:bg-white/10"><a href={whatsappHref}><MessageCircle aria-hidden="true" /> WhatsApp</a></Button>
            </div>
            <button className="mt-3 text-sm font-medium underline underline-offset-4" type="button" aria-pressed={mode === "callback"} onClick={() => setMode(mode === "callback" ? "enquiry" : "callback")}>Request a callback</button>
            <p className="mt-2 text-sm"><a className="break-all underline underline-offset-4" href="mailto:bookings@mycaribbeancharters.com?subject=BVI%20Cabin%20Charter">bookings@mycaribbeancharters.com</a></p>
          </div>
          <CabinEnquiry mode={mode} dates={canEnquire ? selectedDates : ""} departureId={canEnquire ? departure?.id : undefined}
            cabin={canEnquire ? cabin?.name ?? cabinType : ""} nights={canEnquire ? departure?.nights.toString() ?? nights : ""} />
        </div>
      </section>
    </>
  );
}
