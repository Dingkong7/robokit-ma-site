-- ============================================================================
-- RoboKit.ma — schéma Supabase
-- À exécuter une seule fois dans Supabase > SQL Editor (avant seed.sql)
-- ============================================================================

create table if not exists products (
  id text primary key,
  category text not null,
  title text not null,
  description text default '',
  price numeric not null default 0,
  stock integer not null default 0,
  subcategory text default '',
  image_url text,
  created_at timestamptz default now()
);

alter table products enable row level security;

-- Tout le monde (y compris les visiteurs non connectés) peut lire le catalogue
create policy "Public can read products"
  on products for select
  using (true);

-- Seuls les utilisateurs connectés (l'admin) peuvent ajouter des produits
create policy "Authenticated users can insert products"
  on products for insert
  to authenticated
  with check (true);

-- Seuls les utilisateurs connectés (l'admin) peuvent modifier des produits
create policy "Authenticated users can update products"
  on products for update
  to authenticated
  using (true);

-- Seuls les utilisateurs connectés (l'admin) peuvent supprimer des produits
create policy "Authenticated users can delete products"
  on products for delete
  to authenticated
  using (true);
