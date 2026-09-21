"use client";

import Image from "next/image";
import Link from "next/link";
import { CatalogItem } from "@/types/item";
import { formatPrice } from "@/utils/format";

interface ItemCardProps {
  item: CatalogItem;
}

const statusLabel: Record<string, string> = {
  booked: "Booked",
  sold: "Sold",
};

export default function ItemCard({ item }: ItemCardProps) {
  const isUnavailable = item.status !== "available";

  return (
    <Link
      href={`/item/${item.id}`}
      scroll={false}
      className="group mb-5 block w-full break-inside-avoid text-left"
    >
      <div className="relative overflow-hidden border border-line bg-surface transition-shadow duration-200 group-hover:shadow-lg group-hover:shadow-ink/5">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
              isUnavailable ? "grayscale-[40%] opacity-70" : ""
            }`}
          />
        </div>
        {isUnavailable && (
          <span className="absolute left-2 top-2 border border-line bg-paper/90 px-2 py-0.5 text-xs text-ink2">
            {statusLabel[item.status]}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-start justify-between gap-2">
        <h3 className="font-display text-[15px] leading-snug text-ink">
          {item.title}
        </h3>
      </div>
      <p className="mt-0.5 text-sm text-ink2">{formatPrice(item.price)}</p>
    </Link>
  );
}
