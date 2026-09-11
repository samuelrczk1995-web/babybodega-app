import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, LayoutGrid } from "lucide-react";
import { PublicLayout } from "../components/layout/PublicLayout";
import { ProductGrid } from "../components/products/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { CATEGORY_ICONS } from "../components/products/categoryIcons";

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const categorySlug = params.get("categoria") || undefined;
  const { categories } = useCategories();
  const { products, loading } = useProducts({ categorySlug, search });

  return (
    <PublicLayout>
      <section className="px-5 md:px-10 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h1 className="text-2xl font-heading font-semibold text-ink">Todos los productos</h1>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-line">
            <Search size={16} className="text-inksoft" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="text-sm outline-none bg-transparent text-ink w-40"
            />
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
          <button
            onClick={() => setParams((p) => { p.delete("categoria"); return p; })}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 border border-line ${
              !categorySlug ? "bg-ink text-cream" : "bg-white text-ink"
            }`}
          >
            <LayoutGrid size={16} />
            Todos
          </button>
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] || LayoutGrid;
            const active = categorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setParams((p) => { p.set("categoria", cat.slug); return p; })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 border border-line ${
                  active ? "bg-ink text-cream" : "bg-white text-ink"
                }`}
              >
                <Icon size={16} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-16 text-inksoft">Cargando productos...</div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </PublicLayout>
  );
}
