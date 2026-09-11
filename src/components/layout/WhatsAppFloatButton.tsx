import { MessageCircle } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

export function WhatsAppFloatButton() {
  const { whatsappNumber } = useSettings();
  if (!whatsappNumber) return null;
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="md:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center bg-whatsapp shadow-[0_8px_20px_rgba(37,211,102,0.4)]"
    >
      <MessageCircle size={24} className="text-white" />
    </a>
  );
}
