"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CatalogItem } from "@/types/item";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import ItemGrid from "@/components/ItemGrid";
import ItemModal from "@/components/ItemModal";

export default function HomePage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<CatalogItem | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadItems() {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setItems(data as CatalogItem[]);
      }
      setLoading(false);
    }

    loadItems();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).sort(),
    [items]
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, search, category]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 pb-20 sm:px-6">
      <header className="sticky top-0 z-30 -mx-4 border-b border-line bg-paper/95 px-4 py-5 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-display text-2xl italic text-ink">Gulanova Store</h1>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {categories.length > 0 && (
          <div className="mt-4">
            <CategoryFilter
              categories={categories}
              active={category}
              onChange={setCategory}
            />
          </div>
        )}
      </header>

      <section className="pt-8">
        {loading ? (
          <p className="py-24 text-center text-sm text-ink2/70">Loading catalog...</p>
        ) : (
          <ItemGrid items={filtered} onSelect={setSelected} />
        )}
      </section>

      <ItemModal item={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
