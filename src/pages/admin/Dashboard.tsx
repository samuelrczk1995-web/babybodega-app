import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Tag, Star, XCircle } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
  const [counts, setCounts] = useState({ total: 0, onSale: 0, featured: 0, unavailable: 0 });

  useEffect(() => {
    async function load() {
      const [total, onSale, featured, unavailable] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("is_on_sale", true),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("is_featured", true),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("is_available", false),
      ]);
      setCounts({
        total: total.count || 0,
        onSale: onSale.count || 0,
        featured: featured.count || 0,
        unavailable: unavailable.count || 0,
      });
    }
    load();
  }, []);

  const cards = [
    { label: "Productos totales", value: counts.total, icon: Package, color: "text-ink" },
    { label: "En oferta", value: counts.onSale, icon: Tag, color: "text-amberdark" },
    { label: "Destacados", value: counts.featured, icon: Star, color: "text-sagedark" },
    { label: "No disponibles", value: counts.unavailable, icon: XCircle, color: "text-inksoft" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-semibold text-ink mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-line p-5">
            <c.icon size={20} className={c.color} />
            <div className="text-2xl font-bold text-ink mt-2">{c.value}</div>
            <div className="text-xs text-inksoft">{c.label}</div>
          </div>
        ))}
      </div>
      <Link
        to="/admin/productos/nuevo"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold bg-ink text-cream"
      >
        + Crear nuevo producto
      </Link>
    </AdminLayout>
  );
}
