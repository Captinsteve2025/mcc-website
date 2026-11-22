"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

type Props = {
  defaultValue: string;
  /** Screen to navigate to when a name is submitted, with this field as ?name=. */
  basePath: string;
};

// Debounced yacht-name autocomplete backed by /api/yacht-name-suggestions.
// Enter or picking a suggestion navigates to basePath?name=... (keeping any
// other query parameters already present).
export function YachtNameSearch({ defaultValue, basePath }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/yacht-name-suggestions?q=${encodeURIComponent(query)}`);
        const body = (await response.json().catch(() => null)) as { suggestions?: unknown } | null;
        const names = Array.isArray(body?.suggestions)
          ? body.suggestions.filter((n): n is string => typeof n === "string")
          : [];
        setSuggestions(names);
        setOpen(names.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const go = (name: string) => {
    const params = new URLSearchParams(window.location.search);
    if (name) params.set("name", name);
    else params.delete("name");
    params.delete("page");
    window.location.href = `${basePath}${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div ref={boxRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#061625]/40" aria-hidden="true" />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              go(value.trim());
            }
          }}
          aria-label="Yacht name"
          placeholder="Yacht name (e.g. Endless Horizon)"
          autoComplete="off"
          className="h-12 w-full rounded-md border border-white/20 bg-white/95 pl-9 pr-9 text-sm text-[#061625] placeholder:text-[#061625]/45 focus:outline-none focus:ring-2 focus:ring-[#e89d79]"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              setOpen(false);
              go("");
            }}
            aria-label="Clear yacht name search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#061625]/50 transition-colors hover:bg-[#061625]/5 hover:text-[#061625]"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      {open && (
        <ul
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-[#061625]/15 bg-white shadow-lg"
          role="listbox"
          aria-label="Yacht name suggestions"
        >
          {suggestions.map((name) => (
            <li key={name}>
              <button
                type="button"
                role="option"
                aria-selected={name === value}
                onClick={() => {
                  setValue(name);
                  setOpen(false);
                  go(name);
                }}
                className="block w-full truncate px-3 py-2.5 text-left text-sm text-[#061625] transition-colors hover:bg-[#e89d79]/10"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {loading && <span className="sr-only">Searching yacht names…</span>}
    </div>
  );
}
