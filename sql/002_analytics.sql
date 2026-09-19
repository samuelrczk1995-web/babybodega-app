-- =====================================================================
-- BABY BODEGA — MIGRACIÓN 002: ESTADÍSTICAS / ANALÍTICA
-- Copia y pega TODO este archivo en Supabase → SQL Editor → New query
-- y presiona "Run". Se agrega a la base de datos que ya tienes, no
-- reemplaza nada de lo anterior.
-- =====================================================================

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('page_view', 'category_click', 'whatsapp_click')),
  category_slug text,
  product_id uuid references public.products(id) on delete set null,
  page_path text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_type_idx on public.analytics_events(event_type);
create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at);
create index if not exists analytics_events_category_idx on public.analytics_events(category_slug);
create index if not exists analytics_events_product_idx on public.analytics_events(product_id);

alter table public.analytics_events enable row level security;

-- Cualquier visitante (incluso sin iniciar sesión) puede REGISTRAR un evento.
-- Esto es necesario para poder medir visitas de clientes anónimos.
drop policy if exists "analytics_events_insert_public" on public.analytics_events;
create policy "analytics_events_insert_public" on public.analytics_events for insert
  with check (true);

-- Solo admin/staff pueden LEER las estadísticas.
drop policy if exists "analytics_events_select_admin_staff" on public.analytics_events;
create policy "analytics_events_select_admin_staff" on public.analytics_events for select
  using (public.is_admin_or_staff(auth.uid()));

-- Nadie puede modificar ni borrar eventos ya registrados (ni siquiera el admin
-- desde la app); esto mantiene la analítica confiable. Si en algún momento
-- quieres limpiar datos antiguos, puedes hacerlo manualmente desde el SQL Editor.

-- =====================================================================
-- FIN DE LA MIGRACIÓN 002.
-- =====================================================================
