import { LayoutGrid } from "lucide-react";
import type { Product } from "../../types";
import { CATEGORY_ICONS } from "./categoryIcons";

export function ProductPhoto({ product, className = "" }: { product: Product; className?: string }) {
  const image = product.product_images?.[0];
  const Icon = CATEGORY_ICONS[product.category?.slug || ""] || LayoutGrid;

  if (image) {
    return (
      <div className={`relative overflow-hidden bg-creamsoft ${className}`}>
        <img src={image.image_url} alt={product.name} className="w-full h-full object-contain" />
        {!product.is_available && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream/60">
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-ink text-cream">No disponible</span>
          </div>
        )}
      </div>
    );
  }

  const seedHue = (product.id?.charCodeAt(0) || 40) * 7;
  return (
    <div
      className={`flex items-center justify-center relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, hsl(${seedHue}, 35%, 88%), #EFDFCB)` }}
    >
      <Icon size={56} strokeWidth={1.3} className="text-inksoft" />
      {!product.is_available && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream/60">
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-ink text-cream">No disponible</span>
        </div>
      )}
    </div>
  );
}
