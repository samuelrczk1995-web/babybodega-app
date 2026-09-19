import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloatButton } from "./WhatsAppFloatButton";
import { usePageView } from "../../hooks/usePageView";

export function PublicLayout({ children }: { children: ReactNode }) {
  usePageView();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
}
