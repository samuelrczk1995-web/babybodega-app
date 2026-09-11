import { useParams } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout";
import { ProductGrid } from "../components/products/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories } = useCategories();
  const { products, loading } = useProducts({ categorySlug: slug });
  const category = categories.find((c) => c.slug === slug);

  return (
    <PublicLayout>
      <section className="px-5 md:px-10 py-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-heading font-semibold text-ink mb-6">
          {category?.name || "Categoría"}
        </h1>
        {loading ? (
          <div className="text-center py-16 text-inksoft">Cargando productos...</div>
        ) : (
          <ProductGrid products={products} emptyMessage="Aún no hay productos en esta categoría." />
        )}
      </section>
    </PublicLayout>
  );
}
