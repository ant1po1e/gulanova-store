"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CatalogItem } from "@/types/item";
import ItemModal from "./ItemModal";

export default function ItemModalRoute({ id }: { id: string }) {
  const router = useRouter();
  const [item, setItem] = useState<CatalogItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) {
          setNotFound(true);
          return;
        }
        setItem(data as CatalogItem);
      });

    return () => {
      active = false;
    };
  }, [id]);

  function handleClose() {
    router.back();
  }

  if (notFound) return null;
  if (!item) return null;

  return <ItemModal item={item} onClose={handleClose} />;
}
