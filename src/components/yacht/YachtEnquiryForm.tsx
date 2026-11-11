"use client";

import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent } from "@/lib/analytics";
import { getSupabase } from "@/lib/supabase";
import { MCC_PHONE_DISPLAY, MCC_PHONE_HREF } from "@/lib/managed-yachts";

interface YachtEnquiryFormProps {
  yachtSlug: string;
  yachtName: string;
}

interface FormValues {
  fullName: string;
  email: string;
  preferredDates: string;
  guestCount: string;
  phone: string;
  flexibleDates: boolean;
  specialOccasion: string;
  additionalRequests: string;
  marketingOptIn: boolean;
  privacyConsent: boolean;
  website: string;
}

type FieldErrors = Partial<Record<"fullName" | "email" | "preferredDates" | "guestCount" | "privacyConsent", string>>;

const EMPTY_VALUES: FormValues = {
  fullName: "",
  email: "",
  preferredDates: "",
  guestCount: "",
  phone: "",
  flexibleDates: false,
  specialOccasion: "",
  additionalRequests: "",
  marketingOptIn: false,
  privacyConsent: false,
  website: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"] as const;
const DUPLICATE_KEY_ERROR = "23505";

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.fullName.trim()) errors.fullName = "Please enter your full name.";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!values.preferredDates.trim()) errors.preferredDates = "Please tell us your preferred charter dates.";
  const guests = Number(values.guestCount);
  if (!Number.isInteger(guests) || guests < 1 || guests > 100) {
    errors.guestCount = "Please enter the number of guests (1 to 100).";
  }
  if (!values.privacyConsent) errors.privacyConsent = "Please agree to the privacy policy to continue.";
  return errors;
}

function readAttribution(): { utm: Record<string, string>; leadSource: string } {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 200);
  }
  let referrerHost = "";
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    referrerHost = "";
  }
  const leadSource = utm.utm_source || referrerHost || "direct";
  return { utm, leadSource: leadSource.slice(0, 200) };
}

const inputClass = "h-11 rounded-md border-[#CBD5DF] bg-white text-[#061625] placeholder:text-[#5B6B7A]";
const labelClass = "mb-1.5 block text-sm font-medium text-[#061625]";
const errorClass = "mt-1.5 text-sm text-[#B42318]";

