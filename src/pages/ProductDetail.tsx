import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MessageCircle, ArrowLeft } from "lucide-react";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Badge } from "../components/products/Badge";
import { ProductPhoto } from "../components/products/ProductPhoto";
import { useProduct } from "../hooks/useProducts";
import { useSettings } from "../hooks/useSettings";
import { money, discountPct, buildWhatsAppLink } from "../lib/whatsapp";

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const { whatsappNumber } = useSettings();
  const [imgIndex, setImgIndex] = useState(0);

  if (loading) {
    return (
      <PublicLayout>
        <div className="text-center py-24 text-inksoft">Cargando producto...</div>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="text-center py-24 text-inksoft">Producto no encontrado.</div>
      </PublicLayout>
    );
  }

  const pct = discountPct(product);
  const images = product.product_images || [];
  const currentImage = images[imgIndex];

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-6">
        <Link to="/productos" className="inline-flex items-center gap-1 text-sm text-inksoft mb-4">
          <ArrowLeft size={16} />
          Volver al catálogo
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden border border-line">
          <div className="relative">
            {currentImage ? (
              <img src={currentImage.image_url} alt={product.name} className="w-full h-64 md:h-80 object-cover" />
            ) : (
              <ProductPhoto product={product} className="w-full h-64 md:h-80" />
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cream/90"
                >
                  <ChevronLeft size={18} className="text-ink" />
                </button>
                <button
                  onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cream/90"
                >
                  <ChevronRight size={18} className="text-ink" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? "bg-ink" : "bg-ink/30"}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-2 text-xs text-inksoft">
              <span className="font-semibold">{product.brand?.name}</span>
              <span>·</span>
              <span>{product.category?.name}</span>
            </div>
            <h1 className="text-2xl mb-3 font-heading font-semibold text-ink">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              {product.is_on_sale && <Badge tone="amber">-{pct}% de descuento</Badge>}
              {product.is_featured && <Badge tone="ink">Destacado</Badge>}
              <Badge tone={product.is_available ? "sage" : "ink"}>
                {product.is_available ? "Disponible" : "No disponible"}
              </Badge>
            </div>

            <p className="text-sm leading-relaxed mb-5 text-inksoft whitespace-pre-line">{product.description}</p>

            <div className="flex items-baseline gap-3 mb-5">
              {product.is_on_sale && product.discount_price ? (
                <>
                  <span className="text-base line-through text-inksoft">{money(product.normal_price)}</span>
                  <span className="text-2xl font-bold text-amberdark">{money(product.discount_price)}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-ink">{money(product.normal_price)}</span>
              )}
            </div>

            <a
              href={product.is_available && whatsappNumber ? buildWhatsAppLink(whatsappNumber, product) : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!product.is_available || !whatsappNumber) e.preventDefault();
              }}
              className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-base font-semibold ${
                product.is_available && whatsappNumber ? "bg-whatsapp text-white" : "bg-creamsoft text-inksoft cursor-not-allowed"
              }`}
            >
              <MessageCircle size={18} />
              {product.is_available ? "Comprar por WhatsApp" : "Consultar disponibilidad"}
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
