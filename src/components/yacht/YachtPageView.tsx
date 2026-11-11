"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function YachtPageView({ eventName, yachtSlug }: { eventName: string; yachtSlug: string }) {
  useEffect(() => {
    trackEvent(eventName, { yacht: yachtSlug, page_path: window.location.pathname });
  }, [eventName, yachtSlug]);
  return null;
}
