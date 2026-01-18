"use client";

export function NauticEdEmbed() {
  return (
    <div className="nauticed-embed w-full rounded-lg border border-gray-200 bg-gray-50 p-6">
      <div className="text-center">
        <h4 className="mb-3 text-lg font-semibold text-[#061625]">NauticEd Online Courses</h4>
        <p className="mb-4 text-sm text-muted-foreground">
          Access the complete Bareboat Charter Master bundle and start your theory training today.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="https://www.nauticed.org/sailing-courses/view/bareboat-charter-master-bundle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-[#e89d79] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#d88a66]"
          >
            Get the Course Bundle
          </a>
          <a
            href="https://www.nauticed.org/sailing-courses"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border-2 border-[#061625] bg-transparent px-6 py-3 text-sm font-medium text-[#061625] transition-colors hover:bg-[#061625] hover:text-white"
          >
            Browse All Courses
          </a>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Complete your theory courses before your practical training in the Caribbean.
        </p>
      </div>
    </div>
  );
}
