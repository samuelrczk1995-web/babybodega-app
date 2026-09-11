import { MessageCircle } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

export function Footer() {
  const { whatsappNumber } = useSettings();
  return (
    <footer className="px-5 md:px-10 py-8 border-t border-line">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-inksoft">
        <span>© {new Date().getFullYear()} Baby Bodega · Envíos a toda Bolivia</span>
        {whatsappNumber && (
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-whatsappdark">
            <MessageCircle size={16} />
            Escríbenos por WhatsApp
          </a>
        )}
      </div>
    </footer>
  );
}
