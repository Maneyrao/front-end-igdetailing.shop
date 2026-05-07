import { Link } from 'react-router';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BANK_TRANSFER, buildWhatsAppUrl, STORE_ADDRESS, STORE_EMAIL } from '../../lib/business';
import { BrandLogo } from './BrandLogo';

export const Footer = () => {
  const whatsAppUrl = buildWhatsAppUrl('Hola! Quiero consultar por productos de detailing.');

  return (
    <footer className="mt-auto border-t border-cyan-300/10 bg-[#050607]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <BrandLogo variant="footer" />
            <p className="text-gray-400 text-sm">
              Productos, kits y accesorios para cuidar el auto con criterio técnico y compra simple.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Comprar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/wash" className="text-gray-400 hover:text-white text-sm transition">
                  Lavado
                </Link>
              </li>
              <li>
                <Link to="/category/interior" className="text-gray-400 hover:text-white text-sm transition">
                  Interior
                </Link>
              </li>
              <li>
                <Link to="/category/protection" className="text-gray-400 hover:text-white text-sm transition">
                  Protección
                </Link>
              </li>
              <li>
                <Link to="/category/kits" className="text-gray-400 hover:text-[#0EA5E9] text-sm transition">
                  Kits completos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Compra</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">Envío gratis desde $50.000</li>
              <li className="text-gray-400 text-sm">Pago manual: {BANK_TRANSFER.alias}</li>
              <li className="text-gray-400 text-sm">Stock visible en tienda</li>
              <li className="text-gray-400 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Soporte por WhatsApp
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={`mailto:${STORE_EMAIL}`} className="text-gray-400 hover:text-white transition" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">{STORE_EMAIL}</p>
            <p className="mt-3 flex items-start gap-2 text-gray-400 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#38BDF8]" />
              {STORE_ADDRESS}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 IG Detail Shop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
