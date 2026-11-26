import { PublicLayout } from "../components/layout/PublicLayout";
import { ProductGrid } from "../components/products/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import { useSiteTheme } from "../hooks/useSiteTheme";

export default function Featured() {
  const { products, loading } = useProducts({ featured: true });
  const { isBlackFriday } = useSiteTheme();
  return (
    <PublicLayout>
      <section className="px-5 md:px-10 py-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-heading font-semibold text-ink mb-6">
          {isBlackFriday ? "Black Friday" : "Destacados"}
        </h1>
        {loading ? (
          <div className="text-center py-16 text-inksoft">{isBlackFriday ? "Cargando productos de Black Friday..." : "Cargando destacados..."}</div>
        ) : (
          <ProductGrid products={products} emptyMessage={isBlackFriday ? "Aún no hay productos de Black Friday." : "Aún no hay productos destacados."} />
        )}
      </section>
    </PublicLayout>
  );
}
