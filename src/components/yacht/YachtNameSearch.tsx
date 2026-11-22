"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

type Props = {
  defaultValue: string;
  /** Page-size 10 local suggestions from the full catalogue; null while loading. */
  fetchSuggestions: (query: string) => Promise<string[]>;
};

export function YachtNameSearch({ defaultValue, fetchSuggestions }: Props) {
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
        const names = await fetchSuggestions(query);
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
  }, [value, fetchSuggestions]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const submit = (name?: string) => {
    const params = new URLSearchParams(window.location.search);
    if (name !== undefined) {
      setValue(name);
      setOpen(false);
    }
    const finalQuery = (name !== undefined ? name : value).trim();
    if (finalQuery) params.set("name", finalQuery);
    else params.delete("name");
    params.delete("page");
    window.location.href = `/charter-yachts${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div ref={boxRef} className="relative col-span-2 md:col-span-3 lg:col-span-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#061625]/40" aria-hidden="true" />
        <input
          type="search"
          name="name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          aria-label="Yacht name"
          placeholder="Yacht name"
          autoComplete="off"
          className="h-11 w-full rounded-md border border-[#061625]/20 bg-white pl-9 pr-8 text-sm text-[#061625] focus:outline-none focus:ring-2 focus:ring-[#e89d79]"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              submit("");
            }}
            aria-label="Clear yacht name search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#061625]/50 transition-colors hover:bg-[#061625]/5 hover:text-[#061625]"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      {open && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-[#061625]/15 bg-white shadow-lg" role="listbox">
          {suggestions.map((name) => (
            <li key={name}>
              <button
                type="button"
                role="option"
                aria-selected={name === value}
                onClick={() => submit(name)}
                className="block w-full truncate px-3 py-2 text-left text-sm text-[#061625] transition-colors hover:bg-[#e89d79]/10"
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
