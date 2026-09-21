-- =========================================================
-- SKEMA DATABASE UNTUK KATALOG APP
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- =========================================================

-- 1. Tabel items
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric(14, 2) not null default 0,
  category text not null,
  image_url text not null,
  link text,
  status text not null default 'available' check (status in ('available', 'booked', 'sold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index untuk pencarian & filter yang lebih cepat
create index if not exists items_category_idx on public.items (category);
create index if not exists items_status_idx on public.items (status);
create index if not exists items_created_at_idx on public.items (created_at desc);

-- Trigger auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_items_updated_at on public.items;
create trigger trg_items_updated_at
  before update on public.items
  for each row execute function public.set_updated_at();

-- 2. Row Level Security
alter table public.items enable row level security;

-- Semua orang (termasuk publik/anon) boleh MEMBACA katalog
drop policy if exists "Public read access" on public.items;
create policy "Public read access"
  on public.items for select
  using (true);

-- Hanya user yang sudah login (admin) yang boleh insert/update/delete
drop policy if exists "Admin insert" on public.items;
create policy "Admin insert"
  on public.items for insert
  to authenticated
  with check (true);

drop policy if exists "Admin update" on public.items;
create policy "Admin update"
  on public.items for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin delete" on public.items;
create policy "Admin delete"
  on public.items for delete
  to authenticated
  using (true);

-- =========================================================
-- 3. Storage bucket untuk gambar katalog (jika ingin pakai
--    Supabase Storage, bukan hosting gambar eksternal)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('catalog-images', 'catalog-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read catalog images" on storage.objects;
create policy "Public read catalog images"
  on storage.objects for select
  using (bucket_id = 'catalog-images');

drop policy if exists "Admin upload catalog images" on storage.objects;
create policy "Admin upload catalog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'catalog-images');

drop policy if exists "Admin update catalog images" on storage.objects;
create policy "Admin update catalog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'catalog-images');

drop policy if exists "Admin delete catalog images" on storage.objects;
create policy "Admin delete catalog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'catalog-images');

-- =========================================================
-- 4. Membuat akun admin
-- Buat manual lewat: Supabase Dashboard > Authentication > Users > Add user
-- Cukup 1 (atau beberapa) akun admin — tidak perlu tabel role terpisah
-- karena semua user yang "authenticated" via Supabase Auth dianggap admin.
-- =========================================================
