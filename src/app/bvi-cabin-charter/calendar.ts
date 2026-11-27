export const calendarStatuses = {
  available: "Available to request",
  limited: "Limited Cabins",
  hold: "On Hold",
  booked: "Booked",
} as const;

export type CalendarStatus = keyof typeof calendarStatuses;

export type CalendarDay = {
  yacht_id: string;
  starts_on: string;
  status: CalendarStatus;
  rate_nights: number | null;
  rate_usd: number | null;
};

export const cabinCalendarToday = () => new Intl.DateTimeFormat("sv-SE", {
  timeZone: "America/Tortola", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date());

export const cabinBookingEmail = "booking@mycaribbeancharters.com";
