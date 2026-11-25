"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { HOLD_BOOKINGS_EMAIL, HOLD_PILOT_MAX_GUESTS, type CharterDateSelection } from "@/lib/hold-request";

type HoldRequest = {
  id: string;
  yachtId: string;
  start: string;
  end: string;
  name: string;
  email: string;
  guests: number;
  privacyConsent: boolean;
};

type Receipt = { reference: string; emailsAccepted: boolean };

const actionClass = "inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#061625] px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#061625]/85 focus-visible:ring-2 focus-visible:ring-[#061625] focus-visible:ring-offset-2 disabled:opacity-60 sm:w-auto";

export function YachtHoldRequestForm({ yachtId, dates }: { yachtId: string; dates: CharterDateSelection }) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [canRetryEmail, setCanRetryEmail] = useState(false);
  const attemptedRequest = useRef<HoldRequest | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!receipt) return;
    receiptRef.current?.focus();
    if (receipt.emailsAccepted) return;
    const timer = window.setTimeout(() => setCanRetryEmail(true), 60_000);
    return () => window.clearTimeout(timer);
  }, [receipt]);

  async function submit(payload: HoldRequest) {
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/hold-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) attemptedRequest.current = null;
        setError(receipt ? "We couldn’t check email delivery. Your request is already saved." : result.error ?? "We couldn’t confirm receipt. Please try again.");
        return;
      }
      if (typeof result.reference !== "string" || typeof result.emailsAccepted !== "boolean") throw new Error();
      setCanRetryEmail(false);
      setReceipt({ reference: result.reference, emailsAccepted: result.emailsAccepted });
    } catch {
      setError(receipt ? "We couldn’t check email delivery. Your request is already saved." : "We couldn’t confirm receipt. Your details are still here. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const data = new FormData(event.currentTarget);
    const payload = {
      id: attemptedRequest.current?.id ?? crypto.randomUUID(),
      yachtId,
      start: dates.start,
      end: dates.end,
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      guests: Number(data.get("guests")),
      privacyConsent: data.get("privacyConsent") === "on",
    };
    attemptedRequest.current = payload;
    void submit(payload);
  }

  if (receipt) {
    return (
      <div ref={receiptRef} tabIndex={-1} className="mt-4 rounded-lg bg-white p-4 text-sm text-[#061625]">
        <div role="status">
          <p className="font-semibold">Hold request received</p>
          <p className="mt-1">Our charter team will review {dates.label} and contact you. Your dates are subject to confirmation.</p>
          <p className="mt-2 break-all">Reference {receipt.reference}</p>
          {!receipt.emailsAccepted && <p className="mt-2">Email delivery is pending. Keep your reference for follow-up.</p>}
        </div>
        {error && <p role="alert" className="mt-2">{error}</p>}
        {!receipt.emailsAccepted && (
          <button
            type="button"
            disabled={!canRetryEmail || sending}
            onClick={() => {
              if (attemptedRequest.current) void submit(attemptedRequest.current);
            }}
            className={`mt-3 ${actionClass}`}
          >
            {sending ? "Checking email delivery…" : "Retry email delivery"}
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      aria-label="OHANA hold request"
      aria-busy={sending}
      onSubmit={handleSubmit}
      className="mt-4 space-y-3 rounded-xl bg-white p-4 text-sm text-[#061625]"
    >
      <label className="block">
        <span className="mb-1 block font-medium">Full name</span>
        <Input name="name" autoComplete="name" maxLength={120} required />
      </label>
      <label className="block">
        <span className="mb-1 block font-medium">Email address</span>
        <Input name="email" type="email" autoComplete="email" maxLength={254} required />
      </label>
      <label className="block">
        <span className="mb-1 block font-medium">Number of guests</span>
        <Input name="guests" type="number" inputMode="numeric" min={1} max={HOLD_PILOT_MAX_GUESTS} required />
      </label>
      <label className="flex items-start gap-2">
        <input type="checkbox" name="privacyConsent" required className="mt-0.5 h-5 w-5 shrink-0 accent-[#061625]" />
        <span>I agree that My Caribbean Charters may contact me about these dates.</span>
      </label>
      {error && (
        <p role="alert" className="rounded-md bg-red-50 p-2 text-[#B42318]">
          {error} <a href={`mailto:${HOLD_BOOKINGS_EMAIL}`} className="underline">Email our bookings team</a>.
        </p>
      )}
      <button type="submit" disabled={sending} className={actionClass}>
        {sending ? "Sending your request…" : "Request a hold"}
      </button>
    </form>
  );
}
