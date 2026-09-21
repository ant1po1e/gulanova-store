import CatalogView from "@/components/CatalogView";

// Full-page fallback for a shared item link opened as a fresh page load
// (e.g. someone pastes the link in a new tab). On client-side navigation
// from within the app, this same URL is instead intercepted and shown as
// a modal — see app/@modal/(.)item/[id]/page.tsx.
export default function ItemPage({ params }: { params: { id: string } }) {
  return <CatalogView openItemId={params.id} />;
}
