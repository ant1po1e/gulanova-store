"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full sm:w-72">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search items..."
        aria-label="Search catalog items"
        className="w-full border-b border-line bg-transparent py-2 pr-8 text-sm text-ink placeholder:text-ink2/50 focus:border-ochre outline-none transition-colors"
      />
      <svg
        className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-ink2/50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
  );
}
