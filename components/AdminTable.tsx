"use client";

import { CatalogItem, ItemStatus } from "@/types/item";
import { formatRupiah } from "@/utils/format";

interface AdminTableProps {
  items: CatalogItem[];
  onStatusChange: (id: string, status: ItemStatus) => void;
  onEdit: (item: CatalogItem) => void;
  onDelete: (item: CatalogItem) => void;
}

const statusOptions: { value: ItemStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "booked", label: "Booked" },
  { value: "sold", label: "Sold" },
];

export default function AdminTable({
  items,
  onStatusChange,
  onEdit,
  onDelete,
}: AdminTableProps) {
  if (items.length === 0) {
    return (
      <p className="border border-dashed border-line px-4 py-10 text-center text-sm text-ink2/70">
        No items yet. Add your first item.
      </p>
    );
  }

  return (
    <div className="thin-scrollbar overflow-x-auto border border-line">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-white/60 text-left text-ink2">
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-line last:border-0">
              <td className="px-4 py-3 text-ink">{item.title}</td>
              <td className="px-4 py-3 text-ink2">{formatRupiah(item.price)}</td>
              <td className="px-4 py-3 text-ink2">{item.category}</td>
              <td className="px-4 py-3">
                <select
                  value={item.status}
                  onChange={(e) =>
                    onStatusChange(item.id, e.target.value as ItemStatus)
                  }
                  className="border border-line bg-white px-2 py-1 text-sm text-ink outline-none focus:border-ochre"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(item)}
                  className="mr-4 text-ink2 underline decoration-line underline-offset-4 hover:text-ink"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="text-rose underline decoration-rose/30 underline-offset-4 hover:decoration-rose"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
