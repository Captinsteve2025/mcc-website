"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Mode = "enquiry" | "hold" | "callback";

export function CabinEnquiry({ mode, dates, departureId, cabin, nights }: {
  mode: Mode;
  dates: string;
  departureId?: string;
  cabin: string;
  nights: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "saved" | "error">("idle");
  const attempt = useRef<{ data: string; id: string }>();
  const sending = useRef(false);
  const callback = mode === "callback";
  const action = callback ? "Request a callback" : mode === "hold" ? "Send hold request" : "Send cabin enquiry";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || status === "saved") return;
    const fields = new FormData(event.currentTarget);
    const value = (key: string) => String(fields.get(key) ?? "").trim();
    const details = [
      "Request: " + (callback ? "Callback" : mode === "hold" ? "Broker-reviewed cabin hold" : "Cabin availability"),
      departureId && "Departure: " + departureId,
      value("cabin") && "Cabin: " + value("cabin"),
      nights && "Trip length: " + nights + " nights",
      value("notes") && "Notes: " + value("notes"),
    ].filter(Boolean).join("\n");
    const data = JSON.stringify({
      yacht_slug: "bvi-cabin-charter",
      yacht_name: "BVI Cabin Charter",
      full_name: value("name"),
      email: value("email"),
      phone: value("phone") || null,
      preferred_dates: value("dates") || "Flexible dates",
      flexible_dates: !value("dates"),
      guest_count: Number(value("guests")),
      additional_requests: details,
      privacy_consent: fields.get("consent") === "on",
      landing_page_url: window.location.origin + window.location.pathname,
    });
    if (attempt.current?.data !== data) attempt.current = { data, id: crypto.randomUUID() };
    sending.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/yacht-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...JSON.parse(data), client_request_id: attempt.current.id }),
      });
      const result = await response.json();
      setStatus(response.ok && result.saved === true ? "saved" : "error");
    } catch {
      setStatus("error");
    } finally {
      sending.current = false;
    }
  }

  if (status === "saved") {
    return (
      <div role="status" className="rounded-xl bg-white p-6 text-[#061625] sm:p-8">
        <h3 className="font-display text-2xl font-normal italic">Your request is in</h3>
        <p className="mt-2">Our charter team will follow up. Your cabin and any hold are subject to confirmation.</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => { attempt.current = undefined; setStatus("idle"); }}>Send another request</Button>
      </div>
    );
  }

  return (
    <form aria-label="Cabin charter enquiry" aria-busy={status === "sending"} onSubmit={submit} className="space-y-4 rounded-xl bg-white p-5 text-[#061625] shadow-sm sm:p-8">
      <h3 className="font-display text-2xl font-normal italic">{callback ? "Request a callback" : mode === "hold" ? "Request a cabin hold" : "Quick enquiry"}</h3>
      {mode === "hold" && <p className="text-sm">Our team will confirm whether a hold is available and when it expires.</p>}
      <fieldset disabled={status === "sending"} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">Name<Input name="name" autoComplete="name" maxLength={120} required /></label>
          <label className="grid gap-1 text-sm font-medium">Email<Input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
          <label className="grid gap-1 text-sm font-medium">
            Phone or WhatsApp {callback ? "" : "(optional)"}
            <Input name="phone" type="tel" autoComplete="tel" minLength={5} maxLength={40} required={callback} />
          </label>
          <label className="grid gap-1 text-sm font-medium">Guests<Input name="guests" type="number" min={1} max={100} defaultValue={2} required /></label>
          {departureId ? (
            <p className="text-sm"><strong>Selected sailing</strong><br />{dates}<input type="hidden" name="dates" value={dates} /></p>
          ) : (
            <label className="grid gap-1 text-sm font-medium">Preferred dates (optional)<Input key={dates} name="dates" defaultValue={dates} placeholder="Flexible dates" maxLength={200} /></label>
          )}
          {departureId && cabin ? (
            <p className="text-sm"><strong>Selected cabin</strong><br />{cabin}<input type="hidden" name="cabin" value={cabin} /></p>
          ) : (
            <label className="grid gap-1 text-sm font-medium">Cabin preference (optional)<Input key={cabin} name="cabin" defaultValue={cabin} maxLength={80} /></label>
          )}
        </div>
        <label className="grid gap-1 text-sm font-medium">
          {callback ? "Best time to call or other notes (optional)" : "Notes, such as dietary needs (optional)"}
          <Textarea name="notes" rows={2} maxLength={1500} />
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input className="mt-1 h-4 w-4 shrink-0 accent-[#061625]" name="consent" type="checkbox" required />
          <span>I agree that My Caribbean Charters may use my details to respond to this request.</span>
        </label>
        {status === "error" && <p role="alert" className="font-medium">We couldn’t confirm receipt. Please try again or contact MCC directly.</p>}
        <Button type="submit" className="text-[#061625]">{status === "sending" ? "Sending…" : action}</Button>
      </fieldset>
    </form>
  );
}
