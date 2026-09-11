import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import type { Product } from "../../types";
import { money } from "../../lib/whatsapp";

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*, brand:brands(*), category:categories(*), product_images(*)")
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-semibold text-ink">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-ink text-cream"
        >
          <Plus size={16} />
          Nuevo producto
        </Link>
      </div>

      {loading ? (
        <div className="text-inksoft text-sm">Cargando...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-line overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-inksoft border-b border-line">
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Marca</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-inksoft">{p.brand?.name}</td>
                  <td className="px-4 py-3 text-inksoft">{p.category?.name}</td>
                  <td className="px-4 py-3 text-ink">
                    {p.is_on_sale && p.discount_price ? (
                      <>
                        <span className="line-through text-inksoft mr-1">{money(p.normal_price)}</span>
                        <span className="text-amberdark font-semibold">{money(p.discount_price)}</span>
                      </>
                    ) : (
                      money(p.normal_price)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {p.is_available ? (
                        <CheckCircle2 size={14} className="text-sagedark" />
                      ) : (
                        <XCircle size={14} className="text-inksoft" />
                      )}
                      {p.is_featured && <span className="text-xs text-ink">★</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/productos/${p.id}/editar`} className="p-1.5 rounded-lg hover:bg-creamsoft">
                        <Pencil size={15} className="text-inksoft" />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-creamsoft">
                        <Trash2 size={15} className="text-inksoft" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <div className="p-8 text-center text-inksoft text-sm">Aún no hay productos.</div>}
        </div>
      )}
    </AdminLayout>
  );
}
