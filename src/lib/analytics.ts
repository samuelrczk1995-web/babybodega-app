import { supabase } from "./supabaseClient";

export type AnalyticsEventType = "page_view" | "category_click" | "whatsapp_click";

interface TrackOptions {
  categorySlug?: string;
  productId?: string;
  pagePath?: string;
}

// Registra un evento de analítica. Es "fire and forget": si falla (por ejemplo,
// sin conexión) no interrumpe la experiencia del usuario ni muestra errores.
export async function trackEvent(eventType: AnalyticsEventType, options: TrackOptions = {}) {
  try {
    await supabase.from("analytics_events").insert({
      event_type: eventType,
      category_slug: options.categorySlug || null,
      product_id: options.productId || null,
      page_path: options.pagePath || window.location.pathname,
    });
  } catch {
    // Silencioso a propósito: la analítica nunca debe romper la navegación.
  }
}
