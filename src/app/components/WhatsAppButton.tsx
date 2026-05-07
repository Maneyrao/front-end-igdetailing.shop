import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../../lib/business';

export const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    window.open(
      buildWhatsAppUrl('Hola! Quiero consultar por productos de detailing.'),
      '_blank'
    );
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-950/40 transition-all hover:scale-105 hover:bg-[#20BD5A]"
      aria-label="Consultar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};
