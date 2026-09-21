"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CatalogItem, ItemStatus } from "@/types/item";
import AdminTable from "@/components/AdminTable";
import ItemFormModal from "./ItemFormModal";

export default function DashboardPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<CatalogItem | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data as CatalogItem[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).sort(),
    [items]
  );

  async function handleStatusChange(id: string, status: ItemStatus) {
    const supabase = createClient();
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
    const { error } = await supabase
      .from("items")
      .update({ status })
      .eq("id", id);
    if (error) {
      // roll back on failure
      loadItems();
    }
  }

  async function handleDeleteConfirmed() {
    if (!deletingItem) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", deletingItem.id);

    if (!error) {
      setItems((prev) => prev.filter((i) => i.id !== deletingItem.id));
    }
    setDeletingItem(null);
  }

  function openAddForm() {
    setEditingItem(null);
    setFormOpen(true);
  }

  function openEditForm(item: CatalogItem) {
    setEditingItem(item);
    setFormOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl text-ink">Items</h1>
        <button
          onClick={openAddForm}
          className="bg-ink px-4 py-2 text-sm text-paper transition-opacity hover:opacity-90"
        >
          + Add Item
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-ink2/70">Loading...</p>
        ) : (
          <AdminTable
            items={items}
            onStatusChange={handleStatusChange}
            onEdit={openEditForm}
            onDelete={setDeletingItem}
          />
        )}
      </div>

      {formOpen && (
        <ItemFormModal
          item={editingItem}
          categories={categories}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadItems();
          }}
        />
      )}

      {deletingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setDeletingItem(null)}
        >
          <div
            className="w-full max-w-sm bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-lg text-ink">Delete this item?</h2>
            <p className="mt-2 text-sm text-ink2">
              &quot;{deletingItem.title}&quot; will be permanently deleted and
              cannot be recovered.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 text-sm text-ink2 hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="bg-rose px-4 py-2 text-sm text-paper hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
