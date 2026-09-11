import type { Product } from "../../types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, emptyMessage }: { products: Product[]; emptyMessage?: string }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-inksoft">
        {emptyMessage || "No encontramos productos con ese criterio."}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
