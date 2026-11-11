import { TrackedCta } from "@/components/yacht/TrackedCta";
import { atlas } from "@/lib/managed-yachts";

export function StickyCharterCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#061625]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(6,22,37,0.25)] backdrop-blur-md md:hidden">
      <TrackedCta
        href="#enquire"
        label="Check availability"
        eventName="atlas_availability_click"
        yachtSlug={atlas.slug}
        className="w-full"
      />
    </div>
  );
}
