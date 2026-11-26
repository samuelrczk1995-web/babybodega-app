import { useEffect, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloatButton } from "./WhatsAppFloatButton";
import { usePageView } from "../../hooks/usePageView";
import { useSiteTheme } from "../../hooks/useSiteTheme";

export function PublicLayout({ children }: { children: ReactNode }) {
  usePageView();
  const { isBlackFriday } = useSiteTheme();

  // Pinta también el fondo detrás de la página (rebote al hacer scroll en móvil).
  useEffect(() => {
    if (!isBlackFriday) return;
    const previous = document.documentElement.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#050A0B";
    return () => {
      document.documentElement.style.backgroundColor = previous;
    };
  }, [isBlackFriday]);

  return (
    <div
      data-theme={isBlackFriday ? "blackfriday" : undefined}
      className="min-h-screen bg-cream text-ink flex flex-col"
    >
      {isBlackFriday && (
        <div className="bf-bar">Black Friday · Hasta 70% de descuento · Compra por WhatsApp</div>
      )}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
}
