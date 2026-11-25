export const HOLD_BOOKINGS_EMAIL = "bookings@mycaribbeancharters.com";
export const HOLD_GUEST_LIMIT = 100;
export const CYA_YACHT_ID_PATTERN = /^[a-f0-9]{8,32}$/i;
export const MANAGED_YACHT_HOLD_PREFIX = "managed:";

export function holdGuestLimit(publishedCapacity?: number | null): number {
  return publishedCapacity && Number.isSafeInteger(publishedCapacity) && publishedCapacity > 0
    ? Math.min(publishedCapacity, HOLD_GUEST_LIMIT)
    : HOLD_GUEST_LIMIT;
}

export function holdRequestToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Tortola", year: "numeric", month: "2-digit", day: "2-digit",
  }).format();
}

export function formatHoldDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC", day: "numeric", month: "short", year: "numeric",
  });
}

export type CharterDateSelection = {
  start: string;
  end: string;
  label: string;
};

export type CharterCalendarSelection = CharterDateSelection | {
  start: string;
  end: null;
  label: string;
};
