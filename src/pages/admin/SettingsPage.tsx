import { useState, type FormEvent } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import { useSettings } from "../../hooks/useSettings";

export default function SettingsPage() {
  const { whatsappNumber, refetch } = useSettings();
  const [value, setValue] = useState(whatsappNumber);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-semibold text-ink mb-6">Configuración</h1>
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
