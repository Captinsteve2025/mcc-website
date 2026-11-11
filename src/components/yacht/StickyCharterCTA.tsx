import { TrackedCta } from "@/components/yacht/TrackedCta";
import { type ManagedYacht } from "@/lib/managed-yachts";

export function StickyCharterCTA({ yacht }: { yacht: ManagedYacht }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#061625]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(6,22,37,0.25)] backdrop-blur-md md:hidden">
      <TrackedCta
        href="#enquire"
        label="Check availability"
        eventName={`${yacht.slug}_availability_click`}
        yachtSlug={yacht.slug}
        className="w-full"
      />
    </div>
  );
}
