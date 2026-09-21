"use client";

import { CatalogItem } from "@/types/item";
import ItemCard from "./ItemCard";

interface ItemGridProps {
  items: CatalogItem[];
  onSelect: (item: CatalogItem) => void;
}

export default function ItemGrid({ items, onSelect }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-lg italic text-ink2">
          No matching items found.
        </p>
        <p className="mt-1 text-sm text-ink2/70">
          Try changing your search keyword or category.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-5 sm:columns-3 lg:columns-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onClick={() => onSelect(item)} />
      ))}
    </div>
  );
}
