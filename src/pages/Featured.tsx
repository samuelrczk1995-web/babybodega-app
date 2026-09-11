import { PublicLayout } from "../components/layout/PublicLayout";
import { ProductGrid } from "../components/products/ProductGrid";
import { useProducts } from "../hooks/useProducts";

export default function Featured() {
  const { products, loading } = useProducts({ featured: true });
  return (
    <PublicLayout>
      <section className="px-5 md:px-10 py-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-heading font-semibold text-ink mb-6">Destacados</h1>
        {loading ? (
          <div className="text-center py-16 text-inksoft">Cargando destacados...</div>
        ) : (
          <ProductGrid products={products} emptyMessage="Aún no hay productos destacados." />
        )}
      </section>
    </PublicLayout>
  );
}
