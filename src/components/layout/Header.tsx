import { Link, useNavigate } from "react-router-dom";
import { Baby, MessageCircle } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

export function Header() {
  const { whatsappNumber } = useSettings();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-5 md:px-10 py-4 bg-cream/90 backdrop-blur border-b border-line">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-ink">
          <Baby size={18} className="text-cream" />
        </div>
        <span className="text-lg font-heading font-bold text-ink">
          Baby <span className="text-sagedark font-medium">Bodega</span>
        </span>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-inksoft">
        <button onClick={() => navigate("/productos")} className="hover:text-ink">
          Productos
        </button>
        <button onClick={() => navigate("/ofertas")} className="hover:text-ink">
          Ofertas
        </button>
        <button onClick={() => navigate("/destacados")} className="hover:text-ink">
          Destacados
        </button>
      </nav>
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-whatsapp text-white"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
      )}
    </header>
  );
}
