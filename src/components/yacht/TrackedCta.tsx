"use client";

import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface TrackedCtaProps {
  href: string;
  label: string;
  eventName?: string;
  yachtSlug: string;
  variant?: "primary" | "secondary" | "light";
  className?: string;
}

const variantClasses = {
  primary: "bg-[#e89d79] text-[#061625] shadow-lg hover:bg-[#d88a66] hover:shadow-xl hover:scale-105",
  secondary: "border border-white/60 bg-transparent text-white hover:bg-white/10",
  light: "bg-[#061625] text-white shadow-lg hover:bg-[#0a2540] hover:shadow-xl hover:scale-105",
};

export function TrackedCta({ href, label, eventName, yachtSlug, variant = "primary", className }: TrackedCtaProps) {
  return (
    <a
      href={href}
      onClick={() => {
        if (eventName) trackEvent(eventName, { yacht: yachtSlug });
      }}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e89d79] focus-visible:ring-offset-2",
        variantClasses[variant],
        className
      )}
    >
      {label}
    </a>
  );
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
      className={cn(
        "font-medium underline underline-offset-4 transition-colors hover:text-[#e89d79] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e89d79]",
        className
      )}
    >
      {label}
    </a>
  );
}
