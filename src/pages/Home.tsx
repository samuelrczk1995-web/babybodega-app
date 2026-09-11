import { useNavigate } from "react-router-dom";
import { LayoutGrid, MessageCircle, Tag } from "lucide-react";
import { PublicLayout } from "../components/layout/PublicLayout";
import { ProductGrid } from "../components/products/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useSettings } from "../hooks/useSettings";
import { CATEGORY_ICONS } from "../components/products/categoryIcons";

export default function Home() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { whatsappNumber } = useSettings();
  const { products: featured } = useProducts({ featured: true, onlyAvailable: true });
  const { products: onSale } = useProducts({ onSale: true, onlyAvailable: true });

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="px-5 md:px-10 pt-10 md:pt-16 pb-10 grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl md:text-5xl leading-tight mb-4 font-heading font-semibold text-ink">
            Las mejores marcas para el cuidado de tu bebé en un solo lugar.
          </h1>
          <p className="text-base mb-6 text-inksoft max-w-md">
            Compra segura a precios de bodega, elige tu producto y envíalo por WhatsApp.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/productos")}
              className="px-6 py-3 rounded-full text-sm font-semibold bg-ink text-cream"
            >
              Ver catálogo
            </button>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full text-sm font-semibold border border-ink text-ink"
              >
                Escribir por WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="px-5 md:px-10 pb-10 max-w-6xl mx-auto">
        <h2 className="text-xl mb-4 font-heading font-semibold text-ink">Categorías</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => navigate("/productos")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 bg-white border border-line text-ink"
          >
            <LayoutGrid size={16} />
            Todos
          </button>
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] || LayoutGrid;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/categoria/${cat.slug}`)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 bg-white border border-line text-ink"
              >
                <Icon size={16} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* DESTACADOS */}
      {featured.length > 0 && (
        <section className="px-5 md:px-10 pb-10 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-ink">Destacados</h2>
            <button onClick={() => navigate("/destacados")} className="text-sm font-medium text-sagedark">
              Ver todos
            </button>
          </div>
          <ProductGrid products={featured.slice(0, 4)} />
        </section>
      )}

      {/* OFERTAS */}
      {onSale.length > 0 && (
        <section className="px-5 md:px-10 pb-10 max-w-6xl mx-auto">
          <div className="rounded-3xl p-5 md:p-8 bg-blush">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-amberdark" />
                <h2 className="text-xl font-heading font-semibold text-ink">Ofertas</h2>
              </div>
              <button onClick={() => navigate("/ofertas")} className="text-sm font-medium text-amberdark">
                Ver todas
              </button>
            </div>
            <ProductGrid products={onSale.slice(0, 4)} />
          </div>
        </section>
      )}

      {/* MARCAS */}
      <section className="px-5 md:px-10 py-12 bg-creamsoft">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl mb-6 font-heading font-semibold text-ink">Marcas que trabajamos</h2>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            <span className="text-2xl md:text-3xl font-heading font-bold text-ink">Bebesit</span>
            <span className="text-2xl md:text-3xl font-heading font-bold text-amberdark">Joie</span>
            <span className="text-2xl md:text-3xl font-heading font-bold text-sagedark">Infanti</span>
          </div>
        </div>
      </section>

      {whatsappNumber === "" && (
        <div className="px-5 md:px-10 py-3 text-center text-xs text-inksoft bg-blush">
          <MessageCircle size={12} className="inline mr-1" />
          El número de WhatsApp aún no está configurado. Ve a Admin → Configuración para agregarlo.
        </div>
      )}
    </PublicLayout>
  );
}
