"use client";

import { CatalogItem } from "@/types/item";
import ItemCard from "./ItemCard";

interface ItemGridProps {
  items: CatalogItem[];
}

export default function ItemGrid({ items }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-lg italic text-ink2">
          No items match your search.
        </p>
        <p className="mt-1 text-sm text-ink2/70">
          Try a different keyword or category.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-5 sm:columns-3 lg:columns-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
