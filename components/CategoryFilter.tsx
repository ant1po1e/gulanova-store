"use client";

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: CategoryFilterProps) {
  const options = ["All", ...categories];

  return (
    <div className="thin-scrollbar -mx-1 flex gap-5 overflow-x-auto px-1 pb-1">
      {options.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`shrink-0 whitespace-nowrap pb-1 text-sm transition-colors ${
              isActive
                ? "border-b-2 border-ochre text-ink font-medium"
                : "border-b-2 border-transparent text-ink2/70 hover:text-ink"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
