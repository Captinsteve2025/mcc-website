"use client";

import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "light", className = "" }: LogoProps) {
  const source = variant === "light" ? "/images/brand/mcc-logo-light.png" : "/images/brand/mcc-logo-primary.png";

  return (
    <Image
      src={source}
      alt="My Caribbean Charters"
      width={3000}
      height={1825}
      className={`h-12 w-auto object-contain lg:h-14 ${className}`}
      priority
    />
  );
}

export default Logo;
