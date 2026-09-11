import { useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import { useBrands } from "../../hooks/useBrands";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Brands() {
  const { brands, refetch } = useBrands();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!newName.trim()) return;
    const { error: insertError } = await supabase.from("brands").insert({ name: newName.trim(), slug: slugify(newName) });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setNewName("");
    refetch();
  }

  async function handleUpdate(id: string) {
    if (!editingName.trim()) return;
    await supabase.from("brands").update({ name: editingName.trim(), slug: slugify(editingName) }).eq("id", id);
    setEditingId(null);
    refetch();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta marca? Solo se puede si no tiene productos asociados.")) return;
    const { error: deleteError } = await supabase.from("brands").delete().eq("id", id);
    if (deleteError) {
      alert("No se puede eliminar: probablemente tiene productos asociados.");
      return;
    }
    refetch();
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-semibold text-ink mb-6">Marcas</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6 max-w-md">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre de la nueva marca"
          className="flex-1 px-4 py-2.5 rounded-xl border border-line outline-none text-sm"
        />
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-ink text-cream flex items-center gap-1 text-sm font-semibold">
          <Plus size={16} />
          Agregar
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-2xl border border-line divide-y divide-line max-w-md">
        {brands.map((b) => (
          <div key={b.id} className="flex items-center justify-between px-4 py-3">
            {editingId === b.id ? (
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 px-2 py-1 rounded-lg border border-line outline-none text-sm mr-2"
                autoFocus
              />
            ) : (
              <div>
                <div className="text-sm text-ink font-medium">{b.name}</div>
                <div className="text-xs text-inksoft">/{b.slug}</div>
              </div>
            )}
            <div className="flex items-center gap-2">
              {editingId === b.id ? (
                <>
                  <button onClick={() => handleUpdate(b.id)} className="p-1.5 rounded-lg hover:bg-creamsoft">
                    <Check size={15} className="text-sagedark" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-creamsoft">
                    <X size={15} className="text-inksoft" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(b.id);
                      setEditingName(b.name);
                    }}
                    className="p-1.5 rounded-lg hover:bg-creamsoft"
                  >
                    <Pencil size={15} className="text-inksoft" />
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-creamsoft">
                    <Trash2 size={15} className="text-inksoft" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {brands.length === 0 && <div className="p-4 text-sm text-inksoft">No hay marcas todavía.</div>}
      </div>
    </AdminLayout>
  );
}
