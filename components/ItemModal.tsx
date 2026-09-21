"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CatalogItem } from "@/types/item";
import { formatPrice } from "@/utils/format";

interface ItemModalProps {
  item: CatalogItem;
  onClose: () => void;
}

const statusLabel: Record<string, string> = {
  available: "Available",
  booked: "Booked",
  sold: "Sold",
};

export default function ItemModal({ item, onClose }: ItemModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleShare() {
    const shareUrl = `${window.location.origin}/item/${item.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, url: shareUrl });
        return;
      } catch {
        // user cancelled the native share sheet — fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="thin-scrollbar flex max-h-full w-full max-w-3xl flex-col overflow-y-auto bg-surface sm:flex-row"
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
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-ink2 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
                <circle cx="18" cy="5" r="2.5" />
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="18" cy="19" r="2.5" />
                <line x1="8.2" y1="10.7" x2="15.8" y2="6.3" />
                <line x1="8.2" y1="13.3" x2="15.8" y2="17.7" />
              </svg>
              {copied ? "Link copied" : "Share"}
            </button>

            <button
              onClick={onClose}
              aria-label="Close"
              className="text-ink2 hover:text-ink"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-ochreDark">
              {item.category}
            </p>
            <h2 className="mt-1 font-display text-2xl text-ink">
              {item.title}
            </h2>
            <p className="mt-2 text-lg text-ink2">{formatPrice(item.price)}</p>
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
                View more
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
