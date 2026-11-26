-- =====================================================================
-- BABY BODEGA — MIGRACIÓN 003: INTERRUPTOR "MODO BLACK FRIDAY"
-- Copia y pega en Supabase → SQL Editor → New query → Run.
-- Es OPCIONAL: la aplicación también crea este valor sola la primera vez
-- que el administrador usa el interruptor. Ejecutarlo deja la base lista
-- y explícita (tema "normal" por defecto).
-- No modifica ni borra nada existente.
-- =====================================================================

insert into public.settings (key, value) values
  ('site_theme', 'normal')
on conflict (key) do nothing;

-- Valores posibles de site_theme:  'normal'  |  'blackfriday'
-- (Se cambian desde Admin → Configuración → Modo Black Friday.)
