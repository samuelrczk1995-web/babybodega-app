import { useEffect, useState } from "react";
import { Eye, MessageCircle, Tags, TrendingUp } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

type RangeOption = "7" | "30" | "all";

function rangeStartDate(range: RangeOption): string | null {
  if (range === "all") return null;
  const days = parseInt(range, 10);
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

interface CountRow {
  slug: string;
  count: number;
}

interface ProductCountRow {
  product_id: string;
  name: string;
  count: number;
}

export default function Statistics() {
  const [range, setRange] = useState<RangeOption>("30");
  const [loading, setLoading] = useState(true);

  const [pageViews, setPageViews] = useState(0);
  const [whatsappClicks, setWhatsappClicks] = useState(0);
  const [categoryClicks, setCategoryClicks] = useState(0);
  const [categoryRanking, setCategoryRanking] = useState<CountRow[]>([]);
  const [topProducts, setTopProducts] = useState<ProductCountRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const since = rangeStartDate(range);

      const applyRange = (q: any) => (since ? q.gte("created_at", since) : q);

      const [pv, wa, cc] = await Promise.all([
        applyRange(supabase.from("analytics_events").select("*", { count: "exact", head: true }).eq("event_type", "page_view")),
        applyRange(supabase.from("analytics_events").select("*", { count: "exact", head: true }).eq("event_type", "whatsapp_click")),
        applyRange(supabase.from("analytics_events").select("*", { count: "exact", head: true }).eq("event_type", "category_click")),
      ]);

      // Ranking de categorías: traemos las filas y agrupamos en el navegador.
      let catQuery = supabase.from("analytics_events").select("category_slug").eq("event_type", "category_click");
      catQuery = since ? catQuery.gte("created_at", since) : catQuery;
      const { data: catRows } = await catQuery;

      const catCounts = new Map<string, number>();
      (catRows || []).forEach((r: any) => {
        if (!r.category_slug) return;
        catCounts.set(r.category_slug, (catCounts.get(r.category_slug) || 0) + 1);
      });

      const { data: categories } = await supabase.from("categories").select("slug, name");
      const nameBySlug = new Map((categories || []).map((c: any) => [c.slug, c.name]));

      const ranking = Array.from(catCounts.entries())
        .map(([slug, count]) => ({ slug: nameBySlug.get(slug) || slug, count }))
        .sort((a, b) => b.count - a.count);

      // Productos más consultados por WhatsApp.
      let prodQuery = supabase.from("analytics_events").select("product_id").eq("event_type", "whatsapp_click");
      prodQuery = since ? prodQuery.gte("created_at", since) : prodQuery;
      const { data: prodRows } = await prodQuery;

      const prodCounts = new Map<string, number>();
      (prodRows || []).forEach((r: any) => {
        if (!r.product_id) return;
        prodCounts.set(r.product_id, (prodCounts.get(r.product_id) || 0) + 1);
      });

      const productIds = Array.from(prodCounts.keys());
      let productNameById = new Map<string, string>();
      if (productIds.length > 0) {
        const { data: products } = await supabase.from("products").select("id, name").in("id", productIds);
        productNameById = new Map((products || []).map((p: any) => [p.id, p.name]));
      }

      const productRanking = Array.from(prodCounts.entries())
        .map(([id, count]) => ({ product_id: id, name: productNameById.get(id) || "(producto eliminado)", count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      if (cancelled) return;
      setPageViews(pv.count || 0);
      setWhatsappClicks(wa.count || 0);
      setCategoryClicks(cc.count || 0);
      setCategoryRanking(ranking);
      setTopProducts(productRanking);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [range]);

  const maxCategoryCount = Math.max(1, ...categoryRanking.map((c) => c.count));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-heading font-semibold text-ink">Estadísticas</h1>
        <div className="flex gap-2">
          {(["7", "30", "all"] as RangeOption[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setRange(opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border border-line ${
                range === opt ? "bg-ink text-cream" : "bg-white text-inksoft"
              }`}
            >
              {opt === "7" ? "Últimos 7 días" : opt === "30" ? "Últimos 30 días" : "Todo"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-inksoft">Cargando estadísticas...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-line p-5">
              <Eye size={20} className="text-ink" />
              <div className="text-2xl font-bold text-ink mt-2">{pageViews}</div>
              <div className="text-xs text-inksoft">Visitas a la página</div>
            </div>
            <div className="bg-white rounded-2xl border border-line p-5">
              <MessageCircle size={20} className="text-whatsappdark" />
              <div className="text-2xl font-bold text-ink mt-2">{whatsappClicks}</div>
              <div className="text-xs text-inksoft">Clics en "Comprar por WhatsApp"</div>
            </div>
            <div className="bg-white rounded-2xl border border-line p-5">
              <Tags size={20} className="text-amberdark" />
              <div className="text-2xl font-bold text-ink mt-2">{categoryClicks}</div>
              <div className="text-xs text-inksoft">Clics en categorías</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-line p-5">
              <h2 className="text-base font-heading font-semibold text-ink mb-4 flex items-center gap-2">
                <TrendingUp size={16} />
                Categorías más visitadas
              </h2>
              {categoryRanking.length === 0 ? (
                <p className="text-sm text-inksoft">Aún no hay clics registrados en este período.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {categoryRanking.map((c) => (
                    <div key={c.slug}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-ink">{c.slug}</span>
                        <span className="text-inksoft">{c.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-creamsoft overflow-hidden">
                        <div
                          className="h-full bg-sage rounded-full"
                          style={{ width: `${(c.count / maxCategoryCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-line p-5">
              <h2 className="text-base font-heading font-semibold text-ink mb-4 flex items-center gap-2">
                <MessageCircle size={16} />
                Productos con más clics a WhatsApp
              </h2>
              {topProducts.length === 0 ? (
                <p className="text-sm text-inksoft">Aún no hay clics registrados en este período.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {topProducts.map((p, i) => (
                    <div key={p.product_id} className="flex items-center justify-between text-sm">
                      <span className="text-ink">
                        {i + 1}. {p.name}
                      </span>
                      <span className="text-inksoft">{p.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
