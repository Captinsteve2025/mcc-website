// Analytics tracking utilities
// These can be connected to Google Analytics, Mixpanel, etc.

export function trackEnquirySubmission(data: {
  program?: string;
  source?: string;
  [key: string]: unknown;
}) {
  // Track enquiry submission
  console.log("[Analytics] Enquiry submitted:", data);

  // If Google Analytics is set up:
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", "enquiry_submission", data);
  }
}

export function trackEnquiryOpened(data: {
  program?: string;
  source?: string;
  [key: string]: unknown;
}) {
  // Track enquiry form opened
  console.log("[Analytics] Enquiry opened:", data);

  if (typeof window !== "undefined" && "gtag" in window) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", "enquiry_opened", data);
  }
}

export function trackPageView(data: {
  page?: string;
  title?: string;
  [key: string]: unknown;
}) {
  console.log("[Analytics] Page view:", data);
}

export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  console.log(`[Analytics] Event: ${eventName}`, data);

  if (typeof window !== "undefined" && "gtag" in window) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", eventName, data);
  }
}
