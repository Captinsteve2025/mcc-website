"use client";

import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface TrackedCtaProps {
  href: string;
  label: string;
  eventName?: string;
  yachtSlug: string;
  variant?: "primary" | "secondary";
  className?: string;
}

interface TrackedLinkProps {
  href: string;
  label: string;
  eventName: string;
  yachtSlug: string;
  className?: string;
}

export function TrackedLink({ href, label, eventName, yachtSlug, className }: TrackedLinkProps) {
  return (
    <a
      href={href}
      onClick={() => trackEvent(eventName, { yacht: yachtSlug })}
      className={cn("font-semibold underline underline-offset-4 transition-colors hover:text-[#C5A46D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D]", className)}
    >
      {label}
    </a>
  );
}

export function TrackedCta({ href, label, eventName, yachtSlug, variant = "primary", className }: TrackedCtaProps) {
  return (
    <a
      href={href}
      onClick={() => {
        if (eventName) trackEvent(eventName, { yacht: yachtSlug });
      }}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D] focus-visible:ring-offset-2",
        variant === "primary"
          ? "bg-[#C5A46D] text-[#061625] hover:bg-[#d4b685]"
          : "border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#061625]",
        className
      )}
    >
      {label}
    </a>
  );
}
