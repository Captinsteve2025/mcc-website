"use client";

import { useEffect } from "react";

export function useScrollDepthTracking() {
  useEffect(() => {
    // Scroll depth tracking implementation
    // Can be connected to analytics later
    let maxScrollDepth = 0;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const currentDepth = Math.round((scrolled / scrollHeight) * 100);

      if (currentDepth > maxScrollDepth) {
        maxScrollDepth = currentDepth;
        // Can send to analytics here if needed
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
}

export default useScrollDepthTracking;