export function YachtEnquiryForm({ yachtSlug, yachtName }: YachtEnquiryFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "saved" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [requestId] = useState(() => crypto.randomUUID());
  const startTracked = useRef(false);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const trackStart = () => {
    if (startTracked.current) return;
    startTracked.current = true;
    trackEvent("atlas_enquiry_start", { yacht: yachtSlug });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting" || status === "saved") return;

    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    setServerError(null);
    if (Object.keys(fieldErrors).length > 0) return;

    if (values.website) {
      setStatus("saved");
      return;
    }

    setStatus("submitting");
    const { utm, leadSource } = readAttribution();
    try {
      const { error } = await getSupabase()
        .from("yacht_enquiries")
        .insert({
          client_request_id: requestId,
          yacht_slug: yachtSlug,
          yacht_name: yachtName,
          full_name: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || null,
          preferred_dates: values.preferredDates.trim(),
          flexible_dates: values.flexibleDates,
          guest_count: Number(values.guestCount),
          special_occasion: values.specialOccasion.trim() || null,
          additional_requests: values.additionalRequests.trim() || null,
          marketing_opt_in: values.marketingOptIn,
          privacy_consent: values.privacyConsent,
          lead_source: leadSource,
          utm_params: utm,
          landing_page_url: `${window.location.origin}${window.location.pathname}`,
        });
      if (error && error.code !== DUPLICATE_KEY_ERROR) throw error;
    } catch {
      setStatus("error");
      setServerError("We could not save your enquiry. Please try again or call us directly.");
      return;
    }

    setStatus("saved");
    trackEvent("atlas_enquiry_success", { yacht: yachtSlug });
  };

  if (status === "saved") {
    return (
      <div role="status" className="rounded-2xl bg-white p-8 text-center shadow-xl">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[#1F7A5A]" aria-hidden="true" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-[#061625]">Thank you, your enquiry has been received</h3>
        <p className="mt-3 text-[#3D4B59]">
          A charter specialist will review your dates and group details and contact you with availability and a personalized proposal.
        </p>
        <p className="mt-4 text-sm text-[#3D4B59]">
          Need to speak sooner? Call us on{" "}
          <a href={MCC_PHONE_HREF} className="font-semibold text-[#061625] underline underline-offset-4">
            {MCC_PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl bg-white p-6 shadow-xl sm:p-8" aria-labelledby="enquiry-form-title">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>Full name <span aria-hidden="true">*</span></label>
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            required
            value={values.fullName}
            onFocus={trackStart}
            onChange={(e) => set("fullName", e.target.value)}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={inputClass}
          />
          {errors.fullName && <p id="fullName-error" className={errorClass}>{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email address <span aria-hidden="true">*</span></label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass}
          />
          {errors.email && <p id="email-error" className={errorClass}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="preferredDates" className={labelClass}>Preferred charter dates <span aria-hidden="true">*</span></label>
          <Input
            id="preferredDates"
            name="preferredDates"
            placeholder="e.g. 10 to 17 March"
            required
            value={values.preferredDates}
            onChange={(e) => set("preferredDates", e.target.value)}
            aria-invalid={!!errors.preferredDates}
            aria-describedby={errors.preferredDates ? "preferredDates-error" : undefined}
            className={inputClass}
          />
          {errors.preferredDates && <p id="preferredDates-error" className={errorClass}>{errors.preferredDates}</p>}
        </div>
        <div>
          <label htmlFor="guestCount" className={labelClass}>Number of guests <span aria-hidden="true">*</span></label>
          <Input
            id="guestCount"
            name="guestCount"
            type="number"
            inputMode="numeric"
            min={1}
            max={100}
            required
            value={values.guestCount}
            onChange={(e) => set("guestCount", e.target.value)}
            aria-invalid={!!errors.guestCount}
            aria-describedby={errors.guestCount ? "guestCount-error" : undefined}
            className={inputClass}
          />
          {errors.guestCount && <p id="guestCount-error" className={errorClass}>{errors.guestCount}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Telephone / WhatsApp <span className="font-normal text-[#5B6B7A]">(optional)</span></label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="specialOccasion" className={labelClass}>Special occasion <span className="font-normal text-[#5B6B7A]">(optional)</span></label>
          <Input
            id="specialOccasion"
            name="specialOccasion"
            placeholder="e.g. birthday, anniversary"
            value={values.specialOccasion}
            onChange={(e) => set("specialOccasion", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm text-[#061625]">
        <input
          type="checkbox"
          name="flexibleDates"
          checked={values.flexibleDates}
          onChange={(e) => set("flexibleDates", e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#061625]"
        />
        <span>My dates are flexible</span>
      </label>

      <div>
        <label htmlFor="additionalRequests" className={labelClass}>Additional requests <span className="font-normal text-[#5B6B7A]">(optional)</span></label>
        <Textarea
          id="additionalRequests"
          name="additionalRequests"
          rows={4}
          value={values.additionalRequests}
          onChange={(e) => set("additionalRequests", e.target.value)}
          className="rounded-md border-[#CBD5DF] bg-white text-[#061625]"
        />
      </div>

      <div className="space-y-3 rounded-lg bg-[#F8F7F4] p-4">
        <label className="flex items-start gap-3 text-sm text-[#061625]">
          <input
            type="checkbox"
            name="privacyConsent"
            required
            checked={values.privacyConsent}
            onChange={(e) => set("privacyConsent", e.target.checked)}
            aria-invalid={!!errors.privacyConsent}
            aria-describedby={errors.privacyConsent ? "privacyConsent-error" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#061625]"
          />
          <span>
            I agree that My Caribbean Charters may contact me about this enquiry and will handle my details under its privacy policy. <span aria-hidden="true">*</span>
          </span>
        </label>
        {errors.privacyConsent && <p id="privacyConsent-error" className={errorClass}>{errors.privacyConsent}</p>}
        <label className="flex items-start gap-3 text-sm text-[#061625]">
          <input
            type="checkbox"
            name="marketingOptIn"
            checked={values.marketingOptIn}
            onChange={(e) => set("marketingOptIn", e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#061625]"
          />
          <span>Optional: send me occasional news and yacht offers from My Caribbean Charters.</span>
        </label>
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      {serverError && (
        <p role="alert" className="rounded-md bg-[#FEF3F2] p-3 text-sm text-[#B42318]">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[#e89d79] px-6 text-base font-medium text-[#061625] shadow-lg transition-all duration-300 hover:bg-[#d88a66] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e89d79] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061625] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending your enquiry..." : "Check availability & get my proposal"}
      </button>
      <p className="text-center text-xs text-[#5B6B7A]">
        Enquiries are reviewed by our charter team. Submitting this form does not create a booking or payment.
      </p>
    </form>
  );
}
