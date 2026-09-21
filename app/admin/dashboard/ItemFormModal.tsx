"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CatalogItem, CatalogItemInput, ItemStatus } from "@/types/item";
import { convertImageToWebp, createPreviewUrl } from "@/utils/imageToWebp";

interface ItemFormModalProps {
  item: CatalogItem | null; // null = mode tambah, terisi = mode edit
  categories: string[];
  onClose: () => void;
  onSaved: () => void;
}

export default function ItemFormModal({
  item,
  categories,
  onClose,
  onSaved,
}: ItemFormModalProps) {
  const isEdit = Boolean(item);

  const [title, setTitle] = useState(item?.title ?? "");
  const [price, setPrice] = useState(item?.price?.toString() ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [link, setLink] = useState(item?.link ?? "");
  const [status, setStatus] = useState<ItemStatus>(item?.status ?? "available");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    item?.image_url ?? null
  );
  const [converting, setConverting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setConverting(true);
    try {
      const webpFile = await convertImageToWebp(file);
      setImageFile(webpFile);
      setPreviewUrl(createPreviewUrl(webpFile));
    } catch (err) {
      console.error(err);
      setError("Gagal memproses gambar. Coba gambar lain.");
    } finally {
      setConverting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !price || !category.trim()) {
      setError("Judul, harga, dan kategori wajib diisi.");
      return;
    }
    if (!imageFile && !item?.image_url) {
      setError("Gambar item wajib diunggah.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      let imageUrl = item?.image_url ?? "";

      if (imageFile) {
        const filePath = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("catalog-images")
          .upload(filePath, imageFile, {
            contentType: "image/webp",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("catalog-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const payload: CatalogItemInput = {
        title: title.trim(),
        price: Number(price),
        category: category.trim(),
        image_url: imageUrl,
        link: link.trim() || null,
        status,
      };

      if (isEdit && item) {
        const { error: updateError } = await supabase
          .from("items")
          .update(payload)
          .eq("id", item.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("items")
          .insert(payload);
        if (insertError) throw insertError;
      }

      onSaved();
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan item. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
      onClick={onClose}
    >
      <div
        className="thin-scrollbar max-h-full w-full max-w-lg overflow-y-auto bg-paper p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-ink">
          {isEdit ? "Edit Item" : "Tambah Item"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink2">Gambar</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-ink2 file:mr-3 file:border file:border-line file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-ink"
            />
            {converting && (
              <span className="text-xs text-ink2/70">Mengonversi ke WEBP...</span>
            )}
            {previewUrl && (
              <div className="relative mt-1 aspect-[4/5] w-32 overflow-hidden border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink2">Judul</span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink2">Harga (Rp)</span>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink2">Kategori</span>
            <input
              type="text"
              required
              list="category-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
            />
            <datalist id="category-suggestions">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink2">Link (opsional)</span>
            <input
              type="url"
              value={link ?? ""}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink2">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ItemStatus)}
              className="border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
            >
              <option value="available">Tersedia</option>
              <option value="booked">Dibooking</option>
              <option value="sold">Terjual</option>
            </select>
          </label>

          {error && <p className="text-sm text-rose">{error}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-ink2 hover:text-ink"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || converting}
              className="bg-ink px-5 py-2 text-sm text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
