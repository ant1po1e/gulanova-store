export type ItemStatus = "available" | "booked" | "sold";

export interface CatalogItem {
  id: string;
  title: string;
  price: number;
  category: string;
  image_url: string;
  link: string | null;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface CatalogItemInput {
  title: string;
  price: number;
  category: string;
  image_url: string;
  link: string | null;
  status: ItemStatus;
}
