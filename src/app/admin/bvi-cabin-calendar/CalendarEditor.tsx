"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calendarStatuses, type CalendarStatus } from "../../bvi-cabin-charter/calendar";
import { cabinYachts } from "../../bvi-cabin-charter/yachts";

const selectClass = "h-11 rounded-md border border-[#061625]/25 bg-white px-3";

export function CalendarEditor({ today }: { today: string }) {
  const [token, setToken] = useState("");
  const [yacht, setYacht] = useState<string>(cabinYachts[0].id);
  const [date, setDate] = useState(today);
  const [status, setStatus] = useState<CalendarStatus>("available");
  const [nights, setNights] = useState("");
  const [usd, setUsd] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  function reset() {
    setLoaded(false);
    setNotice("");
  }

  async function request(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const headers = { "x-admin-token": token.trim(), "Content-Type": "application/json" };
    const endpoint = "/api/bvi-cabin-calendar";
    setBusy(true);
    setNotice("");
    try {
      const response = loaded
        ? await fetch(endpoint, {
          method: "POST", headers, body: JSON.stringify({
            yacht, date, status, nights: nights ? Number(nights) : null, usd: usd ? Number(usd) : null,
          }),
        })
        : await fetch(endpoint + "?" + new URLSearchParams({ yacht, date }), { headers, cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        setNotice(result.error ?? "The calendar request could not be completed.");
        return;
      }
      if (loaded) {
        setNotice("Saved. The public calendar will show the update on its next load.");
      } else {
        setStatus(result.day?.status ?? "available");
        setNights(result.day?.rate_nights?.toString() ?? "");
        setUsd(result.day?.rate_usd?.toString() ?? "");
        setLoaded(true);
      }
    } catch {
      setNotice("The calendar request could not be completed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-[#F8F7F4] px-4 py-16 text-[#061625]">
      <form onSubmit={request} className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-3xl italic">BVI Cabin Calendar</h1>
        <p className="mt-3">Load a yacht and departure date to update its status or double-cabin rate.</p>
        <fieldset disabled={busy} className="mt-6 space-y-4">
          <label className="grid gap-1 text-sm font-medium">Staff access token
            <Input type="password" value={token} onChange={event => { setToken(event.target.value); reset(); }} required />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">Yacht
              <select className={selectClass} value={yacht} onChange={event => { setYacht(event.target.value); reset(); }}>
                {cabinYachts.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium">Departure date
              <Input type="date" min={today} value={date} onChange={event => { setDate(event.target.value); reset(); }} required />
            </label>
          </div>
          {loaded && <>
            <label className="grid gap-1 text-sm font-medium">Status
              <select className={selectClass} value={status} onChange={event => setStatus(event.target.value as CalendarStatus)}>
                {Object.entries(calendarStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">Trip length (nights)
                <Input type="number" min={1} max={30} value={nights} onChange={event => setNights(event.target.value)} required={Boolean(usd)} />
              </label>
              <label className="grid gap-1 text-sm font-medium">Double-cabin rate (USD)
                <Input type="number" min={1} max={100000} value={usd} onChange={event => setUsd(event.target.value)} required={Boolean(nights)} />
              </label>
            </div>
            <p className="text-sm">Clear both rate fields to use the published sailing rate or show a quote request.</p>
          </>}
          <Button type="submit" className="text-[#061625]">{busy ? "Working…" : loaded ? "Save changes" : "Load date"}</Button>
          {notice && <p role="status">{notice}</p>}
        </fieldset>
      </form>
    </section>
  );
}
