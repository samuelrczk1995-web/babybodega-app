import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Faltan las variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Revisa tu archivo .env"
  );
}

// Cliente principal: mantiene la sesión del usuario que inició sesión (admin/staff).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente secundario SIN sesión persistente: se usa exclusivamente para que un
// administrador cree nuevos usuarios (signUp) sin que eso reemplace su propia sesión.
export const supabaseNoSession = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
