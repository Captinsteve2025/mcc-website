"use client";

import { useState } from "react";

// Renders CYA photographs directly from their original URLs (no rehosting or
// server-side caching, per CYA media policy), with lazy loading and a
// placeholder when a photo is genuinely unavailable.
export function YachtPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#061625]/10">
        <span className="text-sm text-[#061625]/50">Photo not available</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  );
}
