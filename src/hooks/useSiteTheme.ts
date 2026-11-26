import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type SiteTheme = "normal" | "blackfriday";

const STORAGE_KEY = "site_theme";

function readStored(): SiteTheme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "blackfriday" ? "blackfriday" : "normal";
  } catch {
    return "normal";
  }
}

// Se inicia con el último tema visto en este navegador para evitar un parpadeo
// al cargar; luego se confirma con lo que diga la base de datos.
let current: SiteTheme = readStored();
let fetched = false;
const listeners = new Set<(t: SiteTheme) => void>();

function publish(next: SiteTheme) {
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignorar si el navegador bloquea el almacenamiento
  }
  listeners.forEach((l) => l(next));
}

async function fetchTheme() {
  if (fetched) return;
  fetched = true;
  const { data, error } = await supabase.from("settings").select("value").eq("key", "site_theme").maybeSingle();
  if (error) {
    fetched = false; // permitir reintentar; mientras tanto se mantiene el tema actual
    return;
  }
  publish(data?.value === "blackfriday" ? "blackfriday" : "normal");
}

// Lo usa el panel admin para reflejar el cambio de inmediato.
export function setSiteTheme(next: SiteTheme) {
  publish(next);
}

export function useSiteTheme() {
  const [theme, setTheme] = useState<SiteTheme>(current);

  useEffect(() => {
    listeners.add(setTheme);
    setTheme(current);
    fetchTheme();
    return () => {
      listeners.delete(setTheme);
    };
  }, []);

  return { theme, isBlackFriday: theme === "blackfriday" };
}
