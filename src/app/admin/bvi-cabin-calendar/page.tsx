import { CalendarEditor } from "./CalendarEditor";
import { cabinCalendarToday } from "../../bvi-cabin-charter/calendar";

export const metadata = { title: "BVI Cabin Calendar", robots: { index: false, follow: false } };

export const dynamic = "force-dynamic";

export default function CalendarAdminPage() {
  return <CalendarEditor today={cabinCalendarToday()} />;
}
