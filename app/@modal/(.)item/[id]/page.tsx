import ItemModalRoute from "@/components/ItemModalRoute";

// Intercepted route: when navigating client-side (e.g. clicking an item
// card) to /item/[id], this renders the item as a modal on top of the
// current page instead of navigating to the full page below.
export default function InterceptedItemModal({
  params,
}: {
  params: { id: string };
}) {
  return <ItemModalRoute id={params.id} />;
}
