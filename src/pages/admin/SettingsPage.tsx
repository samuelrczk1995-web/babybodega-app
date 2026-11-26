import { useState, type FormEvent } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import { useSettings } from "../../hooks/useSettings";
import { useSiteTheme, setSiteTheme } from "../../hooks/useSiteTheme";
import { useProfile } from "../../hooks/useProfile";

export default function SettingsPage() {
  const { whatsappNumber, refetch } = useSettings();
  const { isBlackFriday } = useSiteTheme();
  const { profile } = useProfile();
  const [value, setValue] = useState(whatsappNumber);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [themeSaving, setThemeSaving] = useState(false);
  const [themeError, setThemeError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    const { error: upsertError } = await supabase
      .from("settings")
      .upsert({ key: "whatsapp_number", value: value.replace(/\D/g, "") }, { onConflict: "key" });

    setSaving(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    setSuccess(true);
    refetch();
  }

  async function handleToggleTheme() {
    setThemeSaving(true);
    setThemeError(null);
    const next = isBlackFriday ? "normal" : "blackfriday";

    const { error: upsertError } = await supabase
      .from("settings")
      .upsert({ key: "site_theme", value: next }, { onConflict: "key" });

    setThemeSaving(false);
    if (upsertError) {
      setThemeError("No se pudo cambiar el tema. Solo un administrador puede hacerlo.");
      return;
    }
    setSiteTheme(next);
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-semibold text-ink mb-6">Configuración</h1>

      <div className="bg-white rounded-2xl border border-line p-6 max-w-md mb-6">
        <h2 className="text-base font-heading font-semibold text-ink mb-2">Modo Black Friday</h2>
        <p className="text-xs text-inksoft mb-4">
          Cambia los colores, el banner y la portada de la página pública a la campaña de Black Friday.
          Al apagarlo, la página vuelve a verse exactamente como siempre. El cambio es inmediato y no
          requiere publicar nada.
        </p>
        <div className="flex items-center justify-between gap-4">
          <span className={`text-sm font-semibold ${isBlackFriday ? "text-sagedark" : "text-inksoft"}`}>
            {isBlackFriday ? "Activado" : "Desactivado"}
          </span>
          <button
            type="button"
            onClick={handleToggleTheme}
            disabled={themeSaving || profile?.role !== "admin"}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60 ${
              isBlackFriday ? "bg-creamsoft text-ink border border-line" : "bg-ink text-cream"
            }`}
          >
            {themeSaving ? "Guardando..." : isBlackFriday ? "Desactivar" : "Activar Black Friday"}
          </button>
        </div>
        {profile && profile.role !== "admin" && (
          <p className="text-xs text-inksoft mt-3">Solo un administrador puede cambiar esta opción.</p>
        )}
        {themeError && <p className="text-sm text-red-600 mt-3">{themeError}</p>}
      </div>

      <div className="bg-white rounded-2xl border border-line p-6 max-w-md">
        <h2 className="text-base font-heading font-semibold text-ink mb-2">Número de WhatsApp</h2>
        <p className="text-xs text-inksoft mb-4">
          Escribe el número completo con código de país, sin espacios ni el símbolo "+". Ejemplo para Bolivia:
          59169505865
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="59169505865"
            className="px-4 py-2.5 rounded-xl border border-line outline-none text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-sagedark">Guardado correctamente.</p>}
          <button
            type="submit"
            disabled={saving}
            className="self-start px-5 py-2.5 rounded-full text-sm font-semibold bg-ink text-cream disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
