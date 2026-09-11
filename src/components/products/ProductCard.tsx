import { Link } from "react-router-dom";
import { MessageCircle, CheckCircle2, XCircle } from "lucide-react";
import type { Product } from "../../types";
import { money, discountPct, effectivePrice, buildWhatsAppLink } from "../../lib/whatsapp";
import { Badge } from "./Badge";
import { ProductPhoto } from "./ProductPhoto";
import { useSettings } from "../../hooks/useSettings";

export function ProductCard({ product }: { product: Product }) {
  const { whatsappNumber } = useSettings();
  const pct = discountPct(product);

  return (
    <div className="flex flex-col overflow-hidden bg-white rounded-card border border-line shadow-[0_4px_16px_rgba(33,31,28,0.06)]">
      <Link to={`/productos/${product.id}`}>
        <div className="relative">
          <ProductPhoto product={product} className="w-full h-44" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_on_sale && <Badge tone="amber">-{pct}%</Badge>}
            {product.is_featured && <Badge tone="ink">Destacado</Badge>}
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs font-semibold mb-1 text-inksoft">{product.brand?.name}</div>
          <h3 className="text-base leading-snug mb-2 font-heading font-semibold text-ink">{product.name}</h3>
          <div className="flex items-baseline gap-2 mb-2">
            {product.is_on_sale && product.discount_price ? (
              <>
                <span className="text-sm line-through text-inksoft">{money(product.normal_price)}</span>
                <span className="text-lg font-bold text-amberdark">{money(product.discount_price)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-ink">{money(product.normal_price)}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs mb-3">
            {product.is_available ? (
              <>
                <CheckCircle2 size={14} className="text-sagedark" />
                <span className="text-sagedark">Disponible</span>
              </>
            ) : (
              <>
                <XCircle size={14} className="text-inksoft" />
                <span className="text-inksoft">No disponible</span>
              </>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <a
          href={product.is_available && whatsappNumber ? buildWhatsAppLink(whatsappNumber, product) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!product.is_available || !whatsappNumber) e.preventDefault();
          }}
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold ${
            product.is_available && whatsappNumber
              ? "bg-whatsapp text-white cursor-pointer"
              : "bg-creamsoft text-inksoft cursor-not-allowed"
          }`}
        >
          <MessageCircle size={16} />
          {product.is_available ? "Comprar por WhatsApp" : "Consultar disponibilidad"}
        </a>
      </div>
    </div>
  );
}
