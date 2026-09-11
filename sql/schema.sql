-- =====================================================================
-- BABY BODEGA — SCRIPT ÚNICO DE BASE DE DATOS
-- Copia y pega TODO este archivo en Supabase → SQL Editor → New query
-- y presiona "Run". Se puede ejecutar una sola vez.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TABLAS
-- ---------------------------------------------------------------------

create extension if not exists pgcrypto;

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  brand_id uuid not null references public.brands(id) on delete restrict,
  category_id uuid not null references public.categories(id) on delete restrict,
  normal_price numeric(12,2) not null check (normal_price >= 0),
  discount_price numeric(12,2) check (discount_price is null or discount_price >= 0),
  is_on_sale boolean not null default false,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_brand_id_idx on public.products(brand_id);
create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_is_on_sale_idx on public.products(is_on_sale);
create index if not exists products_is_featured_idx on public.products(is_featured);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on public.product_images(product_id);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('admin','staff','client')),
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. TIMESTAMPS AUTOMÁTICOS (updated_at)
-- ---------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_brands on public.brands;
create trigger set_updated_at_brands before update on public.brands
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_categories on public.categories;
create trigger set_updated_at_categories before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_products on public.products;
create trigger set_updated_at_products before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_settings on public.settings;
create trigger set_updated_at_settings before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 3. CREACIÓN AUTOMÁTICA DE PERFIL AL REGISTRAR UN USUARIO
-- ---------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, 'client', new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Evita que un usuario cambie su PROPIO rol (solo un admin puede hacerlo).
create or replace function public.prevent_self_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_admin(auth.uid()) then
    raise exception 'No puedes cambiar tu propio rol.';
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 4. FUNCIONES AUXILIARES PARA POLÍTICAS (evitan recursión en RLS)
-- ---------------------------------------------------------------------

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

create or replace function public.is_admin_or_staff(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = uid and role in ('admin','staff')
  );
$$;

drop trigger if exists prevent_self_role_change_trigger on public.profiles;
create trigger prevent_self_role_change_trigger
  before update on public.profiles
  for each row execute function public.prevent_self_role_change();

-- ---------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------

alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.profiles enable row level security;
alter table public.settings enable row level security;

-- BRANDS: lectura pública, escritura admin/staff
drop policy if exists "brands_select_public" on public.brands;
create policy "brands_select_public" on public.brands for select using (true);

drop policy if exists "brands_write_admin_staff" on public.brands;
create policy "brands_write_admin_staff" on public.brands for all
  using (public.is_admin_or_staff(auth.uid()))
  with check (public.is_admin_or_staff(auth.uid()));

-- CATEGORIES: lectura pública, escritura admin/staff
drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public" on public.categories for select using (true);

drop policy if exists "categories_write_admin_staff" on public.categories;
create policy "categories_write_admin_staff" on public.categories for all
  using (public.is_admin_or_staff(auth.uid()))
  with check (public.is_admin_or_staff(auth.uid()));

-- PRODUCTS: lectura pública, escritura admin/staff
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products for select using (true);

drop policy if exists "products_write_admin_staff" on public.products;
create policy "products_write_admin_staff" on public.products for all
  using (public.is_admin_or_staff(auth.uid()))
  with check (public.is_admin_or_staff(auth.uid()));

-- PRODUCT_IMAGES: lectura pública, escritura admin/staff
drop policy if exists "product_images_select_public" on public.product_images;
create policy "product_images_select_public" on public.product_images for select using (true);

drop policy if exists "product_images_write_admin_staff" on public.product_images;
create policy "product_images_write_admin_staff" on public.product_images for all
  using (public.is_admin_or_staff(auth.uid()))
  with check (public.is_admin_or_staff(auth.uid()));

-- PROFILES: cada usuario ve/edita el suyo; admin/staff ven todos; solo admin cambia roles (aplicado por trigger)
drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff" on public.profiles for select
  using (auth.uid() = id or public.is_admin_or_staff(auth.uid()));

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles for update
  using (auth.uid() = id or public.is_admin(auth.uid()))
  with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert
  with check (auth.uid() = id);

-- SETTINGS: lectura pública (para mostrar el WhatsApp sin login), escritura solo admin
drop policy if exists "settings_select_public" on public.settings;
create policy "settings_select_public" on public.settings for select using (true);

drop policy if exists "settings_write_admin" on public.settings;
create policy "settings_write_admin" on public.settings for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------
-- 6. STORAGE: POLÍTICAS PARA EL BUCKET "product-images"
-- IMPORTANTE: antes de correr esta sección, crea el bucket llamado
-- exactamente "product-images" desde Supabase → Storage → New bucket,
-- marcado como PÚBLICO (Public bucket = ON). Instrucciones en el README.
-- ---------------------------------------------------------------------

drop policy if exists "product_images_bucket_select_public" on storage.objects;
create policy "product_images_bucket_select_public" on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "product_images_bucket_write_admin_staff" on storage.objects;
create policy "product_images_bucket_write_admin_staff" on storage.objects for all
  using (bucket_id = 'product-images' and public.is_admin_or_staff(auth.uid()))
  with check (bucket_id = 'product-images' and public.is_admin_or_staff(auth.uid()));

-- ---------------------------------------------------------------------
-- 7. DATOS INICIALES (marcas, categorías, configuración)
-- ---------------------------------------------------------------------

insert into public.brands (name, slug) values
  ('Bebesit', 'bebesit'),
  ('Joie', 'joie'),
  ('Infanti', 'infanti')
on conflict (slug) do nothing;

insert into public.categories (name, slug) values
  ('Coches de paseo', 'coches-paseo'),
  ('Coches completos + porta bebé', 'coches-completos'),
  ('Sillas de comer', 'sillas-comer'),
  ('Sillas de auto', 'sillas-auto'),
  ('Bicicletas para niños', 'bicicletas')
on conflict (slug) do nothing;

insert into public.settings (key, value) values
  ('whatsapp_number', '59169505865')
on conflict (key) do nothing;

-- =====================================================================
-- FIN DEL SCRIPT. Si todo se ejecutó sin errores, tu base de datos
-- está lista. Siguiente paso: crear tu usuario administrador desde
-- Authentication → Add user, y luego ejecutar el UPDATE que aparece
-- en el README para convertirlo en admin.
-- =====================================================================
