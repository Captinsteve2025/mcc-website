"use client";

import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "light", className = "" }: LogoProps) {
  // The white logo works on dark backgrounds (light variant)
  // For light backgrounds (dark variant), we invert the colors
  const imageClass = variant === "light"
    ? "" // White logo as-is for dark backgrounds
    : "invert"; // Invert to dark for light backgrounds

  return (
    <Image
      src="/images/mcc-logo-white.png"
      alt="My Caribbean Charters"
      width={200}
      height={50}
      className={`h-10 lg:h-12 w-auto ${imageClass} ${className}`}
      priority
    />
  );
}

// Default export for backward compatibility
export default Logo;
