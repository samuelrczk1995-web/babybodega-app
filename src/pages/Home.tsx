import { useNavigate } from "react-router-dom";
import { LayoutGrid, MessageCircle, Tag } from "lucide-react";
import { PublicLayout } from "../components/layout/PublicLayout";
import { ProductGrid } from "../components/products/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useSettings } from "../hooks/useSettings";
import { CATEGORY_ICONS } from "../components/products/categoryIcons";
import { trackEvent } from "../lib/analytics";
import { useSiteTheme } from "../hooks/useSiteTheme";

// Cantidad de productos que se muestran en cada sección de la portada antes de "Ver todos".
const HOME_PRODUCTS_LIMIT = 8;

export default function Home() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { whatsappNumber } = useSettings();
  const { isBlackFriday } = useSiteTheme();
  const { products: featured } = useProducts({ featured: true, onlyAvailable: true });
  const { products: onSale } = useProducts({ onSale: true, onlyAvailable: true });

  return (
    <PublicLayout>
      {/* HERO */}
      {isBlackFriday ? (
        <section className="bf-hero px-5 md:px-10 py-12 md:py-20 mb-8">
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
            <div className="bf-stack">
              <span className="bf-black">Black</span>
              <span className="bf-friday">Friday</span>
            </div>
            <p className="mt-8 mb-3 text-xl md:text-2xl font-heading font-semibold text-white">Ya llegó a</p>
            <div className="bf-pill">
              Baby <span>Bodega</span>
            </div>
            <p className="mt-8 font-display uppercase text-white bf-glow text-3xl md:text-6xl leading-tight">
              Hasta <span className="text-sagedark">70%</span> de descuento
            </p>
            <p className="mt-3 mb-8 text-base text-white/80 max-w-md">
              Aprovecha los mejores precios en coches, sillas de auto, sillas de comer y bicicletas.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => navigate("/ofertas")}
                className="px-7 py-3 rounded-full text-sm font-semibold bg-amber text-onamber"
              >
                Ver ofertas
              </button>
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { pagePath: "home_hero" })}
                  className="px-7 py-3 rounded-full text-sm font-semibold border border-sage text-sagedark"
                >
                  Escribir por WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      ) : (
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
                  onClick={() => trackEvent("whatsapp_click", { pagePath: "home_hero" })}
                  className="px-6 py-3 rounded-full text-sm font-semibold border border-ink text-ink"
                >
                  Escribir por WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      )}

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
                onClick={() => {
                  trackEvent("category_click", { categorySlug: cat.slug, pagePath: "home" });
                  navigate(`/categoria/${cat.slug}`);
                }}
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
          <ProductGrid products={featured.slice(0, HOME_PRODUCTS_LIMIT)} />
        </section>
      )}

      {/* OFERTAS */}
      {onSale.length > 0 && (
        <section className="px-5 md:px-10 pb-10 max-w-6xl mx-auto">
          <div className="rounded-3xl p-5 md:p-8 bg-blush">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-amberdark" />
                <h2 className="text-xl font-heading font-semibold text-ink">
                  {isBlackFriday ? "Ofertas Black Friday" : "Ofertas"}
                </h2>
              </div>
              <button onClick={() => navigate("/ofertas")} className="text-sm font-medium text-amberdark">
                Ver todas
              </button>
            </div>
            <ProductGrid products={onSale.slice(0, HOME_PRODUCTS_LIMIT)} />
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
