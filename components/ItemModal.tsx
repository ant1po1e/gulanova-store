"use client";

import { useEffect } from "react";
import Image from "next/image";
import { CatalogItem } from "@/types/item";
import { formatRupiah } from "@/utils/format";

interface ItemModalProps {
  item: CatalogItem | null;
  onClose: () => void;
}

const statusLabel: Record<string, string> = {
  available: "Tersedia",
  booked: "Dibooking",
  sold: "Terjual",
};

export default function ItemModal({ item, onClose }: ItemModalProps) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="thin-scrollbar flex max-h-full w-full max-w-3xl flex-col overflow-y-auto bg-paper sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/5] w-full shrink-0 sm:w-3/5">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, 60vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="ml-auto text-ink2 hover:text-ink"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>

          <div className="mt-2">
            <p className="text-xs uppercase tracking-wide text-ochreDark">
              {item.category}
            </p>
            <h2 className="mt-1 font-display text-2xl text-ink">
              {item.title}
            </h2>
            <p className="mt-2 text-lg text-ink2">
              {formatRupiah(item.price)}
            </p>
            <p className="mt-3 text-sm text-ink2/80">
              Status: {statusLabel[item.status]}
            </p>

            {item.link && item.status === "available" && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block border border-ink px-5 py-2 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Lihat selengkapnya
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
