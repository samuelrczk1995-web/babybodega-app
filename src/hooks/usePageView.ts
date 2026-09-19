import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "../lib/analytics";

// Registra una "vista de página" cada vez que cambia la ruta.
// Se usa una sola vez, dentro de PublicLayout, para cubrir todas las páginas públicas.
export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    trackEvent("page_view", { pagePath: location.pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
}
