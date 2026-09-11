import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { ProductForm } from "../../components/admin/ProductForm";
import { supabase } from "../../lib/supabaseClient";
import type { Product } from "../../types";

export default function ProductEdit() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!id) return;
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*, brand:brands(*), category:categories(*), product_images(*)")
      .eq("id", id)
      .single();
    setProduct(data as Product);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-semibold text-ink mb-6">Editar producto</h1>
      {loading ? (
        <div className="text-inksoft text-sm">Cargando...</div>
      ) : product ? (
        <ProductForm product={product} onSaved={load} />
      ) : (
        <div className="text-inksoft text-sm">Producto no encontrado.</div>
      )}
    </AdminLayout>
  );
}
